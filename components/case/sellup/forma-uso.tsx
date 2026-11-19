'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { AppCard, AppFrame, Pill } from './platform'
import { useInView } from './ui'
import { Kpi, SampleNote, fmt, useCount } from './forma-shared'

type Tab = 'summary' | 'agents' | 'runs'

const TABS: readonly { id: Tab; label: L }[] = [
  { id: 'summary', label: { es: 'Resumen', en: 'Summary' } },
  { id: 'agents', label: { es: 'Por agente', en: 'By agent' } },
  { id: 'runs', label: { es: 'Ejecuciones', en: 'Runs' } },
]

/** Cifras reales de «Uso de IA, costos y efectividad» (todo el periodo, nov. 2026). */
const AGENTS: readonly { name: string; runs: number; generated: number; approved: number; cost: number }[] = [
  { name: 'Agente 1 · Empresas', runs: 51, generated: 378, approved: 31, cost: 44.67 },
  { name: 'Agente 2A · Contactos', runs: 155, generated: 187, approved: 0, cost: 6.71 },
  { name: 'Agente 3 · Primer contacto', runs: 12, generated: 10, approved: 0, cost: 0.87 },
  { name: 'Asistente de Slack', runs: 0, generated: 0, approved: 0, cost: 0.63 },
  { name: 'Empresas de HubSpot', runs: 0, generated: 0, approved: 0, cost: 0.14 },
]

const OUTCOMES: readonly { label: L; n: number; pct: number; color: string }[] = [
  { label: { es: 'Completadas', en: 'Completed' }, n: 160, pct: 73, color: '#34d399' },
  { label: { es: 'Fallidas', en: 'Failed' }, n: 18, pct: 8, color: '#f87171' },
  { label: { es: 'Otros: en curso, pendientes o canceladas', en: 'Other: running, pending or cancelled' }, n: 40, pct: 18, color: '#6b7280' },
]

const MAX_COST = 44.67

