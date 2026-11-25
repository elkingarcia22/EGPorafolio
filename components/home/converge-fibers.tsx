'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

/** El tendido empieza cuando la primera caja está a esta altura de la pantalla, y termina con el destino a esta otra */
const START_AT = 0.85
const END_AT = 0.5
/** Desfase entre fibras: no salen todas a la vez */
const STAGGER = 0.08
/** Dónde llegan las fibras al costado del destino: la primera de cada lado y el paso entre las siguientes (fracción del alto) */
const ARRIVE = { first: 0.28, step: 0.2 }
/** Cuánto se abre la fibra hacia afuera de las cajas (px), sin salirse de la pantalla */
const BULGE = 140
const EDGE = 12

interface Point {
  x: number
  y: number
}

/** Fibra por el costado: sale de lado, se abre hacia afuera (`out`, px con signo), baja y entra de lado al destino. */
function sidePath(a: Point, b: Point, out: number): string {
  return `M${a.x},${a.y} C${a.x + out},${a.y} ${b.x + out},${b.y} ${b.x},${b.y}`
}

/**
 * Fibras que convergen: de cada `data-converge-from="left|right"` (las cajas
 * de una sección) sale una fibra por ese costado con el scroll, baja por
 * fuera y entra por el mismo costado al `data-converge-to` (p. ej. la caja del
 * agente). Ya tendidas, las recorren impulsos hacia el destino.
 */
export function ConvergeFibers({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useA11y()
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<SVGPathElement[]>([])
  const pulseRefs = useRef<SVGPathElement[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    const svg = svgRef.current
    if (!wrap || !svg) return
    let from: Point[] = []
    let to: Point = { x: 0, y: 0 }

    const rectIn = (el: Element) => {
      const box = wrap.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, bottom: r.bottom - box.top }
    }

    /** Crea (o reutiliza) las fibras, una por caja. */
    const ensurePaths = (count: number) => {
      const ns = 'http://www.w3.org/2000/svg'
      while (pathRefs.current.length < count) {
        const path = document.createElementNS(ns, 'path')
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke', 'url(#converge-fiber)')
        path.setAttribute('stroke-width', '1.2')
        path.setAttribute('pathLength', '1')
        path.setAttribute('stroke-dasharray', '1')
        path.setAttribute('stroke-dashoffset', '1')
        path.style.filter = 'drop-shadow(0 0 4px rgb(255 255 255 / 0.35))'
        svg.appendChild(path)
        pathRefs.current.push(path)
        const pulse = document.createElementNS(ns, 'path')
        pulse.setAttribute('fill', 'none')
        pulse.setAttribute('stroke', 'white')
        pulse.setAttribute('stroke-width', '2')
        pulse.setAttribute('stroke-linecap', 'round')
        pulse.setAttribute('pathLength', '1')
        pulse.setAttribute('stroke-dasharray', '0.06 0.94')
        pulse.setAttribute('class', 'converge-pulse')
        pulse.style.opacity = '0'
        pulse.style.animationDelay = `${pulseRefs.current.length * 0.45}s`
        svg.appendChild(pulse)
        pulseRefs.current.push(pulse)
      }
    }

    const measure = () => {
      const target = wrap.querySelector('[data-converge-to]')
      const sources = Array.from(wrap.querySelectorAll('[data-converge-from]'))
      if (!target || sources.length === 0) return
      svg.setAttribute('viewBox', `0 0 ${wrap.clientWidth} ${wrap.clientHeight}`)
      const t = rectIn(target)
      to = { x: (t.left + t.right) / 2, y: t.top }
      const sides = sources.map((el) => (el.getAttribute('data-converge-from') === 'right' ? 1 : -1))
      from = sources.map((el, i) => {
        const r = rectIn(el)
        return { x: sides[i] < 0 ? r.left : r.right, y: (r.top + r.bottom) / 2 }
      })
      ensurePaths(from.length)
      // Cada fibra sale por el costado de su caja, baja por fuera y entra por el costado del destino;
      // las de un mismo lado llegan escalonadas, así no se superponen.
      const perSide = { [-1]: 0, [1]: 0 } as Record<number, number>
      from.forEach((a, i) => {
        const side = sides[i]
        const slot = perSide[side]++
        const edge = side < 0 ? t.left : t.right
        const end = { x: edge, y: t.top + (t.bottom - t.top) * (ARRIVE.first + slot * ARRIVE.step) }
        const room = side < 0 ? Math.min(a.x, end.x) - EDGE : wrap.clientWidth - Math.max(a.x, end.x) - EDGE
        const out = Math.max(24, Math.min(BULGE, room))
        const d = sidePath(a, end, side * out)
        pathRefs.current[i].setAttribute('d', d)
        pulseRefs.current[i].setAttribute('d', d)
      })
    }

    const show = (p: number) => {
      pathRefs.current.forEach((path, i) => {
        const k = Math.min(1, Math.max(0, p * (1 + STAGGER * from.length) - i * STAGGER))
        path.style.strokeDashoffset = String(1 - k)
        pulseRefs.current[i].style.opacity = k >= 0.999 ? '1' : '0'
      })
    }

    measure()
    if (reducedMotion) {
      show(1)
      return
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: () => `top+=${Math.min(...from.map((a) => a.y), to.y)} ${START_AT * 100}%`,
        end: () => `top+=${to.y} ${END_AT * 100}%`,
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
      {/* Detrás del contenido: las fibras pasan por debajo de las cajas de vidrio */}
      <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="converge-fiber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.25" />
            <stop offset="1" stopColor="white" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative">{children}</div>
      <style>{'.converge-pulse { animation: converge-impulse 3s cubic-bezier(.65,0,.35,1) infinite; transition: opacity .6s; filter: drop-shadow(0 0 5px white) } @keyframes converge-impulse { from { stroke-dashoffset: 0.06 } to { stroke-dashoffset: -1 } }'}</style>
    </div>
  )
}
