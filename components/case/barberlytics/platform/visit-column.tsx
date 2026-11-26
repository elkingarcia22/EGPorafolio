'use client'

import { useLocale } from '@/lib/i18n'
import { SERVICE, STAGE, type Appt, type Stage } from './calendar-model'

/** Alto de cada tramo de la línea, de una etapa a la siguiente (px) */
const ROW = 72
/** Dónde corre la fibra, desde el borde izquierdo (px) */
const FIBER_X = 22
const TOP = 26

interface VisitColumnProps {
  stages: readonly Stage[]
  at: number
  visit: Appt
}

const yAt = (i: number) => TOP + i * ROW

/** La fibra en vertical: ondula apenas de una etapa a la otra */
function fiberPath(n: number): string {
  let d = `M${FIBER_X} ${yAt(0)}`
  for (let i = 0; i < n - 1; i++) {
    const a = yAt(i)
    const b = yAt(i + 1)
    const bend = i % 2 === 0 ? -9 : 9
    d += ` C ${FIBER_X + bend} ${a + ROW * 0.4}, ${FIBER_X + bend} ${a + ROW * 0.6}, ${FIBER_X} ${b}`
  }
  return d
}

/**
 * La portada en el teléfono: la misma cita recorre sus etapas, pero hacia
 * abajo. La fibra baja por la izquierda, cada etapa es un nodo con su nombre,
 * y la tarjeta de la cita baja junto a la etapa en la que va.
 */
export function VisitColumn({ stages, at, visit }: VisitColumnProps) {
  const { t } = useLocale()
  const s = STAGE[stages[at]]
  const height = yAt(stages.length - 1) + TOP
  const d = fiberPath(stages.length)

  return (
    <figure className="relative mx-auto w-full max-w-[400px]" style={{ height }}>
      <svg width={FIBER_X * 2} height={height} className="absolute left-0 top-0 overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="pl-visit-fiber-v" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="0.6" stopColor="rgb(var(--glow))" />
            <stop offset="1" stopColor="#4cc98d" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#pl-visit-fiber-v)" strokeOpacity={0.35} strokeWidth={1.5} />
        <path
          d={d}
          fill="none"
          stroke="url(#pl-visit-fiber-v)"
          strokeWidth={2.4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - at / (stages.length - 1)}
          style={{ transition: at === 0 ? 'none' : 'stroke-dashoffset 700ms cubic-bezier(.65,0,.35,1)', filter: 'drop-shadow(0 0 5px rgb(var(--signal) / 0.6))' }}
        />
        {stages.map((id, i) => {
          const done = i < at
          const here = i === at
          const hue = STAGE[id].hue
          return (
            <g key={id} transform={`translate(${FIBER_X} ${yAt(i)})`}>
              <circle r={18} fill={hue} opacity={here ? 0.22 : 0} style={{ transition: 'opacity .5s' }} />
              {here && <circle r={12} fill="none" stroke={hue} strokeWidth={1.5} className="pl-hot" />}
              <circle
                r={here ? 8 : 6}
                fill={here ? '#fffaf0' : done ? hue : 'rgb(var(--void))'}
                stroke={here || done ? hue : 'rgb(255 255 255 / 0.4)'}
                strokeWidth={2}
                style={{ transition: 'r .4s, fill .4s, stroke .4s', filter: here ? `drop-shadow(0 0 8px ${hue})` : undefined }}
                data-fiber-from={i === stages.length - 1 ? 'pl-puntos' : undefined}
              />
            </g>
          )
        })}
      </svg>

      {/* El nombre de cada etapa, junto a su nodo */}
      <ol className="absolute inset-y-0 left-[52px]" aria-label={t({ es: 'Una cita avanza por la rejilla: agendada, en espera, en silla, por cobrar y cobrada', en: 'A visit moves across the grid: booked, waiting, in chair, to charge and paid' })}>
        {stages.map((id, i) => (
          <li
            key={id}
            className="absolute -translate-y-1/2 whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.12em] transition-opacity duration-500"
            style={{ top: yAt(i), opacity: i === at ? 1 : i < at ? 0.6 : 0.35, color: i === at ? STAGE[id].hue : undefined }}
          >
            {STAGE[id].label}
          </li>
        ))}
      </ol>

      {/* La tarjeta de la cita baja junto a la etapa en la que va */}
      <div
        aria-hidden="true"
        className="absolute right-0 w-[min(196px,calc(100%-150px))] -translate-y-1/2"
        style={{ top: yAt(at), transition: at === 0 ? 'none' : 'top 700ms cubic-bezier(.65,0,.35,1)' }}
      >
        <div className="rounded-xl border px-3 py-2.5 text-left text-[#efe9dd] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] transition-colors duration-500" style={{ borderColor: `${s.hue}99`, background: `linear-gradient(${s.hue}2e, ${s.hue}12), #141210` }}>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SERVICE[visit.services[0]].hue }} />
            <span className="truncate text-[14px] font-medium leading-tight">{visit.client}</span>
          </span>
          <span className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-[12px] text-white/55">US$ {visit.price}</span>
            {s.next ? (
              <span key={s.next} className="pl-pop shrink-0 rounded-md bg-[#d9b36a] px-2 py-0.5 text-[12px] font-semibold text-[#16130f]">{s.next}</span>
            ) : (
              <span className="pl-pop shrink-0 text-[13px] text-[#4cc98d]">✓</span>
            )}
          </span>
        </div>
      </div>
    </figure>
  )
}
