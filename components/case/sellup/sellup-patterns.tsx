'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { SELLUP_CASE, type AgentId } from '@/lib/content/cases/sellup/sellup-case'
import { BLUE, CostChip, STAGE, useInView } from './ui'

/** En qué escalón se detiene cada agente en la corrida contada (índice del paso). */
const STOP_AT: Record<AgentId, number> = { a1: 0, a2: 0, a3: 3 }
const STEP_MS = 650

/** 02 · Patrones: la escalera «primero lo gratis», la misma en los tres agentes. */
export function CascadeStairs() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { patterns } = SELLUP_CASE
  const [agent, setAgent] = useState<AgentId>('a1')
  const [ref, seen] = useInView<HTMLDivElement>()
  const cascade = patterns.cascades.find((c) => c.id === agent) ?? patterns.cascades[0]
  const stop = STOP_AT[agent]
  const last = cascade.steps.length - 1
  const [walker, setWalker] = useState(-1)

  // El agente baja la escalera hasta su escalón y salta a la persona.
  useEffect(() => {
    if (!seen) return
    if (reducedMotion) {
      setWalker(last)
      return
    }
    setWalker(-1)
    const path = [...Array.from({ length: stop + 1 }, (_, i) => i), last]
    const timers = path.map((p, i) => window.setTimeout(() => setWalker(p), (i + 1) * STEP_MS))
    return () => timers.forEach(window.clearTimeout)
  }, [agent, seen, reducedMotion, stop, last])

  return (
    <div>
      <p data-reveal className="mb-10 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <div ref={ref} data-reveal="device" className={STAGE}>
        <div role="tablist" aria-label={t({ es: 'Agentes', en: 'Agents' })} className="mb-8 inline-flex flex-wrap gap-1 rounded-[14px] bg-white/[0.06] p-1">
          {patterns.cascades.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={c.id === agent}
              onClick={() => setAgent(c.id)}
              className={`rounded-[10px] px-3.5 py-1.5 text-sm transition-colors ${c.id === agent ? 'bg-white text-[#14161b]' : 'text-white/65 hover:text-white'}`}
            >
              {t(c.agent)}
            </button>
          ))}
        </div>

        <p className="mb-6 font-mono text-xs text-white/55">{t(cascade.goal)}</p>

        <ol className="space-y-2">
          {cascade.steps.map((s, i) => {
            const skipped = i > stop && i < last
            const here = walker === i
            const passed = walker >= i && !skipped
            return (
              <li
                key={s.name.es}
                className="relative grid items-center gap-3 rounded-[12px] border px-4 py-3 transition-all duration-500 sm:grid-cols-[minmax(0,1fr)_auto]"
                style={{
                  marginLeft: `min(${i * 7}%, ${i * 56}px)`,
                  borderColor: here ? BLUE : 'rgba(255,255,255,0.08)',
                  background: here ? 'rgba(91,126,255,0.12)' : passed ? 'rgba(255,255,255,0.04)' : 'transparent',
                  opacity: skipped && walker >= last ? 0.32 : 1,
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[10px] transition-colors duration-500 ${here ? 'bg-[#5b7eff] text-white' : passed ? 'bg-white/80 text-[#0b0e14]' : 'bg-white/10 text-white/60'}`}
                  >
                    {passed && !here ? '✓' : i + 1}
                  </span>
                  <span>
                    <span className={`block text-sm ${skipped && walker >= last ? 'line-through decoration-white/40' : ''}`}>{t(s.name)}</span>
                    <span className="block text-xs text-white/50">{t(s.note)}</span>
                  </span>
                </span>
                <CostChip cost={s.cost} />
              </li>
            )
          })}
        </ol>

        <p className={`mt-6 max-w-[60ch] border-l-2 pl-4 text-sm leading-relaxed text-white/80 transition-opacity duration-700 ${walker >= last ? 'opacity-100' : 'opacity-0'}`} style={{ borderColor: BLUE }} aria-live="polite">
          {t(cascade.stop)}
        </p>
      </div>

      <ol className="mt-12 space-y-4">
        {patterns.insights.map((insight, i) => (
          <li key={insight.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
