'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useInView } from './use-in-view'
import { ChapterHead } from './chapter-head'

const OK = '#17b26a'
const NO = '#e5484d'
const { ai } = THEMA_CASE

interface Station {
  name: L
  detail: { title: L; body: L | readonly L[] }
}

/** Las estaciones por las que pasa todo lo que escribe la IA (capas del sistema en el caso) */
const STATIONS: readonly Station[] = [
  { name: { es: 'Pedido', en: 'Request' }, detail: { title: ai.layers[2].title, body: ai.layers[2].body } },
  { name: { es: 'Catálogo', en: 'Catalog' }, detail: { title: ai.layers[0].title, body: ai.layers[0].body } },
  { name: { es: 'Guardián', en: 'Guard' }, detail: { title: ai.layers[1].title, body: ai.layers[1].body } },
  { name: { es: 'Validación', en: 'Checks' }, detail: { title: { es: `${ai.checks.length} reglas que revisa`, en: `${ai.checks.length} rules it checks` }, body: ai.checks } },
  { name: { es: 'Código', en: 'Code' }, detail: { title: { es: 'Se cierra validando', en: 'It closes by validating' }, body: ai.rules[ai.rules.length - 1] } },
]
const LAST_STATION = STATIONS.length - 1

/** Lo que la IA intenta escribir, uno tras otro; `stop` = estación que lo frena (null = llega al código) */
const ATTEMPTS: readonly { label: L; stop: number | null }[] = [
  { label: { es: '<KpiCard />', en: '<KpiCard />' }, stop: null },
  { label: { es: 'color="#ff3b30"', en: 'color="#ff3b30"' }, stop: 2 },
  { label: { es: '<DayStrip />', en: '<DayStrip />' }, stop: null },
  { label: { es: 'otra librería de iconos', en: 'another icon library' }, stop: 2 },
  { label: { es: '<svg> pegado', en: 'pasted <svg>' }, stop: 3 },
  { label: { es: '<ClipperOrb />', en: '<ClipperOrb />' }, stop: null },
]

/** Ritmo (ms): tramo entre dos estaciones, pausa al llegar o al frenarse, y espera antes del siguiente */
const PACE = { segment: 260, hold: 900, gap: 200 } as const
type Phase = 'ready' | 'travel' | 'arrived'

const xOf = (station: number) => (station / LAST_STATION) * 100

/**
 * 06 · IA en el proceso, como una línea con cinco estaciones: lo que la IA
 * escribe viaja del pedido al código; las piezas del sistema llegan (verde) y lo
 * que se sale —un HEX a mano, otra librería, un SVG pegado— se frena en el
 * guardián o en la validación (rojo). Tocar una estación muestra qué hace.
 * Del código sale la fibra hacia «Impacto».
 */
