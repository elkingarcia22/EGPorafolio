'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useInView } from './use-in-view'
import { ChapterHead } from './chapter-head'

const { impact } = THEMA_CASE
const STAGES = impact.growth.bars
const TOTAL = STAGES[STAGES.length - 1].value
/** Cuántas columnas tiene el campo de componentes */
const COLS = 22
/** Al entrar, cada etapa se enciende después de la anterior (ms) */
const STAGE_MS = { first: 350, next: 900 } as const
/** Las cifras de equipo (velocidad y retrabajo) son de referencia, definidas por el autor */
const REFERENCE_KPIS = new Set([1, 2])
const DOTS = Array.from({ length: TOTAL }, (_, i) => i)

/**
 * 07 · Impacto de Thema: un campo con un punto por componente documentado (218)
 * que se enciende por etapas al entrar —27 en la auditoría, 159 en la primera
 * versión, 218 hoy—. Tocar una etapa la vuelve a mostrar. Debajo, las cifras
 * de equipo y del sistema; tocar una dice de dónde sale. De la última línea sale
 * la fibra hacia «Demo».
 */
export function ThemaImpact() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const { entered } = useInView(rootRef)
  const [stage, setStage] = useState(reducedMotion ? STAGES.length : 0)
  const [held, setHeld] = useState(false)
  const [kpi, setKpi] = useState<number | null>(null)

  useEffect(() => {
    if (!entered || reducedMotion || held || stage >= STAGES.length) return
    const id = window.setTimeout(() => setStage((s) => s + 1), stage === 0 ? STAGE_MS.first : STAGE_MS.next)
    return () => window.clearTimeout(id)
  }, [entered, reducedMotion, held, stage])

  const lit = stage === 0 ? 0 : STAGES[stage - 1].value
  const prev = stage <= 1 ? 0 : STAGES[stage - 2].value
  const picked = kpi === null ? null : impact.kpis[kpi]

  return (
    <div ref={rootRef}>
      <ChapterHead phrase={t(chapters.impacto.phrase)} lead={t(chapters.impacto.lead)} />

      <div className="mx-auto grid max-w-[920px] items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
        {/* Un punto por componente */}
        <div
          role="img"
          aria-label={t({ es: `${lit} de ${TOTAL} componentes documentados`, en: `${lit} of ${TOTAL} documented components` })}
          className="mx-auto grid w-full max-w-[520px] gap-[5px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {DOTS.map((i) => {
            const on = i < lit
            const fresh = on && i >= prev
            return (
              <span
                key={i}
                className="aspect-square rounded-full transition-[background-color,box-shadow,transform] duration-500"
                style={{
                  background: on ? (fresh ? 'rgb(var(--signal))' : 'rgba(239,233,221,0.55)') : 'rgba(255,255,255,0.07)',
                  boxShadow: fresh ? '0 0 8px 1px rgb(var(--signal) / 0.7)' : 'none',
                  transform: on ? 'scale(1)' : 'scale(0.7)',
                  transitionDelay: fresh && !reducedMotion ? `${Math.min(500, (i - prev) * 3)}ms` : '0ms',
                }}
              />
            )
          })}
        </div>

        {/* La cuenta y las etapas */}
        <div className="flex flex-col items-center md:items-start">
          <p className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-[clamp(3.6rem,2.4rem+4vw,6.5rem)] font-light leading-none text-transparent tabular-nums" style={{ filter: 'drop-shadow(0 0 22px rgb(var(--signal) / 0.4))' }}>
            {lit}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">{t(impact.growth.title)}</p>
          <ol className="mt-6 flex gap-2 md:flex-col md:gap-1.5">
            {STAGES.map((s, i) => {
              const active = stage === i + 1
              return (
                <li key={s.label.es}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setHeld(true)
                      setStage(i + 1)
                    }}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal ${active ? 'border-signal/70 text-paper' : 'border-white/12 text-paper/55 hover:border-white/30'}`}
                  >
                    <span className="tabular-nums">{s.value}</span>
                    <span className="opacity-70">{t(s.label)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      {/* Lo que cambió para el equipo: tocar una cifra dice de dónde sale */}
      <ol className="relative mx-auto mt-[clamp(3.5rem,3rem+3vw,5.5rem)] grid max-w-[900px] grid-cols-1 gap-y-10 sm:grid-cols-3">
        <span aria-hidden="true" className="absolute inset-x-[16.6%] top-[5px] hidden h-px bg-white/12 sm:block" />
        {impact.kpis.slice(1).map((k, n) => {
          const i = n + 1
          const isPicked = kpi === i
          return (
            <li key={k.label.es} className="relative flex flex-col items-center text-center">
              <button type="button" aria-expanded={isPicked} onClick={() => setKpi(isPicked ? null : i)} className="group flex flex-col items-center outline-none">
                <span aria-hidden="true" className={`relative h-2.5 w-2.5 rounded-full border transition-all duration-300 ${isPicked ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_14px_3px_rgb(var(--signal)/0.7)]' : 'border-white/60 bg-signal'}`}>
                </span>
                <span className="mt-5 text-[clamp(2.4rem,1.6rem+2.6vw,4rem)] font-light leading-none tabular-nums">
                  {k.value}
                  <span className="text-[0.55em]">{k.unit}</span>
                </span>
                <span className="mt-3 max-w-[20ch] text-balance text-sm leading-snug text-paper/65 group-hover:text-paper/85">{t(k.label)}</span>
                {isPicked && (
                  <span className="th-fade mt-2 max-w-[24ch] text-xs leading-snug text-paper/55">
                    {t(k.note)}
                    {REFERENCE_KPIS.has(i) && <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">{t({ es: 'cifra de referencia del equipo', en: 'team reference figure' })}</span>}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      {/* La calidad que respalda las piezas */}
      <ul className="relative mx-auto mt-14 flex max-w-[860px] flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/45">
        <span data-fiber-from="th-demo" aria-hidden="true" className="absolute -bottom-6 left-1/2 h-px w-px" />
        {impact.quality.map((q) => (
          <li key={q.label.es}>
            <span className="text-paper/85 tabular-nums">{q.value}</span> {t(q.label)}
          </li>
        ))}
      </ul>
    </div>
  )
}
