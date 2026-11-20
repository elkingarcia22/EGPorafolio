'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { useTick } from '../thema/live-pieces'
import { APPTS, BARBERS, BLOCKS, HALF_HOURS, fmt } from './calendar-model'

/* ── Agendar escribiendo + «Hoy conviene mirar» ───────────────────────── */

const PHRASE = 'Corte para Martín mañana a las 4 con Nicolás'
const PARSED: readonly { key: L; value: string }[] = [
  { key: { es: 'Cliente', en: 'Client' }, value: 'Martín' },
  { key: { es: 'Servicio', en: 'Service' }, value: 'Corte clásico' },
  { key: { es: 'Día', en: 'Day' }, value: 'Jue 19 nov' },
  { key: { es: 'Hora', en: 'Time' }, value: '4:00 p. m.' },
  { key: { es: 'Barbero', en: 'Barber' }, value: 'Nicolás' },
]
const LOOK: readonly { kind: L; title: L; hue: string }[] = [
  { kind: { es: 'Recomendación', en: 'Recommendation' }, title: { es: '1 cita lista para cobrar', en: '1 visit ready to charge' }, hue: '#f2a03a' },
  { kind: { es: 'Oportunidad', en: 'Opportunity' }, title: { es: 'Valeria tiene unas 6,5 h libres', en: 'Valeria has about 6.5 h free' }, hue: '#4cc98d' },
  { kind: { es: 'Riesgo', en: 'Risk' }, title: { es: '2 citas con riesgo de no venir', en: '2 visits at risk of no-show' }, hue: '#ff6b72' },
]

const LEAVE_MS = 600

/**
 * Escribe la frase letra a letra, la deja un momento y vuelve a empezar: antes de borrar,
 * la frase y lo que entendió se desvanecen juntos (`leaving`), así el reinicio no es un corte.
 */
function useTyping(text: string, speed = 55, hold = 3800) {
  const { reducedMotion } = useA11y()
  const [n, setN] = useState(reducedMotion ? text.length : 0)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (reducedMotion) return
    if (leaving) {
      const id = window.setTimeout(() => {
        setN(0)
        setLeaving(false)
      }, LEAVE_MS)
      return () => window.clearTimeout(id)
    }
    const done = n >= text.length
    const id = window.setTimeout(() => (done ? setLeaving(true) : setN((k) => k + 1)), done ? hold : speed)
    return () => window.clearTimeout(id)
  }, [n, leaving, text, speed, hold, reducedMotion])
  return { n, leaving }
}

