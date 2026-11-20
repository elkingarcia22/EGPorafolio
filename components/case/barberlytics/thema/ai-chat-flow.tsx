'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ClipperOrb } from '../clipper-orb'

/**
 * Cómo trabaja la IA con el sistema, como una conversación que avanza sola:
 * el pedido en palabras de la pantalla y cada paso que da la IA para armarla.
 */
type Step =
  | { kind: 'read'; title: L; detail: string }
  | { kind: 'pick'; title: L; chips: readonly string[] }
  | { kind: 'code'; title: L; lines: readonly string[] }
  | { kind: 'check'; title: L; items: readonly L[] }
  | { kind: 'done'; title: L }

const PROMPT: L = {
  es: '«Una tabla de colaboradores con filtro por área, selección múltiple y acciones masivas»',
  en: '“A team table with a filter by area, multiple selection and bulk actions”',
}

const STEPS: readonly Step[] = [
  { kind: 'read', title: { es: 'Leo las reglas del equipo', en: 'I read the team rules' }, detail: 'AGENTS.md · CLAUDE.md' },
  { kind: 'read', title: { es: 'Busco las piezas en el catálogo', en: 'I look up the pieces in the catalog' }, detail: 'ai-tools/CATALOG.md · 218 componentes' },
  { kind: 'pick', title: { es: 'Elijo del sistema, no invento', en: 'I pick from the system, I don’t invent' }, chips: ['TableShell', 'FilterBar', 'ActionRail', 'SelectMark'] },
  { kind: 'code', title: { es: 'Armo la pantalla con esas piezas', en: 'I assemble the screen with those pieces' }, lines: ['<TableShell rows={team}>', '  <FilterBar by="area" />', '  <ActionRail bulk />', '</TableShell>'] },
  { kind: 'check', title: { es: 'El guardián y las reglas revisan', en: 'The guard and the rules check' }, items: [{ es: 'Sin HEX a mano', en: 'No hand-written HEX' }, { es: 'Sin otra librería', en: 'No other library' }, { es: 'npm run check · 9 de 9', en: 'npm run check · 9 of 9' }] },
  { kind: 'done', title: { es: 'Lista para revisar, dentro del sistema', en: 'Ready for review, inside the system' } },
]

const STEP_MS = 1300
const PAUSE_STEPS = 4

/** Avanza un paso cada cierto tiempo desde que la conversación entra en pantalla; luego vuelve a empezar. */
function useConversation(total: number) {
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(reducedMotion ? total : -1)
  useEffect(() => {
    if (reducedMotion) return setStep(total)
    const el = ref.current
    if (!el) return
    let timer = 0
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer)
      if (!entry.isIntersecting) return
      timer = window.setInterval(() => setStep((s) => (s >= total + PAUSE_STEPS ? -1 : s + 1)), STEP_MS)
    }, { threshold: 0.35 })
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [total, reducedMotion])
  return { ref, step }
}

function StepBody({ step }: { step: Step }) {
  const { t } = useLocale()
  if (step.kind === 'read') return <p className="mt-1 font-mono text-[11px] text-[#9fd6c4]">↳ {step.detail}</p>
  if (step.kind === 'pick')
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {step.chips.map((c) => <span key={c} className="rounded-md border border-[#d9b36a]/40 bg-[#d9b36a]/10 px-2 py-0.5 font-mono text-[11px] text-[#d9b36a]">{c}</span>)}
      </div>
    )
  if (step.kind === 'code')
    return (
      <pre className="mt-2 rounded-lg bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/80">
        {step.lines.join('\n')}
      </pre>
    )
  if (step.kind === 'check')
    return (
      <ul className="mt-2 space-y-1 text-[12px]">
        {step.items.map((item) => <li key={item.es}><span className="text-[#7fd8af]">✓</span> {t(item)}</li>)}
      </ul>
    )
  return null
}

export function AiChatFlow() {
  const { t } = useLocale()
  const { ref, step: rawStep } = useConversation(STEPS.length)
  // Al final de la pausa la conversación entera se desvanece (leaving) y, ya invisible, se pliega:
  // nunca se ve el salto de los pasos colapsando a cero.
  const leaving = rawStep >= STEPS.length + PAUSE_STEPS - 1
  const step = rawStep >= STEPS.length + PAUSE_STEPS ? -1 : rawStep
  const thinking = step >= 0 && step < STEPS.length

  return (
    <div ref={ref} data-reveal="device" className="overflow-hidden rounded-2xl bg-[#14120f] text-[#efe9dd] ring-1 ring-[#d9b36a]/15 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <ClipperOrb size={28} state={thinking ? 'thinking' : 'idle'} />
        <span className="text-sm font-medium">{t({ es: 'Construir con la IA', en: 'Building with AI' })}</span>
        <span className="ml-auto font-mono text-[10px] text-white/40">Claude Code · Thema</span>
      </div>
      <div className={`min-h-[520px] space-y-4 p-5 transition-opacity duration-500 md:p-7 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex justify-end">
          <p className={`max-w-[80%] rounded-2xl rounded-br-md bg-[#d9b36a] px-4 py-3 text-sm text-[#17140f] transition-all duration-500 ${step >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>{t(PROMPT)}</p>
        </div>
        <ol className="space-y-3">
          {STEPS.map((s, i) => {
            const visible = step > i
            return (
              <li
                key={s.title.es}
                className={`flex gap-3 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'h-0 translate-y-3 overflow-hidden opacity-0'}`}
                aria-hidden={!visible}
              >
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${s.kind === 'done' ? 'bg-[#7fd8af] text-[#14120f]' : 'bg-white/10'}`}>
                  {s.kind === 'done' ? '✓' : i + 1}
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm">{t(s.title)}</p>
                  <StepBody step={s} />
                </div>
              </li>
            )
          })}
        </ol>
        {thinking && step > 0 && (
          <p className="flex items-center gap-2 pl-9 text-xs text-white/45">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:240ms]" />
            </span>
            {t({ es: 'Pensando…', en: 'Thinking…' })}
          </p>
        )}
      </div>
    </div>
  )
}
