import { useState } from 'react'
import { Play } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import SmartImage, { MediaPlaceholder } from './SmartImage.jsx'
import VideoPlayerModal from './VideoPlayerModal.jsx'
import { classifyVideoUrl } from '../lib/videoUtils.js'

export default function Showreel() {
  const { content } = useContent()
  const showreel = content?.showreel ?? {}
  const [open, setOpen] = useState(false)

  // Local video first, external URL second, nothing third.
  const source = showreel.video
    ? { kind: 'file', src: showreel.video }
    : showreel.externalUrl
      ? { kind: classifyVideoUrl(showreel.externalUrl), url: showreel.externalUrl }
      : null

  return (
    <section id="showreel" className="scroll-mt-20 border-y border-white/5 bg-ink-900/40 py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          overline="Showreel"
          title={
            <>
              Watch the <em className="font-light text-gold-300">Story</em>
            </>
          }
          description={`“${showreel.quote || 'A collection of frames, emotions and stories captured through my lens.'}”`}
        />

        <Reveal className="mt-14" delay={0.1}>
          <div className="group relative">
            <div
              className="relative aspect-video overflow-hidden"
              data-cursor="hover"
              role={source ? 'button' : undefined}
              tabIndex={source ? 0 : -1}
              aria-label={source ? 'Play showreel' : undefined}
              onClick={() => source && setOpen(true)}
              onKeyDown={(e) => {
                if (!source) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setOpen(true)
                }
              }}
            >
              {showreel.poster ? (
                <SmartImage
                  src={showreel.poster}
                  alt="Showreel cover"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-[1.03]"
                  label="Showreel"
                />
              ) : (
                <MediaPlaceholder className="absolute inset-0" label="Showreel poster" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-ink-950/40" />

              <span className="frame-corner tl" aria-hidden="true" />
              <span className="frame-corner tr" aria-hidden="true" />
              <span className="frame-corner bl" aria-hidden="true" />
              <span className="frame-corner br" aria-hidden="true" />

              {source ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/60 text-gold-300 transition-all duration-500 group-hover:scale-110 group-hover:bg-gold-500/10 md:h-24 md:w-24">
                    <span className="absolute inset-0 animate-[ping_3.5s_ease-out_infinite] rounded-full border border-gold-500/30" aria-hidden="true" />
                    <Play className="h-6 w-6 fill-current pl-0.5" strokeWidth={1} />
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.45em] text-cream/85">Play Showreel</span>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full border border-white/15 px-6 py-2.5 text-[10px] uppercase tracking-[0.3em] text-muted">
                    Showreel coming soon
                  </span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {open && source && <VideoPlayerModal source={source} title="Showreel" onClose={() => setOpen(false)} />}
    </section>
  )
}
