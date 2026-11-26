'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'
import { BehaviorPhone } from './phone/behavior-phone'
import { usePhone } from './use-phone'

/** Se arma solo: una fila por comportamiento, rápido (ms) */
const AUTO = { intro: 400, step: 320 }

/** De qué parte del análisis salió cada respuesta, con su color */
const SOURCE = {
  had: { label: { es: 'Ya lo hacíamos', en: 'We already did it' }, tone: '111 207 151' },
  missing: { label: { es: 'Faltaba', en: 'Missing' }, tone: '255 126 182' },
  copy: { label: { es: 'Valía copiarlo', en: 'Worth copying' }, tone: '106 168 255' },
} as const

interface Behavior {
  /** Lo que hace el cliente */
  does: L
  /** Lo que se ve en los datos */
  seen: L
  /** Lo que responde la reserva */
  answer: L
  source: keyof typeof SOURCE
}

const { patterns, dots } = BOOKING_CASE
const notes = patterns.columns.map((c) => c.notes)

/** Seis comportamientos de quien reserva y lo que la reserva hace por cada uno (del análisis del caso) */
const BEHAVIORS: readonly Behavior[] = [
  { does: { es: 'Vuelve cada tantas semanas', en: 'Comes back every few weeks' }, seen: dots.seen[0].body, answer: notes[0][0], source: 'had' },
  { does: { es: 'Quiere la hora más cercana', en: 'Wants the nearest time' }, seen: dots.seen[1].body, answer: notes[2][1], source: 'copy' },
  { does: { es: 'Su barbero no tiene hueco', en: 'Their barber has no slot' }, seen: { es: 'Ese día no hay horas con él, pero no quiere irse sin cita.', en: 'No slots with him that day, but they don’t want to leave without one.' }, answer: notes[0][1], source: 'had' },
  { does: { es: 'Reserva también para otros', en: 'Books for others too' }, seen: { es: 'Un mismo celular agenda para más de una persona.', en: 'One phone books for more than one person.' }, answer: notes[0][2], source: 'had' },
  { does: { es: 'A veces no llega', en: 'Sometimes doesn’t show' }, seen: { es: 'Inasistencias sin protección y recordatorios que solo se prometían.', en: 'No-shows without protection and reminders only promised.' }, answer: notes[1][1], source: 'missing' },
  { does: { es: 'Prefiere pagar al llegar', en: 'Prefers to pay on arrival' }, seen: { es: 'El pago ocurre en la barbería, no en la app.', en: 'Payment happens at the shop, not in the app.' }, answer: notes[0][4], source: 'had' },
]

/**
 * 02 · Patrones como análisis de comportamiento: a la izquierda lo que hace
 * quien reserva, a la derecha lo que la reserva responde, y entre ambos los
 * datos que corren. Se arma fila por fila; tocar una muestra lo que se vio.
 * Del primer comportamiento sale la fibra hacia «La idea», por la izquierda.
 */
