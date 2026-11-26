'use client'

import { useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useSwipe } from '@/components/case/kit/use-swipe'
import { useAutoSteps, useCycle } from '../use-auto-steps'

/** Tiempo en cada comportamiento mientras pasan solos (ms) */
const CARD_MS = 3600

interface PhoneBehavior {
  does: L
  seen: L
  answer: L
  source: { label: L; tone: string }
}

/**
 * Patrones en el teléfono: un comportamiento a la vez. Arriba lo que hace el
 * cliente, abajo lo que responde la reserva y, entre ambos, la fibra por la que
 * bajan los datos. Pasan solos, se deslizan de lado y, al tocar la tarjeta,
 * aparece lo que se vio en los datos.
 */
export function BehaviorPhone({ items }: { items: readonly PhoneBehavior[] }) {
  const { t } = useLocale()
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const [held, setHeld] = useState(false)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useCycle(items.length, CARD_MS, inView && !held && !open && !reducedMotion)
  const swipeRef = useRef<HTMLDivElement>(null)
  const go = (i: number) => {
    setHeld(true)
    setOpen(false)
    setIndex((i + items.length) % items.length)
  }
  useSwipe(swipeRef, { onNext: () => go(index + 1), onPrev: () => go(index - 1) })
  const b = items[index]
  const tone = b.source.tone

  return (
    <div ref={ref} className="mt-8 w-full max-w-[380px]">
      <div ref={swipeRef} className="relative">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="block w-full rounded-[28px] border px-6 pb-6 pt-5 text-left outline-none transition-colors duration-500 focus-visible:ring-1 focus-visible:ring-[rgb(var(--bk))]"
          style={{ borderColor: `rgb(${tone} / 0.28)`, background: `radial-gradient(120% 70% at 50% 0%, rgb(${tone} / 0.10), transparent 70%)` }}
        >
          <span key={`tag-${index}`} className="bk-fade flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
            <span className="flex items-center gap-2" style={{ color: `rgb(${tone})` }}>
              <span className="h-2 w-2 rounded-full" style={{ background: `rgb(${tone})`, boxShadow: `0 0 8px rgb(${tone})` }} />
              {t(b.source.label)}
            </span>
            <span className="text-paper/40 tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
          </span>

          <span className="mt-5 block font-mono text-[11px] uppercase tracking-[0.12em] text-paper/45">{t({ es: 'Lo que hace el cliente', en: 'What the client does' })}</span>
          <span key={`does-${index}`} className="bk-fade mt-1.5 block text-[1.45rem] font-light leading-tight text-paper">{t(b.does)}</span>

          {/* La fibra: los datos bajan de lo que hace a lo que responde */}
          <span className="relative my-3 ml-[7px] block h-16 w-px" aria-hidden="true">
            <span className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgb(255 255 255 / 0.45), rgb(${tone}))` }} />
            {!reducedMotion &&
              [0, 1, 2].map((k) => (
                <span key={`${index}-${k}`} className="bk-drip absolute -left-[2.5px] top-0 h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${tone})`, boxShadow: `0 0 6px rgb(${tone})`, animationDelay: `${k * 0.45}s` }} />
              ))}
          </span>

          <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-paper/45">{t({ es: 'Lo que responde la reserva', en: 'What the booking answers' })}</span>
          <span key={`ans-${index}`} className="bk-fade mt-1.5 flex items-start gap-3 text-[15px] leading-snug text-paper/80">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `rgb(${tone})`, boxShadow: `0 0 10px rgb(${tone} / 0.7)` }} />
            {t(b.answer)}
          </span>

          {/* El detalle, al tocar: lo que se vio en los datos */}
          <span className="grid transition-[grid-template-rows,opacity] duration-500 ease-expo" style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}>
            <span className="overflow-hidden">
              <span className="mt-4 block border-t border-white/10 pt-4 text-[14px] leading-relaxed text-paper/65">
                <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-paper/40">{t({ es: 'Lo que se vio', en: 'What we saw' })}</span>
                {t(b.seen)}
              </span>
            </span>
          </span>
          {!open && <span className="mt-4 block text-[14px] text-paper/60">{t({ es: 'Toca para ver lo que se vio', en: 'Tap to see what we saw' })}</span>}
        </button>
        {/* De la tarjeta sale la fibra hacia «La idea» */}
        <span data-fiber-from="bk-idea" className="absolute bottom-0 left-1/2 h-px w-px" />
      </div>

      <ol className="mt-5 flex items-center justify-center gap-2.5">
        {items.map((it, i) => (
          <li key={it.does.es}>
            <button type="button" onClick={() => go(i)} aria-current={i === index ? 'step' : undefined} aria-label={t(it.does)} className={`block rounded-full transition-all duration-500 ${i === index ? 'h-2.5 w-6' : 'h-2 w-2 bg-white/25'}`} style={i === index ? { background: `rgb(${tone})`, boxShadow: `0 0 10px rgb(${tone} / 0.7)` } : undefined} />
          </li>
        ))}
      </ol>
    </div>
  )
}
