'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { SPECTRUM, TIER_LABEL, NORMATIVE_OUTPUT, MINUTES_PER_QUESTION, type Tier } from '@/lib/content/cases/encuestas/idea-spectrum'
import { useAutoplay } from '../objetivos/use-autoplay'
import { useMedia, TABLET_QUERY } from '../objetivos/use-media'
import { FanPhone } from './phone/fan-phone'

/** El abanico en escritorio: nombre y puntos en la misma fila (el teléfono tiene su propia composición) */
interface FanLayout {
  w: number
  h: number
  source: { x: number; y: number }
  /** Dónde llega la fibra de cada fila, dónde van el nombre y la primera pregunta */
  rowY: (i: number) => number
  start: number
  name: { dx: number; dy: number }
  dots: { x: number; dy: number; step: number }
  tier: boolean
}
const DESKTOP: FanLayout = {
  w: 900,
  h: 470,
  source: { x: 70, y: 235 },
  rowY: (i) => 45 + i * 63,
  start: 250,
  name: { dx: 8, dy: -7 },
  dots: { x: 452, dy: 0, step: 8.6 },
  tier: true,
}
const fiberOf = (l: FanLayout, i: number) =>
  `M${l.source.x} ${l.source.y} C${l.source.x + (l.start - l.source.x) * 0.45} ${l.source.y} ${l.start - (l.start - l.source.x) * 0.45} ${l.rowY(i)} ${l.start - 14} ${l.rowY(i)}`
const TIER_COLOR: Record<Tier, string> = { sencilla: 'rgb(var(--signal))', robusta: 'rgb(var(--glow))', normativa: '#ff54aa' }
const STEP_MS = 2400

const questionsOf = (i: number) => SPECTRUM[i].sections.reduce((n, s) => n + s.questions, 0)

/**
 * 03 · La idea: un solo constructor del que salen las siete plantillas reales
 * del catálogo, de la sencilla a la normativa. Cada punto es una pregunta. Se
 * encienden una tras otra; tocar una dice para qué sirve y cuánto toma.
 */
