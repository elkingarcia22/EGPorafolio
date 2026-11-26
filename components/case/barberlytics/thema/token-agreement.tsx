'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useInView } from './use-in-view'
import { ChapterHead } from './chapter-head'
import { useAutoplay } from '@/components/case/objetivos/use-autoplay'
import { useNarrow } from './use-narrow'
import { StepNodes } from './step-nodes'

/** Filas reales de docs/TOKEN_DECISION_MATRIX.md: lo que decía cada fuente y lo que se decidió. */
const SOURCES = ['Starter', 'Comparativo', 'Legado', 'Oficial'] as const

interface Row {
  token: string
  values: readonly (string | null)[]
  decision: string
  why: L
  /** Cómo queda en el tema Premium (dorado); null = no cambia con el tema. */
  premium: string | null
  kind?: 'color' | 'radius'
}

const ROWS: readonly Row[] = [
  { token: 'Surface App', values: ['#f3f3f4', '#F4F6F8', '#F3F3F4', '#F4F6F8'], decision: '#F4F6F8', premium: '#F6F1E7', why: { es: 'El oficial gana sobre el legado', en: 'Official beats legacy' } },
  { token: 'Surface Nav', values: ['#0a0a60', '#0A0A60', '#202837', '#0A0A60'], decision: '#0A0A60', premium: '#1C1915', why: { es: 'Navy del sistema oficial', en: 'The official navy' } },
  { token: 'Text Primary', values: ['#121c28', '#303A47', '#303a47', '#303A47'], decision: '#303A47', premium: '#2A2D33', why: { es: 'El oficial gana sobre el starter', en: 'Official beats starter' } },
  { token: 'Brand Hover', values: ['#0a4dcc', '#1E4ABF', null, null], decision: '#1E4ABF', premium: '#8A6420', why: { es: 'La lógica más probada', en: 'The most proven logic' } },
  { token: 'Positive', values: ['#10b981', '#17B16D', '#328e2c', '#17B16D'], decision: '#17B16D', premium: null, why: { es: 'Verde fuerte del oficial', en: 'The official strong green' } },
  { token: 'Negative', values: ['#ef4444', '#CF0E34', '#e9343c', '#CF0E34'], decision: '#CF0E34', premium: null, why: { es: 'Rojo fuerte del oficial', en: 'The official strong red' } },
  { token: 'Radius lg', values: ['8px', '16px', null, '16px'], decision: '16px', premium: '16px', why: { es: 'Thema prefiere radios amplios', en: 'Thema prefers generous radii' }, kind: 'radius' },
]

const GOLD = '#D9B36A'
/** Al entrar, cada token se resuelve después del anterior (ms) */
const RESOLVE = { first: 450, step: 170 } as const

const same = (a: string | null, b: string) => a !== null && a.toLowerCase() === b.toLowerCase()

function Swatch({ value, kind, state }: { value: string | null; kind?: Row['kind']; state: 'idle' | 'agree' | 'lose' | 'decision' }) {
  const dim = state === 'lose' ? 'opacity-25 scale-90' : 'opacity-100'
  const ring = state === 'agree' ? `0 0 0 2px rgb(var(--void)), 0 0 0 3.5px ${GOLD}` : state === 'decision' ? `0 0 0 2px rgb(var(--void)), 0 0 0 3.5px white, 0 10px 26px -6px ${GOLD}` : 'inset 0 0 0 1px rgba(255,255,255,0.14)'
  if (!value) return <span className="mx-auto block h-7 w-7 rounded-md border border-dashed border-white/15 md:h-8 md:w-8" title="N/A" />
  if (kind === 'radius')
    return (
      <span
        className={`mx-auto block h-7 w-7 border-l-2 border-t-2 transition-all duration-500 md:h-8 md:w-8 ${dim}`}
        style={{ borderTopLeftRadius: value, borderColor: state === 'idle' ? 'rgba(255,255,255,0.4)' : state === 'lose' ? 'rgba(255,255,255,0.3)' : GOLD }}
        title={value}
      />
    )
  return <span className={`mx-auto block h-7 w-7 rounded-md transition-all duration-500 md:h-8 md:w-8 ${dim}`} style={{ background: value, boxShadow: ring }} title={value} />
}

/**
 * 02 · Patrones de Thema: la matriz de decisión de tokens como un tablero que
 * se resuelve solo al entrar. Cada fila muestra lo que decía cada una de las
 * cuatro fuentes; al resolverse, las que coinciden se marcan, las demás se
 * apagan y llega la decisión. Tocar un token muestra el motivo y cómo queda en
 * el tema Premium. Debajo de la matriz sale la fibra hacia «La idea».
 */
