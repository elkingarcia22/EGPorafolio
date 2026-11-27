'use client'

import { useEffect } from 'react'
import { getLenis, type ScrollTrigger } from '@/lib/motion'

/** Cuánto esperar sin desplazamiento para considerar que el usuario se detuvo */
const IDLE_MS = 200
/** Tolerancia (0–1 del recorrido) para dar por bueno un punto de reposo */
const REST_TOLERANCE = 0.012
/** Duración del acomodo hasta el paso */
const SETTLE_S = 0.9

export interface HeroSnap {
  trigger: ScrollTrigger | null
  /** Puntos de reposo, 0–1 del recorrido del hero, en orden */
  rests: readonly number[]
}

/** Siguiente punto de reposo en el sentido en que venía el desplazamiento (null si ya está en uno). */
export function nextRest(progress: number, rests: readonly number[], forward: boolean): number | null {
  if (rests.some((r) => Math.abs(r - progress) < REST_TOLERANCE)) return null
  const found = forward ? rests.find((r) => r > progress) : [...rests].reverse().find((r) => r < progress)
  return found ?? null
}

/**
 * Si el desplazamiento se detiene a mitad de un paso del hero, termina el
 * paso: la animación nunca queda congelada entre el titular, el puente y el EG.
 */
export function useHeroSnap(snap: React.MutableRefObject<HeroSnap>, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return
    let lastY = window.scrollY
    let forward = true
    let timer = 0
    /** Dedo apoyado en la pantalla: mientras tanto el scroll es suyo, no se acomoda nada */
    let touching = false

    const settle = () => {
      const { trigger, rests } = snap.current
      const lenis = getLenis()
      // Sin scroll suave, con un visor abierto que lo detiene o con el dedo encima, no se toca nada.
      if (touching || !trigger || !lenis || lenis.isStopped || !trigger.isActive) return
      const target = nextRest(trigger.progress, rests, forward)
      if (target === null) return
      const y = trigger.start + (trigger.end - trigger.start) * target
      lenis.scrollTo(y, { duration: SETTLE_S, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
    }

    const onScroll = () => {
      const y = window.scrollY
      if (y !== lastY) forward = y > lastY
      lastY = y
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, IDLE_MS)
    }

    const onTouchStart = () => {
      touching = true
      window.clearTimeout(timer)
      // Si un acomodo iba en curso, el dedo lo detiene en seco (si no, los dos tiran del scroll y tiembla).
      const lenis = getLenis()
      if (lenis?.isScrolling) lenis.scrollTo(window.scrollY, { immediate: true, force: true })
    }
    const onTouchEnd = () => {
      touching = false
      // La inercia sigue moviendo la página: el acomodo espera a que se detenga (ver onScroll).
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, IDLE_MS)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [snap, enabled])
}
