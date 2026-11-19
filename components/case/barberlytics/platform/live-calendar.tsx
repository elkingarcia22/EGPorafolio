'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/*
 * Calendario en vivo: una réplica en código del día de Barberlytics (Thema · Premium oscuro).
 * La hora avanza y cada cita pasa por sus etapas reales —Agendada, Tarde, En espera, En silla,
 * Por cobrar, Cobrada— con el botón del siguiente paso que muestra la plataforma.
 * Se personaliza como en «Ajustes de la vista»: color por, densidad y qué muestra la tarjeta.
 */

export type ColorBy = 'estado' | 'servicio' | 'cliente' | 'neutral'
export type Density = 'compacta' | 'normal' | 'amplia'
export interface CardFields {
  type: boolean
  service: boolean
  price: boolean
  status: boolean
  next: boolean
}

export const ALL_FIELDS: CardFields = { type: true, service: true, price: true, status: true, next: true }

type Stage = 'upcoming' | 'late' | 'waiting' | 'seated' | 'toCollect' | 'paid'
type ClientType = 'VIP' | 'FRECUENTE' | 'RETENIDO' | 'NUEVO' | 'SIN CITA'
type Service = 'corte' | 'barba' | 'fade' | 'ritual'

interface Appt {
  col: number
  start: number // en medias horas desde las 11:00
  len: number
  client: string
  type: ClientType
  services: readonly Service[]
  price: number
  arrive: number // llegada relativa al inicio (en medias horas); > 0.17 = tarde
}

const BARBERS = ['Andrés', 'Emilio', 'Paola', 'Nicolás', 'Valeria'] as const
const HALF_HOURS = 10 // 11:00 → 4:00
const START_HOUR = 11

const APPTS: readonly Appt[] = [
  { col: 0, start: 0.5, len: 1, client: 'Emilio Torres', type: 'VIP', services: ['corte'], price: 32, arrive: -0.1 },
  { col: 0, start: 3, len: 2, client: 'Andrés Vargas', type: 'NUEVO', services: ['corte', 'barba'], price: 59, arrive: 0.4 },
  { col: 0, start: 6, len: 3, client: 'Diego Moreno', type: 'RETENIDO', services: ['ritual'], price: 117, arrive: 0 },
  { col: 1, start: 0, len: 2, client: 'Mariana Ramírez', type: 'RETENIDO', services: ['corte', 'barba'], price: 59, arrive: -0.1 },
  { col: 1, start: 2.5, len: 1.5, client: 'Gael Rodríguez', type: 'FRECUENTE', services: ['fade'], price: 45, arrive: 0 },
  { col: 1, start: 5, len: 2, client: 'Marcela Pérez', type: 'NUEVO', services: ['fade'], price: 41, arrive: 0.1 },
  { col: 2, start: 1, len: 1, client: 'Sebastián Ruiz', type: 'SIN CITA', services: ['corte'], price: 32, arrive: 0 },
  { col: 2, start: 4, len: 2, client: 'Paula Rodríguez', type: 'NUEVO', services: ['corte', 'barba'], price: 80, arrive: 0.5 },
  { col: 3, start: 0, len: 1.5, client: 'Elena Jiménez', type: 'VIP', services: ['fade'], price: 30, arrive: -0.2 },
  { col: 3, start: 2, len: 2, client: 'Mateo Cárdenas', type: 'RETENIDO', services: ['corte', 'barba'], price: 69, arrive: 0.05 },
  { col: 3, start: 6.5, len: 1.5, client: 'Renata Hernández', type: 'VIP', services: ['fade'], price: 45, arrive: 0 },
  { col: 4, start: 0.5, len: 2, client: 'Valentina Ochoa', type: 'FRECUENTE', services: ['corte', 'barba'], price: 65, arrive: 0 },
  { col: 4, start: 3.5, len: 1, client: 'Nicolás Prieto', type: 'FRECUENTE', services: ['corte'], price: 32, arrive: 0.3 },
  { col: 4, start: 5.5, len: 2, client: 'Santiago León', type: 'RETENIDO', services: ['ritual'], price: 63, arrive: 0 },
]

/** Bloqueos: el almuerzo de Andrés y la tarde libre de Paola (fuera de horario). */
const BLOCKS = [
  { col: 0, start: 4.5, len: 1.5, label: 'Almuerzo' },
  { col: 2, start: 7, len: 3, label: '' },
] as const

