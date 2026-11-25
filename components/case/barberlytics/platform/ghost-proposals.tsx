'use client'

import { useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useAutoSteps } from './use-auto-steps'

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
const STEP_MS = 180

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
  const f = picked === null ? null : features[picked]

  return (
    <div ref={rootRef} className="mx-auto max-w-[880px]">
      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 sm:grid-rows-[repeat(6,3.25rem)] sm:gap-3">
        {/* Las líneas de la rejilla, detrás */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_3.25rem)] sm:block" />
        {features.map((feat, i) => {
          const slot = SLOTS[i]
          const on = step > i
          const isPicked = picked === i
          const badge = BADGE[feat.kind]
          return (
            <button
              key={feat.name.es}
              type="button"
              aria-pressed={isPicked}
              onClick={() => setPicked(isPicked ? null : i)}
              className={`group relative flex min-h-[6.5rem] flex-col justify-between rounded-xl border border-dashed p-3.5 text-left outline-none transition-[border-color,background-color,box-shadow] duration-500 sm:min-h-0 [grid-column:var(--c)] [grid-row:var(--r)] max-sm:[grid-column:auto] max-sm:[grid-row:auto] ${on ? 'pl-drop' : 'invisible'} ${isPicked ? 'border-solid border-[#d9b36a] bg-[#d9b36a]/[0.08] shadow-[0_0_40px_-10px_rgba(217,179,106,0.6)]' : 'border-white/25 bg-white/[0.02] hover:border-white/50'}`}
              style={{ ['--c' as string]: String(slot.col), ['--r' as string]: `${slot.row} / span ${slot.span}` }}
            >
              <span className="text-[15px] leading-snug">{t(feat.name)}</span>
              <span className={`mt-3 inline-flex w-fit items-center rounded-full border px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.12em] ${badge.tone}`}>{t(badge.label)}</span>
              {feat.kind === 'assistant' && <span data-fiber-from="pl-impacto" className="absolute bottom-0 left-1/2 h-px w-px" />}
            </button>
          )
        })}
      </div>

      <div key={picked ?? 'rule'} aria-live="polite" className="pl-fade mx-auto mt-10 min-h-[4.5rem] max-w-[56ch] text-center">
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
