/**
 * Automatic file matching.
 *
 * The Vite plugin (vite.config.js) publishes a manifest of everything inside
 * public/images and public/videos. When a project doesn't explicitly declare a
 * cover image / gallery / videos, we look for files whose name starts with the
 * project id in the folder that matches the project category:
 *
 *   project id "wedding-001" (category Weddings) can use, automatically:
 *     /videos/weddings/wedding-001.mp4   /videos/weddings/wedding-001.webm
 *     /videos/wedding-001.mp4            (root of videos/)
 *     /images/weddings/wedding-001.jpg   /images/weddings/wedding-001.webp
 *     /images/wedding-001.jpg            (root of images/)
 *
 *   Gallery images additionally match suffixed names: wedding-001-2.jpg,
 *   wedding-001-3.jpg … so adding photos never requires touching JSON.
 */

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg']
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'm4v']

const FOLDER_BY_CATEGORY = {
  weddings: 'weddings',
  wedding: 'weddings',
  events: 'events',
  event: 'events',
  portraits: 'portraits',
  portrait: 'portraits',
  fashion: 'fashion',
  product: 'products',
  products: 'products',
  commercial: 'commercial',
  travel: 'travel',
  photography: 'photography',
  videography: 'videography',
}

const natCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
const natCompare = (a, b) => natCollator.compare(a, b)

const isExternal = (p) => /^https?:\/\//i.test(p)
const normalizeLocal = (p) => (isExternal(p) || p.startsWith('/') ? p : `/${p}`)
const extOf = (p) => p.slice(p.lastIndexOf('.') + 1).toLowerCase()

export async function fetchMediaManifest(base) {
  try {
    const res = await fetch(`${base}content/media-manifest.json`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data.images) || !Array.isArray(data.videos)) return null
    return {
      images: new Set(data.images.map((p) => String(p).toLowerCase())),
      videos: new Set(data.videos.map((p) => String(p).toLowerCase())),
    }
  } catch {
    return null
  }
}

/** Exact match: e.g. findNamed(set, 'videos/weddings', 'wedding-001', VIDEO_EXTS) */
function findNamed(set, dir, id, exts) {
  for (const ext of exts) {
    const p = `${dir}/${id}.${ext}`
    if (set.has(p)) return p
  }
  return null
}

/** All files in `dir` whose base name is `id` or starts with `id-` / `id_`. */
function findAllWithId(set, dir, id, exts) {
  const hits = []
  for (const entry of set) {
    if (!entry.startsWith(`${dir}/`)) continue
    const name = entry.slice(dir.length + 1)
    const base = name.slice(0, name.lastIndexOf('.')) || name
    if (base === id || base.startsWith(`${id}-`) || base.startsWith(`${id}_`)) {
      if (exts.includes(extOf(name))) hits.push(entry)
    }
  }
  // Exact-id file first (wedding-001.jpg before wedding-001-2.jpg); ICU numeric
  // collation alone ranks "-2" before "." and gets this wrong.
  return hits.sort((a, b) => {
    const baseOf = (p) => p.slice(p.lastIndexOf('/') + 1, p.lastIndexOf('.'))
    const exactDiff = Number(baseOf(b) === id) - Number(baseOf(a) === id)
    return exactDiff !== 0 ? exactDiff : natCompare(a, b)
  })
}

function dedupePush(list, path) {
  const p = `/${path}`
  if (!list.includes(p)) list.push(p)
}

export function resolveProjectMedia(project, manifest) {
  const id = project.id
  const folder = FOLDER_BY_CATEGORY[String(project.category || '').toLowerCase()] ?? ''
  const imageDirs = folder ? [`images/${folder}`, 'images'] : ['images']
  const videoDirs = folder ? [`videos/${folder}`, 'videos'] : ['videos']

  let coverImage = project.coverImage ? normalizeLocal(project.coverImage) : ''
  if (!coverImage && manifest) {
    for (const dir of imageDirs) {
      const found = findNamed(manifest.images, dir, id, IMAGE_EXTS)
      if (found) {
        coverImage = `/${found}`
        break
      }
    }
  }

  const images = project.images.map(normalizeLocal)
  const videos = project.videos.map(normalizeLocal)

  if (manifest) {
    for (const dir of imageDirs) {
      for (const file of findAllWithId(manifest.images, dir, id, IMAGE_EXTS)) dedupePush(images, file)
    }
    for (const dir of videoDirs) {
      for (const file of findAllWithId(manifest.videos, dir, id, VIDEO_EXTS)) dedupePush(videos, file)
    }
  }

  return { coverImage, images, videos }
}

export function resolveHeroMedia(hero, manifest) {
  const out = { ...hero }
  out.heroImage = hero.heroImage ? normalizeLocal(hero.heroImage) : ''
  out.heroVideo = hero.heroVideo ? normalizeLocal(hero.heroVideo) : ''
  if (manifest) {
    if (!out.heroImage) {
      const found =
        findNamed(manifest.images, 'images/hero', 'hero', IMAGE_EXTS) ||
        findNamed(manifest.images, 'images', 'hero', IMAGE_EXTS)
      if (found) out.heroImage = `/${found}`
    }
    if (!out.heroVideo) {
      const found =
        findNamed(manifest.videos, 'videos/showreel', 'hero', VIDEO_EXTS) ||
        findNamed(manifest.videos, 'videos', 'hero', VIDEO_EXTS)
      if (found) out.heroVideo = `/${found}`
    }
  }
  return out
}

export function resolveShowreelMedia(showreel, manifest) {
  const out = { ...showreel }
  out.poster = showreel.poster ? normalizeLocal(showreel.poster) : ''
  out.video = showreel.video ? normalizeLocal(showreel.video) : ''
  out.externalUrl = showreel.externalUrl || ''
  if (manifest) {
    if (!out.poster) {
      const found =
        findNamed(manifest.images, 'images/showreel', 'showreel', IMAGE_EXTS) ||
        findNamed(manifest.images, 'images/showreel', 'showreel-poster', IMAGE_EXTS)
      if (found) out.poster = `/${found}`
    }
    if (!out.video) {
      const found =
        findNamed(manifest.videos, 'videos/showreel', 'showreel', VIDEO_EXTS) ||
        findNamed(manifest.videos, 'videos', 'showreel', VIDEO_EXTS)
      if (found) out.video = `/${found}`
    }
  }
  return out
}
