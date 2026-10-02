import { useRef } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '../lib/utils.js'

/** Button that gently follows the cursor on desktop; a plain button everywhere else. */
export default function MagneticButton({ children, className = '', strength = 0.3, onClick, type = 'button', ariaLabel }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 180, damping: 16, mass: 0.4 })
  const y = useSpring(0, { stiffness: 180, damping: 16, mass: 0.4 })

  const handleMove = (e) => {
    if (reduce || !ref.current || !window.matchMedia('(pointer: fine)').matches) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn('select-none', className)}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}
