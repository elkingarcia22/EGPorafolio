'use client'

import { useEffect, useState } from 'react'

/**
 * Avanza `step` de 0 a `total - 1` cada `ms` mientras `active` sea verdadero.
 * Con `loop`, vuelve a 0 al terminar; sin él, se queda en el último paso.
 */
export function useLoop(total: number, ms: number, active: boolean, loop = true): [number, (n: number) => void] {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => {
      setStep((s) => (s + 1 < total ? s + 1 : loop ? 0 : s))
    }, ms)
    return () => window.clearInterval(id)
  }, [total, ms, active, loop])
  return [step, setStep]
}

/** Cuenta de 0 a `to` en `ms` cuando `run` se vuelve verdadero. */
export function useCountUp(to: number, run: boolean, ms = 1600): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      setValue(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, run, ms])
  return value
}

/** Formato de dólares con separador de miles en español o inglés. */
export function usd(n: number, locale: string): string {
  return `US$${Math.round(n).toLocaleString(locale === 'en' ? 'en-US' : 'es-CO')}`
}
