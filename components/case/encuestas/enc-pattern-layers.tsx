'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import type { Finding } from '@/lib/content/cases/encuestas/types'
import { useAutoplay } from '../objetivos/use-autoplay'
import { useMedia, TABLET_QUERY } from '../objetivos/use-media'

type Area = Finding['area']

/** Las cinco partes del producto donde aparecen los hallazgos, y a qué idea llevan */
const AREAS: readonly { id: Area; name: L; to: readonly number[] }[] = [
  { id: 'lista', name: { es: 'Lista', en: 'List' }, to: [1] },
  { id: 'constructor', name: { es: 'Constructor', en: 'Builder' }, to: [1] },
  { id: 'carga', name: { es: 'Carga histórica', en: 'History upload' }, to: [2] },
  { id: 'resultados', name: { es: 'Resultados', en: 'Results' }, to: [1, 0] },
  { id: 'privacidad', name: { es: 'Privacidad', en: 'Privacy' }, to: [0] },
]
/** Las tres ideas, en corto (la frase completa sale al tocarlas) */
/** En teléfono, las ideas van abajo y en corto */
const INSIGHT_NAMES_PHONE: readonly [L, L][] = [
  [{ es: 'Privacidad', en: 'Privacy' }, { es: 'en todo', en: 'everywhere' }],
  [{ es: 'Una vista,', en: 'One view,' }, { es: 'una pregunta', en: 'one question' }],
  [{ es: 'Histórico,', en: 'History,' }, { es: 'línea base', en: 'baseline' }],
]
const INSIGHT_NAMES: readonly [L, L][] = [
  [{ es: 'La privacidad viaja', en: 'Privacy travels' }, { es: 'a cada pantalla', en: 'to every screen' }],
  [{ es: 'Una vista,', en: 'One view,' }, { es: 'una pregunta', en: 'one question' }],
  [{ es: 'El histórico es', en: 'History is' }, { es: 'la línea base', en: 'the baseline' }],
]
const FINDINGS = ENCUESTAS_CASE.patterns.findings
const INSIGHTS = ENCUESTAS_CASE.patterns.insights

interface Pt {
  x: number
  y: number
}
/** La capa en escritorio (partes a la izquierda, ideas a la derecha) o en teléfono (partes arriba, ideas abajo) */
interface Layout {
  w: number
  h: number
  area: (i: number) => Pt
  insight: (j: number) => Pt
  /** Dónde va el nombre de la parte y hacia dónde se alinea */
  areaText: (i: number) => Pt & { anchor: 'start' | 'end' }
  insightText: (j: number) => Pt & { anchor: 'start' | 'middle' }
  link: (i: number, j: number) => string
}
const DESKTOP: Layout = {
  w: 900,
  h: 440,
  area: (i) => ({ x: 250, y: 50 + i * 85 }),
  insight: (j) => ({ x: 610, y: 100 + j * 120 }),
  areaText: (i) => ({ x: 216, y: 50 + i * 85, anchor: 'end' }),
  insightText: (j) => ({ x: 654, y: 88 + j * 120, anchor: 'start' }),
  link(i, j) {
    const a = this.area(i)
    const b = this.insight(j)
    const mx = (a.x + b.x) / 2
    return `M${a.x} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`
  },
}
const PHONE: Layout = {
  w: 500,
  h: 600,
  area: (i) => ({ x: 44, y: 34 + i * 68 }),
  insight: (j) => ({ x: 90 + j * 160, y: 450 }),
  areaText: (i) => ({ x: 80, y: 34 + i * 68, anchor: 'start' }),
  insightText: (j) => ({ x: 90 + j * 160, y: 506, anchor: 'middle' }),
  link(i, j) {
    const a = this.area(i)
    const b = this.insight(j)
    return `M${a.x} ${a.y} C${a.x + 240} ${a.y} ${b.x} ${b.y - 140} ${b.x} ${b.y}`
  },
}
const STEP_MS = 2600

type Pick = { kind: 'area'; i: number } | { kind: 'insight'; j: number } | null
const keyOf = (p: Pick) => (p === null ? 'none' : p.kind === 'area' ? `a${p.i}` : `i${p.j}`)

/**
 * 02 · Patrones: una capa de la red. A la izquierda, las cinco partes del
 * producto donde salieron los hallazgos; a la derecha, las tres ideas en que se
 * juntan. Una señal pasa de cada parte a su idea, una tras otra. Tocar una parte
 * muestra sus hallazgos; tocar una idea, la frase completa.
 */
