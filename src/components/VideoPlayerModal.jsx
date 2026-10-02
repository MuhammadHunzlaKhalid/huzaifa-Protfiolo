import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { toEmbedUrl } from '../lib/videoUtils.js'
import { startScroll, stopScroll } from '../lib/scroll.js'

/**
 * Fullscreen video player.
 * source: { kind: 'file', src, poster? } | { kind: 'youtube'|'vimeo', url }
 * Local files open muted-with-controls (never sound-autoplayed); embeds load
 * only at this moment, never on page load.
 */
export default function VideoPlayerModal({ source, title = 'Video', onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    stopScroll()
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      startScroll()
      document.body.style.overflow = ''
    }
  }, [onClose])

  const embedUrl = source.kind && source.kind !== 'file' ? toEmbedUrl(source.url, { autoplay: true }) : null

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-md md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        onClick={onClose}
        aria-label="Close video player"
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream transition-colors hover:border-gold-500/60 hover:text-gold-300"
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <motion.div
        className="w-full max-w-6xl"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {source.kind === 'file' ? (
            <video
              key={source.src}
              src={source.src}
              poster={source.poster || undefined}
              controls
              autoPlay
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={title}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
              Video unavailable
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-4">
          <span className="font-display text-lg italic text-cream/80">{title}</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted">ESC to close</span>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
