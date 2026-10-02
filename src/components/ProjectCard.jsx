import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import SmartImage from './SmartImage.jsx'

const RATIOS = ['3/4', '4/3', '1/1', '3/4', '4/5', '2/3', '3/4', '4/3', '1/1', '3/4', '4/5', '2/3']

export default function ProjectCard({ project, index = 0 }) {
  const reduce = useReducedMotion()
  const videoRef = useRef(null)
  // Desktop-only muted hover preview from the project's first local video.
  const previewVideo =
    !reduce && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches && project.videos?.[0]
      ? project.videos[0]
      : null
  const ratio = RATIOS[index % RATIOS.length]

  const onEnter = () => {
    videoRef.current?.play().catch(() => {})
  }
  const onLeave = () => {
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
  }

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="mb-6 break-inside-avoid"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link to={`/project/${project.id}`} className="group block" aria-label={`View project: ${project.title}`}>
        <div className="relative overflow-hidden bg-ink-900" style={{ aspectRatio: ratio }}>
          <SmartImage
            src={project.coverImage}
            alt={project.title}
            className="absolute inset-0 h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
            label={project.title}
          />
          {previewVideo && (
            <video
              ref={videoRef}
              src={previewVideo}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/5 to-ink-950/10" />

          {project.hasVideo && (
            <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-ink-950/60 px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] text-cream backdrop-blur-sm">
              <Play className="h-2.5 w-2.5 fill-current" strokeWidth={0} />
              Film
            </span>
          )}
          <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
