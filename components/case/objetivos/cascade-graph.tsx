'use client'

import { useEffect, useMemo, useRef } from 'react'
import { AREAS, EMPRESA, avanceArea, avanceEmpresa, cuenta, tramoDe, type ObjetivoPersona } from './cascade-model'

interface CascadeGraphProps {
  objetivos: readonly ObjetivoPersona[]
  /** El objetivo que acaba de reportar: su camino se ilumina y una chispa sube hasta la empresa. */
  pulse?: string | null
  /** Clave que cambia en cada reporte, para reiniciar la chispa. */
  pulseKey?: number
  reducedMotion?: boolean
  /** Paleta: sobre fondo oscuro (portada) o claro (demo). */
  theme?: 'dark' | 'light'
  /**
   * `wide`: empresa arriba y personas abajo (escritorio). `tall`: la misma cascada de lado, con
   * empresa a la izquierda y personas a la derecha, para que en pantallas angostas el texto no se
   * encoja por debajo de ~11 px.
   */
  layout?: 'wide' | 'tall'
  className?: string
}

const W = 1000
const H = 520
const Y = { empresa: 70, area: 270, persona: 455 }
const R = 26

const xEmpresa = (i: number) => 200 + i * 300
const xArea = (i: number) => 100 + i * 200
const xPersona = (i: number, n: number) => Math.round(60 + (i * (W - 120)) / Math.max(1, n - 1))

