import { useEffect, useState } from 'react'
import { Aperture } from 'lucide-react'
import { cn } from '../lib/utils.js'

/** Elegant in-component fallback so a missing photo never breaks the layout. */
export function MediaPlaceholder({ label, className = '', style }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950',
        className,
      )}
      style={style}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <Aperture className="h-8 w-8 text-gold-500/40" strokeWidth={1} />
        <span className="text-[10px] uppercase tracking-[0.3em] text-cream/30">{label || 'Image coming soon'}</span>
      </div>
    </div>
  )
}

/**
 * Lazy image with shimmer placeholder, fade-in on load and graceful fallback.
 * `ratio` (e.g. "3/4") reserves space to avoid layout shift.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
  imgClassName = 'h-full w-full object-cover',
  eager = false,
  label,
  ratio,
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')
  useEffect(() => {
    setStatus(src ? 'loading' : 'error')
  }, [src])

  const style = ratio ? { aspectRatio: ratio } : undefined

  if (!src || status === 'error') {
    return <MediaPlaceholder label={label ?? alt} className={className} style={style} />
  }

  return (
    <div className={cn('relative overflow-hidden bg-ink-900', className)} style={style}>
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800" />
      )}
      <img
        src={src}
        alt={alt ?? ''}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setStatus('ok')}
        onError={() => setStatus('error')}
        className={cn(imgClassName, 'transition-opacity duration-700', status === 'ok' ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  )
}
