'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { LiveCalendar, useCalendarClock } from './live-calendar'
import { APPTS, BARBERS, SERVICE, STAGE, fmt, stageAt } from './calendar-model'

type View = 'dia' | 'semana' | 'mes' | 'agenda'
const VIEW_MS = 5200
const GOLD = '#d9b36a'

const VIEWS: readonly { id: View; label: L; key: string; note: L }[] = [
  { id: 'dia', label: { es: 'Día', en: 'Day' }, key: 'D', note: { es: 'Una columna por barbero, la línea de ahora y cada cita con su siguiente paso.', en: 'One column per barber, the now line and every visit with its next step.' } },
  { id: 'semana', label: { es: 'Semana', en: 'Week' }, key: 'W', note: { es: 'Cada celda es la parte de la jornada reservada y las citas. La llama marca los días que suelen ser pesados; la pluma, los suaves.', en: 'Each cell is the booked share of the day and its visits. The flame marks usually heavy days; the feather, light ones.' } },
  { id: 'mes', label: { es: 'Mes', en: 'Month' }, key: 'M', note: { es: 'Citas del mes, ocupación media y el día más lleno, con cada día pintado por su ocupación.', en: 'Visits this month, average occupancy and the fullest day, with every day shaded by occupancy.' } },
  { id: 'agenda', label: { es: 'Agenda', en: 'Agenda' }, key: 'A', note: { es: 'La lista del día, con el estado de cada cita y el botón para seguir.', en: 'The day as a list, with each visit’s status and the button to move on.' } },
]

/* ── Semana ──────────────────────────────────────────────────────────── */

/** Ocupación de ejemplo por barbero y día (la maqueta, no datos reales). */
const WEEK = [
  [0.62, 0.48, 0.71, 0.84, 0.93, 0.97, 0.35],
  [0.55, 0.6, 0.66, 0.78, 0.88, 0.95, 0.3],
  [0.4, 0.52, 0.58, 0.7, 0.86, 0.9, 0],
  [0.68, 0.44, 0.63, 0.81, 0.9, 0.98, 0.42],
  [0.5, 0.57, 0.6, 0.76, 0.83, 0.92, 0.28],
]
const DAYS: readonly L[] = [
  { es: 'Lun', en: 'Mon' }, { es: 'Mar', en: 'Tue' }, { es: 'Mié', en: 'Wed' }, { es: 'Jue', en: 'Thu' }, { es: 'Vie', en: 'Fri' }, { es: 'Sáb', en: 'Sat' }, { es: 'Dom', en: 'Sun' },
]
const TODAY = 2

