'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'

interface Metric {
  name: L
  what: L
  moves: L
  how: L
  from: string
  to: string
  delta: string
  unit: L
  level: readonly [number, number]
  north?: boolean
}

interface ImpactPhoneProps {
  metrics: readonly Metric[]
  active: number
  risen: boolean
  onPick: (i: number) => void
  reducedMotion: boolean
}

/**
 * Impacto en el teléfono: una métrica a la vez en una columna grande que se
 * llena del punto de partida a la meta, con las cifras al lado en letra real.
 * Abajo, las cuatro columnas en chico sirven de pestañas (y se desliza de lado).
 * Qué es y cómo se mide quedan a un toque.
 */
export function ImpactPhone({ metrics, active, risen, onPick, reducedMotion }: ImpactPhoneProps) {
  const { t } = useLocale()
  const [howOpen, setHowOpen] = useState(false)
  const m = metrics[active]
  const [from, to] = m.level

  return (
    <div className="mx-auto mt-6 max-w-[360px]">
      <p className="case-tag">{t({ es: 'Escenario de referencia', en: 'Reference scenario' })} · {t({ es: 'partida → meta', en: 'start → target' })}</p>

      <div className="mt-6 flex items-stretch gap-6">
        {/* La columna grande: el nivel sube del punto de partida a la meta */}
        <span className="relative block h-60 w-24 shrink-0 overflow-hidden rounded-[999px_999px_16px_16px] border border-white/35">
          <span
            key={`f-${active}`}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-gradient-to-t from-signal/25 to-signal/90"
            style={{ transform: `scaleY(${risen ? to : 0})`, animation: risen && !reducedMotion ? 'enc-rise 1.4s cubic-bezier(.16,1,.3,1) both' : undefined, ['--enc-from' as string]: from, ['--enc-to' as string]: to }}
          />
          <span key={`s-${active}`} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-full origin-bottom" style={{ transform: `scaleY(${risen ? to : 0})`, animation: risen && !reducedMotion ? 'enc-rise 1.4s cubic-bezier(.16,1,.3,1) both' : undefined, ['--enc-from' as string]: from, ['--enc-to' as string]: to }}>
            <span className="absolute inset-x-0 top-0 h-px bg-white shadow-[0_0_14px_3px_rgb(var(--signal)/0.8)]" />
          </span>
          {/* El punto de partida */}
          <span aria-hidden="true" className="absolute inset-x-2 border-t border-dashed border-white/60" style={{ bottom: `${from * 100}%` }} />
        </span>

        <div key={active} className="obj-fade flex min-w-0 flex-col justify-end" aria-live="polite">
          {m.north && <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">{t({ es: 'Norte', en: 'North star' })}</span>}
          <p className="mt-1 text-[22px] font-light leading-tight">{t(m.name)}</p>
          <span className="mt-3 w-fit rounded-full bg-signal px-2.5 py-0.5 text-[14px] tabular-nums text-on-signal">{m.delta}</span>
          <p className="mt-4 text-[26px] font-light leading-none tabular-nums">
            <span className="text-paper/45">{m.from}</span>
            <span className="mx-2 text-signal">→</span>
            <span>{m.to}</span>
          </p>
          <p className="mt-2 text-[13px] leading-snug text-paper/55">{t(m.unit)}</p>
        </div>
      </div>

      <p key={`m-${active}`} className="obj-fade mt-6 text-[15px] leading-relaxed text-paper/80">{t(m.moves)}</p>
      <button type="button" onClick={() => setHowOpen((o) => !o)} aria-expanded={howOpen} className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">
        <span aria-hidden="true" className={`transition-transform duration-300 ${howOpen ? 'rotate-45' : ''}`}>+</span>
        {t({ es: 'Qué es y cómo se mide', en: 'What it is and how it’s measured' })}
      </button>
      {howOpen && (
        <dl key={`h-${active}`} className="obj-fade mt-3 space-y-2 border-l border-white/15 pl-4 text-[14px] leading-relaxed text-paper/65">
          <div><dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60">{t({ es: 'Qué es', en: 'What it is' })}</dt><dd>{t(m.what)}</dd></div>
          <div><dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60">{t({ es: 'Cómo se mide', en: 'How it’s measured' })}</dt><dd>{t(m.how)}</dd></div>
        </dl>
      )}

      {/* Las cuatro métricas en chico: pestañas */}
      <ol className="mt-8 grid grid-cols-4 gap-3">
        {metrics.map((x, i) => {
          const on = i === active
          return (
            <li key={x.name.es}>
              <button type="button" onClick={() => onPick(i)} aria-pressed={on} className="flex w-full flex-col items-center outline-none">
                <span className={`relative block h-14 w-9 overflow-hidden rounded-[999px_999px_8px_8px] border transition-colors duration-500 ${on ? 'border-white/50' : 'border-white/15'}`}>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-signal/70 transition-transform duration-700" style={{ transform: `scaleY(${risen ? (on ? x.level[1] : x.level[0]) : 0})`, opacity: on ? 1 : 0.4 }} />
                  {i === metrics.length - 1 && <span data-fiber-from="enc-demo" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className={`mt-2 text-center text-[11px] leading-tight transition-opacity ${on ? 'opacity-100' : 'opacity-50'}`}>{t(x.name)}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
