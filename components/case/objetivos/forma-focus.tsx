'use client'

import { useLocale, type L } from '@/lib/i18n'
import { MOTIVOS_DEVUELTO, OBJETIVOS, tramoDe } from './cascade-model'
import { AppWindow, Pill, ProgressBar, Stage, UBITS_BLUE, useStepper } from './forma-ui'

const ORANGE = '#f38744'
const RED = '#d92d20'
const GREEN = '#17b26a'

interface Moment {
  title: string
  state: { label: string; color: string }
  avance: number | null
  headline: L
  note: L
  /** Cuántos pasos de la línea de vida se alcanzaron (0–4). */
  reached: number
  /** Quién actúa en este momento. */
  actor: { initials: string; does: L }
  action?: string
}

const TASK = 'Contestar más rápido los correos'
const RESULT = 'Reducir el tiempo de respuesta de 48 h a 24 h'

/** La vida de un objetivo, de la propuesta al cierre, con las reglas del playground. */
const MOMENTS: readonly Moment[] = [
  { title: TASK, state: { label: 'Por aprobar', color: ORANGE }, avance: null, headline: { es: 'Ricardo lo propone', en: 'Ricardo proposes it' }, note: { es: 'Sin aprobar no lleva avance.', en: 'Unapproved carries no progress.' }, reached: 1, actor: { initials: 'RT', does: { es: 'Ricardo · colaborador', en: 'Ricardo · employee' } }, action: 'Enviar' },
  { title: TASK, state: { label: 'Por ajustar', color: RED }, avance: null, headline: { es: 'Su líder lo devuelve', en: 'His lead returns it' }, note: { es: MOTIVOS_DEVUELTO[1], en: 'It’s written as a task. Say it as a result: what changes when it’s met.' }, reached: 1, actor: { initials: 'LC', does: { es: 'Laura · líder', en: 'Laura · lead' } }, action: 'Devolver' },
  { title: RESULT, state: { label: 'Por aprobar', color: ORANGE }, avance: null, headline: { es: 'Lo reescribe como resultado', en: 'He rewrites it as a result' }, note: { es: 'Ahora dice qué cambia y cuánto.', en: 'Now it says what changes and by how much.' }, reached: 1, actor: { initials: 'RT', does: { es: 'Ricardo · colaborador', en: 'Ricardo · employee' } }, action: 'Enviar' },
  { title: RESULT, state: { label: 'Aprobado', color: GREEN }, avance: 0, headline: { es: 'Aprobado: ya cuenta', en: 'Approved: now it counts' }, note: { es: 'Desde aquí suma al área y a «Ser la marca preferida».', en: 'From here it adds to the area and to “Be the preferred brand”.' }, reached: 2, actor: { initials: 'LC', does: { es: 'Laura · líder', en: 'Laura · lead' } }, action: 'Aprobar' },
  { title: RESULT, state: { label: 'Aprobado', color: GREEN }, avance: 34, headline: { es: 'Primer reporte: 40 h', en: 'First report: 40 h' }, note: { es: 'Valor, comentario y evidencia; queda en el historial.', en: 'Value, comment and evidence; it stays in the history.' }, reached: 3, actor: { initials: 'RT', does: { es: 'Ricardo · colaborador', en: 'Ricardo · employee' } }, action: 'Reportar' },
  { title: RESULT, state: { label: 'Aprobado', color: GREEN }, avance: 78, headline: { es: 'En racha · 4 semanas', en: 'On a streak · 4 weeks' }, note: { es: 'Se premia volver a reportar, no el % crudo.', en: 'Coming back to report is rewarded, not raw %.' }, reached: 3, actor: { initials: 'RT', does: { es: 'Ricardo · colaborador', en: 'Ricardo · employee' } }, action: 'Reportar' },
  { title: RESULT, state: { label: 'Aprobado', color: GREEN }, avance: 112, headline: { es: 'Cierra en 21 h: sobrecumplió', en: 'Closes at 21 h: exceeded' }, note: { es: 'La escala llega hasta 150 %.', en: 'The scale goes up to 150 %.' }, reached: 4, actor: { initials: 'RH', does: { es: 'RR. HH. · cierre', en: 'HR · close' } } },
]

const LIFELINE: readonly L[] = [
  { es: 'Propuesto', en: 'Proposed' },
  { es: 'Aprobado', en: 'Approved' },
  { es: 'Reportando', en: 'Reporting' },
  { es: 'Cerrado', en: 'Closed' },
]

