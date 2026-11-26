'use client'

import { useState } from 'react'
import {
  ALL_FIELDS,
  APPTS,
  BARBERS,
  BLOCKS,
  CLIENT,
  DENSITY_PX,
  HALF_HOURS,
  SERVICE,
  STAGE,
  cardHue,
  fmt,
  stageAt,
  useCalendarClock,
  type Appt,
  type CardFields,
  type CardStyle,
  type ColorBy,
  type Density,
} from './calendar-model'
import { useNarrow } from '../use-narrow'

export { ALL_FIELDS, useCalendarClock, type CardFields, type CardStyle, type ColorBy, type Density }

interface CardProps {
  a: Appt
  now: number
  colorBy: ColorBy
  style: CardStyle
  fields: CardFields
  px: number
  introAt?: number
  dim?: boolean
  lit?: boolean
  /** En el celular la letra es más grande: hace falta más alto para mostrar cada línea */
  narrow?: boolean
}

/**
 * La tarjeta de una cita. Todo lo que muestra depende de los ajustes:
 * si un campo se apaga, desaparece de verdad; si no cabe, pasa a una sola línea.
 */
function Card({ a, now, colorBy, style, fields, px, introAt, dim, lit, narrow = false }: CardProps) {
  const stage = stageAt(a, now)
  const s = STAGE[stage]
  const hue = cardHue(a, stage, colorBy)
  const height = a.len * px - 2
  const roomy = height >= (narrow ? 90 : 70)
  const medium = height >= (narrow ? 66 : 46)
  const bg = hue ? `${hue}${style === 'vivo' ? '66' : '24'}` : 'rgba(255,255,255,0.06)'
  const edge = hue ? `${hue}${style === 'vivo' ? 'cc' : '70'}` : 'rgba(255,255,255,0.1)'
  const detail = [fields.service ? a.services.map((sv) => SERVICE[sv].name).join(' + ') : null, fields.price ? `US$ ${a.price}` : null].filter(Boolean).join(' · ')
  const time = `${fmt(a.start)} – ${fmt(a.start + a.len)}`
  return (
    <div
      data-slot-in={introAt !== undefined ? '' : undefined}
      className="absolute inset-x-[3px] overflow-hidden rounded-[7px] px-2 py-1.5 text-[11px] leading-tight text-[#efe9dd] max-sm:text-[11.5px] transition-[background-color,box-shadow,top,height,opacity] duration-700 ease-expo"
      style={{
        ...(introAt !== undefined ? { animationDelay: `${introAt}s` } : {}),
        top: a.start * px + 1,
        height,
        background: bg,
        boxShadow: lit ? `inset 0 0 0 2px ${s.hue}, 0 0 0 4px ${s.hue}33, 0 0 40px -4px ${s.hue}` : `inset 0 0 0 1px ${edge}${stage === 'late' && colorBy === 'estado' ? ', 0 0 18px -4px #e5484d' : ''}`,
        opacity: dim ? 0.35 : 1,
        zIndex: lit ? 5 : undefined,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SERVICE[a.services[0]].hue }} />
        <span className="min-w-0 truncate font-medium">{a.client}</span>
        {fields.hints && (a.requested || a.note) && (
          <span className="shrink-0 text-[11px] text-white/60 max-sm:hidden" aria-hidden="true">{a.requested ? '☆' : ''}{a.note ? '✎' : ''}</span>
        )}
        {fields.type && (
          <span className="ml-auto shrink-0 rounded-full bg-black/35 px-1.5 py-[1px] text-[8.5px] font-semibold tracking-wide max-sm:text-[10px]" style={{ color: CLIENT[a.type] }}>
            {a.type}
          </span>
        )}
      </div>
      {medium && detail && <p className="mt-1 truncate text-white/60">{detail}</p>}
      {roomy && fields.time && <p className="mt-0.5 font-mono text-[11px] text-white/60 max-sm:text-[10.5px]">{time}</p>}
      {(fields.status || fields.next) && (medium || !detail) && (
        <div className={`flex items-center justify-between gap-1 ${medium ? 'absolute inset-x-2 bottom-1.5' : 'mt-1'}`}>
          {fields.status ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-1.5 py-[1px] text-[11px] max-sm:text-[10.5px]" style={{ color: s.hue }}>
              {stage === 'paid' ? '✓' : <span className="h-1 w-1 rounded-full" style={{ background: s.hue }} />}
              {s.label}
              {stage === 'paid' && fields.price ? ` US$ ${a.price}` : ''}
            </span>
          ) : (
            <span />
          )}
          {fields.next && s.next && <span className="font-medium text-white/90">{s.next}</span>}
        </div>
      )}
    </div>
  )
}

interface LiveCalendarProps {
  now: number
  colorBy?: ColorBy
  density?: Density
  style?: CardStyle
  fields?: CardFields
  /** Cuántos barberos mostrar (en el hub, menos) */
  columns?: number
  /** Segundos tras los que las citas caen en sus horas, una a una, al aparecer */
  intro?: number
  /** Cita resaltada: las demás se atenúan */
  focus?: string
  /** Cita resaltada sin atenuar las demás */
  highlight?: string
  className?: string
}

