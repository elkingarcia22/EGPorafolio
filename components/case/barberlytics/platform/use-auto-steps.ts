'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/** Verdadero mientras el elemento está a la vista (con un margen abajo para que arranque ya visible). */
export function useInView(ref: React.RefObject<Element | null>, rootMargin = '0px 0px -25% 0px'): boolean {
  const [inView, setInView] = useState(false)
  // La pieza puede cambiar de elemento (en teléfono se arma otra composición): se sigue al que esté montado
  const [el, setEl] = useState<Element | null>(null)
  useEffect(() => {
    if (ref.current !== el) setEl(ref.current)
  })
  useEffect(() => {
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [el, rootMargin])
  return inView
}

/**
 * Pasos que avanzan solos y rápido al entrar a la vista, de 0 a `last`, y se
 * quedan ahí. Con movimiento reducido, todo aparece completo de una vez.
 */
export function useAutoSteps(ref: React.RefObject<Element | null>, last: number, stepMs: number, introMs = 350): number {
  const { reducedMotion } = useA11y()
  const inView = useInView(ref)
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!inView || reducedMotion || step >= last) return
    const id = window.setTimeout(() => setStep((s) => Math.min(last, s + 1)), step === 0 ? introMs : stepMs)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step, last, stepMs, introMs])
  return reducedMotion ? last : step
}