export function BehaviorFlow() {
  const { t } = useLocale()
  const { ref, step, done, reducedMotion } = useAutoSteps<HTMLDivElement>(BEHAVIORS.length, AUTO)
  const [picked, setPicked] = useState<number | null>(null)
  const phone = usePhone()
  const current = picked !== null && !phone ? BEHAVIORS[picked] : null

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede
        tag={current ? t(SOURCE[current.source].label) : t({ es: 'Cómo reserva la gente', en: 'How people book' })}
        title={current ? t(current.seen) : t({ es: 'Mirando cómo reservan los clientes salieron seis comportamientos.', en: 'Watching how clients book surfaced six behaviors.' })}
        sub={current ? `→ ${t(current.answer)}` : t({ es: 'Cada uno pide una respuesta de la reserva. Toca uno para ver qué se vio.', en: 'Each one asks the booking for an answer. Tap one to see what was seen.' })}
        swapKey={picked ?? 'all'}
      />

      {phone && <BehaviorPhone items={BEHAVIORS.map((b) => ({ ...b, source: SOURCE[b.source] }))} />}

      <div className="mt-10 w-full max-w-[940px]">
        {!phone && (
        <>
        <div className="mb-4 hidden grid-cols-[1fr_minmax(120px,22%)_1fr] font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60 md:grid">
          <span className="text-right">{t({ es: 'Lo que hace el cliente', en: 'What the client does' })}</span>
          <span />
          <span>{t({ es: 'Lo que responde la reserva', en: 'What the booking answers' })}</span>
        </div>

        <ol>
          {BEHAVIORS.map((b, i) => {
            const on = step > i
            const isPicked = picked === i
            const tone = SOURCE[b.source].tone
            return (
              <li key={b.does.es}>
                <button
                  type="button"
                  aria-pressed={isPicked}
                  onClick={() => setPicked((p) => (p === i ? null : i))}
                  className="group grid w-full grid-cols-1 items-center gap-1 rounded-2xl px-3 py-3 text-left outline-none transition-colors duration-300 hover:bg-white/[0.03] focus-visible:ring-1 focus-visible:ring-[rgb(var(--bk))] md:grid-cols-[1fr_minmax(120px,22%)_1fr] md:gap-0 md:py-2.5"
                  style={{ backgroundColor: isPicked ? `rgb(${tone} / 0.07)` : undefined }}
                >
                  {/* Lo que hace */}
                  <span className="relative flex items-center gap-3 md:justify-end md:text-right" style={{ opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -16}px)`, transition: 'opacity .5s, transform .6s cubic-bezier(.16,1,.3,1)' }}>
                    {i === 0 && <span data-fiber-from="bk-idea" className="absolute -left-3 top-1/2 h-px w-px" />}
                    <span className={`text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-light leading-snug ${isPicked ? 'text-paper' : 'text-paper/85'}`}>{t(b.does)}</span>
                    <span className="hidden h-2.5 w-2.5 shrink-0 rounded-full bg-paper/80 md:block" />
                  </span>

                  {/* Los datos que corren de un lado al otro */}
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="hidden h-5 w-full overflow-visible md:block" aria-hidden="true">
                    <line x1={0} y1={10} x2={200} y2={10} stroke={`rgb(${tone})`} strokeOpacity={isPicked ? 0.9 : 0.4} strokeWidth={1.4} pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0 : 1} style={{ transition: 'stroke-dashoffset .5s ease-out, stroke-opacity .3s' }} vectorEffect="non-scaling-stroke" />
                    {on && !reducedMotion && [0, 1, 2].map((k) => (
                      <circle key={k} r={2.2} cy={10} fill={`rgb(${tone})`} style={{ filter: `drop-shadow(0 0 3px rgb(${tone}))` }}>
                        <animate attributeName="cx" from="0" to="200" dur={`${1.6 + (i % 3) * 0.3}s`} begin={`${k * 0.55 + i * 0.12}s`} repeatCount="indefinite" />
                      </circle>
                    ))}
                  </svg>
                  <span className="flex items-center gap-2 pl-0.5 text-paper/35 md:hidden" aria-hidden="true">
                    <span className="h-px w-6" style={{ background: `rgb(${tone} / 0.7)` }} />→
                  </span>

                  {/* Lo que responde */}
                  <span className="flex items-center gap-3" style={{ opacity: on ? 1 : 0, transition: 'opacity .5s .25s' }}>
                    <span className="hidden h-2.5 w-2.5 shrink-0 rounded-full md:block" style={{ background: `rgb(${tone})`, boxShadow: `0 0 10px rgb(${tone} / 0.7)` }} />
                    <span className="text-sm leading-snug text-paper/65 md:text-[0.95rem]">{t(b.answer)}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        </>
        )}

        {/* De dónde sale cada respuesta */}
        <ul className={`mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 transition-opacity duration-700 ${done ? 'opacity-100' : 'opacity-0'}`}>
          {Object.values(SOURCE).map((s) => (
            <li key={s.label.es} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">
              <span className="h-2 w-2 rounded-full" style={{ background: `rgb(${s.tone})` }} />
              {t(s.label)}
            </li>
          ))}
        </ul>
      </div>

      {/* La conclusión que lleva a la idea */}
      <p className={`mt-12 max-w-[52ch] text-balance text-center text-[clamp(1.05rem,0.95rem+0.5vw,1.35rem)] font-light leading-snug text-[rgb(var(--bk))] transition-all duration-700 ${done ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        {t(patterns.insights[1])}
      </p>
    </div>
  )
}
