'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

/** Dónde va la punta de la fibra mientras se desliza (fracción de la pantalla): más arriba = empieza más tarde */
const HEAD_AT = 0.45
/** Separación mínima entre la fibra y el texto que rodea (px) */
const TEXT_GAP = 90
/** Cuánto se abre la fibra hacia el costado (fracción del ancho): más, más amplia la curva */
const OPEN = 0.1
/** Margen mínimo con el borde (px) */
const EDGE = 16
/** Cuánto baja la fibra al salir de un nodo cuya etiqueta queda del lado hacia el que se abre (px) */
const EXIT_DROP = 90
/** Holgura extra con el borde de la pantalla (px) */
const SWAY = 26
/** Espera antes de volver a medir cuando el contenido cambia de alto (ms) */
const REMEASURE_MS = 200

interface Point {
  x: number
  y: number
}

/** Hacia qué costado se abre la fibra */
type FiberSide = 'left' | 'right'

/** Zona del texto que la fibra rodea, en coordenadas del contenedor */
interface TextBox {
  left: number
  right: number
  bottom: number
}

/**
 * Recorrido de la fibra: dos curvas largas y continuas, sin quiebres. La
 * primera sale del nodo de origen casi en horizontal y se abre amplia hacia
 * el costado del texto; la segunda baja recogiéndose hacia el centro y cae,
 * con un giro corto, sobre el nodo de destino: abierta arriba, cerrada abajo.
 */
function fiberPath(start: Point, end: Point, box: TextBox, width: number, toward: FiberSide): string {
  // Hacia la derecha es el mismo trazo en espejo: se calcula como si fuera a la izquierda y se refleja.
  const flip = toward === 'right'
  const mx = (x: number) => (flip ? width - x : x)
  const a = { x: mx(start.x), y: start.y }
  const b = { x: mx(end.x), y: end.y }
  const text = flip ? { left: width - box.right, right: width - box.left, bottom: box.bottom } : box
  // Punto más al costado: bien abierto respecto del texto, sin salirse de la pantalla.
  const open = Math.max(TEXT_GAP, width * OPEN)
  const side = Math.max(EDGE + SWAY, Math.min(text.left - open, a.x - open))
  // Arriba abre amplio; el punto de giro queda a media altura del texto para cerrar antes al bajar.
  const turn = { x: side, y: a.y + (text.bottom - a.y) * 0.5 }
  // En el punto de giro la fibra va justo hacia abajo (tangente vertical en ambos tramos): sin quiebres.
  const down = b.y - turn.y
  const p = (x: number, y: number) => `${mx(x)},${y}`
  return [
    `M${p(a.x, a.y)}`,
    // Sale casi en horizontal y se abre en un arco amplio hasta el costado.
    // Hacia la derecha el texto de la etiqueta queda a ese lado: la fibra primero baja y luego se
    // abre por debajo del texto, en curva (no en horizontal por encima de él).
    flip
      ? `C${p(a.x, a.y + EXIT_DROP)} ${p(side, a.y + (turn.y - a.y) * 0.3)} ${p(turn.x, turn.y)}`
      : `C${p(a.x - (a.x - side) * 0.9, a.y)} ${p(side, a.y + (turn.y - a.y) * 0.3)} ${p(turn.x, turn.y)}`,
    // Baja y se va recogiendo hacia el centro de a poco, hasta caer sobre el nodo desde arriba.
    `C${p(side, turn.y + down * 0.4)} ${p(b.x - Math.min(40, (b.x - side) * 0.1), b.y - down * 0.45)} ${p(b.x, b.y)}`,
  ].join(' ')
}

/**
 * Fibra entre secciones: une el elemento `data-fiber-from="<id>"` (p. ej. el
 * nodo de una etiqueta) con el `data-fiber-to="<id>"` de la siguiente. Se tiende con el scroll —su punta
 * brillante va un poco por debajo del centro de la pantalla— y, ya completa,
 * la recorren impulsos. Rodea el texto por un costado, como una conexión de la
 * red, en vez de un hilo recto.
 */
interface SectionFiberProps {
  /** Nombre de la conexión: une `data-fiber-from` con `data-fiber-to` del mismo nombre */
  id: string
  /** costado hacia el que se abre la curva (por defecto, la izquierda) */
  side?: FiberSide
  children: React.ReactNode
}

export function SectionFiber({ id, side = 'left', children }: SectionFiberProps) {
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

    const centerOf = (selector: string, atEnd = false): Point | null => {
      const el = wrap.querySelector(selector)
      if (!el) return null
      const box = wrap.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      // La fibra que SALE de una parte fija (sticky, `data-sticky-end`) parte de donde queda ese
      // punto al final del recorrido, cuando la parte fija se suelta. La que LLEGA, de su inicio.
      const sticky = el.closest('[data-sticky-end]')
      const track = sticky?.parentElement
      let settle = 0
      if (sticky && track) {
        const t = track.getBoundingClientRect()
        const k = sticky.getBoundingClientRect()
        // Se mide con la parte fija en cualquier punto del recorrido: se lleva al final o al inicio.
        settle = atEnd ? t.bottom - k.bottom : t.top - k.top
      }
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top + settle }
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
      const a = centerOf(`[data-fiber-from="${id}"]`, true)
      const b = centerOf(`[data-fiber-to="${id}"]`)
      if (!a || !b) return
      from = a
      to = b
      svg.setAttribute('viewBox', `0 0 ${wrap.clientWidth} ${wrap.clientHeight}`)
      // El texto que la fibra rodea; si no hay, se supone un bloque centrado.
      const around = wrap.querySelector(`[data-fiber-around="${id}"]`)
      const box = wrap.getBoundingClientRect()
      const r = around?.getBoundingClientRect()
      const text: TextBox = r
        ? { left: r.left - box.left, right: r.right - box.left, bottom: r.bottom - box.top }
        : { left: from.x - wrap.clientWidth / 3, right: from.x + wrap.clientWidth / 3, bottom: (from.y + to.y) / 2 }
      const d = fiberPath(from, to, text, wrap.clientWidth, side)
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
    // Si el contenido cambia de alto después de medir (fuentes, imágenes, un «Leer más»), se vuelve a
    // medir: si no, la fibra queda apuntando a donde estaban los nodos antes.
    let lastHeight = wrap.clientHeight
    let pending = 0
    const ro = new ResizeObserver(() => {
      if (Math.abs(wrap.clientHeight - lastHeight) < 2) return
      lastHeight = wrap.clientHeight
      window.clearTimeout(pending)
      pending = window.setTimeout(() => ScrollTrigger.refresh(), REMEASURE_MS)
    })
    ro.observe(wrap)
    return () => {
      ro.disconnect()
      window.clearTimeout(pending)
      ctx.revert()
    }
  }, [reducedMotion, id, side])

  return (
    <div ref={wrapRef} className="relative">
      {/* Detrás del contenido: la fibra pasa por debajo de los textos, no por encima */}
      <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`section-fiber-${id}`} x1="0" y1="0" x2="0" y2="1">
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
        <path ref={drawnRef} pathLength={1} strokeDasharray="1" strokeDashoffset={1} fill="none" stroke={`url(#section-fiber-${id})`} strokeWidth={1.2} strokeLinecap="round" />
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
      <div className="relative">{children}</div>
      <style>{'@keyframes fiber-impulse { from { stroke-dashoffset: 0.05 } to { stroke-dashoffset: -1 } }'}</style>
    </div>
  )
}
