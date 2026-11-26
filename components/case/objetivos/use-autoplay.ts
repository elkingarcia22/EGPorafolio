'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSwipe } from '@/components/case/kit/use-swipe'

/** Si la persona elige un paso, la animación espera esto antes de seguir sola (ms) */
const RESUME_AFTER_MS = 9000
/** La animación arranca cuando la pieza ya está bien adentro de la pantalla */
const IN_VIEW_MARGIN = '0px 0px -30% 0px'

interface AutoplayOptions {
  count: number
  ms: number
  /** Al llegar al último paso vuelve a empezar (si no, se queda en el último) */
  loop?: boolean
  disabled?: boolean
  /** Mientras sea true no avanza (p. ej. con el cursor encima) */
  hold?: boolean
}

/**
 * Avance automático de una pieza animada: empieza al entrar en pantalla y pasa
 * de un paso al siguiente cada `ms`. `go(i)` lleva a un paso y pausa un momento.
 * Deslizar el dedo de lado también pasa de paso.
 */
export function useAutoplay(ref: React.RefObject<HTMLElement | null>, { count, ms, loop = false, disabled = false, hold = false }: AutoplayOptions) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pausedUntil, setPausedUntil] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setPlaying(true)
        observer.disconnect()
      },
      { rootMargin: IN_VIEW_MARGIN },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, disabled])

  useEffect(() => {
    if (!playing || disabled || pausedUntil || hold) return
    if (!loop && index >= count - 1) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), ms)
    return () => window.clearTimeout(id)
  }, [playing, disabled, pausedUntil, hold, loop, index, count, ms])

  useEffect(() => {
    if (!pausedUntil) return
    const id = window.setTimeout(() => setPausedUntil(0), Math.max(0, pausedUntil - Date.now()))
    return () => window.clearTimeout(id)
  }, [pausedUntil])

  const go = useCallback((i: number) => {
    setIndex(i)
    setPlaying(true)
    setPausedUntil(Date.now() + RESUME_AFTER_MS)
  }, [])

  // En el teléfono también se pasa de paso deslizando el dedo de lado.
  useSwipe(ref, {
    onNext: () => go(loop ? (index + 1) % count : Math.min(count - 1, index + 1)),
    onPrev: () => go(loop ? (index - 1 + count) % count : Math.max(0, index - 1)),
    disabled: count < 2,
  })

  return { index, go, playing }
}
