'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'

/** Tamaño inicial del dibujo (px) hasta medir el espacio real */
const INITIAL = { w: 1000, h: 140 }
/** Margen a cada lado para que los nodos extremos no toquen el borde (fracción del ancho, con mínimo en px) */
const SIDE = { ratio: 0.04, min: 28 }
/** Altura de la onda de la fibra (fracción del alto) */
const WAVE = 0.24
/** Armado: cada neurona con su tramo (s) */
const BUILD = { node: 0.16, segment: 0.24 }
/** Color de la señal: del azul eléctrico al rosa de los impulsos, a lo largo de la fibra */
const SIGNAL = { from: 'var(--signal)', to: 'var(--spark)' }
/** Cuánto tarda el impulso en recorrer un tramo al cambiar de etapa (s) */
const TRAVEL_S = 0.75

interface Point {
  x: number
  y: number
}

/** Los nodos van sobre una onda suave, como una fibra que sube y baja (en px del espacio real). */
function nodePoints(count: number, size: { w: number; h: number }): Point[] {
  const side = Math.max(SIDE.min, size.w * SIDE.ratio)
  return Array.from({ length: count }, (_, i) => {
    const t = count > 1 ? i / (count - 1) : 0
    return { x: side + t * (size.w - side * 2), y: size.h / 2 + Math.sin(i * 1.15 + 0.4) * size.h * WAVE }
  })
}

