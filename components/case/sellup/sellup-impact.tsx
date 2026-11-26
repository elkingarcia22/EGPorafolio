'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { usePhone } from './camera'
import { useSwipe } from '@/components/case/kit/use-swipe'

/**
 * Escenario de referencia por vendedor y por semana. Todavía no hay medición
 * de antes y después: con las cifras reales, solo cambian estos valores.
 */
const WEEK_H = 40
const SCENARIO = {
  before: { companies: 6, contacts: 5, leads: 10, success: 18 },
  after: { companies: 1.5, contacts: 1, leads: 25, success: 30 },
} as const
type Phase = keyof typeof SCENARIO

/** Cada cuánto cambia solo de «Antes» a «Con SellUp» y de vuelta (ms) */
const SWITCH_MS = 4200
/** Si la persona elige uno, se queda esto antes de seguir solo (ms) */
const RESUME_MS = 9000
/** Los espacios del pictograma de leads (el máximo del escenario) */
const LEAD_SLOTS = 25

const PHASES: readonly { id: Phase; label: L }[] = [
  { id: 'before', label: { es: 'Antes', en: 'Before' } },
  { id: 'after', label: { es: 'Con SellUp', en: 'With SellUp' } },
]

/** Un número que corre suave hacia su valor nuevo */
function useTween(value: number, ms = 900): number {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - k, 3)
      const v = a + (value - a) * eased
      from.current = v
      setShown(v)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return shown
}

/**
 * 06 · Impacto: la semana de un vendedor. Una barra de 40 horas que pasa sola
 * de «Antes» a «Con SellUp»: buscar empresas y buscar contactos se encogen y
 * crece el tiempo para vender. Debajo, los leads de la semana como puntos que
 * se llenan y el éxito del primer contacto como un anillo. Escenario de
 * referencia mientras llegan las cifras medidas.
 */
