'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { MINUTES_PER_QUESTION, NORMATIVE_OUTPUT, SPECTRUM, SWITCHES, TIER_LABEL, type SpectrumTemplate, type SwitchState, type Tier } from '@/lib/content/cases/encuestas/idea-spectrum'
import { Lock } from './shared'

const TIERS: readonly Tier[] = ['sencilla', 'robusta', 'normativa']
const TIER_COLOR: Record<Tier, string> = { sencilla: '#4cc38a', robusta: '#5b8cff', normativa: '#ff8a4c' }
const STEP_MS = 3600
const DOTS_PER_ROW = 5
const SECTIONS_SHOWN = 5

const questionsOf = (tpl: SpectrumTemplate) => tpl.sections.reduce((s, x) => s + x.questions, 0)
/** Igual que `measureTemplate` del producto: al menos 1 minuto, redondeado. */
const minutesOf = (q: number) => (q === 0 ? 0 : Math.max(1, Math.round(q * MINUTES_PER_QUESTION)))

/** Avanza solo mientras está a la vista; se queda quieta en cuanto alguien elige una plantilla. */
function useAutoAdvance(count: number, box: React.RefObject<HTMLElement | null>) {
  const { reducedMotion } = useA11y()
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
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
  return { index, pick, setHover, visible, playing: auto && !hover && visible && !reducedMotion }
}

/** El horizonte: cada plantilla es una columna de puntos, una por pregunta, de la más sencilla a la normativa. */
function Skyline({ index, onPick, shown }: { index: number; onPick: (i: number) => void; shown: boolean }) {
  const { t } = useLocale()
  return (
    <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] items-end gap-1.5 sm:gap-4">
      {SPECTRUM.map((tpl, i) => {
        const q = questionsOf(tpl)
        const on = i === index
        const color = TIER_COLOR[tpl.tier]
        return (
          <button key={tpl.id} type="button" onClick={() => onPick(i)} aria-pressed={on} aria-label={`${t(tpl.name)} · ${q}`} className="group flex flex-col items-center gap-2 focus-visible:outline-none">
            <span className="font-mono text-[10px] tabular-nums transition-colors sm:text-xs" style={{ color: on ? color : 'rgba(255,255,255,0.4)' }}>{q}</span>
            <span
              className="grid gap-[2px] transition-[filter,opacity] duration-500 group-hover:opacity-100 sm:gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${DOTS_PER_ROW}, minmax(0, 1fr))`, opacity: on ? 1 : 0.38, filter: on ? `drop-shadow(0 0 10px ${color}80)` : 'none' }}
            >
              {Array.from({ length: q }, (_, d) => {
                // Se apilan de abajo hacia arriba: la fila de la pregunta d se cuenta desde el suelo.
                const row = Math.floor(d / DOTS_PER_ROW)
                const rows = Math.ceil(q / DOTS_PER_ROW)
                return (
                  <span
                    key={d}
                    className={`block aspect-square w-[5px] rounded-[1.5px] sm:w-[7px] ${shown ? 'enc-pop' : 'opacity-0'}`}
                    style={{ background: color, gridRow: rows - row, gridColumn: (d % DOTS_PER_ROW) + 1, animationDelay: `${i * 90 + row * 35}ms` }}
                  />
                )
              })}
            </span>
            <span className={`h-0.5 w-full rounded-full transition-colors ${on ? '' : 'bg-white/10'}`} style={on ? { background: color } : undefined} />
            <span className={`hidden text-center text-[11px] leading-tight transition-colors sm:block ${on ? 'text-white' : 'text-white/45'}`}>{t(tpl.name)}</span>
          </button>
        )
      })}
    </div>
  )
}

function Toggle({ state, color, label }: { state: SwitchState; color: string; label: string }) {
  const on = state !== 'off'
  return (
    <li className="flex items-center justify-between gap-3 py-1.5 text-[13px]">
      <span className={`transition-colors duration-500 ${state === 'off' ? 'text-white/35' : 'text-white/85'}`}>{label}</span>
      <span className="relative h-5 w-9 shrink-0 rounded-full transition-colors duration-500" style={{ background: on ? color : 'rgba(255,255,255,0.12)' }} aria-hidden="true">
        <span className={`absolute top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#0e1116] shadow transition-transform duration-500 ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`}>
          {state === 'locked' && <Lock className="h-2.5 w-2.5" />}
        </span>
      </span>
    </li>
  )
}

