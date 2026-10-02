import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Instagram, Mail, Menu, X, Youtube } from 'lucide-react'
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

export default function Navbar() {
  const { content } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const name = content?.site?.name || 'Studio'
  const social = content?.social ?? {}

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const goTo = (id) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToSection(id), 140)
    } else {
      scrollToSection(id)
    }
  }

  const goHome = () => {
    setOpen(false)
    if (location.pathname !== '/') navigate('/')
    else scrollTop(false)
  }

  const socialLinks = [
    social.instagram && { href: social.instagram, label: 'Instagram', Icon: Instagram },
    social.youtube && { href: social.youtube, label: 'YouTube', Icon: Youtube },
    social.whatsapp && { href: whatsappLink(social.whatsapp), label: 'WhatsApp', Icon: null },
    social.email && { href: `mailto:${social.email}`, label: 'Email', Icon: Mail },
  ].filter(Boolean)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-white/5 bg-ink-950/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Primary">
          <button
            onClick={goHome}
            className="font-display text-xl tracking-wide text-cream transition-colors hover:text-gold-300"
          >
            {name}
            <span className="text-gold-500">.</span>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                className="link-underline text-[11px] uppercase tracking-[0.25em] text-cream/70 transition-colors hover:text-cream"
              >
                {l.label}
              </button>
            ))}
            <span className="h-4 w-px bg-white/15" aria-hidden="true" />
            <button
              onClick={() => goTo('contact')}
              className="text-[11px] uppercase tracking-[0.25em] text-gold-400 transition-colors hover:text-gold-300"
            >
              Book a Session
            </button>
          </div>

          <button className="p-1 text-cream lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-ink-950/[0.985] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="container-x flex h-16 items-center justify-between md:h-20">
              <span className="font-display text-xl text-cream">
                {name}
                <span className="text-gold-500">.</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1 text-cream">
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="container-x flex flex-1 flex-col justify-center" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/5 py-4 text-left font-display text-4xl text-cream transition-colors hover:text-gold-300"
                >
                  <span className="mr-4 align-middle text-xs italic text-gold-500/60">0{i + 1}</span>
                  {l.label}
                </motion.button>
              ))}
            </nav>

            <div className="container-x flex items-center gap-5 pb-10 text-muted">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="transition-colors hover:text-gold-300"
                >
                  {Icon ? <Icon className="h-5 w-5" strokeWidth={1.5} /> : <span className="text-xs uppercase tracking-widest">WA</span>}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