/** El día de una barbería, en vivo y personalizable. */
export function LiveCalendar({ now, colorBy = 'estado', density = 'normal', style = 'pastel', fields = ALL_FIELDS, columns = BARBERS.length, intro, focus, highlight, className = '' }: LiveCalendarProps) {
  const px = DENSITY_PX[density]
  // En el celular, dos barberos a buen tamaño en vez de todos apretados.
  const narrow = useNarrow()
  const cols = BARBERS.slice(0, narrow ? Math.min(columns, 2) : columns)
  const counts = cols.map((_, c) => APPTS.filter((a) => a.col === c && stageAt(a, now) !== 'paid').length)
  // Cuando el reloj vuelve a empezar el día, la línea de la hora no rebobina por toda la rejilla:
  // la de antes se desvanece donde estaba y la nueva aparece arriba (lap cambia la key de ambas).
  const [prevNow, setPrevNow] = useState(now)
  const [lap, setLap] = useState({ n: 0, from: now })
  if (now !== prevNow) {
    if (now < prevNow) setLap({ n: lap.n + 1, from: prevNow })
    setPrevNow(now)
  }
  const grid = { gridTemplateColumns: `3.4rem repeat(${cols.length}, minmax(0, 1fr))` }
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-[#141210] text-[#efe9dd] ${className}`}>
      <div className="grid border-b border-white/[0.07]" style={grid}>
        <span />
        {cols.map((b, c) => (
          <div key={b} className="relative border-l border-white/[0.06] px-2 py-2.5">
            <p className="truncate text-xs font-medium">{b}</p>
            <p className="truncate text-[11px] text-white/60 max-sm:text-[11px]">{counts[c] ? `${counts[c]} por atender` : 'Sin pendientes'}</p>
            <span key={lap.n} className="absolute inset-x-0 bottom-0 h-[2px] bg-[#d9b36a]/70 transition-[width] duration-700" style={{ width: `${Math.min(100, (now / HALF_HOURS) * 100)}%`, animation: lap.n ? 'bl-fade-in 0.7s ease both' : undefined }} />
          </div>
        ))}
      </div>
      <div className="relative grid transition-[height] duration-700 ease-expo" style={{ ...grid, height: HALF_HOURS * px }}>
        <div className="relative">
          {Array.from({ length: HALF_HOURS }, (_, i) => (
            <span key={i} className="absolute right-2 -translate-y-1/2 font-mono text-[11px] text-white/60 transition-[top] duration-700 max-sm:text-[10.5px]" style={{ top: i * px + (i === 0 ? 8 : 0) }}>
              {i % 2 === 0 || density === 'amplia' ? fmt(i) : ''}
            </span>
          ))}
        </div>
        {cols.map((b, c) => (
          <div key={b} className="relative border-l border-white/[0.06]">
            {Array.from({ length: HALF_HOURS }, (_, i) => (
              <span key={i} className="absolute inset-x-0 h-px bg-white/[0.045] transition-[top] duration-700" style={{ top: i * px }} />
            ))}
            {BLOCKS.filter((bl) => bl.col === c).map((bl) => (
              <div
                key={bl.start}
                className="absolute inset-x-[3px] rounded-[7px] px-2 py-1.5 text-[11px] text-white/55 transition-[top,height] max-sm:text-[11px] duration-700 ease-expo"
                style={{ top: bl.start * px, height: bl.len * px, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 6px, transparent 6px 12px)' }}
              >
                {bl.label}
              </div>
            ))}
            {APPTS.filter((a) => a.col === c).map((a) => (
              <Card
                key={a.client}
                a={a}
                now={now}
                colorBy={colorBy}
                style={style}
                fields={fields}
                px={px}
                narrow={narrow}
                dim={focus !== undefined && focus !== a.client}
                lit={focus === a.client || highlight === a.client}
                introAt={intro === undefined ? undefined : intro + a.start * 0.22 + c * 0.09}
              />
            ))}
          </div>
        ))}
        {lap.n > 0 && (
          <div key={`out-${lap.n}`} className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: lap.from * px, animation: 'bl-fade-out 0.6s ease both' }} aria-hidden="true">
            <span className="ml-0.5 rounded-full bg-[#e5484d] px-1.5 py-[1px] font-mono text-[11px] text-white max-sm:text-[10.5px]">{fmt(lap.from)}</span>
            <span className="h-px flex-1 bg-[#e5484d]" />
          </div>
        )}
        <div key={`now-${lap.n}`} className="pointer-events-none absolute inset-x-0 z-10 flex items-center transition-[top] duration-500 ease-linear" style={{ top: now * px, animation: lap.n ? 'bl-fade-in 0.7s ease 0.15s both' : undefined }}>
          <span className="ml-0.5 rounded-full bg-[#e5484d] px-1.5 py-[1px] font-mono text-[11px] text-white max-sm:text-[10.5px]">{fmt(now)}</span>
          <span className="h-px flex-1 bg-[#e5484d]" />
        </div>
      </div>
    </div>
  )
}

/** Versión para la tarjeta del hub: tres barberos, color por estado, en marcha. */
export function LiveCalendarCard() {
  const now = useCalendarClock(700, 1, 8.5)
  return (
    <div className="flex h-full items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_120%,rgba(217,179,106,0.3),transparent_60%)] px-6 pt-8 sm:pt-20">
      <LiveCalendar now={now} columns={3} density="compacta" className="w-full max-w-[560px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]" />
    </div>
  )
}
