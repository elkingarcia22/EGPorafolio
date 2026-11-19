'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { APPTS, BARBERS, CLIENT, HALF_HOURS, SERVICE, STAGE, fmt, stageAt, useCalendarClock, type Stage } from './calendar-model'
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

/* ── 5.2 · Vistas del calendario, detalle y ocupación del día ────────── */

type View = 'agenda' | 'dia' | 'semana' | 'mes'
const VIEWS: readonly { id: View; label: L; key: string }[] = [
  { id: 'dia', label: { es: 'Día', en: 'Day' }, key: 'D' },
  { id: 'semana', label: { es: 'Semana', en: 'Week' }, key: 'W' },
  { id: 'mes', label: { es: 'Mes', en: 'Month' }, key: 'M' },
  { id: 'agenda', label: { es: 'Agenda', en: 'Agenda' }, key: 'A' },
]

const WEEK = [
  { d: 'Lun 16', load: [3, 4, 2, 5, 3], tag: null },
  { d: 'Mar 17', load: [5, 5, 4, 6, 5], tag: 'Día pesado' },
  { d: 'Mié 18', load: [4, 3, 2, 3, 3], tag: 'Hoy' },
  { d: 'Jue 19', load: [6, 6, 5, 6, 4], tag: 'Día pesado' },
  { d: 'Vie 20', load: [6, 5, 6, 6, 6], tag: 'Día pesado' },
  { d: 'Sáb 21', load: [2, 3, 1, 2, 3], tag: 'Día suave' },
] as const

