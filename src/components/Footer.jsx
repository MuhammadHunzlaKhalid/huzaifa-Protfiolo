import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowUp, Instagram, Mail, MessageCircle, Youtube } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import { scrollToSection, scrollTop } from '../lib/scroll.js'
import { whatsappLink } from '../lib/utils.js'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'showreel', label: 'Showreel' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

export default function Footer() {
  const { content } = useContent()
  const site = content?.site ?? {}
  const social = content?.social ?? {}
  const location = useLocation()
  const navigate = useNavigate()

  const goTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToSection(id), 140)
    } else {
      scrollToSection(id)
    }
  }

  const socials = [
    social.instagram && { href: social.instagram, label: 'Instagram', Icon: Instagram },
    social.youtube && { href: social.youtube, label: 'YouTube', Icon: Youtube },
    social.whatsapp && { href: whatsappLink(social.whatsapp), label: 'WhatsApp', Icon: MessageCircle },
    social.email && { href: `mailto:${social.email}`, label: 'Email', Icon: Mail },
  ].filter(Boolean)

  return (
    <footer className="border-t border-white/5">
      <div className="container-x flex flex-col gap-12 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-display text-2xl text-cream">
            {site.name || 'Studio'}
            <span className="text-gold-500">.</span>
          </span>
          <p className="mt-3 max-w-xs text-xs leading-[1.9] text-muted">
            {site.role}
            {site.location ? ` — capturing stories in ${site.location} & beyond.` : '.'}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="link-underline text-[11px] uppercase tracking-[0.25em] text-cream/60 transition-colors hover:text-cream"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={label}
              className="text-muted transition-colors hover:text-gold-300"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </a>
          ))}
          <button
            onClick={() => scrollTop(false)}
            aria-label="Back to top"
            className="ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-cream/70 transition-colors hover:border-gold-500/50 hover:text-gold-300"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-white/5 py-7 text-[11px] text-muted md:flex-row md:items-center md:justify-between">
        <span>
          © {new Date().getFullYear()} {site.name || 'Studio'}. All rights reserved.
        </span>
        <span className="uppercase tracking-[0.35em]">Photography — Film — Stories</span>
      </div>
    </footer>
  )
}
