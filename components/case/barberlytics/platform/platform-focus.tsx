'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { APPTS, CLIENT, SERVICE, STAGE, fmt, stageAt, useCalendarClock, type Stage } from './calendar-model'
import { LiveCalendar } from './live-calendar'

const FOCUS = APPTS.find((a) => a.client === 'Andrés Vargas') ?? APPTS[0]

const HEADLINE: Record<Stage, L> = {
  upcoming: { es: 'Llega a las 12:30', en: 'Arrives at 12:30' },
  late: { es: 'Va 8 min tarde', en: '8 min late' },
  waiting: { es: 'Llegó · en la sala de espera', en: 'Arrived · in the waiting room' },
  seated: { es: 'En la silla con Andrés', en: 'In the chair with Andrés' },
  toCollect: { es: 'Terminó hace 6 min · sin cobrar', en: 'Ended 6 min ago · unpaid' },
  paid: { es: 'Cobrada US$ 59 · recibo enviado', en: 'Paid US$ 59 · receipt sent' },
}

const STEPS: readonly { label: L; reached: readonly Stage[] }[] = [
  { label: { es: 'Agendada', en: 'Booked' }, reached: ['upcoming', 'late', 'waiting', 'seated', 'toCollect', 'paid'] },
  { label: { es: 'Llegó', en: 'Arrived' }, reached: ['waiting', 'seated', 'toCollect', 'paid'] },
  { label: { es: 'En silla', en: 'In chair' }, reached: ['seated', 'toCollect', 'paid'] },
  { label: { es: 'Cobrada', en: 'Paid' }, reached: ['paid'] },
]

