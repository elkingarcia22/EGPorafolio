'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useAutoSteps, useInView } from './use-auto-steps'
import { useNarrow } from '../use-narrow'
import { useSwipe } from '@/components/case/kit/use-swipe'

type Kind = 'rule' | 'estimate' | 'assistant'

/** Cómo se marca cada capacidad en la plataforma: solo lo que pasa por un modelo lleva la marca de IA */
const BADGE: Record<Kind, { label: L; tone: string }> = {
  rule: { label: { es: 'Sugerencia', en: 'Suggestion' }, tone: 'text-white/60 border-white/25' },
  estimate: { label: { es: 'Estimación', en: 'Estimate' }, tone: 'text-[#4fb8dc] border-[#4fb8dc]/50' },
  assistant: { label: { es: 'IA', en: 'AI' }, tone: 'text-[#16130f] border-transparent bg-gradient-to-r from-[#d9b36a] via-[#ff54aa] to-[rgb(var(--signal))]' },
}
/** Dónde cae cada propuesta en la rejilla de tres columnas: fila de inicio y cuántas filas ocupa */
const SLOTS: readonly { col: number; row: number; span: number }[] = [
  { col: 1, row: 1, span: 3 },
  { col: 2, row: 2, span: 2 },
  { col: 3, row: 1, span: 2 },
  { col: 1, row: 4, span: 2 },
  { col: 3, row: 3, span: 3 },
  { col: 2, row: 4, span: 3 },
]
/** Una propuesta se traza tras otra; luego se encienden solas, una a la vez, con su explicación */
const STEP_MS = 420
const CYCLE_MS = 3200

/**
 * 06 · IA: las seis capacidades caen como propuestas en fantasma sobre una
 * rejilla de calendario —propone en la rejilla, no en un chat—. Cada una lleva
 * la marca que lleva en la plataforma; solo Clipper lleva la de IA. Tocar una
 * dice cómo se ve en el producto. De Clipper baja la fibra a «Impacto».
 */
