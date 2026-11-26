'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useNarrow } from '@/components/case/kit/use-narrow'

/** Lo que Carlos reporta, uno tras otro (%), y vuelve a empezar */
const REPORTS = [47, 62, 78, 93, 100] as const
/** Cada cuánto llega un reporte (ms) */
const REPORT_MS = 3200
/** Cuándo llega la señal al área y a la empresa, desde que la persona reporta (ms) */
const ARRIVE_MS = { area: 750, empresa: 1500 } as const
/** Los otros aportes fijos de la rama (de Verónica, en Operaciones: 93 % con peso 30) */
const PEER = { avance: 93, peso: 30 }
const PESO_CARLOS = 40

/** Área = promedio de sus personas; empresa = promedio ponderado por peso (como en la plataforma). */
const areaDe = (v: number) => (v + PEER.avance) / 2
const empresaDe = (v: number) => (v * PESO_CARLOS + PEER.avance * PEER.peso) / (PESO_CARLOS + PEER.peso)

interface BranchNode {
  x: number
  name: string
  role: L
}

const NODES: readonly BranchNode[] = [
  { x: 130, name: 'Carlos Navarro', role: { es: 'Persona · reporta', en: 'Person · reports' } },
  { x: 500, name: 'Operaciones', role: { es: 'Área', en: 'Area' } },
  { x: 870, name: 'Eficiencia', role: { es: 'Objetivo de empresa', en: 'Company goal' } },
]
const Y = 120
const R = 38
const CIRC = 2 * Math.PI * R
/** La fibra: una sola rama que ondula apenas entre los tres nodos */
const FIBER = `M${NODES[0].x} ${Y} C 260 ${Y - 36}, 370 ${Y + 36}, ${NODES[1].x} ${Y} S 740 ${Y - 36}, ${NODES[2].x} ${Y}`

interface HeroBranchProps {
  /** Corre solo mientras la portada está a la vista */
  running: boolean
  reducedMotion: boolean
}

/**
 * La portada de Objetivos en una sola rama horizontal: una persona reporta su
 * avance y la señal viaja por la fibra hasta su área y el objetivo de empresa,
 * que se actualizan cuando les llega. Así se ve la cascada sin el árbol entero.
 */
export function HeroBranch({ running, reducedMotion }: HeroBranchProps) {
  const { t } = useLocale()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(() => {
    const v = REPORTS[0]
    return [v, areaDe(v), empresaDe(v)]
  })
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (!running || reducedMotion) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % REPORTS.length), REPORT_MS)
    return () => window.clearInterval(id)
  }, [running, reducedMotion])

  // La persona cambia al instante; el área y la empresa, cuando la señal les llega.
  useEffect(() => {
    const v = REPORTS[step]
    timers.current.forEach(window.clearTimeout)
    setValues((prev) => [v, prev[1], prev[2]])
    timers.current = [
      window.setTimeout(() => setValues((prev) => [prev[0], areaDe(v), prev[2]]), reducedMotion ? 0 : ARRIVE_MS.area),
      window.setTimeout(() => setValues((prev) => [prev[0], prev[1], empresaDe(v)]), reducedMotion ? 0 : ARRIVE_MS.empresa),
    ]
    return () => timers.current.forEach(window.clearTimeout)
  }, [step, reducedMotion])

  const narrow = useNarrow()
  if (narrow) return <BranchColumn values={values} step={step} reducedMotion={reducedMotion} />

  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <svg viewBox="0 0 1000 230" className="w-full overflow-visible" role="img" aria-label={t({ es: 'Un reporte de avance sube por la cascada: persona, área y objetivo de empresa', en: 'A progress report climbs the cascade: person, area and company goal' })}>
        <defs>
          <linearGradient id="branch-fiber" x1="0" x2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="0.55" stopColor="rgb(var(--glow))" />
            <stop offset="1" stopColor="rgb(var(--spark))" />
          </linearGradient>
        </defs>

        {/* La rama: tenue de fondo y, encima, la señal que viaja con cada reporte */}
        <path d={FIBER} fill="none" stroke="url(#branch-fiber)" strokeOpacity={0.45} strokeWidth={1.5} />
        {!reducedMotion && (
          <path key={step} d={FIBER} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 0.92" className="branch-pulse" style={{ filter: 'drop-shadow(0 0 6px rgb(var(--signal)))' }} />
        )}

        {NODES.map((n, i) => {
          const value = values[i]
          const shown = Math.min(100, value)
          return (
            <g key={n.name} transform={`translate(${n.x} ${Y})`}>
              <circle r={R + 18} fill="rgb(var(--signal) / 0.08)" />
              {/* De la empresa (el último nodo) sale la fibra que baja al primer capítulo */}
              <circle r={R} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.12} strokeWidth={4} data-fiber-from={i === NODES.length - 1 ? 'obj-puntos' : undefined} />
              <circle
                r={R}
                fill="none"
                stroke="url(#branch-fiber)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - shown / 100)}
                transform="rotate(-90)"
                style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1)' }}
              />
              <text y={8} textAnchor="middle" className="branch-value fill-paper font-medium tabular-nums">{Math.round(value)}</text>
              <text y={-R - 28} textAnchor="middle" className="branch-name fill-paper">{n.name}</text>
              <text y={R + 34} textAnchor="middle" className="branch-role fill-paper/50 font-mono uppercase tracking-[0.14em]">{t(n.role)}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className="case-note mx-auto mt-5 text-center">
        {t({ es: 'Ciclo de ejemplo · cada reporte sube de la persona al área y a la empresa', en: 'Sample cycle · each report climbs from the person to the area and the company' })}
      </figcaption>
    </figure>
  )
}

