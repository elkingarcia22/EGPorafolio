'use client'

import { useRef } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useAutoSteps } from './use-auto-steps'
import { useNarrow } from '../use-narrow'

const GOLD = '#d9b36a'
const PAIN = '#ff6b72'
const GAIN = '#4cc98d'
const FAINT = 'rgba(255,255,255,0.12)'
const EASE = 'transition-all duration-700 ease-expo'

const { metrics, booking } = PLATFORM_CASE.impact

interface Figure {
  id: 'time' | 'taps' | 'noshow' | 'gaps' | 'unpaid'
  value: string
  label: L
}

/** Las cinco cifras del caso, cada una con su nombre corto */
const FIGURES: readonly Figure[] = [
  { id: 'time', value: `${booking.after} s`, label: { es: `para agendar · antes ${booking.before}`, en: `to book · was ${booking.before}` } },
  { id: 'taps', value: metrics[0].value, label: { es: 'toques por cita · antes 9', en: 'taps per visit · was 9' } },
  { id: 'noshow', value: metrics[1].value, label: { es: 'inasistencias', en: 'no-shows' } },
  { id: 'gaps', value: metrics[2].value, label: { es: 'huecos llenados', en: 'gaps filled' } },
  { id: 'unpaid', value: metrics[3].value, label: { es: 'sin cobrar al cierre', en: 'unpaid at close' } },
]

/** El dibujito de cada cifra: se ve «antes» y pasa solo a «ahora» (a escala de la cifra) */
function Mini({ id, now }: { id: Figure['id']; now: boolean }) {
  switch (id) {
    case 'time':
      return (
        <g>
          <rect x={4} y={10} width={72} height={6} rx={3} fill="rgba(255,255,255,0.28)" />
          <rect x={4} y={24} width={now ? 72 * (booking.after / booking.before) : 0} height={6} rx={3} fill={GOLD} className={EASE} style={{ transitionDuration: '1200ms' }} />
        </g>
      )
    case 'taps':
      return (
        <g>
          {Array.from({ length: 9 }, (_, i) => {
            const g = Math.floor(i / 3)
            const cx = now ? 16 + g * 24 : 6 + i * 8.5
            return <circle key={i} cx={cx} cy={20} r={now ? (i % 3 === 1 ? 5 : 0) : 2.6} fill={now ? GOLD : 'rgba(255,255,255,0.45)'} className={EASE} style={{ transitionDelay: `${g * 80}ms` }} />
          })}
        </g>
      )
    case 'noshow':
      return <g>{Array.from({ length: 9 }, (_, i) => <rect key={i} x={4 + i * 8} y={14} width={6} height={12} rx={1.5} fill={now && i < 2 ? GAIN : PAIN} opacity={now && i < 2 ? 1 : 0.7} className={EASE} style={{ transitionDelay: `${i * 60}ms` }} />)}</g>
    case 'gaps':
      return <g>{Array.from({ length: 16 }, (_, i) => <rect key={i} x={4 + i * 4.5} y={12} width={3} height={16} rx={1} fill={now && i < 3 ? GOLD : FAINT} className={EASE} style={{ transitionDelay: `${i * 40}ms` }} />)}</g>
    case 'unpaid':
      return <g>{Array.from({ length: 5 }, (_, i) => <rect key={i} x={6 + i * 14} y={13} width={11} height={14} rx={2} fill="none" stroke={PAIN} strokeWidth={1.4} opacity={now && i < 3 ? 0.12 : 0.85} className={EASE} style={{ transitionDelay: `${i * 90}ms` }} />)}</g>
  }
}

/**
 * Impacto en una sola fila: cinco cifras, cada una con un dibujo que pasa solo
 * de «antes» a «ahora». Debajo, lo que el calendario mide.
 */
