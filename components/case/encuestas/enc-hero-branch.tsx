'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { AREAS, ROWS, ROW1_HINTS } from '@/lib/content/cases/encuestas/heatmap-real'
import { favColor } from './shared'
import { useMedia, TABLET_QUERY } from '../objetivos/use-media'

/** Cada cuánto pasa al área siguiente (ms) */
const STEP_MS = 3000
/** Las áreas que recorre: seis con resultados y dos reservadas (por debajo del mínimo) */
const ORDER = [0, 1, 2, 5, 3, 6, 4, 8] as const

/** Lo que dice la ayuda real de cada celda: «Banda · N respuestas · M participantes» */
const parseHint = (hint: string) => {
  const [band, responses, people] = hint.split(' · ')
  return { band, responses: parseInt(responses, 10), people: parseInt(people, 10) }
}

const R = 38
const CIRC = 2 * Math.PI * R

/** Dónde va cada nodo, la fibra entre ellos y dónde van sus textos */
interface Geometry {
  viewBox: string
  nodes: readonly { x: number; y: number }[]
  fiber: string
  /** Hasta el nodo del medio: ahí se detiene la señal cuando el grupo es reservado */
  fiberHalf: string
  /** El nombre y el rol: arriba y abajo del nodo (escritorio) o a su derecha (teléfono) */
  name: (n: { x: number; y: number }) => { x: number; y: number; anchor: 'middle' | 'start' }
  role: (n: { x: number; y: number }) => { x: number; y: number; anchor: 'middle' | 'start' }
  /** Tamaños en unidades del SVG: en el teléfono el SVG casi no se escala, así que son los px reales */
  size: { name?: number; role?: number; value?: number }
}

const Y = 120
const DESKTOP: Geometry = {
  viewBox: '0 0 1000 230',
  nodes: [130, 500, 870].map((x) => ({ x, y: Y })),
  fiber: `M130 ${Y} C 260 ${Y - 36}, 370 ${Y + 36}, 500 ${Y} S 740 ${Y - 36}, 870 ${Y}`,
  fiberHalf: `M130 ${Y} C 260 ${Y - 36}, 370 ${Y + 36}, 500 ${Y}`,
  name: () => ({ x: 0, y: -R - 28, anchor: 'middle' }),
  role: () => ({ x: 0, y: R + 34, anchor: 'middle' }),
  size: {},
}

/** En el teléfono la rama baja: tres nodos en columna con sus textos a la derecha, a tamaño legible */
const X = 50
const PHONE: Geometry = {
  viewBox: '0 0 340 400',
  nodes: [56, 200, 344].map((y) => ({ x: X, y })),
  fiber: `M${X} 56 C ${X - 34} 110, ${X + 34} 146, ${X} 200 S ${X - 34} 290, ${X} 344`,
  fiberHalf: `M${X} 56 C ${X - 34} 110, ${X + 34} 146, ${X} 200`,
  name: () => ({ x: R + 30, y: -6, anchor: 'start' }),
  role: () => ({ x: R + 30, y: 18, anchor: 'start' }),
  size: { name: 19, role: 13, value: 20 },
}

interface EncHeroBranchProps {
  running: boolean
  reducedMotion: boolean
}

/**
 * La portada en una sola rama: la fila «Propósito y estrategia» del mapa de calor
 * real, área por área. Las respuestas llegan, se vuelven favorabilidad y una
 * lectura. Si el grupo no llega al mínimo, la señal se detiene en un candado.
 */
