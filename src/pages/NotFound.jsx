import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <motion.section
      className="flex min-h-[72vh] flex-col items-center justify-center px-6 pt-24 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <span className="overline">404</span>
      <h1 className="mt-5 font-display text-4xl font-light text-cream md:text-6xl">This frame doesn't exist</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        The page you're looking for has moved or never existed.
      </p>
      <button onClick={() => navigate('/')} className="btn-primary mt-10">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Home
      </button>
    </motion.section>
  )
}