export function EncPatternLayers() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [pick, setPick] = useState<Pick>(null)
  const wide = useMedia(TABLET_QUERY)
  const lay = wide ? DESKTOP : PHONE
  const names = wide ? INSIGHT_NAMES : INSIGHT_NAMES_PHONE
  const { index } = useAutoplay(rootRef, { count: AREAS.length, ms: STEP_MS, loop: true, disabled: reducedMotion, hold: pick !== null })
  const activeArea = pick?.kind === 'area' ? pick.i : pick === null ? index : -1
  const activeInsights = pick?.kind === 'insight' ? [pick.j] : activeArea >= 0 ? AREAS[activeArea].to : []

  const toggle = (next: Exclude<Pick, null>) => setPick((cur) => (keyOf(cur) === keyOf(next) ? null : next))

  const keyed = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }

  return (
    <div ref={rootRef} className="relative mt-6">
      <div className="relative mx-auto w-full max-w-[900px]">
        <svg viewBox={`0 0 ${lay.w} ${lay.h}`} className="block h-auto w-full overflow-visible" role="group" aria-label={t({ es: 'De las partes del producto a las tres ideas', en: 'From product areas to the three ideas' })}>
          <defs>
            <linearGradient id="enc-layer" x1="0" x2="1">
              <stop offset="0" stopColor="rgb(var(--signal))" />
              <stop offset="1" stopColor="rgb(var(--spark))" />
            </linearGradient>
          </defs>
          {AREAS.map((a, i) =>
            a.to.map((j) => {
              const on = i === activeArea || (pick?.kind === 'insight' && pick.j === j)
              return (
                <g key={`${a.id}-${j}`}>
                  <path d={lay.link(i, j)} fill="none" stroke={on ? 'url(#enc-layer)' : 'white'} strokeOpacity={on ? 0.9 : 0.1} strokeWidth={on ? 2 : 1} style={{ transition: 'stroke-opacity .5s' }} />
                  {on && !reducedMotion && <path key={`p-${index}-${keyOf(pick)}`} d={lay.link(i, j)} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.1 0.9" className="ms-pulse" style={{ filter: 'drop-shadow(0 0 6px white)' }} />}
                </g>
              )
            }),
          )}

          {AREAS.map((a, i) => {
            const on = i === activeArea
            const count = FINDINGS.filter((f) => f.area === a.id).length
            return (
              <g key={a.id} role="button" tabIndex={0} aria-pressed={pick?.kind === 'area' && pick.i === i} aria-label={t(a.name)} onClick={() => toggle({ kind: 'area', i })} onKeyDown={keyed(() => toggle({ kind: 'area', i }))} className="cursor-pointer outline-none">
                <rect x={wide ? 0 : lay.area(i).x - 30} y={lay.area(i).y - 30} width={wide ? lay.area(i).x + 24 : lay.w - lay.area(i).x} height={60} fill="transparent" />
                <circle cx={lay.area(i).x} cy={lay.area(i).y} r={22} fill="rgb(var(--signal))" opacity={on ? 0.3 : 0.08} style={{ transition: 'opacity .5s' }} />
                <circle cx={lay.area(i).x} cy={lay.area(i).y} r={7} fill={on ? 'white' : 'rgb(var(--signal))'} stroke="white" strokeWidth={1.4} style={{ transition: 'fill .5s' }} />
                <text x={lay.areaText(i).x} y={lay.areaText(i).y - (wide ? 0 : 8)} dy="0.35em" textAnchor={lay.areaText(i).anchor} className="enc-layer-label fill-current" style={{ opacity: on ? 1 : 0.6, transition: 'opacity .5s' }}>{t(a.name)}</text>
                <text x={lay.areaText(i).x} y={lay.areaText(i).y + (wide ? 22 : 16)} dy="0.35em" textAnchor={lay.areaText(i).anchor} className="enc-layer-sub fill-current font-mono uppercase opacity-40" letterSpacing="0.12em">{count} {t({ es: 'hallazgos', en: 'findings' })}</text>
              </g>
            )
          })}

          {names.map(([l1, l2], j) => {
            const on = activeInsights.includes(j)
            return (
              <g key={l1.es} role="button" tabIndex={0} aria-pressed={pick?.kind === 'insight' && pick.j === j} aria-label={`${t(l1)} ${t(l2)}`} onClick={() => toggle({ kind: 'insight', j })} onKeyDown={keyed(() => toggle({ kind: 'insight', j }))} className="cursor-pointer outline-none">
                <rect x={wide ? lay.insight(j).x - 24 : lay.insight(j).x - 80} y={lay.insight(j).y - 40} width={wide ? lay.w - lay.insight(j).x + 24 : 160} height={wide ? 80 : 130} fill="transparent" />
                <circle cx={lay.insight(j).x} cy={lay.insight(j).y} r={30} fill="#ff54aa" opacity={on ? 0.28 : 0.06} style={{ transition: 'opacity .5s' }} />
                {on && <circle cx={lay.insight(j).x} cy={lay.insight(j).y} r={16} fill="none" stroke="#ff54aa" strokeWidth={1.5} className="dots-hot" />}
                <circle cx={lay.insight(j).x} cy={lay.insight(j).y} r={10} fill={on ? '#fffaf0' : 'rgb(var(--void))'} stroke="white" strokeWidth={1.5} style={{ transition: 'fill .5s' }} />
                {/* De «El histórico es la línea base» sale la fibra hacia «La idea» */}
                {j === names.length - 1 && <circle cx={lay.insight(j).x} cy={lay.insight(j).y} r={1} fill="none" data-fiber-from="enc-idea" />}
                {[l1, l2].map((line, k) => (
                  <text key={k} x={lay.insightText(j).x} y={lay.insightText(j).y + k * 28} dy="0.35em" textAnchor={lay.insightText(j).anchor} className="enc-layer-insight fill-current font-light" style={{ opacity: on ? 1 : 0.55, transition: 'opacity .5s' }}>{t(line)}</text>
                ))}
              </g>
            )
          })}
        </svg>
      </div>

      {/* El detalle solo al tocar: los hallazgos de una parte, o la frase de una idea */}
      <div key={keyOf(pick)} className="obj-fade mx-auto mt-6 min-h-[6rem] max-w-[760px]" aria-live="polite">
        {pick?.kind === 'area' && (
          <ul className="grid gap-4 md:grid-cols-2">
            {FINDINGS.filter((f) => f.area === AREAS[pick.i].id).map((f) => (
              <li key={f.text.es} className="border-l border-signal/50 pl-4 text-sm leading-relaxed text-paper/75">{t(f.text)}</li>
            ))}
          </ul>
        )}
        {pick?.kind === 'insight' && <p className="text-balance text-center text-[clamp(1.1rem,0.95rem+0.6vw,1.45rem)] font-light leading-snug">{t(INSIGHTS[pick.j])}</p>}
        {pick === null && <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper/40">{t({ es: 'Toca una parte o una idea', en: 'Tap an area or an idea' })}</p>}
      </div>
    </div>
  )
}
