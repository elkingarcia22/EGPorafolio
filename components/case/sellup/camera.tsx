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

/** Verdadero en teléfono (< 640 px, después de montar): para piezas que cambian de dibujo, no de encuadre */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return narrow
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
  /** Borde izquierdo fijo (px de diseño): alinea el encuadre con el inicio del contenido en vez de centrarlo. */
  x?: number
}

/** Nunca se amplía por encima del tamaño de diseño. */
const MAX_SCALE = 1

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Escala y desplazamiento para mostrar `view` en una caja de `boxW` px. */
export function frame(boxW: number, width: number, height: number, view: View) {
  const scale = Math.min(MAX_SCALE, boxW / view.w)
  const visW = boxW / scale
  const left = view.x ?? view.cx - visW / 2
  const x0 = visW >= width ? (width - visW) / 2 : clamp(left, 0, width - visW)
  const y0 = view.h >= height ? 0 : clamp(view.cy - view.h / 2, 0, height - view.h)
  const visH = Math.min(view.h, height)
  return { scale, x0, y0, boxH: visH * scale, cut: { left: x0 > 1, right: x0 + visW < width - 1, bottom: y0 + visH < height - 1 } }
}

/** Largo del desvanecido en el borde donde la composición sigue (px reales). */
const FADE = 28

/**
 * Máscara que desvanece los bordes donde la pantalla continúa: así el corte se lee
 * como «la pantalla sigue», no como una pieza rota.
 */
function edgeMask(cut: { left: boolean; right: boolean; bottom: boolean }): React.CSSProperties {
  if (!cut.left && !cut.right && !cut.bottom) return {}
  const h = `linear-gradient(to right, ${cut.left ? 'transparent' : '#000'} 0, #000 ${FADE}px, #000 calc(100% - ${FADE}px), ${cut.right ? 'transparent' : '#000'} 100%)`
  const v = `linear-gradient(to bottom, #000 calc(100% - ${FADE}px), ${cut.bottom ? 'transparent' : '#000'} 100%)`
  const image = `${h}, ${v}`
  return { maskImage: image, WebkitMaskImage: image, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }
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
    <div ref={box} className={`relative w-full overflow-hidden ${className}`} style={{ height: boxW ? f.boxH : undefined, ...edgeMask(f.cut) }}>
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
