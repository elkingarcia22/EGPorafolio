'use client'

import { useEffect, useRef } from 'react'

/** Recorrido horizontal mínimo del dedo para contar como deslizar (px) */
const MIN_DX = 40
/** El gesto es lateral solo si avanza claramente más de lado que de arriba abajo */
const SIDEWAYS_RATIO = 1.3

interface SwipeHandlers {
  onNext: () => void
  onPrev: () => void
  disabled?: boolean
}

/** ¿El toque empezó dentro de algo que ya se desliza de lado por sí mismo? */
function insideHorizontalScroller(target: EventTarget | null, root: HTMLElement): boolean {
  let el = target instanceof Element ? target : null
  while (el && el !== root) {
    if (el instanceof HTMLElement) {
      if (el.dataset.swipeIgnore !== undefined) return true
      const overflowX = getComputedStyle(el).overflowX
      if ((overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1) return true
    }
    el = el.parentElement
  }
  return false
}

/**
 * Deslizar el dedo de lado sobre una pieza que avanza por pasos (carrusel,
 * muro de tableros, pestañas): hacia la izquierda pasa al siguiente, hacia la
 * derecha vuelve al anterior. El scroll vertical de la página sigue igual.
 */
export function useSwipe(ref: React.RefObject<HTMLElement | null>, { onNext, onPrev, disabled = false }: SwipeHandlers): void {
  const handlers = useRef({ onNext, onPrev })
  handlers.current = { onNext, onPrev }

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    let start: { x: number; y: number } | null = null
    const previousTouchAction = el.style.touchAction
    // El navegador se queda con el scroll vertical; el gesto lateral lo recibe la pieza.
    el.style.touchAction = 'pan-y'
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || insideHorizontalScroller(e.target, el)) {
        start = null
        return
      }
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    const onEnd = (e: TouchEvent) => {
      if (!start) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y
      start = null
      if (Math.abs(dx) < MIN_DX || Math.abs(dx) < Math.abs(dy) * SIDEWAYS_RATIO) return
      if (dx < 0) handlers.current.onNext()
      else handlers.current.onPrev()
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.style.touchAction = previousTouchAction
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchend', onEnd)
    }
  }, [ref, disabled])
}
