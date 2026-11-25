'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'

/**
 * Entradas al hacer scroll, según `data-reveal`:
 * - (vacío) / up: sube y aparece
 * - mask: se descubre de abajo hacia arriba, como una cortina (títulos)
 * - pop: crece con un rebote (post-its, destacados)
 * - device: sube con perspectiva (celulares, tablets, monitores)
 * - right: entra desde la derecha (leyendas)
 * Además: `data-draw` dibuja trazos SVG y `data-count` cuenta hasta su número.
 */
type RevealKind = 'up' | 'mask' | 'pop' | 'device' | 'right'

const FROM: Record<RevealKind, gsap.TweenVars> = {
  up: { autoAlpha: 0, y: 36 },
  mask: { autoAlpha: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' },
  pop: { autoAlpha: 0, scale: 0.6, rotate: () => gsap.utils.random(-7, 7) },
  device: { autoAlpha: 0, y: 90, scale: 0.94, rotateX: 14, transformPerspective: 1200 },
  right: { autoAlpha: 0, x: 40 },
}

const TO: Record<RevealKind, gsap.TweenVars> = {
  up: { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 },
  mask: { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', stagger: 0.08 },
  pop: { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.06 },
  device: { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12 },
  right: { autoAlpha: 1, x: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
}

const SELECTOR: Record<RevealKind, string> = {
  up: '[data-reveal=""], [data-reveal="true"], [data-reveal="up"]',
  mask: '[data-reveal="mask"]',
  pop: '[data-reveal="pop"]',
  device: '[data-reveal="device"]',
  right: '[data-reveal="right"]',
}

export function useReveal(root: React.RefObject<HTMLElement | null>, reducedMotion: boolean): void {
  useEffect(() => {
    const el = root.current
    if (!el || reducedMotion) return
    /** Lo que está dentro de `[data-reveal-off]` anima su propia entrada (p. ej. el muro de bocetos) */
    const pick = <T extends Element>(selector: string) => gsap.utils.toArray<T>(selector, el).filter((node) => !node.closest('[data-reveal-off]'))
    const ctx = gsap.context(() => {
      ;(Object.keys(SELECTOR) as RevealKind[]).forEach((kind) => {
        const nodes = pick<HTMLElement>(SELECTOR[kind])
        if (nodes.length === 0) return
        gsap.set(nodes, FROM[kind])
        ScrollTrigger.batch(nodes, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { ...TO[kind], overwrite: true }),
        })
      })

      // Trazos que se dibujan (flechas de los bocetos)
      pick<SVGPathElement>('[data-draw]').forEach((path) => {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', scrollTrigger: { trigger: path.closest('figure') ?? path, start: 'top 75%', once: true } },
        )
      })

      // Cifras que cuentan
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((node) => {
        const target = Number(node.dataset.count)
        if (!Number.isFinite(target)) return
        const counter = { v: 0 }
        node.textContent = '0'
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          onUpdate: () => {
            node.textContent = String(Math.round(counter.v))
          },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [root, reducedMotion])
}
