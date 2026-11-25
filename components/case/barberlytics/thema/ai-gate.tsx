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

interface Attempt {
  code: string
  /** Estación que lo frena (null = llega al código) */
  stop: number | null
  /** La regla que lo frena (de las validaciones del caso) */
  rule?: L
}

/** Lo que la IA intenta escribir en una pantalla, línea por línea */
const ATTEMPTS: readonly Attempt[] = [
  { code: '<KpiCard title="Citas hoy" />', stop: null },
  { code: '<p style={{ color: "#ff3b30" }}>', stop: 2, rule: ai.checks[1] },
  { code: '<DayStrip days={semana} />', stop: null },
  { code: "import { Scissors } from 'otra-libreria'", stop: 2, rule: ai.checks[0] },
  { code: '<svg viewBox="0 0 24 24">…</svg>', stop: 3, rule: ai.checks[4] },
  { code: '<ClipperOrb />', stop: null },
]

/** Ritmo (ms): escribir la línea, pasar por cada estación, y pausa al resolverse */
const PACE = { type: 520, station: 300, hold: 1100, restart: 1600 } as const

/** at = estación en la que va la línea actual; -1 = se está escribiendo */
interface Run {
  k: number
  at: number
  done: boolean
}

const targetOf = (a: Attempt) => a.stop ?? LAST_STATION

/**
 * 06 · IA en el proceso: a la izquierda, el riel con las cinco estaciones; a la
 * derecha, la pantalla que la IA escribe línea a línea. Cada línea baja por el
 * riel: las piezas del sistema llegan al código (verde) y lo que se sale —un
 * HEX a mano, otra librería, un SVG pegado— se frena en el guardián o en la
 * validación (rojo), con la regla que la frenó. Tocar una estación dice qué hace.
 * Del nodo del pie sale la fibra hacia «Impacto».
 */
