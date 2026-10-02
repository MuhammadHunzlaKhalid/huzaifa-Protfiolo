import { Aperture, Briefcase, Camera, Clapperboard, Film, Globe, Heart, Image as ImageIcon, Megaphone, ShoppingBag, Sparkles, Video } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'

const ICONS = {
  Camera,
  Aperture,
  Video,
  Film,
  Clapperboard,
  Briefcase,
  ShoppingBag,
  Megaphone,
  Sparkles,
  Heart,
  Globe,
  Image: ImageIcon,
}

export default function Services() {
  const { content } = useContent()
  const services = content?.services ?? []
  if (!services.length) return null

  return (
    <section id="services" className="scroll-mt-20 border-y border-white/5 bg-ink-900/40 py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          overline="What I Do"
          title="Services"
          description="Every project is tailored — from a two-hour portrait session to a full multi-day wedding production. Ask about packages and availability."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Aperture
            return (
              <Reveal key={service.title} delay={(i % 4) * 0.07} className="h-full">
                <div className="group relative h-full border border-white/5 bg-ink-950/60 p-7 transition-colors duration-500 hover:border-gold-500/30 hover:bg-ink-900">
                  <span className="absolute right-6 top-5 font-display text-sm italic text-white/15">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 transition-colors duration-500 group-hover:border-gold-500/60 group-hover:text-gold-300">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.25} />
                  </span>
                  <h3 className="mt-6 font-display text-xl text-cream">{service.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.8] text-muted">{service.description}</p>
                  <span className="mt-6 block h-px w-8 bg-gold-500/40 transition-all duration-500 group-hover:w-full group-hover:bg-gold-500/60" />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
