'use client'

import { useRef } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { NeuronQuotes } from './neuron-quotes'
import { useAutoplay } from './use-autoplay'

/** Tiempo en cada cifra mientras avanza sola (ms) */
const METRIC_MS = 3200
/** Dónde va cada cifra alrededor del centro (% del escenario): arriba-izq., arriba-der., abajo-izq., abajo-der. */
const SPOTS = [
  { x: 18, y: 20 },
  { x: 82, y: 20 },
  { x: 18, y: 80 },
  { x: 82, y: 80 },
]
const HUB = { x: 50, y: 50 }

/**
 * Las cifras de referencia como una constelación: el rediseño en el centro y
 * cuatro neuronas alrededor, unidas por fibras. Una a una se encienden (la
 * señal sale del centro hacia ella) y se lee qué mide. Tocar una la elige.
 */
function MetricConstellation() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const metrics = OBJ_CASE.impact.reference
  const { index: active, go, playing } = useAutoplay(rootRef, { count: metrics.length, ms: METRIC_MS, loop: true, disabled: reducedMotion })
  const lit = playing || reducedMotion

  return (
    <div ref={rootRef} className="mx-auto max-w-[860px]">
      <p className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
        <span className="rounded-full bg-white px-2.5 py-1 text-[#0b0d16]">{t({ es: 'Cifras de referencia', en: 'Reference figures' })}</span>
        <span className="text-white/50">{t({ es: 'Lo que esperamos mover; no son medidas en producción', en: 'What we expect to move; not measured in production' })}</span>
      </p>

      <div className="relative mt-6 aspect-[16/10] w-full">
        {/* Las fibras del centro a cada cifra; la activa lleva la señal */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="impact-fiber" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7b5cff" />
              <stop offset="1" stopColor="#0c5bef" />
            </linearGradient>
          </defs>
          {SPOTS.map((p, i) => {
            const d = `M${HUB.x} ${HUB.y} C${HUB.x} ${(HUB.y + p.y) / 2} ${p.x} ${(HUB.y + p.y) / 2} ${p.x} ${p.y}`
            const on = lit && i === active
            return (
              <g key={metrics[i].label.es}>
                <path d={d} fill="none" stroke="white" strokeOpacity={0.12} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                <path d={d} fill="none" stroke="url(#impact-fiber)" strokeWidth={2} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset={lit ? 0 : 1} style={{ opacity: on ? 1 : 0.35, transition: `stroke-dashoffset 1.2s cubic-bezier(.65,0,.35,1) ${i * 0.15}s, opacity .6s` }} />
                {on && <path key={`p-${active}`} d={d} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="0.1 0.9" className="ms-pulse" />}
              </g>
            )
          })}
        </svg>

        {/* El centro: el rediseño, y lo que mide la cifra activa */}
        <div className="absolute left-1/2 top-1/2 flex w-[min(15rem,40%)] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
          <span className="relative grid h-14 w-14 place-items-center rounded-full border border-white/70 bg-void shadow-[0_0_0_8px_rgb(123_92_255/0.15),0_0_40px_6px_rgb(123_92_255/0.5)]">
            <span className="absolute inset-[-9px] rounded-full border border-[#7b5cff]/50 animate-[nav-node-ping_2.6s_cubic-bezier(0,0,.2,1)_infinite]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.12em]">{t({ es: 'Rediseño', en: 'Redesign' })}</span>
          </span>
          <p key={active} aria-live="polite" className="obj-fade mt-4 text-sm leading-snug text-paper/70">{t(metrics[active].detail)}</p>
        </div>

        {/* Las cuatro cifras */}
        {metrics.map((m, i) => {
          const p = SPOTS[i]
          const on = i === active
          return (
            <button
              key={m.label.es}
              type="button"
              onClick={() => go(i)}
              aria-pressed={on}
              className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className={`block font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-500 ${on ? 'text-[#a99bff]' : 'text-white/45 group-hover:text-white/75'}`}>{t(m.label)}</span>
              <span
                className={`mt-2 block whitespace-nowrap bg-gradient-to-r from-[#9f8cff] to-[#4f86ff] bg-clip-text font-light leading-none text-transparent tabular-nums transition-[transform,opacity,filter] duration-700 ease-expo ${on ? 'scale-110 opacity-100' : 'scale-90 opacity-45 group-hover:opacity-80'}`}
                style={{ fontSize: 'clamp(2.4rem, 1.6rem + 2.6vw, 4.4rem)', filter: on ? 'drop-shadow(0 0 18px rgb(123 92 255 / 0.55))' : 'none' }}
              >
                {m.prefix}
                <span data-count={m.value}>{m.value}</span>
                <span className="text-[0.42em]">{m.suffix}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Lo construido: una fibra con un nodo por cifra. */
function BuiltFiber() {
  const { t } = useLocale()
  const built = OBJ_CASE.impact.built
  return (
    <div className="mx-auto mt-[clamp(4rem,3rem+4vw,6.5rem)] max-w-[820px] text-center">
      <p className="mono-label text-paper/50">{t({ es: 'Lo construido', en: 'What was built' })}</p>
      <ol className="relative mt-8 grid grid-cols-2 gap-y-10 md:grid-cols-4">
        <span className="absolute inset-x-[12.5%] top-[7px] hidden h-px bg-gradient-to-r from-signal via-[#7b5cff] to-[#ff54aa] opacity-60 md:block" aria-hidden="true" />
        {built.map((s) => (
          <li key={s.label.es} data-reveal className="relative flex flex-col items-center px-3">
            <span className="block h-[15px] w-[15px] rounded-full border border-white/70 bg-void shadow-[0_0_14px_2px_rgb(var(--signal)/0.5)]" aria-hidden="true" />
            <b data-count={s.value} className="mt-4 text-[clamp(2rem,1.5rem+1.6vw,3rem)] font-light leading-none tabular-nums">{s.value}</b>
            <span className="mt-2 max-w-[18ch] text-[12px] leading-snug text-paper/55">{t(s.label)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** 07 · Impacto: las mejoras esperadas como una constelación, lo construido y lo aprendido. */
export function ObjetivosImpact() {
  const { t } = useLocale()
  const { impact } = OBJ_CASE
  return (
    <div>
      <CaseLead className="mb-10">{t(impact.lead)}</CaseLead>
      <MetricConstellation />
      <BuiltFiber />
      <NeuronQuotes label={{ es: 'Lo que aprendí', en: 'What I learned' }} items={impact.learnings} tag="aprendí_" />
    </div>
  )
}