function WeekView() {
  return (
    <div className="grid h-full grid-cols-6 gap-2">
      {WEEK.map((day, i) => (
        <div key={day.d} className={`flex flex-col rounded-xl border p-2 ${day.tag === 'Hoy' ? 'border-[#d9b36a]/60 bg-[#d9b36a]/[0.06]' : 'border-white/[0.07]'}`}>
          <p className="text-[11px] font-medium">{day.d}</p>
          <span className={`mt-1 h-4 text-[9px] ${day.tag === 'Día pesado' ? 'text-[#f2a03a]' : day.tag === 'Día suave' ? 'text-[#4cc98d]' : 'text-[#d9b36a]'}`}>{day.tag ?? ''}</span>
          <div className="mt-2 flex flex-1 items-end gap-[3px]">
            {day.load.map((n, b) => (
              <span key={b} className="flex-1 origin-bottom animate-[bar-rise_0.8s_cubic-bezier(0.16,1,0.3,1)_both] rounded-t-[3px]" style={{ height: `${(n / 6) * 100}%`, background: `${['#5b8def', '#3fae7c', '#b07ad6', '#e0b44a', '#4fb8dc'][b]}aa`, animationDelay: `${i * 70 + b * 30}ms` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MonthView() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  return (
    <div className="grid h-full grid-cols-7 gap-1.5">
      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={`${d}-${i}`} className="text-center text-[10px] text-white/40">{d}</span>)}
      {days.map((d) => {
        const sunday = d % 7 === 1
        const load = sunday ? 0 : ((d * 37) % 10) / 10
        return (
          <span key={d} className={`flex flex-col justify-between rounded-lg p-1 text-[10px] ${d === 18 ? 'ring-1 ring-[#d9b36a]' : ''}`} style={{ background: sunday ? 'transparent' : `rgba(217,179,106,${0.08 + load * 0.45})` }}>
            {d}
            {!sunday && <span className="h-1 rounded-full bg-white/50" style={{ width: `${30 + load * 70}%` }} />}
          </span>
        )
      })}
    </div>
  )
}

function AgendaView({ now }: { now: number }) {
  const list = [...APPTS].sort((a, b) => a.start - b.start).filter((a) => stageAt(a, now) !== 'paid').slice(0, 6)
  return (
    <ul className="space-y-1.5">
      {list.map((a) => {
        const s = STAGE[stageAt(a, now)]
        return (
          <li key={a.client} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
            <span className="font-mono text-white/50">{fmt(a.start)}</span>
            <span className="truncate"><b className="font-medium">{a.client}</b> <span className="text-white/45">· {BARBERS[a.col]}</span></span>
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px]" style={{ color: s.hue }}>{s.label}</span>
          </li>
        )
      })}
    </ul>
  )
}

/** Detalle del día: el pulso por etapa, lo cobrado y la ocupación de cada barbero. */
function DayDetail({ now }: { now: number }) {
  const { t } = useLocale()
  const stages = APPTS.map((a) => stageAt(a, now))
  const count = (st: Stage) => stages.filter((x) => x === st).length
  const paid = APPTS.filter((a) => stageAt(a, now) === 'paid').reduce((n, a) => n + a.price, 0)
  const total = APPTS.reduce((n, a) => n + a.price, 0)
  const pulse: readonly Stage[] = ['late', 'waiting', 'seated', 'toCollect', 'paid']
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#141210] p-5">
      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'El pulso del día', en: 'The day’s pulse' })}</p>
        <div className="flex flex-wrap gap-1.5">
          {pulse.map((st) => (
            <span key={st} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: STAGE[st].hue }} />
              {STAGE[st].label}
              <b className="font-mono tabular-nums" style={{ color: STAGE[st].hue }}>{count(st)}</b>
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Cobrado / del día', en: 'Collected / today' })}</p>
        <p className="font-mono text-2xl tabular-nums">US$ {paid} <span className="text-base text-white/40">/ {total}</span></p>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><span className="block h-full rounded-full bg-[#4cc98d] transition-[width] duration-700" style={{ width: `${(paid / total) * 100}%` }} /></span>
      </div>
      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Ocupación de cada silla', en: 'Each chair’s occupancy' })}</p>
        <ul className="space-y-2.5">
          {BARBERS.map((b, c) => {
            const booked = APPTS.filter((a) => a.col === c).reduce((n, a) => n + a.len, 0)
            const pct = Math.round((booked / HALF_HOURS) * 100)
            return (
              <li key={b} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2 text-[11px]">
                <span className="truncate">{b}</span>
                <span className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><span data-reveal="right" className="block h-full rounded-full" style={{ width: `${pct}%`, background: pct > 60 ? '#f2a03a' : '#d9b36a' }} /></span>
                <span className="text-right font-mono text-white/60">{pct}%</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function CalendarViews() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const now = useCalendarClock(700, 1.5, 8, 3)
  const [view, setView] = useState<View>('dia')
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (pinned || reducedMotion) return
    const id = window.setInterval(() => setView((v) => VIEWS[(VIEWS.findIndex((x) => x.id === v) + 1) % VIEWS.length].id), 4200)
    return () => window.clearInterval(id)
  }, [pinned, reducedMotion])

  return (
    <div data-reveal="device" className="rounded-3xl bg-[#0f0d0b] p-4 text-[#efe9dd] md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label={t({ es: 'Vista del calendario', en: 'Calendar view' })} className="flex rounded-lg bg-white/[0.05] p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => {
                setView(v.id)
                setPinned(true)
              }}
              className="rounded-md px-3 py-1.5 text-xs text-white/65 transition-colors hover:text-white aria-selected:bg-[#d9b36a] aria-selected:text-[#16130f]"
            >
              {t(v.label)} <span className="ml-1 font-mono text-[9px] opacity-60">{v.key}</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-white/45">{t({ es: 'Miércoles 18 nov · Trabajando', en: 'Wed Nov 18 · Working' })}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div key={view} className="min-h-[440px] animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          {view === 'dia' && <LiveCalendar now={now} />}
          {view === 'semana' && <WeekView />}
          {view === 'mes' && <MonthView />}
          {view === 'agenda' && <AgendaView now={now} />}
        </div>
        <DayDetail now={now} />
      </div>
    </div>
  )
}
