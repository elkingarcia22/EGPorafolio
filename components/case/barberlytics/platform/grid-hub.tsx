'use client'

import { useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { APPTS, BARBERS, STAGE, stageAt } from './calendar-model'
import { useAutoSteps } from './use-auto-steps'
import { useNarrow } from '../use-narrow'
import { HubTall } from './grid-hub-tall'

export interface HubNode {
  name: L
  sub: L
  detail: L
}

/** Quién usa la rejilla (a la izquierda) y lo que se alimenta de ella (a la derecha), del contenido del caso */
export const ROLES: readonly HubNode[] = [
  { name: { es: 'Recepción', en: 'Front desk' }, sub: { es: 'agenda y cobra', en: 'books and charges' }, detail: { es: 'Agenda y cobra en el calendario: todo el día pasa por sus manos.', en: 'Books and charges in the calendar: the whole day goes through their hands.' } },
  { name: { es: 'Barbero', en: 'Barber' }, sub: { es: 'mira su día', en: 'checks their day' }, detail: { es: 'Mira ahí su día: quién sigue, qué pidió y si va tarde.', en: 'Checks their day there: who’s next, what they asked for and whether they’re late.' } },
  { name: { es: 'Dueño', en: 'Owner' }, sub: { es: 'busca los huecos', en: 'hunts for gaps' }, detail: { es: 'Busca los huecos: las horas libres que todavía se pueden vender.', en: 'Hunts for gaps: the free hours that can still be sold.' } },
]
export const FEEDS: readonly HubNode[] = [
  { name: { es: 'Caja', en: 'Till' }, sub: { es: 'lo cobrado', en: 'what’s paid' }, detail: { es: 'Todo lo demás —clientes, nómina, caja— se alimenta de lo que pasa en la rejilla.', en: 'Everything else —clients, payroll, the till— feeds on what happens on the grid.' } },
  { name: { es: 'Clientes', en: 'Clients' }, sub: { es: 'sus visitas', en: 'their visits' }, detail: { es: 'Todo lo demás —clientes, nómina, caja— se alimenta de lo que pasa en la rejilla.', en: 'Everything else —clients, payroll, the till— feeds on what happens on the grid.' } },
  { name: { es: 'Nómina', en: 'Payroll' }, sub: { es: 'lo de cada barbero', en: 'each barber’s share' }, detail: { es: 'Todo lo demás —clientes, nómina, caja— se alimenta de lo que pasa en la rejilla.', en: 'Everything else —clients, payroll, the till— feeds on what happens on the grid.' } },
]

const W = 900
const H = 340
const LEFT_X = 200
const RIGHT_X = 700
const CENTER = { x: 450, y: 170 }
const ROW_Y = [70, 170, 270]
/** La rejilla del centro (unidades del SVG) */
const GRID = { w: 190, h: 150 }
/** Pasos al entrar: 1–3 roles, 4 la rejilla se llena, 5–7 lo que se alimenta, 8 todo late */
const LAST = 8
export const STEP_MS = 230

const inPath = (y: number) => `M${LEFT_X} ${y} C${LEFT_X + 70} ${y} ${CENTER.x - GRID.w / 2 - 70} ${CENTER.y} ${CENTER.x - GRID.w / 2} ${CENTER.y}`
const outPath = (y: number) => `M${CENTER.x + GRID.w / 2} ${CENTER.y} C${CENTER.x + GRID.w / 2 + 70} ${CENTER.y} ${RIGHT_X - 70} ${y} ${RIGHT_X} ${y}`

/** Mitad de la mañana del día de ejemplo: unas cobradas, otras en silla, otras por venir */
export const SNAPSHOT_NOW = 3.4

export type Pick = { side: 'role' | 'feed'; i: number } | { side: 'grid' } | null

export function Branch({ d, on, active, delay }: { d: string; on: boolean; active: boolean; delay: number }) {
  return (
    <>
      <path d={d} fill="none" stroke="white" strokeOpacity={0.07} />
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke="rgb(var(--signal))"
        strokeWidth={active ? 2.4 : 1.5}
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset={on ? 0 : 1}
        style={{ transition: `stroke-dashoffset ${STEP_MS * 1.6}ms cubic-bezier(.5,0,.3,1), stroke-width .3s`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.55))' }}
      />
      <path d={d} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray="0.05 0.95" className="pl-signal" style={{ opacity: on ? 1 : 0, transition: 'opacity .6s .4s', animationDelay: `${delay}s`, filter: 'drop-shadow(0 0 5px white)' }} />
    </>
  )
}

function HubDot({ x, y, on, active, label, sub, align, onPick }: { x: number; y: number; on: boolean; active: boolean; label: string; sub: string; align: 'start' | 'end'; onPick: () => void }) {
  const tx = align === 'end' ? -22 : 22
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPick()
        }
      }}
      className="cursor-pointer outline-none"
    >
      <rect x={align === 'end' ? x - 190 : x - 20} y={y - 34} width={210} height={64} fill="transparent" />
      <circle cx={x} cy={y} r={20} fill="rgb(var(--signal))" opacity={on ? (active ? 0.3 : 0.12) : 0} style={{ transition: 'opacity .4s' }} />
      {active && <circle cx={x} cy={y} r={13} fill="none" stroke="#d9b36a" strokeWidth={1.5} className="pl-hot" />}
      <circle cx={x} cy={y} r={7} fill={on ? (active ? '#fffaf0' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.4)'} strokeWidth={1.4} style={{ transition: 'fill .4s, stroke .4s' }} />
      <text x={x + tx} y={y - 2} textAnchor={align} className="pl-hub-name pointer-events-none fill-current" style={{ opacity: on ? 1 : 0.3, transition: 'opacity .4s' }}>{label}</text>
      <text x={x + tx} y={y + 17} textAnchor={align} className="pl-hub-sub pointer-events-none fill-current font-mono uppercase" letterSpacing="0.1em" style={{ opacity: on ? 0.5 : 0.2, transition: 'opacity .4s' }}>{sub}</text>
    </g>
  )
}