export function TypingBooking() {
  const { t } = useLocale()
  const { n, leaving } = useTyping(PHRASE)
  const done = n >= PHRASE.length && !leaving
  const tick = useTick(2600)
  return (
    <div data-reveal="device" className="h-full rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-6">
      <p className="text-sm font-medium">{t({ es: 'Asistente del día', en: 'Day assistant' })}</p>
      <p className="mb-5 text-[11px] text-white/45">{t({ es: 'Lo que la agenda pide mirar y una forma rápida de agendar.', en: 'What the day needs a look at, and a quick way to book.' })}</p>

      <div className="rounded-2xl border border-[#d9b36a]/30 bg-[#d9b36a]/[0.05] p-4">
        <p className="text-sm text-[#e9c27a]">{t({ es: 'Agendar escribiendo', en: 'Book by typing' })}</p>
        <p className="mt-1 text-[11px] text-white/50">{t({ es: '¿Qué cita quieres agendar?', en: 'What visit do you want to book?' })}</p>
        <p className="mt-3 min-h-[3.2rem] rounded-xl bg-black/30 px-3 py-2.5 font-mono text-[13px]">
          <span className={`transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}>{PHRASE.slice(0, n)}</span>
          <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-[#d9b36a]" aria-hidden="true" />
        </p>
        <ul className={`mt-3 flex min-h-[4.5rem] flex-wrap content-start gap-1.5 transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
          {n >= PHRASE.length &&
            PARSED.map((p, i) => (
              <li key={p.key.es} className="animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] rounded-lg bg-white/[0.06] px-2.5 py-1 text-[11px]" style={{ animationDelay: `${i * 110}ms` }}>
                <span className="text-white/45">{t(p.key)} · </span>
                {p.value}
              </li>
            ))}
        </ul>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[10px] text-white/40">{t({ es: 'Entiende el cliente, el servicio, el barbero, el día y la hora.', en: 'It understands client, service, barber, day and time.' })}</span>
          <span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-500 ${done ? 'bg-[#d9b36a] text-[#16130f]' : 'bg-white/10 text-white/40'}`}>{t({ es: 'Revisar y agendar', en: 'Review and book' })}</span>
        </div>
      </div>

      <p className="mb-3 mt-6 text-sm">{t({ es: 'Hoy conviene mirar', en: 'Worth a look today' })}</p>
      <ul className="space-y-2">
        {LOOK.map((l, i) => (
          <li key={l.title.es} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500 ${tick % LOOK.length === i ? 'translate-x-1 border-white/20 bg-white/[0.05]' : 'border-transparent opacity-60'}`}>
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: l.hue }} />
            <span className="flex-1 text-[12px]">{t(l.title)}</span>
            <span className="mono-label" style={{ color: l.hue }}>{t(l.kind)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Huecos del día ───────────────────────────────────────────────────── */

/** Los huecos de cada barbero, calculados del mismo día del calendario. */
function gapsOf(col: number): { start: number; len: number }[] {
  const busy = [...APPTS.filter((a) => a.col === col), ...BLOCKS.filter((b) => b.col === col)].map((x) => [x.start, x.start + x.len] as const).sort((a, b) => a[0] - b[0])
  const gaps: { start: number; len: number }[] = []
  let cursor = 0
  for (const [s, e] of busy) {
    if (s - cursor >= 1) gaps.push({ start: cursor, len: s - cursor })
    cursor = Math.max(cursor, e)
  }
  if (HALF_HOURS - cursor >= 1) gaps.push({ start: cursor, len: HALF_HOURS - cursor })
  return gaps
}

export function GapsLive() {
  const { t } = useLocale()
  const tick = useTick(1600)
  const all = BARBERS.map((_, c) => gapsOf(c))
  const flat = all.flatMap((g, c) => g.map((x) => ({ ...x, col: c })))
  const active = flat[tick % flat.length]
  const freeHalfHours = flat.reduce((n, g) => n + g.len, 0)
  const hours = Math.floor(freeHalfHours / 2)
  const mins = Math.round((freeHalfHours % 2) * 30)
  const toSell = (Math.round((freeHalfHours * 21) / 10) * 10).toLocaleString('es-CO')
  return (
    <div data-reveal="device" className="h-full rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-6">
      <p className="text-sm font-medium">{t({ es: 'Huecos del día', en: 'Day gaps' })}</p>
      <p className="mt-3 text-[clamp(1.8rem,1.2rem+1.6vw,2.6rem)] font-light leading-none">
        {hours} h {mins ? `${mins} min` : ''} <span className="text-base text-white/45">{t({ es: 'libres', en: 'free' })}</span>
      </p>
      <p className="mt-2 text-xs text-[#e9c27a]">{t({ es: `Hasta US$ ${toSell} por vender`, en: `Up to US$ ${toSell} to sell` })}</p>

      <div className="mt-6 space-y-2.5">
        {BARBERS.map((b, c) => (
          <div key={b} className="grid grid-cols-[4.2rem_1fr] items-center gap-3">
            <span className="text-[11px] text-white/60">{b}</span>
            <div className="relative h-6 rounded-md bg-white/[0.03]">
              {[...APPTS.filter((a) => a.col === c), ...BLOCKS.filter((x) => x.col === c)].map((x) => (
                <span key={`${x.start}`} className="absolute inset-y-1 rounded-[4px] bg-white/[0.12]" style={{ left: `${(x.start / HALF_HOURS) * 100}%`, width: `${(x.len / HALF_HOURS) * 100}%` }} />
              ))}
              {all[c].map((g) => {
                const on = active.col === c && active.start === g.start
                return (
                  <span
                    key={g.start}
                    className={`absolute inset-y-0 rounded-md border transition-all duration-500 ${on ? 'border-[#d9b36a] bg-[#d9b36a]/30 shadow-[0_0_24px_-2px_rgba(217,179,106,0.9)]' : 'border-dashed border-[#d9b36a]/40 bg-[#d9b36a]/[0.07]'}`}
                    style={{ left: `${(g.start / HALF_HOURS) * 100}%`, width: `${(g.len / HALF_HOURS) * 100}%` }}
                  />
                )
              })}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[4.2rem_1fr] gap-3 font-mono text-[9px] text-white/35">
          <span />
          <span className="flex justify-between"><span>11:00</span><span>1:30</span><span>4:00</span></span>
        </div>
      </div>

      <div key={tick} className="mt-6 flex animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] items-center gap-3 rounded-xl border border-[#d9b36a]/40 bg-[#d9b36a]/[0.08] px-3 py-2.5 text-[12px]">
        <span className="flex-1">
          {t({ es: 'Hueco libre', en: 'Free slot' })} {fmt(active.start)} · {BARBERS[active.col]} · <span className="text-[#e9c27a]">{t({ es: `${1 + (tick % 3)} en lista de espera encajan`, en: `${1 + (tick % 3)} on the waitlist fit` })}</span>
        </span>
        <span className="rounded-md bg-[#d9b36a] px-2.5 py-1 text-[11px] font-semibold text-[#16130f]">{t({ es: 'Ofrecer', en: 'Offer' })}</span>
      </div>
    </div>
  )
}
