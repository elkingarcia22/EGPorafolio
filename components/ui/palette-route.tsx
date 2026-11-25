'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { applyTokens, blendTokens, clearScopedTokens, paletteForPath, tokensOf, type PaletteTokens } from '@/lib/palettes'
import { setCanvasPalette } from '@/components/signal/styles/paint'
import { useA11y } from '@/lib/a11y'

/** Lo que tarda el cambio de color: cabe dentro de la cortina con la red a la vista. */
const BLEND_MS = 1600
/** Tras el clic, la transición arranca con los colores de siempre y luego cambia a los del destino */
const BLEND_DELAY_MS = 700
/** Pasos del cambio (no hace falta un tono nuevo en cada cuadro) */
const STEPS = 40

function paint(tokens: PaletteTokens, scope?: readonly HTMLElement[]): void {
  // Primero los lienzos: el aviso de applyTokens ya los encuentra con el color nuevo.
  setCanvasPalette(tokens)
  applyTokens(tokens, scope)
}

/** Lo que se ve mientras la cortina tapa la página (ver `data-palette-scope`). */
function coverScope(): HTMLElement[] | undefined {
  if (document.documentElement.dataset.transitioning !== 'true') return undefined
  const scope = Array.from(document.querySelectorAll<HTMLElement>('[data-palette-scope]'))
  return scope.length ? scope : undefined
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/** Ruta interna a la que lleva un clic, o null si no es un enlace del sitio. */
function internalPath(event: MouseEvent): string | null {
  // No se mira defaultPrevented: la cortina de transición cancela el clic para navegar ella.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const link = (event.target as Element | null)?.closest?.('a[href]')
  if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return null
  const url = new URL(link.href, window.location.href)
  return url.origin === window.location.origin ? url.pathname : null
}

/**
 * Cada proyecto tiene su paleta. Al ir a otra página, los colores pasan poco
 * a poco de la paleta actual a la del destino: empieza con el clic, así el
 * cambio se ve mientras la cortina de la transición muestra la red.
 */
export function PaletteRoute() {
  const pathname = usePathname()
  const { reducedMotion } = useA11y()
  const current = useRef<PaletteTokens | null>(null)
  const targetId = useRef<string | null>(null)
  const frame = useRef(0)
  const delay = useRef<number | undefined>(undefined)

  useEffect(() => {
    const blendTo = (path: string, wait = 0) => {
      const palette = paletteForPath(path)
      if (palette.id === targetId.current) return
      targetId.current = palette.id
      cancelAnimationFrame(frame.current)
      window.clearTimeout(delay.current)
      if (wait > 0 && !reducedMotion && current.current) {
        delay.current = window.setTimeout(() => {
          targetId.current = null
          blendTo(path)
        }, wait)
        return
      }
      const target = tokensOf(palette)
      const from = current.current
      if (!from || reducedMotion) {
        current.current = target
        paint(target)
        return
      }
      let lastStep = -1
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / BLEND_MS)
        const step = Math.round(easeInOut(t) * STEPS)
        if (t >= 1) {
          // Fin: la página recibe la paleta destino (el último paso pudo pintarse solo en la cortina).
          current.current = target
          paint(target)
          clearScopedTokens(Array.from(document.querySelectorAll<HTMLElement>('[data-palette-scope]')))
          return
        }
        if (step !== lastStep) {
          lastStep = step
          current.current = blendTokens(from, target, step / STEPS)
          // Con la cortina, los pasos intermedios se pintan solo en ella; la página cambia una vez, al final.
          paint(current.current, coverScope())
        }
        frame.current = requestAnimationFrame(tick)
      }
      frame.current = requestAnimationFrame(tick)
    }

    // La ruta manda (también con atrás/adelante del navegador)
    blendTo(pathname)

    const onClick = (event: MouseEvent) => {
      const path = internalPath(event)
      if (path && path !== window.location.pathname) blendTo(path, BLEND_DELAY_MS)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname, reducedMotion])

  useEffect(() => () => {
    cancelAnimationFrame(frame.current)
    window.clearTimeout(delay.current)
  }, [])

  return null
}
