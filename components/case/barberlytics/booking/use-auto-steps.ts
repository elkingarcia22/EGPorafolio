'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'

interface AutoStepsOptions {
  /** Pausa antes del primer paso (ms) */
  intro: number
  /** Tiempo entre pasos (ms) */
  step: number
  /** Margen del observador: cuánto debe entrar la pieza antes de arrancar */
  rootMargin?: string
}

/**
 * Una visualización que se arma sola y rápido al entrar en pantalla: avanza de
 * 0 a `last`, un paso tras otro, solo mientras se ve. Con movimiento reducido
 * aparece completa de una vez.
 */
export function useAutoSteps<T extends Element>(last: number, { intro, step, rootMargin = '0px 0px -30% 0px' }: AutoStepsOptions) {
  const { reducedMotion } = useA11y()
  const ref = useRef<T>(null)
  const [current, setCurrent] = useState(reducedMotion ? last : 0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion) setCurrent(last)
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [reducedMotion, last, rootMargin])

  useEffect(() => {
    if (!inView || reducedMotion || current >= last) return
    const id = window.setTimeout(() => setCurrent((s) => Math.min(last, s + 1)), current === 0 ? intro : step)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, current, last, intro, step])

  return { ref, step: current, inView, done: current >= last, reducedMotion }
}

/** Pasa solo de un elemento al siguiente cada `ms` mientras se ve y nadie lo detuvo. */
export function useCycle(count: number, ms: number, running: boolean) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!running || count < 2) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), ms)
    return () => window.clearTimeout(id)
  }, [running, count, ms, index])
  return [index, setIndex] as const
}
