'use client'

import { useLocale } from '@/lib/i18n'

export interface HeroBranchStage {
  /** Lo que va dentro del anillo: un número o un candado */
  value: string | null
  name: string
  role: string
  /** Cuánto del anillo está lleno (0–1) */
  fill: number
  color: string
  dim: boolean
}

interface HeroBranchPhoneProps {
  stages: readonly HeroBranchStage[]
  /** Cambia en cada área: reinicia la señal que baja por la rama */
  pulseKey: number
  /** Si la señal se detiene en el nodo del medio (grupo bajo el mínimo) */
  stopsHalfway: boolean
  reducedMotion: boolean
}

const RING = 64
const R = 28
const CIRC = 2 * Math.PI * R

/**
 * La portada en el teléfono: la misma rama, de pie. Tres anillos en columna
 * unidos por una fibra por la que baja la señal; a la derecha, en letra real,
 * qué es cada uno. Si el grupo es reservado, la señal se queda en el candado.
 */
export function HeroBranchPhone({ stages, pulseKey, stopsHalfway, reducedMotion }: HeroBranchPhoneProps) {
  const { t } = useLocale()
  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <ol className="relative flex flex-col gap-7">
        {/* La fibra entre los anillos, con la señal que baja */}
        <span aria-hidden="true" className="absolute left-[31.5px] top-8 bottom-8 w-px overflow-hidden bg-gradient-to-b from-signal/50 via-[rgb(var(--glow)/0.5)] to-[rgb(var(--spark)/0.5)]">
          {!reducedMotion && (
            <span
              key={pulseKey}
              className="absolute inset-x-[-1px] top-0 h-10 bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_8px_rgb(var(--signal))]"
              style={{ animation: `enc-drop 1.6s cubic-bezier(.45,0,.2,1) both`, ['--enc-drop-to' as string]: stopsHalfway ? '45%' : '100%' }}
            />
          )}
        </span>
        {stages.map((s, i) => (
          <li key={i} className="relative flex items-center gap-5 transition-opacity duration-500" style={{ opacity: s.dim ? 0.5 : 1 }}>
            <span className="relative grid shrink-0 place-items-center" style={{ width: RING, height: RING }}>
              <span aria-hidden="true" className="absolute -inset-2.5 rounded-full transition-colors duration-500" style={{ background: i === 2 && !s.dim ? `${s.color}26` : 'rgb(var(--signal) / 0.08)' }} />
              <svg viewBox="0 0 64 64" className="absolute inset-0" aria-hidden="true">
                <circle cx={32} cy={32} r={R} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.12} strokeWidth={3.5} strokeDasharray={s.dim ? '3 5' : undefined} />
                <circle cx={32} cy={32} r={R} fill="none" stroke={s.color} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - s.fill)} transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1), stroke .6s' }} />
              </svg>
              {s.value === null ? (
                <svg viewBox="0 0 22 26" className="relative h-5 w-5 stroke-paper" fill="none" strokeWidth={2.4} aria-label={t({ es: 'Reservado', en: 'Reserved' })}>
                  <rect x={1} y={10} width={20} height={15} rx={3} />
                  <path d="M5.5 10V6.5a5.5 5.5 0 0 1 11 0V10" />
                </svg>
              ) : s.value === '' ? (
                <span className="relative h-3.5 w-3.5 rounded-full transition-colors duration-500" style={{ background: s.dim ? 'transparent' : s.color, border: s.dim ? '1px dashed rgb(255 255 255 / .4)' : undefined }} />
              ) : (
                <span className="relative text-[17px] font-medium tabular-nums">{s.value}</span>
              )}
              {i === 2 && <span data-fiber-from="enc-puntos" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
            </span>
            <span key={s.name} className="obj-fade min-w-0">
              <span className="block text-[18px] leading-tight">{s.name}</span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">{s.role}</span>
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="case-note mx-auto mt-7 text-center">
        {t({ es: 'Mapa de calor real · «Propósito y estrategia»', en: 'Real heatmap · “Purpose and strategy”' })}
      </figcaption>
    </figure>
  )
}
