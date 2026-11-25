'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'

const { impact } = BOOKING_CASE

/* ── Gráfica de retención (línea con área y el momento del lanzamiento) ─── */

const CHART = { w: 640, h: 300, padX: 36, padTop: 24, padBottom: 40, min: 55, max: 76 }

function RetentionChart() {
  const { t, locale } = useLocale()
  const { values, months, launch, launchLabel, title } = impact.retention
  const step = (CHART.w - CHART.padX * 2) / (values.length - 1)
  const y = (v: number) => CHART.padTop + (1 - (v - CHART.min) / (CHART.max - CHART.min)) * (CHART.h - CHART.padTop - CHART.padBottom)
  const x = (i: number) => CHART.padX + i * step
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(values.length - 1)},${CHART.h - CHART.padBottom} L${x(0)},${CHART.h - CHART.padBottom} Z`
  const ticks = [60, 65, 70, 75]

  return (
    <figure data-reveal className="border border-fg/15 p-6">
      <figcaption className="mono-label mb-4 opacity-70">{t(title)}</figcaption>
      <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className="h-auto w-full" role="img" aria-label={`${t(title)}: ${values[0]}% → ${values[values.length - 1]}%`}>
        <defs>
          <linearGradient id="retention-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--signal))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(var(--signal))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={CHART.padX} x2={CHART.w - CHART.padX} y1={y(tick)} y2={y(tick)} stroke="currentColor" strokeOpacity="0.1" />
            <text x={CHART.padX - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.5">{tick}%</text>
          </g>
        ))}
        <line x1={x(launch)} x2={x(launch)} y1={CHART.padTop - 8} y2={CHART.h - CHART.padBottom} stroke="#d9b36a" strokeDasharray="4 5" strokeWidth="1.5" />
        <text x={x(launch) + 8} y={CHART.padTop + 2} fontSize="12" fill="#b58a3a">{t(launchLabel)}</text>
        <path d={area} fill="url(#retention-fill)" />
        <path d={line} fill="none" stroke="rgb(var(--signal))" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} data-draw="" />
        {values.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 6 : 3.5} fill={i === values.length - 1 ? 'rgb(var(--signal))' : 'rgb(var(--bg))'} stroke="rgb(var(--signal))" strokeWidth="2" />
        ))}
        <text x={x(values.length - 1)} y={y(values[values.length - 1]) - 14} textAnchor="end" fontSize="15" fontWeight="600" fill="rgb(var(--signal))">{values[values.length - 1]}%</text>
        {months[locale].map((m, i) => (
          <text key={m} x={x(i)} y={CHART.h - 14} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.55">{m}</text>
        ))}
      </svg>
    </figure>
  )
}

/* ── Barras apiladas: cómo reservan, antes y ahora ─────────────────────── */

const CHANNEL_COLORS = ['bg-signal', 'bg-[#d9b36a]', 'bg-fg/25']

function ChannelBars() {
  const { t } = useLocale()
  const { title, rows, legend } = impact.channels
  return (
    <figure data-reveal className="flex flex-col border border-fg/15 p-6">
      <figcaption className="mono-label mb-6 opacity-70">{t(title)}</figcaption>
      <div className="flex flex-1 flex-col justify-center gap-6">
        {rows.map((row) => (
          <div key={row.label.es}>
            <p className="mb-2 text-sm opacity-70">{t(row.label)}</p>
            <div className="flex h-9 w-full overflow-hidden" role="img" aria-label={`${t(row.label)}: ${row.parts.map((p, i) => `${t(legend[i])} ${p}%`).join(', ')}`}>
              {row.parts.map((part, i) => (
                <span key={i} data-reveal="right" className={`flex items-center justify-start px-2 text-xs font-medium ${CHANNEL_COLORS[i]} ${i === 0 ? 'text-paper' : ''}`} style={{ width: `${part}%` }}>
                  {part}%
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs opacity-75">
        {legend.map((item, i) => (
          <li key={item.es} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 ${CHANNEL_COLORS[i]}`} aria-hidden="true" />
            {t(item)}
          </li>
        ))}
      </ul>
    </figure>
  )
}

/** 07 · Impacto: métricas de uso, cómo cambiaron y lo que se aprendió. */
export function BookingImpact() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal="mask" className="max-w-[34ch] text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t(impact.lead)}</p>

      <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
        {impact.kpis.map((kpi) => (
          <div key={kpi.label.es} data-reveal className="flex flex-col bg-bg p-6">
            <dt className="mono-label opacity-60">{t(kpi.label)}</dt>
            <dd className="mt-5 flex items-baseline gap-1">
              <span data-count={kpi.after} className="text-[clamp(2.8rem,2rem+2.4vw,4.2rem)] font-light leading-none tabular-nums">{kpi.after}</span>
              <span className="text-xl font-light">{kpi.unit}</span>
            </dd>
            <dd className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-signal px-2 py-0.5 text-xs font-medium text-on-signal">{t(kpi.delta)}</span>
              <span className="opacity-55">
                {t({ es: 'antes', en: 'before' })} {'beforeLabel' in kpi && kpi.beforeLabel ? t(kpi.beforeLabel) : `${kpi.before}${kpi.unit}`}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RetentionChart />
        </div>
        <div className="lg:col-span-2">
          <ChannelBars />
        </div>
      </div>

      <p data-reveal className="mt-10 flex flex-wrap items-baseline gap-4 border-l-2 border-signal pl-5">
        <span className="text-[clamp(2.6rem,2rem+2vw,3.8rem)] font-light leading-none text-signal">
          <span data-count={impact.proposal.value}>{impact.proposal.value}</span>%
        </span>
        <span className="max-w-[36ch] text-lg leading-snug opacity-85">{t(impact.proposal.label)}</span>
      </p>

      <div className="mt-14">
        <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: 'Del lado del producto', en: 'On the product side' })}</p>
        <ul className="flex flex-wrap gap-x-12 gap-y-6">
          {impact.product.map((item) => (
            <li key={item.label.es} data-reveal>
              <span className="block text-3xl font-light tabular-nums">{item.value}</span>
              <span className="text-sm opacity-65">{t(item.label)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <div>
          <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: 'Lo que se cerró', en: 'What got closed' })}</p>
          <ul className="space-y-3">
            {impact.closed.map((item) => (
              <li key={item.es} data-reveal className="flex gap-3">
                <span className="text-signal" aria-hidden="true">✓</span>
                <span>{t(item)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: 'Aprendizajes', en: 'Learnings' })}</p>
          <ol className="space-y-5">
            {impact.learnings.map((l, i) => (
              <li key={l.es} data-reveal className="border-t border-fg/15 pt-3">
                <span className="mono-label text-signal">0{i + 1}</span>
                <p className="mt-2 text-lg leading-snug">{t(l)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
