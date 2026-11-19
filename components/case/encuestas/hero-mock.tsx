'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { FAV, favColor, Lock, UBITS_BLUE, useTicker } from './shared'

export const TOTAL_INVITED = 520
export const MIN_GROUP = 5

const SECTIONS: readonly L[] = [
  { es: 'Propósito', en: 'Purpose' },
  { es: 'Liderazgo', en: 'Leadership' },
  { es: 'Colaboración', en: 'Collaboration' },
  { es: 'Reconocimiento', en: 'Recognition' },
  { es: 'Bienestar', en: 'Well-being' },
]
/** Nombres cortos para el celular, donde la columna de secciones es angosta. */
const SECTIONS_SHORT: readonly L[] = [
  { es: 'Propósito', en: 'Purpose' },
  { es: 'Liderazgo', en: 'Leaders.' },
  { es: 'Colabor.', en: 'Collab.' },
  { es: 'Reconoc.', en: 'Recogn.' },
  { es: 'Bienestar', en: 'Well-b.' },
]

/** Áreas con sus promedios por sección; Comercial arranca bajo el mínimo. */
const AREAS = [
  { name: 'Producto', short: 'Prod.', n: 48, scores: [4.3, 3.7, 4.4, 3.2, 3.6] },
  { name: 'Tecnología', short: 'Tec.', n: 61, scores: [3.9, 3.3, 4.1, 2.7, 2.9] },
  { name: 'Finanzas', short: 'Fin.', n: 19, scores: [3.5, 4.2, 3.8, 3.4, 4.1] },
  { name: 'Comercial', short: 'Com.', n: 4, scores: [4.5, 4.1, 3.6, 4.2, 3.1] },
  { name: 'Gente', short: 'Gente', n: 22, scores: [3.7, 2.8, 3.9, 2.3, 3.3] },
] as const
export const GROWING_AREA = 3

/** En celular, un foco recorre las celdas que cuentan la historia: [fila, columna] y qué dicen. */
const SPOTLIGHT: readonly { r: number; c: number; note: L; unlocked?: L }[] = [
  { r: 3, c: 4, note: { es: 'el puntaje más bajo de la encuesta', en: 'the lowest score in the survey' } },
  { r: 2, c: 0, note: { es: 'la fortaleza más sólida', en: 'the strongest point' } },
  { r: 1, c: 3, note: { es: 'menos de 5 respuestas: candado, nunca un número', en: 'under 5 answers: a lock, never a number' }, unlocked: { es: 'llegó al mínimo y ya se puede leer', en: 'reached the minimum and can be read' } },
  { r: 4, c: 1, note: { es: 'el bienestar de Tecnología pide atención', en: 'Tech well-being needs attention' } },
]
const SPOT_MS = 1700

const TABS: readonly L[] = [
  { es: 'Participación', en: 'Participation' },
  { es: 'Mapa de calor', en: 'Heatmap' },
  { es: 'eNPS', en: 'eNPS' },
  { es: 'Comentarios', en: 'Comments' },
  { es: 'Análisis con IA', en: 'AI analysis' },
]

/**
 * Cuenta de un número a otro en ~0,8 s cada vez que cambia el destino. Si cambia `restart`, vuelve a contar desde 0
 * (más lento, para que se note): así el celular repite la entrada del tablero.
 */
function useCount(target: number, restart?: number): number {
  const { reducedMotion } = useA11y()
  const [value, setValue] = useState(target)
  const lastRestart = useRef(restart)
  useEffect(() => {
    if (reducedMotion) return setValue(target)
    const fromZero = restart !== lastRestart.current
    lastRestart.current = restart
    let raf = 0
    const from = fromZero ? 0 : value
    const ms = fromZero ? 1600 : 800
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      setValue(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reducedMotion, restart])
  return value
}

function Ring({ answered, restart }: { answered: number; restart?: number }) {
  const { t } = useLocale()
  const shown = useCount(answered, restart)
  const pct = shown / TOTAL_INVITED
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-3 max-sm:gap-2">
      <svg viewBox="0 0 84 84" className="h-[4.6rem] w-[4.6rem] shrink-0 -rotate-90 max-sm:h-12 max-sm:w-12" aria-hidden="true">
        <circle cx="42" cy="42" r={r} fill="none" stroke="#ecf1fa" strokeWidth="9" />
        <circle cx="42" cy="42" r={r} fill="none" stroke={UBITS_BLUE} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} className="transition-[stroke-dasharray] duration-700" />
      </svg>
      <div>
        <p className="whitespace-nowrap text-[20px] font-semibold leading-none tabular-nums max-sm:text-[18px]">{(pct * 100).toFixed(1).replace('.', ',')} %</p>
        <p className="mt-1 text-[10px] text-[#5c646f] max-lg:text-[11px]">
          <span className="tabular-nums">{shown}</span> {t({ es: `de ${TOTAL_INVITED} respondieron`, en: `of ${TOTAL_INVITED} answered` })}
        </p>
      </div>
    </div>
  )
}

