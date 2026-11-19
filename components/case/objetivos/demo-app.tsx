'use client'

import { useState } from 'react'
import { CascadeGraph } from './cascade-graph'
import { EMPRESA, MOTIVOS_DEVUELTO, avanceEmpresa, cuenta, pct, tramoDe, type ObjetivoPersona } from './cascade-model'
import type { CheckinState } from './use-checkin-loop'

export type DemoRole = 'admin' | 'lider' | 'colaborador'

/** Persona que entra como colaborador y equipo del líder en la demo. */
const ME = 'o2'
const TEAM_AREAS = ['Comercial', 'Servicio al cliente', 'Gente y Cultura']

const BLUE = '#0c5bef'

function Pill({ o }: { o: ObjetivoPersona }) {
  if (!cuenta(o)) {
    const text = o.etapa === 'por-aprobar' ? 'Por aprobar' : 'Por ajustar'
    return <span className="whitespace-nowrap rounded-full bg-[#fcefd9] px-2 py-0.5 text-[11px] font-medium text-[#9c5600]">{text}</span>
  }
  const tr = tramoDe(o.avance)
  return (
    <span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: `${tr.color}1a`, color: tr.color }}>
      {o.avance === 0 ? 'Por iniciar' : tr.nombre}
    </span>
  )
}

function Bar({ value, color = BLUE }: { value: number; color?: string }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-[#eceef5]">
      <span className="block h-full rounded-full transition-[width] duration-700 ease-expo" style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </span>
  )
}

function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-[#dde0eb] bg-white p-4 ${className}`}>
      {title && <h3 className="mb-3 text-[13px] font-semibold text-[#161a2c]">{title}</h3>}
      {children}
    </section>
  )
}