/** Uso de IA y costos: cada corrida deja su costo y su resultado. */
export function UsageMetrics() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [tab, setTab] = useState<Tab>('summary')
  const cost = useCount(53.03, seen)
  const runs = useCount(218, seen)
  const queries = useCount(2340, seen)
  const avg = useCount(0.1791, seen)

  return (
    <div ref={ref} data-reveal="device">
      <AppFrame active="uso" crumb={t({ es: 'Uso de IA y costos', en: 'AI usage and costs' })}>
        <div className="p-3 md:p-4">
          <p className="text-[17px] font-semibold">{t({ es: 'Uso de IA, costos y efectividad', en: 'AI usage, costs and effectiveness' })}</p>
          <p className="text-[11px] opacity-55">{t({ es: 'Qué han hecho los agentes, cuánto ha costado y cuántos prospectos terminaron aprobados.', en: 'What the agents did, what it cost and how many prospects were approved.' })}</p>

          <AppCard className="mt-3 grid grid-cols-2 sm:grid-cols-4">
            <Kpi label={t({ es: 'Costo estimado', en: 'Estimated cost' })} value={`$${fmt(cost, 2)}`} note="USD" />
            <Kpi label={t({ es: 'Ejecuciones', en: 'Runs' })} value={fmt(runs)} note={t({ es: 'veces que trabajó un agente', en: 'times an agent worked' })} />
            <Kpi label={t({ es: 'Consultas', en: 'Queries' })} value={fmt(queries)} note={t({ es: 'a 4 proveedores', en: 'to 4 providers' })} />
            <Kpi label={t({ es: 'Costo medio', en: 'Average cost' })} value={`$${fmt(avg, 4)}`} note={t({ es: 'por ejecución', en: 'per run' })} />
          </AppCard>

          <div role="tablist" className="mt-3 inline-flex gap-0.5 rounded-lg bg-white/5 p-0.5">
            {TABS.map((x) => (
              <button key={x.id} role="tab" aria-selected={tab === x.id} type="button" onClick={() => setTab(x.id)} className={`rounded-md px-2.5 py-1 text-[11px] transition ${tab === x.id ? 'bg-white/15 font-medium' : 'opacity-60 hover:opacity-100'}`}>
                {t(x.label)}
              </button>
            ))}
          </div>

          <AppCard className="mt-3 min-h-[230px] p-3">
            {tab === 'summary' && (
              <div key="summary">
                <p className="font-medium">{t({ es: 'Costo por agente', en: 'Cost per agent' })}</p>
                <ul className="mt-3 space-y-2">
                  {AGENTS.map((a, i) => (
                    <li key={a.name} className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)_auto] items-center gap-2">
                      <span className="truncate text-[11px] opacity-70">{a.name}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <span className="block h-full rounded-full bg-[#5b7eff] transition-[width] duration-1000 ease-out" style={{ width: seen ? `${Math.max(1.5, (a.cost / MAX_COST) * 100)}%` : '0%', transitionDelay: `${i * 120}ms` }} />
                      </span>
                      <span className="text-right tabular-nums">${a.cost.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'agents' && (
              <div key="agents" className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-[11px]">
                  <thead className="opacity-50">
                    <tr>
                      <th className="py-1 font-normal">{t({ es: 'Agente', en: 'Agent' })}</th>
                      <th className="py-1 text-right font-normal">{t({ es: 'Ejecuciones', en: 'Runs' })}</th>
                      <th className="py-1 text-right font-normal">{t({ es: 'Generados', en: 'Generated' })}</th>
                      <th className="py-1 text-right font-normal">{t({ es: 'Aprobados', en: 'Approved' })}</th>
                      <th className="py-1 text-right font-normal">{t({ es: 'Costo', en: 'Cost' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AGENTS.slice(0, 3).map((a, i) => (
                      <tr key={a.name} className="border-t border-white/[0.06]" style={{ animation: `sellupRowIn .4s ease-out ${i * 80}ms both` }}>
                        <td className="py-1.5">{a.name}</td>
                        <td className="py-1.5 text-right tabular-nums">{a.runs}</td>
                        <td className="py-1.5 text-right tabular-nums">{a.generated}</td>
                        <td className="py-1.5 text-right tabular-nums">{a.approved}</td>
                        <td className="py-1.5 text-right tabular-nums">${a.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-[10px] opacity-70">
                  <Pill tone="blue">US$1,44</Pill>
                  {t({ es: 'por empresa aprobada en el Agente 1: 31 aprobadas de 378 candidatas.', en: 'per approved company in Agent 1: 31 approved out of 378 candidates.' })}
                </p>
              </div>
            )}
            {tab === 'runs' && (
              <div key="runs">
                <p className="font-medium">{t({ es: 'Cómo terminaron las ejecuciones', en: 'How runs ended' })}</p>
                <div className="mt-3 flex h-3 gap-1 overflow-hidden rounded-full">
                  {OUTCOMES.map((o, i) => (
                    <span key={o.n} className="h-full rounded-full" style={{ background: o.color, width: `${o.pct}%`, animation: `sellupGrow .9s ease-out ${i * 150}ms both`, transformOrigin: 'left' }} />
                  ))}
                </div>
                <ul className="mt-3 space-y-2">
                  {OUTCOMES.map((o) => (
                    <li key={o.n} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: o.color }} />
                      <span className="opacity-80">{t(o.label)}</span>
                      <span className="ml-auto tabular-nums opacity-70">{o.n} · {o.pct}%</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[10px] opacity-55">{t({ es: 'Si un proveedor no reporta el costo, queda «desconocido», nunca cero.', en: 'If a provider doesn’t report cost, it stays “unknown”, never zero.' })}</p>
              </div>
            )}
          </AppCard>
        </div>
      </AppFrame>
      <style>{'@keyframes sellupRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes sellupGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}'}</style>
      <SampleNote real />
    </div>
  )
}
