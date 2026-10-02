import Reveal from './Reveal.jsx'
import { cn } from '../lib/utils.js'

export default function SectionHeading({ overline, title, description, align = 'left', className = '' }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <Reveal>
        <div className="flex flex-col gap-5">
          {overline && <span className="overline">{overline}</span>}
          <h2 className="font-display text-4xl leading-[1.05] font-light text-cream sm:text-5xl md:text-6xl">
            {title}
          </h2>
        </div>
      </Reveal>
      {description && (
        <Reveal delay={0.15} className="max-w-md">
          <p className="text-sm leading-[1.9] text-muted md:pb-2">{description}</p>
        </Reveal>
      )}
    </div>
  )
}