/** Curva vertical suave entre dos puntos. */
const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const my = (y1 + y2) / 2
  return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`
}

/** Curva horizontal suave entre dos puntos (la cascada de lado). */
const curveH = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
}

interface Pt {
  x: number
  y: number
}

/** Dónde va cada nodo y cómo se unen, según la orientación. */
interface Geometry {
  w: number
  h: number
  empresa: (i: number) => Pt
  area: (i: number) => Pt
  persona: (i: number, n: number) => Pt
  personaToArea: (p: Pt, a: Pt) => string
  areaToEmpresa: (a: Pt, e: Pt) => string
  /** Recorrido de la chispa: de centro a centro. */
  spark: (p: Pt, a: Pt, e: Pt | null) => string
  /** Tramo suelto de un área sin alinear y dónde va su etiqueta. */
  stub: (a: Pt) => { d: string; label: Pt }
  fonts: { big: number; label: number; sub: number; initials: number; personaSub: number }
  personaSubOffset: number
}

const PERSON_R = R * 0.62

const WIDE: Geometry = {
  w: W,
  h: H,
  empresa: (i) => ({ x: xEmpresa(i), y: Y.empresa }),
  area: (i) => ({ x: xArea(i), y: Y.area }),
  persona: (i, n) => ({ x: xPersona(i, n), y: Y.persona }),
  personaToArea: (p, a) => curve(p.x, p.y - R, a.x, a.y + R),
  areaToEmpresa: (a, e) => curve(a.x, a.y - R, e.x, e.y + R * 1.15),
  spark: (p, a, e) => `${curve(p.x, p.y, a.x, a.y)}${e ? ` ${curve(a.x, a.y, e.x, e.y).replace('M', 'L')}` : ''}`,
  stub: (a) => ({ d: `M${a.x} ${a.y - R} L${a.x} ${a.y - 70}`, label: { x: a.x, y: a.y - 80 } }),
  fonts: { big: 15, label: 12.5, sub: 10.5, initials: 10, personaSub: 10 },
  personaSubOffset: 34,
}

const TALL: Geometry = {
  w: 360,
  h: 440,
  empresa: (i) => ({ x: 62, y: 80 + i * 135 }),
  area: (i) => ({ x: 192, y: 50 + i * 84 }),
  persona: (i) => ({ x: 318, y: 30 + i * 52 }),
  personaToArea: (p, a) => curveH(p.x - PERSON_R, p.y, a.x + R, a.y),
  areaToEmpresa: (a, e) => curveH(a.x - R, a.y, e.x + R * 1.15, e.y),
  spark: (p, a, e) => `${curveH(p.x, p.y, a.x, a.y)}${e ? ` ${curveH(a.x, a.y, e.x, e.y).replace('M', 'L')}` : ''}`,
  stub: (a) => ({ d: `M${a.x - R} ${a.y} L${a.x - R - 34} ${a.y}`, label: { x: a.x - R - 38, y: a.y - 10 } }),
  fonts: { big: 13, label: 13, sub: 12, initials: 12.5, personaSub: 12.5 },
  personaSubOffset: 31,
}

const C = 2 * Math.PI * R

/** Anillo de avance de un nodo: el trazo se llena hasta su % y toma el color de su tramo. */
function Ring({ x, y, value, label, sub, ink, muted, track, big, fonts }: { x: number; y: number; value: number; label: string; sub?: string; ink: string; muted: string; track: string; big?: boolean; fonts: Geometry['fonts'] }) {
  const scale = big ? 1.15 : 1
  const shown = Math.min(100, value)
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle r={R} fill="none" stroke={track} strokeWidth={5} />
      <circle
        r={R}
        fill="none"
        stroke={tramoDe(value).color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={Math.round(C * 100) / 100}
        strokeDashoffset={Math.round(C * (1 - shown / 100) * 100) / 100}
        transform="rotate(-90)"
        style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1), stroke 600ms' }}
      />
      <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight={600} fill={ink} className="tabular-nums">
        {Math.round(value)}
      </text>
      <text textAnchor="middle" y={big ? -40 : 44} fontSize={big ? fonts.big : fonts.label} fontWeight={big ? 600 : 500} fill={ink}>
        {label}
      </text>
      {sub && (
        <text textAnchor="middle" y={big ? -58 : 60} fontSize={fonts.sub} fill={muted}>
          {sub}
        </text>
      )}
    </g>
  )
}


const SPARK_MS = 1400
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

/** Una chispa que recorre el camino del reporte, de la persona a la empresa, y se apaga al llegar. */
function Spark({ d, color }: { d: string; color: string }) {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGGElement>(null)
  useEffect(() => {
    const path = pathRef.current
    const dot = dotRef.current
    if (!path || !dot) return
    const length = path.getTotalLength()
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SPARK_MS)
      const p = path.getPointAtLength(easeOut(t) * length)
      dot.setAttribute('transform', `translate(${p.x} ${p.y})`)
      dot.style.opacity = String(t > 0.85 ? (1 - t) / 0.15 : 1)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [d])
  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      <g ref={dotRef} style={{ opacity: 0 }}>
        <circle r={14} fill={color} opacity={0.28} />
        <circle r={6} fill={color} />
      </g>
    </>
  )
}

/**
 * La cascada de un ciclo: objetivos de empresa arriba, áreas al medio y personas abajo. Los enlaces se
 * dibujan según la alineación real de cada objetivo; lo que no cuelga de nada queda «sin alinear».
 */
export function CascadeGraph({ objetivos, pulse, pulseKey = 0, reducedMotion, theme = 'dark', layout = 'wide', className = '' }: CascadeGraphProps) {
  const g = layout === 'tall' ? TALL : WIDE
  const ink = theme === 'dark' ? '#f2f1ec' : '#161a2c'
  const muted = theme === 'dark' ? 'rgba(242,241,236,0.5)' : 'rgba(22,26,44,0.5)'
  const track = theme === 'dark' ? 'rgba(242,241,236,0.12)' : 'rgba(22,26,44,0.08)'
  const line = theme === 'dark' ? 'rgba(242,241,236,0.16)' : 'rgba(22,26,44,0.14)'
  const hot = '#4060ff'

  const people = objetivos
  const links = useMemo(() => {
    const areaToCo = new Map<string, Set<string>>()
    people.forEach((o) => {
      if (!o.empresa || !cuenta(o)) return
      const set = areaToCo.get(o.area) ?? new Set<string>()
      set.add(o.empresa)
      areaToCo.set(o.area, set)
    })
    return areaToCo
  }, [people])

  const pulsed = people.find((o) => o.id === pulse)
  const pulseArea = pulsed ? AREAS.indexOf(pulsed.area as (typeof AREAS)[number]) : -1
  const pulseCo = pulsed?.empresa ? EMPRESA.findIndex((e) => e.id === pulsed.empresa) : -1
  const pulseIdx = pulsed ? people.indexOf(pulsed) : -1
  const sparkPath = pulsed && pulseArea >= 0 ? g.spark(g.persona(pulseIdx, people.length), g.area(pulseArea), pulseCo >= 0 ? g.empresa(pulseCo) : null) : null

  return (
    <svg viewBox={`0 0 ${g.w} ${g.h}`} className={`h-auto w-full ${className}`} role="img" aria-label="Cascada de objetivos: empresa, áreas y personas">
      {/* Enlaces persona → área */}
      {people.map((o, i) => {
        const a = AREAS.indexOf(o.area as (typeof AREAS)[number])
        const isHot = o.id === pulse
        return (
          <path
            key={`pa-${o.id}`}
            d={g.personaToArea(g.persona(i, people.length), g.area(a))}
            fill="none"
            stroke={isHot ? hot : line}
            strokeWidth={isHot ? 2.5 : 1.25}
            strokeDasharray={cuenta(o) ? undefined : '4 5'}
            style={{ transition: 'stroke 400ms' }}
          />
        )
      })}
      {/* Enlaces área → empresa */}
      {AREAS.map((area, a) => {
        const targets = links.get(area)
        if (!targets) {
          return <path key={`na-${area}`} d={g.stub(g.area(a)).d} stroke={muted} strokeWidth={1.25} strokeDasharray="3 5" />
        }
        return Array.from(targets).map((co) => {
          const c = EMPRESA.findIndex((e) => e.id === co)
          const isHot = a === pulseArea && c === pulseCo
          return (
            <path key={`ac-${area}-${co}`} d={g.areaToEmpresa(g.area(a), g.empresa(c))} fill="none" stroke={isHot ? hot : line} strokeWidth={isHot ? 2.5 : 1.5} style={{ transition: 'stroke 400ms' }} />
          )
        })
      })}
      {AREAS.map((area, a) =>
        links.get(area) ? null : (
          <text key={`sa-${area}`} x={g.stub(g.area(a)).label.x} y={g.stub(g.area(a)).label.y} textAnchor="middle" fontSize={g.fonts.sub} fill={muted}>
            {people.some((o) => o.area === area && o.empresa) ? 'por aprobar' : 'sin alinear'}
          </text>
        ),
      )}

      {/* Chispa que sube por el camino del reporte */}
      {sparkPath && !reducedMotion && <Spark key={pulseKey} d={sparkPath} color={hot} />}

      {EMPRESA.map((e, i) => (
        <Ring key={e.id} x={g.empresa(i).x} y={g.empresa(i).y} fonts={g.fonts} value={avanceEmpresa(people, e.id)} label={e.corto} ink={ink} muted={muted} track={track} big />
      ))}
      {AREAS.map((area, a) => (
        <Ring key={area} x={g.area(a).x} y={g.area(a).y} fonts={g.fonts} value={avanceArea(people, area)} label={area} ink={ink} muted={muted} track={track} />
      ))}
      {people.map((o, i) => (
        <g key={o.id} transform={`translate(${g.persona(i, people.length).x} ${g.persona(i, people.length).y})`}>
          <circle r={PERSON_R} fill={o.id === pulse ? hot : theme === 'dark' ? '#1d1f26' : '#fff'} stroke={cuenta(o) ? tramoDe(o.avance).color : muted} strokeWidth={2.5} strokeDasharray={cuenta(o) ? undefined : '3 3'} style={{ transition: 'fill 400ms' }} />
          <text textAnchor="middle" dy="0.35em" fontSize={g.fonts.initials} fontWeight={600} fill={o.id === pulse ? '#fff' : ink}>
            {o.persona.split(' ').map((p) => p[0]).join('')}
          </text>
          <text textAnchor="middle" y={g.personaSubOffset} fontSize={g.fonts.personaSub} fill={muted}>
            {cuenta(o) ? `${o.avance} %` : o.etapa === 'por-aprobar' ? 'por aprobar' : 'por ajustar'}
          </text>
        </g>
      ))}
    </svg>
  )
}
