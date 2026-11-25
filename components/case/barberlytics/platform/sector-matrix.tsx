'use client'

import { useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE, type Mark } from '@/lib/content/cases/barberlytics/platform-case'
import { useInView } from './use-auto-steps'

const GOLD = '#d9b36a'
const PAIN = '#ff6b72'
const GAIN = '#4cc98d'
/** Retraso entre columnas y entre filas al llenarse (ms) */
const COL_MS = 90
const ROW_MS = 35
/** En teléfono, la función ocupa su propio renglón y los ocho puntos van debajo; desde sm, en una sola fila */
const COLS = 'grid-cols-[repeat(8,minmax(0,1fr))] sm:grid-cols-[minmax(0,1fr)_repeat(8,1.75rem)]'

/** Una marca de la matriz: sí (lleno), a medias (media luna), no (anillo) o sin verificar (?) */
function MarkDot({ mark, gold, delay, on }: { mark: Mark; gold: boolean; delay: number; on: boolean }) {
  const fill = gold ? GOLD : 'rgb(255 255 255 / 0.62)'
  const base = 'relative grid h-3.5 w-3.5 place-items-center rounded-full'
  const style = { animationDelay: `${delay}ms`, visibility: on ? undefined : ('hidden' as const) }
  if (mark === 'yes') return <span className={`${base} ${on ? 'pl-pop' : ''}`} style={{ ...style, background: fill, boxShadow: gold ? '0 0 12px rgba(217,179,106,0.7)' : undefined }} />
  if (mark === 'half') return <span className={`${base} border ${on ? 'pl-pop' : ''}`} style={{ ...style, borderColor: fill, background: `linear-gradient(90deg, ${fill} 50%, transparent 50%)` }} />
  if (mark === 'no') return <span className={`${base} border border-white/30 ${on ? 'pl-pop' : ''}`} style={style} />
  return <span className={`${base} font-mono text-[9px] text-white/30 ${on ? 'pl-pop' : ''}`} style={style}>?</span>
}

/**
 * 02 · Patrones: la matriz del sector como un tablero de puntos que se llena
 * columna por columna al verse (Barberlytics en dorado). Tocar una función
 * dice cuántos la tienen. Debajo, la voz de barberos y dueños: un punto por
 * frase, que se lee al tocarlo.
 */
