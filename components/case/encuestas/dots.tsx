'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { useTicker } from './shared'

const R = 150
const C = 190

/** Posición de la parada `i` de `n` sobre el anillo, empezando arriba. */
function point(i: number, n: number, r = R): { x: number; y: number } {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2
  return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r }
}

/** El ciclo de una medición: seis paradas en un anillo; cada una muestra qué estaba roto y qué cambió. */
function MeasurementCycle() {
  const { t } = useLocale()
  const stations = ENCUESTAS_CASE.dots.stations
  const [picked, setPicked] = useState<number | null>(null)
  const tick = useTicker(2600, picked === null)
  const active = picked ?? tick % stations.length
  const station = stations[active]
  const n = stations.length

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12">
      <div className="relative mx-auto w-full max-w-[24rem] lg:col-span-6" data-reveal="pop">
        <svg viewBox="0 0 380 380" className="w-full" role="img" aria-label={t({ es: 'Ciclo de una medición en seis paradas', en: 'A measurement cycle in six stops' })}>
          <circle cx={C} cy={C} r={R} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="3 6" />
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="rgb(var(--signal))"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={n}
            strokeDasharray={`${active + 1} ${n}`}
            transform={`rotate(-90 ${C} ${C})`}
            className="transition-[stroke-dasharray] duration-700 ease-expo"
          />
          <text x={C} y={C - 8} textAnchor="middle" className="fill-current font-mono text-[11px] opacity-50">
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </text>
          <text x={C} y={C + 18} textAnchor="middle" className="fill-current text-[20px] font-light">
            {t(station.name)}
          </text>
        </svg>
        {stations.map((s, i) => {
          const p = point(i, n)
          const on = i === active
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setPicked(i)}
              aria-pressed={on}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-500 ${on ? 'scale-110 border-signal bg-signal text-paper' : 'border-fg/25 bg-bg hover:border-signal'}`}
              style={{ left: `${(p.x / 380) * 100}%`, top: `${(p.y / 380) * 100}%` }}
            >
              {t(s.name)}
            </button>
          )
        })}
      </div>

      <div className="lg:col-span-6" aria-live="polite">
        <p className="mono-label opacity-50">{t(station.who)}</p>
        <div key={station.id} className="mt-4 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 enc-fade">
          <div className="bg-bg p-6">
            <p className="mono-label text-[#e0675f]">{t({ es: 'El reto', en: 'The challenge' })}</p>
            <p className="mt-2 text-lg leading-snug opacity-80">{t(station.before)}</p>
          </div>
          <div className="bg-bg p-6">
            <p className="mono-label text-signal">{t({ es: 'Con el rediseño', en: 'With the redesign' })}</p>
            <p className="mt-2 text-lg leading-snug">{t(station.after)}</p>
          </div>
        </div>
        {picked !== null && (
          <button type="button" onClick={() => setPicked(null)} className="mono-label mt-4 opacity-60 hover:opacity-100">
            ↻ {t({ es: 'Seguir el recorrido solo', en: 'Resume the tour' })}
          </button>
        )}
      </div>
    </div>
  )
}

/** 01 · Los puntos: el ciclo roto de una medición y las cifras de partida. */
export function CycleDots() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.dots
  return (
    <div>
      <p data-reveal="mask" className="max-w-[24ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">{t(d.kicker)}</p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(d.lead)}</p>

      <p data-reveal className="mono-label mb-8 mt-16 opacity-60">{t({ es: 'El ciclo de una medición', en: 'A measurement cycle' })}</p>
      <MeasurementCycle />

      <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-fg/15 pt-10 lg:grid-cols-4">
        {d.facts.map((f) => (
          <div key={f.label.es} data-reveal>
            <dt className="sr-only">{t(f.label)}</dt>
            <dd>
              <span data-count={f.value} className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{f.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(f.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
