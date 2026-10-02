import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext.jsx'
import SectionHeading from './SectionHeading.jsx'
import ProjectCard from './ProjectCard.jsx'
import { cn } from '../lib/utils.js'

export default function SelectedWork() {
  const { content } = useContent()
  const projects = content?.projects ?? []
  const categories = content?.categories ?? ['All']
  const [active, setActive] = useState('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.categories.includes(active) || p.category === active)),
    [active, projects],
  )

  return (
    <section id="work" className="scroll-mt-20 py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          overline="Selected Work"
          title={
            <>
              Stories <em className="font-light text-gold-300">worth</em> telling
            </>
          }
          description="A curated selection of photography and film — weddings, editorials, brands, journeys and the moments in between. Click any project to explore it in full."
        />

        <div className="no-scrollbar mt-12 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible" role="tablist" aria-label="Filter projects by category">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300',
                active === cat
                  ? 'border-gold-500/70 bg-gold-500/10 text-gold-300'
                  : 'border-white/10 text-muted hover:border-white/25 hover:text-cream',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <motion.div
            key={active}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        ) : (
          <p className="mt-16 border border-dashed border-white/10 p-12 text-center text-sm text-muted">
            No projects in this category yet — add one in portfolio.json.
          </p>
        )}
      </div>
    </section>
  )
}
