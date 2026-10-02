import { Quote } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'

/** Testimonial cards render purely from public/content/portfolio.json. */
export default function Testimonials() {
  const { content } = useContent()
  const testimonials = content?.testimonials ?? []
  if (!testimonials.length) return null

  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          overline="Kind Words"
          title={
            <>
              Clients &amp; <em className="font-light text-gold-300">collaborators</em>
            </>
          }
          description="A few notes from the people whose stories I've had the privilege of telling."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={(i % 4) * 0.08} className="h-full">
              <figure className="flex h-full flex-col border border-white/5 bg-ink-950/60 p-7 transition-colors duration-500 hover:border-white/10">
                <Quote className="h-5 w-5 text-gold-500/70" strokeWidth={1.25} aria-hidden="true" />
                <blockquote className="mt-5 flex-1 font-display text-[17px] italic leading-[1.75] text-cream/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-7 border-t border-white/5 pt-5">
                  <div className="text-sm text-cream">{t.name}</div>
                  {t.role && <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted">{t.role}</div>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