export function GhostProposals() {
  const { t } = useLocale()
  const { features } = PLATFORM_CASE.ai
  const rootRef = useRef<HTMLDivElement>(null)
  const step = useAutoSteps(rootRef, features.length, STEP_MS)
  const [picked, setPicked] = useState<number | null>(null)
  const { reducedMotion } = useA11y()
  const inView = useInView(rootRef)
  const [cycle, setCycle] = useState<number | null>(null)
  const done = step >= features.length
  useEffect(() => {
    if (picked !== null || !done || !inView || reducedMotion) return
    const id = window.setTimeout(() => setCycle((c) => (c === null ? 0 : (c + 1) % features.length)), cycle === null ? 600 : CYCLE_MS)
    return () => window.clearTimeout(id)
  }, [picked, done, inView, reducedMotion, cycle, features.length])
  const active = picked ?? cycle
  const f = active === null ? null : features[active]
  const narrow = useNarrow('(max-width: 767px)')
  const deckRef = useRef<HTMLDivElement>(null)
  const shown = active ?? 0
  const go = (dir: 1 | -1) => setPicked((shown + dir + features.length) % features.length)
  useSwipe(deckRef, { onNext: () => go(1), onPrev: () => go(-1), disabled: !narrow })

  if (narrow) {
    const feat = features[shown]
    const badge = BADGE[feat.kind]
    return (
      <div ref={rootRef} className="mx-auto max-w-[420px]">
        {/* Un mazo: la propuesta de arriba se traza; las demás esperan detrás, en fantasma */}
        <div ref={deckRef} className="relative pb-6">
          <span aria-hidden="true" className="absolute inset-x-6 bottom-0 top-6 rounded-2xl border border-dashed border-white/10" />
          <span aria-hidden="true" className="absolute inset-x-3 bottom-3 top-3 rounded-2xl border border-dashed border-white/15 bg-void" />
          <button key={shown} type="button" onClick={() => go(1)} className={`relative flex min-h-[15rem] w-full flex-col rounded-2xl bg-[#121009] p-6 text-left outline-none transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0'}`}>
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <rect x="0" y="0" width="100%" height="100%" rx="16" fill="none" stroke="#d9b36a" strokeWidth="1.2" pathLength={1} className="pl-trace" />
            </svg>
            <span aria-hidden="true" className="pl-appear pointer-events-none absolute inset-0 rounded-2xl border border-solid border-[#d9b36a]/70 shadow-[0_0_40px_-10px_rgba(217,179,106,0.6)]" style={{ animationDelay: '600ms' }} />
            <span className="relative flex items-start justify-between gap-3">
              <span className="pl-fade text-[21px] font-light leading-tight tracking-tight" style={{ animationDelay: '200ms' }}>{t(feat.name)}</span>
              <span className={`pl-pop relative mt-1 inline-flex shrink-0 items-center rounded-full border px-2.5 py-[3px] font-mono text-[11px] uppercase tracking-[0.12em] ${badge.tone}`} style={{ animationDelay: '500ms' }}>{t(badge.label)}</span>
            </span>
            <span className="pl-fade relative mt-auto pt-6 text-[15px] leading-relaxed text-paper/75" style={{ animationDelay: '450ms' }}>{t(feat.how)}</span>
          </button>
        </div>

        {/* Una propuesta por punto; la de IA, con su marca */}
        <ol className="mt-6 flex items-center justify-center gap-3">
          {features.map((ft, i) => (
            <li key={ft.name.es} className="relative">
              <button type="button" aria-label={t(ft.name)} aria-pressed={shown === i} onClick={() => setPicked(i)} className="grid h-7 w-7 place-items-center outline-none">
                <span className={`block rounded-full transition-all duration-500 ${shown === i ? 'h-2.5 w-6 bg-[#d9b36a]' : ft.kind === 'assistant' ? 'h-2 w-2 bg-gradient-to-r from-[#d9b36a] via-[#ff54aa] to-[rgb(var(--signal))]' : 'h-2 w-2 bg-white/25'}`} />
              </button>
              {ft.kind === 'assistant' && <span data-fiber-from="pl-impacto" className="absolute bottom-0 left-1/2 h-px w-px" />}
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-6 max-w-[40ch] text-balance text-center text-[13px] leading-relaxed text-paper/50">
          {t({ es: 'Casi todo lo «inteligente» son reglas y una estimación, no un modelo: por eso se llama «Sugerencia» y no lleva la marca de IA.', en: 'Almost everything “smart” is rules and an estimate, not a model: that’s why it’s called “Suggestion” and doesn’t carry the AI mark.' })}
        </p>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-[880px]">
      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 sm:grid-rows-[repeat(6,3.25rem)] sm:gap-3">
        {/* Las líneas de la rejilla, detrás */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_3.25rem)] sm:block" />
        {features.map((feat, i) => {
          const slot = SLOTS[i]
          const on = step > i
          const isPicked = active === i
          const badge = BADGE[feat.kind]
          return (
            <button
              key={feat.name.es}
              type="button"
              aria-pressed={isPicked}
              onClick={() => setPicked(isPicked ? null : i)}
              className={`group relative flex min-h-[6.5rem] flex-col justify-between rounded-xl p-3.5 text-left outline-none transition-[background-color,box-shadow,transform] duration-500 sm:min-h-0 [grid-column:var(--c)] [grid-row:var(--r)] max-sm:[grid-column:auto] max-sm:[grid-row:auto] ${on ? '' : 'invisible'} ${isPicked ? 'bg-[#d9b36a]/[0.08] shadow-[0_0_40px_-10px_rgba(217,179,106,0.6)]' : 'bg-white/[0.02]'}`}
              style={{ ['--c' as string]: String(slot.col), ['--r' as string]: `${slot.row} / span ${slot.span}` }}
            >
              {on && (
                <>
                  {/* El borde se dibuja como un trazo y queda punteado: una propuesta, no una cita */}
                  <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                    <rect x="0" y="0" width="100%" height="100%" rx="12" fill="none" stroke="#d9b36a" strokeWidth="1.2" pathLength={1} className="pl-trace" />
                  </svg>
                  <span aria-hidden="true" className={`pl-appear pointer-events-none absolute inset-0 rounded-xl border transition-colors duration-500 ${isPicked ? 'border-solid border-[#d9b36a]' : 'border-dashed border-white/25 group-hover:border-white/50'}`} style={{ animationDelay: '600ms' }} />
                </>
              )}
              <span className={`relative text-[15px] leading-snug ${on ? 'pl-fade' : ''}`} style={{ animationDelay: '250ms' }}>{t(feat.name)}</span>
              <span className={`relative mt-3 inline-flex w-fit items-center rounded-full border px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.12em] ${badge.tone} ${on ? 'pl-pop' : ''}`} style={{ animationDelay: '650ms' }}>{t(badge.label)}</span>
              {feat.kind === 'assistant' && <span data-fiber-from="pl-impacto" className="absolute bottom-0 left-1/2 h-px w-px" />}
            </button>
          )
        })}
      </div>

      <div key={active ?? 'rule'} aria-live="polite" className="pl-fade mx-auto mt-10 min-h-[4.5rem] max-w-[56ch] text-center">
        {f ? (
          <p className="text-balance text-base leading-relaxed text-paper/75 md:text-lg">{t(f.how)}</p>
        ) : (
          <p className="text-balance text-sm leading-relaxed text-paper/50">
            {t({ es: 'Casi todo lo «inteligente» son reglas y una estimación, no un modelo: por eso se llama «Sugerencia» y no lleva la marca de IA.', en: 'Almost everything “smart” is rules and an estimate, not a model: that’s why it’s called “Suggestion” and doesn’t carry the AI mark.' })}
          </p>
        )}
      </div>
    </div>
  )
}
