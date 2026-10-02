/**
 * Generates elegant cinematic SVG placeholder images for every path referenced
 * by the default portfolio.json, plus README notes in the media folders.
 *
 * Run with:  npm run placeholders
 * Safe to re-run — it only (re)writes the placeholder files listed below and
 * never touches any other file in public/images or public/videos.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

const TINTS = {
  hero: '#171310',
  showreel: '#141310',
  portraits: '#181310',
  weddings: '#1a1310',
  events: '#101820',
  fashion: '#161020',
  commercial: '#191208',
  products: '#111811',
  travel: '#0f1713',
  photography: '#151515',
  videography: '#101418',
}

// [relative path, width, height, tag, big mark]
const FILES = [
  ['images/hero/hero.svg', 2000, 1200, 'Cinematic Portfolio', 'H'],
  ['images/showreel/showreel-poster.svg', 1600, 900, 'Showreel', 'S'],
  ['images/portraits/about-portrait.svg', 900, 1150, 'The Artist', 'H'],

  ['images/weddings/wedding-001.svg', 1200, 1500, 'Weddings', '01'],
  ['images/weddings/wedding-001-2.svg', 1200, 800, 'Weddings', '02'],
  ['images/weddings/wedding-001-3.svg', 1100, 1100, 'Weddings', '03'],
  ['images/weddings/wedding-002.svg', 1300, 900, 'Weddings', '01'],
  ['images/weddings/wedding-002-2.svg', 1000, 1250, 'Weddings', '02'],

  ['images/events/event-001.svg', 1300, 900, 'Events', '01'],
  ['images/events/event-001-2.svg', 1000, 1250, 'Events', '02'],
  ['images/events/event-002.svg', 1300, 860, 'Events', '01'],
  ['images/events/csv-sample-001.svg', 1200, 800, 'CSV Example', '01'],

  ['images/portraits/portrait-001.svg', 1000, 1250, 'Portraits', '01'],
  ['images/portraits/portrait-001-2.svg', 1000, 1250, 'Portraits', '02'],
  ['images/portraits/portrait-001-3.svg', 1100, 1100, 'Portraits', '03'],
  ['images/portraits/portrait-002.svg', 1000, 1250, 'Portraits', '01'],

  ['images/fashion/fashion-001.svg', 1000, 1250, 'Fashion', '01'],
  ['images/fashion/fashion-001-2.svg', 1300, 900, 'Fashion', '02'],
  ['images/fashion/fashion-002.svg', 1300, 900, 'Fashion', '01'],
  ['images/fashion/fashion-002-2.svg', 1000, 1250, 'Fashion', '02'],

  ['images/commercial/commercial-001.svg', 1600, 900, 'Commercial', '01'],
  ['images/commercial/commercial-001-2.svg', 1300, 900, 'Commercial', '02'],

  ['images/products/product-001.svg', 1100, 1100, 'Product', '01'],
  ['images/products/product-001-2.svg', 1100, 1100, 'Product', '02'],

  ['images/travel/travel-001.svg', 1400, 900, 'Travel', '01'],
  ['images/travel/travel-001-2.svg', 1000, 1250, 'Travel', '02'],

  ['images/photography/photography-001.svg', 1300, 900, 'Photography', '01'],
  ['images/photography/photography-001-2.svg', 1000, 1250, 'Photography', '02'],

  ['images/videography/videography-001.svg', 1400, 900, 'Videography', '01'],
]

const VIDEO_FOLDERS = ['showreel', 'weddings', 'events', 'fashion', 'commercial']

function svgFor(w, h, tag, big, tint) {
  const cx = w / 2
  const cy = h / 2
  const m = Math.min(w, h)
  const blades = [0, 60, 120, 180, 240, 300]
    .map((a) => {
      const rad = (a * Math.PI) / 180
      const r1 = m * 0.115
      const r2 = m * 0.16
      return `<line x1="${(cx + r1 * Math.cos(rad)).toFixed(1)}" y1="${(cy + r1 * Math.sin(rad)).toFixed(1)}" x2="${(cx + r2 * Math.cos(rad)).toFixed(1)}" y2="${(cy + r2 * Math.sin(rad)).toFixed(1)}" stroke-width="0.75" stroke-opacity="0.35"/>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#101014"/>
      <stop offset="0.55" stop-color="${tint}"/>
      <stop offset="1" stop-color="#0a0a0c"/>
    </linearGradient>
    <radialGradient id="v" cx="0.5" cy="0.42" r="0.78">
      <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <g fill="none" stroke="#c9a96a">
    <circle cx="${cx}" cy="${cy}" r="${(m * 0.16).toFixed(1)}" stroke-width="1" stroke-opacity="0.5"/>
    <circle cx="${cx}" cy="${cy}" r="${(m * 0.115).toFixed(1)}" stroke-width="0.75" stroke-opacity="0.35"/>
    ${blades}
  </g>
  <rect x="${(m * 0.045).toFixed(1)}" y="${(m * 0.045).toFixed(1)}" width="${(w - m * 0.09).toFixed(1)}" height="${(h - m * 0.09).toFixed(1)}" fill="none" stroke="#c9a96a" stroke-opacity="0.16" stroke-width="1"/>
  <text x="${cx}" y="${(cy - m * 0.2).toFixed(1)}" text-anchor="middle" fill="#c9a96a" fill-opacity="0.85" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${(m * 0.055).toFixed(1)}">${big}</text>
  <text x="${cx}" y="${(cy + m * 0.25).toFixed(1)}" text-anchor="middle" fill="#f2ede4" fill-opacity="0.5" font-family="Arial, Helvetica, sans-serif" font-size="${(m * 0.026).toFixed(1)}" letter-spacing="${(m * 0.012).toFixed(1)}">${tag.toUpperCase()}</text>
  <text x="${cx}" y="${(h - m * 0.075).toFixed(1)}" text-anchor="middle" fill="#f2ede4" fill-opacity="0.22" font-family="Arial, Helvetica, sans-serif" font-size="${(m * 0.019).toFixed(1)}" letter-spacing="2">placeholder — replace with your own photo</text>
</svg>
`
}

let count = 0
for (const [rel, w, h, tag, big] of FILES) {
  const folder = rel.split('/')[1]
  const target = path.join(publicDir, rel)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, svgFor(w, h, tag, big, TINTS[folder] || '#141414'))
  console.log('  created', rel)
  count++
}

for (const folder of VIDEO_FOLDERS) {
  const dir = path.join(publicDir, 'videos', folder)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    path.join(dir, 'README.txt'),
    'Drop .mp4 / .webm files in this folder.\nA file named <project-id>.mp4 (e.g. wedding-001.mp4) is attached to that project automatically.\nSee CONTENT_GUIDE.md for details.\n'
  )
}

console.log(`\nDone — ${count} placeholder images generated.`)
