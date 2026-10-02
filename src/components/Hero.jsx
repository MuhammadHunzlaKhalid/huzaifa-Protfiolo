import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import SmartImage, { MediaPlaceholder } from './SmartImage.jsx'
import MagneticButton from './MagneticButton.jsx'
import CountUp from './CountUp.jsx'
import { scrollToSection } from '../lib/scroll.js'

function RevealWords({ text }) {
  const words = String(text).split(' ')
  return words.map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: '112%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
      >
        {word}
        {i < words.length - 1 ? '\u00A0' : ''}
      </motion.span>
    </span>
  ))
}

export default function Hero() {
  const { content } = useContent()
  const hero = content?.hero ?? {}
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '34%'])

  const showVideo = Boolean(hero.heroVideo) && !videoFailed && !reduce
  const location = content?.site?.location

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      <motion.div style={reduce ? undefined : { y: mediaY }} className="absolute inset-0">
        {showVideo ? (
          <video
            key={hero.heroVideo}
            className="h-full w-full object-cover"
            src={hero.heroVideo}
            poster={hero.heroImage || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : hero.heroImage ? (
          <SmartImage
            eager
            src={hero.heroImage}
            alt="Cinematic hero"
            className="h-full w-full"
            imgClassName={`h-full w-full object-cover ${reduce ? '' : 'kenburns'}`}
          />
        ) : (
          <MediaPlaceholder className="h-full w-full" label="Hero image" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: contentOpacity, y: contentY }}
        className="container-x relative pb-12 pt-36 md:pb-16"
      >
        <motion.p
          className="overline"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          {hero.title}
          {location ? ` — ${location}` : ''}
        </motion.p>

        <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.4rem,11vw,8.5rem)] font-light leading-[0.95] text-cream">
          {reduce ? hero.name : <RevealWords text={hero.name || ''} />}
        </h1>

        <motion.p
          className="mt-6 font-display text-xl italic text-cream/75 md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 1 }}
        >
          “{hero.tagline}”
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticButton onClick={() => scrollToSection('work')} className="btn-primary">
            View My Work
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </MagneticButton>
          <MagneticButton onClick={() => scrollToSection('contact')} className="btn-outline">
            Book a Session
          </MagneticButton>
        </motion.div>

        {hero.stats?.length > 0 && (
          <motion.div
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
          >
            {hero.stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl text-cream md:text-4xl">
                  <CountUp value={Number(s.value) || 0} suffix={s.suffix ?? ''} />
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <button
        onClick={() => scrollToSection('work')}
        className="absolute bottom-6 right-6 hidden flex-col items-center gap-3 text-muted transition-colors hover:text-cream md:flex"
        aria-label="Scroll to selected work"
      >
        <span className="text-[9px] uppercase tracking-[0.35em] [writing-mode:vertical-rl]">Scroll</span>
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
          <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
        </motion.span>
      </button>
    </section>
  )
}
