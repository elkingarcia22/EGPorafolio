'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { AREAS, HEATMAP_DESC, HEATMAP_TITLE, MIN_GROUP, RESERVED_NOTE, ROW1_HINTS, ROWS, type Cell } from '@/lib/content/cases/encuestas/heatmap-real'
import { BrowserFrame } from './form-moments'

const ROUTE = '/admin/desempeno-cultura/encuestas/open-cultura-ola2-2026/resultados'

/** Tokens del tema leídos en staging (`--success`, `--warning`, `--destructive`, `--secondary`, `--muted-foreground`). */
const SUCCESS = 'oklch(69.6% .17 162.48)'
const WARNING = 'oklch(79.5% .184 86.047)'
const DESTRUCTIVE = 'oklch(51% .21 27.325)'
const SECONDARY = 'oklch(96.7% .001 286.375)'
const MUTED_FG = 'oklch(53.5% 0 0)'

type Tone = 'negative' | 'softer-negative' | 'warning' | 'positive' | 'deep-positive'
/** `bandForScore` del producto: 1–1,9 · 2–2,9 · 3–3,9 · 4–4,9 · 5. */
const toneOf = (s: number): Tone => (s <= 1.9 ? 'negative' : s <= 2.9 ? 'softer-negative' : s <= 3.9 ? 'warning' : s <= 4.9 ? 'positive' : 'deep-positive')
/** `FONDO_ESCALA` y `TEXTO_ESCALA` de `resultados/components/escala.ts`. */
const BG: Record<Tone, string> = {
  'deep-positive': `color-mix(in srgb, ${SUCCESS} 35%, transparent)`,
  positive: `color-mix(in srgb, ${SUCCESS} 15%, transparent)`,
  warning: `color-mix(in srgb, ${WARNING} 30%, transparent)`,
  'softer-negative': `color-mix(in srgb, ${DESTRUCTIVE} 15%, transparent)`,
  negative: `color-mix(in srgb, ${DESTRUCTIVE} 35%, transparent)`,
}
const BASE: Record<Tone, string> = { 'deep-positive': SUCCESS, positive: SUCCESS, warning: WARNING, 'softer-negative': DESTRUCTIVE, negative: DESTRUCTIVE }
const fg = (t: Tone) => `color-mix(in srgb, ${BASE[t]} 70%, black)`
const fmt = (n: number) => n.toFixed(1).replace('.', ',')

const PAD = ['', 'pl-6', 'pl-10'] as const
const ROW_MS = 150

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4V5Z" />
    </svg>
  )
}

function CellBadge({ cell, shown, delay }: { cell: Cell; shown: boolean; delay: number }) {
  const base = 'flex h-8 w-full items-center justify-center rounded-[4px] text-[11px] tabular-nums transition-[opacity,transform] duration-300'
  const anim = shown ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
  if (cell === 'R' || cell === 'S') {
    return (
      <span className={`${base} ${anim}`} style={{ background: SECONDARY, color: 'oklch(21% .006 285.885)', transitionDelay: `${delay}ms` }}>
        {cell === 'R' ? <LockIcon /> : <MessageIcon />}
      </span>
    )
  }
  const t = toneOf(cell)
  return (
    <span className={`${base} ${anim}`} style={{ background: BG[t], color: fg(t), transitionDelay: `${delay}ms` }}>
      {fmt(cell)}
    </span>
  )
}

type Step = { kind: 'hover'; col: number; ms: number } | { kind: 'scroll'; to: 'end' | 'start'; ms: number } | { kind: 'rest'; ms: number }
/** Después de llenarse: la ayuda de una celda con resultado y, al fondo de la tabla, la de los grupos reservados. */
const TOUR: readonly Step[] = [
  { kind: 'hover', col: 0, ms: 2400 },
  { kind: 'scroll', to: 'end', ms: 900 },
  { kind: 'hover', col: 7, ms: 3000 },
  { kind: 'hover', col: 9, ms: 2600 },
  { kind: 'scroll', to: 'start', ms: 900 },
  { kind: 'rest', ms: 1600 },
]

/** Desliza la tabla de lado con su propio cuadro a cuadro (el `scrollTo` suave se corta con el desplazamiento de la página). */
function slideTo(el: HTMLElement, to: number, ms: number) {
  const from = el.scrollLeft
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / ms)
    el.scrollLeft = from + (to - from) * (1 - Math.pow(1 - p, 3))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Momento 3: el mapa de calor real de una encuesta anónima, con sus ayudas reales sobre las celdas. */
