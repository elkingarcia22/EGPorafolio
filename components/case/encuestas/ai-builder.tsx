'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { UBITS_BLUE } from './shared'
import { ADJUST, END, LOOP, PLACED, PROMPT, SECTIONS, STEPS, STYLE_CHIPS, T, T2, stepAt, typedAt } from './ai-script'

const TICK = 50
const AI_GRADIENT = 'linear-gradient(90deg,#7aa2ff,#ff7a95)'

/** Reloj de la escena: corre solo cuando se ve, se pausa con el puntero encima y vuelve a empezar al final. */
function useSceneClock() {
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [ms, setMs] = useState(0)
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || !inView || hover) return
    const id = window.setInterval(() => setMs((v) => (v + TICK >= LOOP ? 0 : v + TICK)), TICK)
    return () => window.clearInterval(id)
  }, [reducedMotion, inView, hover])

  return { ref, ms: reducedMotion ? END : ms, paused: hover, setHover, replay: () => setMs(0), reducedMotion }
}

function Orb({ busy = false }: { busy?: boolean }) {
  return <span className={`inline-block h-5 w-5 shrink-0 rounded-full ${busy ? 'enc-ai-spin' : ''}`} style={{ background: 'conic-gradient(from 0deg,#7aa2ff,#ff7a95,#ffd36e,#7aa2ff)' }} aria-hidden="true" />
}

function AgentLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="enc-ai-in flex gap-2.5">
      <Orb />
      <div className="min-w-0 text-[12.5px] leading-relaxed text-[#303a47]">{children}</div>
    </div>
  )
}

function UserLine({ children }: { children: React.ReactNode }) {
  return <p className="enc-ai-in ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#ecf1fa] px-3 py-2 text-[12.5px] leading-snug text-[#303a47]">{children}</p>
}

