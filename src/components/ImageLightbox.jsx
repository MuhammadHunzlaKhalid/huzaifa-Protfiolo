import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { startScroll, stopScroll } from '../lib/scroll.js'

/** Fullscreen image viewer with keyboard navigation (← → ESC). */
export default function ImageLightbox({ images, index, title, onClose, onNavigate }) {
  const total = images.length
  const current = images[index]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % total)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + total) % total)
    }
    window.addEventListener('keydown', onKey)
    stopScroll()
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      startScroll()
      document.body.style.overflow = ''
    }
  }, [index, total, onClose, onNavigate])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col bg-ink-950/[0.985]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image gallery`}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
        <span className="font-display text-lg italic text-cream/80">{title}</span>
        <div className="flex items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted">
            {index + 1} / {total}
          </span>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream transition-colors hover:border-gold-500/60 hover:text-gold-300"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-20" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={current}
          src={current}
          alt={`${title} — image ${index + 1} of ${total}`}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          className="max-h-[76vh] max-w-full object-contain"
        />
        {total > 1 && (
          <>
            <button
              onClick={() => onNavigate((index - 1 + total) % total)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-950/60 text-cream backdrop-blur-sm transition-colors hover:border-gold-500/60 hover:text-gold-300 md:left-6"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => onNavigate((index + 1) % total)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-950/60 text-cream backdrop-blur-sm transition-colors hover:border-gold-500/60 hover:text-gold-300 md:right-6"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      <div className="px-5 pb-5 text-center text-[10px] uppercase tracking-[0.35em] text-muted md:pb-7">
        ESC to close — arrow keys to navigate
      </div>
    </motion.div>,
    document.body,
  )
}
