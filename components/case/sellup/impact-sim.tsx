'use client'

import { useMemo, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { APP } from './platform'
import { BLUE, useInView } from './ui'
import { usd } from './ai-hooks'
import { project, type Projection } from './impact-model'

const W = 600
const H = 240
const PAD = { l: 8, r: 8, t: 16, b: 26 }
const MONTHS: readonly L[] = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => ({ es: m, en: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i] }))

/** Curva de ARR acumulado: el trabajo manual frente a SellUp, mes a mes. */
export function ArrChart({ p, seen }: { p: Projection; seen: boolean }) {
  const { t, locale } = useLocale()
  const max = Math.max(1, ...p.series.map(([, s]) => s)) * 1.08
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (p.series.length - 1)
  const y = (v: number) => H - PAD.b - (v / max) * (H - PAD.t - PAD.b)
  const line = (k: 0 | 1) => p.series.map((pt, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(pt[k]).toFixed(1)}`).join(' ')
  const area = `${line(1)} ${p.series.map((pt, i) => `L${x(p.series.length - 1 - i).toFixed(1)} ${y(p.series[p.series.length - 1 - i][0]).toFixed(1)}`).join(' ')} Z`
  const last = p.series[p.series.length - 1]
  const draw = { strokeDasharray: 1, strokeDashoffset: seen ? 0 : 1, transition: 'stroke-dashoffset 2200ms cubic-bezier(.16,1,.3,1), d 600ms' }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t({ es: 'ARR acumulado en 12 meses, manual frente a SellUp', en: 'Cumulative ARR over 12 months, manual vs SellUp' })}>
      <defs>
        <linearGradient id="arr-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={BLUE} stopOpacity="0.35" /><stop offset="1" stopColor={BLUE} stopOpacity="0.02" /></linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={PAD.l} x2={W - PAD.r} y1={y(max * f / 1.08)} y2={y(max * f / 1.08)} stroke="rgba(255,255,255,0.06)" />)}
      <path d={area} fill="url(#arr-area)" style={{ opacity: seen ? 1 : 0, transition: 'opacity 1200ms 900ms, d 600ms' }} />
      <path d={line(0)} fill="none" stroke="rgba(232,233,236,0.45)" strokeWidth="2" strokeDasharray="4 4" style={{ opacity: seen ? 1 : 0, transition: 'opacity 800ms, d 600ms' }} />
      <path d={line(1)} fill="none" stroke={BLUE} strokeWidth="3" pathLength={1} style={draw} />
      <circle cx={x(11)} cy={y(last[1])} r="5" fill={BLUE} style={{ opacity: seen ? 1 : 0, transition: 'opacity 400ms 2000ms, cy 600ms' }} />
      {MONTHS.map((m, i) => <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="rgba(232,233,236,0.4)">{t(m)}</text>)}
      <text x={x(11) - 8} y={y(last[1]) - 12} textAnchor="end" fontSize="13" fill={APP.text}>{usd(last[1], locale)}</text>
      <text x={x(11) - 8} y={y(last[0]) - 8} textAnchor="end" fontSize="11" fill="rgba(232,233,236,0.55)">{t({ es: 'Manual', en: 'Manual' })} {usd(last[0], locale)}</text>
    </svg>
  )
}

function Slider({ label, value, min, max, step = 1, suffix, onChange }: { label: L; value: number; min: number; max: number; step?: number; suffix: L; onChange: (n: number) => void }) {
  const { t } = useLocale()
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-sm"><span className="opacity-70">{t(label)}</span><span className="tabular-nums">{value} {t(suffix)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[#5b7eff]" />
    </label>
  )
}

/** Simulador: cambia el equipo y el ritmo, y se recalculan ARR y retorno. */
export function ImpactSimulator() {
  const { t, locale } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [sellers, setSellers] = useState(6)
  const [perWeek, setPerWeek] = useState(25)
  const p = useMemo(() => project(sellers, perWeek), [sellers, perWeek])
  const out: readonly { v: string; l: L }[] = [
    { v: usd(p.year1, locale), l: { es: 'ARR incremental, primer año', en: 'Incremental ARR, year one' } },
    { v: usd(p.sellUpRunRate - p.manualRunRate, locale), l: { es: 'ARR incremental a ritmo pleno', en: 'Incremental ARR at full pace' } },
    { v: `${p.roi.toLocaleString(locale === 'en' ? 'en-US' : 'es-CO', { maximumFractionDigits: 1 })}×`, l: { es: 'retorno sobre el costo total', en: 'return on total cost' } },
    { v: Math.round(p.hoursYear).toLocaleString(locale === 'en' ? 'en-US' : 'es-CO'), l: { es: 'horas al año devueltas a vender', en: 'hours a year back to selling' } },
  ]
  return (
    <div ref={ref} className="grid gap-6 rounded-[20px] p-5 ring-1 ring-white/10 md:p-7 lg:grid-cols-[280px_minmax(0,1fr)]" style={{ background: APP.bg, color: APP.text }} data-reveal="device">
      <div className="space-y-6">
        <Slider label={{ es: 'Vendedores', en: 'Reps' }} value={sellers} min={2} max={15} suffix={{ es: '', en: '' }} onChange={setSellers} />
        <Slider label={{ es: 'Empresas por vendedor a la semana', en: 'Companies per rep a week' }} value={perWeek} min={10} max={40} suffix={{ es: '', en: '' }} onChange={setPerWeek} />
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/10 pt-5">
          {out.map((o) => (
            <div key={o.l.es}>
              <dt className="sr-only">{t(o.l)}</dt>
              <dd>
                <span className="block text-xl font-light tabular-nums text-[#a9baff]">{o.v}</span>
                <span className="mt-1 block text-[11px] leading-snug opacity-60">{t(o.l)}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-[11px] leading-snug opacity-45">
          {t({ es: `Costo total del año: ${usd(p.cost, locale)} (IA + plataforma). Supuestos: contrato promedio US$12.000, 20% de conexiones a reunión, 8% de reuniones a cierre.`, en: `Total yearly cost: ${usd(p.cost, locale)} (AI + platform). Assumptions: average deal US$12,000, 20% of connections to meeting, 8% of meetings to close.` })}
        </p>
      </div>
      <div className="min-w-0">
        <p className="mono-label mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 opacity-70">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4" style={{ background: BLUE }} />{t({ es: 'Con SellUp', en: 'With SellUp' })}</span>
          <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-dashed border-white/45" />{t({ es: 'Manual', en: 'Manual' })}</span>
        </p>
        <ArrChart p={p} seen={seen} />
      </div>
    </div>
  )
}
