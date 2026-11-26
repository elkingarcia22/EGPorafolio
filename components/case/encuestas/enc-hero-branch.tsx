'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { AREAS, ROWS, ROW1_HINTS } from '@/lib/content/cases/encuestas/heatmap-real'
import { favColor } from './shared'
import { useMedia, TABLET_QUERY } from '../objetivos/use-media'
import { HeroBranchPhone } from './phone/hero-branch-phone'

/** Cada cuánto pasa al área siguiente (ms) */
const STEP_MS = 3000
/** Las áreas que recorre: seis con resultados y dos reservadas (por debajo del mínimo) */
const ORDER = [0, 1, 2, 5, 3, 6, 4, 8] as const

/** Lo que dice la ayuda real de cada celda: «Banda · N respuestas · M participantes» */
const parseHint = (hint: string) => {
  const [band, responses, people] = hint.split(' · ')
  return { band, responses: parseInt(responses, 10), people: parseInt(people, 10) }
}

const Y = 120
const R = 38
const CIRC = 2 * Math.PI * R
const X = [130, 500, 870] as const
const FIBER = `M${X[0]} ${Y} C 260 ${Y - 36}, 370 ${Y + 36}, ${X[1]} ${Y} S 740 ${Y - 36}, ${X[2]} ${Y}`
/** Hasta el nodo del medio: ahí se detiene la señal cuando el grupo es reservado */
const FIBER_HALF = `M${X[0]} ${Y} C 260 ${Y - 36}, 370 ${Y + 36}, ${X[1]} ${Y}`

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
  const wide = useMedia(TABLET_QUERY)

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

  if (!wide) {
    const ring = 'rgb(var(--signal))'
    return (
      <HeroBranchPhone
        pulseKey={step}
        stopsHalfway={reserved}
        reducedMotion={reducedMotion}
        stages={[
          { value: String(hint.responses), name: AREAS[area], role: t({ es: `de ${hint.people} responden`, en: `of ${hint.people} answer` }), fill: fills[0], color: ring, dim: false },
          { value: reserved ? null : score.toFixed(1).replace('.', ','), name: t({ es: 'Favorabilidad', en: 'Favorability' }), role: reserved ? t({ es: 'Bajo el mínimo', en: 'Below minimum' }) : t({ es: 'De 1 a 5', en: '1 to 5' }), fill: fills[1], color: ring, dim: reserved },
          { value: '', name: hint.band, role: t({ es: 'Lectura', en: 'Reading' }), fill: fills[2], color: reserved ? ring : favColor(score), dim: reserved },
        ]}
      />
    )
  }

  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <svg viewBox="0 0 1000 230" className="w-full overflow-visible" role="img" aria-label={t({ es: 'Las respuestas de un área se vuelven favorabilidad y una lectura, salvo que el grupo no llegue al mínimo', en: 'An area’s answers become favorability and a reading, unless the group is below the minimum' })}>
        <defs>
          <linearGradient id="enc-branch" x1="0" x2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="0.55" stopColor="rgb(var(--glow))" />
            <stop offset="1" stopColor="rgb(var(--spark))" />
          </linearGradient>
        </defs>
        <path d={FIBER} fill="none" stroke="url(#enc-branch)" strokeOpacity={0.4} strokeWidth={1.5} />
        {!reducedMotion && (
          <path key={step} d={reserved ? FIBER_HALF : FIBER} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 0.92" className="branch-pulse" style={{ filter: 'drop-shadow(0 0 6px rgb(var(--signal)))' }} />
        )}

        {X.map((x, i) => {
          const dim = reserved && i > 0
          return (
            <g key={x} transform={`translate(${x} ${Y})`} style={{ opacity: dim ? 0.55 : 1, transition: 'opacity .6s' }}>
              <circle r={R + 18} fill={i === 2 && !reserved ? `${favColor(score)}22` : 'rgb(var(--signal) / 0.08)'} style={{ transition: 'fill .6s' }} />
              <circle r={R} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.12} strokeWidth={4} strokeDasharray={dim ? '4 6' : undefined} data-fiber-from={i === 2 ? 'enc-puntos' : undefined} />
              <circle r={R} fill="none" stroke={i === 2 ? favColor(score) : 'url(#enc-branch)'} strokeWidth={4} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - fills[i])} transform="rotate(-90)" style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1), stroke .6s' }} />
              {i === 0 && <text y={8} textAnchor="middle" className="branch-value fill-paper font-medium tabular-nums">{hint.responses}</text>}
              {i === 1 && !reserved && <text y={8} textAnchor="middle" className="branch-value fill-paper font-medium tabular-nums">{score.toFixed(1).replace('.', ',')}</text>}
              {i === 1 && reserved && (
                <g className="stroke-paper" fill="none" strokeWidth={2.4} transform="translate(-11 -13)">
                  <rect x={1} y={10} width={20} height={15} rx={3} />
                  <path d="M5.5 10V6.5a5.5 5.5 0 0 1 11 0V10" />
                </g>
              )}
              {i === 2 && <circle r={9} fill={reserved ? 'transparent' : favColor(score)} stroke={reserved ? 'rgb(255 255 255 / .4)' : 'none'} strokeDasharray="3 3" style={{ transition: 'fill .6s' }} />}
              <text y={-R - 28} textAnchor="middle" className="branch-name fill-paper">
                {i === 0 ? AREAS[area] : i === 1 ? t({ es: 'Favorabilidad', en: 'Favorability' }) : hint.band}
              </text>
              <text y={R + 34} textAnchor="middle" className="branch-role fill-paper/50 font-mono uppercase tracking-[0.14em]">
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
      <figcaption className="mt-4 text-center font-mono text-[11px] text-white/45">
        {t({ es: 'Mapa de calor real · «Propósito y estrategia», área por área', en: 'Real heatmap · “Purpose and strategy”, area by area' })}
      </figcaption>
    </figure>
  )
}
