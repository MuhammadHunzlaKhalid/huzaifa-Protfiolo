import { MapPin } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import Reveal from './Reveal.jsx'
import SmartImage from './SmartImage.jsx'

export default function About() {
  const { content } = useContent()
  const about = content?.about ?? {}
  const bio = Array.isArray(about.bio) ? about.bio : about.bio ? [about.bio] : []

  return (
    <section id="about" className="scroll-mt-20 py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="relative m-4 mt-5 h-fit">
              <div className="absolute -left-4 -top-4 h-full w-full border border-gold-500/25" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
                <SmartImage
                  src={about.portrait}
                  alt={`Portrait of ${content?.site?.name || 'the artist'}`}
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                  label="Artist portrait"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/35 via-transparent to-transparent" />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <span className="overline">{about.overline || 'About the Artist'}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-light leading-tight text-cream sm:text-5xl md:text-6xl">
              {about.heading || 'Behind the Camera'}
            </h2>
          </Reveal>
          {bio.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.06}>
              <p className="mt-6 max-w-xl text-sm leading-[1.95] text-muted md:text-[15px]">{paragraph}</p>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            {about.skills?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {about.skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {about.location && (
              <p className="mt-9 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-cream/70">
                <MapPin className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
                Based in {about.location}
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