export function SectorMatrix() {
  const { t } = useLocale()
  const { matrix, voices } = PLATFORM_CASE.patterns
  const rootRef = useRef<HTMLDivElement>(null)
  const on = useInView(rootRef)
  const [row, setRow] = useState<number | null>(null)
  const [voice, setVoice] = useState<number | null>(null)

  const rowCaption = (() => {
    if (row === null) return null
    const r = matrix.rows[row]
    const yes = r.marks.filter((m) => m === 'yes').length
    const only = yes === 1 && r.marks[0] === 'yes'
    return only
      ? t({ es: 'Solo Barberlytics lo tiene completo.', en: 'Only Barberlytics has it in full.' })
      : t({ es: `${yes} de ${r.marks.length} lo tienen completo.`, en: `${yes} of ${r.marks.length} have it in full.` })
  })()
  const v = voice === null ? null : voices.items[voice]

  return (
    <div ref={rootRef} className="mx-auto max-w-[860px]">
      <div role="table" aria-label={t(matrix.title)}>
        {/* Los productos, en vertical sobre su columna */}
        <div role="row" className={`grid items-end gap-x-1.5 sm:gap-x-3 ${COLS}`}>
          <span role="columnheader" className="mono-label col-span-full pb-3 text-center opacity-50 sm:col-span-1 sm:text-left">{t(matrix.title)}</span>
          {matrix.products.map((p, c) => (
            <span key={p} role="columnheader" className="flex h-28 items-end justify-center pb-3">
              <span className={`whitespace-nowrap text-[12px] [writing-mode:vertical-rl] rotate-180 ${c === 0 ? 'font-medium' : 'opacity-55'}`} style={{ color: c === 0 ? GOLD : undefined }}>{p}</span>
            </span>
          ))}
        </div>
        {matrix.rows.map((r, i) => {
          const picked = row === i
          return (
            <button
              key={r.fn.es}
              type="button"
              role="row"
              aria-pressed={picked}
              onClick={() => setRow(picked ? null : i)}
              className={`group grid w-full items-center gap-x-1.5 gap-y-2.5 border-t py-3 text-left outline-none transition-colors duration-300 sm:gap-x-3 ${COLS} ${picked ? 'border-white/30' : 'border-white/[0.07] hover:border-white/20'}`}
            >
              <span role="rowheader" className={`col-span-full pr-2 sm:col-span-1 text-[13px] leading-snug transition-opacity duration-300 sm:text-sm ${picked ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{t(r.fn)}</span>
              {r.marks.map((m, c) => (
                <span key={c} role="cell" className="flex justify-center">
                  <MarkDot mark={m} gold={c === 0} on={on} delay={c * COL_MS + i * ROW_MS} />
                </span>
              ))}
            </button>
          )
        })}
      </div>
      <p className="mt-4 min-h-[1.5rem] text-center text-sm" aria-live="polite">
        {rowCaption ? <span key={row} className="pl-fade inline-block text-paper/85">{rowCaption}</span> : <span className="font-mono text-[11px] text-paper/40">{t({ es: 'Lleno: sí · Medio: a medias · Anillo: no · ?: sin verificar', en: 'Full: yes · Half: partly · Ring: no · ?: unverified' })}</span>}
      </p>

      {/* La voz de quien los usa: una fibra con un punto por frase */}
      <div className="mt-20">
        <div key={voice ?? 'title'} aria-live="polite" className="pl-fade mx-auto flex min-h-[6rem] max-w-[40ch] flex-col items-center justify-end text-center">
          {v ? (
            <>
              <span className="text-balance text-[clamp(1.25rem,1rem+1vw,1.8rem)] font-light leading-tight tracking-tight">{t(v.quote)}</span>
              <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: v.tone === 'pain' ? PAIN : GAIN }}>{t(v.who)}</span>
            </>
          ) : (
            <>
              <span className="mono-label text-signal">{t(voices.title)}</span>
              <span className="mt-2 text-sm text-paper/45">{t({ es: 'Toca un punto para leerlo.', en: 'Tap a dot to read it.' })}</span>
            </>
          )}
        </div>
        <ol className="relative mx-auto mt-8 flex max-w-[640px] justify-between">
          <span aria-hidden="true" className="absolute inset-x-[7px] top-[7px] h-px" style={{ background: `linear-gradient(90deg, ${PAIN}66, rgb(255 255 255 / 0.15) 70%, ${GAIN}88)` }} />
          {voices.items.map((it, i) => {
            const hue = it.tone === 'pain' ? PAIN : GAIN
            const picked = voice === i
            return (
              <li key={it.quote.es} className="relative">
                <button type="button" aria-pressed={picked} aria-label={t(it.quote)} onClick={() => setVoice(picked ? null : i)} className="group relative grid h-3.5 w-3.5 place-items-center outline-none">
                  <span className="absolute -inset-3" />
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${picked ? 'scale-150' : 'group-hover:scale-125'}`} style={{ borderColor: hue, background: picked ? hue : 'rgb(var(--void))', boxShadow: picked ? `0 0 18px 4px ${hue}99` : undefined }} />
                  {i === voices.items.length - 1 && <span data-fiber-from="pl-idea" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </button>
              </li>
            )
          })}
        </ol>
        <p className="mx-auto mt-6 max-w-[52ch] text-center font-mono text-[10.5px] leading-relaxed text-paper/35">{t(voices.note)}</p>
      </div>
    </div>
  )
}
