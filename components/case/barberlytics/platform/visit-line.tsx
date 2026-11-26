'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { APPTS, SERVICE, STAGE, type Stage } from './calendar-model'
import { useNarrow } from '../use-narrow'
import { VisitColumn } from './visit-column'

/** Las etapas por las que pasa una cita en la rejilla, en orden (la plataforma real) */
const STAGES: readonly Stage[] = ['upcoming', 'waiting', 'seated', 'toCollect', 'paid']
/** Cada cuánto avanza la cita a su siguiente etapa (ms) */
const STEP_MS = 1300
/** Las citas que van pasando por la línea, una tras otra (del día de ejemplo) */
const VISITS = APPTS.filter((a) => a.type !== 'SIN CITA').slice(0, 6)

const X0 = 110
const X1 = 890
const Y = 130
const xAt = (i: number) => X0 + ((X1 - X0) * i) / (STAGES.length - 1)
/** La fibra: una sola línea que ondula apenas entre las etapas */
const FIBER = STAGES.slice(1).reduce((d, _, i) => {
  const a = xAt(i)
  const b = xAt(i + 1)
  const bend = i % 2 === 0 ? -22 : 22
  return `${d} C ${a + (b - a) * 0.4} ${Y + bend}, ${a + (b - a) * 0.6} ${Y + bend}, ${b} ${Y}`
}, `M${X0} ${Y}`)

interface VisitLineProps {
  running: boolean
  reducedMotion: boolean
}

/**
 * La portada de Plataforma en una sola línea horizontal: una cita entra
 * agendada y avanza, etapa por etapa, hasta cobrada. Sobre la etapa en la que
 * va, el botón que la plataforma le pone a la tarjeta: Ingresar, Sentar, Cobrar.
 */
export function VisitLine({ running, reducedMotion }: VisitLineProps) {
  const { t } = useLocale()
  const [tick, setTick] = useState(reducedMotion ? STAGES.length - 1 : 0)

  useEffect(() => {
    if (!running || reducedMotion) return
    const id = window.setInterval(() => setTick((n) => n + 1), STEP_MS)
    return () => window.clearInterval(id)
  }, [running, reducedMotion])

  // Cada vuelta, una cita distinta; la última etapa se sostiene un paso más antes de volver.
  const lap = STAGES.length + 1
  const at = Math.min(STAGES.length - 1, tick % lap)
  const visit = VISITS[Math.floor(tick / lap) % VISITS.length]
  const stage = STAGES[at]
  const s = STAGE[stage]
  const narrow = useNarrow('(max-width: 767px)')

  if (narrow) {
    return (
      <div>
        <VisitColumn stages={STAGES} at={at} visit={visit} />
        <p className="case-note mx-auto mt-6 text-center">
          {t({ es: 'Día de ejemplo · cada cita, de agendada a cobrada sin salir de la rejilla', en: 'Sample day · every visit, from booked to paid without leaving the grid' })}
        </p>
      </div>
    )
  }

  return (
    <figure className="relative mx-auto w-full max-w-[980px] pt-[68px]">
      {/* La tarjeta de la cita, sobre la etapa en la que va (en HTML: no se encoge con el dibujo en teléfono) */}
      <div
        aria-hidden="true"
        className="absolute top-0 z-10 w-[190px] -translate-x-1/2"
        style={{ left: `clamp(95px, ${xAt(at) / 10}%, calc(100% - 95px))`, transition: at === 0 ? 'none' : 'left 700ms cubic-bezier(.65,0,.35,1)' }}
      >
        <div className="flex h-[52px] items-center gap-2 rounded-xl border px-3 text-left text-[#efe9dd] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] transition-colors duration-500" style={{ borderColor: `${s.hue}99`, background: `linear-gradient(${s.hue}2e, ${s.hue}12), #141210` }}>
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SERVICE[visit.services[0]].hue }} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium leading-tight">{visit.client}</span>
            <span className="block truncate text-[10.5px] leading-tight text-white/55">{SERVICE[visit.services[0]].name} · US$ {visit.price}</span>
          </span>
          {s.next ? (
            <span key={s.next} className="pl-pop shrink-0 rounded-md bg-[#d9b36a] px-2 py-1 text-[10.5px] font-semibold text-[#16130f]">{s.next}</span>
          ) : (
            <span className="pl-pop shrink-0 text-[12px] text-[#4cc98d]">✓</span>
          )}
        </div>
      </div>
      <svg viewBox="0 100 1000 100" className="w-full overflow-visible" role="img" aria-label={t({ es: 'Una cita avanza por la rejilla: agendada, en espera, en silla, por cobrar y cobrada', en: 'A visit moves across the grid: booked, waiting, in chair, to charge and paid' })}>
        <defs>
          <linearGradient id="pl-visit-fiber" x1="0" x2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="0.6" stopColor="rgb(var(--glow))" />
            <stop offset="1" stopColor="#4cc98d" />
          </linearGradient>
        </defs>
        <path d={FIBER} fill="none" stroke="url(#pl-visit-fiber)" strokeOpacity={0.4} strokeWidth={1.5} />
        {/* Lo que ya recorrió la cita, más brillante */}
        <path
          d={FIBER}
          fill="none"
          stroke="url(#pl-visit-fiber)"
          strokeWidth={2.4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - at / (STAGES.length - 1)}
          style={{ transition: at === 0 ? 'none' : 'stroke-dashoffset 700ms cubic-bezier(.65,0,.35,1)', filter: 'drop-shadow(0 0 5px rgb(var(--signal) / 0.6))' }}
        />

        {STAGES.map((id, i) => {
          const x = xAt(i)
          const done = i < at
          const here = i === at
          const hue = STAGE[id].hue
          return (
            <g key={id} transform={`translate(${x} ${Y})`}>
              <circle r={26} fill={hue} opacity={here ? 0.22 : 0} style={{ transition: 'opacity .5s' }} />
              {here && <circle r={15} fill="none" stroke={hue} strokeWidth={1.5} className="pl-hot" />}
              <circle
                r={here ? 11 : 8}
                fill={here ? '#fffaf0' : done ? hue : 'rgb(var(--void))'}
                stroke={here || done ? hue : 'rgb(255 255 255 / 0.4)'}
                strokeWidth={2}
                style={{ transition: 'r .4s, fill .4s, stroke .4s', filter: here ? `drop-shadow(0 0 10px ${hue})` : undefined }}
                data-fiber-from={i === STAGES.length - 1 ? 'pl-puntos' : undefined}
              />
              <text y={52} textAnchor="middle" className="pl-hero-stage fill-paper font-mono uppercase tracking-[0.12em]" style={{ opacity: here ? 1 : done ? 0.6 : 0.35, transition: 'opacity .4s' }}>
                {STAGE[id].label}
              </text>
            </g>
          )
        })}

      </svg>
      <figcaption className="case-note mx-auto mt-3 text-center">
        {t({ es: 'Día de ejemplo · cada cita, de agendada a cobrada sin salir de la rejilla', en: 'Sample day · every visit, from booked to paid without leaving the grid' })}
      </figcaption>
    </figure>
  )
}
