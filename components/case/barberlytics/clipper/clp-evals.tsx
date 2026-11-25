'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { AI, Caption, Lead, RED, useAutoSteps, useInView } from './clp-kit'

const { evals, guard } = CLIPPER_CASE.build
type Mode = 'languages' | 'behaviors'
const MODES: readonly { id: Mode; name: L }[] = [
  { id: 'languages', name: { es: 'Idioma', en: 'Language' } },
  { id: 'behaviors', name: { es: 'Conducta', en: 'Behavior' } },
]
const GROUP_COLORS: Record<Mode, readonly string[]> = { languages: [AI[0], AI[1], AI[3]], behaviors: [AI[2], AI[1], RED] }
/** Cada cuánto se reordenan solas (ms) */
const MODE_MS = 3400
const W = 900
const H = 230
const COLS = 6
const CELL = 22
const BASE = 190
const CENTERS = [170, 450, 730] as const

/** A qué grupo va cada pregunta en cada modo; las conductas en un orden mezclado, para que se vea el cambio */
const SHUFFLE = Array.from({ length: evals.total }, (_, i) => (i * 37) % evals.total)
const groupOf = (values: readonly number[], n: number) => {
  let acc = 0
  for (let g = 0; g < values.length; g++) {
    acc += values[g]
    if (n < acc) return g
  }
  return values.length - 1
}
const LAYOUT: Record<Mode, { g: number; x: number; y: number }[]> = (() => {
  const place = (keyOf: (i: number) => number, values: readonly number[]) => {
    const seen = [0, 0, 0]
    return Array.from({ length: evals.total }, (_, i) => {
      const g = groupOf(values, keyOf(i))
      const k = seen[g]++
      const cols = Math.min(COLS, values[g])
      return { g, x: CENTERS[g] + ((k % COLS) - (cols - 1) / 2) * CELL, y: BASE - Math.floor(k / COLS) * CELL }
    })
  }
  return {
    languages: place((i) => i, evals.languages.map((l) => l.value)),
    behaviors: place((i) => SHUFFLE[i], evals.behaviors.map((b) => b.value)),
  }
})()

/** La frase con la cifra que no salió de una consulta, partida en tres (antes, la cifra, después) */
const splitFlagged = (text: string): [string, string, string] => {
  const m = /12\s?%/.exec(text)
  return m ? [text.slice(0, m.index), m[0], text.slice(m.index + m[0].length)] : [text, '', '']
}
const GUARD_LAST = 3

/**
 * 06 · IA en el proceso: las 60 preguntas de evaluación como puntos que se
 * agrupan por idioma y luego se reordenan por la conducta que esperan. Debajo,
 * el filtro del servidor: una respuesta trae «12 %», que no salió de ninguna
 * consulta, y se frena.
 */
export function ClipperEvals() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const guardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const guardInView = useInView(guardRef, '0px 0px -15% 0px')
  const [mode, setMode] = useState(0)
  const [manual, setManual] = useState(false)
  const [guardStep] = useAutoSteps({ last: GUARD_LAST, ms: (s) => (s === 0 ? 1400 : 1300), run: guardInView, reducedMotion, loopAfter: 3600 })

  useEffect(() => {
    if (!inView || manual || reducedMotion) return
    const id = window.setInterval(() => setMode((m) => (m + 1) % MODES.length), MODE_MS)
    return () => window.clearInterval(id)
  }, [inView, manual, reducedMotion])

  const current = MODES[mode].id
  const beforeParts = splitFlagged(t(guard.before))
  const groups = current === 'languages' ? evals.languages : evals.behaviors
  const colors = GROUP_COLORS[current]
  const caption =
    current === 'languages'
      ? { id: 'l', tag: t({ es: 'Evaluación', en: 'Evaluation' }), title: t({ es: '60 preguntas reales, en tres variantes de idioma.', en: '60 real questions, in three language variants.' }) }
      : { id: 'b', tag: t({ es: 'Evaluación', en: 'Evaluation' }), title: t({ es: 'Cada una espera una conducta: consultar, proponer o mandar a la ayuda.', en: 'Each expects a behavior: look up, propose or send to help.' }) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Corren contra el modelo real para los cinco roles. La meta es 90 % de acierto; falta la corrida con la clave de producción.', en: 'They run against the real model for all five roles. The target is 90% accuracy; the production-key run is still pending.' })}</Lead>

      <div role="radiogroup" aria-label={t({ es: 'Agrupar por', en: 'Group by' })} className="mt-8 flex justify-center gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === i}
            onClick={() => {
              setMode(i)
              setManual(true)
            }}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${mode === i ? 'border-[#f0ce86] bg-[#f0ce86] text-[#16130f]' : 'border-white/20 text-paper/60 hover:border-white/50 hover:text-paper'}`}
          >
            {t(m.name)}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-4 w-full max-w-[860px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={groups.map((g) => `${g.value} ${t(g.label)}`).join(', ')}>
          {LAYOUT[current].map((p, i) => (
            <circle
              key={i}
              r={7}
              fill={colors[p.g]}
              style={{
                transform: `translate(${p.x}px, ${p.y}px)`,
                transition: `transform .9s cubic-bezier(.65,0,.35,1) ${(i % 12) * 18}ms, fill .6s`,
                opacity: inView || reducedMotion ? 0.9 : 0,
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-x-0 bottom-0 grid translate-y-full grid-cols-3">
          {groups.map((g, i) => (
            <p key={`${current}-${i}`} className="clp-fade text-center">
              <span className="block text-[clamp(1.2rem,1rem+0.8vw,1.7rem)] font-light leading-none tabular-nums" style={{ color: colors[i] }}>{g.value}</span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.1em] text-paper/50 sm:text-[10px]">{t(g.label)}</span>
            </p>
          ))}
        </div>
      </div>

      {/* El filtro: la cifra inventada se marca, se tacha y la respuesta sale sin ella */}
      <div ref={guardRef} className="mx-auto mt-28 flex max-w-[620px] flex-col items-center text-center">
        <p className="mono-label text-paper/50">{t({ es: 'El filtro del servidor', en: 'The server filter' })}</p>
        <p className="mt-4 min-h-[3.5rem] text-balance text-[clamp(1.05rem,0.9rem+0.6vw,1.35rem)] font-light leading-snug">
          {guardStep < 2 ? (
            <span key="before" className="clp-fade">
              «{beforeParts[0]}
              <span className={`rounded px-1 transition-colors duration-500 ${guardStep >= 1 ? 'bg-[#ff6b72]/20 text-[#ff9aa0] line-through' : 'bg-white/10'}`}>{beforeParts[1]}</span>
              {beforeParts[2]}»
            </span>
          ) : (
            <span key="after" className="clp-fade">«{t(guard.after)}»</span>
          )}
        </p>
        <p key={guardStep} className="clp-fade mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: guardStep === 1 ? '#ff9aa0' : guardStep >= 2 ? AI[2] : 'rgb(255 255 255 / 0.45)' }}>
          <span data-fiber-from="clp-impacto" className="inline-block h-2 w-2 rounded-full" style={{ background: guardStep === 1 ? RED : guardStep >= 2 ? AI[2] : 'rgb(255 255 255 / 0.3)' }} />
          {guardStep === 0
            ? t({ es: 'Llega una respuesta', en: 'An answer arrives' })
            : guardStep === 1
              ? t({ es: `«${guard.flagged}» no salió de ninguna consulta`, en: `“${guard.flagged}” didn’t come from any lookup` })
              : t({ es: 'Sale solo con cifras consultadas', en: 'It leaves only with looked-up figures' })}
        </p>
      </div>
    </div>
  )
}
