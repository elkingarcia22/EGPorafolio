'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { EDITABLE, MINUTES_PER_QUESTION, NORMATIVE, NORMATIVE_OUTPUT, SPECTRUM, TIER_LABEL, type SpectrumTemplate, type Tier } from '@/lib/content/cases/encuestas/idea-spectrum'
import { Lock, UBITS_BLUE } from './shared'

const TIERS: readonly Tier[] = ['sencilla', 'robusta', 'normativa']
const TIER_COLOR: Record<Tier, string> = { sencilla: '#43a970', robusta: UBITS_BLUE, normativa: '#e8743b' }
const STEP_MS = 3400
/** La plantilla más grande del catálogo (Clima o Cultura completa): la escala de la barra. */
const MAX_QUESTIONS = 50

const questionsOf = (tpl: SpectrumTemplate) => tpl.sections.reduce((s, x) => s + x.questions, 0)
/** Igual que `measureTemplate` del producto: al menos 1 minuto, redondeado. */
const minutesOf = (q: number) => (q === 0 ? 0 : Math.max(1, Math.round(q * MINUTES_PER_QUESTION)))

/** Avanza solo por las plantillas mientras está a la vista; se detiene al tocarla. */
function useAutoAdvance(count: number, box: React.RefObject<HTMLElement | null>) {
  const { reducedMotion } = useA11y()
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [box])

  useEffect(() => {
    if (!auto || hover || !visible || reducedMotion) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), STEP_MS)
    return () => window.clearTimeout(id)
  }, [auto, hover, visible, reducedMotion, index, count])

  const pick = (i: number) => {
    setAuto(false)
    setIndex(i)
  }
  return { index, pick, setHover, playing: auto && !hover && visible && !reducedMotion }
}

function Stat({ value, label }: { value: string | number; label: L }) {
  const { t } = useLocale()
  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-[#5c646f]">{t(label)}</p>
    </div>
  )
}