export function HeatmapReal() {
  const { reducedMotion } = useA11y()
  const wrap = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [rows, setRows] = useState(reducedMotion ? ROWS.length : 0)
  const [step, setStep] = useState(-1)
  const [hover, setHover] = useState<{ col: number; x: number; y: number } | null>(null)
  const [userHover, setUserHover] = useState(false)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Las filas entran una a una, como cuando el mapa termina de cargar.
  useEffect(() => {
    if (!visible || reducedMotion || rows >= ROWS.length) return
    const id = window.setTimeout(() => setRows((r) => r + 1), ROW_MS)
    return () => window.clearTimeout(id)
  }, [visible, reducedMotion, rows])

  const showHint = useCallback((col: number) => {
    const box = wrap.current
    const cell = box?.querySelector<HTMLElement>(`[data-cell="0-${col}"]`)
    if (!box || !cell) return
    const a = box.getBoundingClientRect()
    const r = cell.getBoundingClientRect()
    const v = scroller.current?.getBoundingClientRect()
    // Solo sobre una celda que se ve: la tabla se desplaza de lado como en el producto.
    if (v && (r.right > v.right + 1 || r.left < v.left - 1)) return setHover(null)
    const x = Math.min(Math.max(r.left - a.left + r.width / 2, 132), a.width - 132)
    setHover({ col, x, y: r.top - a.top })
  }, [])

  // El recorrido de ayudas, en bucle, mientras nadie pase el cursor por la tabla.
  useEffect(() => {
    if (!visible || reducedMotion || userHover || rows < ROWS.length) return
    const i = step < 0 ? 0 : step % TOUR.length
    const s = TOUR[i]
    if (s.kind === 'hover') showHint(s.col)
    else setHover(null)
    if (s.kind === 'scroll') {
      const el = scroller.current
      if (el) slideTo(el, s.to === 'end' ? el.scrollWidth - el.clientWidth : 0, s.ms - 150)
    }
    const id = window.setTimeout(() => setStep(i + 1), s.ms)
    return () => window.clearTimeout(id)
  }, [step, visible, reducedMotion, userHover, rows, showHint])

  const hint = hover ? ROW1_HINTS[hover.col] : null
  const reservedHint = hint?.startsWith('Reservado')

  return (
    <div ref={wrap} className="relative" onMouseLeave={() => { setUserHover(false); setHover(null) }}>
      <BrowserFrame route={ROUTE}>
        <div className="bg-white p-3 sm:p-4">
          <div className="rounded-xl border border-black/[0.08]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] px-3 py-2.5">
              <div>
                <p className="text-[13px] font-semibold">{HEATMAP_TITLE}</p>
                <p className="text-[11px] text-[#71717a]">{HEATMAP_DESC}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="flex rounded-lg bg-[#f4f4f5] p-0.5">
                  <span className="px-2 py-1 text-[#71717a]">Secciones</span>
                  <span className="rounded-md bg-white px-2 py-1 font-medium shadow-sm">Mapa de calor</span>
                </span>
                <span className="rounded-lg border border-black/10 px-2 py-1">Por área ▾</span>
                <span className="hidden rounded-lg border border-black/10 px-2 py-1 sm:inline">Filtros</span>
                <span className="hidden rounded-lg border border-black/10 px-2 py-1 sm:inline">Personalizar</span>
              </div>
            </div>
            <div ref={scroller} className="overflow-x-auto">
              <table className="w-max border-collapse text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[#303a47]">
                    <th className="sticky left-0 z-10 w-[15rem] min-w-[15rem] bg-white px-2 py-2 font-medium">Sección</th>
                    <th className="w-16 border-r border-black/[0.08] px-2 py-2 text-center font-medium">Total</th>
                    {AREAS.map((a) => (
                      <th key={a} className="w-16 min-w-16 px-0.5 py-2 text-center font-medium"><span className="mx-auto block max-w-[4.5rem] truncate">{a}</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, r) => {
                    const shown = r < rows
                    const root = row.depth === 1
                    return (
                      <tr key={row.label} className="align-middle">
                        <th scope="row" className="sticky left-0 z-10 w-[15rem] min-w-[15rem] bg-white px-2 py-0.5 font-normal">
                          <span className={`flex items-center gap-1.5 ${PAD[row.depth - 1]}`}>
                            {row.depth < 3 ? <span className={`text-[10px] text-[#71717a] transition-transform ${row.collapsed ? '-rotate-90' : ''}`}>⌄</span> : <span className="w-[0.55rem]" />}
                            <span className="shrink-0 text-[10px] tabular-nums text-[#71717a]">{row.numbering}</span>
                            <span className={`min-w-0 flex-1 leading-tight ${root ? 'text-[12px] font-bold' : row.depth === 2 ? 'text-[11px] font-semibold' : 'text-[11px]'}`}>{row.label}</span>
                          </span>
                        </th>
                        <td className="border-r border-black/[0.08] px-2 text-center">
                          {row.total === null ? (
                            <span className="whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px]" style={{ background: SECONDARY, color: MUTED_FG }}>Sin escala</span>
                          ) : (
                            <span className={`text-[12px] font-medium tabular-nums transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`} style={{ color: BASE[toneOf(row.total)] }}>{fmt(row.total)}</span>
                          )}
                        </td>
                        {row.cells.map((c, col) => (
                          <td
                            key={AREAS[col]}
                            data-cell={`${r}-${col}`}
                            className="w-16 min-w-16 p-0.5"
                            onMouseEnter={r === 0 ? () => { setUserHover(true); showHint(col) } : undefined}
                          >
                            <CellBadge cell={c} shown={shown} delay={col * 22} />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-[10px] leading-snug text-[#71717a]">
            Anónima · mínimo {MIN_GROUP} respuestas por grupo. Pasa el cursor por la primera fila para ver la ayuda de cada celda.
          </p>
        </div>
      </BrowserFrame>

      {hover && hint && (
        <span
          key={hover.col}
          className="enc-fade pointer-events-none absolute z-20 w-max max-w-[16rem] -translate-x-1/2 -translate-y-full rounded-md bg-[#18181b] px-2.5 py-1.5 text-[11px] leading-snug text-white shadow-lg"
          style={{ left: hover.x, top: hover.y - 8 }}
          role="tooltip"
        >
          {hint}
          {reservedHint && (
            <>
              <br />
              {RESERVED_NOTE}
            </>
          )}
        </span>
      )}
    </div>
  )
}
