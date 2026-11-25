'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { useNarrow } from './camera'

/** Lienzo del campo (unidades del SVG): ancho en escritorio, alto en teléfono (puntos a tamaño legible) */
interface Grid {
  w: number
  h: number
  cols: number
  rows: number
}
const WIDE: Grid = { w: 900, h: 340, cols: 30, rows: 11 }
const TALL: Grid = { w: 360, h: 400, cols: 13, rows: 15 }
/** Pasos: 0 el universo · 1 a mano y pagando · 2 el ruido · 3 lo gratis sin usar · 4 la empresa que sí */
const LAST = 4
/** Cuánto se queda cada paso mientras pasa solo (ms) */
const STEP_MS = 2600
/** Lo elegido con un toque se queda esto antes de que la lectura siga sola (ms) */
const RESUME_MS = 9000

type Kind = 'paid' | 'noise' | 'free' | 'none'

interface Dot {
  x: number
  y: number
  kind: Kind
  /** Orden en que se enciende dentro de su grupo (0–1) */
  delay: number
}

/** Pseudoaleatorio con semilla: el campo es siempre el mismo (sin saltos entre servidor y cliente) */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildField({ w, h, cols, rows }: Grid): readonly Dot[] {
  const rand = seeded(42)
  const dots: Dot[] = []
  const gapX = (w - 60) / (cols - 1)
  const gapY = (h - 60) / (rows - 1)
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const roll = rand()
      const kind: Kind = roll < 0.07 ? 'paid' : roll < 0.15 ? 'noise' : roll < 0.3 ? 'free' : 'none'
      const jitter = (rand() - 0.5) * 6
      dots.push({ x: 30 + c * gapX + jitter, y: 30 + r * gapY + (rand() - 0.5) * 6, kind, delay: rand() })
    }
  }
  return dots
}

/** La empresa que sí: el último punto del campo. De ella sale la fibra a «Patrones». */
function pickOf(dots: readonly Dot[], { w, h }: Grid): number {
  // El último punto del campo (abajo a la derecha): de ahí la fibra sale hacia afuera sin cruzar los demás
  const dist = (d: Dot) => Math.abs(d.x - w) + Math.abs(d.y - h)
  return dots.reduce((best, d, i) => (dist(d) < dist(dots[best]) ? i : best), 0)
}

const KIND_STEP: Record<Exclude<Kind, 'none'>, number> = { paid: 1, noise: 2, free: 3 }
const KIND_COLOR: Record<Exclude<Kind, 'none'>, string> = { paid: '#f59e0b', noise: '#f87171', free: '#34d399' }

interface StepCopy {
  tag: L
  title: L
  body?: L
}

/**
 * 01 · Los puntos: las 206.000 empresas como un campo de puntos que se lee
 * solo al entrar. Primero el universo; luego, uno por uno, los tres problemas
 * (buscar pagando, el ruido en HubSpot, lo gratis que nadie usaba) y al final
 * se apaga todo menos una empresa: la que sí hay que llamar.
 */