/** Tramo curvo entre dos nodos (tangentes horizontales: la fibra fluye sin quiebres). */
function segment(a: Point, b: Point): string {
  const dx = (b.x - a.x) / 2
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`
}

interface ProcessPathProps {
  /** nombre corto de cada etapa (para leer y para el lector de pantalla) */
  labels: readonly string[]
  active: number
  onSelect: (index: number) => void
  /** arranca el armado de la fibra (una vez) */
  build: boolean
  /** la fibra terminó de armarse */
  onBuilt: () => void
  /** duración de la etapa en reproducción automática (ms); null si está en pausa */
  autoplayMs: number | null
  /** acercamiento a la neurona activa (1 = toda la fibra a la vista) */
  zoom: number
  /** nombre de la fibra entre secciones que sale de la última neurona (ver <SectionFiber>) */
  fiberFrom?: string
  /** la última neurona termina acercada al centro (la fibra sale de ahí, no de su sitio en la línea) */
  fiberFromCenter?: boolean
  reducedMotion: boolean
}

/**
 * La fibra del proceso. Al llegar a la sección se arma neurona por neurona,
 * cada una con su tramo. Ya armada, la neurona activa crece y
 * brilla mientras la señal pasa por ella (`zoom` acerca la vista, si se pide). Después, lo recorrido queda encendido;
 * al cambiar de etapa un impulso viaja hasta la neurona nueva, que dispara un
 * anillo. En reproducción automática, un arco alrededor de la neurona activa
 * marca cuánto falta para la siguiente. Cada neurona es un botón.
 */
export function ProcessPath({ labels, active, onSelect, build, onBuilt, autoplayMs, zoom, fiberFrom, fiberFromCenter = false, reducedMotion }: ProcessPathProps) {
  const count = labels.length
  const rootRef = useRef<HTMLDivElement>(null)
  // El dibujo va a la medida real del espacio: sin estirarse, los trazos y su animación coinciden.
  const [size, setSize] = useState(INITIAL)
  const points = nodePoints(count, size)
  const baseRefs = useRef<(SVGPathElement | null)[]>([])
  const segRefs = useRef<(SVGPathElement | null)[]>([])
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([])
  const pulseRef = useRef<HTMLSpanElement>(null)
  const ringRefs = useRef<(HTMLSpanElement | null)[]>([])
  const previous = useRef(active)
  const builtRef = useRef(reducedMotion)
  const onBuiltRef = useRef(onBuilt)
  onBuiltRef.current = onBuilt

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => setSize({ w: root.clientWidth || INITIAL.w, h: root.clientHeight || INITIAL.h })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  // Estado inicial: sin fibra ni neuronas (salvo con movimiento reducido).
  useEffect(() => {
    if (reducedMotion) {
      builtRef.current = true
      onBuiltRef.current()
      return
    }
    gsap.set(baseRefs.current, { strokeDashoffset: 1 })
    // La primera neurona ya está desde el comienzo; las demás aparecen al armarse la fibra.
    gsap.set(nodeRefs.current.slice(1), { autoAlpha: 0, scale: 0.3 })
  }, [reducedMotion])

  // Armado: la entrada baja desde Proyectos y la fibra se enciende neurona por neurona.
  useEffect(() => {
    if (!build || builtRef.current || reducedMotion) return
    const tl = gsap.timeline({
      onComplete: () => {
        builtRef.current = true
        onBuiltRef.current()
      },
    })
    nodeRefs.current.forEach((node, i) => {
      tl.to(node, { autoAlpha: 1, scale: 1, duration: BUILD.node * 2, ease: 'back.out(3)' }, i === 0 ? 0 : '>-0.08')
      const base = baseRefs.current[i]
      if (base) tl.to(base, { strokeDashoffset: 0, duration: BUILD.segment, ease: 'none' }, '<0.04')
    })
    return () => {
      tl.progress(1).kill()
    }
  }, [build, reducedMotion])

  // Tramos encendidos hasta la etapa activa, y el impulso que viaja a la nueva.
  useEffect(() => {
    const from = previous.current
    previous.current = active
    const segs = segRefs.current
    segs.forEach((seg, i) => {
      if (!seg) return
      gsap.to(seg, { strokeDashoffset: i < active ? 0 : 1, duration: reducedMotion ? 0 : TRAVEL_S, ease: 'power2.inOut', overwrite: true })
    })
    if (reducedMotion || from === active || !builtRef.current) return
    const forward = active > from
    const seg = segs[forward ? active - 1 : active]
    const pulse = pulseRef.current
    const ring = ringRefs.current[active]
    const near = Math.abs(active - from) === 1
    const tl = gsap.timeline()
    if (seg && pulse && near) {
      const total = seg.getTotalLength()
      const travel = { t: 0 }
      tl.set(pulse, { opacity: 1 })
        .to(travel, {
          t: 1,
          duration: TRAVEL_S,
          ease: 'power2.inOut',
          onUpdate: () => {
            const p = seg.getPointAtLength(total * (forward ? travel.t : 1 - travel.t))
            // El impulso es HTML: en el SVG estirado un círculo se vería ovalado.
            pulse.style.left = `${p.x}px`
            pulse.style.top = `${p.y}px`
          },
        })
        .to(pulse, { opacity: 0, duration: 0.2 })
    }
    if (ring) tl.fromTo(ring, { scale: 0.6, opacity: 0.9 }, { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out' }, near ? TRAVEL_S - 0.1 : 0)
    return () => {
      tl.kill()
    }
  }, [active, reducedMotion])

  const first = points[0]
  // Foco: la neurona activa queda al centro y todo se acerca (las vecinas se asoman a los lados).
  const focus = points[active] ?? first
  const fx = focus ? focus.x / size.w : 0.5
  const fy = focus ? focus.y / size.h : 0.5
  const focusTransform = zoom > 1 ? `translate(${(0.5 - fx) * zoom * 100}%, ${(0.5 - fy) * zoom * 100}%) scale(${zoom})` : 'none'

  return (
    <div ref={rootRef} className="relative h-[clamp(6rem,4.5rem+5vw,10rem)] w-full">
      {/* Lo que se acerca y se desplaza para enfocar la neurona activa */}
      <div
        className="absolute inset-0 transition-transform duration-[900ms] ease-expo motion-reduce:transition-none"
        style={{ transform: focusTransform }}
      >
      <svg viewBox={`0 0 ${size.w} ${size.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          {/* Lo recorrido se tiñe de la señal: azul al empezar, rosa al llegar al final */}
          <linearGradient id="pp-signal" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={size.w} y2={0}>
            <stop offset="0" style={{ stopColor: `rgb(${SIGNAL.from})` }} />
            <stop offset="0.55" style={{ stopColor: "rgb(var(--ice))" }} />
            <stop offset="1" style={{ stopColor: `rgb(${SIGNAL.to})` }} />
          </linearGradient>
          <linearGradient id="pp-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: `rgb(${SIGNAL.from})` }} />
            <stop offset="1" style={{ stopColor: `rgb(${SIGNAL.to})` }} />
          </linearGradient>
        </defs>
        {points.slice(1).map((b, i) => {
          const d = segment(points[i], b)
          return (
            <g key={i}>
              <path
                ref={(el) => { baseRefs.current[i] = el }}
                d={d}
                pathLength={1}
                strokeDasharray="1"
                fill="none"
                stroke="white"
                strokeOpacity={0.18}
                strokeWidth={1 / Math.max(1, zoom)}
              />
              <path
                ref={(el) => { segRefs.current[i] = el }}
                d={d}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1}
                fill="none"
                stroke="url(#pp-signal)"
                strokeOpacity={0.95}
                strokeWidth={1.6 / Math.max(1, zoom)}
                style={{ filter: `drop-shadow(0 0 5px rgb(${SIGNAL.from} / 0.55))` }}
              />
            </g>
          )
        })}
      </svg>
      <span
        ref={pulseRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_0_3px_rgb(var(--spark)/0.35),0_0_18px_6px_rgb(var(--spark)/0.75)]"
      />

      <ol className="absolute inset-0">
        {points.map((p, i) => {
          const on = i <= active
          const current = i === active
          return (
            <li
              key={labels[i]}
              ref={(el) => { nodeRefs.current[i] = el }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: p.x, top: p.y }}
            >
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? 'step' : undefined}
                aria-label={`${String(i + 1).padStart(2, '0')} · ${labels[i]}`}
                className="group relative grid h-14 w-14 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <span ref={(el) => { ringRefs.current[i] = el }} aria-hidden="true" className="absolute inset-4 rounded-full border border-[rgb(var(--spark))] opacity-0 shadow-[0_0_12px_rgb(var(--spark)/0.6)]" />
                {/* Reproducción automática: el arco marca cuánto falta para la siguiente etapa */}
                {current && autoplayMs && (
                  <svg key={`${active}-${autoplayMs}`} viewBox="0 0 40 40" className="absolute inset-0 -rotate-90 animate-[pp-in_0.5s_ease-out]" aria-hidden="true">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeOpacity={0.12} strokeWidth={1.5} />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="url(#pp-ring)"
                      strokeOpacity={1}
                      strokeWidth={1.5}
                      pathLength={1}
                      strokeDasharray="1"
                      style={{ animation: `pp-timer ${autoplayMs}ms linear forwards` }}
                    />
                  </svg>
                )}
                <span
                  aria-hidden="true"
                  className={`relative block h-3 w-3 rounded-full transition-[transform,background-color,box-shadow] duration-700 ease-expo ${
                    current
                      ? `${zoom > 1 ? 'scale-150' : 'scale-[2.2]'} bg-white shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_16px_4px_rgb(var(--signal)/0.65),0_0_30px_8px_rgb(var(--spark)/0.25)]`
                      : on
                        ? 'scale-100 bg-white/90 shadow-[0_0_10px_2px_rgb(var(--signal)/0.45)]'
                        : 'scale-75 bg-white/35 group-hover:scale-100 group-hover:bg-white/70'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ol>
      </div>
      <style>{'@keyframes pp-timer { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } } @keyframes pp-in { from { opacity: 0; transform: rotate(-90deg) scale(0.6) } to { opacity: 1; transform: rotate(-90deg) scale(1) } }'}</style>
      {/* De la última neurona sale la fibra hacia la siguiente sección. Con acercamiento, la
          última neurona termina al centro, así que la fibra sale de ahí */}
      {fiberFrom && points.length > 0 && (
        <span
          data-fiber-from={fiberFrom}
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0"
          style={fiberFromCenter ? { left: size.w / 2, top: size.h / 2 } : { left: points[points.length - 1].x, top: points[points.length - 1].y }}
        />
      )}
    </div>
  )
}
