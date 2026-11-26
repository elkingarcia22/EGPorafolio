'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useAutoSteps, useInView } from './use-auto-steps'

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
/** En el teléfono, la misma rejilla con dos columnas de barbero y su eje de horas */
const PHONE_SLOTS: readonly { col: number; row: number; span: number }[] = [
  { col: 2, row: 1, span: 3 },
  { col: 3, row: 1, span: 2 },
  { col: 3, row: 3, span: 3 },
  { col: 2, row: 4, span: 2 },
  { col: 2, row: 6, span: 3 },
  { col: 3, row: 6, span: 3 },
]
const PHONE_ROWS = 8
const PHONE_HOURS = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']

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
  return (
    <div ref={rootRef} className="mx-auto max-w-[880px]">
      <div className="relative grid grid-cols-[2.6rem_minmax(0,1fr)_minmax(0,1fr)] grid-rows-[repeat(8,3.75rem)] gap-x-2 gap-y-2 sm:grid-cols-3 sm:grid-rows-[repeat(6,3.25rem)] sm:gap-3">
        {/* Las líneas de la rejilla, detrás */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_3.25rem)] sm:block" />
        {/* En el teléfono: el eje de horas y una línea por media hora */}
        {PHONE_HOURS.slice(0, PHONE_ROWS).map((h, r) => (
          <span key={h} aria-hidden="true" className="pointer-events-none col-span-3 col-start-1 -mt-1 border-t border-white/[0.07] pt-1 font-mono text-[12px] text-paper/40 sm:hidden" style={{ gridRow: r + 1 }}>
            {h}
          </span>
        ))}
        <span aria-hidden="true" className="pointer-events-none col-start-2 row-span-full row-start-1 border-l border-white/[0.07] sm:hidden" />
        <span aria-hidden="true" className="pointer-events-none col-start-3 row-span-full row-start-1 border-l border-white/[0.07] sm:hidden" />
        {features.map((feat, i) => {
          const slot = SLOTS[i]
          const phone = PHONE_SLOTS[i]
          const on = step > i
          const isPicked = active === i
          const badge = BADGE[feat.kind]
          return (
            <button
              key={feat.name.es}
              type="button"
              aria-pressed={isPicked}
              onClick={() => setPicked(isPicked ? null : i)}
              className={`group relative flex min-h-0 flex-col justify-between rounded-xl p-3 sm:p-3.5 text-left outline-none transition-[background-color,box-shadow,transform] duration-500 sm:min-h-0 [grid-column:var(--pc)] [grid-row:var(--pr)] sm:[grid-column:var(--c)] sm:[grid-row:var(--r)] ${on ? '' : 'invisible'} ${isPicked ? 'bg-[#d9b36a]/[0.08] shadow-[0_0_40px_-10px_rgba(217,179,106,0.6)]' : 'bg-white/[0.02]'}`}
              style={{ ['--c' as string]: String(slot.col), ['--r' as string]: `${slot.row} / span ${slot.span}`, ['--pc' as string]: String(phone.col), ['--pr' as string]: `${phone.row} / span ${phone.span}` }}
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
              <span className={`relative text-[14px] leading-snug sm:text-[15px] ${on ? 'pl-fade' : ''}`} style={{ animationDelay: '250ms' }}>{t(feat.name)}</span>
              <span className={`relative mt-2 inline-flex w-fit sm:mt-3 items-center rounded-full border px-2 py-[2px] font-mono text-[11px] uppercase tracking-[0.12em] ${badge.tone} ${on ? 'pl-pop' : ''}`} style={{ animationDelay: '650ms' }}>{t(badge.label)}</span>
              {feat.kind === 'assistant' && <span data-fiber-from="pl-impacto" className="absolute bottom-0 left-1/2 h-px w-px" />}
            </button>
          )
        })}
      </div>

      <div key={active ?? 'rule'} aria-live="polite" className="pl-fade mx-auto mt-10 min-h-[4.5rem] max-w-[56ch] text-center">
        {f ? (
          <p className="text-balance text-base leading-relaxed text-paper/75 md:text-lg">{t(f.how)}</p>
        ) : (
          <p className="case-note">
            {t({ es: 'Casi todo lo «inteligente» son reglas y una estimación, no un modelo: por eso se llama «Sugerencia» y no lleva la marca de IA.', en: 'Almost everything “smart” is rules and an estimate, not a model: that’s why it’s called “Suggestion” and doesn’t carry the AI mark.' })}
          </p>
        )}
      </div>
    </div>
  )
}
