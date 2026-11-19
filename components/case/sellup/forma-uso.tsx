'use client'

import { ChevronDown, Info, Loader2, SlidersHorizontal, Compass } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { RealCard, RealFrame, RealTag } from './real-app'
import { HIGHLIGHT, StorySteps, stepAt, useStoryTime, type StoryStep } from './real-story'

/**
 * 5.6 · «Uso de IA, costos y efectividad» tal cual: cifras reales de Producción
 * (nov. 2026) y una corrida de ejemplo (México × Salud, US$0,42) que se suma en vivo.
 */

const STEPS: readonly StoryStep[] = [
  { label: { es: 'Corre una búsqueda nueva', en: 'A new search runs' }, from: 0 },
  { label: { es: 'Se registra lo que costó', en: 'Its cost is logged' }, from: 5 },
  { label: { es: 'Y lo que produjo', en: 'And what it produced' }, from: 11 },
]
const LOOP = 20

const RUN = { cost: 0.42, queries: 12, generated: 12, approved: 2 }

const AGENTS = [
  { name: 'Agente 1 · Empresas', runs: 51, gen: 378, ok: 31, cost: 44.67 },
  { name: 'Agente 2A · Contactos', runs: 155, gen: 187, ok: 0, cost: 6.71 },
  { name: 'Agente 3 · Primer contacto', runs: 12, gen: 10, ok: 0, cost: 0.87 },
  { name: 'Asistente de Slack', runs: 0, gen: 0, ok: 0, cost: 0.63 },
  { name: 'Empresas de HubSpot', runs: 0, gen: 0, ok: 0, cost: 0.14 },
]

const usd = (n: number, d = 2) => `$${n.toFixed(d)}`
const int = (n: number) => n.toLocaleString('en-US').replace(',', '')