export function TokenAgreement() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const { entered } = useInView(rootRef)
  const [resolved, setResolved] = useState(reducedMotion ? ROWS.length : 0)
  const [picked, setPicked] = useState<number | null>(null)
  const done = resolved >= ROWS.length

  useEffect(() => {
    if (!entered || reducedMotion || done) return
    const id = window.setTimeout(() => setResolved((n) => n + 1), resolved === 0 ? RESOLVE.first : RESOLVE.step)
    return () => window.clearTimeout(id)
  }, [entered, reducedMotion, resolved, done])

  const row = picked === null ? null : ROWS[picked]
  const narrow = useNarrow()

  if (narrow)
    return (
      <div ref={rootRef}>
        <ChapterHead phrase={t(chapters.patrones.phrase)} lead={t(chapters.patrones.lead)} />
        <TokenStepper />
        <FiberNode />
      </div>
    )

  return (
    <div ref={rootRef}>
      <ChapterHead phrase={t(chapters.patrones.phrase)} lead={t(chapters.patrones.lead)} />

      <div className="mx-auto max-w-[760px]">
        <div role="table" aria-label={t({ es: 'Matriz de decisión de tokens', en: 'Token decision matrix' })} className="text-sm">
          <div role="row" className="grid grid-cols-[minmax(0,6.5rem)_repeat(4,minmax(0,1fr))_1.25rem_minmax(0,1fr)] items-end gap-x-1 pb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/45 md:grid-cols-[minmax(0,10rem)_repeat(4,minmax(0,1fr))_2rem_minmax(0,1fr)] md:gap-x-2 md:text-[10px]">
            <span role="columnheader">Token</span>
            {SOURCES.map((s) => (
              <span key={s} role="columnheader" className="truncate text-center">{s}</span>
            ))}
            <span aria-hidden="true" />
            <span role="columnheader" className="text-center text-paper/80">{t({ es: 'Decisión', en: 'Decision' })}</span>
          </div>
          {ROWS.map((r, i) => {
            const isResolved = i < resolved
            const isPicked = picked === i
            return (
              <button
                key={r.token}
                type="button"
                role="row"
                aria-pressed={isPicked}
                onClick={() => setPicked(isPicked ? null : i)}
                className={`grid w-full grid-cols-[minmax(0,6.5rem)_repeat(4,minmax(0,1fr))_1.25rem_minmax(0,1fr)] items-center gap-x-1 border-t py-2.5 text-left outline-none transition-colors duration-300 focus-visible:bg-white/[0.05] md:grid-cols-[minmax(0,10rem)_repeat(4,minmax(0,1fr))_2rem_minmax(0,1fr)] md:gap-x-2 ${isPicked ? 'border-white/30 bg-white/[0.05]' : 'border-white/[0.08] hover:bg-white/[0.03]'}`}
                style={{ opacity: entered || reducedMotion ? 1 : 0, transition: `opacity 400ms ${i * 60}ms, background-color 300ms, border-color 300ms` }}
              >
                <span role="rowheader" className={`truncate pl-1 font-mono text-[11px] md:text-xs ${isPicked ? 'text-paper' : 'text-paper/70'}`}>{r.token}</span>
                {r.values.map((v, k) => (
                  <span key={SOURCES[k]} role="cell">
                    <Swatch value={v} kind={r.kind} state={!isResolved ? 'idle' : same(v, r.decision) ? 'agree' : 'lose'} />
                  </span>
                ))}
                <span aria-hidden="true" className={`text-center text-paper/40 transition-opacity duration-300 ${isResolved ? 'opacity-100' : 'opacity-0'}`}>→</span>
                <span role="cell" className={`transition-all duration-500 ${isResolved ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'}`}>
                  <Swatch value={r.decision} kind={r.kind} state="decision" />
                </span>
              </button>
            )
          })}
        </div>

        {/* El detalle del token tocado */}
        <div className="mt-5 min-h-[4.5rem]" aria-live="polite">
          {row ? (
            <div key={row.token} className="th-fade grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-1 border-l border-[#D9B36A]/60 pl-4">
              <p className="col-span-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#D9B36A]">{row.token} · {row.decision}</p>
              <p className="col-span-2 text-base leading-snug text-paper/85">{t(row.why)}</p>
              <p className="col-span-2 text-sm text-paper/55">
                {row.premium
                  ? t({ es: `En el tema Premium: ${row.premium}`, en: `In the Premium theme: ${row.premium}` })
                  : t({ es: 'Fijo en todos los temas: los significados no cambian.', en: 'Fixed in every theme: meanings don’t change.' })}
              </p>
            </div>
          ) : (
            <p className="mx-auto max-w-[46ch] text-balance text-center text-[15px] leading-relaxed md:text-base text-paper/60">
              {t({ es: 'Anillo dorado: las fuentes que coincidían · toca un token para ver el motivo', en: 'Gold ring: the sources that agreed · tap a token to see why' })}
            </p>
          )}
        </div>

        <FiberNode />
      </div>
    </div>
  )
}

