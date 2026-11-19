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
