'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, setLenis } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

const REFRESH_DELAY_MS = 300

/** Scroll suave (Lenis) sincronizado con GSAP ScrollTrigger. Se apaga con "reducir movimiento". */
export function SmoothScroll() {
  const { reducedMotion, settings } = useA11y()
  const pathname = usePathname()

  useEffect(() => {
    if (reducedMotion) {
      setLenis(null)
      return
    }
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [reducedMotion])

  // Recalcular posiciones cuando cambia la página, las fuentes o el tamaño del texto.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    const timer = window.setTimeout(refresh, REFRESH_DELAY_MS)
    document.fonts?.ready.then(refresh).catch(() => undefined)
    return () => window.clearTimeout(timer)
  }, [pathname, settings.text])

  return null
}