/**
 * 01 · Los puntos: la rejilla del día al centro. De un lado entran quienes la
 * usan; del otro salen los módulos que se alimentan de ella. Se arma sola y
 * rápido al verse; tocar una pieza cuenta su papel. Debajo, lo que fallaba.
 */
export function GridHub() {
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const step = useAutoSteps(rootRef, LAST, STEP_MS)
  const [pick, setPick] = useState<Pick>(null)
  const [pain, setPain] = useState<number | null>(null)
  const { dots } = PLATFORM_CASE
  const gridOn = step >= 4
  const narrow = useNarrow('(max-width: 767px)')

  const toggle = (next: Pick) => setPick((p) => (JSON.stringify(p) === JSON.stringify(next) ? null : next))
  const caption = (() => {
    if (pick?.side === 'role') return { tag: t({ es: 'Quién la usa', en: 'Who uses it' }), title: t(ROLES[pick.i].name), sub: t(ROLES[pick.i].detail) }
    if (pick?.side === 'feed') return { tag: t({ es: 'Lo que se alimenta', en: 'What feeds on it' }), title: t(FEEDS[pick.i].name), sub: t(FEEDS[pick.i].detail) }
    if (pick?.side === 'grid') return { tag: t({ es: 'La rejilla', en: 'The grid' }), title: t({ es: 'Cada barbería trabaja distinto', en: 'Every shop works differently' }), sub: t({ es: 'Unas viven del cliente sin cita, otras de la cita fija cada tres semanas; unas rotan barberos, otras no.', en: 'Some live on walk-ins, others on the fixed visit every three weeks; some rotate barbers, others don’t.' }) }
    return { tag: t({ es: 'Toca una pieza', en: 'Tap a piece' }), title: t(dots.kicker), sub: t({ es: 'Recepción agenda y cobra en él, el barbero mira ahí su día y el dueño busca los huecos. Todo lo demás se alimenta de la rejilla.', en: 'The front desk books and charges in it, the barber checks their day there and the owner hunts for gaps. Everything else feeds on the grid.' }) }
  })()

  // La rejilla del centro: una columna por barbero, cada cita con el color de su etapa a media mañana.
  const colW = GRID.w / BARBERS.length
  const unit = (GRID.h - 24) / 10
  const gx = CENTER.x - GRID.w / 2
  const gy = CENTER.y - GRID.h / 2

  return (
    <div ref={rootRef} className="mx-auto max-w-[920px]">
      <figure className="flex flex-col items-center text-center">
        <figcaption key={JSON.stringify(pick)} aria-live="polite" className="pl-fade flex min-h-[7.5rem] max-w-[46ch] flex-col items-center justify-end">
          <span className="mono-label text-signal">{caption.tag}</span>
          <span className="mt-3 text-balance text-[clamp(1.3rem,1rem+1.2vw,2rem)] font-light leading-[1.18] tracking-tight">{caption.title}</span>
          {caption.sub && <span className="mt-2 max-w-[52ch] text-balance text-sm leading-relaxed text-paper/55">{caption.sub}</span>}
        </figcaption>

        {narrow ? (
          <HubTall step={step} pick={pick} toggle={toggle} />
        ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 block h-auto w-full overflow-visible" role="group" aria-label={t({ es: 'La rejilla al centro: quién la usa y lo que se alimenta de ella', en: 'The grid at the center: who uses it and what feeds on it' })}>
          {ROW_Y.map((y, i) => (
            <Branch key={`in-${y}`} d={inPath(y)} on={step > i} active={pick?.side === 'role' && pick.i === i} delay={i * 0.25} />
          ))}
          {ROW_Y.map((y, i) => (
            <Branch key={`out-${y}`} d={outPath(y)} on={step > 4 + i} active={pick?.side === 'feed' && pick.i === i} delay={0.9 + i * 0.25} />
          ))}

          {/* La rejilla: se llena de citas al llegarle las tres fibras */}
          <g
            role="button"
            tabIndex={0}
            aria-label={t({ es: 'La rejilla', en: 'The grid' })}
            aria-pressed={pick?.side === 'grid'}
            onClick={() => toggle({ side: 'grid' })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggle({ side: 'grid' })
              }
            }}
            className="cursor-pointer outline-none"
          >
            <rect x={gx - 14} y={gy - 14} width={GRID.w + 28} height={GRID.h + 28} rx={22} fill="rgba(217,179,106,0.08)" opacity={gridOn ? 1 : 0} style={{ transition: 'opacity .6s', filter: 'blur(10px)' }} />
            <rect x={gx} y={gy} width={GRID.w} height={GRID.h} rx={14} fill="#141210" stroke={pick?.side === 'grid' ? '#d9b36a' : 'rgb(255 255 255 / 0.14)'} strokeWidth={pick?.side === 'grid' ? 2 : 1} style={{ transition: 'stroke .3s' }} />
            {BARBERS.map((b, c) => (
              <g key={b}>
                {c > 0 && <line x1={gx + c * colW} x2={gx + c * colW} y1={gy + 8} y2={gy + GRID.h - 8} stroke="white" strokeOpacity={0.06} />}
                <rect x={gx + c * colW + 6} y={gy + 9} width={colW - 12} height={4} rx={2} fill="white" opacity={0.18} />
              </g>
            ))}
            {APPTS.map((a, i) => {
              const hue = STAGE[stageAt(a, SNAPSHOT_NOW)].hue
              return (
                <rect
                  key={a.client}
                  x={gx + a.col * colW + 4}
                  y={gy + 20 + a.start * unit}
                  width={colW - 8}
                  height={a.len * unit - 3}
                  rx={4}
                  fill={hue}
                  fillOpacity={0.55}
                  stroke={hue}
                  style={{ opacity: gridOn ? 1 : 0, transform: gridOn ? 'none' : 'translateY(-6px)', transition: `opacity .4s ${i * 35}ms, transform .5s ${i * 35}ms cubic-bezier(.16,1,.3,1)` }}
                />
              )
            })}
            <line x1={gx + 2} x2={gx + GRID.w - 2} y1={gy + 20 + SNAPSHOT_NOW * unit} y2={gy + 20 + SNAPSHOT_NOW * unit} stroke="#e5484d" strokeWidth={1.4} opacity={gridOn ? 1 : 0} style={{ transition: 'opacity .4s .5s' }} />
            <text x={CENTER.x} y={gy + GRID.h + 34} textAnchor="middle" className="pl-hub-sub pointer-events-none fill-current font-mono uppercase" letterSpacing="0.14em" opacity={0.6}>
              {t({ es: 'El calendario', en: 'The calendar' })}
            </text>
          </g>

          {ROLES.map((r, i) => (
            <HubDot key={r.name.es} x={LEFT_X} y={ROW_Y[i]} on={step > i} active={pick?.side === 'role' && pick.i === i} label={t(r.name)} sub={t(r.sub)} align="end" onPick={() => toggle({ side: 'role', i })} />
          ))}
          {FEEDS.map((f, i) => (
            <HubDot key={f.name.es} x={RIGHT_X} y={ROW_Y[i]} on={step > 4 + i} active={pick?.side === 'feed' && pick.i === i} label={t(f.name)} sub={t(f.sub)} align="start" onPick={() => toggle({ side: 'feed', i })} />
          ))}
        </svg>
        )}
      </figure>

      {/* Lo que fallaba: tres nudos en la misma línea; su porqué sale al tocarlos */}
      <div className="mx-auto mt-16 max-w-[820px]">
        <p className="mono-label mb-6 text-center opacity-50">{t({ es: 'Lo que fallaba', en: 'What was broken' })}</p>
        <ol className="relative grid gap-6 sm:grid-cols-3 sm:gap-4">
          <span aria-hidden="true" className="absolute inset-x-[16.6%] top-[7px] hidden h-px bg-gradient-to-r from-[#ff6b72]/50 via-white/15 to-[#ff6b72]/50 sm:block" />
          {dots.seen.map((s, i) => {
            const on = pain === i
            return (
              <li key={s.title.es} className="relative">
                <button type="button" onClick={() => setPain(on ? null : i)} aria-expanded={on} className="group flex w-full flex-col items-center text-center outline-none">
                  <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                    <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#ff6b72] shadow-[0_0_18px_4px_rgba(255,107,114,0.6)]' : 'border-[#ff6b72]/70 bg-void group-hover:bg-[#ff6b72]/40'}`} />
                    {i === dots.seen.length - 1 && <span data-fiber-from="pl-patrones" className="absolute left-1/2 top-1/2 h-px w-px" />}
                  </span>
                  <span className={`mt-4 text-balance text-[15px] leading-snug transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-70 group-hover:opacity-95'}`}>{t(s.title)}</span>
                  {on && <span className="pl-fade mt-2 max-w-[30ch] text-balance text-sm leading-relaxed text-paper/55">{t(s.body)}</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
