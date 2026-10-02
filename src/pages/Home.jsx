import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext.jsx'
import Loader from '../components/Loader.jsx'
import Hero from '../components/Hero.jsx'
import SelectedWork from '../components/SelectedWork.jsx'
import Showreel from '../components/Showreel.jsx'
import FeaturedProjects from '../components/FeaturedProjects.jsx'
import About from '../components/About.jsx'
import Services from '../components/Services.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  const { status } = useContent()

  if (status === 'loading') return <Loader label="Loading portfolio" />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.5 }}>
      <Hero />
      <SelectedWork />
      <Showreel />
      <FeaturedProjects />
      <About />
      <Services />
      <Testimonials />
      <Contact />
    </motion.div>
  )
}