export function ImpactFigures() {
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  // 0 nada · 1 antes · 2 ahora
  const step = useAutoSteps(rootRef, 2, 1100, 300)
  const narrow = useNarrow('(max-width: 767px)')

  if (narrow) {
    return (
      <div ref={rootRef} className="mx-auto max-w-[420px]">
        {/* En teléfono, una cifra por renglón sobre una fibra que baja: el número grande, su dibujo al lado */}
        <ol className="relative">
          <span aria-hidden="true" className="absolute bottom-6 left-[6px] top-6 w-px origin-top bg-gradient-to-b from-[#d9b36a]/70 via-white/20 to-[#4cc98d]/60 transition-transform duration-[1600ms] ease-[cubic-bezier(.65,0,.35,1)]" style={{ transform: `scaleY(${step >= 1 ? 1 : 0})` }} />
          {FIGURES.map((f, i) => (
            <li
              key={f.id}
              className={`relative grid grid-cols-[14px_minmax(0,1fr)_88px] items-center gap-x-5 border-b border-white/[0.06] py-6 last:border-b-0 transition-[opacity,transform] duration-700 ease-expo ${step >= 1 ? 'opacity-100' : 'translate-y-3 opacity-0'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span aria-hidden="true" className="relative h-3.5 w-3.5 rounded-full border transition-all duration-700" style={{ borderColor: step >= 2 ? GOLD : 'rgba(255,255,255,0.35)', background: step >= 2 ? '#fffaf0' : 'rgb(var(--void))', boxShadow: step >= 2 ? '0 0 14px 3px rgba(217,179,106,0.55)' : undefined, transitionDelay: `${300 + i * 120}ms` }} />
              <span className="flex flex-col">
                <span className="text-[44px] font-light leading-none tabular-nums" style={{ color: step >= 2 ? undefined : 'rgba(255,255,255,0.3)', transition: 'color 700ms' }}>{f.value}</span>
                <span className="mt-2 text-[14px] leading-snug text-paper/70">{t(f.label)}</span>
              </span>
              <svg viewBox="0 0 80 40" className="w-full" aria-hidden="true"><Mini id={f.id} now={step >= 2} /></svg>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-center font-mono text-[12px] text-paper/55">{t({ es: 'Cifras de referencia del caso', en: 'Reference figures for the case' })}</p>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-[1040px]">
      <ol className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {FIGURES.map((f, i) => (
          <li key={f.id} className={`flex flex-col items-center text-center transition-[opacity,transform] duration-700 ease-expo ${step >= 1 ? 'opacity-100' : 'translate-y-3 opacity-0'}`} style={{ transitionDelay: `${i * 90}ms` }}>
            <svg viewBox="0 0 80 40" className="w-24" aria-hidden="true"><Mini id={f.id} now={step >= 2} /></svg>
            <span className="mt-4 text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] font-light leading-none tabular-nums" style={{ color: step >= 2 ? undefined : 'rgba(255,255,255,0.3)', transition: 'color 700ms' }}>{f.value}</span>
            <span className="mt-3 max-w-[16ch] text-balance text-[14px] leading-snug text-paper/75">{t(f.label)}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center font-mono text-[12px] text-paper/55">{t({ es: 'Cifras de referencia del caso', en: 'Reference figures for the case' })}</p>
    </div>
  )
}

/* ── Lo que el calendario mide ────────────────────────────────────────── */

interface Metric {
  name: L
  glyph: 'bars' | 'ring' | 'heat' | 'dots' | 'flame' | 'split' | 'line' | 'chairs'
}

/** Lo que sale del mismo calendario: del resumen del día, la semana y el mes de la plataforma */
const METRICS: readonly Metric[] = [
  { name: { es: 'Citas frente a lo usual', en: 'Visits versus usual' }, glyph: 'bars' },
  { name: { es: 'Ocupación de cada silla', en: 'Each chair’s occupancy' }, glyph: 'chairs' },
  { name: { es: 'Canceladas y no vino', en: 'Canceled and no-shows' }, glyph: 'dots' },
  { name: { es: 'Del día frente a lo cobrado', en: 'Day total versus collected' }, glyph: 'split' },
  { name: { es: 'Horas libres', en: 'Free hours' }, glyph: 'line' },
  { name: { es: 'Días que suelen pesar', en: 'Usually heavy days' }, glyph: 'flame' },
  { name: { es: 'Ocupación del mes', en: 'Month occupancy' }, glyph: 'heat' },
  { name: { es: 'VIP y clientes nuevos', en: 'VIPs and new clients' }, glyph: 'ring' },
]

function Glyph({ kind, on }: { kind: Metric['glyph']; on: boolean }) {
  const t = 'transition-all duration-700 ease-expo'
  switch (kind) {
    case 'bars':
      return <g>{[18, 26, 14, 30].map((h, i) => <rect key={i} x={8 + i * 12} y={on ? 36 - h : 36} width={8} height={on ? h : 0} rx={1.5} fill={i === 3 ? GOLD : 'rgba(255,255,255,0.35)'} className={t} style={{ transitionDelay: `${i * 80}ms` }} />)}</g>
    case 'chairs':
      return <g>{[0.85, 0.5, 0.7].map((f, i) => <g key={i}><rect x={8} y={8 + i * 10} width={44} height={5} rx={2.5} fill={FAINT} /><rect x={8} y={8 + i * 10} width={on ? 44 * f : 0} height={5} rx={2.5} fill={GOLD} className={t} style={{ transitionDelay: `${i * 100}ms` }} /></g>)}</g>
    case 'dots':
      return <g>{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={10 + (i % 5) * 10} cy={14 + Math.floor(i / 5) * 12} r={3.5} fill={on && (i === 3 || i === 7) ? PAIN : 'rgba(255,255,255,0.3)'} className={t} style={{ transitionDelay: `${i * 50}ms` }} />)}</g>
    case 'split':
      return <g><rect x={8} y={12} width={44} height={7} rx={3.5} fill="rgba(255,255,255,0.3)" /><rect x={8} y={24} width={on ? 36 : 0} height={7} rx={3.5} fill={GAIN} className={t} /></g>
    case 'line':
      return <g><rect x={6} y={18} width={48} height={8} rx={2} fill="rgba(255,255,255,0.25)" />{[14, 34].map((x, i) => <rect key={x} x={x} y={18} width={on ? 8 : 0} height={8} fill="#0d0b09" stroke={GOLD} strokeDasharray="2 2" className={t} style={{ transitionDelay: `${i * 150}ms` }} />)}</g>
    case 'flame':
      return <g>{[12, 16, 14, 22, 28, 30, 10].map((h, i) => <rect key={i} x={6 + i * 7.2} y={36 - h} width={5} height={h} rx={1.5} fill={on && i >= 4 && i <= 5 ? GOLD : 'rgba(255,255,255,0.3)'} className={t} />)}</g>
    case 'heat':
      return <g>{Array.from({ length: 21 }, (_, i) => <rect key={i} x={6 + (i % 7) * 7} y={8 + Math.floor(i / 7) * 9} width={6} height={7} rx={1} fill={GOLD} opacity={on ? 0.15 + ((i * 41) % 9) / 10 : 0.06} className={t} style={{ transitionDelay: `${i * 25}ms` }} />)}</g>
    case 'ring':
      return <g><circle cx={30} cy={22} r={13} fill="none" stroke={FAINT} strokeWidth={5} /><circle cx={30} cy={22} r={13} fill="none" stroke={GOLD} strokeWidth={5} pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0.7 : 1} transform="rotate(-90 30 22)" className={t} /></g>
  }
}

/**
 * Impacto · lo que el calendario mide: no una cifra, ocho. Cada una con un
 * dibujo que se llena solo al entrar. De la última baja la fibra a «Demo».
 */
export function CalendarMetrics() {
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const shown = useAutoSteps(rootRef, METRICS.length, 140, 300)

  return (
    <div ref={rootRef} className="mx-auto mt-[clamp(4rem,3rem+3vw,6rem)] max-w-[1040px]">
      <p className="mono-label mb-10 text-center text-signal">{t({ es: 'Y todo lo que el calendario mide', en: 'And everything the calendar measures' })}</p>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
        {METRICS.map((m, i) => {
          const on = i < shown
          return (
            <li key={m.name.es} className={`relative flex flex-col items-center text-center transition-[opacity,transform] duration-700 ease-expo rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-5 md:px-5 md:py-7 ${on ? 'opacity-100' : 'translate-y-3 opacity-0'}`}>
              <svg viewBox="0 0 60 44" className="w-20" aria-hidden="true"><Glyph kind={m.glyph} on={on} /></svg>
              <span className="mt-3 max-w-[16ch] text-balance text-[15px] leading-snug text-paper/85">{t(m.name)}</span>
              {i === METRICS.length - 1 && <span data-fiber-from="pl-demo" className="absolute -bottom-6 left-1/2 h-px w-px" />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
