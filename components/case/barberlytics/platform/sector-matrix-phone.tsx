'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE, type Mark } from '@/lib/content/cases/barberlytics/platform-case'
import { useSwipe } from '@/components/case/kit/use-swipe'
import { useInView } from './use-auto-steps'

const GOLD = '#d9b36a'
/** Cada cuánto pasa a la siguiente función, hasta que alguien toque o deslice */
const NEXT_MS = 3000

/** La marca de un producto, en grande: sí (lleno), a medias, no (anillo) o sin verificar (punteado) */
function MarkBig({ mark, gold, delay }: { mark: Mark; gold: boolean; delay: number }) {
  const fill = gold ? GOLD : 'rgb(255 255 255 / 0.7)'
  const base = 'pl-pop block h-4 w-4 shrink-0 rounded-full'
  const style = { animationDelay: `${delay}ms` }
  if (mark === 'yes') return <span className={base} style={{ ...style, background: fill, boxShadow: gold ? '0 0 12px rgba(217,179,106,0.7)' : undefined }} />
  if (mark === 'half') return <span className={`${base} border`} style={{ ...style, borderColor: fill, background: `linear-gradient(90deg, ${fill} 50%, transparent 50%)` }} />
  if (mark === 'no') return <span className={`${base} border border-white/30`} style={style} />
  return <span className={`${base} border border-dashed border-white/35`} style={style} />
}

/**
 * La matriz del sector en el teléfono: una función a la vez. Arriba la
 * función; debajo los ocho productos con su marca, con nombre legible.
 * Pasa sola; deslizar de lado o tocar un punto elige otra.
 */
export function SectorMatrixPhone() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { matrix } = PLATFORM_CASE.patterns
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [row, setRow] = useState(0)
  const [auto, setAuto] = useState(true)
  const n = matrix.rows.length
  const go = (dir: 1 | -1) => {
    setAuto(false)
    setRow((r) => (r + dir + n) % n)
  }
  useSwipe(rootRef, { onNext: () => go(1), onPrev: () => go(-1) })

  useEffect(() => {
    if (!auto || !inView || reducedMotion) return
    const id = window.setTimeout(() => setRow((r) => (r + 1) % n), NEXT_MS)
    return () => window.clearTimeout(id)
  }, [auto, inView, reducedMotion, row, n])

  const r = matrix.rows[row]
  const yes = r.marks.filter((m) => m === 'yes').length
  const only = yes === 1 && r.marks[0] === 'yes'

  return (
    <div ref={rootRef} className="mx-auto max-w-[420px]">
      <p className="mono-label text-center opacity-50">{t(matrix.title)}</p>

      <div key={row} aria-live="polite" className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="pl-fade text-balance text-[20px] font-light leading-tight tracking-tight">{t(r.fn)}</span>
          <span className="shrink-0 font-mono text-[11px] text-paper/40">{row + 1} / {n}</span>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
          {matrix.products.map((p, c) => (
            <li key={p} className="flex items-center gap-2.5">
              <MarkBig mark={r.marks[c]} gold={c === 0} delay={c * 60} />
              <span className={`truncate text-[14px] ${c === 0 ? 'font-medium' : 'text-paper/70'}`} style={{ color: c === 0 ? GOLD : undefined }}>{p}</span>
            </li>
          ))}
        </ul>
        <p className="pl-fade mt-5 border-t border-white/10 pt-4 text-[14px] text-paper/85" style={{ animationDelay: '400ms' }}>
          {only ? t({ es: 'Solo Barberlytics lo tiene completo.', en: 'Only Barberlytics has it in full.' }) : t({ es: `${yes} de ${r.marks.length} lo tienen completo.`, en: `${yes} of ${r.marks.length} have it in full.` })}
        </p>
      </div>

      <ol className="mt-5 flex items-center justify-center gap-1">
        {matrix.rows.map((x, i) => (
          <li key={x.fn.es}>
            <button type="button" aria-label={t(x.fn)} aria-pressed={i === row} onClick={() => { setAuto(false); setRow(i) }} className="grid h-7 w-6 place-items-center outline-none">
              <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === row ? 'w-5 bg-[#d9b36a]' : 'w-1.5 bg-white/25'}`} />
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-center font-mono text-[11px] text-paper/40">{t({ es: 'Lleno: sí · Medio: a medias · Anillo: no · Punteado: sin verificar', en: 'Full: yes · Half: partly · Ring: no · Dashed: unverified' })}</p>
    </div>
  )
}