/** La plantilla elegida como plano: cada sección con sus preguntas como puntos y, si los tiene, sus dominios. */
function Blueprint({ tpl }: { tpl: SpectrumTemplate }) {
  const { t } = useLocale()
  const color = TIER_COLOR[tpl.tier]
  let delay = 0
  return (
    <ul key={tpl.id} className="space-y-1.5">
      {tpl.sections.map((s, i) => (
        <li key={s.title} className="enc-fade grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-3 sm:grid-cols-[minmax(0,14rem)_1fr]" style={{ animationDelay: `${i * 40}ms` }}>
          <span className="flex min-w-0 items-center gap-2 text-xs">
            <span className="shrink-0 rounded px-1 font-mono text-[10px] text-white" style={{ background: color }}>{i + 1}</span>
            <span className="truncate">{s.title}</span>
          </span>
          <span className="flex flex-wrap items-center gap-1">
            {Array.from({ length: s.questions }, (_, q) => {
              delay += 18
              return <span key={q} className="enc-pop block h-2.5 w-2.5 rounded-[3px]" style={{ background: color, animationDelay: `${delay}ms` }} />
            })}
            {s.sub && (
              <span className="ml-1 rounded-full bg-[#fdf0e8] px-1.5 py-px font-mono text-[9px] text-[#b4531f]">
                {s.sub} {t(s.sub === 1 ? { es: 'dominio', en: 'domain' } : { es: 'dominios', en: 'domains' })}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** El eje de la idea: un solo constructor que arma desde un pulso de 5 preguntas hasta la NOM 035. */
export function TemplateSpectrum() {
  const { t } = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const { index, pick, setHover, playing } = useAutoAdvance(SPECTRUM.length, box)
  const tpl = SPECTRUM[index]
  const q = questionsOf(tpl)
  const normative = tpl.tier === 'normativa'
  const rules = normative ? NORMATIVE : EDITABLE

  return (
    <div ref={box} data-reveal className="overflow-hidden rounded-2xl bg-[#f8faff] text-[#303a47] ring-1 ring-black/10" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      {/* Las plantillas del catálogo, ordenadas de la más sencilla a la normativa. */}
      <div className="grid gap-4 border-b border-black/10 bg-white p-4 sm:grid-cols-3 sm:p-5">
        {TIERS.map((tier) => (
          <div key={tier}>
            <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: TIER_COLOR[tier] }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: TIER_COLOR[tier] }} />
              {t(TIER_LABEL[tier])}
            </p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t(TIER_LABEL[tier])}>
              {SPECTRUM.map((x, i) =>
                x.tier !== tier ? null : (
                  <button
                    key={x.id}
                    type="button"
                    aria-pressed={i === index}
                    onClick={() => pick(i)}
                    className="relative overflow-hidden rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
                    style={i === index ? { borderColor: TIER_COLOR[tier], color: TIER_COLOR[tier], background: `${TIER_COLOR[tier]}12`, fontWeight: 600 } : { borderColor: '#d0d2d5' }}
                  >
                    {t(x.name)}
                    {i === index && playing && <span key={`${x.id}-bar`} className="absolute bottom-0 left-0 h-0.5 w-full origin-left" style={{ background: TIER_COLOR[tier], animation: `enc-grow ${STEP_MS}ms linear both` }} />}
                  </button>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 p-5 sm:p-6">
          <div key={tpl.id} className="enc-fade flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{t(tpl.name)}</p>
              <p className="text-sm text-[#5c646f]">{t(tpl.use)}</p>
            </div>
            <div className="flex gap-6">
              <Stat value={tpl.sections.length} label={{ es: 'secciones', en: 'sections' }} />
              <Stat value={q} label={{ es: 'preguntas', en: 'questions' }} />
              <Stat value={`${minutesOf(q)} min`} label={{ es: 'estimado', en: 'estimated' }} />
              <Stat value={tpl.levels} label={tpl.levels === 1 ? { es: 'nivel', en: 'level' } : { es: 'niveles', en: 'levels' }} />
            </div>
          </div>

          {/* Qué tan grande es, frente a la plantilla más grande del catálogo. */}
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#ecf1fa]" aria-hidden="true">
            <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${(q / MAX_QUESTIONS) * 100}%`, background: TIER_COLOR[tpl.tier] }} />
          </div>

          <div className="mt-6">
            <Blueprint tpl={tpl} />
          </div>
        </div>

        <aside className="border-t border-black/10 bg-white p-5 md:border-l md:border-t-0">
          <p className="text-xs font-semibold">{normative ? t({ es: 'Lo que pone la norma', en: 'What the standard sets' }) : t({ es: 'Lo que decide la empresa', en: 'What the company decides' })}</p>
          <ul key={tpl.tier} className="mt-3 space-y-2">
            {rules.map((r, i) => (
              <li key={r.id} className="enc-fade flex items-start gap-2 text-sm leading-snug" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] text-white" style={{ background: TIER_COLOR[tpl.tier] }}>
                  {normative ? <Lock className="h-2.5 w-2.5" /> : '✓'}
                </span>
                {t(r.label)}
              </li>
            ))}
          </ul>
          {normative && NORMATIVE_OUTPUT[tpl.id] && (
            <p key={tpl.id} className="enc-fade mt-4 rounded-lg bg-[#fdf0e8] px-3 py-2 text-xs leading-snug text-[#b4531f]">{t(NORMATIVE_OUTPUT[tpl.id])}</p>
          )}
          <p className="mt-4 text-[11px] leading-snug text-[#979ba3]">
            {t({ es: 'El mismo constructor y el mismo modelo de secciones en las siete: cambian las reglas que se encienden.', en: 'The same builder and the same section model in all seven: what changes is which rules switch on.' })}
          </p>
        </aside>
      </div>
    </div>
  )
}