/** Por debajo de la matriz sale la fibra hacia «La idea» */
function FiberNode() {
  return (
    <div className="mt-6 flex justify-center">
      <span aria-hidden="true" className="relative h-2.5 w-2.5 rounded-full border border-white/60 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
        <span data-fiber-from="th-idea" className="absolute left-1/2 top-1/2 h-px w-px" />
      </span>
    </div>
  )
}

/** Cada token se queda a la vista este tiempo en el teléfono (ms) */
const TOKEN_MS = 3400
/** Tras llegar a un token, las fuentes se resuelven a este tiempo (ms) */
const SETTLE_MS = 700

/**
 * Patrones en el teléfono: un token a la vez. Arriba, lo que decía cada una de
 * las cuatro fuentes (con su valor); al resolverse, las que coinciden se marcan
 * en dorado y la fibra baja hasta la decisión, con su motivo. Pasa solo o
 * deslizando de lado; los nodos de abajo llevan a cualquier token.
 */
function TokenStepper() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const { index, go } = useAutoplay(ref, { count: ROWS.length, ms: TOKEN_MS, loop: true, disabled: reducedMotion })
  const [settled, setSettled] = useState(reducedMotion)
  const r = ROWS[index]

  useEffect(() => {
    if (reducedMotion) return
    setSettled(false)
    const id = window.setTimeout(() => setSettled(true), SETTLE_MS)
    return () => window.clearTimeout(id)
  }, [index, reducedMotion])

  return (
    <div ref={ref} className="mx-auto max-w-[420px]">
      <div className="rounded-[22px] border border-white/12 bg-white/[0.03] p-5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">Token</span>
          <span className="font-mono text-[11px] tabular-nums text-paper/40">{String(index + 1).padStart(2, '0')} / {String(ROWS.length).padStart(2, '0')}</span>
        </div>
        <p key={r.token} className="th-fade mt-1 text-[24px] font-light leading-tight tracking-tight">{r.token}</p>

        {/* Lo que decía cada fuente */}
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
          {SOURCES.map((source, k) => {
            const v = r.values[k]
            const agree = settled && same(v, r.decision)
            const lose = settled && !agree
            return (
              <li key={source} className={`flex items-center gap-3 transition-opacity duration-500 ${lose ? 'opacity-40' : 'opacity-100'}`}>
                <span className="shrink-0"><Swatch value={v} kind={r.kind} state={!settled ? 'idle' : agree ? 'agree' : 'lose'} /></span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] text-paper/85">{source}</span>
                  <span className="font-mono text-[11px] uppercase text-paper/45">{v ?? '—'}</span>
                </span>
              </li>
            )
          })}
        </ul>

        {/* La fibra baja hasta la decisión */}
        <div className="relative mt-4 flex justify-center" aria-hidden="true">
          <span className="block h-8 w-px origin-top bg-gradient-to-b from-white/10 to-[#D9B36A] transition-transform duration-500" style={{ transform: `scaleY(${settled ? 1 : 0})` }} />
        </div>

        <div className={`flex items-center gap-4 transition-[opacity,transform] duration-500 ${settled ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <span className="shrink-0 scale-125"><Swatch value={r.decision} kind={r.kind} state="decision" /></span>
          <span className="flex min-w-0 flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#D9B36A]">{t({ es: 'Decisión', en: 'Decision' })} · {r.decision}</span>
            <span className="mt-0.5 text-[15px] leading-snug text-paper/90">{t(r.why)}</span>
            <span className="mt-1 text-[13px] leading-snug text-paper/50">
              {r.premium
                ? t({ es: `En el tema Premium: ${r.premium}`, en: `In the Premium theme: ${r.premium}` })
                : t({ es: 'Fijo en todos los temas', en: 'Fixed in every theme' })}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-6">
        <StepNodes count={ROWS.length} active={index} onPick={go} labels={ROWS.map((x) => x.token)} />
      </div>
      <p className="mt-3 mx-auto max-w-[46ch] text-balance text-center text-[15px] leading-relaxed md:text-base text-paper/60">{t({ es: 'Anillo dorado: las fuentes que coincidían · desliza para ver otro token', en: 'Gold ring: the sources that agreed · swipe for another token' })}</p>
    </div>
  )
}
