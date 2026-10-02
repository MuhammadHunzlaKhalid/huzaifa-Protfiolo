import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import SmartImage from './SmartImage.jsx'
import { cn } from '../lib/utils.js'

function FeaturedCard({ project, index }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const even = index % 2 === 1

  return (
    <div
      ref={ref}
      className="grid items-center gap-8 border-t border-white/5 py-16 first:border-t-0 first:pt-2 md:py-20 lg:grid-cols-12 lg:gap-14"
    >
      <Link
        to={`/project/${project.id}`}
        className={cn('group relative block lg:col-span-7', even && 'lg:order-2')}
        aria-label={`View project: ${project.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
          <motion.div style={reduce ? undefined : { y }} className="absolute -inset-y-[7%] inset-x-0">
            <SmartImage
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
              label={project.title}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.3em] text-cream/75">
            {project.category}
            {project.year ? ` — ${project.year}` : ''}
          </span>
          {project.hasVideo && (
            <span className="absolute bottom-5 right-5 rounded-full bg-ink-950/60 px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] text-cream backdrop-blur-sm">
              Film
            </span>
          )}
        </div>
      </Link>

      <div className={cn('lg:col-span-5', even && 'lg:order-1')}>
        <Reveal>
          <span className="font-display text-6xl italic leading-none text-white/10 md:text-7xl" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-4 font-display text-3xl leading-tight text-cream md:text-5xl">
            <Link to={`/project/${project.id}`} className="transition-colors duration-300 hover:text-gold-300">
              {project.title}
            </Link>
          </h3>
          {project.location && (
            <p className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted">
              <MapPin className="h-3.5 w-3.5 text-gold-500/70" strokeWidth={1.5} />
              {project.location}
              {project.year ? ` — ${project.year}` : ''}
            </p>
          )}
          <p className="mt-5 max-w-md text-sm leading-[1.9] text-muted md:text-[15px]">{project.description}</p>
          <Link
            to={`/project/${project.id}`}
            className="link-underline mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold-400 transition-colors hover:text-gold-300"
          >
            View Project
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </div>
  )
}

export default function FeaturedProjects() {
  const { content } = useContent()
  const featured = content?.featured ?? []
  if (!featured.length) return null

  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          overline="Featured Projects"
          title={
            <>
              The <em className="font-light text-gold-300">signature</em> stories
            </>
          }
          description="Longer bodies of work — multi-day weddings, full editorials and brand films, each with their own gallery and film."
        />
        <div className="mt-16">
          {featured.map((project, i) => (
            <FeaturedCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
