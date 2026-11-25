'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'

/** Lienzo del radar (unidades del SVG) */
const S = 460
const C = S / 2
/** Una vuelta del barrido (ms) */
const SWEEP_MS = 4000
/** Cuánto tardan los contadores en llegar a la corrida real (ms) y cada cuánto vuelven a empezar */
const COUNT_MS = 7000
const LOOP_MS = 12000

/** Los anillos: de adentro hacia afuera, de lo gratis a lo de bajo costo */
const RINGS: readonly { r: number; label: L; color: string }[] = [
  { r: 80, label: { es: 'Libres en HubSpot', en: 'Free in HubSpot' }, color: '#34d399' },
  { r: 140, label: { es: 'Registros oficiales', en: 'Official registries' }, color: '#34d399' },
  { r: 200, label: { es: 'Búsqueda web', en: 'Web search' }, color: '#38bdf8' },
]

type Blip = { angle: number; ring: number; owned: boolean }

/** Las empresas que encuentra: ángulo (grados, desde arriba en el sentido del reloj) y anillo. Las «owned» ya tienen dueño. */
const BLIPS: readonly Blip[] = [
  { angle: 18, ring: 0, owned: false }, { angle: 64, ring: 1, owned: false }, { angle: 95, ring: 0, owned: true },
  { angle: 128, ring: 2, owned: false }, { angle: 152, ring: 1, owned: false }, { angle: 190, ring: 0, owned: false },
  { angle: 214, ring: 2, owned: true }, { angle: 238, ring: 1, owned: false }, { angle: 262, ring: 0, owned: false },
  { angle: 291, ring: 2, owned: false }, { angle: 318, ring: 1, owned: true }, { angle: 344, ring: 0, owned: false },
  { angle: 40, ring: 2, owned: false }, { angle: 110, ring: 1, owned: false }, { angle: 276, ring: 1, owned: false },
]

/** La corrida real «México × Salud» (15-10-2026) */
const COUNTERS: readonly { label: L; value: number; accent?: boolean }[] = [
  { label: { es: 'Fichas leídas en HubSpot', en: 'HubSpot records read' }, value: 33 },
  { label: { es: 'Confirmadas libres', en: 'Confirmed free' }, value: 20 },
  { label: { es: 'Listas para revisar', en: 'Ready to review' }, value: 10, accent: true },
  { label: { es: 'Créditos de pago', en: 'Paid credits' }, value: 0 },
]

const point = (angle: number, r: number) => {
  const a = ((angle - 90) * Math.PI) / 180
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }
}
/** La cuña del barrido: 40° detrás de la aguja */
const WEDGE = (() => {
  const a = point(0, 210)
  const b = point(-40, 210)
  return `M${C} ${C} L${a.x} ${a.y} A210 210 0 0 0 ${b.x} ${b.y} Z`
})()

/**
 * Agente 1 · Empresas: un radar que barre de lo gratis (adentro) a lo de bajo
 * costo (afuera). Cada empresa se enciende cuando la aguja pasa: verde si está
 * libre, roja si ya tiene dueño. Al lado, los contadores de una corrida real.
 */
export function Agent1Radar() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -20% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setInterval(() => setElapsed((e) => (e + 100) % LOOP_MS), 100)
    return () => window.clearInterval(id)
  }, [inView, reducedMotion])

  const k = reducedMotion ? 1 : Math.min(1, elapsed / COUNT_MS)
  const play = inView && !reducedMotion ? 'running' : 'paused'

  return (
    <div ref={rootRef} className="mx-auto grid max-w-[920px] items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto w-full max-w-[460px] overflow-visible" role="img" aria-label={t({ es: 'Radar del agente 1: busca primero en lo gratis y marca las empresas libres', en: 'Agent 1 radar: searches free sources first and marks unowned companies' })}>
        <defs>
          <linearGradient id="su-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgb(var(--signal))" stopOpacity="0" />
            <stop offset="1" stopColor="rgb(var(--signal))" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {RINGS.map((ring) => (
          <g key={ring.r}>
            <circle cx={C} cy={C} r={ring.r} fill="none" stroke="white" strokeOpacity={0.1} />
            <text x={C + 6} y={C - ring.r + 16} className="fill-paper font-mono uppercase" fontSize={10} letterSpacing="0.12em" opacity={0.4}>{t(ring.label)}</text>
          </g>
        ))}
        <line x1={C - 210} y1={C} x2={C + 210} y2={C} stroke="white" strokeOpacity={0.05} />
        <line x1={C} y1={C - 210} x2={C} y2={C + 210} stroke="white" strokeOpacity={0.05} />

        {/* El barrido */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: `su-spin ${SWEEP_MS}ms linear infinite`, animationPlayState: play }}>
          <path d={WEDGE} fill="url(#su-sweep)" style={{ opacity: 0.9 }} />
          <line x1={C} y1={C} x2={C} y2={C - 210} stroke="white" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 6px rgb(var(--signal)))' }} />
        </g>

        {/* Las empresas: se encienden cuando la aguja pasa por encima */}
        {BLIPS.map((b, i) => {
          const p = point(b.angle, RINGS[b.ring].r + ((i * 7) % 14) - 7)
          const color = b.owned ? '#f87171' : RINGS[b.ring].color
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <circle r={3} fill={color} opacity={0.25} />
              <circle
                r={5}
                fill={color}
                className="su-blip"
                style={{ animationDuration: `${SWEEP_MS}ms`, animationDelay: `${(b.angle / 360) * SWEEP_MS}ms`, animationPlayState: play, opacity: reducedMotion ? 0.9 : undefined, filter: `drop-shadow(0 0 6px ${color})` }}
              />
            </g>
          )
        })}
        <circle cx={C} cy={C} r={6} fill="#fffaf0" style={{ filter: 'drop-shadow(0 0 8px rgb(var(--signal)))' }} />
      </svg>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">{t({ es: 'Corrida real · México × Salud', en: 'Real run · Mexico × Healthcare' })}</p>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7">
          {COUNTERS.map((c) => (
            <div key={c.label.es}>
              <dd className={`text-[clamp(2rem,1.4rem+2vw,3.2rem)] font-light leading-none tabular-nums ${c.accent ? 'text-signal' : ''}`}>{Math.round(c.value * k)}</dd>
              <dt className="mt-2 text-[13px] leading-snug text-paper/55">{t(c.label)}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-paper/55">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#34d399]" />{t({ es: 'Libre', en: 'Free' })}</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#38bdf8]" />{t({ es: 'Bajo costo', en: 'Low cost' })}</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f87171]" />{t({ es: 'Ya tiene dueño', en: 'Already owned' })}</span>
        </p>
      </div>
    </div>
  )
}