const SEAT_AFTER = 0.25 // de llegar a sentarse
const PAY_AFTER = 0.35 // de terminar a cobrar

function stageAt(a: Appt, now: number): Stage {
  const arrived = a.start + a.arrive
  if (now < arrived) return now > a.start + 0.17 ? 'late' : 'upcoming'
  const seated = Math.max(arrived + SEAT_AFTER, a.start)
  if (now < seated) return 'waiting'
  const end = seated + a.len
  if (now < end) return 'seated'
  if (now < end + PAY_AFTER) return 'toCollect'
  return 'paid'
}

/* Tonos de la plataforma (STAGE_TONE): tarde negativo, por cobrar advertencia, en espera info,
   en silla primario, agendada neutro, cobrada positivo. */
const STAGE: Record<Stage, { label: string; next: string | null; bg: string; edge: string; pill: string }> = {
  upcoming: { label: 'Agendada', next: 'Ingresar', bg: '#1f2a44', edge: '#3d5180', pill: '#7d93c9' },
  late: { label: 'Tarde', next: 'Llamar', bg: '#3d1a1e', edge: '#a8383f', pill: '#ff8a8e' },
  waiting: { label: 'En espera', next: 'Sentar', bg: '#173a4a', edge: '#2e7f9c', pill: '#6cc6e6' },
  seated: { label: 'En silla', next: 'Cobrar', bg: '#43351a', edge: '#b58a3a', pill: '#e9c27a' },
  toCollect: { label: 'Por cobrar', next: 'Cobrar', bg: '#4a3410', edge: '#d18b1f', pill: '#f2b14d' },
  paid: { label: 'Cobrada', next: null, bg: '#123526', edge: '#2a8a5c', pill: '#5fd39a' },
}

const SERVICE: Record<Service, { name: string; dot: string; bg: string }> = {
  corte: { name: 'Corte clásico', dot: '#5b8def', bg: '#1d2b4a' },
  barba: { name: 'Arreglo de barba', dot: '#b07ad6', bg: '#33234a' },
  fade: { name: 'Fade', dot: '#3fae7c', bg: '#173a2c' },
  ritual: { name: 'Ritual premium', dot: '#e0b44a', bg: '#3f3216' },
}

const CLIENT: Record<ClientType, string> = { VIP: '#e0b44a', FRECUENTE: '#3fae7c', RETENIDO: '#5b8def', NUEVO: '#8b8f98', 'SIN CITA': '#e8743b' }
const CLIENT_BG: Record<ClientType, string> = { VIP: '#3f3216', FRECUENTE: '#173a2c', RETENIDO: '#1d2b4a', NUEVO: '#2a2c31', 'SIN CITA': '#43261a' }

export const DENSITY_PX: Record<Density, number> = { compacta: 30, normal: 40, amplia: 54 }

const fmt = (halfHours: number) => {
  const total = START_HOUR * 60 + Math.round(halfHours * 30)
  const h = Math.floor(total / 60)
  const m = total % 60
  const h12 = h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')}`
}

/** La hora avanza sola (≈ 5 min por paso) y vuelve a empezar. */
export function useCalendarClock(stepMs = 600, from = 0.2, to = HALF_HOURS - 0.6) {
  const { reducedMotion } = useA11y()
  const [now, setNow] = useState(3.1)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setNow((n) => (n + 1 / 6 > to ? from : n + 1 / 6)), stepMs)
    return () => window.clearInterval(id)
  }, [reducedMotion, stepMs, from, to])
  return now
}

interface LiveCalendarProps {
  now: number
  colorBy?: ColorBy
  density?: Density
  fields?: CardFields
  /** Cuántos barberos mostrar (en el hub, menos) */
  columns?: number
  className?: string
}