export function EncHeroBranch({ running, reducedMotion }: EncHeroBranchProps) {
  const { t } = useLocale()
  const [step, setStep] = useState(0)
  const geo = useMedia(TABLET_QUERY) ? DESKTOP : PHONE

  useEffect(() => {
    if (!running || reducedMotion) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % ORDER.length), STEP_MS)
    return () => window.clearInterval(id)
  }, [running, reducedMotion])

  const area = ORDER[step]
  const cell = ROWS[0].cells[area]
  const hint = parseHint(ROW1_HINTS[area])
  const reserved = cell === 'R'
  const score = typeof cell === 'number' ? cell : 0
  const fills = [hint.responses / hint.people, reserved ? 0 : score / 5, reserved ? 0 : 1]

  return (
    <figure className="mx-auto w-full max-w-[340px] md:max-w-[980px]">
      <svg viewBox={geo.viewBox} className="w-full overflow-visible" role="img" aria-label={t({ es: 'Las respuestas de un área se vuelven favorabilidad y una lectura, salvo que el grupo no llegue al mínimo', en: 'An area’s answers become favorability and a reading, unless the group is below the minimum' })}>
        <defs>
          <linearGradient id="enc-branch" x1="0" x2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="0.55" stopColor="rgb(var(--glow))" />
            <stop offset="1" stopColor="rgb(var(--spark))" />
          </linearGradient>
        </defs>
        <path d={geo.fiber} fill="none" stroke="url(#enc-branch)" strokeOpacity={0.4} strokeWidth={1.5} />
        {!reducedMotion && (
          <path key={step} d={reserved ? geo.fiberHalf : geo.fiber} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 0.92" className="branch-pulse" style={{ filter: 'drop-shadow(0 0 6px rgb(var(--signal)))' }} />
        )}

        {geo.nodes.map((node, i) => {
          const dim = reserved && i > 0
          const name = geo.name(node)
          const role = geo.role(node)
          return (
            <g key={i} transform={`translate(${node.x} ${node.y})`} style={{ opacity: dim ? 0.55 : 1, transition: 'opacity .6s' }}>
              <circle r={R + 18} fill={i === 2 && !reserved ? `${favColor(score)}22` : 'rgb(var(--signal) / 0.08)'} style={{ transition: 'fill .6s' }} />
              <circle r={R} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.12} strokeWidth={4} strokeDasharray={dim ? '4 6' : undefined} data-fiber-from={i === 2 ? 'enc-puntos' : undefined} />
              <circle r={R} fill="none" stroke={i === 2 ? favColor(score) : 'url(#enc-branch)'} strokeWidth={4} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - fills[i])} transform="rotate(-90)" style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1), stroke .6s' }} />
              {i === 0 && <text y={8} textAnchor="middle" style={{ fontSize: geo.size.value }} className="branch-value fill-paper font-medium tabular-nums">{hint.responses}</text>}
              {i === 1 && !reserved && <text y={8} textAnchor="middle" style={{ fontSize: geo.size.value }} className="branch-value fill-paper font-medium tabular-nums">{score.toFixed(1).replace('.', ',')}</text>}
              {i === 1 && reserved && (
                <g className="stroke-paper" fill="none" strokeWidth={2.4} transform="translate(-11 -13)">
                  <rect x={1} y={10} width={20} height={15} rx={3} />
                  <path d="M5.5 10V6.5a5.5 5.5 0 0 1 11 0V10" />
                </g>
              )}
              {i === 2 && <circle r={9} fill={reserved ? 'transparent' : favColor(score)} stroke={reserved ? 'rgb(255 255 255 / .4)' : 'none'} strokeDasharray="3 3" style={{ transition: 'fill .6s' }} />}
              <text x={name.x} y={name.y} textAnchor={name.anchor} style={{ fontSize: geo.size.name }} className={`branch-name fill-paper`}>
                {i === 0 ? AREAS[area] : i === 1 ? t({ es: 'Favorabilidad', en: 'Favorability' }) : hint.band}
              </text>
              <text x={role.x} y={role.y} textAnchor={role.anchor} style={{ fontSize: geo.size.role }} className={`branch-role fill-paper/50 font-mono uppercase tracking-[0.14em]`}>
                {i === 0
                  ? t({ es: `de ${hint.people} responden`, en: `of ${hint.people} answer` })
                  : i === 1
                    ? reserved ? t({ es: 'Bajo el mínimo', en: 'Below minimum' }) : t({ es: 'De 1 a 5', en: '1 to 5' })
                    : t({ es: 'Lectura', en: 'Reading' })}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-4 text-center font-mono text-[12px] text-white/45 md:text-[11px]">
        {t({ es: 'Mapa de calor real · «Propósito y estrategia», área por área', en: 'Real heatmap · “Purpose and strategy”, area by area' })}
      </figcaption>
    </figure>
  )
}
