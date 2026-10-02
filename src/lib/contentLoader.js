import { parseCSV } from './csv.js'
import { normalizeExternalVideos } from './videoUtils.js'
import { fetchMediaManifest, resolveProjectMedia, resolveHeroMedia, resolveShowreelMedia } from './mediaResolver.js'

const BASE = import.meta.env.BASE_URL || '/'

/**
 * The one and only content pipeline:
 *   1. Load public/content/portfolio.json           (primary source)
 *   2. Merge public/content/portfolio.csv rows      (optional, new ids only)
 *   3. Fetch the media manifest                     (enables auto file matching)
 *   4. Normalize every project + hero + showreel
 */
export async function loadContent() {
  let content
  try {
    const res = await fetch(`${BASE}content/portfolio.json`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`portfolio.json responded with ${res.status}`)
    content = await res.json()
  } catch (error) {
    console.warn(`[content] Could not load portfolio.json (${error.message}) — using minimal fallback.`)
    content = fallbackContent()
  }

  const manifest = await fetchMediaManifest(BASE)
  if (!manifest) {
    console.info('[content] No media manifest available — automatic file matching is limited to paths declared in JSON.')
  }

  // Optional CSV source — appended only for ids JSON doesn't already define.
  try {
    const res = await fetch(`${BASE}content/portfolio.csv`, { cache: 'no-store' })
    if (res.ok) {
      const text = await res.text()
      const rows = text.trim() ? parseCSV(text) : []
      if (rows.length) {
        const existing = new Set((content.projects ?? []).map((p) => String(p.id)))
        const extra = rows.map(csvRowToProject).filter((p) => p && p.id && !existing.has(p.id))
        if (extra.length) {
          content.projects = [...(content.projects ?? []), ...extra]
          console.info(`[content] Merged ${extra.length} project(s) from portfolio.csv`)
        }
      }
    }
  } catch {
    /* CSV is entirely optional */
  }

  content.projects = (content.projects ?? []).map((p) => normalizeProject(p, manifest))

  content.featured = (content.featured ?? [])
    .map((entry) => (typeof entry === 'string' ? { id: entry } : entry))
    .map((entry) => content.projects.find((p) => p.id === entry.id))
    .filter(Boolean)

  content.hero = resolveHeroMedia(content.hero ?? {}, manifest)
  content.showreel = resolveShowreelMedia(content.showreel ?? {}, manifest)
  content.about = content.about ?? {}
  content.services = content.services ?? []
  content.testimonials = content.testimonials ?? []
  content.social = content.social ?? {}
  content.contact = content.contact ?? {}
  content.categories = content.categories?.length ? content.categories : ['All']

  content.site = content.site ?? {}
  content.site.name = content.site.name || content.hero.name || 'Studio'
  content.site.role = content.site.role || content.hero.title || ''
  content.site.location = content.site.location || content.about.location || ''

  return content
}

function csvRowToProject(row) {
  const splitList = (v) => String(v ?? '').split('|').map((s) => s.trim()).filter(Boolean)
  return {
    id: row.id,
    title: row.title || 'Untitled Project',
    category: row.category || '',
    location: row.location || '',
    year: String(row.year ?? ''),
    coverImage: row.coverImage || '',
    images: [],
    videos: splitList(row.video),
    externalVideos: splitList(row.externalVideo).map((url) => ({ url })),
    description: row.description || '',
    services: [],
  }
}

function normalizeProject(raw, manifest) {
  const project = {
    id: slugify(raw.id || raw.title || 'project'),
    title: raw.title || 'Untitled Project',
    category: raw.category || '',
    categories: Array.from(new Set([raw.category, ...(raw.categories ?? [])].filter(Boolean))),
    location: raw.location || '',
    year: String(raw.year ?? ''),
    services: Array.isArray(raw.services) ? raw.services.filter(Boolean) : [],
    description: raw.description || '',
    images: Array.isArray(raw.images) ? raw.images.filter(Boolean) : [],
    videos: Array.isArray(raw.videos) ? raw.videos.filter(Boolean) : [],
    externalVideos: normalizeExternalVideos(raw.externalVideos),
    coverImage: raw.coverImage || '',
  }
  Object.assign(project, resolveProjectMedia(project, manifest))
  project.hasVideo = project.videos.length > 0 || project.externalVideos.length > 0
  project.hasMedia = Boolean(project.coverImage || project.images.length || project.hasVideo)
  project.short =
    project.description.length > 120 ? `${project.description.slice(0, 117).trimEnd()}…` : project.description
  return project
}

function slugify(value) {
  return (
    String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'project'
  )
}

function fallbackContent() {
  return {
    site: { name: 'Studio', role: 'Photographer & Videographer', location: '' },
    hero: {
      name: 'Your Name',
      title: 'Photographer & Videographer',
      tagline: 'Turning Moments Into Stories.',
      heroImage: '',
      heroVideo: '',
      stats: [],
    },
    showreel: {},
    about: {},
    categories: ['All'],
    featured: [],
    services: [],
    testimonials: [],
    social: {},
    contact: {},
    projects: [],
  }
}