export function SellUpImpact() {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState<Phase>(reducedMotion ? 'after' : 'before')
  const [heldUntil, setHeldUntil] = useState(0)
  const phone = usePhone()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const wait = Math.max(SWITCH_MS, heldUntil - Date.now())
    const id = window.setTimeout(() => setPhase((p) => (p === 'before' ? 'after' : 'before')), wait)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, phase, heldUntil])

  // En el teléfono también se pasa deslizando el dedo de lado.
  const flip = () => {
    setPhase((p) => (p === 'before' ? 'after' : 'before'))
    setHeldUntil(Date.now() + RESUME_MS)
  }
  useSwipe(rootRef, { onNext: flip, onPrev: flip })
  const s = SCENARIO[phase]
  const sell = WEEK_H - s.companies - s.contacts
  const companies = useTween(s.companies)
  const contacts = useTween(s.contacts)
  const selling = useTween(sell)
  const success = useTween(s.success)
  const num = (n: number, d = 1) => n.toLocaleString(locale === 'en' ? 'en-US' : 'es-CO', { maximumFractionDigits: d })
  const after = phase === 'after'

  /** Los tramos de la semana, en horas */
  const segments: readonly { key: string; label: L; hours: number; color: string }[] = [
    { key: 'companies', label: { es: 'Buscar empresas', en: 'Finding companies' }, hours: companies, color: '#f59e0b' },
    { key: 'contacts', label: { es: 'Buscar contactos', en: 'Finding contacts' }, hours: contacts, color: '#f87171' },
    { key: 'sell', label: { es: 'Vender', en: 'Selling' }, hours: selling, color: 'rgb(var(--signal))' },
  ]

  // Anillo del éxito del primer contacto
  const R = 54
  const CIRC = 2 * Math.PI * R

  return (
    <div ref={rootRef} className="mx-auto max-w-[960px]">
      <p className="case-tag text-center">{t({ es: 'Un vendedor, una semana', en: 'One rep, one week' })}</p>

      {/* Antes / Con SellUp: cambia solo; tocar uno lo fija un rato */}
      <div role="tablist" aria-label={t({ es: 'Escenario', en: 'Scenario' })} className="mx-auto mt-6 flex w-fit gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
        {PHASES.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={phase === p.id}
            onClick={() => {
              setPhase(p.id)
              setHeldUntil(Date.now() + RESUME_MS)
            }}
            className={`rounded-full px-4 py-1.5 text-[13px] transition-colors duration-500 ${phase === p.id ? (p.id === 'after' ? 'bg-signal text-on-signal' : 'bg-white text-[#0b0d16]') : 'text-paper/60 hover:text-paper'}`}
          >
            {t(p.label)}
          </button>
        ))}
      </div>

      {/* La semana: 40 horas en una barra; los tramos cambian de ancho. En teléfono, 40 celdas de una hora */}
      {phone ? <PhoneWeek segments={segments} selling={selling} after={after} num={num} /> : (
      <div className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <p className="text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] font-light">{t({ es: 'La semana del vendedor', en: 'The rep’s week' })}</p>
          <p className="text-right">
            <span className="text-[clamp(2.2rem,1.4rem+3vw,4rem)] font-light leading-none tabular-nums" style={{ filter: after ? 'drop-shadow(0 0 22px rgb(var(--signal) / 0.5))' : 'none' }}>{num(selling)} h</span>
            <span className="ml-2 text-[13px] text-paper/55">{t({ es: 'para vender', en: 'to sell' })}</span>
          </p>
        </div>
        <div className="mt-4 flex h-14 w-full overflow-hidden rounded-2xl border border-white/10" aria-hidden="true">
          {segments.map((seg) => (
            <span
              key={seg.key}
              className="relative flex items-center overflow-hidden px-3"
              style={{ width: `${(seg.hours / WEEK_H) * 100}%`, background: seg.key === 'sell' ? 'linear-gradient(90deg, rgb(var(--signal) / 0.35), rgb(var(--signal) / 0.75))' : `${seg.color}33`, borderRight: seg.key !== 'sell' ? `2px solid ${seg.color}` : undefined }}
            >
              {seg.hours / WEEK_H > 0.08 && <span className="whitespace-nowrap font-mono text-[11px] tabular-nums text-paper/90">{num(seg.hours)} h</span>}
            </span>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-paper/65">
          {segments.map((seg) => (
            <li key={seg.key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: seg.color }} />
              {t(seg.label)} · <span className="tabular-nums text-paper/90">{num(seg.hours)} h</span>
            </li>
          ))}
        </ul>
      </div>
      )}

      {/* Leads y éxito del primer contacto */}
      {phone ? (
        // Teléfono: dos tarjetas a lo ancho. Arriba, la cifra grande; abajo, su gráfico ocupando todo el ancho.
        <div className="mt-12 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">{t({ es: 'Métrica norte', en: 'North star' })}</p>
            <p className="mt-1.5 text-[17px] font-light">{t({ es: 'Leads calificados a la semana', en: 'Qualified leads per week' })}</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="shrink-0 text-[3rem] font-light leading-none tabular-nums text-paper">{s.leads}</span>
              <span className="text-[14px] text-paper/70">{t({ es: 'empresas listas para trabajar', en: 'companies ready to work' })}</span>
            </p>
            <LeadDots leads={s.leads} className="mt-5 grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5" />
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[17px] font-light">{t({ es: 'Éxito del primer contacto', en: 'First-contact success' })}</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="shrink-0 whitespace-nowrap text-[3rem] font-light leading-none tabular-nums">{num(success, 0)} %</span>
              <span className="text-[14px] text-paper/70">{t({ es: 'de los primeros contactos logran respuesta', en: 'of first contacts get a reply' })}</span>
            </p>
            {/* La misma proporción, como una barra que se llena a lo ancho */}
            <span aria-hidden="true" className="relative mt-5 block h-2.5 overflow-hidden rounded-full bg-white/10">
              <span className="absolute inset-y-0 left-0 rounded-full bg-signal shadow-[0_0_12px_rgb(var(--signal)/0.7)] transition-[width] duration-700 ease-out" style={{ width: `${success}%` }} />
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">{t({ es: 'Métrica norte', en: 'North star' })}</p>
            <p className="mt-2 text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] font-light">{t({ es: 'Leads calificados a la semana', en: 'Qualified leads per week' })}</p>
            <LeadDots leads={s.leads} className="mt-5 max-w-[230px] grid-cols-5 gap-2" />
            <p className="mt-4 text-[13px] text-paper/60">
              <span className="text-[1.6rem] font-light tabular-nums text-paper">{s.leads}</span> {t({ es: 'empresas listas para trabajar', en: 'companies ready to work' })}
            </p>
          </div>

          <div className="flex items-center gap-8">
            <svg viewBox="0 0 140 140" className="h-[150px] w-[150px] shrink-0 -rotate-90" aria-hidden="true">
              <circle cx={70} cy={70} r={R} fill="none" stroke="white" strokeOpacity={0.1} strokeWidth={10} />
              <circle cx={70} cy={70} r={R} fill="none" stroke="rgb(var(--signal))" strokeWidth={10} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - success / 100)} style={{ filter: 'drop-shadow(0 0 8px rgb(var(--signal) / 0.6))' }} />
            </svg>
            <div>
              <p className="text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] font-light">{t({ es: 'Éxito del primer contacto', en: 'First-contact success' })}</p>
              <p className="mt-2 text-[clamp(2.2rem,1.4rem+3vw,3.6rem)] font-light leading-none tabular-nums">{num(success, 0)} %</p>
              <p className="mt-2 text-[13px] text-paper/60">{t({ es: 'de los primeros contactos logran respuesta', en: 'of first contacts get a reply' })}</p>
            </div>
          </div>
        </div>
      )}

      {/* De aquí baja la fibra hacia «Demo» */}
      <span aria-hidden="true" className="relative mx-auto mt-14 block h-2.5 w-2.5 rounded-full border border-white/70 bg-signal shadow-[0_0_14px_rgb(var(--signal))]">
        <span data-fiber-from="su-demo" className="absolute left-1/2 top-1/2 h-px w-px" />
      </span>
    </div>
  )
}