export function AiGate() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { chapters } = THEMA_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const { entered, visible } = useInView(rootRef)
  const [run, setRun] = useState<Run>(reducedMotion ? { k: ATTEMPTS.length - 1, at: LAST_STATION, done: true } : { k: 0, at: -1, done: false })
  const [picked, setPicked] = useState<number | null>(null)

  const current = ATTEMPTS[run.k]
  const target = targetOf(current)

  useEffect(() => {
    if (!entered || !visible || reducedMotion) return
    const last = run.k === ATTEMPTS.length - 1
    const wait = run.done ? (last ? PACE.restart : PACE.hold) : run.at < 0 ? PACE.type : PACE.station
    const id = window.setTimeout(() => {
      setRun((r) => {
        if (r.done) return { k: (r.k + 1) % ATTEMPTS.length, at: -1, done: false }
        const next = r.at + 1
        return next >= targetOf(ATTEMPTS[r.k]) ? { ...r, at: targetOf(ATTEMPTS[r.k]), done: true } : { ...r, at: next }
      })
    }, wait)
    return () => window.clearTimeout(id)
  }, [entered, visible, reducedMotion, run])

  const blocked = current.stop !== null
  const verdict = run.done ? (blocked ? NO : OK) : null
  const lines = ATTEMPTS.slice(0, run.k + 1)
  const passed = lines.filter((a, i) => a.stop === null && (i < run.k || run.done)).length
  const stopped = lines.filter((a, i) => a.stop !== null && (i < run.k || run.done)).length
  const station = picked === null ? null : STATIONS[picked]

  return (
    <div ref={rootRef}>
      <ChapterHead phrase={t(chapters.ia.phrase)} lead={t(chapters.ia.lead)} />

      <div className="mx-auto grid max-w-[860px] gap-y-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-14">
        {/* El riel: las estaciones, de arriba abajo */}
        <ol className="relative flex flex-col justify-between py-1" aria-label={t({ es: 'Estaciones', en: 'Stations' })}>
          <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-px bg-white/12" />
          <span
            aria-hidden="true"
            className="absolute left-[11px] top-3 w-px origin-top"
            style={{
              height: 'calc(100% - 1.5rem)',
              background: verdict ? `linear-gradient(to bottom, rgb(var(--signal)), ${verdict})` : 'linear-gradient(to bottom, rgb(var(--signal)), rgb(var(--spark)))',
              transform: `scaleY(${Math.max(0, run.at) / LAST_STATION})`,
              transition: reducedMotion ? 'none' : `transform ${run.at < 0 ? 200 : PACE.station}ms linear, background 300ms`,
              opacity: run.at < 0 ? 0 : 1,
            }}
          />
          {STATIONS.map((s, i) => {
            const passing = !run.done && run.at === i
            const hit = run.done && i === target
            const color = hit ? verdict : null
            const isPicked = picked === i
            return (
              <li key={s.name.es} className="relative">
                <button
                  type="button"
                  aria-pressed={isPicked}
                  onClick={() => setPicked(isPicked ? null : i)}
                  className="group flex items-center gap-3 py-2 text-left outline-none md:gap-4 md:py-3"
                >
                  <span className="relative grid h-6 w-6 shrink-0 place-items-center">
                    {(passing || hit) && (
                      <span aria-hidden="true" className="absolute inset-[-6px] rounded-full opacity-60 blur-md" style={{ background: color ?? 'rgb(var(--signal))' }} />
                    )}
                    <span
                      className={`relative h-3.5 w-3.5 rounded-full border transition-all duration-300 ${isPicked ? 'scale-125 border-white bg-[#fffaf0]' : passing ? 'scale-110 border-white bg-signal' : 'border-white/45 bg-void group-hover:border-white'}`}
                      style={color ? { background: color, borderColor: color, boxShadow: `0 0 0 5px ${color}33` } : undefined}
                    />
                  </span>
                  <span className="flex flex-col">
                    <span className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] transition-colors md:text-[11px] ${isPicked || passing || hit ? 'text-paper' : 'text-paper/50 group-hover:text-paper/85'}`}>{t(s.name)}</span>
                    <span className="hidden font-mono text-[9px] tracking-[0.08em] text-paper/30 md:block">0{i + 1}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        {/* La pantalla que la IA escribe */}
        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full" style={{ background: 'conic-gradient(from 180deg, #f0ce86, #3f72d8, #8f5bd8, #f0ce86)' }} />
              agenda.tsx
            </span>
            <span className="tabular-nums">
              <span style={{ color: OK }}>{passed}</span> {t({ es: 'al código', en: 'in code' })} · <span style={{ color: NO }}>{stopped}</span> {t({ es: 'frenadas', en: 'stopped' })}
            </span>
          </div>
          <ol className="min-h-[260px] pt-3 md:min-h-[300px] font-mono text-[11px] leading-relaxed md:text-[12.5px]" aria-live="polite">
            {lines.map((a, i) => {
              const isCurrent = i === run.k
              const settled = !isCurrent || run.done
              const stop = a.stop !== null
              const tone = !settled ? 'rgb(var(--paper))' : stop ? NO : OK
              return (
                <li key={`${a.code}-${i}`} className="th-fade grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-start gap-x-2 py-1.5">
                  <span className="select-none text-right text-paper/25 tabular-nums">{i + 1}</span>
                  <span className="min-w-0">
                    <span className={`block truncate transition-[color,opacity] duration-300 ${settled && stop ? 'line-through decoration-[#e5484d]/70 opacity-60' : ''}`} style={{ color: settled ? (stop ? 'rgba(239,233,221,0.7)' : 'rgba(239,233,221,0.92)') : 'rgba(239,233,221,0.92)' }}>
                      {a.code}
                      {isCurrent && run.at < 0 && <span aria-hidden="true" className="ml-0.5 inline-block h-[1.1em] w-[0.5ch] translate-y-[2px] animate-pulse bg-signal" />}
                    </span>
                    {settled && stop && a.rule && (
                      <span className="th-fade mt-0.5 block font-sans text-[11px] text-[#e5484d]/90 md:text-xs">
                        {t(STATIONS[a.stop as number].name)} · {t(a.rule)}
                      </span>
                    )}
                  </span>
                  <span className="pt-px text-[10px] uppercase tracking-[0.12em] transition-colors duration-300" style={{ color: tone }}>
                    {settled ? (stop ? '✕' : '✓') : run.at < 0 ? '' : '…'}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

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

      {/* Del pie del capítulo, por debajo de todo, sale la fibra hacia «Impacto» */}
      <div className="mt-6 flex justify-center">
        <span aria-hidden="true" className="relative h-2.5 w-2.5 rounded-full border border-white/60 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
          <span data-fiber-from="th-impacto" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
      </div>
    </div>
  )
}
