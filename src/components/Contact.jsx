import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Youtube } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import Reveal from './Reveal.jsx'
import { mailtoLink, whatsappLink } from '../lib/utils.js'

export default function Contact() {
  const { content } = useContent()
  const contact = content?.contact ?? {}
  const social = content?.social ?? {}
  const location = contact.location || content?.site?.location

  const channels = [
    social.instagram && { href: social.instagram, label: 'Instagram', handle: social.instagramHandle || 'Instagram', Icon: Instagram },
    social.youtube && { href: social.youtube, label: 'YouTube', handle: social.youtubeLabel || 'Watch the films', Icon: Youtube },
    social.youtube2 && { href: social.youtube2, label: 'YouTube', handle: social.youtube2Label || 'Watch the films', Icon: Youtube },
    social.whatsapp && { href: whatsappLink(social.whatsapp), label: 'WhatsApp', handle: social.whatsapp, Icon: MessageCircle },
    social.email && { href: mailtoLink(social.email), label: 'Email', handle: social.email, Icon: Mail },
  ].filter(Boolean)

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden py-28 md:py-40">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[21vw] leading-none text-white/[0.03]"
      >
        LET'S TALK
      </span>

      <div className="container-x relative flex flex-col items-center text-center">
        <Reveal>
          <span className="overline">Contact</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-light leading-tight text-cream md:text-6xl">
            {contact.heading || 'Have a story worth capturing?'}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 font-display text-3xl italic text-gold-300 md:text-5xl">
            {contact.cta || "Let's Work Together"}
          </p>
        </Reveal>
        {contact.availability && (
          <Reveal delay={0.18}>
            <span className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold-500/25 bg-gold-500/5 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-gold-300/90">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
              {contact.availability}
            </span>
          </Reveal>
        )}

        {channels.length > 0 && (
          <Reveal delay={0.22}>
            <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
              {channels.map(({ href, label, handle, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4 border border-white/8 bg-ink-950/50 px-5 py-4 text-left transition-colors duration-400 hover:border-gold-500/35"
                >
                  <Icon className="h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.25} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-cream">{label}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{handle}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-300" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </Reveal>
        )}

        {location && (
          <Reveal delay={0.28}>
            <p className="mt-12 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-muted">
              <MapPin className="h-4 w-4 text-gold-500/70" strokeWidth={1.5} />
              Based in {location} — available worldwide
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
