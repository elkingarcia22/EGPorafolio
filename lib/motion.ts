'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

export const EASE_EXPO = 'expo.out'

/** Instancia única de Lenis (la crea <SmoothScroll>). */
let lenisInstance: Lenis | null = null

export function setLenis(instance: Lenis | null): void {
  lenisInstance = instance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function scrollToTop(): void {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export function scrollToTarget(target: string | HTMLElement): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -40, duration: 1.4 })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}

export const SCRAMBLE_CHARS = '▮▯░▒▓/\\_-=+*<>#01'

/**
 * Un cuadro del efecto "descifrar": las posiciones de `order` hasta
 * `revealed` muestran el texto real; el resto, caracteres de ruido.
 */
export function decodeFrame(target: string, revealed: number, order: readonly number[]): string {
  const shown = new Set(order.slice(0, revealed))
  let out = ''
  for (let i = 0; i < target.length; i++) {
    out += target[i] === ' ' || shown.has(i) ? target[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
  }
  return out
}

/** Orden aleatorio de las posiciones de un texto (para revelar en desorden). */
export function shuffledIndices(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

/**
 * Efecto "sintonizar": el texto pasa por caracteres de ruido antes
 * de asentarse. Devuelve una función para cancelarlo.
 */
export function scrambleText(el: HTMLElement, finalText: string, duration = 600): () => void {
  const start = performance.now()
  let frame = 0
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration)
    const settled = Math.floor(finalText.length * progress)
    let out = finalText.slice(0, settled)
    for (let i = settled; i < finalText.length; i++) {
      out += finalText[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    }
    el.textContent = out
    if (progress < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(frame)
    el.textContent = finalText
  }
}
