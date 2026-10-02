import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext.jsx'
import { cn } from '../lib/utils.js'

export default function Loader({ label = 'Loading', variant = 'fixed' }) {
  const { content } = useContent()
  const name = content?.site?.name || 'H'
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-7',
        variant === 'fixed' ? 'fixed inset-0 z-[400] bg-ink-950' : 'min-h-[70vh] w-full',
      )}
      role="status"
      aria-label={label}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl italic text-cream"
      >
        {name}
        <span className="text-gold-500">.</span>
      </motion.span>
      <div className="h-px w-28 overflow-hidden bg-white/10">
        <motion.div
          className="h-full w-1/2 bg-gold-500"
          initial={{ x: '-120%' }}
          animate={{ x: '260%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span className="text-[10px] uppercase tracking-[0.45em] text-muted">{label}</span>
    </div>
  )
}