export function AiGate() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const { entered, visible } = useInView(rootRef)
  const [k, setK] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [picked, setPicked] = useState<number | null>(null)
  const [tally, setTally] = useState({ passed: 0, stopped: 0 })

  const attempt = ATTEMPTS[k]
  const target = attempt.stop ?? LAST_STATION
  const blocked = attempt.stop !== null

  useEffect(() => {
    if (!entered || !visible || reducedMotion) return
    const wait = phase === 'ready' ? PACE.gap : phase === 'travel' ? PACE.segment * target : PACE.hold
    const id = window.setTimeout(() => {
      if (phase === 'ready') setPhase('travel')
      else if (phase === 'travel') {
        setPhase('arrived')
        setTally((n) => (blocked ? { ...n, stopped: n.stopped + 1 } : { ...n, passed: n.passed + 1 }))
      } else {
        setK((i) => (i + 1) % ATTEMPTS.length)
        setPhase('ready')
      }
    }, wait)
    return () => window.clearTimeout(id)
  }, [entered, visible, reducedMotion, phase, target, blocked])

  const pos = phase === 'ready' ? 0 : xOf(target)
  const arrived = phase === 'arrived'
  const tone = arrived ? (blocked ? NO : OK) : 'rgba(255,255,255,0.85)'
  const station = picked === null ? null : STATIONS[picked]

  return (
    <div ref={rootRef}>
      <ChapterHead phrase={t(chapters.ia.phrase)} lead={t(chapters.ia.lead)} />

      <div className="mx-auto max-w-[900px] px-10 md:px-16">
        <div className="relative h-[170px] md:h-[150px]">
          {/* La línea y la señal que avanza con cada intento */}
          <span aria-hidden="true" className="absolute inset-x-0 top-[88px] h-px bg-white/15" />
          <span
            aria-hidden="true"
            className="absolute left-0 top-[88px] h-px w-full origin-left bg-gradient-to-r from-signal to-[rgb(var(--spark))]"
            style={{
              transform: `scaleX(${pos / 100})`,
              transition: reducedMotion ? 'none' : phase === 'travel' ? `transform ${PACE.segment * target}ms linear` : 'transform 200ms ease-out',
              opacity: phase === 'ready' ? 0 : 0.9,
            }}
          />

          {/* Lo que viaja: una etiqueta de código */}
          {!reducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[22px]"
              style={{ transform: `translateX(${pos}%)`, transition: phase === 'travel' ? `transform ${PACE.segment * target}ms linear` : 'none' }}
            >
              <span
                key={k}
                className={`th-fade absolute left-0 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] transition-[color,border-color,background-color,opacity] duration-300 md:text-[11px] ${arrived && blocked ? 'line-through' : ''}`}
                style={{ color: tone, borderColor: arrived ? tone : 'rgba(255,255,255,0.25)', background: arrived ? `${tone}1f` : 'rgba(255,255,255,0.04)', opacity: arrived && blocked ? 0.85 : 1 }}
              >
                {t(attempt.label)}
              </span>
            </div>
          )}

          {/* Las estaciones */}
          {STATIONS.map((s, i) => {
            const hit = arrived && i === target
            const color = hit ? (blocked ? NO : OK) : null
            const isPicked = picked === i
            return (
              <button
                key={s.name.es}
                type="button"
                aria-pressed={isPicked}
                onClick={() => setPicked(isPicked ? null : i)}
                className="group absolute top-[76px] flex -translate-x-1/2 flex-col items-center outline-none"
                style={{ left: `${xOf(i)}%` }}
              >
                <span className="relative grid h-6 w-6 place-items-center">
                  <span
                    className={`h-3.5 w-3.5 rounded-full border transition-all duration-300 ${isPicked ? 'scale-125 border-white bg-[#fffaf0]' : 'border-white/50 bg-void group-hover:border-white'}`}
                    style={color ? { background: color, borderColor: color, boxShadow: `0 0 0 5px ${color}33, 0 0 18px 4px ${color}99` } : undefined}
                  />
                  {i === LAST_STATION && <span data-fiber-from="th-impacto" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className={`${i % 2 ? 'mt-7 md:mt-3' : 'mt-3'} whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] transition-colors md:text-[10px] ${isPicked ? 'text-paper' : 'text-paper/55 group-hover:text-paper/85'}`}>{t(s.name)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* La cuenta: lo que llegó y lo que se frenó */}
      {!reducedMotion && (
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
          <span style={{ color: OK }}>{tally.passed}</span> {t({ es: 'llegan al código', en: 'reach the code' })} · <span style={{ color: NO }}>{tally.stopped}</span> {t({ es: 'frenados', en: 'stopped' })}
        </p>
      )}

      {/* La estación tocada */}
      <div className="mx-auto mt-8 min-h-[4rem] max-w-[640px]" aria-live="polite">
        {station ? (
          <div key={picked} className="th-fade border-l border-signal/60 pl-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">{t(station.detail.title)}</p>
            {Array.isArray(station.detail.body) ? (
              <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-paper/75 sm:grid-cols-2">
                {(station.detail.body as readonly L[]).map((line) => (
                  <li key={line.es} className="flex gap-2">
                    <span style={{ color: OK }} aria-hidden="true">✓</span>
                    {t(line)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-base leading-relaxed text-paper/80">{t(station.detail.body as L)}</p>
            )}
          </div>
        ) : (
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">{t({ es: 'Toca una estación', en: 'Tap a station' })}</p>
        )}
      </div>
    </div>
  )
}