/** Tamaño del anillo de cada nodo en el teléfono (px) */
const RING = { size: 76, r: 31 }
const RING_CIRC = 2 * Math.PI * RING.r

interface BranchColumnProps {
  values: readonly number[]
  step: number
  reducedMotion: boolean
}

/**
 * La misma rama en el teléfono, de pie: la persona arriba, su área y el objetivo
 * de empresa debajo, unidos por una fibra vertical por la que baja cada reporte.
 * Los nombres van a un costado, en texto de verdad, para leerse sin acercar.
 */
function BranchColumn({ values, step, reducedMotion }: BranchColumnProps) {
  const { t } = useLocale()
  return (
    <figure className="mx-auto w-full max-w-[340px]" aria-label={t({ es: 'Un reporte de avance sube por la cascada: persona, área y objetivo de empresa', en: 'A progress report climbs the cascade: person, area and company goal' })}>
      <ol className="relative">
        {/* La fibra que une los tres anillos y la señal que la recorre con cada reporte */}
        <span aria-hidden="true" className="absolute bottom-[38px] left-[38px] top-[38px] w-px -translate-x-1/2 bg-gradient-to-b from-[rgb(var(--signal))] via-[rgb(var(--glow))] to-[rgb(var(--spark))] opacity-50" />
        {!reducedMotion && (
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[38px] left-[38px] top-[38px] w-px -translate-x-1/2">
            <span key={step} className="branch-drop absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgb(var(--signal))]" />
          </span>
        )}
        {NODES.map((n, i) => {
          const value = values[i]
          const shown = Math.min(100, value)
          return (
            <li key={n.name} className="relative flex items-center gap-5 py-3">
              <span className="relative grid shrink-0 place-items-center" style={{ width: RING.size, height: RING.size }}>
                <span aria-hidden="true" className="absolute inset-[-10px] rounded-full bg-[rgb(var(--signal)/0.08)]" />
                <svg viewBox={`0 0 ${RING.size} ${RING.size}`} className="absolute inset-0" aria-hidden="true">
                  <circle cx={RING.size / 2} cy={RING.size / 2} r={RING.r} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.12} strokeWidth={3} />
                  <circle
                    cx={RING.size / 2}
                    cy={RING.size / 2}
                    r={RING.r}
                    fill="none"
                    stroke="url(#branch-fiber-m)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRC}
                    strokeDashoffset={RING_CIRC * (1 - shown / 100)}
                    transform={`rotate(-90 ${RING.size / 2} ${RING.size / 2})`}
                    style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1)' }}
                  />
                  <defs>
                    <linearGradient id="branch-fiber-m" x1="0" x2="1">
                      <stop offset="0" stopColor="rgb(var(--signal))" />
                      <stop offset="1" stopColor="rgb(var(--spark))" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="relative text-xl font-medium tabular-nums">{Math.round(value)}</span>
                {/* Del objetivo de empresa (el último) sale la fibra que baja al primer capítulo */}
                {i === NODES.length - 1 && <span data-fiber-from="obj-puntos" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-[17px] leading-tight">{n.name}</span>
                <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60">{t(n.role)}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <figcaption className="case-note mt-4 text-left">
        {t({ es: 'Ciclo de ejemplo · cada reporte sube de la persona al área y a la empresa', en: 'Sample cycle · each report climbs from the person to the area and the company' })}
      </figcaption>
    </figure>
  )
}