/** El hilo del agente: solo los mensajes que ya ocurrieron, pegados abajo como en el panel real. */
function ChatThread({ ms }: { ms: number }) {
  const { t } = useLocale()
  const built = SECTIONS.map((s) => t(s.title))
  const thinking = ms >= T.start
  const done = ms >= T2.done
  const total = 18

  return (
    <div className="flex h-full flex-col justify-end gap-3 overflow-hidden px-4 pb-3 pt-6">
      {ms >= T.greet && (
        <AgentLine>{t({ es: '¡Hola! Cuéntame qué quieres medir con esta encuesta: los temas que te importan, cuántas secciones quieres y cómo prefieres que respondan. Yo la voy armando y la ves crecer a la izquierda.', en: 'Hi! Tell me what you want to measure: the topics you care about, how many sections and how people should answer. I’ll build it and you’ll watch it grow on the left.' })}</AgentLine>
      )}
      {ms >= T.typeEnd + 100 && <UserLine>{t(PROMPT)}</UserLine>}
      {ms >= T.ask && (
        <AgentLine>
          <p>{t({ es: 'Entendido: Liderazgo, Carga de trabajo y Bienestar · 3 secciones. Me falta algo más:', en: 'Got it: Leadership, Workload and Well-being · 3 sections. One more thing:' })}</p>
          <p className="mt-1.5 font-medium">{t({ es: '¿Cómo quieres que respondan?', en: 'How should people answer?' })}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {STYLE_CHIPS.map((c, i) => {
              const picked = i === 0 && ms >= T.pick
              const gone = ms >= T.pickBubble && !picked
              return (
                <li key={c.es} className={`rounded-full border px-2.5 py-1 text-[11px] transition-all duration-300 ${picked ? 'border-[#0c5bef] bg-[#0c5bef] text-white' : 'border-[#d0d2d5] bg-white'} ${gone ? 'opacity-35' : ''} ${i === 0 && ms >= T.pick - 600 && ms < T.pick ? 'enc-ai-press' : ''}`}>
                  {t(c)}
                </li>
              )
            })}
          </ul>
        </AgentLine>
      )}
      {ms >= T.pickBubble && <UserLine>{t(STYLE_CHIPS[0])}</UserLine>}
      {thinking && (
        <AgentLine>
          {done ? (
            <p className="mb-1.5 text-[11px] text-[#5c646f]">{t({ es: 'Razonó en 3 pasos · 8s ▾', en: 'Reasoned in 3 steps · 8s ▾' })}</p>
          ) : (
            <ul className="mb-2 space-y-1 rounded-lg border border-[#e3e6ec] bg-white p-2 text-[11px]">
              {PLACED.map((p, i) => {
                const state = ms >= p.end ? 'ok' : ms >= p.at ? 'on' : 'wait'
                return (
                  <li key={p.section} className={`flex items-center gap-2 ${state === 'wait' ? 'opacity-40' : ''}`}>
                    <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] ${state === 'ok' ? 'bg-[#43a970] text-white' : state === 'on' ? 'enc-ai-spin border-2 border-[#7aa2ff] border-t-transparent' : 'border border-[#c5ccd8]'}`}>{state === 'ok' ? '✓' : ''}</span>
                    {t({ es: `Creando «${built[i]}»`, en: `Creating “${built[i]}”` })}
                  </li>
                )
              })}
              {ms >= T2.finishing && <li className="enc-ai-shimmer bg-clip-text font-medium text-transparent" style={{ backgroundImage: AI_GRADIENT }}>{t({ es: 'Finalizando…', en: 'Finishing…' })}</li>}
            </ul>
          )}
          <p>{t({ es: 'Estoy creando las secciones y sus preguntas en «Secciones y preguntas». Le puse de nombre «Encuesta de clima» y el tipo Clima en «Datos generales»; cámbialos cuando quieras.', en: 'I’m creating the sections and their questions in “Sections and questions”. I named it “Climate survey” and set the type to Climate in “General data”; change them anytime.' })}</p>
        </AgentLine>
      )}
      {done && (
        <AgentLine>
          <p>{t({ es: `Listo: la encuesta tiene 3 secciones nuevas con ${total} preguntas. Pídeme ajustes aquí o cámbiala a mano: lo que edites lo respeto. Antes de finalizar te faltan las fechas y los participantes.`, en: `Done: the survey has 3 new sections with ${total} questions. Ask me for changes here or edit by hand: I respect what you edit. Before finishing you still need the dates and participants.` })}</p>
          <span className="mt-2 inline-flex rounded-full border border-[#d0d2d5] bg-white px-2.5 py-1 text-[11px]">↺ {t({ es: 'Deshacer', en: 'Undo' })}</span>
        </AgentLine>
      )}
      {ms >= T2.adjustBubble && <UserLine>{t(ADJUST)}</UserLine>}
      {ms >= T2.reply && (
        <AgentLine>
          <p>{t({ es: 'Quité «Bienestar» con 6 preguntas.', en: 'I removed “Well-being” with 6 questions.' })}</p>
          <span className="mt-2 inline-flex rounded-full border border-[#d0d2d5] bg-white px-2.5 py-1 text-[11px]">↺ {t({ es: 'Deshacer «Quité Bienestar»', en: 'Undo “Removed Well-being”' })}</span>
        </AgentLine>
      )}
    </div>
  )
}

/** Lo que va en la caja de escribir: lo que se teclea, o la ayuda de la fase en la que está. */
function Composer({ ms }: { ms: number }) {
  const { t } = useLocale()
  const prompt = typedAt(t(PROMPT), ms, T.typeStart, T.typeEnd)
  const adjust = typedAt(t(ADJUST), ms, T2.adjustTypeStart, T2.adjustTypeEnd)
  const typing = (ms >= T.typeStart && ms < T.typeEnd + 100) || (ms >= T2.adjustTypeStart && ms < T2.adjustBubble)
  const text = ms < T.typeEnd + 100 ? prompt : adjust
  const hint = ms >= T.start && ms < T2.done ? t({ es: 'Creando la encuesta…', en: 'Creating the survey…' }) : ms >= T2.done ? t({ es: 'Pide un ajuste: «quita Bienestar»…', en: 'Ask for a change: “remove Well-being”…' }) : t({ es: 'Escribe lo que quieres medir…', en: 'Type what you want to measure…' })
  return (
    <div className="m-3 mt-0 flex items-end gap-2 rounded-xl border border-[#d0d2d5] bg-white px-3 py-2.5">
      <p className="min-h-[1.25rem] flex-1 text-[12.5px] leading-snug">
        {typing ? (
          <>
            <span className="text-[#303a47]">{text}</span>
            <span className="enc-ai-caret ml-px inline-block h-3.5 w-px translate-y-0.5 bg-[#303a47]" />
          </>
        ) : (
          <span className="text-[#979ba3]">{hint}</span>
        )}
      </p>
      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-white transition-colors" style={{ background: typing ? UBITS_BLUE : '#c5ccd8' }} aria-hidden="true">↑</span>
    </div>
  )
}

/** «Secciones y preguntas»: el árbol crece sección por sección y pregunta por pregunta. */
function GrowingTree({ ms }: { ms: number }) {
  const { t } = useLocale()
  const named = ms >= T.start + 400
  const visible = PLACED.filter((p) => ms >= p.at && !(p.section === 2 && ms >= T2.removed))
  const questions = PLACED.reduce((n, p) => n + (p.section === 2 && ms >= T2.removed ? 0 : p.subs.reduce((m, s) => m + s.questions.filter((q) => ms >= q).length, 0)), 0)

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className={`mx-4 mt-4 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2 text-[11px] transition-[border-color,box-shadow] duration-700 ${named && ms < T.start + 2400 ? 'border-[#7aa2ff] shadow-[0_0_0_3px_rgba(122,162,255,0.2)]' : 'border-[#e3e6ec]'}`}>
        <span className="text-[#5c646f]">{t({ es: 'Nombre', en: 'Name' })}</span>
        <span className={`truncate font-medium ${named ? 'text-[#303a47]' : 'text-[#b4b8bf]'}`}>{named ? t({ es: 'Encuesta de clima', en: 'Climate survey' }) : t({ es: 'Sin nombre todavía', en: 'No name yet' })}</span>
        <span className="text-[#5c646f]">{t({ es: 'Tipo', en: 'Type' })}</span>
        <span className={named ? 'font-medium text-[#303a47]' : 'text-[#b4b8bf]'}>{named ? t({ es: 'Clima', en: 'Climate' }) : '—'}</span>
      </div>
      <div className="mx-4 mt-3 flex items-baseline justify-between text-[11px] text-[#5c646f]">
        <span className="font-semibold text-[#303a47]">{t({ es: 'Secciones y preguntas', en: 'Sections and questions' })}</span>
        <span className="tabular-nums">{visible.length} · {questions} {t({ es: 'preg.', en: 'q.' })} · ~{Math.ceil(questions * 0.5)} min</span>
      </div>
      <ol className="mt-2 flex-1 space-y-2 overflow-hidden px-4 pb-4">
        {visible.length === 0 && (
          <li className="rounded-lg border border-dashed border-[#c5ccd8] px-3 py-6 text-center text-[11px] text-[#979ba3]">{t({ es: 'La encuesta aparecerá aquí mientras la IA la arma', en: 'The survey will show up here as the AI builds it' })}</li>
        )}
        {visible.map((p) => {
          const s = SECTIONS[p.section]
          const creating = ms < p.end
          const leaving = p.section === 2 && ms >= T2.remove
          return (
            <li key={s.id} className={`enc-ai-in rounded-lg border bg-white p-2.5 transition-[opacity,transform] duration-500 ${leaving ? 'translate-x-6 opacity-0' : ''} ${creating ? 'border-[#7aa2ff]' : 'border-[#e3e6ec]'}`}>
              <p className="flex items-center gap-2 text-[12px] font-semibold text-[#303a47]">
                <span className="rounded px-1.5 py-px font-mono text-[10px] text-white" style={{ background: UBITS_BLUE }}>{p.section + 1}</span>
                <span className="truncate">{t(s.title)}</span>
                {creating && <span className="enc-ai-shimmer ml-auto shrink-0 bg-clip-text text-[10px] font-medium text-transparent" style={{ backgroundImage: AI_GRADIENT }}>{t({ es: 'Creando…', en: 'Creating…' })}</span>}
              </p>
              <ul className="mt-1.5 space-y-1.5 pl-3">
                {p.subs.filter((sub) => ms >= sub.at).map((sub, k) => {
                  const shown = sub.questions.filter((q) => ms >= q).length
                  const last = s.subs[k].questions[shown - 1]
                  return (
                    <li key={k} className="enc-ai-in border-l-2 border-[#ecf1fa] pl-2">
                      <p className="flex items-center gap-2 text-[11px] text-[#414a5c]">
                        <span className="font-mono text-[10px] text-[#979ba3]">{p.section + 1}.{k + 1}</span>
                        <span className="truncate">{t(s.subs[k].title)}</span>
                        <span className="ml-auto flex shrink-0 gap-0.5" aria-label={`${shown} ${t({ es: 'preguntas', en: 'questions' })}`}>
                          {sub.questions.map((q, i) => (
                            <span key={i} className={`h-1.5 w-3 rounded-full transition-[opacity,transform] duration-300 ${ms >= q ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} style={{ background: UBITS_BLUE }} />
                          ))}
                        </span>
                      </p>
                      {last && creating && <p key={shown} className="enc-ai-drop truncate text-[10.5px] text-[#5c646f]">“{t(last)}”</p>}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** La réplica animada de «Crear encuesta con IA», con los cuatro momentos debajo. */
export function AiBuilderDemo() {
  const { t } = useLocale()
  const { ref, ms, paused, setHover, replay, reducedMotion } = useSceneClock()
  const step = stepAt(ms)

  return (
    <div ref={ref} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <div className="relative overflow-hidden rounded-2xl bg-[#f8faff] text-[#303a47] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white px-4 py-2.5">
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-black/15" />)}
          </span>
          <span className="truncate font-mono text-[10px] text-black/45">/admin/desempeno-cultura/encuestas/crear</span>
          <span className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ background: AI_GRADIENT }}>✦ {t({ es: 'Crear con IA', en: 'Create with AI' })}</span>
        </div>
        <div className="grid h-[34rem] grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:h-[30rem] md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:grid-rows-1">
          <GrowingTree ms={ms} />
          <aside className="flex min-h-0 flex-col border-t border-black/[0.06] bg-white md:border-l md:border-t-0">
            <p className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-2.5 text-[11px] text-[#5c646f]">
              <Orb busy={ms >= T.start && ms < T2.done} />
              <span className="font-semibold text-[#303a47]">Orbit</span> · {t({ es: 'Contexto: secciones y preguntas', en: 'Context: sections and questions' })}
            </p>
            <div className="min-h-0 flex-1">
              <ChatThread ms={ms} />
            </div>
            <Composer ms={ms} />
          </aside>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start">
        <ol className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.label.es} className={`border-t-2 pt-3 transition-[opacity,border-color] duration-500 ${i === step ? 'border-signal opacity-100' : i < step ? 'border-fg/40 opacity-60' : 'border-fg/15 opacity-40'}`}>
              <span className="font-mono text-xs text-signal">{i + 1}</span>
              <span className="mt-1 block text-sm leading-snug">{t(s.label)}</span>
            </li>
          ))}
        </ol>
        {!reducedMotion && (
          <button type="button" onClick={replay} className="shrink-0 self-start rounded-full border border-fg/25 px-4 py-2 font-mono text-xs transition-colors hover:border-fg">
            ↺ {t({ es: 'Repetir', en: 'Replay' })}
            {paused && <span className="ml-2 opacity-60">· {t({ es: 'en pausa', en: 'paused' })}</span>}
          </button>
        )}
      </div>
    </div>
  )
}
