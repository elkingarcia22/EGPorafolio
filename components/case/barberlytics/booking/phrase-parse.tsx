'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'

/** La frase de la demo partida en lo que Clipper entiende, en el orden de `ai.product.parsed` */
const TOKENS: readonly L[] = [
  { es: 'corte', en: 'haircut' },
  { es: 'mañana', en: 'tomorrow' },
  { es: 'a las 5', en: 'at 5' },
  { es: 'con Andrés', en: 'with Andrés' },
]
/** Ritmo: cada letra mientras se escribe, cada pieza que baja y la pausa antes de repetir (ms) */
const TYPE_MS = 45
const PIECE_MS = 380
const HOLD_MS = 4200

/**
 * 05 · IA en el proceso: Clipper convierte una frase en una reserva. La frase
 * se escribe en la burbuja; después cada pedazo baja a su casilla —servicio,
 * día, hora, barbero— y al final sale lo que hace si no hay hueco. Debajo,
 * cómo se construyó con IA: cuatro pasos que se leen al tocarlos.
 */
export function PhraseParse() {
  const { t } = useLocale()
  const { ai } = BOOKING_CASE
  const phrase = t(ai.product.phrase)
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const [typed, setTyped] = useState(reducedMotion ? phrase.length : 0)
  /** Cuántas piezas ya bajaron a su casilla (4 + 1 = el resultado) */
  const [pieces, setPieces] = useState(reducedMotion ? TOKENS.length + 1 : 0)
  const [picked, setPicked] = useState<number | null>(null)
  const typedAll = typed >= phrase.length
  const parsedAll = pieces > TOKENS.length

  useEffect(() => {
    if (!inView || reducedMotion) return
    let id: number
    if (!typedAll) id = window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 400 : TYPE_MS)
    else if (!parsedAll) id = window.setTimeout(() => setPieces((n) => n + 1), PIECE_MS)
    else
      id = window.setTimeout(() => {
        setTyped(0)
        setPieces(0)
      }, HOLD_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, typed, typedAll, parsedAll])

  const steps = ai.build.steps
  const caption =
    picked !== null
      ? { tag: `${t(ai.build.title)} · 0${picked + 1}`, title: t(steps[picked].title), sub: t(steps[picked].body) }
      : { tag: t(ai.product.title), title: t({ es: 'Una frase se vuelve una reserva.', en: 'A sentence becomes a booking.' }), sub: t({ es: 'Con reglas, sin modelo de lenguaje: rápido, predecible y sin costo por mensaje.', en: 'Rules, no language model: fast, predictable and no per-message cost.' }) }

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede tag={caption.tag} title={caption.title} sub={caption.sub} swapKey={picked ?? 'all'} />

      {/* La burbuja: lo que escribe el cliente */}
      <div className="mt-10 flex w-full max-w-[760px] justify-end">
        <p className="rounded-[22px] rounded-br-md bg-white/[0.07] px-5 py-3 text-[clamp(1rem,0.9rem+0.6vw,1.35rem)] font-light">
          «
          {TOKENS.map((tok, i) => {
            // Cada pedazo de la frase se ilumina cuando baja a su casilla
            const before = TOKENS.slice(0, i).reduce((n, x) => n + t(x).length + 1, 0)
            const shown = t(tok).slice(0, Math.max(0, typed - before))
            return (
              <span key={tok.es}>
                <span className="transition-colors duration-300" style={{ color: pieces > i ? 'rgb(var(--bk))' : undefined }}>{shown}</span>
                {i < TOKENS.length - 1 && typed > before + t(tok).length ? ' ' : ''}
              </span>
            )
          })}
          {!typedAll && <span className="bk-caret ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-paper" />}»
        </p>
      </div>

      {/* Las casillas: cada pedazo baja por su hilo hasta su valor */}
      <dl className="mt-2 grid w-full max-w-[760px] grid-cols-2 gap-y-8 sm:grid-cols-4">
        {ai.product.parsed.map((p, i) => {
          const on = pieces > i
          return (
            <div key={p.key.es} className="flex flex-col items-center text-center">
              <span aria-hidden="true" className="relative h-12 w-px overflow-hidden bg-white/10">
                <span className="absolute inset-0 origin-top bg-gradient-to-b from-transparent to-[rgb(var(--bk))] transition-transform duration-300 ease-out" style={{ transform: `scaleY(${on ? 1 : 0})` }} />
              </span>
              <span className={`mt-1 h-2.5 w-2.5 rounded-full border transition-all duration-300 ${on ? 'border-white bg-[rgb(var(--bk))] shadow-[0_0_12px_rgb(var(--bk)/0.8)]' : 'border-white/30 bg-transparent'}`} />
              <dt className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/50">{t(p.key)}</dt>
              <dd className="mt-1 text-xl font-light transition-opacity duration-300" style={{ opacity: on ? 1 : 0.15 }}>{t(p.value)}</dd>
            </div>
          )
        })}
      </dl>
      <p className="mt-8 max-w-[52ch] text-balance text-center text-sm text-paper/70 transition-[opacity,transform] duration-500" style={{ opacity: parsedAll ? 1 : 0, transform: `translateY(${parsedAll ? 0 : 8}px)` }}>
        {t(ai.product.result)}
      </p>

      {/* Cómo lo construí: cuatro pasos sobre una línea; el detalle, al tocarlos */}
      <div className="mt-16 w-full max-w-[760px]">
        <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
          {t(ai.build.title)} · <span className="text-[rgb(var(--bk))]">{ai.build.days.value} {t({ es: 'días', en: 'days' })}</span>
        </p>
        <ol className="relative grid grid-cols-4">
          <span aria-hidden="true" className="absolute inset-x-[12.5%] top-[6px] h-px bg-white/15" />
          {steps.map((s, i) => (
            <li key={s.title.es} className="relative flex flex-col items-center">
              <button type="button" aria-pressed={picked === i} onClick={() => setPicked((x) => (x === i ? null : i))} className="group flex flex-col items-center px-1 outline-none">
                <span className={`relative h-3 w-3 rounded-full border transition-all duration-300 ${picked === i ? 'scale-125 border-white bg-[rgb(var(--bk))] shadow-[0_0_14px_rgb(var(--bk)/0.8)]' : 'border-white/50 bg-[rgb(var(--void))] group-hover:border-white'}`}>
                  {i === 0 && <span data-fiber-from="bk-impacto" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className={`mt-3 text-balance text-center text-[12px] leading-snug transition-opacity sm:text-[13px] ${picked === i ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}`}>{t(s.title)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
