'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'

/** Todo lo marcado con data-reveal dentro de `root` entra al aparecer en pantalla. */
export function useReveal(root: React.RefObject<HTMLElement | null>, reducedMotion: boolean): void {
  useEffect(() => {
    const el = root.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, overwrite: true }),
      })
    }, el)
    return () => ctx.revert()
  }, [root, reducedMotion])
}
