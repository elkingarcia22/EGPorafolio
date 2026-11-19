'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import type { Finding } from '@/lib/content/cases/encuestas/types'
import './patterns-sketches.css'

export type Area = Finding['area']

/** Cada área con el prefijo de sus casos de QA en el producto y un color propio. */
export const AREAS: Record<Area, { label: L; code: string; color: string }> = {
  lista: { label: { es: 'Lista', en: 'List' }, code: 'LIS', color: '#9db8ff' },
  constructor: { label: { es: 'Constructor', en: 'Builder' }, code: 'CRE', color: '#c7adff' },
  carga: { label: { es: 'Carga histórica', en: 'Historical upload' }, code: 'CAR', color: '#f4d27f' },
  resultados: { label: { es: 'Resultados', en: 'Results' }, code: 'RES', color: '#a2dcb6' },
  privacidad: { label: { es: 'Privacidad', en: 'Privacy' }, code: 'ANO', color: '#f6b08f' },
}

const ORDER: readonly Area[] = ['lista', 'constructor', 'carga', 'resultados', 'privacidad']

/** Severidad que le puse a cada hallazgo en la auditoría (1 baja, 3 alta), en el orden de `findings`. */
const SEVERITY: readonly (1 | 2 | 3)[] = [2, 1, 2, 2, 2, 3, 3, 2, 3, 3]
const SEVERITY_LABEL: Record<1 | 2 | 3, L> = {
  1: { es: 'Severidad baja', en: 'Low severity' },
  2: { es: 'Severidad media', en: 'Medium severity' },
  3: { es: 'Severidad alta', en: 'High severity' },
}

/** De qué grupos sale cada hallazgo de síntesis (mismo orden que `insights`). */
export const INSIGHT_AREAS: readonly (readonly Area[])[] = [['privacidad'], ['resultados', 'lista', 'constructor'], ['carga']]

interface Note {
  index: number
  finding: Finding
  code: string
  severity: 1 | 2 | 3
}

/** Los hallazgos con su código de QA por área (LIS-01, LIS-02, CRE-01…). */
function buildNotes(findings: readonly Finding[]): readonly Note[] {
  // Un Map y no un objeto: «constructor» es una clave heredada de Object.
  const seen = new Map<Area, number>()
  return findings.map((finding, index) => {
    const n = (seen.get(finding.area) ?? 0) + 1
    seen.set(finding.area, n)
    return { index, finding, code: `${AREAS[finding.area].code}-${String(n).padStart(2, '0')}`, severity: SEVERITY[index] ?? 2 }
  })
}

/** Posición «al azar» pero fija para cada nota cuando el tablero está sin agrupar. */
const scatterSeed = (i: number) => ({ x: ((i * 37 + 11) % 97) / 97, y: ((i * 53 + 29) % 89) / 89, r: ((i * 29) % 13) - 6 })

function Severity({ level }: { level: 1 | 2 | 3 }) {
  const { t } = useLocale()
  return (
    <span className="flex gap-0.5" title={t(SEVERITY_LABEL[level])} aria-label={t(SEVERITY_LABEL[level])} role="img">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`h-1.5 w-1.5 rounded-full ${n <= level ? 'bg-[#14161a]' : 'bg-[#14161a]/20'}`} />
      ))}
    </span>
  )
}

interface Link {
  d: string
  area: Area
  insight: number
}

