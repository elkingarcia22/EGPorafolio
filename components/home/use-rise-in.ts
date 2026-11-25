'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/motion'

/** Distancia (px) desde la que sube el texto */
const RISE_PX = 26
const RISE_S = 1.1

/**
 * El texto entra limpio la primera vez que aparece en pantalla: sube un poco
 * y pasa de desenfocado a nítido (de ruido a señal), sin cambiar sus letras.
 */
export function useRiseIn(
  ref: React.RefObject<HTMLElement | null>,
  reducedMotion: boolean,
  { start = 'top 85%', delay = 0 }: { start?: string; delay?: number } = {},
): void {
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const tween = gsap.from(el, {
      autoAlpha: 0,
      y: RISE_PX,
      filter: 'blur(8px)',
      duration: RISE_S,
      delay,
      ease: 'expo.out',
      clearProps: 'transform,filter',
      scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.revert()
    }
  }, [ref, reducedMotion, start, delay])
}