export function SellUpDots() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { dots } = SELLUP_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const grid = useNarrow() ? TALL : WIDE
  const field = useMemo(() => buildField(grid), [grid])
  const pick = useMemo(() => pickOf(field, grid), [field, grid])
  const [step, setStep] = useState(reducedMotion ? LAST : 0)
  const [inView, setInView] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (!inView || reducedMotion || step >= LAST || picked !== null) return
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 1200 : STEP_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, step, picked])

  // Lo elegido con un toque se queda un rato y luego la lectura sigue sola.
  useEffect(() => {
    if (picked === null || reducedMotion) return
    const id = window.setTimeout(() => setPicked(null), RESUME_MS)
    return () => window.clearTimeout(id)
  }, [picked, reducedMotion])

  /** Qué se ve: el paso elegido con un toque, o el que va pasando solo */
  const view = picked ?? step
  const steps: readonly StepCopy[] = [
    { tag: { es: 'El universo', en: 'The universe' }, title: dots.kicker },
    ...dots.seen.map((s, i) => ({ tag: { es: `0${i + 1}`, en: `0${i + 1}` }, title: s.title, body: s.body })),
    { tag: { es: 'Lo que hacía falta', en: 'What was needed' }, title: { es: 'Una empresa libre, la persona que decide y qué decirle.', en: 'One free company, the person who decides and what to say.' } },
  ]
  const copy = steps[view]

  return (
    <div ref={rootRef}>
      <CaseLead className="mb-8">{t({ es: 'Más de 200 empleados, 20 países. El equipo buscaba a mano, pagaba créditos sin saber cuánto y llenaba HubSpot de ruido.', en: 'Over 200 employees, 20 countries. The team searched by hand, paid credits blindly and filled HubSpot with noise.' })}</CaseLead>

      {/* Lo que dice el paso: una frase sobre el campo */}
      <div key={view} className="su-fade mx-auto flex min-h-[6.5rem] max-w-[62ch] flex-col items-center justify-end text-center">
        <p className="mono-label text-signal">{t(copy.tag)}</p>
        <p className="mt-3 text-balance text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] font-light leading-[1.2] tracking-tight">{t(copy.title)}</p>
        {picked !== null && copy.body && <p className="mt-3 max-w-[56ch] text-balance text-sm leading-relaxed text-paper/60">{t(copy.body)}</p>}
      </div>

      <div className="relative mx-auto mt-6 w-full" style={{ maxWidth: grid.w }}>
        <svg viewBox={`0 0 ${grid.w} ${grid.h}`} className="block h-auto w-full overflow-visible" role="img" aria-label={t(dots.kicker)}>
          {field.map((d, i) => {
            const isPick = i === pick
            const shownKind = d.kind !== 'none' && view >= KIND_STEP[d.kind]
            const focusKind = d.kind !== 'none' && view === KIND_STEP[d.kind]
            const color = shownKind && d.kind !== 'none' ? KIND_COLOR[d.kind] : 'white'
            // Al final se ve todo junto, a media luz, y resalta solo la empresa elegida
            const end = view === LAST
            const opacity = isPick && end ? 0 : shownKind ? (focusKind ? 1 : end ? 0.55 : 0.35) : 0.16
            const r = shownKind && (focusKind || end) ? 3.2 : 2.2
            return (
              <g key={i}>
                {d.kind === 'noise' && focusKind && <circle cx={d.x + 4} cy={d.y - 4} r={2.4} fill="none" stroke="#f87171" strokeOpacity={0.8} style={{ transition: `opacity .5s ${d.delay * 0.8}s` }} />}
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={r}
                  fill={color}
                  style={{ opacity, transition: `opacity .6s ${focusKind ? d.delay * 0.9 : 0}s, fill .6s ${focusKind ? d.delay * 0.9 : 0}s, r .5s` }}
                />
              </g>
            )
          })}
          {/* La empresa que sí: se enciende sola al final, como un nodo con halo */}
          <g transform={`translate(${field[pick].x} ${field[pick].y})`} style={{ opacity: view === LAST ? 1 : 0, transition: 'opacity .8s .3s' }}>
            <circle r={22} fill="rgb(var(--signal))" opacity={0.18} />
            <circle r={10} fill="none" stroke="rgb(var(--signal))" strokeWidth={1.5} className="su-ping" />
            <circle r={7} fill="#fffaf0" stroke="white" strokeWidth={1.4} style={{ filter: 'drop-shadow(0 0 8px rgb(var(--signal)))' }} data-fiber-from="su-patrones" />
          </g>
        </svg>
      </div>

      {/* Los tres problemas como nodos de una línea: se encienden solos; tocar uno lo explica */}
      <ol className="mx-auto mt-8 grid max-w-[760px] grid-cols-3 gap-3">
        {dots.seen.map((s, i) => {
          const at = i + 1
          const kind = (['paid', 'noise', 'free'] as const)[i]
          const on = view === at
          return (
            <li key={s.title.es}>
              <button
                type="button"
                aria-pressed={picked === at}
                onClick={() => setPicked(picked === at ? null : at)}
                className="group flex w-full flex-col items-center gap-2 text-center outline-none"
              >
                <span className="h-2.5 w-2.5 rounded-full transition-transform duration-500" style={{ background: KIND_COLOR[kind], transform: on ? 'scale(1.5)' : 'scale(1)', boxShadow: on ? `0 0 14px ${KIND_COLOR[kind]}` : 'none' }} />
                <span className={`text-balance text-[13px] leading-snug transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`}>{t(s.title)}</span>
              </button>
            </li>
          )
        })}
      </ol>

    </div>
  )
}
