'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import type { Shift } from '@/lib/content/cases/encuestas/impact-metrics'
import { TURNOVER } from '@/lib/content/cases/encuestas/impact-metrics'
import { ReferenceTag } from './shared'

/** Avanza de 0 a 1 una vez, cuando el elemento entra a la vista (1 de inmediato con movimiento reducido). */
export function useProgress<T extends Element>(duration = 1600) {
  const { reducedMotion } = useA11y()
  const ref = useRef<T>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    if (reducedMotion) return setP(1)
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (now: number) => {
        const x = Math.min((now - t0) / duration, 1)
        setP(1 - Math.pow(1 - x, 3))
        if (x < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [duration, reducedMotion])
  return { ref, p }
}

const lerp = (a: number, b: number, p: number) => a + (b - a) * p
const fmt = (n: number, unit: string) => `${Math.round(n)}${unit ? (unit === '%' ? ' %' : unit) : ''}`

/** Medio anillo del SUS: la aguja va de la línea base a la meta. */
export function SusGauge({ shift }: { shift: Shift }) {
  const { t } = useLocale()
  const { ref, p } = useProgress<HTMLDivElement>(2000)
  const value = lerp(shift.from, shift.to, p)
  const arc = (v: number) => {
    const a = Math.PI * (1 - v / 100)
    return { x: 100 + 80 * Math.cos(a), y: 100 - 80 * Math.sin(a) }
  }
  const end = arc(value)
  const base = arc(shift.from)
  return (
    <div ref={ref} className="flex h-full flex-col rounded-2xl bg-[#0f1013] p-6 text-white">
      <p className="mono-label text-white/55">{t(shift.label)}<ReferenceTag /></p>
      <svg viewBox="0 0 200 118" className="mx-auto mt-4 w-full max-w-[18rem]" role="img" aria-label={`SUS ${shift.from} → ${shift.to}`}>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" strokeLinecap="round" />
        <path d={`M20 100 A80 80 0 0 1 ${end.x} ${end.y}`} fill="none" stroke="rgb(var(--signal))" strokeWidth="14" strokeLinecap="round" />
        <circle cx={base.x} cy={base.y} r="4" fill="#0f1013" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <text x="100" y="92" textAnchor="middle" className="fill-white text-[34px] font-light tabular-nums">{Math.round(value)}</text>
        <text x="20" y="116" textAnchor="middle" className="fill-white/40 text-[9px]">0</text>
        <text x="180" y="116" textAnchor="middle" className="fill-white/40 text-[9px]">100</text>
      </svg>
      <p className="mt-2 flex justify-between font-mono text-xs text-white/60">
        <span>{t({ es: 'hoy', en: 'today' })} {shift.from}</span>
        <span className="text-signal">{t({ es: 'meta', en: 'goal' })} {shift.to}</span>
      </p>
      <p className="mt-auto pt-4 text-xs leading-relaxed text-white/55">{t(shift.hint)}</p>
    </div>
  )
}

/** Una métrica antes → después en dos barras, con la diferencia contándose. */
export function ShiftBars({ shift, tone = 'light' }: { shift: Shift; tone?: 'light' | 'dark' }) {
  const { t } = useLocale()
  const { ref, p } = useProgress<HTMLDivElement>()
  const max = Math.max(shift.from, shift.to)
  const delta = shift.to - shift.from
  const pct = shift.from === 100 && shift.unit === ''
  const deltaLabel = pct ? `${delta > 0 ? '+' : '−'}${Math.abs(Math.round(delta * p))} %` : `${delta > 0 ? '+' : '−'}${Math.abs(Math.round(delta * p))}${shift.unit === '%' ? ' pp' : ''}`
  const track = tone === 'dark' ? 'bg-white/10' : 'bg-fg/10'
  return (
    <div ref={ref} className="min-w-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm leading-snug">{t(shift.label)}<ReferenceTag /></p>
        <span className="shrink-0 font-light tabular-nums text-signal text-3xl">{deltaLabel}</span>
      </div>
      <div className="mt-3 space-y-1.5 font-mono text-[11px]">
        {[
          { k: t({ es: 'hoy', en: 'today' }), v: shift.from, on: false },
          { k: t({ es: 'meta', en: 'goal' }), v: lerp(shift.from, shift.to, p), on: true },
        ].map((row) => (
          <div key={row.k} className="grid grid-cols-[2.6rem_1fr_3rem] items-center gap-2">
            <span className="opacity-55">{row.k}</span>
            <span className={`h-2 overflow-hidden rounded-full ${track}`}>
              <span className="block h-full origin-left rounded-full" style={{ transform: `scaleX(${row.v / max})`, background: row.on ? 'rgb(var(--signal))' : 'currentColor', opacity: row.on ? 1 : 0.35 }} />
            </span>
            <span className="text-right tabular-nums opacity-80">{fmt(row.v, shift.unit)}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs opacity-55">{t(shift.hint)}</p>
    </div>
  )
}

/** Rotación voluntaria por trimestre: las áreas que cierran su plan frente a las que no. */
export function TurnoverChart() {
  const { t } = useLocale()
  const { ref, p } = useProgress<HTMLDivElement>(2200)
  const W = 320
  const H = 150
  const lo = 12
  const hi = 14.5
  const x = (i: number) => 24 + (i * (W - 48)) / (TURNOVER.quarters.length - 1)
  const y = (v: number) => 16 + ((hi - v) / (hi - lo)) * (H - 40)
  const path = (vals: readonly number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')
  const last = TURNOVER.withPlan.length - 1
  return (
    <div ref={ref} className="rounded-2xl border border-fg/15 p-5 sm:p-6">
      <p className="mono-label opacity-60">{t({ es: 'Rotación voluntaria por trimestre', en: 'Voluntary turnover by quarter' })}<ReferenceTag /></p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label={t({ es: 'Con plan de acción baja de 14 % a 12,5 %; sin plan se queda en 14 %', en: 'With an action plan it drops from 14% to 12.5%; without one it stays at 14%' })}>
        {[12, 13, 14].map((g) => (
          <g key={g}>
            <line x1="24" x2={W - 24} y1={y(g)} y2={y(g)} stroke="currentColor" strokeOpacity="0.1" />
            <text x="0" y={y(g) + 3} className="fill-current text-[8px] opacity-50">{g} %</text>
          </g>
        ))}
        <path d={path(TURNOVER.withoutPlan)} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 4" style={{ opacity: p }} />
        <path d={path(TURNOVER.withPlan)} fill="none" stroke="rgb(var(--signal))" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
        {p > 0.95 && <circle cx={x(last)} cy={y(TURNOVER.withPlan[last])} r="4" fill="rgb(var(--signal))" />}
        {TURNOVER.quarters.map((q, i) => (
          <text key={q} x={x(i)} y={H - 4} textAnchor="middle" className="fill-current text-[8px] opacity-50">{q}</text>
        ))}
      </svg>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-signal" />{t({ es: 'Áreas que cierran su plan de acción', en: 'Areas that close their action plan' })}</li>
        <li className="flex items-center gap-2 opacity-60"><span className="h-0 w-5 border-t-2 border-dashed border-current" />{t({ es: 'Áreas sin plan', en: 'Areas without a plan' })}</li>
      </ul>
      <p className="mt-4 text-sm leading-snug">
        <span className="text-2xl font-light tabular-nums text-signal">−1,5 pp</span>{' '}
        <span className="opacity-75">{t({ es: 'de rotación voluntaria en un año donde el resultado se convierte en plan con dueño.', en: 'voluntary turnover in a year where results become an owned plan.' })}</span>
      </p>
    </div>
  )
}
