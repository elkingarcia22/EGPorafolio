'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { APPTS, CLIENT, SERVICE, STAGE, cardHue, fmt, type ColorBy, type Stage } from './calendar-model'
import { useInView } from './use-auto-steps'

const GOLD = '#d9b36a'
/** La cita de la tarjeta (del día de ejemplo) */
const VISIT = APPTS.find((a) => a.client === 'Gael Rodríguez') ?? APPTS[0]
/** Las etapas que recorre la tarjeta al entrar, rápido, y luego despacio */
const LOOP: readonly Stage[] = ['upcoming', 'waiting', 'seated', 'toCollect', 'paid']
const FAST_MS = 420
const SLOW_MS = 2200
/** «Se adapta a la barbería»: la misma tarjeta, coloreada de otras maneras */
const COLORINGS: readonly ColorBy[] = ['estado', 'servicio', 'cliente']
/** El historial del panel, como lo guarda la plataforma */
const TRAIL = ['Agendada', 'Llegó', 'En silla', 'Cobrada'] as const

/**
 * 03 · La idea: la pregunta arriba y, al centro, una sola tarjeta de cita que
 * recorre sus etapas sola al entrar. Alrededor, los cuatro principios; tocar
 * uno lo muestra en la tarjeta (colores, el botón, el panel, la sugerencia).
 * De la tarjeta baja la fibra hasta «Forma».
 */