export function EncBuilderFan() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const wide = useMedia(TABLET_QUERY)
  const lay = DESKTOP
  const { index } = useAutoplay(rootRef, { count: SPECTRUM.length, ms: STEP_MS, loop: true, disabled: reducedMotion, hold: picked !== null })
  const active = picked ?? index
  const tpl = SPECTRUM[active]
  const q = questionsOf(active)

  const meta = `${t(TIER_LABEL[tpl.tier])} · ${q} ${t({ es: 'preguntas', en: 'questions' })} · ${tpl.sections.length} ${t({ es: 'secciones', en: 'sections' })} · ~${Math.round(q * MINUTES_PER_QUESTION)} min${NORMATIVE_OUTPUT[tpl.id] ? ` · ${t(NORMATIVE_OUTPUT[tpl.id])}` : ''}`

  if (!wide) {
    return (
      <div ref={rootRef}>
        <FanPhone
          rows={SPECTRUM.map((s, i) => ({ id: s.id, name: s.name, tierLabel: TIER_LABEL[s.tier], color: TIER_COLOR[s.tier], questions: questionsOf(i) }))}
          active={active}
          picked={picked}
          onPick={(i) => setPicked(picked === i ? null : i)}
          detail={{ use: t(tpl.use), meta }}
          principles={ENCUESTAS_CASE.idea.principles.map((p) => p.title)}
          reducedMotion={reducedMotion}
        />
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative mt-6">
      <div className="relative mx-auto w-full max-w-[900px]">
        <svg viewBox={`0 0 ${lay.w} ${lay.h}`} className="block h-auto w-full overflow-visible" role="group" aria-label={t({ es: 'Un constructor, siete plantillas', en: 'One builder, seven templates' })}>
          {SPECTRUM.map((s, i) => {
            const on = i === active
            return (
              <g key={s.id}>
                <path d={fiberOf(lay, i)} fill="none" stroke={on ? TIER_COLOR[s.tier] : 'white'} strokeOpacity={on ? 0.9 : 0.12} strokeWidth={on ? 2 : 1} style={{ transition: 'stroke-opacity .5s, stroke .5s' }} />
                {on && !reducedMotion && <path key={`p-${active}`} d={fiberOf(lay, i)} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.1 0.9" className="ms-pulse" style={{ filter: 'drop-shadow(0 0 6px white)' }} />}
              </g>
            )
          })}

          {/* El constructor: un solo nodo */}
          <circle cx={lay.source.x} cy={lay.source.y} r={34} fill="rgb(var(--signal) / 0.14)" />
          <circle cx={lay.source.x} cy={lay.source.y} r={11} fill="#fffaf0" stroke="white" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 12px rgb(var(--signal)))' }} />
          {/* Del constructor sale la fibra hacia «Bocetos» */}
          <circle cx={lay.source.x} cy={lay.source.y} r={1} fill="none" data-fiber-from="enc-bocetos" />
          <text x={lay.tier ? lay.source.x : 0} y={lay.source.y + (lay.tier ? 58 : 44)} textAnchor={lay.tier ? "middle" : "start"} className="enc-fan-sub fill-current font-mono uppercase opacity-60" letterSpacing="0.12em">{t({ es: 'Un constructor', en: 'One builder' })}</text>

          {SPECTRUM.map((s, i) => {
            const on = i === active
            const n = questionsOf(i)
            const choose = () => setPicked(picked === i ? null : i)
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={picked === i}
                aria-label={t(s.name)}
                onClick={choose}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    choose()
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <rect x={lay.start - 20} y={lay.rowY(i) - 28} width={lay.w - lay.start + 20} height={56} fill="transparent" />
                <circle cx={lay.start - 8} cy={lay.rowY(i)} r={on ? 6 : 4} fill={on ? TIER_COLOR[s.tier] : 'rgb(var(--void))'} stroke="white" strokeOpacity={on ? 1 : 0.5} style={{ transition: 'all .4s' }} />
                <text x={lay.start + lay.name.dx} y={lay.rowY(i) + lay.name.dy} dy="0.35em" className="enc-fan-name fill-current" style={{ opacity: on ? 1 : 0.6, transition: 'opacity .4s' }}>{t(s.name)}</text>
                {lay.tier && <text x={lay.start + 8} y={lay.rowY(i) + 14} dy="0.35em" className="enc-fan-sub fill-current font-mono uppercase" letterSpacing="0.12em" style={{ fill: TIER_COLOR[s.tier], opacity: on ? 0.95 : 0.45 }}>{t(TIER_LABEL[s.tier])} · {n}</text>}
                {Array.from({ length: n }, (_, k) => (
                  <circle
                    key={k}
                    cx={lay.dots.x + k * lay.dots.step}
                    cy={lay.rowY(i) + lay.dots.dy}
                    r={on ? 3 : 2.2}
                    fill={on ? TIER_COLOR[s.tier] : 'white'}
                    opacity={on ? 1 : 0.22}
                    style={{ transition: `opacity .3s ${on && !reducedMotion ? k * 12 : 0}ms, r .3s, fill .3s` }}
                  />
                ))}
              </g>
            )
          })}
        </svg>
      </div>

      {/* La plantilla en lectura: para qué sirve y cuánto toma */}
      <div key={active} className="obj-fade mx-auto mt-6 flex min-h-[4.5rem] max-w-[62ch] flex-col items-center text-center" aria-live="polite">
        <p className="text-balance text-[clamp(1.1rem,0.95rem+0.6vw,1.45rem)] font-light leading-snug">{t(tpl.use)}</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">
          {t(TIER_LABEL[tpl.tier])} · {q} {t({ es: 'preguntas', en: 'questions' })} · {tpl.sections.length} {t({ es: 'secciones', en: 'sections' })} · ~{Math.round(q * MINUTES_PER_QUESTION)} min
          {NORMATIVE_OUTPUT[tpl.id] ? ` · ${t(NORMATIVE_OUTPUT[tpl.id])}` : ''}
        </p>
      </div>

      {/* Los cuatro principios del modelo, en una línea cada uno */}
      <ol className="mx-auto mt-14 grid max-w-[980px] gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {ENCUESTAS_CASE.idea.principles.map((p, i) => (
          <li key={p.title.es} data-reveal className="flex items-start gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/25 font-mono text-[10px]">{i + 1}</span>
            <span className="text-[15px] leading-snug text-paper/85">{t(p.title)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