function WeekView() {
  const { t } = useLocale()
  return (
    <div className="h-full p-4">
      <div className="grid h-full grid-cols-[3.4rem_repeat(7,minmax(0,1fr))] grid-rows-[auto_repeat(5,minmax(0,1fr))] gap-1 sm:grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] sm:gap-1.5">
        <span />
        {DAYS.map((d, i) => (
          <p key={d.es} className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] ${i === TODAY ? 'bg-[#d9b36a] font-semibold text-[#16130f]' : 'text-white/60'}`}>
            {t(d)} {16 + i}
            <span aria-hidden="true">{i === 5 ? '🔥' : i === 6 ? '🪶' : ''}</span>
          </p>
        ))}
        {BARBERS.map((b, r) => (
          <div key={b} className="contents">
            <p className="flex items-center text-[11px] text-white/70">{b}</p>
            {WEEK[r].map((occ, c) => (
              <div key={c} className="relative overflow-hidden rounded-md bg-white/[0.04] p-1 sm:p-1.5" style={{ outline: c === TODAY ? `1px solid ${GOLD}55` : undefined }}>
                {occ === 0 ? (
                  <span className="text-[10px] text-white/30">{t({ es: 'Libre', en: 'Off' })}</span>
                ) : (
                  <>
                    <span
                      className="absolute inset-x-0 bottom-0 origin-bottom animate-[bar-rise_0.9s_cubic-bezier(0.16,1,0.3,1)_both]"
                      style={{ height: `${occ * 100}%`, background: `rgba(217,179,106,${0.1 + occ * 0.28})`, animationDelay: `${(r * 7 + c) * 22}ms` }}
                    />
                    {/* En el celular, solo el porcentaje y sin cortes: la barra cuenta el resto. */}
                    <span className="relative whitespace-nowrap font-mono text-[10px] text-white/80 max-sm:text-[11px]">{Math.round(occ * 100)}<span className="max-sm:hidden"> </span>%</span>
                    <span className="relative block text-[9px] text-white/45 max-sm:hidden">{Math.round(occ * 14)} {t({ es: 'citas', en: 'visits' })}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Mes ─────────────────────────────────────────────────────────────── */

/** Ocupación de ejemplo para 35 celdas (las dos primeras y las últimas son de otros meses). */
const MONTH = Array.from({ length: 35 }, (_, i) => {
  if (i < 2 || i > 31) return -1
  const weekday = i % 7
  const base = [0.55, 0.5, 0.6, 0.72, 0.86, 0.94, 0.3][weekday]
  return Math.min(0.99, base + (((i * 37) % 11) - 5) / 60)
})
const FULLEST = MONTH.indexOf(Math.max(...MONTH))

function MonthView() {
  const { t } = useLocale()
  const kpis = [
    { value: '612', label: t({ es: 'Citas del mes', en: 'Visits this month' }) },
    { value: '71 %', label: t({ es: 'Ocupación media', en: 'Average occupancy' }) },
    { value: `${t({ es: 'Sáb', en: 'Sat' })} ${FULLEST - 1}`, label: t({ es: 'Día más lleno', en: 'Fullest day' }) },
  ]
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg bg-white/[0.05] px-3 py-2">
            <p className="text-[10px] text-white/45">{k.label}</p>
            <p className="text-lg font-semibold tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 grid-rows-5 gap-1">
        {MONTH.map((occ, i) => (
          <div
            key={i}
            data-slot-in={occ >= 0 ? '' : undefined}
            className="relative rounded-md p-1.5"
            style={{
              background: occ < 0 ? 'transparent' : `rgba(217,179,106,${0.06 + occ * 0.5})`,
              outline: i === FULLEST ? `1.5px solid ${GOLD}` : undefined,
              animationDelay: `${i * 30}ms`,
            }}
          >
            {occ >= 0 && (
              <>
                <span className="font-mono text-[10px] text-white/80 max-sm:text-[11px]">{i - 1}</span>
                <span className="absolute bottom-1 right-1.5 text-[9px] text-white/55 max-sm:hidden">{Math.round(occ * 100)}%</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Agenda ──────────────────────────────────────────────────────────── */

const DAY_LIST = [...APPTS].sort((a, b) => a.start - b.start)
const AGENDA_ROWS = 9

/** La ventana de la lista sigue a la hora: dos citas ya cobradas arriba y lo que viene debajo. */
function agendaWindow(now: number) {
  const firstOpen = DAY_LIST.findIndex((a) => stageAt(a, now) !== 'paid')
  const from = Math.max(0, Math.min((firstOpen < 0 ? DAY_LIST.length : firstOpen) - 2, DAY_LIST.length - AGENDA_ROWS))
  return DAY_LIST.slice(from, from + AGENDA_ROWS)
}

function AgendaView({ now }: { now: number }) {
  return (
    <div className="h-full overflow-hidden p-4">
      <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/10">
        {agendaWindow(now).map((a) => {
          const stage = stageAt(a, now)
          const s = STAGE[stage]
          return (
            <li key={a.client} className="grid grid-cols-[2.9rem_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 text-[11px] sm:grid-cols-[3.4rem_minmax(0,1fr)_auto_auto] sm:gap-3 transition-colors duration-500" style={{ background: stage === 'seated' ? 'rgba(224,180,74,0.08)' : undefined }}>
              <span className="font-mono text-white/50">{fmt(a.start)}</span>
              <span className="min-w-0 truncate">
                <span className="font-medium text-white/90">{a.client}</span>
                <span className="text-white/45"> · {SERVICE[a.services[0]].name} · {BARBERS[a.col]}</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] transition-colors duration-500" style={{ background: `${s.hue}22`, color: s.hue }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hue }} />
                {s.label}
              </span>
              <span className="w-16 text-right max-sm:hidden">
                {s.next ? <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-white/85">{s.next}</span> : <span className="text-[10px] text-[#4cc98d]">✓</span>}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Las cuatro vistas del calendario, en vivo: la hora corre y cada vista se arma al aparecer. */
export function CalendarViews() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const now = useCalendarClock(650)
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
            {k === i && !pinned && !reducedMotion && (
              <span key={i} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#d9b36a]" style={{ animation: `view-progress ${VIEW_MS}ms linear both` }} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl bg-[#0b0c0e] text-[#efe9dd] shadow-[0_40px_90px_-35px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="text-sm font-medium">{t({ es: 'Calendario', en: 'Calendar' })}</span>
          <span className="whitespace-nowrap text-[11px] text-white/45">{t({ es: 'Miércoles 18', en: 'Wednesday 18' })} · {fmt(now)}</span>
          {/* En el celular las pestañas de arriba ya cambian la vista: no se repiten apretadas aquí. */}
          <span className="ml-auto flex rounded-lg max-sm:hidden bg-white/[0.05] p-0.5 text-[11px]">
            {VIEWS.map((x, k) => (
              <span key={x.id} className={`rounded-md px-2.5 py-1 transition-colors duration-300 ${k === i ? 'bg-[#d9b36a] text-[#16130f]' : 'text-white/55'}`}>{t(x.label)}</span>
            ))}
          </span>
        </div>
        {/* Cada vista se monta de nuevo al aparecer, así sus piezas se arman frente a quien mira */}
        <div key={v.id} className="relative h-[clamp(360px,42vw,520px)] animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] overflow-hidden">
          {v.id === 'dia' && (
            <div className="h-full overflow-hidden p-3">
              <LiveCalendar now={now} density="compacta" intro={0} className="border-0" />
            </div>
          )}
          {v.id === 'semana' && <WeekView />}
          {v.id === 'mes' && <MonthView />}
          {v.id === 'agenda' && <AgendaView now={now} />}
        </div>
      </div>
      <p key={`n-${v.id}`} className="mt-4 max-w-[62ch] animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] text-sm leading-relaxed opacity-75">
        <b className="font-medium">{t(v.label)}.</b> {t(v.note)}
      </p>
    </div>
  )
}