function Card({ a, now, colorBy, fields, px }: { a: Appt; now: number; colorBy: ColorBy; fields: CardFields; px: number }) {
  const stage = stageAt(a, now)
  const s = STAGE[stage]
  const bg = colorBy === 'estado' ? s.bg : colorBy === 'servicio' ? SERVICE[a.services[0]].bg : colorBy === 'cliente' ? CLIENT_BG[a.type] : '#26282d'
  const edge = colorBy === 'estado' ? s.edge : 'rgba(255,255,255,0.08)'
  const tall = a.len * px >= 64
  return (
    <div
      className="absolute inset-x-[3px] overflow-hidden rounded-[7px] px-2 py-1.5 text-[10.5px] leading-tight text-[#efe9dd] transition-[background-color,box-shadow,top,height] duration-700 ease-expo"
      style={{ top: a.start * px + 1, height: a.len * px - 2, background: bg, boxShadow: `inset 0 0 0 1px ${edge}${stage === 'late' && colorBy === 'estado' ? ', 0 0 18px -4px #e5484d' : ''}` }}
    >
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SERVICE[a.services[0]].dot }} />
        <span className="truncate font-medium">{a.client}</span>
        {fields.type && (
          <span className="ml-auto shrink-0 rounded-full px-1.5 py-[1px] text-[8.5px] font-semibold tracking-wide" style={{ background: 'rgba(0,0,0,0.35)', color: CLIENT[a.type] }}>
            {a.type}
          </span>
        )}
      </div>
      {fields.service && tall && (
        <p className="mt-1 truncate text-white/55">
          {a.services.map((sv) => SERVICE[sv].name).join(' + ')}
          {fields.price ? ` · US$ ${a.price}` : ''}
        </p>
      )}
      {(fields.status || fields.next) && a.len * px >= 44 && (
        <div className="absolute inset-x-2 bottom-1.5 flex items-center justify-between gap-1">
          {fields.status ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-1.5 py-[1px] text-[9px]" style={{ color: s.pill }}>
              {stage === 'paid' ? '✓' : <span className="h-1 w-1 rounded-full" style={{ background: s.pill }} />}
              {s.label}{stage === 'paid' && fields.price ? ` US$ ${a.price}` : ''}
            </span>
          ) : <span />}
          {fields.next && s.next && <span className="font-medium text-white/90">{s.next}</span>}
        </div>
      )}
    </div>
  )
}

/** El día de una barbería, en vivo y personalizable. */
export function LiveCalendar({ now, colorBy = 'estado', density = 'normal', fields = ALL_FIELDS, columns = BARBERS.length, className = '' }: LiveCalendarProps) {
  const px = DENSITY_PX[density]
  const cols = BARBERS.slice(0, columns)
  const counts = cols.map((_, c) => APPTS.filter((a) => a.col === c && stageAt(a, now) !== 'paid').length)
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-[#141210] text-[#efe9dd] ${className}`}>
      <div className="grid border-b border-white/[0.07]" style={{ gridTemplateColumns: `3.4rem repeat(${cols.length}, minmax(0, 1fr))` }}>
        <span />
        {cols.map((b, c) => (
          <div key={b} className="relative border-l border-white/[0.06] px-2 py-2.5">
            <p className="truncate text-xs font-medium">{b}</p>
            <p className="truncate text-[10px] text-white/45">{counts[c] ? `${counts[c]} por atender` : 'Sin pendientes'}</p>
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#d9b36a]/70 transition-[width] duration-700" style={{ width: `${Math.min(100, (now / HALF_HOURS) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="relative grid transition-[height] duration-700 ease-expo" style={{ gridTemplateColumns: `3.4rem repeat(${cols.length}, minmax(0, 1fr))`, height: HALF_HOURS * px }}>
        <div className="relative">
          {Array.from({ length: HALF_HOURS }, (_, i) => (
            <span key={i} className="absolute right-2 -translate-y-1/2 font-mono text-[9px] text-white/35 transition-[top] duration-700" style={{ top: i * px + (i === 0 ? 8 : 0) }}>
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
                className="absolute inset-x-[3px] rounded-[7px] px-2 py-1.5 text-[10px] text-white/55 transition-[top,height] duration-700 ease-expo"
                style={{ top: bl.start * px, height: bl.len * px, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 6px, transparent 6px 12px)' }}
              >
                {bl.label}
              </div>
            ))}
            {APPTS.filter((a) => a.col === c).map((a) => (
              <Card key={a.client} a={a} now={now} colorBy={colorBy} fields={fields} px={px} />
            ))}
          </div>
        ))}
        {/* La línea de ahora */}
        <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center transition-[top] duration-500 ease-linear" style={{ top: now * px }}>
          <span className="ml-0.5 rounded-full bg-[#e5484d] px-1.5 py-[1px] font-mono text-[9px] text-white">{fmt(now)}</span>
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
    <div className="flex h-full items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_120%,rgba(217,179,106,0.3),transparent_60%)] px-6 pt-8">
      <LiveCalendar now={now} columns={3} density="compacta" className="w-full max-w-[560px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]" />
    </div>
  )
}
