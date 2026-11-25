'use client'

import { useCallback, useEffect, useRef } from 'react'
import { getLenis } from '@/lib/motion'
import type { HeroSnap } from './use-hero-snap'

/** Duración (s) de cada bajada automática */
const TO_BRIDGE_S = 1.4
const TO_SIGNATURE_S = 1.6
/**
 * Espera (ms) desde que empieza a bajar hasta seguir a la firma. Arranca justo
 * cuando el EG termina de armarse, para pasar del puente a la firma sin pausa.
 */
const BRIDGE_HOLD_MS = 3400
/** Si la página ya está más abajo que esto, la persona ya tomó el control */
const ALREADY_SCROLLED_PX = 10

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/** Índices de los puntos de reposo del hero (ver hero.tsx): titular, puente, firma */
const REST = { bridge: 1, signature: 2 } as const

/**
 * Entrada automática, solo la primera vez: después de la carga y el titular,
 * la página baja sola hasta el puente (mientras se arma el EG) y luego hasta
 * la firma. Si la persona usa la rueda, el teclado o toca la pantalla, la
 * entrada se detiene y sigue ella; después todo funciona con scroll normal.
 * Devuelve la función que la inicia (true si arrancó). `onDone` se llama una
 * vez, cuando termina o cuando la persona toma el control.
 */
export function useIntroAutoplay(snap: React.MutableRefObject<HeroSnap>, enabled: boolean, onDone: () => void): () => boolean {
  const timers = useRef<number[]>([])
  const cancelRef = useRef<() => void>(() => {})

  useEffect(() => () => cancelRef.current(), [])

  return useCallback(() => {
    if (!enabled || window.scrollY > ALREADY_SCROLLED_PX) return false

    const goTo = (rest: number, duration: number) => {
      const { trigger, rests } = snap.current
      const lenis = getLenis()
      if (!trigger || !lenis || rests[rest] === undefined) return
      const y = trigger.start + (trigger.end - trigger.start) * rests[rest]
      lenis.scrollTo(y, { duration, easing: easeInOut, force: true })
    }

    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    let finished = false
    const cancel = () => {
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []
      events.forEach((name) => window.removeEventListener(name, cancel))
      if (finished) return
      finished = true
      onDone()
    }
    cancelRef.current = cancel
    events.forEach((name) => window.addEventListener(name, cancel, { passive: true }))

    goTo(REST.bridge, TO_BRIDGE_S)
    timers.current.push(
      window.setTimeout(() => {
        goTo(REST.signature, TO_SIGNATURE_S)
        timers.current.push(window.setTimeout(cancel, TO_SIGNATURE_S * 1000))
      }, BRIDGE_HOLD_MS),
    )
    return true
  }, [snap, enabled, onDone])
}
