'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'

/** Color de cada grupo (como las notas del tablero real) */
const TONE: Record<string, string> = { green: '111 207 151', pink: '255 126 182', blue: '106 168 255', orange: '242 153 74' }
/** Se ordena solo: los quince productos se encienden y luego las notas vuelan a su grupo (ms) */
const AUTO = { intro: 400, step: 700 }
/** Pasos: 1 = productos leídos; 2 = notas agrupadas */
const LAST = 2
/** Lienzo en unidades del contenedor (cqw): ancho 100, alto 44 */
const COL_X = [12.5, 37.5, 62.5, 87.5]
const ROW0 = 17
const ROW_GAP = 5.6
/** Qué conclusión acompaña a cada grupo al tocarlo */
const INSIGHT_OF = [0, 1, 1, 2]

interface Note {
  col: number
  row: number
  text: L
  /** Dónde estaba antes de agruparse (disperso) */
  sx: number
  sy: number
}

/** Una dispersión fija (sin azar en cada render) para el antes */
const scatter = (i: number) => ({ sx: 18 + ((i * 37) % 64), sy: 10 + ((i * 53) % 28) })

/**
 * 02 · Patrones como un tablero de afinidad: las diecinueve notas del
 * benchmark llegan dispersas y se ordenan solas en los cuatro grupos. Tocar una
 * nota la lee; tocar un grupo muestra cuántas tiene. Del primer grupo sale la
 * fibra hacia «La idea», por la izquierda.
 */
export function AffinitySort() {
  const { t } = useLocale()
  const { patterns } = BOOKING_CASE
  const { ref, step } = useAutoSteps<HTMLDivElement>(LAST, AUTO)
  const [picked, setPicked] = useState<{ col: number; row?: number } | null>(null)
  const sorted = step >= 2

  const notes: Note[] = patterns.columns.flatMap((c, col) => c.notes.map((text, row) => ({ col, row, text, ...scatter(col * 5 + row) })))

  const caption = (() => {
    if (!picked) return { tag: t({ es: '15 productos → 4 grupos', en: '15 products → 4 groups' }), title: t({ es: 'Lo que ya hacíamos mejor, lo que faltaba, lo que valía copiar y lo que era riesgo.', en: 'What we did best, what was missing, what was worth copying and what was a risk.' }), sub: t(patterns.insights[0]) }
    const column = patterns.columns[picked.col]
    if (picked.row === undefined) return { tag: t(column.title), title: `${column.notes.length} ${t({ es: 'hallazgos', en: 'findings' })}`, sub: t(patterns.insights[INSIGHT_OF[picked.col]]) }
    return { tag: t(column.title), title: t(column.notes[picked.row]) }
  })()

  const isPicked = (col: number, row?: number) => picked?.col === col && (row === undefined || picked.row === undefined || picked.row === row)
  const toggle = (next: { col: number; row?: number }) => setPicked((p) => (p && p.col === next.col && p.row === next.row ? null : next))

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede tag={caption.tag} title={caption.title} sub={caption.sub} swapKey={picked ? `${picked.col}-${picked.row ?? 'c'}` : 'all'} />

      {/* Los quince productos comparados, en una línea fina */}
      <p className="mt-8 flex max-w-[860px] flex-wrap justify-center gap-x-3 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
        {patterns.competitors.map((name, i) => (
          <span key={name} className="transition-opacity duration-500" style={{ opacity: step >= 1 ? 0.55 : 0.12, transitionDelay: `${i * 30}ms` }}>{name}</span>
        ))}
      </p>

      <div className="relative mt-8 aspect-[100/46] w-full max-w-[900px] [container-type:inline-size]">
        {/* Los grupos: su nombre arriba y una línea que recoge sus notas */}
        {patterns.columns.map((c, col) => (
          <button
            key={c.title.es}
            type="button"
            onClick={() => toggle({ col })}
            aria-pressed={isPicked(col) && picked?.row === undefined}
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center outline-none"
            style={{ left: `${COL_X[col]}%`, opacity: sorted ? 1 : 0, transition: `opacity .5s ${300 + col * 80}ms` }}
          >
            <span className="block w-[23cqw] text-balance text-center font-mono text-[clamp(8px,1.3cqw,12px)] uppercase leading-tight tracking-[0.1em]" style={{ color: `rgb(${TONE[c.color]})` }}>{t(c.title)}</span>
            <span className="mt-1 text-[clamp(1rem,2.6cqw,1.6rem)] font-light leading-none tabular-nums">{c.notes.length}</span>
            {/* Del primer grupo (Fuertes, a la izquierda) sale la fibra hacia «La idea» */}
            {col === 0 && <span data-fiber-from="bk-idea" className="absolute left-1/2 top-full h-px w-px" />}
          </button>
        ))}

        {/* Cada grupo recoge sus notas en una fibra vertical que se tiende al ordenarse */}
        {patterns.columns.map((c, col) => (
          <span
            key={`line-${c.title.es}`}
            aria-hidden="true"
            className="absolute w-px origin-top"
            style={{
              left: `${COL_X[col]}%`,
              top: `${ROW0 - 2}cqw`,
              height: `${(c.notes.length - 1) * ROW_GAP + 4}cqw`,
              background: `linear-gradient(to bottom, rgb(${TONE[c.color]} / 0.5), rgb(${TONE[c.color]} / 0.05))`,
              transform: `scaleY(${sorted ? 1 : 0})`,
              transition: `transform 900ms cubic-bezier(.16,1,.3,1) ${500 + col * 90}ms`,
            }}
          />
        ))}

        {/* Las notas: dispersas al llegar; se ordenan solas en su grupo */}
        {notes.map((n, i) => {
          const tone = TONE[patterns.columns[n.col].color]
          const x = sorted ? COL_X[n.col] : n.sx
          const y = sorted ? ROW0 + n.row * ROW_GAP : n.sy
          const on = isPicked(n.col, n.row)
          return (
            <button
              key={`${n.col}-${n.row}`}
              type="button"
              aria-label={t(n.text)}
              onClick={() => toggle({ col: n.col, row: n.row })}
              className="group absolute left-0 top-0 grid h-[max(22px,4.4cqw)] w-[max(22px,4.4cqw)] place-items-center outline-none"
              style={{
                transform: `translate(calc(${x}cqw - 50%), calc(${y}cqw - 50%))`,
                transition: `transform 900ms cubic-bezier(.65,0,.35,1) ${sorted ? i * 35 : 0}ms`,
              }}
            >
              <span
                className="block h-[max(10px,1.5cqw)] w-[max(10px,1.5cqw)] rounded-full border transition-[background-color,box-shadow,transform] duration-500 group-hover:scale-125"
                style={{
                  backgroundColor: sorted ? `rgb(${tone})` : 'rgb(255 255 255 / 0.5)',
                  borderColor: on ? 'white' : 'transparent',
                  boxShadow: on ? `0 0 0 4px rgb(${tone} / 0.3), 0 0 16px 2px rgb(${tone} / 0.7)` : sorted ? `0 0 10px rgb(${tone} / 0.45)` : 'none',
                  transform: on ? 'scale(1.35)' : undefined,
                }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
