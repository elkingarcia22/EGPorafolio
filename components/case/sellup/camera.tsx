'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Cámara para teléfono y tableta: en vez de encoger una composición de escritorio
 * (medidas fijas en px de diseño) hasta que no se lee, la muestra a tamaño legible
 * y encuadra solo la parte importante. Cuando el encuadre cambia, la cámara se
 * desliza hasta él, así la animación «sigue» a lo que se mueve.
 * En escritorio (≥ 1024 px) no se usa: cada pieza conserva su composición original.
 */

/** Por debajo de este ancho la página usa la cámara (lg de Tailwind). */
const COMPACT_QUERY = '(max-width: 1023px)'

/** Verdadero en teléfono y tableta (después de montar; en el servidor es escritorio). */
export function useCompact(): boolean {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY)
    const update = () => setCompact(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return compact
}

/** Ancho del elemento, siempre al día. */
export function useWidth<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

/** Encuadre en px de diseño: centro (cx, cy), ancho mínimo a mostrar y alto de la ventana. */
export interface View {
  cx: number
  cy: number
  w: number
  h: number
}

/** Nunca se amplía por encima del tamaño de diseño. */
const MAX_SCALE = 1

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Escala y desplazamiento para mostrar `view` en una caja de `boxW` px. */
export function frame(boxW: number, width: number, height: number, view: View) {
  const scale = Math.min(MAX_SCALE, boxW / view.w)
  const visW = boxW / scale
  const x0 = visW >= width ? (width - visW) / 2 : clamp(view.cx - visW / 2, 0, width - visW)
  const y0 = view.h >= height ? 0 : clamp(view.cy - view.h / 2, 0, height - view.h)
  const visH = Math.min(view.h, height)
  return { scale, x0, y0, boxH: visH * scale }
}

interface CameraProps {
  /** Medidas de diseño de la composición completa. */
  width: number
  height: number
  view: View
  children: ReactNode
  className?: string
}

/** Ventana recortada sobre una composición de medidas fijas, con paneo animado. */
export function Camera({ width, height, view, children, className = '' }: CameraProps) {
  const [box, boxW] = useWidth<HTMLDivElement>()
  const f = frame(boxW, width, height, view)
  return (
    <div ref={box} className={`relative w-full overflow-hidden ${className}`} style={{ height: boxW ? f.boxH : undefined }}>
      {boxW > 0 && (
        <div
          className="absolute left-0 top-0 origin-top-left transition-transform duration-700 ease-expo motion-reduce:transition-none"
          style={{ width, height, transform: `translate(${-f.x0 * f.scale}px, ${-f.y0 * f.scale}px) scale(${f.scale})` }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