/** Admin: lectura del ciclo, lo que hay que atender y la lista de personas. */
function AdminView({ state, onToast }: { state: CheckinState; onToast: (t: string) => void }) {
  const { objetivos } = state
  const general = EMPRESA.reduce((s, e) => s + avanceEmpresa(objetivos, e.id), 0) / EMPRESA.length
  const pending = objetivos.filter((o) => o.etapa === 'por-aprobar').length
  const adjust = objetivos.filter((o) => o.etapa === 'por-ajustar').length
  const unaligned = objetivos.filter((o) => !o.empresa).length
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-[12px] text-[#5c6180]">Avance general</p><p className="mt-1 text-2xl font-semibold tabular-nums">{pct(general)}</p><div className="mt-2"><Bar value={general} /></div></Card>
        <Card><p className="text-[12px] text-[#5c6180]">Objetivos que cuentan</p><p className="mt-1 text-2xl font-semibold tabular-nums">{objetivos.filter(cuenta).length} <span className="text-sm font-normal text-[#5c6180]">de {objetivos.length}</span></p></Card>
        <Card><p className="text-[12px] text-[#5c6180]">Sin alinear</p><p className="mt-1 text-2xl font-semibold tabular-nums">{unaligned}</p></Card>
      </div>
      <Card title="Para atender">
        <ul className="grid gap-2 sm:grid-cols-2">
          {pending > 0 && (
            <li className="flex items-center justify-between gap-3 rounded-lg bg-[#f4f5f9] p-3 text-[13px]">
              <span><span className="mr-2 rounded bg-[#fcefd9] px-1.5 text-[10px] font-semibold text-[#9c5600]">Media</span>{pending} por aprobar</span>
              <button type="button" onClick={() => onToast('Recordatorio enviado a los líderes')} className="rounded-md border border-[#dde0eb] bg-white px-2.5 py-1 text-[12px] hover:bg-[#eceef5]">Recordar a los líderes</button>
            </li>
          )}
          {adjust > 0 && (
            <li className="flex items-center justify-between gap-3 rounded-lg bg-[#f4f5f9] p-3 text-[13px]">
              <span><span className="mr-2 rounded bg-[#fcefd9] px-1.5 text-[10px] font-semibold text-[#9c5600]">Media</span>{adjust} devuelto por ajustar</span>
              <button type="button" onClick={() => onToast(`Recordatorio enviado a ${adjust} persona`)} className="rounded-md border border-[#dde0eb] bg-white px-2.5 py-1 text-[12px] hover:bg-[#eceef5]">Recordar</button>
            </li>
          )}
          {pending + adjust === 0 && <li className="text-[13px] text-[#5c6180]">Nada por atender. Todo lo asignado ya cuenta.</li>}
        </ul>
      </Card>
      <Card title="Participantes">
        <ul className="divide-y divide-[#eceef5]">
          {objetivos.map((o) => (
            <li key={o.id} className="grid grid-cols-[minmax(0,1fr)_7rem_auto] items-center gap-3 py-2.5 text-[13px]">
              <span className="min-w-0"><span className="block truncate font-medium text-[#0c5bef]">{o.persona}</span><span className="block truncate text-[11px] text-[#5c6180]">{o.area} · {o.titulo}</span></span>
              <span className="flex items-center gap-2"><Bar value={cuenta(o) ? o.avance : 0} color={tramoDe(o.avance).color} /><span className="w-9 text-right text-[11px] tabular-nums text-[#5c6180]">{cuenta(o) ? `${o.avance}%` : '—'}</span></span>
              <Pill o={o} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/** Líder: aprueba o devuelve lo que escribió su equipo, con un motivo. */
function LeaderView({ state, onToast }: { state: CheckinState; onToast: (t: string) => void }) {
  const team = state.objetivos.filter((o) => TEAM_AREAS.includes(o.area))
  const [returning, setReturning] = useState<string | null>(null)
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-[#5c6180]">Tu equipo · {team.length} objetivos. Lo que no apruebes no suma al avance.</p>
      {team.map((o) => (
        <Card key={o.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#161a2c]">{o.titulo}</p>
              <p className="mt-1 text-[12px] text-[#5c6180]">{o.persona} · peso {o.peso} % · {o.empresa ? `empuja «${EMPRESA.find((e) => e.id === o.empresa)?.titulo}»` : 'sin alinear'}</p>
            </div>
            <Pill o={o} />
          </div>
          {!cuenta(o) && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => { state.update(o.id, { etapa: 'aprobado' }); onToast(`Aprobaste el objetivo de ${o.persona}`) }} className="rounded-md bg-[#0c5bef] px-3 py-1.5 text-[12px] font-medium text-white hover:brightness-110">Aprobar</button>
              <button type="button" onClick={() => setReturning(returning === o.id ? null : o.id)} className="rounded-md border border-[#dde0eb] px-3 py-1.5 text-[12px] hover:bg-[#f4f5f9]">Devolver</button>
            </div>
          )}
          {cuenta(o) && <div className="mt-3 flex items-center gap-3"><Bar value={o.avance} color={tramoDe(o.avance).color} /><span className="whitespace-nowrap text-[12px] tabular-nums">{o.avance} %</span></div>}
          {returning === o.id && (
            <fieldset className="mt-3 rounded-lg bg-[#f4f5f9] p-3">
              <legend className="sr-only">Motivo</legend>
              <p className="mb-2 text-[12px] font-medium">¿Qué hay que cambiar?</p>
              <div className="grid gap-1.5">
                {MOTIVOS_DEVUELTO.map((m) => (
                  <button key={m} type="button" onClick={() => { state.update(o.id, { etapa: 'por-ajustar' }); setReturning(null); onToast('Devuelto con su motivo') }} className="rounded-md border border-[#dde0eb] bg-white px-3 py-2 text-left text-[12px] hover:border-[#0c5bef]">{m}</button>
                ))}
              </div>
            </fieldset>
          )}
        </Card>
      ))}
    </div>
  )
}

interface Report { value: number; note: string; evidence: boolean }

/** Colaborador: reporta valor, comentario y evidencia; el avance sube por la cascada. */
function EmployeeView({ state, onToast }: { state: CheckinState; onToast: (t: string) => void }) {
  const mine = state.objetivos.find((o) => o.id === ME)
  const [value, setValue] = useState(mine?.avance ?? 0)
  const [note, setNote] = useState('')
  const [evidence, setEvidence] = useState(false)
  const [history, setHistory] = useState<readonly Report[]>([{ value: 64, note: 'Reporto el avance a la fecha; adjunto el soporte.', evidence: true }])
  if (!mine) return null
  const company = EMPRESA.find((e) => e.id === mine.empresa)
  const submit = () => {
    state.report(mine.id, value)
    setHistory((h) => [{ value, note: note.trim() || 'Sin comentario', evidence }, ...h])
    setNote('')
    setEvidence(false)
    onToast('Avance reportado')
  }
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-[12px] text-[#5c6180]">Mi objetivo · peso {mine.peso} %</p>
        <p className="mt-1 text-[16px] font-semibold text-[#161a2c]">{mine.titulo}</p>
        {company && <p className="mt-1 text-[12px] text-[#5c6180]">Aporta a «{company.titulo}» · {pct(avanceEmpresa(state.objetivos, company.id))}</p>}
        <div className="mt-4 flex items-center gap-3"><Bar value={mine.avance} color={tramoDe(mine.avance).color} /><Pill o={mine} /></div>
      </Card>
      <Card title="Reportar avance">
        <label className="block text-[12px] text-[#5c6180]">
          Avance: <b className="text-[#161a2c] tabular-nums">{value} %</b>
          <input type="range" min={0} max={120} value={value} onChange={(e) => setValue(Number(e.target.value))} className="mt-2 block w-full accent-[#0c5bef]" />
        </label>
        <label className="mt-3 block text-[12px] text-[#5c6180]">
          Comentario
          <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 200))} rows={2} placeholder="¿Qué cambió desde el último reporte?" className="mt-1 block w-full resize-none rounded-md border border-[#dde0eb] px-3 py-2 text-[13px] text-[#161a2c] outline-none focus:border-[#0c5bef]" />
        </label>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button type="button" aria-pressed={evidence} onClick={() => setEvidence((e) => !e)} className="rounded-md border border-dashed border-[#c6cad9] px-3 py-1.5 text-[12px] aria-pressed:border-solid aria-pressed:border-[#0f7a57] aria-pressed:bg-[#daf2e8] aria-pressed:text-[#0f7a57]">
            {evidence ? '✓ captura-dashboard-ventas.png' : '+ Adjuntar evidencia'}
          </button>
          <button type="button" onClick={submit} disabled={value === mine.avance && !note.trim()} className="rounded-md bg-[#0c5bef] px-4 py-2 text-[13px] font-medium text-white hover:brightness-110 disabled:opacity-40">Reportar</button>
        </div>
      </Card>
      <Card title="Historial">
        <ol className="space-y-2">
          {history.map((h, i) => (
            <li key={`${h.value}-${i}`} className="flex gap-3 text-[12px]"><span className="w-10 shrink-0 font-semibold tabular-nums">{h.value} %</span><span className="text-[#5c6180]">{h.note}{h.evidence && ' · 1 evidencia'}</span></li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

const VIEWS: Record<DemoRole, (p: { state: CheckinState; onToast: (t: string) => void }) => JSX.Element | null> = {
  admin: AdminView,
  lider: LeaderView,
  colaborador: EmployeeView,
}

/** La app de la demo: la vista del rol a la izquierda y la cascada en vivo a la derecha. */
export function DemoApp({ role, state }: { role: DemoRole; state: CheckinState }) {
  const [toast, setToast] = useState<string | null>(null)
  const View = VIEWS[role]
  const showToast = (text: string) => {
    setToast(text)
    window.setTimeout(() => setToast((t) => (t === text ? null : t)), 2200)
  }
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f9] text-[#161a2c] lg:flex-row lg:overflow-hidden" data-lenis-prevent>
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:overflow-y-auto">
        <View state={state} onToast={showToast} />
      </div>
      <aside className="border-t border-[#dde0eb] bg-white p-4 sm:p-6 lg:w-[46%] lg:border-l lg:border-t-0 lg:overflow-y-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c6180]">Cascada del ciclo</p>
        <p className="mt-1 text-[12px] text-[#5c6180]">Empresa arriba, áreas al medio, personas abajo. Lo punteado todavía no cuenta.</p>
        <CascadeGraph objetivos={state.objetivos} pulse={state.pulse} pulseKey={state.pulseKey} theme="light" className="mt-4" />
      </aside>
      {toast && (
        <p role="status" className="obj-toast pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-[#161a2c] px-4 py-2 text-[13px] text-white shadow-lg">{toast}</p>
      )}
    </div>
  )
}
