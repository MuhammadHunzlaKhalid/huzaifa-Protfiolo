import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ContentProvider } from './context/ContentContext.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import GrainOverlay from './components/GrainOverlay.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import NotFound from './pages/NotFound.jsx'
import { initLenis, scrollTop } from './lib/scroll.js'

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    scrollTop(true)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    initLenis()
  }, [])

  return (
    <ContentProvider>
      <BrowserRouter>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CustomCursor />
        <Navbar />
        <main id="main">
          <AnimatedRoutes />
        </main>
        <Footer />
        <GrainOverlay />
      </BrowserRouter>
    </ContentProvider>
  )
}
