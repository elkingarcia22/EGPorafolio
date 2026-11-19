'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { answerQuestion, newMemory } from '@/lib/agent/answer'
import type { Project } from '@/lib/content/projects'
import { CaseCard, ContactActions, parseReply, RichText } from './agent-message'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const MAX_QUESTION_LENGTH = 600
/** El respaldo local escribe como una persona: piensa un momento y avanza por palabras, con pausas. */
const THINK_MS: readonly [number, number] = [650, 1500]
const WORD_MS: readonly [number, number] = [26, 70]
const PAUSE_MS: readonly [number, number] = [140, 340]
const between = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min)
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/** Preguntas para empezar: lo que más define el perfil. */
const STARTERS: readonly { topic: L; q: L }[] = [
  { topic: { es: 'Producto', en: 'Product' }, q: { es: '¿Cómo conectas el diseño con las métricas del negocio?', en: 'How do you connect design with business metrics?' } },
  { topic: { es: 'Casos', en: 'Cases' }, q: { es: 'Cuéntame de Barberlytics, ¿qué fue lo más difícil?', en: 'Tell me about Barberlytics, what was hardest?' } },
  { topic: { es: 'IA', en: 'AI' }, q: { es: '¿Cómo usas la IA para pasar de idea a producto?', en: 'How do you use AI to go from idea to product?' } },
  { topic: { es: 'Vibe coding', en: 'Vibe coding' }, q: { es: '¿Qué construyes tú mismo con código e IA?', en: 'What do you build yourself with code and AI?' } },
  { topic: { es: 'UX/UI', en: 'UX/UI' }, q: { es: '¿Cómo decides qué diseñar primero?', en: 'How do you decide what to design first?' } },
  { topic: { es: 'Equipo', en: 'Team' }, q: { es: '¿Por qué deberíamos trabajar contigo?', en: 'Why should we work with you?' } },
]

/** El monograma con su anillo: la presencia del agente. */
function Presence({ thinking, size = 44 }: { thinking: boolean; size?: number }) {
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden="true">
      <span className={`absolute inset-0 rounded-full border border-signal/60 ${thinking ? 'animate-ping' : ''}`} />
      <span className="absolute inset-[3px] rounded-full bg-[conic-gradient(from_0deg,rgb(var(--signal)),transparent_40%,rgb(var(--signal)))] opacity-70" style={{ animation: 'orbit 6s linear infinite' }} />
      <span className="absolute inset-[5px] flex items-center justify-center rounded-full bg-bg font-medium tracking-tight" style={{ fontSize: size * 0.32 }}>EG</span>
    </span>
  )
}

function Thinking() {
  const { t } = useLocale()
  return (
    <span className="inline-flex items-center gap-2 text-sm opacity-60">
      <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-signal" style={{ animationDelay: `${i * 120}ms` }} />)}</span>
      {t({ es: 'Pensando en cómo contártelo…', en: 'Thinking how to put it…' })}
    </span>
  )
}

