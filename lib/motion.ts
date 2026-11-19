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

/** Punto del hero (0–1 de su recorrido) donde el EG ya está armado y la firma se ve completa. */
export const HERO_SIGNATURE_AT = 0.9

/** Baja (o sube) hasta el EG con la firma. Devuelve false si no hay hero en la página. */
export function scrollToHeroSignature(duration = 2.4): boolean {
  const hero = document.querySelector<HTMLElement>('[data-hero-root]')
  if (!hero) return false
  const top = hero.getBoundingClientRect().top + window.scrollY
  const y = top + (hero.offsetHeight - window.innerHeight) * HERO_SIGNATURE_AT
  const reduced = document.documentElement.dataset.motion === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (lenisInstance) {
    lenisInstance.scrollTo(y, reduced ? { immediate: true, force: true } : { duration, easing: (t: number) => 1 - Math.pow(1 - t, 4), force: true })
  } else {
    window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
  }
  return true
}

const SCRAMBLE_CHARS = '▮▯░▒▓/\\_-=+*<>#01'

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
