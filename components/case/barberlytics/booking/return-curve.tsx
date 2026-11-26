'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'
import { ReturnPhone } from './phone/return-phone'
import { usePhone } from './use-phone'

/** Lienzo de la curva */
const W = 900
const H = 260
const PAD = { left: 40, right: 60, top: 30, bottom: 40 }
/** Escala vertical (% de clientes que vuelven) */
const MIN = 56
const MAX = 76
/** Se dibuja sola: un tramo por mes (ms) */
const AUTO = { intro: 300, step: 180 }

const fmt = (v: number, unit: string, label?: string) => label ?? `${v}${unit === '%' ? ' %' : unit}`

/**
 * 06 · Impacto: los clientes que vuelven, mes a mes, como una curva que se
 * dibuja sola y cruza el día en que sale la nueva reserva. Debajo, las cuatro
 * cifras: el cambio a la vista; el antes y el ahora, al tocarlas.
 */
export function ReturnCurve() {
  const { t, locale } = useLocale()
  const { impact } = BOOKING_CASE
  const { values, launch } = impact.retention
  const months = impact.retention.months[locale === 'en' ? 'en' : 'es']
  const { ref, step, done } = useAutoSteps<HTMLDivElement>(values.length, AUTO)
  const [picked, setPicked] = useState<number | null>(null)

  const x = (i: number) => PAD.left + ((W - PAD.left - PAD.right) * i) / (values.length - 1)
  const y = (v: number) => PAD.top + ((H - PAD.top - PAD.bottom) * (MAX - v)) / (MAX - MIN)
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')
  const area = `${line} L${x(values.length - 1)} ${H - PAD.bottom} L${x(0)} ${H - PAD.bottom} Z`
  const drawn = Math.max(0, step - 1) / (values.length - 1)
  const lastV = values[values.length - 1]

  const phone = usePhone()
  const kpi = picked !== null ? impact.kpis[picked] : null
  const caption = kpi
    ? { tag: t(kpi.label), title: `${fmt(kpi.before, kpi.unit, 'beforeLabel' in kpi && kpi.beforeLabel ? t(kpi.beforeLabel) : undefined)} → ${fmt(kpi.after, kpi.unit)}`, sub: t(kpi.delta) }
    : { tag: t(impact.retention.title), title: t({ es: 'Quien vuelve encuentra lo de siempre ya armado, y vuelve más.', en: 'Returning clients find the usual already set, and come back more.' }), sub: t({ es: 'Escenario de referencia del caso: se reemplaza por los datos de las barberías cuando lleguen.', en: 'The case’s reference scenario: to be replaced by the shops’ data as it arrives.' }) }

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede tag={caption.tag} title={caption.title} sub={caption.sub} swapKey={picked ?? 'all'} />

      {phone ? (
        <ReturnPhone months={months} values={values} launch={launch} launchLabel={impact.retention.launchLabel} step={step} stepMs={AUTO.step} done={done} />
      ) : (
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-8 block h-auto max-h-[40vh] w-full max-w-[900px] overflow-visible" role="img" aria-label={`${t(impact.retention.title)}: ${values.join(', ')} %`}>
        <defs>
          <linearGradient id="bk-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--bk))" stopOpacity={0.22} />
            <stop offset="1" stopColor="rgb(var(--bk))" stopOpacity={0} />
          </linearGradient>
          <clipPath id="bk-reveal">
            <rect x={0} y={0} height={H} width={W} style={{ transformOrigin: '0 0', transform: `scaleX(${(PAD.left + (W - PAD.left - PAD.right) * drawn + 8) / W})`, transition: `transform ${AUTO.step}ms linear` }} />
          </clipPath>
        </defs>
        {months.map((m, i) => (
          <text key={m} x={x(i)} y={H - 10} textAnchor="middle" className="bk-t-axis fill-current font-mono uppercase opacity-40" letterSpacing="0.1em">{m}</text>
        ))}
        {/* El día en que sale la nueva reserva */}
        <line x1={x(launch)} x2={x(launch)} y1={PAD.top - 10} y2={H - PAD.bottom} stroke="white" strokeOpacity={0.3} strokeDasharray="3 5" />
        <text x={x(launch) + 8} y={PAD.top - 2} className="bk-t-note fill-current font-mono uppercase opacity-60" letterSpacing="0.12em">{t(impact.retention.launchLabel)}</text>

        <g clipPath="url(#bk-reveal)">
          <path d={area} fill="url(#bk-area)" />
          <path d={line} fill="none" stroke="rgb(var(--bk))" strokeWidth={2.2} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgb(var(--bk) / 0.6))' }} />
          {values.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 6 : 3} fill={i === values.length - 1 ? 'white' : 'rgb(var(--bk))'} />
          ))}
        </g>
        <text x={x(0)} y={y(values[0]) - 14} textAnchor="middle" className="bk-t-row fill-current opacity-55">{values[0]} %</text>
        <text x={x(values.length - 1)} y={y(lastV) - 18} textAnchor="middle" className="bk-t-big fill-current" fontWeight={300} style={{ opacity: done ? 1 : 0, transition: 'opacity .5s' }}>{lastV} %</text>
      </svg>
      )}

      {/* Las cuatro cifras: el cambio a la vista; el antes y el ahora, al tocarlas */}
      <ol className="mt-12 grid w-full max-w-[900px] grid-cols-2 gap-y-8 md:grid-cols-4">
        {impact.kpis.map((k, i) => (
          <li key={k.label.es} className="flex justify-center">
            <button type="button" aria-pressed={picked === i} onClick={() => setPicked((p) => (p === i ? null : i))} className="group relative flex flex-col items-center px-2 text-center outline-none">
              <span className={`whitespace-nowrap text-[clamp(1.4rem,1rem+1.4vw,2.4rem)] font-light leading-none tabular-nums transition-opacity duration-500 ${picked === i ? 'text-[rgb(var(--bk))] opacity-100' : done ? 'opacity-85 group-hover:opacity-100' : 'opacity-20'}`}>{t(k.delta)}</span>
              <span className={`mt-3 text-balance text-[13px] leading-snug transition-opacity ${picked === i ? 'opacity-100' : 'opacity-55 group-hover:opacity-85'}`}>{t(k.label)}</span>
              {i === impact.kpis.length - 1 && <span data-fiber-from="bk-demo" className="absolute bottom-0 left-1/2 h-px w-px" />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
