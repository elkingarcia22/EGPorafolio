'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useInView } from './ui'
import { useCount } from './forma-catalog-map'
import { UsageScreen } from './forma-uso'
import { Laptop } from './device-frames'

/** 5.6 · Uso de IA y costos: las métricas reales de Producción como protagonistas. */

const AGENTS: readonly { name: L; cost: number; note: L }[] = [
  { name: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, cost: 44.67, note: { es: '31 aprobadas', en: '31 approved' } },
  { name: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, cost: 6.71, note: { es: '155 ejecuciones', en: '155 runs' } },
  { name: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' }, cost: 0.87, note: { es: '12 ejecuciones', en: '12 runs' } },
  { name: { es: 'Asistente de Slack', en: 'Slack assistant' }, cost: 0.63, note: { es: '—', en: '—' } },
  { name: { es: 'Empresas de HubSpot', en: 'HubSpot companies' }, cost: 0.14, note: { es: '—', en: '—' } },
]

/** Número que cuenta hasta su valor; `decimals` para dinero. */
function Num({ value, on, decimals = 0, prefix = '', suffix = '' }: { value: number; on: boolean; decimals?: number; prefix?: string; suffix?: string }) {
  const scale = Math.pow(10, decimals)
  const n = useCount(Math.round(value * scale), on) / scale
  return <>{prefix}{n.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

function Tile({ children, label, className = '' }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <div className={`rounded-[20px] border border-white/10 bg-[#141517]/90 p-5 backdrop-blur ${className}`}>
      <p className="font-light leading-none tabular-nums">{children}</p>
      <p className="mt-2 text-sm leading-snug text-white/60">{label}</p>
    </div>
  )
}

export function UsageMetrics() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.2)
  const max = AGENTS[0].cost
  return (
    <div ref={ref}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-[24px] border border-[#6b8cff]/40 bg-gradient-to-br from-[#18203d] via-[#141826] to-[#121318] p-6 sm:col-span-2 lg:row-span-2">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(126,43,224,0.35),transparent)]" aria-hidden="true" />
          <p className="mono-label text-white/50">{t({ es: 'Costo estimado de IA · todo el periodo', en: 'Estimated AI cost · whole period' })}</p>
          <p className="mt-4 text-[clamp(3.2rem,2rem+5vw,6rem)] font-light leading-none tabular-nums text-signal"><Num value={53.03} on={seen} decimals={2} prefix="US$" /></p>
          <p className="mt-4 max-w-[34ch] text-white/70">{t({ es: 'por todo lo que hicieron los agentes en Producción. Cada corrida deja su costo; si un proveedor no lo reporta, queda «desconocido», nunca cero.', en: 'for everything the agents did in Production. Every run logs its cost; if a provider doesn’t report it, it stays “unknown”, never zero.' })}</p>
          <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <span className="bg-emerald-400 transition-[width] duration-500 ease-expo" style={{ width: seen ? '73%' : '0%' }} />
            <span className="bg-red-400 transition-[width] delay-300 duration-500 ease-expo" style={{ width: seen ? '8%' : '0%' }} />
            <span className="bg-white/30 transition-[width] delay-500 duration-500 ease-expo" style={{ width: seen ? '19%' : '0%' }} />
          </div>
          <p className="mt-2 flex flex-wrap gap-x-4 text-xs text-white/55">
            <span><span className="text-emerald-300">●</span> 160 {t({ es: 'completadas · 73 %', en: 'completed · 73%' })}</span>
            <span><span className="text-red-300">●</span> 18 {t({ es: 'fallidas · 8 %', en: 'failed · 8%' })}</span>
            <span><span className="text-white/50">●</span> 40 {t({ es: 'otras', en: 'other' })}</span>
          </p>
        </div>
        <Tile label={t({ es: 'ejecuciones de los agentes', en: 'agent runs' })}><span className="text-[clamp(2rem,1.4rem+1.6vw,2.8rem)]"><Num value={218} on={seen} /></span></Tile>
        <Tile label={t({ es: 'consultas a 4 proveedores', en: 'queries to 4 providers' })}><span className="text-[clamp(2rem,1.4rem+1.6vw,2.8rem)]"><Num value={2340} on={seen} /></span></Tile>
        <Tile label={t({ es: 'por ejecución', en: 'per run' })}><span className="text-[clamp(2rem,1.4rem+1.6vw,2.8rem)]"><Num value={0.18} on={seen} decimals={2} prefix="US$" /></span></Tile>
        <Tile className="border-emerald-400/30" label={t({ es: 'cuesta cada empresa aprobada (Agente 1)', en: 'per approved company (Agent 1)' })}><span className="text-[clamp(2rem,1.4rem+1.6vw,2.8rem)] text-emerald-300"><Num value={1.44} on={seen} decimals={2} prefix="US$" /></span></Tile>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="grid grid-cols-2 gap-3">
          <Tile label={t({ es: 'empresas aprobadas por el Agente 1', en: 'companies approved from Agent 1' })}><span className="text-[clamp(2rem,1.4rem+1.6vw,2.8rem)]"><Num value={31} on={seen} /></span></Tile>
          <Tile label={t({ es: 'de lo generado termina aprobado', en: 'of what’s generated gets approved' })}><span className="text-[clamp(2rem,1.4rem+1.6vw,2.8rem)]"><Num value={8.2} on={seen} decimals={1} suffix=" %" /></span></Tile>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-[#141517]/90 p-5">
          <p className="mono-label text-white/50">{t({ es: 'Costo por agente', en: 'Cost by agent' })}</p>
          <ul className="mt-3 space-y-2.5">
            {AGENTS.map((a, i) => (
              <li key={a.name.es} className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_auto] items-center gap-3 text-sm">
                <span className="truncate text-white/75">{t(a.name)}</span>
                <span className="h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#285ee6] to-[#6b8cff] transition-[width] duration-500 ease-expo" style={{ width: seen ? `${Math.max(2, (a.cost / max) * 100)}%` : '0%', transitionDelay: `${i * 120}ms` }} />
                </span>
                <span className="tabular-nums">US${a.cost.toFixed(2).replace('.', ',')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 grid items-center gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Laptop><UsageScreen /></Laptop>
        <p className="max-w-[40ch] leading-relaxed text-white/70">
          {t({ es: 'Todo sale de esta pantalla de la app: costo por agente, por país, por proveedor y por búsqueda. En la réplica corre una búsqueda de ejemplo y se suma en vivo.', en: 'It all comes from this app screen: cost by agent, country, provider and search. In the replica a sample search runs and adds up live.' })}
        </p>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Cifras reales del panel de Producción (19-11-2026) · la pantalla es una réplica con una corrida de ejemplo', en: 'Real figures from the Production panel (19 Nov 2026) · the screen is a replica with a sample run' })}</p>
    </div>
  )
}