/** El tablero: notas regadas que se agrupan por área y desembocan en los tres hallazgos. */
export function AffinityBoard() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const p = ENCUESTAS_CASE.patterns
  const notes = buildNotes(p.findings)
  const wrapRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(true)
  const [grouped, setGrouped] = useState(true)
  const [focus, setFocus] = useState<Area | null>(null)
  const [focusInsight, setFocusInsight] = useState<number | null>(null)
  const [links, setLinks] = useState<readonly Link[]>([])
  const autoDone = useRef(false)
  const canScatter = !narrow && !reducedMotion

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Arranca regado (solo en escritorio y con movimiento) y se agrupa solo al entrar en pantalla.
  useEffect(() => {
    if (!canScatter) {
      setGrouped(true)
      return
    }
    if (autoDone.current) return
    setGrouped(false)
    const el = boardRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || autoDone.current) return
        autoDone.current = true
        window.setTimeout(() => setGrouped(true), 900)
        io.disconnect()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [canScatter])

  // FLIP: el layout final es el agrupado; regado = un desplazamiento desde ahí hasta su sitio «al azar».
  const prev = useRef<boolean | null>(null)
  useEffect(() => {
    const board = boardRef.current
    if (!board) return
    const items = Array.from(board.querySelectorAll<HTMLElement>('[data-note]'))
    const was = prev.current
    prev.current = grouped
    gsap.set(items, { x: 0, y: 0, rotate: 0 })
    if (!canScatter) return
    const b = board.getBoundingClientRect()
    const scatter = items.map((item, i) => {
      const s = scatterSeed(i)
      const r = item.getBoundingClientRect()
      return { x: s.x * (b.width - r.width) - (r.left - b.left), y: s.y * (b.height - r.height) - (r.top - b.top), rotate: s.r }
    })
    if (grouped) {
      if (was !== false) return
      items.forEach((item, i) => gsap.set(item, scatter[i]))
      gsap.to(items, { x: 0, y: 0, rotate: 0, duration: 1.1, ease: 'expo.inOut', stagger: 0.05 })
      return
    }
    if (was === false || !autoDone.current) {
      items.forEach((item, i) => gsap.set(item, scatter[i]))
      return
    }
    items.forEach((item, i) => gsap.to(item, { ...scatter[i], duration: 0.9, ease: 'expo.inOut', delay: i * 0.03 }))
  }, [grouped, canScatter])

  // Las líneas de cada grupo a su hallazgo, medidas sobre el layout (sin transformaciones).
  const measure = useCallback(() => {
    const wrap = wrapRef.current
    const board = boardRef.current
    if (!wrap || !board || narrow) return setLinks([])
    const next: Link[] = []
    const y1 = board.offsetTop + board.offsetHeight + 6
    INSIGHT_AREAS.forEach((areas, insight) => {
      const card = wrap.querySelector<HTMLElement>(`[data-insight="${insight}"]`)
      if (!card) return
      areas.forEach((area, k) => {
        const col = board.querySelector<HTMLElement>(`[data-cluster="${area}"]`)
        if (!col) return
        const x1 = board.offsetLeft + col.offsetLeft + col.offsetWidth / 2
        const x2 = card.offsetLeft + card.offsetWidth * ((k + 1) / (areas.length + 1))
        const y2 = card.offsetTop - 6
        const mid = (y1 + y2) / 2
        next.push({ d: `M${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`, area, insight })
      })
    })
    setLinks(next)
  }, [narrow])

  useEffect(() => {
    measure()
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [measure])

  const litArea = (area: Area) => focus === area || (focusInsight !== null && INSIGHT_AREAS[focusInsight].includes(area))
  const anyFocus = focus !== null || focusInsight !== null

  return (
    <div ref={wrapRef} className="relative">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="mono-label opacity-60">{t({ es: 'Tablero de afinidad · 10 hallazgos', en: 'Affinity board · 10 findings' })}</p>
        {canScatter && (
          <button type="button" onClick={() => setGrouped((g) => !g)} aria-pressed={grouped} className="mono-label flex items-center gap-2 border border-fg/30 px-3 py-2 transition-colors hover:border-fg">
            <span className={`h-2 w-2 rounded-full transition-colors ${grouped ? 'bg-signal' : 'bg-fg/40'}`} />
            {grouped ? t({ es: 'Soltar las notas', en: 'Scatter the notes' }) : t({ es: 'Agrupar por área', en: 'Group by area' })}
          </button>
        )}
      </div>

      <div ref={boardRef} data-grouped={String(grouped)} className="enc-board relative grid gap-4 rounded-2xl border border-fg/15 bg-fg/[0.02] p-4 sm:p-5 md:grid-cols-3 xl:grid-cols-5">
        {ORDER.map((area) => {
          const meta = AREAS[area]
          const mine = notes.filter((n) => n.finding.area === area)
          return (
            <section
              key={area}
              data-cluster={area}
              onMouseEnter={() => setFocus(area)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(area)}
              onBlur={() => setFocus(null)}
              aria-label={`${t(meta.label)} · ${mine.length}`}
              className="min-w-0"
            >
              <header className="enc-cluster-head mb-3 flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: meta.color }}>
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: meta.color }} />
                  <span className="truncate">{t(meta.label)}</span>
                </span>
                <span className="font-mono text-xs tabular-nums opacity-60">{mine.length}</span>
              </header>
              <ul className="space-y-3">
                {mine.map((n) => (
                  <li
                    key={n.code}
                    data-note=""
                    tabIndex={0}
                    data-dim={String(anyFocus && !litArea(area))}
                    data-lit={String(focus === area)}
                    className="enc-note relative z-10 rounded-[3px] p-3 text-[#14161a] shadow-[0_18px_30px_-18px_rgba(0,0,0,0.75)] outline-none"
                    style={{ background: meta.color }}
                  >
                    <p className="flex items-center justify-between gap-2 font-mono text-[10px] font-semibold tracking-wider">
                      {n.code}
                      <Severity level={n.severity} />
                    </p>
                    <p className="mt-2 text-[13px] leading-snug">{t(n.finding.text)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      {links.length > 0 && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {links.map((l) => {
            const on = litArea(l.area) || focusInsight === l.insight
            return (
              <path
                key={`${l.area}-${l.insight}`}
                d={l.d}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={grouped ? 0 : 1}
                className="enc-link"
                fill="none"
                stroke={AREAS[l.area].color}
                strokeWidth={on ? 2.5 : 1.4}
                strokeLinecap="round"
                opacity={anyFocus && !on ? 0.15 : 0.85}
              />
            )
          })}
        </svg>
      )}

      <ol data-grouped={String(grouped)} className="enc-insights mt-10 grid gap-4 md:mt-28 md:grid-cols-3">
        {p.insights.map((insight, i) => {
          const on = focusInsight === i || (focus !== null && INSIGHT_AREAS[i].includes(focus))
          return (
            <li
              key={insight.es}
              data-insight={i}
              tabIndex={0}
              onMouseEnter={() => setFocusInsight(i)}
              onMouseLeave={() => setFocusInsight(null)}
              onFocus={() => setFocusInsight(i)}
              onBlur={() => setFocusInsight(null)}
              className={`enc-insight relative rounded-2xl border p-6 outline-none ${on ? 'border-signal bg-signal/10' : 'border-fg/20 bg-fg/[0.04]'}`}
              style={{ transitionDelay: grouped ? `${0.9 + i * 0.15}s` : '0s' }}
            >
              <p className="flex items-center justify-between gap-3">
                <span className="mono-label text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
                <span className="flex gap-1">
                  {INSIGHT_AREAS[i].map((a) => (
                    <span key={a} className="h-2.5 w-2.5 rounded-full" style={{ background: AREAS[a].color }} title={t(AREAS[a].label)} />
                  ))}
                </span>
              </p>
              <p className="mt-4 text-[clamp(1.1rem,0.95rem+0.5vw,1.35rem)] font-light leading-snug">{t(insight)}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