function Screen({ time }: { time: number }) {
  const now = stepAt(STEPS, time)
  const running = now === 0
  const costed = now >= 1
  const produced = now >= 2
  const a = AGENTS.map((ag, i) => (i === 0 && costed ? { ...ag, runs: ag.runs + 1, cost: ag.cost + RUN.cost, gen: ag.gen + (produced ? RUN.generated : 0), ok: ag.ok + (produced ? RUN.approved : 0) } : ag))
  const total = 53.03 + (costed ? RUN.cost : 0)
  const runs = 218 + (costed ? 1 : 0)
  const kpis = [
    { l: 'Costo estimado', v: `${usd(total)}+`, n: 'USD en el periodo', hot: now === 1 },
    { l: 'Ejecuciones', v: String(runs), n: 'veces que trabajó un agente', hot: now === 1 },
    { l: 'Consultas', v: int(2340 + (costed ? RUN.queries : 0)), n: 'a 4 proveedores', hot: now === 1 },
    { l: 'Costo medio', v: '$0.1791', n: 'por ejecución' },
    { l: 'Errores', v: '116', n: 'consultas y ejecuciones fallidas', tag: true },
    { l: 'En curso', v: running ? '7' : '6', n: 'agentes trabajando ahora', hot: running },
  ]
  const done = 160 + (produced ? 1 : 0)
  const totalRuns = done + 18 + 40
  const th = 'px-4 py-2.5 font-medium text-white/60'
  return (
    <div className="px-6 pt-5">
      <div className="flex items-start">
        <span>
          <h4 className="text-[24px] font-semibold tracking-tight">Uso de IA, costos y efectividad</h4>
          <p className="mt-1 text-[12.5px] text-white/55">Qué han hecho los agentes, cuánto ha costado y cuántos prospectos terminaron aprobados.</p>
        </span>
        <span className="ml-auto flex items-center gap-2 text-[12.5px]">
          <span className="flex items-center gap-6 rounded-lg border border-white/10 px-3 py-1.5">Todo el periodo<ChevronDown className="h-3.5 w-3.5 opacity-60" /></span>
          <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5"><SlidersHorizontal className="h-3.5 w-3.5" />Filtros</span>
          <span className="flex items-center gap-1.5 text-white/50"><Info className="h-3.5 w-3.5" />Cómo se mide</span>
        </span>
      </div>
      <RealCard className="mt-4">
        <div className="grid grid-cols-6 divide-x divide-white/10">
          {kpis.map((k) => (
            <div key={k.l} className="px-4 py-3 transition-colors duration-500" style={k.hot ? { background: 'rgba(107,140,255,0.12)' } : undefined}>
              <p className="text-[12px] text-white/60">{k.l}</p>
              <p className={`mt-1 text-[21px] font-semibold tabular-nums ${k.hot ? 'text-[#9db0ff]' : ''}`}>{k.v}</p>
              <p className="flex items-center gap-1 text-[11px] text-white/45">{k.n}</p>
              {k.tag && <span className="mt-1 inline-block rounded bg-red-500/20 px-1.5 text-[10.5px] text-red-300">Requiere atención</span>}
            </div>
          ))}
        </div>
      </RealCard>
      <p className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1 text-[12.5px]">
        {['Resumen', 'Por agente', 'Por país', 'Proveedores', 'Equipo', 'Por rol y grupo', 'Por búsqueda', 'Detalle', 'Mapa de uso'].map((tb, i) => (
          <span key={tb} className={`rounded-lg px-2.5 py-1 ${i === 0 ? 'bg-white/10 font-medium' : 'text-white/60'}`}>{tb}</span>
        ))}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <RealCard>
          <div className="px-4 py-3">
            <p className="text-[13.5px] font-medium">Costo por agente <span className="ml-1 rounded bg-white/10 px-1.5 text-[11px]">5</span></p>
            <p className="text-[12px] text-white/50">Costo estimado en USD, con los prospectos que se aprobaron.</p>
            <ul className="mt-3 space-y-2.5">
              {a.map((ag, i) => (
                <li key={ag.name} className="grid grid-cols-[160px_minmax(0,1fr)_60px_90px] items-center gap-3 text-[12px]">
                  <span className="truncate text-white/75">{ag.name}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-[#6b8cff] transition-[width] duration-1000" style={{ width: `${Math.max(2, (ag.cost / 45.2) * 100)}%`, boxShadow: i === 0 && now === 1 ? '0 0 12px #6b8cff' : 'none' }} /></span>
                  <span className="text-right font-medium tabular-nums">{usd(ag.cost)}</span>
                  <span className="whitespace-nowrap text-white/45">{ag.ok} aprobados</span>
                </li>
              ))}
            </ul>
          </div>
        </RealCard>
        <RealCard>
          <div className="px-4 py-3">
            <p className="text-[13.5px] font-medium">Cómo terminaron las ejecuciones</p>
            <p className="text-[12px] text-white/50">Todas las veces que trabajó un agente en el periodo.</p>
            <p className="mt-4 flex h-2 gap-1 overflow-hidden">
              <span className="rounded-full bg-emerald-400 transition-all duration-700" style={{ flex: done }} />
              <span className="rounded-full bg-red-400" style={{ flex: 18 }} />
              <span className="rounded-full bg-white/30" style={{ flex: 40 }} />
            </p>
            <ul className="mt-3 space-y-2 text-[12.5px]">
              <li className="rounded-lg px-1.5 py-0.5 transition-all duration-500" style={produced ? { background: 'rgba(16,185,129,0.12)' } : undefined}><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />Completadas<span className="ml-4 block pl-2 text-white/50"><b className="text-white">{done}</b> ejecuciones · {Math.round((done / totalRuns) * 100)}%</span></li>
              <li className="px-1.5"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-400" />Fallidas<span className="ml-4 block pl-2 text-white/50"><b className="text-white">18</b> ejecuciones · 8%</span></li>
              <li className="px-1.5"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-white/40" />Otros <span className="text-white/50">en curso, pendientes o canceladas</span><span className="ml-4 block pl-2 text-white/50"><b className="text-white">40</b> ejecuciones · 18%</span></li>
            </ul>
          </div>
        </RealCard>
      </div>
      <RealCard className="mt-3">
        <p className="px-4 pt-3 text-[13.5px] font-medium">Qué hizo cada agente</p>
        <p className="px-4 text-[12px] text-white/50">Veces que trabajó, prospectos que generó, cuántos se aprobaron y lo que costó.</p>
        <table className="mt-2 w-full text-[12.5px]">
          <thead className="border-y border-white/10 text-right">
            <tr><th className={`${th} text-left`}>Agente</th><th className={th}>Ejecuciones</th><th className={th}>Generados</th><th className={th}>Aprobados</th><th className={th}>Efectividad</th><th className={th}>Costo estimado</th><th className={th}>Costo por aprobado</th></tr>
          </thead>
          <tbody className="text-right tabular-nums">
            {a.slice(0, 3).map((ag, i) => (
              <tr key={ag.name} className="border-t border-white/[0.06] transition-all duration-500" style={i === 0 ? { background: HIGHLIGHT.background, boxShadow: 'inset 3px 0 0 #6b8cff' } : undefined}>
                <td className="flex items-center gap-2 px-4 py-2.5 text-left font-medium">{i === 0 && running ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#9db0ff]" /> : <Compass className="h-3.5 w-3.5 text-[#9db0ff]" />}{ag.name}{i === 0 && running && <RealTag tone="blue">México × Salud · en curso</RealTag>}</td>
                <td className="px-4">{ag.runs}</td>
                <td className="px-4">{ag.gen}</td>
                <td className="px-4 font-semibold">{ag.ok}</td>
                <td className="px-4">{ag.gen ? `${((ag.ok / ag.gen) * 100).toFixed(1)}%` : '—'}</td>
                <td className="px-4">{usd(ag.cost)}</td>
                <td className="px-4">{ag.ok ? usd(ag.cost / ag.ok, 4) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </RealCard>
    </div>
  )
}

export function UsageMetrics() {
  const { t } = useLocale()
  const [ref, time] = useStoryTime(LOOP, 14)
  return (
    <div ref={ref}>
      <StorySteps steps={STEPS} time={time} kicker={{ es: 'Uso y costos', en: 'Usage and cost' }} />
      <RealFrame active="uso" crumb={['Uso de IA y costos']} height={940}>
        <Screen time={time} />
      </RealFrame>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">{t({ es: 'Réplica de la pantalla real · cifras reales de Producción (nov. 2026) más una corrida de ejemplo', en: 'Replica of the real screen · real Production figures (Nov 2026) plus a sample run' })}</p>
    </div>
  )
}