interface DashboardProps {
  answered: number
  growingN: number
  enps: number
  /** Resalta la fila del área que acaba de recibir una respuesta. */
  pulse: boolean
  /** Celular y tableta: la entrada del tablero se repite (anillo, eNPS y celdas) y un foco recorre el mapa. */
  lively?: boolean
  /** Cambia en cada vuelta de la portada para volver a reproducir la entrada. */
  cycle?: number
}

/** El tablero de resultados de Encuestas en miniatura, vivo: participación, eNPS y mapa de calor con anonimato. */
export function ResultsDashboard({ answered, growingN, enps, pulse, lively = false, cycle = 0 }: DashboardProps) {
  const { t } = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const [play, setPlay] = useState(0)
  const spotTick = useTicker(SPOT_MS, lively && play > 0)

  // En celular la entrada se reproduce al aparecer el tablero y en cada vuelta de la portada.
  useEffect(() => {
    const el = box.current
    if (!el || !lively) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setPlay((n) => n + 1), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [lively])
  useEffect(() => {
    if (lively && cycle > 0) setPlay((n) => n + 1)
  }, [cycle, lively])

  const restart = lively ? play : undefined
  const enpsShown = useCount(enps, restart)
  const spot = lively && play > 0 ? SPOTLIGHT[spotTick % SPOTLIGHT.length] : null
  return (
    <div ref={box} className="overflow-hidden rounded-2xl bg-white text-[#303a47] ring-1 ring-black/10">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7fb] px-4 py-2.5" aria-hidden="true">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#e0675f]" />
          <span className="h-2 w-2 rounded-full bg-[#f1c56c]" />
          <span className="h-2 w-2 rounded-full bg-[#8ccfa4]" />
        </span>
        <span className="ml-2 truncate font-mono text-[10px] text-black/45 max-lg:text-[11px]">ubits.co/admin/encuestas/clima-2026/resultados</span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] text-[#5c646f] max-lg:text-[11px]">{t({ es: 'Encuestas › Resultados', en: 'Surveys › Results' })}</p>
            <p className="mt-1 text-lg font-semibold leading-tight sm:text-xl">{t({ es: 'Clima organizacional 2026', en: 'Organizational climate 2026' })}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] max-lg:text-[11px]">
            <span className="rounded-full bg-[#e2f1e2] px-2 py-0.5 font-medium text-[#2c6b2f]">{t({ es: 'En progreso', en: 'In progress' })}</span>
            <span className="flex items-center gap-1 rounded-full bg-[#ecf1fa] px-2 py-0.5 text-[#0c5bef]">
              <Lock className="h-3 w-3" /> {t({ es: `Anónima · mín. ${MIN_GROUP}`, en: `Anonymous · min ${MIN_GROUP}` })}
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-4 overflow-hidden border-b border-black/[0.06] text-[11px]" aria-hidden="true">
          {TABS.map((tab, i) => (
            <span key={tab.es} className={`shrink-0 whitespace-nowrap pb-2 ${i === 1 ? 'border-b-2 border-[#0c5bef] font-semibold text-[#0c5bef]' : 'text-[#5c646f]'}`}>{t(tab)}</span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <div className="min-w-0 rounded-xl border border-black/[0.07] p-3">
              <p className="mb-2 text-[10px] font-medium text-[#5c646f] max-lg:text-[11px]">{t({ es: 'Participación', en: 'Participation' })}</p>
              <Ring answered={answered} restart={restart} />
            </div>
            <div className="min-w-0 rounded-xl border border-black/[0.07] p-3">
              <p className="text-[10px] font-medium text-[#5c646f] max-lg:text-[11px]">eNPS</p>
              <p className="mt-1 text-[26px] font-semibold leading-none tabular-nums" style={{ color: enpsShown >= 30 ? '#2e8a55' : '#303a47' }}>+{enpsShown}</p>
              <div key={lively ? play : undefined} className={`mt-2 flex h-1.5 overflow-hidden rounded-full ${lively ? 'hd-grow max-lg:h-2' : ''}`} aria-hidden="true">
                <span className="transition-[width] duration-700" style={{ width: `${(100 - enpsShown) / 2 - 8}%`, background: FAV[0] }} />
                <span style={{ width: '16%', background: FAV[2] }} />
                <span className="flex-1" style={{ background: FAV[4] }} />
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-black/[0.07] p-3">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-[10px] font-medium text-[#5c646f] max-lg:text-[11px]">{t({ es: 'Favorabilidad por área', en: 'Favorability by area' })}</p>
              <p className="flex gap-0.5" aria-hidden="true">
                {FAV.map((f) => <span key={f} className="h-1.5 w-3 rounded-sm" style={{ background: f }} />)}
              </p>
            </div>
            <div key={lively ? `grid-${play}` : undefined} className="grid grid-cols-[4.6rem_repeat(5,minmax(0,1fr))] gap-1 text-[10px] max-lg:text-[11px] max-sm:grid-cols-[4.1rem_repeat(5,minmax(0,1fr))]">
              <span />
              {AREAS.map((a, c) => {
                const n = c === GROWING_AREA ? growingN : a.n
                return (
                  <span key={a.name} className="truncate text-center text-[#5c646f]">
                    <span className="sm:hidden">{a.short}</span>
                    <span className="max-sm:hidden">{a.name}</span>
                    <span className={`block tabular-nums ${n < MIN_GROUP ? 'font-semibold text-[#b8860b]' : 'text-[#979ba3]'}`}>n={n}</span>
                  </span>
                )
              })}
              {SECTIONS.map((s, r) => (
                <div key={s.es} className="contents">
                  <span className="flex items-center truncate text-[#414a5c]">
                    <span className="sm:hidden">{t(SECTIONS_SHORT[r])}</span>
                    <span className="max-sm:hidden">{t(s)}</span>
                  </span>
                  {AREAS.map((a, c) => {
                    const n = c === GROWING_AREA ? growingN : a.n
                    const reserved = n < MIN_GROUP
                    const score = a.scores[r]
                    const fresh = c === GROWING_AREA && !reserved && pulse
                    const lit = spot !== null && spot.r === r && spot.c === c
                    // En celular cada celda entra de a una, fila por fila, la primera vez y en cada vuelta.
                    const pop = lively && !fresh
                    return (
                      <span
                        key={`${a.name}-${reserved}`}
                        className={`relative flex h-7 items-center justify-center rounded-md font-mono tabular-nums transition-[transform,box-shadow] duration-300 ${fresh ? 'hd-unlock' : pop ? 'hd-pop' : ''} ${lit ? 'z-10 scale-[1.18] shadow-[0_0_0_2px_#0c5bef,0_8px_18px_-6px_rgba(12,91,239,0.6)]' : ''}`}
                        style={{ ...(reserved ? { background: '#f1f2f4', color: '#979ba3' } : { background: favColor(score), color: '#14161a' }), animationDelay: fresh ? `${r * 70}ms` : pop ? `${300 + (r * AREAS.length + c) * 55}ms` : undefined }}
                        title={reserved ? t({ es: 'Reservado: por debajo del mínimo', en: 'Reserved: below the minimum' }) : undefined}
                      >
                        {reserved ? <Lock className="h-3 w-3" /> : score.toFixed(1).replace('.', ',')}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>
            {spot && (
              <p key={`spot-${spotTick}`} className="hd-rise mt-2.5 flex items-baseline gap-1.5 text-[12px] leading-snug" aria-hidden="true">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: UBITS_BLUE }} />
                <span>
                  <b>{AREAS[spot.c].name} · {t(SECTIONS[spot.r])}</b>
                  {AREAS[spot.c].n >= MIN_GROUP || (spot.c === GROWING_AREA && growingN >= MIN_GROUP) ? ` ${AREAS[spot.c].scores[spot.r].toFixed(1).replace('.', ',')}` : ''}: {t(spot.unlocked && growingN >= MIN_GROUP ? spot.unlocked : spot.note)}
                </span>
              </p>
            )}
            <p className="mt-2.5 min-h-[2.2em] text-[10px] leading-snug text-[#5c646f] max-lg:text-[11px]" aria-live="polite">
              {growingN < MIN_GROUP
                ? t({ es: `Comercial lleva ${growingN} respuestas: sus resultados siguen reservados.`, en: `Sales has ${growingN} answers: its results stay reserved.` })
                : t({ es: 'Comercial llegó al mínimo: ya se puede leer sin señalar a nadie.', en: 'Sales reached the minimum: it can be read without pointing at anyone.' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