/** 5.1 · Una cita, de cerca: se destaca del calendario y se transforma mientras el día avanza. */
export function FocusAppointment() {
  const { t } = useLocale()
  const now = useCalendarClock(520, 2.4, 7.2, 2.4)
  const stage = stageAt(FOCUS, now)
  const s = STAGE[stage]
  return (
    <div data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-4 text-[#efe9dd] md:p-8">
      <span className="pointer-events-none absolute right-[10%] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full opacity-25 blur-3xl transition-[background] duration-700" style={{ background: s.hue }} aria-hidden="true" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <LiveCalendar now={now} columns={3} focus={FOCUS.client} />

        <div className="relative">
          {/* La lupa: la misma cita, grande */}
          <div
            key={stage}
            className="animate-[spot-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] rounded-2xl p-6"
            style={{ background: `${s.hue}26`, boxShadow: `inset 0 0 0 1.5px ${s.hue}aa, 0 40px 90px -30px ${s.hue}` }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERVICE[FOCUS.services[0]].hue }} />
              <span className="text-xl font-medium">{FOCUS.client}</span>
              <span className="ml-auto rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold tracking-wide" style={{ color: CLIENT[FOCUS.type] }}>{FOCUS.type}</span>
            </div>
            <p className="mt-2 text-sm text-white/60">Corte clásico + Arreglo de barba · US$ {FOCUS.price}</p>
            <p className="mt-1 font-mono text-xs text-white/40">{fmt(FOCUS.start)} – {fmt(FOCUS.start + FOCUS.len)} · Andrés</p>
            <p className="mt-6 text-[clamp(1.4rem,1rem+1.2vw,2.1rem)] font-light leading-tight">{t(HEADLINE[stage])}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-sm" style={{ color: s.hue }}>
                {stage === 'paid' ? '✓' : <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hue }} />} {s.label}
              </span>
              {s.next && (
                <span className="relative rounded-lg px-4 py-2 text-sm font-semibold text-[#16130f]" style={{ background: s.hue }}>
                  {s.next}
                  <span className="pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 animate-[tap-ping_1.8s_ease-out_infinite] rounded-full border-2 border-white/80" aria-hidden="true" />
                </span>
              )}
            </div>
          </div>
          <ol className="mt-6 grid grid-cols-4 gap-2">
            {STEPS.map((st, k) => {
              const done = st.reached.includes(stage)
              return (
                <li key={st.label.es} className="text-center">
                  <span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors duration-500 ${done ? 'bg-[#d9b36a] text-[#16130f]' : 'border border-white/20 text-white/40'}`}>{done ? '✓' : k + 1}</span>
                  <span className={`mt-2 block text-[11px] ${done ? 'text-white/85' : 'text-white/35'}`}>{t(st.label)}</span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

/* ── 5.2 · Las cuatro vistas (capturas reales de la plataforma) ──────── */

type View = 'dia' | 'semana' | 'mes' | 'agenda'
const VIEWS: readonly { id: View; label: L; key: string; src: string; note: L }[] = [
  { id: 'dia', label: { es: 'Día', en: 'Day' }, key: 'D', src: 'cal-states', note: { es: 'Una columna por barbero, la línea de ahora y cada cita con su siguiente paso.', en: 'One column per barber, the now line and every visit with its next step.' } },
  { id: 'semana', label: { es: 'Semana', en: 'Week' }, key: 'W', src: 'cal-week', note: { es: 'Cada celda es la parte de la jornada reservada y las citas. La llama marca los días que suelen ser pesados; la pluma, los suaves.', en: 'Each cell is the booked share of the day and its visits. The flame marks usually heavy days; the feather, light ones.' } },
  { id: 'mes', label: { es: 'Mes', en: 'Month' }, key: 'M', src: 'cal-month', note: { es: 'Citas del mes, ocupación media y el día más lleno, con cada día pintado por su ocupación.', en: 'Visits this month, average occupancy and the fullest day, with every day shaded by occupancy.' } },
  { id: 'agenda', label: { es: 'Agenda', en: 'Agenda' }, key: 'A', src: 'cal-agenda', note: { es: 'La lista del día, con el estado de cada cita y el botón para seguir.', en: 'The day as a list, with each visit’s status and the button to move on.' } },
]
const VIEW_MS = 4200

export function CalendarViews() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [i, setI] = useState(0)
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    if (pinned || reducedMotion) return
    const id = window.setInterval(() => setI((k) => (k + 1) % VIEWS.length), VIEW_MS)
    return () => window.clearInterval(id)
  }, [pinned, reducedMotion])
  const v = VIEWS[i]
  return (
    <div data-reveal="device">
      <div role="tablist" aria-label={t({ es: 'Vista del calendario', en: 'Calendar view' })} className="mb-4 flex flex-wrap items-center gap-2">
        {VIEWS.map((x, k) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => {
              setI(k)
              setPinned(true)
            }}
            className="relative overflow-hidden rounded-full border border-fg/20 px-4 py-2 text-sm transition-colors hover:border-fg/50 aria-selected:border-[#d9b36a] aria-selected:text-[#b58a3a]"
          >
            {t(x.label)} <span className="ml-1 font-mono text-[10px] opacity-60">{x.key}</span>
            {k === i && !pinned && !reducedMotion && <span key={i} className="absolute inset-x-0 bottom-0 h-[2px] origin-left animate-[view-progress_4.2s_linear_both] bg-[#d9b36a]" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_40px_90px_-35px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
        </div>
        <div className="relative aspect-[16/10]">
          {VIEWS.map((x, k) => (
            <Image
              key={x.id}
              src={`/cases/barberlytics/${x.src}.webp`}
              width={2000}
              height={1250}
              alt={t({ es: `Vista ${x.label.es} del calendario.`, en: `Calendar ${x.label.en} view.` })}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 ease-expo ${k === i ? 'scale-100 opacity-100' : 'scale-[1.02] opacity-0'}`}
            />
          ))}
        </div>
      </div>
      <p key={v.id} className="mt-4 max-w-[62ch] animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] text-sm leading-relaxed opacity-75">
        <b className="font-medium">{t(v.label)}.</b> {t(v.note)}
      </p>
    </div>
  )
}