/** El agente: una conversación con Elkin sobre producto, métricas, UX/UI e IA, con su trabajo real. */
export function Agent({ projects }: { projects: readonly Project[] }) {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const [messages, setMessages] = useState<readonly Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nextId = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const memoryRef = useRef(newMemory())

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [messages, reducedMotion])
  useEffect(() => () => abortRef.current?.abort(), [])

  const patch = (id: number, content: string) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content } : m)))

  /**
   * Respaldo: sin modelo (sin clave, sin créditos o con error) responde la versión local, con memoria
   * de la conversación, y la escribe como el modelo: pausa para pensar y palabras con ritmo humano.
   */
  const typeLocal = async (id: number, question: string, signal: AbortSignal) => {
    const full = answerQuestion(question, locale, memoryRef.current)
    if (reducedMotion) return patch(id, full)
    const cut = full.search(/\n*\[\[/)
    const body = cut === -1 ? full : full.slice(0, cut)
    const marks = cut === -1 ? '' : full.slice(cut)
    await wait(between(THINK_MS))
    const parts = body.split(/(\s+)/)
    let shown = ''
    for (let i = 0; i < parts.length; ) {
      if (signal.aborted) return
      const step = 1 + Math.floor(Math.random() * 3)
      const chunk = parts.slice(i, i + step * 2).join('')
      i += step * 2
      shown += chunk
      patch(id, shown)
      await wait(/[.,;:?!]\s*$/.test(chunk) ? between(PAUSE_MS) : between(WORD_MS))
    }
    patch(id, body + marks)
  }

  const ask = async (raw: string) => {
    const question = raw.trim().slice(0, MAX_QUESTION_LENGTH)
    if (!question || busy) return
    const userMsg: Message = { id: nextId.current++, role: 'user', content: question }
    const agentId = nextId.current++
    const history = [...messages, userMsg]
    setDraft('')
    setMessages([...history, { id: agentId, role: 'assistant', content: '' }])
    setBusy(true)
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale, messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      })
      // Sin clave, sin créditos, límite alcanzado o error del modelo: responde el respaldo, sin avisos.
      if (!res.ok || !res.body) {
        await typeLocal(agentId, question, controller.signal)
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        patch(agentId, text)
      }
      if (!text.trim()) await typeLocal(agentId, question, controller.signal)
    } catch (error) {
      if ((error as Error).name !== 'AbortError') await typeLocal(agentId, question, controller.signal)
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  const reset = () => {
    abortRef.current?.abort()
    setMessages([])
    memoryRef.current = newMemory()
    setBusy(false)
    inputRef.current?.focus()
  }

  const last = messages[messages.length - 1]

  return (
    <ToneSection tone="dark" id="agent" className="relative overflow-hidden px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <span className="pointer-events-none absolute -right-[10%] top-[10%] h-[60%] w-[50%] rounded-full bg-signal opacity-[0.07] blur-[120px]" aria-hidden="true" />
      <div className="relative grid gap-12 lg:grid-cols-12">
        {/* Quién responde */}
        <div className="min-w-0 lg:col-span-5">
          <SectionLabel index="04" className="mb-8">{t(COPY.agent.label)}</SectionLabel>
          <h2 className="text-[clamp(2.4rem,1rem+5vw,5.5rem)] font-light leading-[0.9] tracking-tight">{t(COPY.agent.title)}</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed opacity-75">{t(COPY.agent.intro)}</p>

          <div className="mt-10 flex items-center gap-4">
            <Presence thinking={busy} size={56} />
            <div>
              <p className="text-base">Elkin Garcia</p>
              <p className="mono-label mt-1 flex items-center gap-2 opacity-60">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4cc98d]" aria-hidden="true" />
                {t({ es: 'Producto · UX/UI · IA · vibe coding', en: 'Product · UX/UI · AI · vibe coding' })}
              </p>
            </div>
          </div>

          <p className="mono-label mb-3 mt-10 opacity-50">{t({ es: 'Empieza por aquí', en: 'Start here' })}</p>
          <ul className="space-y-1.5">
            {STARTERS.map((s) => (
              <li key={s.q.es}>
                <button
                  type="button"
                  onClick={() => ask(t(s.q))}
                  disabled={busy}
                  className="group flex w-full items-baseline gap-3 border-b border-fg/10 py-2.5 text-left transition-colors hover:border-signal disabled:opacity-40"
                >
                  <span className="mono-label w-20 shrink-0 text-signal">{t(s.topic)}</span>
                  <span className="flex-1 opacity-80 transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:opacity-100">{t(s.q)}</span>
                  <span className="text-signal opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* La conversación */}
        <div className="min-w-0 lg:col-span-7">
          <div className="flex h-[min(44rem,82svh)] flex-col overflow-hidden rounded-2xl border border-fg/15 bg-[rgb(var(--fg)/0.025)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
            <div className="flex items-center gap-3 border-b border-fg/10 px-5 py-3.5">
              <Presence thinking={busy} size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{t({ es: 'Elkin · agente', en: 'Elkin · agent' })}</p>
                <p className="mono-label truncate opacity-45">{t(COPY.agent.disclaimer)}</p>
              </div>
              {messages.length > 0 && (
                <button type="button" onClick={reset} className="mono-label opacity-50 transition-opacity hover:opacity-100">
                  {t({ es: 'Nueva conversación', en: 'New chat' })}
                </button>
              )}
            </div>

            <div ref={logRef} role="log" aria-live="polite" aria-busy={busy} className="flex-1 space-y-6 overflow-y-auto px-5 py-6" data-lenis-prevent>
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-center">
                  <p className="text-[clamp(1.4rem,1rem+1.2vw,2rem)] font-light leading-snug">
                    {t({ es: 'Hola, soy Elkin. Diseño productos que mueven métricas y uso IA para construirlos.', en: 'Hi, I’m Elkin. I design products that move metrics and use AI to build them.' })}
                  </p>
                  <p className="mt-3 opacity-60">{t({ es: '¿Qué te gustaría saber?', en: 'What would you like to know?' })}</p>
                </div>
              )}

              {messages.map((m) => {
                if (m.role === 'user') {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <p className="max-w-[85%] animate-[ramp-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] rounded-2xl rounded-tr-sm bg-fg/[0.08] px-4 py-2.5 text-[15px]">{m.content}</p>
                    </div>
                  )
                }
                const { text, extras } = parseReply(m.content)
                const streaming = busy && m.id === last?.id
                const cases = extras.cases.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p))
                return (
                  <div key={m.id} className="flex gap-3">
                    <Presence thinking={streaming} size={28} />
                    <div className="min-w-0 flex-1 space-y-4 pt-0.5 text-[15px] leading-relaxed opacity-90">
                      {text ? (
                        <div>
                          <RichText text={text} />
                          {streaming && <span className="caret" />}
                        </div>
                      ) : (
                        streaming && <Thinking />
                      )}
                      {!streaming && cases.length > 0 && <div className="grid gap-2">{cases.map((p) => <CaseCard key={p.slug} project={p} />)}</div>}
                      {!streaming && (extras.contact || extras.cv) && <ContactActions contact={extras.contact} cv={extras.cv} />}
                      {!streaming && m.id === last?.id && extras.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {extras.suggestions.slice(0, 2).map((s) => (
                            <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-signal/40 px-3.5 py-1.5 text-xs text-signal transition-colors hover:bg-signal hover:text-paper">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <form
              className="border-t border-fg/10 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                ask(draft)
              }}
            >
              <div className="flex items-end gap-2 rounded-xl border border-fg/15 bg-bg/60 p-2 transition-colors focus-within:border-signal/60">
                <label htmlFor="agent-input" className="sr-only">{t(COPY.agent.placeholder)}</label>
                <textarea
                  ref={inputRef}
                  id="agent-input"
                  rows={1}
                  value={draft}
                  maxLength={MAX_QUESTION_LENGTH}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      ask(draft)
                    }
                  }}
                  placeholder={t({ es: 'Pregúntame sobre producto, métricas, UX/UI o IA…', en: 'Ask me about product, metrics, UX/UI or AI…' })}
                  autoComplete="off"
                  className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-[15px] placeholder:text-fg/35 focus:outline-none"
                />
                <button type="submit" disabled={busy || !draft.trim()} aria-label={t(COPY.agent.send)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-signal text-paper transition-[transform,opacity] hover:scale-105 disabled:opacity-30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ToneSection>
  )
}
