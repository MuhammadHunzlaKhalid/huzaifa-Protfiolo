import { useEffect, useRef, useState } from 'react'

/** Dot + trailing ring cursor for fine pointers only; never on touch or reduced motion. */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { ...pos }
    let hovering = false
    let visible = false
    let raf

    const onMove = (e) => {
      visible = true
      pos.x = e.clientX
      pos.y = e.clientY
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }
    const onLeave = () => {
      visible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }
    const onOver = (e) => {
      hovering = Boolean(e.target.closest('a, button, [data-cursor="hover"], input, textarea, select, [role="button"]'))
    }
    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16
      ring.y += (pos.y - ring.y) * 0.16
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${hovering ? 0.5 : 1})`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.7 : 1})`
        ringRef.current.style.borderColor = hovering ? 'rgba(201,169,106,0.9)' : 'rgba(242,237,228,0.5)'
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver)
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null
  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[500] h-1.5 w-1.5 rounded-full bg-cream opacity-0 mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[500] h-9 w-9 rounded-full border opacity-0 transition-[border-color] duration-300 mix-blend-difference"
        style={{ borderColor: 'rgba(242,237,228,0.5)' }}
      />
    </>
  )
}
