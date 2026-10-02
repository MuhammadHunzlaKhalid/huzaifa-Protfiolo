import { motion, useReducedMotion } from 'framer-motion'

/** Scroll-reveal wrapper — fades + rises content once as it enters the viewport. */
export default function Reveal({ children, delay = 0, y = 28, className = '', once = true }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
