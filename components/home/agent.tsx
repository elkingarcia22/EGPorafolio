'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { answerQuestion, SUGGESTIONS } from '@/lib/agent/answer'

interface Message {
  id: number
  from: 'user' | 'agent'
  text: string
}

const MAX_QUESTION_LENGTH = 240
const TYPE_SPEED_MS = 14

/** Chat tipo terminal con el agente (demo local sobre la hoja de vida). */
export function Agent() {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const [messages, setMessages] = useState<readonly Message[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  const ask = (raw: string) => {
    const question = raw.trim().slice(0, MAX_QUESTION_LENGTH)
    if (!question || typing) return
    const userMsg: Message = { id: nextId.current++, from: 'user', text: question }
    const full = answerQuestion(question, locale)
    const agentId = nextId.current++
    setDraft('')

    if (reducedMotion) {
      setMessages((prev) => [...prev, userMsg, { id: agentId, from: 'agent', text: full }])
      return
    }

    setMessages((prev) => [...prev, userMsg, { id: agentId, from: 'agent', text: '' }])
    setTyping(true)
    let i = 0
    const timer = window.setInterval(() => {
      i += 3
      const text = full.slice(0, i)
      setMessages((prev) => prev.map((m) => (m.id === agentId ? { ...m, text } : m)))
      if (i >= full.length) {
        window.clearInterval(timer)
        setTyping(false)
      }
    }, TYPE_SPEED_MS)
  }

  return (
    <ToneSection tone="dark" id="agent" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionLabel index="04" className="mb-8">{t(COPY.agent.label)}</SectionLabel>
          <h2 className="text-[clamp(2.4rem,1rem+5vw,5.5rem)] font-light leading-[0.9] tracking-tight">{t(COPY.agent.title)}</h2>
          <p className="mt-6 max-w-sm leading-relaxed opacity-70">{t(COPY.agent.intro)}</p>
        </div>

        <div className="md:col-span-7">
          <div className="border border-fg/20 bg-fg/[0.03]">
            <div className="flex items-center justify-between border-b border-fg/15 px-4 py-3">
              <span className="mono-label flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-signal" aria-hidden="true" />
                EG · agent
              </span>
              <span className="mono-label opacity-40">{t(COPY.agent.disclaimer)}</span>
            </div>

            <div ref={logRef} role="log" aria-live="polite" className="h-[22rem] space-y-5 overflow-y-auto p-5 font-mono text-sm" data-lenis-prevent>
              {messages.length === 0 && (
                <p className="opacity-50">
                  <span className="text-signal">EG ▸</span> {t(COPY.agent.intro)}
                </p>
              )}
              {messages.map((m) => (
                <p key={m.id} className={m.from === 'user' ? 'opacity-60' : 'leading-relaxed'}>
                  <span className={m.from === 'user' ? '' : 'text-signal'}>
                    {m.from === 'user' ? `${t(COPY.agent.you)} ▸` : 'EG ▸'}
                  </span>{' '}
                  {m.text}
                  {m.from === 'agent' && typing && m.id === messages[messages.length - 1]?.id && <span className="caret" />}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-fg/15 px-4 pt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.es}
                  type="button"
                  onClick={() => ask(t(s))}
                  disabled={typing}
                  className="border border-fg/25 px-3 py-1.5 text-xs transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
                >
                  {t(s)}
                </button>
              ))}
            </div>

            <form
              className="flex items-center gap-3 p-4"
              onSubmit={(e) => {
                e.preventDefault()
                ask(draft)
              }}
            >
              <label htmlFor="agent-input" className="sr-only-focusable">
                {t(COPY.agent.placeholder)}
              </label>
              <span className="font-mono text-signal" aria-hidden="true">▸</span>
              <input
                id="agent-input"
                value={draft}
                maxLength={MAX_QUESTION_LENGTH}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t(COPY.agent.placeholder)}
                autoComplete="off"
                className="flex-1 bg-transparent font-mono text-sm placeholder:text-fg/40 focus:outline-none"
              />
              <button type="submit" disabled={typing || !draft.trim()} className="mono-label border border-fg/30 px-4 py-2 transition-colors hover:bg-fg hover:text-bg disabled:opacity-40">
                {t(COPY.agent.send)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ToneSection>
  )
}
