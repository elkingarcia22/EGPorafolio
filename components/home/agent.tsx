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
import { useRiseIn } from './use-rise-in'
import { useEnterSequence, type EnterStep } from './use-enter-sequence'

/** Entrada: la caja del chat sube a su sitio (donde llegan las fibras) y aparecen los atajos. */
const ENTER_STEPS: readonly EnterStep[] = [
  { selector: '[data-ag-panel]', from: { autoAlpha: 0, y: 40, scale: 0.97, duration: 1.1, ease: 'expo.out' }, at: 0.1 },
  { selector: '[data-ag-starter]', from: { autoAlpha: 0, y: 10, scale: 0.92, ease: 'back.out(1.8)' }, at: 0.6 },
  { selector: '[data-ag-panel] [data-ag-head]', from: { autoAlpha: 0, y: -12 }, at: 0.8 },
]

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

/** Cuántas preguntas para empezar se muestran como atajos dentro del chat */
const STARTER_CHIPS = 4
/** Preguntas para empezar: lo que más define el perfil. */
const STARTERS: readonly { topic: L; q: L }[] = [
  { topic: { es: 'Producto', en: 'Product' }, q: { es: '¿Cómo conectas el diseño con las métricas del negocio?', en: 'How do you connect design with business metrics?' } },
  { topic: { es: 'Casos', en: 'Cases' }, q: { es: 'Cuéntame de Barberlytics, ¿qué fue lo más difícil?', en: 'Tell me about Barberlytics, what was hardest?' } },
  { topic: { es: 'IA', en: 'AI' }, q: { es: '¿Cómo usas la IA para pasar de idea a producto?', en: 'How do you use AI to go from idea to product?' } },
  { topic: { es: 'Vibe coding', en: 'Vibe coding' }, q: { es: '¿Qué construyes tú mismo con código e IA?', en: 'What do you build yourself with code and AI?' } },
  { topic: { es: 'UX/UI', en: 'UX/UI' }, q: { es: '¿Cómo decides qué diseñar primero?', en: 'How do you decide what to design first?' } },
  { topic: { es: 'Equipo', en: 'Team' }, q: { es: '¿Por qué deberíamos trabajar contigo?', en: 'Why should we work with you?' } },
]

function Thinking() {
  const { t } = useLocale()
  return <span className="caret opacity-60">{t({ es: 'pensando', en: 'thinking' })}</span>
}

/** El agente: una conversación con Elkin sobre producto, métricas, UX/UI e IA, con su trabajo real. */
export function Agent({ projects }: { projects: readonly Project[] }) {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const [messages, setMessages] = useState<readonly Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const memoryRef = useRef(newMemory())
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const title = t(COPY.agent.title)
  useRiseIn(titleRef, reducedMotion)
  useEnterSequence(rootRef, ENTER_STEPS, reducedMotion)

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
    <ToneSection tone="dark" id="agent" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div ref={rootRef} className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <SectionLabel index="04" thread={false} className="mb-8">{t(COPY.agent.label)}</SectionLabel>
        <h2 ref={titleRef} className="text-[clamp(2.4rem,1rem+5vw,5.5rem)] font-light leading-[0.9] tracking-tight">{title}</h2>

        {/* La caja del chat: aquí llegan las fibras de Trayectoria */}
        <div className="mt-12 w-full min-w-0 text-left">
          <div data-ag-panel data-converge-to className="relative z-10 flex h-[min(32rem,72svh)] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[rgb(var(--void)/0.7)] shadow-[0_30px_90px_-30px_rgb(var(--signal)/0.45)] backdrop-blur-md lg:h-[min(36rem,74svh)]">
            <div data-ag-head className="flex items-center justify-between gap-4 border-b border-fg/15 px-4 py-3">
              <span className="mono-label flex shrink-0 items-center gap-2 whitespace-nowrap">
                <span className={`h-2 w-2 rounded-full bg-signal ${busy ? 'animate-pulse' : ''}`} aria-hidden="true" />
                EG · agent
              </span>
              {messages.length > 0 ? (
                <button type="button" onClick={reset} className="mono-label opacity-40 transition-opacity hover:opacity-100">
                  {t({ es: 'Reiniciar', en: 'Reset' })}
                </button>
              ) : (
                <span className="mono-label truncate opacity-40">{t(COPY.agent.disclaimer)}</span>
              )}
            </div>

            <div ref={logRef} role="log" aria-live="polite" aria-busy={busy} className="flex-1 space-y-6 overflow-y-auto p-5 text-[15px] leading-relaxed" data-lenis-prevent>
              {messages.length === 0 && (
                <div className="space-y-5">
                  <p className="opacity-60">
                    <span className="mono-label mr-2 text-signal">EG ▸</span>
                    {t({ es: 'Hola, soy Elkin. Pregúntame cómo diseño, mido y construyo productos.', en: 'Hi, I’m Elkin. Ask me how I design, measure and build products.' })}
                  </p>
                  {/* Atajos: unas pocas preguntas para empezar */}
                  <div className="flex flex-wrap gap-2">
                    {STARTERS.slice(0, STARTER_CHIPS).map((s) => (
                      <button
                        key={s.q.es}
                        type="button"
                        data-ag-starter
                        onClick={() => ask(t(s.q))}
                        disabled={busy}
                        className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-left text-xs text-paper/80 transition-[border-color,background-color,color] duration-300 hover:border-white/40 hover:bg-white/10 hover:text-paper disabled:opacity-40"
                      >
                        {t(s.q)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => {
                if (m.role === 'user') {
                  return (
                    <p key={m.id} className="opacity-55">
                      <span className="mono-label mr-2">{t(COPY.agent.you)} ▸</span>
                      {m.content}
                    </p>
                  )
                }
                const { text, extras } = parseReply(m.content)
                const streaming = busy && m.id === last?.id
                const cases = extras.cases.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p))
                return (
                  <div key={m.id} className="space-y-4">
                    <div className="flex gap-2">
                      <span className="mono-label mt-[0.35em] shrink-0 text-signal">EG ▸</span>
                      <div className="min-w-0 flex-1 opacity-90">
                        {text ? <RichText text={text} /> : streaming && <Thinking />}
                        {text && streaming && <span className="caret" />}
                      </div>
                    </div>
                    {!streaming && cases.length > 0 && <div className="grid gap-2 sm:grid-cols-2">{cases.map((p) => <CaseCard key={p.slug} project={p} />)}</div>}
                    {!streaming && (extras.contact || extras.cv) && <ContactActions contact={extras.contact} cv={extras.cv} />}
                    {!streaming && m.id === last?.id && extras.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {extras.suggestions.slice(0, 2).map((s) => (
                          <button key={s} type="button" onClick={() => ask(s)} className="border border-fg/25 px-3 py-1.5 text-xs transition-colors hover:border-signal hover:text-signal">
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <form
              className="flex items-center gap-3 border-t border-fg/15 p-4"
              onSubmit={(e) => {
                e.preventDefault()
                ask(draft)
              }}
            >
              <label htmlFor="agent-input" className="sr-only">{t(COPY.agent.placeholder)}</label>
              <span className="font-mono text-signal" aria-hidden="true">▸</span>
              <input
                ref={inputRef}
                id="agent-input"
                value={draft}
                maxLength={MAX_QUESTION_LENGTH}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t(COPY.agent.placeholder)}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-fg/40 focus:outline-none"
              />
              <button type="submit" disabled={busy || !draft.trim()} className="mono-label border border-fg/30 px-4 py-2 transition-colors hover:bg-fg hover:text-bg disabled:opacity-40">
                {t(COPY.agent.send)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ToneSection>
  )
}
