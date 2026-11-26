'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useSwipe } from '@/components/case/kit/use-swipe'

/** Un punto del tablero, en sus medidas de diseño: el centro de lo que se mira en ese paso */
export interface PanStop {
  x: number
  y: number
}

/** Ancho al que se dibuja el tablero en teléfono: la letra más chica del boceto queda en ≥ 11 px */
const PAN_W = 1100
/** Alto de la ventana por la que se mira el tablero (px) */
const VIEW_H = 440

interface SketchPanProps {
  Board: React.ComponentType
  /** Medidas de diseño del tablero */
  design: { w: number; h: number }
  stops: readonly PanStop[]
  stop: number
  onNext: () => void
  onPrev: () => void
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * El boceto en teléfono: en vez de achicar el tablero entero, se dibuja a un
 * tamaño que se lee y una ventana lo recorre por partes, como una cámara que
 * se mueve sobre el papel. Deslizar de lado pasa a la siguiente parte.
 */
export function SketchPan({ Board, design, stops, stop, onNext, onPrev }: SketchPanProps) {
  const viewRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ vw: 0, top: 0, total: 0 })
  useSwipe(viewRef, { onNext, onPrev })

  useLayoutEffect(() => {
    const view = viewRef.current
    const wrap = boardRef.current
    if (!view || !wrap) return
    const measure = () => {
      // El papel empieza bajo el nombre del marco: se mide dónde
      const paper = wrap.querySelector<HTMLElement>('figure div.rounded-xl')
      setBox({ vw: view.clientWidth, top: paper?.offsetTop ?? 0, total: wrap.offsetHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(view)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [Board])

  const k = PAN_W / design.w
  const at = stops[stop] ?? stops[0]
  const tx = clamp(at.x * k - box.vw / 2, 0, Math.max(0, PAN_W - box.vw))
  const ty = clamp(box.top + at.y * k - VIEW_H / 2, 0, Math.max(0, box.total - VIEW_H))
  // La ventana sobre el mapa del tablero, para saber dónde se está
  const paperH = design.h * k
  const mapWin = {
    left: (tx / PAN_W) * 100,
    width: (Math.min(box.vw, PAN_W) / PAN_W) * 100,
    top: (clamp(ty - box.top, 0, paperH) / paperH) * 100,
    height: (Math.min(VIEW_H, paperH) / paperH) * 100,
  }

  return (
    <div>
      <div ref={viewRef} className="relative overflow-hidden rounded-xl" style={{ height: VIEW_H }}>
        <div
          ref={boardRef}
          className="swipe-board absolute left-0 top-0 transition-transform duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none"
          style={{ width: PAN_W, transform: `translate3d(${-tx}px, ${-ty}px, 0)` }}
        >
          <Board />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        {/* El tablero entero en miniatura, con la parte que se está mirando */}
        <span aria-hidden="true" className="relative block w-14 rounded-[3px] bg-[#f6f4ee]/15 ring-1 ring-white/20" style={{ aspectRatio: `${design.w} / ${design.h}` }}>
          <span
            className="absolute rounded-[2px] border border-[#d9b36a] bg-[#d9b36a]/25 transition-all duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]"
            style={{ left: `${mapWin.left}%`, width: `${mapWin.width}%`, top: `${mapWin.top}%`, height: `${mapWin.height}%` }}
          />
        </span>
        <ol className="flex items-center gap-1" aria-hidden="true">
          {stops.map((_, i) => (
            <li key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === stop ? 'w-5 bg-[#d9b36a]' : 'w-1.5 bg-white/25'}`} />
          ))}
        </ol>
      </div>
    </div>
  )
}
