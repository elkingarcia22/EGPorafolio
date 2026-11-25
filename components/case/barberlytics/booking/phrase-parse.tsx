'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'

/** La frase partida en lo que Clipper entiende, en el orden de `ai.product.parsed` */
const TOKENS: readonly L[] = [
  { es: 'corte', en: 'haircut' },
  { es: 'mañana', en: 'tomorrow' },
  { es: 'a las 5', en: 'at 5' },
  { es: 'con Andrés', en: 'with Andrés' },
]
/** Un color por cosa entendida, para unir la palabra con su etiqueta */
const TONE = ['217 179 106', '106 168 255', '111 207 151', '255 126 182']
/** Ritmo: cada letra, cada palabra que se entiende, la respuesta y la pausa antes de repetir (ms) */
const TYPE_MS = 45
const PIECE_MS = 420
const HOLD_MS = 5200

/** Las tres fases de la conversación: escribir, entender, responder */
function useConversation(phraseLength: number, running: boolean, reduced: boolean) {
  const [typed, setTyped] = useState(reduced ? phraseLength : 0)
  /** Palabras entendidas (4) + 1 = la respuesta de Clipper */
  const [pieces, setPieces] = useState(reduced ? TOKENS.length + 1 : 0)
  const typedAll = typed >= phraseLength
  const answered = pieces > TOKENS.length

  useEffect(() => {
    if (!running || reduced) return
    let id: number
    if (!typedAll) id = window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 400 : TYPE_MS)
    else if (!answered) id = window.setTimeout(() => setPieces((n) => n + 1), PIECE_MS)
    else
      id = window.setTimeout(() => {
        setTyped(0)
        setPieces(0)
      }, HOLD_MS)
    return () => window.clearTimeout(id)
  }, [running, reduced, typed, pieces, typedAll, answered])

  return { typed, pieces, typedAll, answered }
}

/**
 * 05 · IA en el proceso, en dos partes que se leen solas. Arriba, en el
 * producto: el cliente escribe una frase y cada palabra se subraya con lo que
 * Clipper entendió; luego Clipper responde. Abajo, en cómo se construyó: los
 * cuatro pasos con su detalle a la vista y los nueve días.
 */
export function PhraseParse() {
  const { t } = useLocale()
  const { ai } = BOOKING_CASE
  const phrase = TOKENS.map((x) => t(x)).join(' ')
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const build = useAutoSteps<HTMLOListElement>(ai.build.steps.length, { intro: 200, step: 260 })
  const { typed, pieces, typedAll, answered } = useConversation(phrase.length, inView, reducedMotion)

  return (
    <div className="flex flex-col items-center">
      <BookingLede
        tag={t({ es: 'La IA, en dos lugares', en: 'AI, in two places' })}
        title={t({ es: 'En la reserva, entiende una frase. En el proceso, me ayudó a construirla.', en: 'In the booking, it understands a sentence. In the process, it helped me build it.' })}
      />

      {/* 1 · En el producto: una conversación */}
      <div ref={ref} className="mt-12 w-full max-w-[680px]">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
          <span className="text-[rgb(var(--bk))]">01</span> · {t(ai.product.title)}
        </p>

        {/* El cliente escribe */}
        <div className="flex justify-end">
          <p className="rounded-[22px] rounded-br-md bg-white/[0.08] px-5 pb-3 pt-3 text-[clamp(1.05rem,0.95rem+0.6vw,1.4rem)] font-light leading-[2.6]">
            {TOKENS.map((tok, i) => {
              const before = TOKENS.slice(0, i).reduce((n, x) => n + t(x).length + 1, 0)
              const shown = t(tok).slice(0, Math.max(0, typed - before))
              const on = pieces > i
              return (
                <span key={tok.es}>
                  <span className="relative inline-block whitespace-nowrap leading-[1.25]">
                    <span className="transition-colors duration-300" style={{ color: on ? `rgb(${TONE[i]})` : undefined }}>{shown}</span>
                    {/* Lo que Clipper entendió, debajo de la palabra */}
                    <span aria-hidden={!on} className="absolute inset-x-0 top-full mt-0.5 flex flex-col items-center transition-[opacity,transform] duration-300" style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : -4}px)` }}>
                      <span className="h-[2px] w-full rounded-full" style={{ background: `rgb(${TONE[i]})` }} />
                      <span className="mt-1 font-mono text-[9px] uppercase leading-none tracking-[0.14em] sm:text-[10px]" style={{ color: `rgb(${TONE[i]})` }}>{t(ai.product.parsed[i].key)}</span>
                    </span>
                  </span>
                  {i < TOKENS.length - 1 && typed > before + t(tok).length ? ' ' : ''}
                </span>
              )
            })}
            {!typedAll && <span className="bk-caret ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-paper" />}
          </p>
        </div>

        {/* Clipper responde */}
        <div className="mt-5 flex items-end gap-3 transition-[opacity,transform] duration-500" style={{ opacity: answered ? 1 : 0, transform: `translateY(${answered ? 0 : 10}px)` }}>
          <span aria-hidden="true" className="mb-1 h-7 w-7 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff6df,rgb(var(--bk))_60%,rgb(var(--bk)/0.3))] shadow-[0_0_16px_rgb(var(--bk)/0.6)]" />
          <div className="rounded-[22px] rounded-bl-md border border-white/10 bg-[rgb(var(--void))] px-5 py-3">
            <p className="flex flex-wrap gap-x-3 gap-y-1 text-[15px]">
              {ai.product.parsed.map((p, i) => (
                <span key={p.key.es} style={{ color: `rgb(${TONE[i]})` }}>{t(p.value)}</span>
              ))}
            </p>
            <p className="mt-1.5 text-sm leading-snug text-paper/65">{t(ai.product.result)}</p>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-paper/45">{t({ es: 'Funciona con reglas, sin modelo de lenguaje: rápido, predecible y sin costo por mensaje.', en: 'Runs on rules, no language model: fast, predictable and no per-message cost.' })}</p>
      </div>

      {/* 2 · En cómo lo construí: los pasos, con su detalle a la vista */}
      <div className="mt-20 grid w-full max-w-[860px] gap-8 md:grid-cols-[200px_1fr] md:gap-12">
        <div className="text-center md:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
            <span className="text-[rgb(var(--bk))]">02</span> · {t(ai.build.title)}
          </p>
          <p className="mt-4 text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] font-light leading-none text-[rgb(var(--bk))] tabular-nums">{ai.build.days.value}</p>
          <p className="mt-2 text-balance text-sm leading-snug text-paper/60">{t(ai.build.days.label)}</p>
        </div>
        <ol ref={build.ref} className="relative">
          <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-white/12" />
          {ai.build.steps.map((s, i) => {
            const on = build.step > i
            return (
              <li key={s.title.es} className="relative pb-6 pl-8 last:pb-0" style={{ opacity: on ? 1 : 0.15, transition: 'opacity .5s' }}>
                <span className={`absolute left-0 top-[0.4em] h-[11px] w-[11px] rounded-full border transition-all duration-500 ${on ? 'border-white bg-[rgb(var(--bk))] shadow-[0_0_12px_rgb(var(--bk)/0.7)]' : 'border-white/40 bg-[rgb(var(--void))]'}`}>
                  {i === 0 && <span data-fiber-from="bk-impacto" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <p className="text-[1.05rem] leading-snug">{t(s.title)}</p>
                <p className="mt-1 text-sm leading-relaxed text-paper/60">{t(s.body)}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