const STEP_MS = 2600

/** La lista del ciclo, con la fila del objetivo que se sigue resaltada. */
function CycleList({ moment }: { moment: Moment }) {
  const rows = OBJETIVOS.slice(0, 6)
  return (
    <AppWindow title="KPIs corporativos 2026" meta="Participantes · 6 de 637">
      <ul className="divide-y divide-black/[0.05] text-[12px]">
        {rows.map((o) => {
          const focus = o.id === 'o5'
          const avance = focus ? moment.avance : o.etapa === 'aprobado' ? o.avance : null
          const state = focus ? moment.state : o.etapa === 'aprobado' ? { label: 'Aprobado', color: GREEN } : { label: 'Por aprobar', color: ORANGE }
          return (
            <li key={o.id} className={`relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 transition-[background-color,opacity] duration-500 ${focus ? 'bg-white' : 'opacity-45'}`}>
              {focus && <span className="absolute inset-y-1 left-0 w-1 rounded-r" style={{ background: moment.state.color }} aria-hidden="true" />}
              <span className="min-w-0">
                <span className="block truncate font-medium">{focus ? moment.title : o.titulo}</span>
                <span className="block truncate text-[11px] text-black/45">{o.persona} · {o.area}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden w-16 sm:block">{avance !== null && <ProgressBar value={Math.min(avance, 100)} color={tramoDe(avance).color} />}</span>
                <Pill color={state.color}>{state.label}</Pill>
              </span>
            </li>
          )
        })}
      </ul>
    </AppWindow>
  )
}

/** 5.1 · Un objetivo, de cerca: se destaca de la lista y se transforma de la propuesta al cierre. */
export function FocusGoal() {
  const { t } = useLocale()
  const { step, ref, set } = useStepper(STEP_MS, MOMENTS.length)
  const m = MOMENTS[step]
  const tramo = m.avance === null ? null : tramoDe(m.avance)

  return (
    <div ref={ref}>
      <Stage glow={m.state.color}>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <CycleList moment={m} />

          <div>
            {/* La lupa: el mismo objetivo, grande. */}
            <div key={step} className="animate-[spot-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] rounded-2xl p-6" style={{ background: `${m.state.color}1f`, boxShadow: `inset 0 0 0 1.5px ${m.state.color}aa, 0 40px 90px -30px ${m.state.color}` }}>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-[11px]">{m.actor.initials}</span>
                <span className="text-[12px] text-white/60">{t(m.actor.does)}</span>
                <span className="ml-auto"><Pill color={m.state.color}>{m.state.label}</Pill></span>
              </div>
              <p className="mt-4 text-[15px] text-white/75">{m.title}</p>
              <p className="mt-3 text-[clamp(1.4rem,1rem+1.2vw,2.1rem)] font-light leading-tight">{t(m.headline)}</p>
              <p className="mt-2 text-sm text-white/55">{t(m.note)}</p>
              <div className="mt-6 flex items-center gap-4">
                <span className="flex-1">
                  {tramo ? (
                    <>
                      <ProgressBar value={Math.min(m.avance ?? 0, 150)} max={150} color={tramo.color} className="h-2 bg-white/10" />
                      <span className="mt-1.5 flex justify-between gap-3 whitespace-nowrap font-mono text-[11px] text-white/55">
                        <span>{m.avance} %</span>
                        <span style={{ color: tramo.color }}>{tramo.nombre}</span>
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-[11px] text-white/45">— sin avance</span>
                  )}
                </span>
                {m.action && (
                  <span className="relative rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: m.action === 'Devolver' ? RED : UBITS_BLUE }}>
                    {m.action}
                    <span className="pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 animate-[tap-ping_1.8s_ease-out_infinite] rounded-full border-2 border-white/80" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>

            <ol className="mt-6 grid grid-cols-4 gap-2">
              {LIFELINE.map((label, k) => {
                const done = k < m.reached
                return (
                  <li key={label.es} className="text-center">
                    <button type="button" onClick={() => set(MOMENTS.findIndex((x) => x.reached > k))} className="group">
                      <span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors duration-500 ${done ? 'bg-white text-[#0b0d16]' : 'border border-white/20 text-white/40 group-hover:border-white/50'}`}>{done ? '✓' : k + 1}</span>
                      <span className={`mt-2 block text-[11px] ${done ? 'text-white/85' : 'text-white/35'}`}>{t(label)}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </Stage>
    </div>
  )
}
