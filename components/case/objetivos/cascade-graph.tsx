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
  className?: string
}

const W = 1000
const H = 520
const Y = { empresa: 70, area: 270, persona: 455 }

const xEmpresa = (i: number) => 200 + i * 300
const xArea = (i: number) => 100 + i * 200
const xPersona = (i: number, n: number) => Math.round(60 + (i * (W - 120)) / Math.max(1, n - 1))

/** Curva vertical suave entre dos puntos. */
const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const my = (y1 + y2) / 2
  return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`
}

const R = 26
const C = 2 * Math.PI * R

/** Anillo de avance de un nodo: el trazo se llena hasta su % y toma el color de su tramo. */
function Ring({ x, y, value, label, sub, ink, muted, track, big }: { x: number; y: number; value: number; label: string; sub?: string; ink: string; muted: string; track: string; big?: boolean }) {
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
      <text textAnchor="middle" y={big ? -40 : 44} fontSize={big ? 15 : 12.5} fontWeight={big ? 600 : 500} fill={ink}>
        {label}
      </text>
      {sub && (
        <text textAnchor="middle" y={big ? -58 : 60} fontSize={10.5} fill={muted}>
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
export function CascadeGraph({ objetivos, pulse, pulseKey = 0, reducedMotion, theme = 'dark', className = '' }: CascadeGraphProps) {
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
  const sparkPath =
    pulsed && pulseArea >= 0
      ? `${curve(xPersona(pulseIdx, people.length), Y.persona, xArea(pulseArea), Y.area)}${pulseCo >= 0 ? ` ${curve(xArea(pulseArea), Y.area, xEmpresa(pulseCo), Y.empresa).replace('M', 'L')}` : ''}`
      : null

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-auto w-full ${className}`} role="img" aria-label="Cascada de objetivos: empresa, áreas y personas">
      {/* Enlaces persona → área */}
      {people.map((o, i) => {
        const a = AREAS.indexOf(o.area as (typeof AREAS)[number])
        const isHot = o.id === pulse
        return (
          <path
            key={`pa-${o.id}`}
            d={curve(xPersona(i, people.length), Y.persona - R, xArea(a), Y.area + R)}
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
          return <path key={`na-${area}`} d={`M${xArea(a)} ${Y.area - R} L${xArea(a)} ${Y.area - 70}`} stroke={muted} strokeWidth={1.25} strokeDasharray="3 5" />
        }
        return Array.from(targets).map((co) => {
          const c = EMPRESA.findIndex((e) => e.id === co)
          const isHot = a === pulseArea && c === pulseCo
          return (
            <path key={`ac-${area}-${co}`} d={curve(xArea(a), Y.area - R, xEmpresa(c), Y.empresa + R * 1.15)} fill="none" stroke={isHot ? hot : line} strokeWidth={isHot ? 2.5 : 1.5} style={{ transition: 'stroke 400ms' }} />
          )
        })
      })}
      {AREAS.map((area, a) =>
        links.get(area) ? null : (
          <text key={`sa-${area}`} x={xArea(a)} y={Y.area - 80} textAnchor="middle" fontSize={10.5} fill={muted}>
            {people.some((o) => o.area === area && o.empresa) ? 'por aprobar' : 'sin alinear'}
          </text>
        ),
      )}

      {/* Chispa que sube por el camino del reporte */}
      {sparkPath && !reducedMotion && <Spark key={pulseKey} d={sparkPath} color={hot} />}

      {EMPRESA.map((e, i) => (
        <Ring key={e.id} x={xEmpresa(i)} y={Y.empresa} value={avanceEmpresa(people, e.id)} label={e.corto} ink={ink} muted={muted} track={track} big />
      ))}
      {AREAS.map((area, a) => (
        <Ring key={area} x={xArea(a)} y={Y.area} value={avanceArea(people, area)} label={area} ink={ink} muted={muted} track={track} />
      ))}
      {people.map((o, i) => (
        <g key={o.id} transform={`translate(${xPersona(i, people.length)} ${Y.persona})`}>
          <circle r={R * 0.62} fill={o.id === pulse ? hot : theme === 'dark' ? '#1d1f26' : '#fff'} stroke={cuenta(o) ? tramoDe(o.avance).color : muted} strokeWidth={2.5} strokeDasharray={cuenta(o) ? undefined : '3 3'} style={{ transition: 'fill 400ms' }} />
          <text textAnchor="middle" dy="0.35em" fontSize={10} fontWeight={600} fill={o.id === pulse ? '#fff' : ink}>
            {o.persona.split(' ').map((p) => p[0]).join('')}
          </text>
          <text textAnchor="middle" y={34} fontSize={10} fill={muted}>
            {cuenta(o) ? `${o.avance} %` : o.etapa === 'por-aprobar' ? 'por aprobar' : 'por ajustar'}
          </text>
        </g>
      ))}
    </svg>
  )
}
