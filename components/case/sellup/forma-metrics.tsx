'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useInView } from './ui'
import { useCount } from './forma-catalog-map'
import { UsageMatrix } from './forma-usage-matrix'
import { UsageHeatmap, UsageTimeline } from './forma-usage-charts'

/** 5.6 · Uso de IA y costos: cifras reales del panel de Producción (19-11-2026), todo animado. */

/** Número que cuenta hasta su valor; `decimals` para dinero. */
function Num({ value, on, decimals = 0, prefix = '', suffix = '' }: { value: number; on: boolean; decimals?: number; prefix?: string; suffix?: string }) {
  const { reducedMotion } = useA11y()
  const scale = Math.pow(10, decimals)
  const counted = useCount(Math.round(value * scale), on && !reducedMotion) / scale
  const n = reducedMotion ? value : counted
  return <>{prefix}{n.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

interface Kpi {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: L
  note: L
  tone?: 'green' | 'red' | 'live'
}

/** El principal: lo que cuesta y cuánto trabajaron los agentes. */
const MAIN: readonly Kpi[] = [
  { value: 229, label: { es: 'Ejecuciones', en: 'Runs' }, note: { es: 'veces que trabajó un agente', en: 'times an agent worked' } },
  { value: 2655, label: { es: 'Consultas', en: 'Queries' }, note: { es: 'a 4 proveedores', en: 'to 4 providers' } },
  { value: 0.2111, decimals: 4, prefix: 'US$', label: { es: 'Costo medio', en: 'Average cost' }, note: { es: 'por ejecución', en: 'per run' } },
  { value: 117, label: { es: 'Errores', en: 'Errors' }, note: { es: 'consultas y ejecuciones fallidas', en: 'failed queries and runs' }, tone: 'red' },
  { value: 8, label: { es: 'En curso', en: 'Running' }, note: { es: 'agentes trabajando ahora', en: 'agents working now' }, tone: 'live' },
]

/** Las cifras de la pestaña «Mapa de uso». */
const MAP: readonly Kpi[] = [
  { value: 18, label: { es: 'Personas activas', en: 'Active people' }, note: { es: '10 equipos con uso', en: '10 teams using it' } },
  { value: 38, label: { es: 'Búsquedas de empresas', en: 'Company searches' }, note: { es: '2,1 por persona', en: '2.1 per person' } },
  { value: 34, label: { es: 'Empresas aprobadas', en: 'Approved companies' }, note: { es: '8 % de las que llegaron a revisión', en: '8% of those reviewed' }, tone: 'green' },
  { value: 1.84, decimals: 2, prefix: 'US$', label: { es: 'Por empresa aprobada', en: 'Per approved company' }, note: { es: 'costo estimado ÷ aprobadas', en: 'estimated cost ÷ approved' }, tone: 'green' },
]

function KpiCard({ k, on, i }: { k: Kpi; on: boolean; i: number }) {
  const { t } = useLocale()
  const tone = k.tone === 'green' ? 'text-emerald-300' : k.tone === 'red' ? 'text-red-300' : 'text-white'
  return (
    <div
      className={`relative rounded-[18px] border bg-[#141517]/90 p-4 transition-all duration-500 ease-expo ${k.tone === 'green' ? 'border-emerald-400/25' : 'border-white/10'}`}
      style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(14px) scale(0.97)', transitionDelay: `${150 + i * 70}ms` }}
    >
      <p className="flex items-center gap-2 text-xs text-white/55">
        {k.tone === 'live' && <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70 motion-reduce:animate-none" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>}
        {t(k.label)}
      </p>
      <p className={`mt-1.5 text-[clamp(1.6rem,1.2rem+1.2vw,2.3rem)] font-light leading-none tabular-nums ${tone}`}>
        <Num value={k.value} on={on} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} />
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-white/45">{t(k.note)}</p>
    </div>
  )
}

export function UsageMetrics() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.15)
  const on = seen || reducedMotion
  return (
    <div ref={ref}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[24px] border border-[#6b8cff]/40 bg-gradient-to-br from-[#18203d] via-[#141826] to-[#121318] p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-[radial-gradient(closest-side,rgba(126,43,224,0.4),transparent)] motion-reduce:animate-none" aria-hidden="true" />
          <p className="mono-label text-white/50">{t({ es: 'Costo estimado de IA · todo el periodo', en: 'Estimated AI cost · whole period' })}</p>
          <p className="mt-4 text-[clamp(3rem,2rem+4.5vw,5.6rem)] font-light leading-none tabular-nums text-signal"><Num value={62.66} on={on} decimals={2} prefix="US$" />+</p>
          <p className="mt-4 max-w-[36ch] text-white/70">{t({ es: 'Por todo lo que hicieron los agentes en Producción. Si un proveedor no reporta el costo, queda «desconocido», nunca cero: por eso el «+».', en: 'For everything the agents did in Production. If a provider doesn’t report cost, it stays “unknown”, never zero: hence the “+”.' })}</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center" aria-hidden="true">
            {[{ v: '19,57', l: { es: 'Admin', en: 'Admin' } }, { v: '20,16', l: { es: 'Líder', en: 'Lead' } }, { v: '22,91', l: { es: 'Vendedor', en: 'Rep' } }].map((r, i) => (
              <div key={r.v}>
                <div className="flex h-16 items-end justify-center">
                  <span className="w-8 rounded-t-md bg-gradient-to-t from-[#285ee6] to-[#8fa6ff] transition-[height] duration-700 ease-expo" style={{ height: on ? `${(Number(r.v.replace(',', '.')) / 23) * 100}%` : '0%', transitionDelay: `${400 + i * 120}ms` }} />
                </div>
                <p className="mt-1 text-[11px] text-white/55">{t(r.l)} · US${r.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MAIN.map((k, i) => <KpiCard key={k.label.es} k={k} on={on} i={i} />)}
          <div className="flex items-center rounded-[18px] border border-dashed border-white/10 p-4 text-[12px] leading-snug text-white/50">
            {t({ es: 'Del panel «Uso de IA, costos y efectividad» · Resumen', en: 'From the “AI usage, costs and effectiveness” panel · Summary' })}
          </div>
        </div>
      </div>

      <p className="mono-label mb-3 mt-10 text-white/50">{t({ es: 'Mapa de uso · quién usa qué y cuánto rinde', en: 'Usage map · who uses what and how it pays off' })}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {MAP.map((k, i) => <KpiCard key={k.label.es} k={k} on={on} i={i + 4} />)}
      </div>
      <div className="mt-3"><UsageMatrix /></div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <UsageHeatmap />
        <UsageTimeline />
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Cifras agregadas reales del panel de Producción (19-11-2026) · mapa de calor y curva, aproximados', en: 'Real aggregate figures from the Production panel (19 Nov 2026) · heatmap and curve approximate' })}</p>
    </div>
  )
}
