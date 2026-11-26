'use client'

import { useLocale, type L } from '@/lib/i18n'
import { PhoneNode } from './phone-kit'

interface FanRow {
  id: string
  name: L
  tierLabel: L
  color: string
  questions: number
}

interface FanPhoneProps {
  rows: readonly FanRow[]
  active: number
  picked: number | null
  onPick: (i: number) => void
  detail: { use: string; meta: string }
  principles: readonly L[]
  reducedMotion: boolean
}

/** Alto de cada fila y dónde arranca la primera, en px reales (el SVG de las fibras no se escala) */
const ROW = 58
const TOP = 72
const SOURCE = { x: 14, y: 20 }
const NODE_X = 34
const fiber = (i: number) => {
  const y = TOP + ROW / 2 + i * ROW
  return `M${SOURCE.x} ${SOURCE.y} C${SOURCE.x} ${y - 24} ${SOURCE.x + 4} ${y} ${NODE_X - 6} ${y}`
}

/**
 * 03 · La idea en el teléfono: el constructor arriba y, colgando de él, las
 * siete plantillas en lista. Una fibra lleva a cada una; la que se enciende
 * despliega sus preguntas como puntos. Tocar una la fija y dice para qué sirve.
 */
export function FanPhone({ rows, active, picked, onPick, detail, principles, reducedMotion }: FanPhoneProps) {
  const { t } = useLocale()
  const height = TOP + rows.length * ROW

  return (
    <div className="relative mx-auto mt-6 max-w-[360px]">
      <div className="relative" style={{ height }}>
        <svg width={48} height={height} className="absolute left-0 top-0 overflow-visible" aria-hidden="true">
          {rows.map((r, i) => {
            const on = i === active
            return (
              <g key={r.id}>
                <path d={fiber(i)} fill="none" stroke={on ? r.color : 'white'} strokeOpacity={on ? 0.9 : 0.12} strokeWidth={on ? 2 : 1} style={{ transition: 'stroke-opacity .5s, stroke .5s' }} />
                {on && !reducedMotion && <path key={`p-${active}`} d={fiber(i)} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.12 0.88" className="ms-pulse" style={{ filter: 'drop-shadow(0 0 6px white)' }} />}
              </g>
            )
          })}
        </svg>

        {/* El constructor: un solo nodo, del que sale la fibra hacia «Bocetos» */}
        <div className="absolute left-0 top-0 flex items-center gap-4" style={{ transform: `translate(${SOURCE.x - 8}px, ${SOURCE.y - 8}px)` }}>
          <PhoneNode on fiberFrom="enc-bocetos" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">{t({ es: 'Un constructor', en: 'One builder' })}</span>
        </div>

        <ol className="absolute inset-x-0" style={{ top: TOP }}>
          {rows.map((r, i) => {
            const on = i === active
            return (
              <li key={r.id} style={{ height: ROW }}>
                <button type="button" onClick={() => onPick(i)} aria-pressed={picked === i} className="flex h-full w-full items-center gap-3 text-left outline-none" style={{ paddingLeft: NODE_X - 6 }}>
                  <PhoneNode on={on} size="sm" tone={r.color} />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[16px] leading-tight transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-55'}`}>{t(r.name)}</span>
                    {on ? (
                      <span key={r.id} className="mt-1.5 flex flex-wrap gap-[3px]" aria-label={`${r.questions} ${t({ es: 'preguntas', en: 'questions' })}`}>
                        {Array.from({ length: r.questions }, (_, k) => (
                          <span key={k} className="enc-pop h-1 w-1 rounded-full" style={{ background: r.color, animationDelay: reducedMotion ? undefined : `${k * 12}ms` }} />
                        ))}
                      </span>
                    ) : (
                      <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: r.color, opacity: 0.6 }}>{t(r.tierLabel)}</span>
                    )}
                  </span>
                  <span className={`font-mono text-[13px] tabular-nums transition-opacity ${on ? 'opacity-90' : 'opacity-40'}`}>{r.questions}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div key={active} className="obj-fade mt-6 border-l border-signal/50 pl-4" aria-live="polite">
        <p className="text-[17px] font-light leading-snug">{detail.use}</p>
        <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-paper/50">{detail.meta}</p>
      </div>

      {/* Los cuatro principios: se pasan de lado */}
      <ol className="swipe-row mt-10">
        {principles.map((p, i) => (
          <li key={p.es} className="!basis-[72%] rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/25 font-mono text-[12px]">{i + 1}</span>
            <span className="mt-4 block text-[16px] leading-snug text-paper/85">{t(p)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
