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

/** Las cuatro cifras protagonistas, junto al costo. */
const TOP: readonly Kpi[] = [
  { value: 229, label: { es: 'Ejecuciones', en: 'Runs' }, note: { es: 'veces que trabajó un agente', en: 'times an agent worked' } },
  { value: 2655, label: { es: 'Consultas', en: 'Queries' }, note: { es: 'a IA y 4 proveedores', en: 'to AI and 4 providers' } },
  { value: 34, label: { es: 'Empresas aprobadas', en: 'Approved companies' }, note: { es: '8 % de las revisadas', en: '8% of those reviewed' }, tone: 'green' },
  { value: 1.84, decimals: 2, prefix: 'US$', label: { es: 'Por aprobada', en: 'Per approved' }, note: { es: 'costo ÷ aprobadas', en: 'cost ÷ approved' }, tone: 'green' },
]

/** Las cifras de apoyo, junto a la matriz. */
const SIDE: readonly Kpi[] = [
  { value: 0.2111, decimals: 4, prefix: 'US$', label: { es: 'Costo medio', en: 'Average cost' }, note: { es: 'por ejecución', en: 'per run' } },
  { value: 18, label: { es: 'Personas activas', en: 'Active people' }, note: { es: '10 equipos', en: '10 teams' } },
  { value: 38, label: { es: 'Búsquedas', en: 'Searches' }, note: { es: '2,1 por persona', en: '2.1 per person' } },
  { value: 117, label: { es: 'Errores', en: 'Errors' }, note: { es: 'fallidas, a la vista', en: 'failed, in plain sight' }, tone: 'red' },
  { value: 8, label: { es: 'En curso', en: 'Running' }, note: { es: 'agentes ahora', en: 'agents now' }, tone: 'live' },
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
      <p className={`mt-1.5 text-[clamp(1.4rem,1.1rem+0.9vw,2rem)] font-light leading-none tabular-nums ${tone}`}>
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
      {/* Collage: costo protagonista, cifras clave, cuándo y cómo se usa, y la matriz por rol */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-[24px] border border-[#6b8cff]/40 bg-gradient-to-br from-[#18203d] via-[#141826] to-[#121318] p-6 lg:col-span-4 lg:row-span-2">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-[radial-gradient(closest-side,rgba(126,43,224,0.4),transparent)] motion-reduce:animate-none" aria-hidden="true" />
          <p className="mono-label text-white/50">{t({ es: 'Costo estimado de IA', en: 'Estimated AI cost' })}</p>
          <p className="mt-4 text-[clamp(2.6rem,1.8rem+2.6vw,4.2rem)] font-light leading-none tabular-nums text-signal"><Num value={62.66} on={on} decimals={2} prefix="US$" />+</p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">{t({ es: 'Todo lo que hicieron los agentes en Producción. Si un proveedor no reporta el costo queda «desconocido», nunca cero: por eso el «+».', en: 'Everything the agents did in Production. If a provider doesn’t report cost it stays “unknown”, never zero: hence the “+”.' })}</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center" aria-hidden="true">
            {[{ v: '19,57', l: { es: 'Admin', en: 'Admin' } }, { v: '20,16', l: { es: 'Líder', en: 'Lead' } }, { v: '22,91', l: { es: 'Vendedor', en: 'Rep' } }].map((r, i) => (
              <div key={r.v}>
                <div className="flex h-20 items-end justify-center">
                  <span className="w-8 rounded-t-md bg-gradient-to-t from-[#285ee6] to-[#8fa6ff] transition-[height] duration-700 ease-expo" style={{ height: on ? `${(Number(r.v.replace(',', '.')) / 23) * 100}%` : '0%', transitionDelay: `${400 + i * 120}ms` }} />
                </div>
                <p className="mt-1 text-[11px] text-white/55">{t(r.l)} · US${r.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-8">
          {TOP.map((k, i) => <KpiCard key={k.label.es} k={k} on={on} i={i} />)}
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:col-span-8">
          <UsageHeatmap />
          <UsageTimeline />
        </div>
        <div className="min-w-0 lg:col-span-9"><UsageMatrix /></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:col-span-3 lg:grid-cols-1">
          {SIDE.map((k, i) => <KpiCard key={k.label.es} k={k} on={on} i={i + 4} />)}
        </div>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Cifras agregadas reales del panel de Producción (19-11-2026) · mapa de calor y curva, aproximados', en: 'Real aggregate figures from the Production panel (19 Nov 2026) · heatmap and curve approximate' })}</p>
    </div>
  )
}
