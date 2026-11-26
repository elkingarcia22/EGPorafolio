'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'

/** Escala de las barras (% de clientes que vuelven): el más bajo nunca queda en cero */
const MIN = 54
const MAX = 74
/** Alto de cada mes (px) */
const ROW = 38
const width = (v: number) => Math.min(1, (v - MIN) / (MAX - MIN))

interface ReturnPhoneProps {
  months: readonly string[]
  values: readonly number[]
  launch: number
  launchLabel: L
  /** Meses ya dibujados */
  step: number
  stepMs: number
  done: boolean
}

/**
 * Impacto en el teléfono: los meses bajan como renglones y cada uno crece en
 * una barra; la fibra une la punta de las barras, así la curva se lee de arriba
 * abajo. Una línea marca el mes en que sale la nueva reserva. Tocar un mes
 * muestra su porcentaje.
 */
export function ReturnPhone({ months, values, launch, launchLabel, step, stepMs, done }: ReturnPhoneProps) {
  const { t } = useLocale()
  const [picked, setPicked] = useState<number | null>(null)
  const last = values.length - 1
  const shownValue = (i: number) => i === 0 || i === last || picked === i
  // La fibra en coordenadas de la columna de barras: x en %, y por renglón
  const points = values.map((v, i) => `${width(v) * 100} ${i * ROW + ROW / 2}`).join(' L')
  const drawn = Math.max(0, step - 1) / last

  return (
    <div className="mt-8 w-full max-w-[380px]">
      <div className="relative grid grid-cols-[2.75rem_1fr_3.25rem] gap-x-3">
        {/* El día en que sale la nueva reserva */}
        <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-white/30" style={{ top: launch * ROW }}>
          <span className="absolute right-0 -translate-y-[calc(100%+3px)] font-mono text-[11px] uppercase tracking-[0.08em] text-paper/60">↓ {t(launchLabel)}</span>
        </div>

        {/* Los meses */}
        <ol className="font-mono text-[12px] uppercase tracking-[0.08em] text-paper/50">
          {months.map((m, i) => (
            <li key={m} className="flex items-center" style={{ height: ROW }}>
              <button type="button" onClick={() => setPicked((p) => (p === i ? null : i))} className={`outline-none ${picked === i ? 'text-paper' : ''}`} aria-pressed={picked === i}>
                {m}
              </button>
            </li>
          ))}
        </ol>

        {/* Las barras y la fibra que une sus puntas */}
        <div className="relative" style={{ height: ROW * values.length }}>
          {values.map((v, i) => {
            const on = step > i
            const after = i >= launch
            return (
              <button
                key={i}
                type="button"
                aria-label={`${months[i]}: ${v} %`}
                onClick={() => setPicked((p) => (p === i ? null : i))}
                className="absolute inset-x-0 flex items-center outline-none"
                style={{ top: i * ROW, height: ROW }}
              >
                <span
                  className="block h-[10px] origin-left rounded-full"
                  style={{
                    width: `${width(v) * 100}%`,
                    transform: `scaleX(${on ? 1 : 0})`,
                    transition: `transform ${stepMs * 2}ms cubic-bezier(.16,1,.3,1)`,
                    background: after ? 'linear-gradient(to right, rgb(var(--bk) / 0.15), rgb(var(--bk) / 0.55))' : 'linear-gradient(to right, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.18))',
                    boxShadow: picked === i ? '0 0 0 1px rgb(var(--bk) / 0.8)' : undefined,
                  }}
                />
              </button>
            )
          })}
          <svg viewBox={`0 0 100 ${ROW * values.length}`} preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <path d={`M${points}`} fill="none" stroke="rgb(var(--bk))" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - drawn} style={{ transition: `stroke-dashoffset ${stepMs}ms linear`, filter: 'drop-shadow(0 0 5px rgb(var(--bk) / 0.6))' }} />
          </svg>
          {/* La punta de cada barra: un nodo; el último, con halo */}
          {values.map((v, i) => (
            <span
              key={`dot-${i}`}
              aria-hidden="true"
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ${i === last ? 'h-3.5 w-3.5 bg-white shadow-[0_0_0_6px_rgb(var(--bk)/0.2),0_0_14px_rgb(var(--bk)/0.8)]' : 'h-2 w-2 bg-[rgb(var(--bk))]'}`}
              style={{ left: `${width(v) * 100}%`, top: i * ROW + ROW / 2, opacity: step > i ? 1 : 0 }}
            />
          ))}
        </div>

        {/* Los porcentajes: el primero, el último y el que se toque */}
        <ol className="tabular-nums">
          {values.map((v, i) => (
            <li key={i} className="flex items-center justify-end" style={{ height: ROW }}>
              <span
                className={`transition-opacity duration-300 ${i === last ? 'text-[1.35rem] font-light text-[rgb(var(--bk))]' : 'text-[13px] text-paper/60'}`}
                style={{ opacity: shownValue(i) && (i !== last || done) && step > i ? 1 : 0 }}
              >
                {v} %
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
