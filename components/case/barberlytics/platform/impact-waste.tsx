'use client'

import { useRef } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useAutoSteps } from './use-auto-steps'

const GOLD = '#d9b36a'
const PAIN = '#ff6b72'
const GAIN = '#4cc98d'
const FAINT = 'rgba(255,255,255,0.12)'

interface Strip {
  /** Cifra real del caso */
  value: string
  title: L
  /** Cuántas piezas dibuja y cuántas cambian: la cifra, a escala */
  total: number
  changed: number
  before: L
  after: L
  /** Cómo se ve cada pieza antes y después de cambiar */
  kind: 'noshow' | 'gap' | 'unpaid'
}

const M = PLATFORM_CASE.impact.metrics
const STRIPS: readonly Strip[] = [
  {
    value: M[1].value,
    title: { es: 'Citas perdidas porque no vinieron', en: 'Visits lost to no-shows' },
    total: 9,
    changed: 2,
    before: { es: 'no vino', en: 'no-show' },
    after: { es: 'confirmó a tiempo', en: 'confirmed in time' },
    kind: 'noshow',
  },
  {
    value: M[2].value,
    title: { es: 'Huecos que antes quedaban vacíos', en: 'Gaps that used to stay empty' },
    total: 16,
    changed: 3,
    before: { es: 'hueco vacío', en: 'empty gap' },
    after: { es: 'llenado desde la lista de espera', en: 'filled from the waitlist' },
    kind: 'gap',
  },
  {
    value: M[3].value,
    title: { es: 'Citas sin cobrar al cerrar el día', en: 'Unpaid visits at closing time' },
    total: 5,
    changed: 3,
    before: { es: 'sin cobrar', en: 'unpaid' },
    after: { es: 'cobrada', en: 'paid' },
    kind: 'unpaid',
  },
]

/** Una pieza de la tira: cambia de «antes» a «ahora» con un pequeño retraso propio */
function Piece({ kind, changed, delay }: { kind: Strip['kind']; changed: boolean; delay: number }) {
  const base = 'block h-7 rounded-md transition-all duration-700 ease-expo'
  const style = { transitionDelay: `${delay}ms` }
  if (kind === 'noshow')
    return <span className={`${base} w-7 border`} style={{ ...style, borderColor: changed ? GAIN : PAIN, background: changed ? `${GAIN}33` : `${PAIN}22` }} />
  if (kind === 'gap')
    return (
      <span
        className={`${base} w-5`}
        style={{ ...style, background: changed ? GOLD : 'transparent', boxShadow: changed ? `0 0 14px ${GOLD}88` : `inset 0 0 0 1px ${FAINT}`, backgroundImage: changed ? undefined : 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px)' }}
      />
    )
  return <span className={`${base} w-10 border`} style={{ ...style, borderColor: changed ? 'rgba(255,255,255,0.15)' : PAIN, background: changed ? 'transparent' : `${PAIN}1f`, opacity: changed ? 0.35 : 1 }} />
}

/**
 * Impacto · lo que se desperdiciaba: tres tiras, cada una dibuja su cifra a
 * escala. Primero se ven como antes (rojo, vacío, sin cobrar) y luego cambian
 * solas a como quedan con el calendario.
 */
export function WasteStrips() {
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  // 0 nada · 1 antes · 2 ahora
  const step = useAutoSteps(rootRef, 2, 1400, 300)

  return (
    <div ref={rootRef} className="mx-auto max-w-[860px] space-y-12">
      {STRIPS.map((s, si) => (
        <figure key={s.kind} className={`grid items-center gap-x-8 gap-y-4 transition-opacity duration-700 sm:grid-cols-[9rem_1fr] ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${si * 150}ms` }}>
          <p className="text-[clamp(2.2rem,1.5rem+2.4vw,3.6rem)] font-light leading-none tabular-nums" style={{ color: step >= 2 ? undefined : 'rgba(255,255,255,0.25)', transition: 'color 700ms' }}>
            {s.value}
          </p>
          <div>
            <figcaption className="mb-3 text-[15px] text-paper/80">{t(s.title)}</figcaption>
            <div className="flex flex-wrap gap-1.5" aria-hidden="true">
              {Array.from({ length: s.total }, (_, i) => (
                <Piece key={i} kind={s.kind} changed={step >= 2 && i < s.changed} delay={si * 250 + i * 70} />
              ))}
            </div>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-paper/45">
              <span><span className="mr-1.5 inline-block h-2 w-2 rounded-sm align-middle" style={{ background: s.kind === 'gap' ? FAINT : PAIN }} />{t(s.before)}</span>
              <span><span className="mr-1.5 inline-block h-2 w-2 rounded-sm align-middle" style={{ background: s.kind === 'gap' ? GOLD : s.kind === 'noshow' ? GAIN : 'rgba(255,255,255,0.3)' }} />{t(s.after)}</span>
            </p>
          </div>
        </figure>
      ))}
      <p className="text-center font-mono text-[10.5px] text-paper/35">{t({ es: 'Cifras de referencia del caso, dibujadas a escala', en: 'Reference figures for the case, drawn to scale' })}</p>
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
    <div ref={rootRef} className="mx-auto max-w-[880px]">
      <ol className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        {METRICS.map((m, i) => {
          const on = i < shown
          return (
            <li key={m.name.es} className={`relative flex flex-col items-center text-center transition-[opacity,transform] duration-700 ease-expo ${on ? 'opacity-100' : 'translate-y-3 opacity-0'}`}>
              <svg viewBox="0 0 60 44" className="w-24" aria-hidden="true"><Glyph kind={m.glyph} on={on} /></svg>
              <span className="mt-3 max-w-[16ch] text-balance text-[13px] leading-snug text-paper/70">{t(m.name)}</span>
              {i === METRICS.length - 1 && <span data-fiber-from="pl-demo" className="absolute -bottom-6 left-1/2 h-px w-px" />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