export function CardAnatomy() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { idea } = PLATFORM_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [tick, setTick] = useState(reducedMotion ? 2 : 0)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setTimeout(() => setTick((n) => n + 1), tick < LOOP.length ? FAST_MS : SLOW_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, tick])

  const stage = picked === 1 ? 'seated' : LOOP[tick % LOOP.length]
  const s = STAGE[stage]
  const colorBy = picked === 0 ? COLORINGS[tick % COLORINGS.length] : 'estado'
  const hue = cardHue(VISIT, stage, colorBy) ?? GOLD
  const caption =
    picked !== null
      ? { tag: `${t({ es: 'Principio', en: 'Principle' })} 0${picked + 1}`, title: t(idea.principles[picked].title), sub: t(idea.principles[picked].body) }
      : { tag: t({ es: '¿Cómo podríamos…?', en: 'How might we…?' }), title: t(idea.hmw) }

  const principle = (i: number, left: boolean) => {
    const on = picked === i
    return (
      <button
        key={i}
        type="button"
        aria-pressed={on}
        onClick={() => setPicked(on ? null : i)}
        className={`group flex items-center gap-3 text-left outline-none ${left ? 'lg:flex-row-reverse lg:text-right' : ''}`}
      >
        <span className="relative grid h-3 w-3 shrink-0 place-items-center" aria-hidden="true">
          <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_16px_3px_rgb(var(--signal)/0.7)]' : 'border-white/50 bg-signal/70 group-hover:bg-signal'}`} />
        </span>
        <span className={`text-[15px] leading-snug transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-65 group-hover:opacity-95'}`}>{t(idea.principles[i].title)}</span>
      </button>
    )
  }

  return (
    <figure ref={rootRef} className="mx-auto flex max-w-[960px] flex-col items-center text-center">
      <figcaption key={picked ?? 'q'} aria-live="polite" className="pl-fade flex min-h-[8.5rem] max-w-[48ch] flex-col items-center justify-end">
        <span className="mono-label text-signal">{caption.tag}</span>
        <span className="mt-3 text-balance text-[clamp(1.25rem,1rem+1.1vw,1.9rem)] font-light leading-[1.2] tracking-tight">{caption.title}</span>
        {caption.sub && <span className="mt-2 max-w-[52ch] text-balance text-sm leading-relaxed text-paper/55">{caption.sub}</span>}
      </figcaption>

      <div className="mt-12 grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
        {/* Dos principios a cada lado; en teléfono, debajo */}
        <div className="order-2 flex flex-col items-start gap-8 lg:order-1 lg:items-end">
          {principle(0, true)}
          {principle(1, true)}
        </div>

        <div className="relative order-1 mx-auto flex items-start gap-3 lg:order-2">
          {/* Líneas que unen la tarjeta con los principios (solo en escritorio) */}
          <span aria-hidden="true" className="absolute -left-6 top-1/2 hidden h-px w-6 bg-gradient-to-l from-white/30 to-transparent lg:block" />
          <span aria-hidden="true" className="absolute -right-6 top-1/2 hidden h-px w-6 bg-gradient-to-r from-white/30 to-transparent lg:block" />

          <div className="relative w-[min(78vw,280px)]">
            <span aria-hidden="true" className="pointer-events-none absolute -inset-10 rounded-full blur-2xl transition-colors duration-700" style={{ background: `radial-gradient(closest-side, ${hue}33, transparent)` }} />
            {/* La tarjeta de la cita, como en la rejilla */}
            <div
              className="relative h-[148px] overflow-hidden rounded-xl px-3.5 py-3 text-left text-[#efe9dd] transition-[background-color,box-shadow] duration-700 ease-expo"
              style={{ background: `linear-gradient(${hue}33, ${hue}1a), #141210`, boxShadow: `inset 0 0 0 1px ${hue}aa, 0 30px 60px -30px rgba(0,0,0,0.9)` }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SERVICE[VISIT.services[0]].hue }} />
                <span className="min-w-0 truncate text-[15px] font-medium">{VISIT.client}</span>
                <span className="ml-auto shrink-0 rounded-full bg-black/35 px-2 py-[2px] text-[10px] font-semibold tracking-wide" style={{ color: CLIENT[VISIT.type] }}>{VISIT.type}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-white/60">{SERVICE[VISIT.services[0]].name} · US$ {VISIT.price}</p>
              <p className="mt-0.5 font-mono text-[11px] text-white/40">{fmt(VISIT.start)} – {fmt(VISIT.start + VISIT.len)}</p>
              <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between">
                <span key={stage} className="pl-fade inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-[3px] text-[11px]" style={{ color: s.hue }}>
                  {stage === 'paid' ? '✓' : <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hue }} />}
                  {s.label}
                </span>
                {s.next && (
                  <span key={s.next} className={`pl-pop rounded-md px-2.5 py-1 text-[12px] font-semibold text-[#16130f] transition-shadow duration-500 ${picked === 1 ? 'shadow-[0_0_0_4px_rgba(217,179,106,0.3),0_0_24px_4px_rgba(217,179,106,0.6)]' : ''}`} style={{ background: GOLD }}>
                    {s.next}
                  </span>
                )}
              </div>
            </div>
            {/* «Propone en la rejilla y se deshace»: una sugerencia en fantasma, con sus dos salidas */}
            {picked === 3 && (
              <div className="pl-drop absolute inset-x-0 top-[calc(100%+10px)] rounded-xl border border-dashed border-white/35 bg-white/[0.03] px-3.5 py-2.5 text-left text-[12px] text-[#efe9dd]">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">{t({ es: 'Sugerencia', en: 'Suggestion' })}</p>
                <p className="mt-1 text-white/75">{t({ es: '«Sin dejar hueco entre citas»', en: '“No gap between visits”' })}</p>
                <p className="mt-2 flex gap-2">
                  <span className="rounded-md px-2 py-0.5 font-semibold text-[#16130f]" style={{ background: GOLD }}>{t({ es: 'Aplicar', en: 'Apply' })}</span>
                  <span className="rounded-md border border-white/20 px-2 py-0.5 text-white/70">{t({ es: 'Descartar', en: 'Discard' })}</span>
                </p>
              </div>
            )}
            {/* De la tarjeta sale la fibra que baja hasta «Forma» */}
            <span data-fiber-from="pl-forma" className="absolute bottom-0 left-1/2 h-px w-px" />
          </div>

          {/* «Todo en un panel»: el panel lateral con la historia de la cita */}
          {picked === 2 && (
            <div className="pl-drop absolute left-[calc(100%+12px)] top-0 w-[150px] rounded-xl border border-white/12 bg-[#141210] p-3 text-left text-[#efe9dd] max-lg:left-auto max-lg:right-0 max-lg:top-[calc(100%+10px)] max-lg:w-full">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Panel de la cita', en: 'Visit panel' })}</p>
              <ol className="mt-2 space-y-1.5">
                {TRAIL.map((step, i) => (
                  <li key={step} className="flex items-center gap-2 text-[12px]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: i < 3 ? STAGE.seated.hue : 'rgba(255,255,255,0.25)' }} />
                    <span className={i < 3 ? '' : 'text-white/40'}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="order-3 flex flex-col items-start gap-8">
          {principle(2, false)}
          {principle(3, false)}
        </div>
      </div>
    </figure>
  )
}