/** La plantilla abierta en el constructor: secciones numeradas, sus preguntas y, en la norma, los dominios. */
function BuilderMock({ tpl }: { tpl: SpectrumTemplate }) {
  const { t } = useLocale()
  const color = TIER_COLOR[tpl.tier]
  const q = questionsOf(tpl)
  const rest = tpl.sections.length - SECTIONS_SHOWN
  return (
    <div className="overflow-hidden rounded-xl bg-white text-[#303a47] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7fb] px-3 py-2" aria-hidden="true">
        <span className="flex gap-1"><span className="h-2 w-2 rounded-full bg-black/15" /><span className="h-2 w-2 rounded-full bg-black/15" /><span className="h-2 w-2 rounded-full bg-black/15" /></span>
        <span className="truncate font-mono text-[10px] text-black/45">/encuestas/crear · {t({ es: 'Secciones y preguntas', en: 'Sections and questions' })}</span>
      </div>
      <div key={tpl.id} className="enc-fade p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: tpl.tier === 'sencilla' ? '#2c8a5c' : tpl.tier === 'robusta' ? '#0c5bef' : '#c2561b' }}>{t(TIER_LABEL[tpl.tier])}</p>
            <p className="text-lg font-semibold leading-tight">{t(tpl.name)}</p>
            <p className="text-xs text-[#5c646f]">{t(tpl.use)}</p>
          </div>
          <p className="flex gap-4 text-right font-mono text-[11px] text-[#5c646f]">
            <span><b className="block text-base text-[#303a47]">{tpl.sections.length}</b>{t({ es: 'secc.', en: 'sect.' })}</span>
            <span><b className="block text-base text-[#303a47]">{q}</b>{t({ es: 'preg.', en: 'q.' })}</span>
            <span><b className="block text-base text-[#303a47]">{minutesOf(q)}′</b>{t({ es: 'min', en: 'min' })}</span>
          </p>
        </div>
        <ul className="mt-4 space-y-1.5">
          {tpl.sections.slice(0, SECTIONS_SHOWN).map((s, i) => (
            <li key={s.title} className="enc-fade" style={{ animationDelay: `${80 + i * 60}ms` }}>
              <div className="flex items-center gap-2 rounded-lg border border-black/[0.07] bg-[#f8faff] px-2.5 py-1.5">
                <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-white" style={{ background: color }}>{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{s.title}</span>
                <span className="flex gap-[3px]" aria-hidden="true">
                  {Array.from({ length: Math.min(s.questions, 10) }, (_, d) => <span key={d} className="h-1.5 w-1.5 rounded-full" style={{ background: color, opacity: 0.75 }} />)}
                </span>
                {tpl.tier === 'normativa' && <Lock className="h-3 w-3 shrink-0 text-[#979ba3]" />}
              </div>
              {s.sub && (
                <div className="ml-6 mt-1 flex flex-wrap gap-1">
                  {Array.from({ length: s.sub }, (_, k) => (
                    <span key={k} className="rounded-md border border-dashed border-[#f0b08a] px-1.5 py-0.5 font-mono text-[10px] text-[#c2561b]">
                      {i + 1}.{k + 1} {t({ es: 'dominio', en: 'domain' })}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
          {rest > 0 && <li className="px-2.5 pt-1 text-xs text-[#979ba3]">+ {rest} {t({ es: 'secciones más', en: 'more sections' })}</li>}
        </ul>
      </div>
    </div>
  )
}

/** El eje de la idea: un solo constructor que arma desde un pulso de 5 preguntas hasta la NOM 035. */
export function TemplateSpectrum() {
  const { t } = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const { index, pick, setHover, visible, playing } = useAutoAdvance(SPECTRUM.length, box)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (visible) setShown(true)
  }, [visible])
  const tpl = SPECTRUM[index]
  const color = TIER_COLOR[tpl.tier]
  const normative = tpl.tier === 'normativa'

  return (
    <div
      ref={box}
      data-reveal
      className="relative overflow-hidden rounded-3xl bg-[#0e1116] p-5 text-white ring-1 ring-white/10 sm:p-8"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[90%] -translate-x-1/2 rounded-full opacity-60 transition-[background] duration-1000" style={{ background: `radial-gradient(closest-side, ${color}33, transparent)` }} aria-hidden="true" />

      <div className="relative">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <p className="mono-label text-white/60">{t({ es: 'Un constructor · siete plantillas', en: 'One builder · seven templates' })}</p>
          <p className="flex gap-4 font-mono text-[10px] uppercase tracking-wider">
            {TIERS.map((tier) => (
              <span key={tier} className="flex items-center gap-1.5 transition-opacity" style={{ color: TIER_COLOR[tier], opacity: tier === tpl.tier ? 1 : 0.45 }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: TIER_COLOR[tier] }} />
                {t(TIER_LABEL[tier])}
              </span>
            ))}
          </p>
        </div>

        <Skyline index={index} onPick={pick} shown={shown} />
        <div className="mt-3 h-px overflow-hidden bg-white/10" aria-hidden="true">
          {playing && <span key={index} className="block h-full origin-left" style={{ background: color, animation: `enc-grow ${STEP_MS}ms linear both` }} />}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
          <BuilderMock tpl={tpl} />
          <div>
            <p className="text-xs font-semibold text-white/70">{normative ? t({ es: 'Lo que enciende la norma', en: 'What the standard switches on' }) : t({ es: 'Lo que ajusta la empresa', en: 'What the company adjusts' })}</p>
            <ul className="mt-2 divide-y divide-white/[0.06]">
              {SWITCHES.map((s) => (
                <Toggle key={s.id} state={normative ? s.nom : s.org} color={color} label={t(s.label)} />
              ))}
            </ul>
            {normative && NORMATIVE_OUTPUT[tpl.id] && (
              <p key={tpl.id} className="enc-fade mt-4 rounded-lg px-3 py-2 text-xs leading-snug" style={{ background: `${color}1f`, color }}>{t(NORMATIVE_OUTPUT[tpl.id])}</p>
            )}
            <p className="mt-4 text-[11px] leading-snug text-white/45">
              {t({ es: 'Mismo constructor, mismo modelo de secciones: lo que cambia son los interruptores.', en: 'Same builder, same section model: what changes are the switches.' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
