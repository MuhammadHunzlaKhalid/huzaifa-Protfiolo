import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, MapPin, Play, Tag } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import Loader from '../components/Loader.jsx'
import Reveal from '../components/Reveal.jsx'
import SmartImage, { MediaPlaceholder } from '../components/SmartImage.jsx'
import ImageLightbox from '../components/ImageLightbox.jsx'
import VideoPlayerModal from '../components/VideoPlayerModal.jsx'
import { scrollToSection } from '../lib/scroll.js'
import { cap, cn } from '../lib/utils.js'

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" strokeWidth={1.5} aria-hidden="true" />}
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-[0.28em] text-muted">{label}</dt>
        <dd className="mt-1.5 text-sm text-cream/90">{children}</dd>
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { status, getProject, content } = useContent()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [lightbox, setLightbox] = useState(null)
  const [video, setVideo] = useState(null)
  const heroRef = useRef(null)

  const project = getProject(id)
  const projects = content?.projects ?? []

  const nextProject = useMemo(() => {
    if (!project || projects.length < 2) return null
    const i = projects.findIndex((p) => p.id === project.id)
    return projects[(i + 1) % projects.length] ?? null
  }, [project, projects])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  const backToWork = () => {
    navigate('/')
    setTimeout(() => scrollToSection('work'), 140)
  }

  if (status === 'loading') return <Loader label="Loading project" />

  if (!project) {
    return (
      <section className="flex min-h-[72vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <span className="overline">404</span>
        <h1 className="mt-5 font-display text-4xl text-cream md:text-6xl">This frame doesn't exist</h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
          The project you're looking for may have been renamed or removed from portfolio.json.
        </p>
        <button onClick={backToWork} className="btn-primary mt-10">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to Work
        </button>
      </section>
    )
  }

  const detailAnim = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <header ref={heroRef} className="relative flex min-h-[68vh] items-end overflow-hidden">
        <motion.div style={reduce ? undefined : { y: heroY }} className="absolute inset-0">
          {project.coverImage ? (
            <SmartImage
              eager
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
              label={project.title}
            />
          ) : (
            <MediaPlaceholder className="h-full w-full" label={project.title} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/45" />
        </motion.div>

        <div className="container-x relative pb-14 pt-36">
          <motion.button {...detailAnim(0.1)} onClick={backToWork} className="mb-9 inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-cream/70 transition-colors hover:text-gold-300">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to Work
          </motion.button>
          <motion.p className="overline" {...detailAnim(0.18)}>
            {project.category}
            {project.location ? ` — ${project.location}` : ''}
          </motion.p>
          <motion.h1 className="mt-4 max-w-4xl font-display text-4xl font-light leading-[1.02] text-cream sm:text-6xl md:text-7xl" {...detailAnim(0.26)}>
            {project.title}
          </motion.h1>
          <motion.div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-[11px] uppercase tracking-[0.25em] text-cream/60" {...detailAnim(0.34)}>
            {project.category && (
              <span className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-gold-500/70" strokeWidth={1.5} />
                {project.category}
              </span>
            )}
            {project.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold-500/70" strokeWidth={1.5} />
                {project.location}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-gold-500/70" strokeWidth={1.5} />
                {project.year}
              </span>
            )}
          </motion.div>
        </div>
      </header>

      <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div className="border border-white/5 bg-ink-900/50 p-7">
                <h2 className="overline">Project Details</h2>
                <dl className="mt-7 space-y-6">
                  {project.category && <DetailRow icon={Tag} label="Category">{project.category}</DetailRow>}
                  {project.location && <DetailRow icon={MapPin} label="Location">{project.location}</DetailRow>}
                  {project.year && <DetailRow icon={Calendar} label="Year">{project.year}</DetailRow>}
                  {project.services.length > 0 && (
                    <div className="flex items-start gap-4 border-t border-white/5 pt-6">
                      <span className="mt-0.5 text-[10px] uppercase tracking-[0.28em] text-muted">Services</span>
                      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                        {project.services.map((s) => (
                          <span key={s} className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-cream/75">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>
            {project.hasVideo && (
              <Reveal delay={0.1}>
                <p className="mt-5 border border-gold-500/20 bg-gold-500/5 px-5 py-4 text-[11px] uppercase tracking-[0.22em] text-gold-300/80">
                  Includes film — scroll to watch
                </p>
              </Reveal>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8">
          {project.description && (
            <Reveal>
              <p className="max-w-2xl font-display text-2xl font-light leading-[1.55] text-cream/90 md:text-[1.7rem]">
                {project.description}
              </p>
            </Reveal>
          )}

          {project.images.length > 0 && (
            <section className="mt-16" aria-label="Photo gallery">
              <Reveal>
                <h2 className="overline">Photography</h2>
              </Reveal>
              <div className="mt-7 columns-1 gap-5 sm:columns-2">
                {project.images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    onClick={() => setLightbox(i)}
                    className="group relative mb-5 block w-full break-inside-avoid overflow-hidden bg-ink-900"
                    aria-label={`Open image ${i + 1} of ${project.images.length} in fullscreen`}
                  >
                    <SmartImage
                      src={img}
                      alt={`${project.title} — photo ${i + 1}`}
                      imgClassName="w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                      label={`Photo ${i + 1}`}
                    />
                    <span className="pointer-events-none absolute inset-0 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/20" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {project.videos.length > 0 && (
            <section className="mt-16" aria-label="Videos">
              <Reveal>
                <h2 className="overline">Film</h2>
              </Reveal>
              <div className="mt-7 space-y-6">
                {project.videos.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setVideo({ kind: 'file', src, poster: project.coverImage || undefined })}
                    className="group relative block w-full overflow-hidden bg-ink-900"
                    aria-label={`Play film ${i + 1}`}
                  >
                    <div className="relative aspect-video">
                      {project.coverImage ? (
                        <SmartImage
                          src={project.coverImage}
                          alt=""
                          className="absolute inset-0 h-full w-full"
                          imgClassName="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <MediaPlaceholder className="absolute inset-0" label="Video poster" />
                      )}
                      <span className="absolute inset-0 bg-ink-950/45 transition-colors duration-500 group-hover:bg-ink-950/25" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/40 text-cream backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-gold-400/70 group-hover:text-gold-300">
                          <Play className="h-5 w-5 fill-current pl-0.5" strokeWidth={1} />
                        </span>
                      </span>
                      <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.3em] text-cream/80">
                        Film {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {project.externalVideos.length > 0 && (
            <section className={cn(project.videos.length > 0 ? 'mt-16' : 'mt-16')} aria-label="External videos">
              <Reveal>
                <h2 className="overline">Also Watch</h2>
              </Reveal>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {project.externalVideos.map((v) => (
                  <button
                    key={v.url}
                    onClick={() => setVideo({ kind: v.type, url: v.url })}
                    className="group flex items-center gap-4 border border-white/5 bg-ink-900/50 p-5 text-left transition-colors duration-400 hover:border-gold-500/30"
                    aria-label={`Play ${v.label} (${v.type})`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-300">
                      <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-cream">
                        {v.label}
                        {v.type !== 'file' ? ` · ${cap(v.type)}` : ''}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted">{v.url}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-gold-300" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {!project.hasMedia && (
            <p className="mt-12 border border-dashed border-white/10 p-10 text-center text-sm text-muted">
              Media for this project is coming soon — add images or videos following CONTENT_GUIDE.md.
            </p>
          )}
        </div>
      </div>

      {nextProject && (
        <Link to={`/project/${nextProject.id}`} className="group block border-t border-white/5" aria-label={`Next project: ${nextProject.title}`}>
          <div className="container-x flex items-center justify-between gap-6 py-14 md:py-20">
            <div className="min-w-0">
              <span className="overline">Next Project</span>
              <h2 className="mt-3 truncate font-display text-3xl font-light text-cream transition-colors duration-300 group-hover:text-gold-300 md:text-5xl">
                {nextProject.title}
              </h2>
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 text-cream transition-all duration-400 group-hover:border-gold-500/60 group-hover:text-gold-300">
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <ImageLightbox
            images={project.images}
            index={lightbox}
            title={project.title}
            onClose={() => setLightbox(null)}
            onNavigate={setLightbox}
          />
        )}
        {video && <VideoPlayerModal source={video} title={project.title} onClose={() => setVideo(null)} />}
      </AnimatePresence>
    </motion.article>
  )
}