interface Segment {
  key: string
  label: L
  hours: number
  color: string
}

/** Columnas de la cuadrícula de la semana en teléfono (40 h = 8 × 5) */
const WEEK_COLS = 8

/**
 * La semana en teléfono: 40 celdas, una por hora. Se pintan en orden, ámbar
 * para buscar empresas, rojo para buscar contactos y el resto para vender;
 * al pasar a «Con SellUp» las búsquedas se encogen y casi toda la semana
 * queda para vender.
 */
function PhoneWeek({ segments, selling, after, num }: { segments: readonly Segment[]; selling: number; after: boolean; num: (n: number, d?: number) => string }) {
  const { t } = useLocale()
  // Hasta qué hora llega cada tramo
  const ends = segments.reduce<number[]>((acc, seg) => [...acc, (acc[acc.length - 1] ?? 0) + seg.hours], [])
  const colorAt = (h: number) => segments[ends.findIndex((e) => h < e)] ?? segments[segments.length - 1]
  return (
    <div className="mt-10">
      <p className="text-[17px] font-light">{t({ es: 'La semana del vendedor', en: 'The rep’s week' })}</p>
      <p className="mt-1">
        <span className="text-[3.2rem] font-light leading-none tabular-nums" style={{ filter: after ? 'drop-shadow(0 0 22px rgb(var(--signal) / 0.5))' : 'none' }}>{num(selling)} h</span>
        <span className="ml-2 text-[14px] text-paper/60">{t({ es: 'para vender', en: 'to sell' })}</span>
      </p>
      <div className="mt-5 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${WEEK_COLS}, minmax(0, 1fr))` }} aria-hidden="true">
        {Array.from({ length: WEEK_H }, (_, h) => {
          // Celda partida: la hora donde cambia de tramo se pinta en dos colores
          const seg = colorAt(h)
          const next = colorAt(h + 0.5)
          const bg = (c: Segment) => (c.key === 'sell' ? 'rgb(var(--signal) / 0.7)' : c.color)
          return (
            <span
              key={h}
              className="aspect-square rounded-[5px] transition-[background] duration-700"
              style={{
                background: seg.key === next.key ? bg(seg) : `linear-gradient(90deg, ${bg(seg)} 50%, ${bg(next)} 50%)`,
                boxShadow: seg.key === 'sell' && after ? '0 0 10px rgb(var(--signal) / 0.45)' : 'none',
                transitionDelay: `${h * 12}ms`,
              }}
            />
          )
        })}
      </div>
      <p className="mt-2 font-mono text-[11px] text-paper/60">{t({ es: '1 celda = 1 hora · 40 h a la semana', en: '1 cell = 1 hour · 40 h a week' })}</p>
      <ul className="mt-5 space-y-2.5 text-[15px]">
        {segments.map((seg) => (
          <li key={seg.key} className="flex items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: seg.color }} />
            <span className="text-paper/75">{t(seg.label)}</span>
            <span className="ml-auto tabular-nums">{num(seg.hours)} h</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Los cupos de leads de la semana: los de antes en blanco, los que suma SellUp encendidos. */
function LeadDots({ leads, className }: { leads: number; className: string }) {
  return (
    <div className={`grid ${className}`} aria-hidden="true">
      {Array.from({ length: LEAD_SLOTS }, (_, i) => {
        const on = i < leads
        const fresh = on && i >= SCENARIO.before.leads
        return (
          <span
            key={i}
            className="aspect-square rounded-full border transition-all duration-500"
            style={{
              background: on ? (fresh ? 'rgb(var(--signal))' : 'rgb(255 255 255 / 0.75)') : 'transparent',
              borderColor: on ? 'transparent' : 'rgb(255 255 255 / 0.15)',
              transform: on ? 'scale(1)' : 'scale(0.7)',
              boxShadow: fresh ? '0 0 12px rgb(var(--signal) / 0.7)' : 'none',
              transitionDelay: `${(on ? i - SCENARIO.before.leads : LEAD_SLOTS - i) * 30}ms`,
            }}
          />
        )
      })}
    </div>
  )
}
