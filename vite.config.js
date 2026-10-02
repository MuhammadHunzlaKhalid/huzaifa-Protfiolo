import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Media manifest plugin — the backbone of the "drop a file in, it just works" system.
 *
 * In dev: serves `/content/media-manifest.json` with a LIVE scan of public/images
 * and public/videos, so any file you drop into those folders is instantly
 * discoverable by the automatic file-matching logic (no restart needed).
 *
 * In build: emits the same manifest into dist/ so production works identically.
 */
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'])
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogv'])

function scanMediaDir(publicDir) {
  const images = []
  const videos = []
  for (const kind of ['images', 'videos']) {
    const root = path.join(publicDir, kind)
    if (!fs.existsSync(root)) continue
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walk(full)
          continue
        }
        const ext = path.extname(entry.name).toLowerCase()
        const rel = path.relative(publicDir, full).split(path.sep).join('/')
        if (kind === 'images' && IMAGE_EXTS.has(ext)) images.push(rel)
        else if (kind === 'videos' && VIDEO_EXTS.has(ext)) videos.push(rel)
      }
    }
    walk(root)
  }
  return { images, videos }
}

function mediaManifest() {
  let resolvedPublicDir = null
  let isBuild = false
  return {
    name: 'media-manifest',
    configResolved(config) {
      resolvedPublicDir = config.publicDir || path.join(config.root, 'public')
      isBuild = config.command === 'build'
    },
    configureServer(server) {
      server.middlewares.use('/content/media-manifest.json', (_req, res) => {
        try {
          const publicDir = server.config.publicDir || path.join(server.config.root, 'public')
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(scanMediaDir(publicDir)))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
    buildStart() {
      if (!isBuild) return
      const publicDir = resolvedPublicDir || path.join(process.cwd(), 'public')
      const outFile = path.join(publicDir, 'content', 'media-manifest.json')
      // Never overwrite a manifest the owner may have generated themselves.
      if (!fs.existsSync(outFile)) {
        this.emitFile({
          type: 'asset',
          fileName: 'content/media-manifest.json',
          source: JSON.stringify(scanMediaDir(publicDir)),
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mediaManifest()],
})
