'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

/** Dónde va la punta de la fibra mientras se desliza (fracción de la pantalla): más arriba = empieza más tarde */
const HEAD_AT = 0.45
/** Separación entre la fibra y el texto que rodea (px) */
const TEXT_GAP = 56
/** Margen mínimo con el borde (px) */
const EDGE = 16
/** Holgura extra con el borde de la pantalla (px) */
const SWAY = 26

interface Point {
  x: number
  y: number
}

/** Zona del texto que la fibra rodea, en coordenadas del contenedor */
interface TextBox {
  left: number
  right: number
  bottom: number
}

/**
 * Recorrido de la fibra: dos curvas largas y continuas, sin quiebres. La
 * primera sale del nodo de origen casi en horizontal y se abre hacia el
 * costado del texto; la segunda baja, cruza por debajo del texto en un
 * barrido amplio hacia la derecha y vuelve a caer, en curva, sobre el nodo
 * de destino. Una S elegante, como una fibra que se tiende sola.
 */
function fiberPath(a: Point, b: Point, text: TextBox, width: number): string {
  // Punto más a la izquierda: junto al texto, sin pegarse al borde de la pantalla.
  const side = Math.max(EDGE + SWAY, Math.min(text.left - TEXT_GAP, a.x - TEXT_GAP))
  const turn = { x: side, y: a.y + (text.bottom - a.y) * 0.62 }
  // Hasta dónde barre por debajo del texto antes de volver al nodo.
  const reach = Math.min(width - EDGE, b.x + width * 0.3)
  const gap = b.y - text.bottom
  return [
    `M${a.x},${a.y}`,
    `C${a.x - (a.x - side) * 0.75},${a.y} ${side},${a.y + (turn.y - a.y) * 0.3} ${turn.x},${turn.y}`,
    // Baja por el costado, barre por debajo del texto y cae desde arriba a la derecha sobre el nodo.
    `C${side},${text.bottom + gap * 0.95} ${reach},${text.bottom + gap * 0.05} ${b.x},${b.y}`,
  ].join(' ')
}

/**
 * Fibra entre secciones: une el nodo de una etiqueta (`data-fiber="from"`) con
 * el de la siguiente (`data-fiber="to"`). Se tiende con el scroll —su punta
 * brillante va un poco por debajo del centro de la pantalla— y, ya completa,
 * la recorren impulsos. Rodea el texto por un costado, como una conexión de la
 * red, en vez de un hilo recto.
 */
export function SectionFiber({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useA11y()
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const baseRef = useRef<SVGPathElement>(null)
  const drawnRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const pulseRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const svg = svgRef.current
    const base = baseRef.current
    const drawn = drawnRef.current
    const pulse = pulseRef.current
    const head = headRef.current
    if (!wrap || !svg || !base || !drawn || !pulse || !head) return
    let from: Point = { x: 0, y: 0 }
    let to: Point = { x: 0, y: 0 }
    let total = 0

    const centerOf = (selector: string): Point | null => {
      const el = wrap.querySelector(selector)
      if (!el) return null
      const box = wrap.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }
    }

    const show = (p: number) => {
      drawn.style.strokeDashoffset = String(1 - p)
      if (glowRef.current) glowRef.current.style.strokeDashoffset = String(1 - p)
      const point = drawn.getPointAtLength(total * p)
      head.setAttribute('transform', `translate(${point.x} ${point.y})`)
      head.style.opacity = p > 0.005 && p < 0.995 ? '1' : '0'
      // Completa: los impulsos la recorren.
      pulse.style.opacity = p >= 0.995 ? '1' : '0'
    }

    const measure = () => {
      const a = centerOf('[data-fiber="from"]')
      const b = centerOf('[data-fiber="to"]')
      if (!a || !b) return
      from = a
      to = b
      svg.setAttribute('viewBox', `0 0 ${wrap.clientWidth} ${wrap.clientHeight}`)
      // El texto que la fibra rodea; si no hay, se supone un bloque centrado.
      const around = wrap.querySelector('[data-fiber-around]')
      const box = wrap.getBoundingClientRect()
      const r = around?.getBoundingClientRect()
      const text: TextBox = r
        ? { left: r.left - box.left, right: r.right - box.left, bottom: r.bottom - box.top }
        : { left: from.x - wrap.clientWidth / 3, right: from.x + wrap.clientWidth / 3, bottom: (from.y + to.y) / 2 }
      const d = fiberPath(from, to, text, wrap.clientWidth)
      ;[base, drawn, pulse, glowRef.current].forEach((path) => path?.setAttribute('d', d))
      total = drawn.getTotalLength()
    }
    measure()

    if (reducedMotion) {
      show(1)
      return
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: () => `top+=${from.y} ${HEAD_AT * 100}%`,
        end: () => `top+=${to.y} ${HEAD_AT * 100}%`,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onUpdate: (self) => show(self.progress),
        onRefresh: (self) => show(self.progress),
      })
    }, wrap)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div ref={wrapRef} className="relative">
      {children}
      <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="section-fiber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.7" />
            <stop offset="0.5" stopColor="white" stopOpacity="0.35" />
            <stop offset="1" stopColor="white" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Rastro tenue de toda la conexión */}
        <path ref={baseRef} fill="none" stroke="white" strokeOpacity={0.06} strokeWidth={1} />
        {/* Halo suave bajo lo ya conectado: la fibra brilla, no es solo una línea */}
        <path ref={glowRef} pathLength={1} strokeDasharray="1" strokeDashoffset={1} fill="none" stroke="white" strokeOpacity={0.12} strokeWidth={6} strokeLinecap="round" style={{ filter: 'blur(4px)' }} />
        {/* Lo ya conectado */}
        <path ref={drawnRef} pathLength={1} strokeDasharray="1" strokeDashoffset={1} fill="none" stroke="url(#section-fiber)" strokeWidth={1.2} strokeLinecap="round" />
        {/* Impulsos que la recorren cuando está completa */}
        <path
          ref={pulseRef}
          pathLength={1}
          strokeDasharray="0.05 0.95"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          className="opacity-0 transition-opacity duration-700 [animation:fiber-impulse_3.2s_cubic-bezier(.65,0,.35,1)_infinite] [filter:drop-shadow(0_0_5px_white)]"
        />
        {/* Punta: una neurona que avanza buscando la siguiente */}
        <g ref={headRef} className="opacity-0 transition-opacity duration-300">
          <circle r={14} fill="white" fillOpacity={0.08} />
          <circle r={3} fill="white" style={{ filter: 'drop-shadow(0 0 6px white)' }} />
        </g>
      </svg>
      <style>{'@keyframes fiber-impulse { from { stroke-dashoffset: 0.05 } to { stroke-dashoffset: -1 } }'}</style>
    </div>
  )
}
