'use client'

import { useEffect, useState } from 'react'

/** Pantallas angostas: ahí los dibujos se encogen y sus textos dejan de leerse */
const NARROW_QUERY = '(max-width: 767px)'

interface SvgScale {
  /** cuánto mide en pantalla una unidad del dibujo (px) */
  k: number
  /** pantalla de teléfono */
  narrow: boolean
  /** tamaño, en unidades del dibujo, para que un texto se vea de `px` en pantalla (nunca menos que `base`) */
  fit: (px: number, base: number) => number
}

/**
 * Escala real de un SVG con `viewBox` de ancho `width`: sirve para que, en el
 * teléfono, sus textos sigan leyéndose aunque el dibujo se encoja.
 */
export function useSvgScale(ref: React.RefObject<SVGSVGElement | null>, width: number): SvgScale {
  const [k, setK] = useState(1)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const query = window.matchMedia(NARROW_QUERY)
    const measure = () => {
      setK(svg.getBoundingClientRect().width / width || 1)
      setNarrow(query.matches)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(svg)
    query.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      query.removeEventListener('change', measure)
    }
  }, [ref, width])

  return { k, narrow, fit: (px, base) => (narrow ? Math.max(base, px / k) : base) }
}
