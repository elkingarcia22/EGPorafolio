'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/** Avanza un paso cada `ms` mientras la pieza está en vista y el movimiento está permitido. */
export function useStepper(ms: number, steps: number, paused = false): { step: number; ref: React.RefObject<HTMLDivElement>; set: (n: number) => void; seen: boolean } {
  const { reducedMotion } = useA11y()
  const [step, setStep] = useState(0)
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting) setSeen(true)
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || !inView) return
    const id = window.setTimeout(() => setStep((s) => (s + 1) % steps), ms)
    return () => window.clearTimeout(id)
  }, [step, ms, steps, paused, reducedMotion, inView])

  return { step: reducedMotion && !paused ? steps - 1 : step, ref, set: setStep, seen }
}
