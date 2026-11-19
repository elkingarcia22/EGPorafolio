'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/*
 * Modelo del calendario en vivo: una réplica del día de Barberlytics (Thema · Premium oscuro).
 * La hora avanza y cada cita pasa por sus etapas reales —Agendada, Tarde, En espera, En silla,
 * Por cobrar, Cobrada— con el botón del siguiente paso que muestra la plataforma.
 */

export type ColorBy = 'estado' | 'servicio' | 'cliente' | 'neutral'
export type Density = 'compacta' | 'normal' | 'amplia'
export type CardStyle = 'pastel' | 'vivo'

/** «Qué muestra la tarjeta» y «Avisos con icono», como en Ajustes de la vista. */
export interface CardFields {
  type: boolean
  service: boolean
  price: boolean
  time: boolean
  status: boolean
  next: boolean
  hints: boolean
}

export const ALL_FIELDS: CardFields = { type: true, service: true, price: true, time: false, status: true, next: true, hints: true }

export type Stage = 'upcoming' | 'late' | 'waiting' | 'seated' | 'toCollect' | 'paid'
export type ClientType = 'VIP' | 'FRECUENTE' | 'RETENIDO' | 'NUEVO' | 'SIN CITA'
export type Service = 'corte' | 'barba' | 'fade' | 'ritual'

export interface Appt {
  col: number
  start: number // en medias horas desde las 11:00
  len: number
  client: string
  type: ClientType
  services: readonly Service[]
  price: number
  arrive: number // llegada relativa al inicio (en medias horas); > 0.17 = tarde
  note?: boolean
  requested?: boolean
}

export const BARBERS = ['Andrés', 'Emilio', 'Paola', 'Nicolás', 'Valeria'] as const
export const HALF_HOURS = 10 // 11:00 → 4:00
const START_HOUR = 11

export const APPTS: readonly Appt[] = [
  { col: 0, start: 0.5, len: 1, client: 'Emilio Torres', type: 'VIP', services: ['corte'], price: 32, arrive: -0.1, requested: true },
  { col: 0, start: 3, len: 2, client: 'Andrés Vargas', type: 'NUEVO', services: ['corte', 'barba'], price: 59, arrive: 0.4 },
  { col: 0, start: 6, len: 3, client: 'Diego Moreno', type: 'RETENIDO', services: ['ritual'], price: 117, arrive: 0, note: true },
  { col: 1, start: 0, len: 2, client: 'Mariana Ramírez', type: 'RETENIDO', services: ['corte', 'barba'], price: 59, arrive: -0.1, note: true, requested: true },
  { col: 1, start: 2.5, len: 1.5, client: 'Gael Rodríguez', type: 'FRECUENTE', services: ['fade'], price: 45, arrive: 0 },
  { col: 1, start: 5, len: 2, client: 'Marcela Pérez', type: 'NUEVO', services: ['fade'], price: 41, arrive: 0.1 },
  { col: 2, start: 1, len: 1, client: 'Sebastián Ruiz', type: 'SIN CITA', services: ['corte'], price: 32, arrive: 0 },
  { col: 2, start: 4, len: 2, client: 'Paula Rodríguez', type: 'NUEVO', services: ['corte', 'barba'], price: 80, arrive: 0.5 },
  { col: 3, start: 0, len: 1.5, client: 'Elena Jiménez', type: 'VIP', services: ['fade'], price: 30, arrive: -0.2, requested: true },
  { col: 3, start: 2, len: 2, client: 'Mateo Cárdenas', type: 'RETENIDO', services: ['corte', 'barba'], price: 69, arrive: 0.05 },
  { col: 3, start: 6.5, len: 1.5, client: 'Renata Hernández', type: 'VIP', services: ['fade'], price: 45, arrive: 0, note: true },
  { col: 4, start: 0.5, len: 2, client: 'Valentina Ochoa', type: 'FRECUENTE', services: ['corte', 'barba'], price: 65, arrive: 0 },
  { col: 4, start: 3.5, len: 1, client: 'Nicolás Prieto', type: 'FRECUENTE', services: ['corte'], price: 32, arrive: 0.3, requested: true },
  { col: 4, start: 5.5, len: 2, client: 'Santiago León', type: 'RETENIDO', services: ['ritual'], price: 63, arrive: 0 },
]

/** Bloqueos: el almuerzo de Andrés y la tarde libre de Paola (fuera de horario). */
export const BLOCKS = [
  { col: 0, start: 5, len: 1, label: 'Almuerzo' },
  { col: 2, start: 7, len: 3, label: '' },
] as const

const SEAT_AFTER = 0.25
const PAY_AFTER = 0.35

export function stageAt(a: Appt, now: number): Stage {
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
export const STAGE: Record<Stage, { label: string; next: string | null; hue: string }> = {
  upcoming: { label: 'Agendada', next: 'Ingresar', hue: '#6f86c4' },
  late: { label: 'Tarde', next: 'Llamar', hue: '#ff6b72' },
  waiting: { label: 'En espera', next: 'Sentar', hue: '#4fb8dc' },
  seated: { label: 'En silla', next: 'Cobrar', hue: '#e0b44a' },
  toCollect: { label: 'Por cobrar', next: 'Cobrar', hue: '#f2a03a' },
  paid: { label: 'Cobrada', next: null, hue: '#4cc98d' },
}

export const SERVICE: Record<Service, { name: string; hue: string }> = {
  corte: { name: 'Corte clásico', hue: '#5b8def' },
  barba: { name: 'Arreglo de barba', hue: '#b07ad6' },
  fade: { name: 'Fade', hue: '#3fae7c' },
  ritual: { name: 'Ritual premium', hue: '#e0b44a' },
}

export const CLIENT: Record<ClientType, string> = { VIP: '#e0b44a', FRECUENTE: '#3fae7c', RETENIDO: '#5b8def', NUEVO: '#9a9ea8', 'SIN CITA': '#e8743b' }

/** Color de la tarjeta según «Colorear tarjetas por» y el estilo (pastel o vivo). */
export function cardHue(a: Appt, stage: Stage, colorBy: ColorBy): string | null {
  if (colorBy === 'estado') return STAGE[stage].hue
  if (colorBy === 'servicio') return SERVICE[a.services[0]].hue
  if (colorBy === 'cliente') return CLIENT[a.type]
  return null
}

export const DENSITY_PX: Record<Density, number> = { compacta: 30, normal: 42, amplia: 58 }

export function fmt(halfHours: number): string {
  const total = START_HOUR * 60 + Math.round(halfHours * 30)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}`
}

/** La hora avanza sola (≈ 5 min por paso) y vuelve a empezar. */
export function useCalendarClock(stepMs = 600, from = 0.2, to = HALF_HOURS - 0.6, start = 3.1) {
  const { reducedMotion } = useA11y()
  const [now, setNow] = useState(start)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setNow((n) => (n + 1 / 6 > to ? from : n + 1 / 6)), stepMs)
    return () => window.clearInterval(id)
  }, [reducedMotion, stepMs, from, to])
  return now
}
