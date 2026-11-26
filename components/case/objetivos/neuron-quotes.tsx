'use client'

import { useRef } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { useAutoplay } from './use-autoplay'

/** Tiempo de lectura de cada regla (ms) */
const RULE_MS = 4200

interface NeuronQuotesProps {
  label: L
  items: readonly L[]
  /** Nombre corto de cada neurona (p. ej. «regla_» → regla_01) */
  tag: string
}

/** Frases como una fibra con una neurona por frase: la activa se lee grande; avanza sola y se puede tocar. */
export function NeuronQuotes({ label, items: rules, tag }: NeuronQuotesProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const { index: active, go } = useAutoplay(rootRef, { count: rules.length, ms: RULE_MS, loop: true, disabled: reducedMotion })

  return (
    <div ref={rootRef} className="mx-auto mt-[clamp(4rem,3rem+4vw,7rem)] flex max-w-[760px] flex-col items-center text-center">
      <p className="mono-label text-paper/50">{t(label)}</p>
      <p key={active} aria-live="polite" className="obj-fade mt-5 flex min-h-[7.5rem] max-w-[30ch] items-center text-[clamp(1.3rem,1rem+1.3vw,2rem)] font-light leading-[1.2] tracking-tight">
        {t(rules[active])}
      </p>
      {/* La fibra: se enciende hasta la regla activa; tocar una neurona la muestra */}
      <ol className="relative mt-8 flex w-full max-w-[560px] items-center justify-between">
        <span className="absolute inset-x-2 top-[7px] h-px bg-white/12" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute left-2 top-[7px] h-px bg-gradient-to-r from-signal to-[#ff54aa] shadow-[0_0_8px_rgb(var(--signal)/0.7)] transition-[width] duration-700 ease-expo"
          style={{ width: `calc((100% - 1rem) * ${active / (rules.length - 1)})` }}
        />
        {rules.map((rule, i) => (
          <li key={rule.es} className="relative">
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === active ? 'step' : undefined}
              aria-label={t(rule)}
              className="group flex flex-col items-center gap-3"
            >
              <span className={`relative block h-[15px] w-[15px] rounded-full border transition-all duration-500 ease-expo ${i === active ? 'border-white bg-signal shadow-[0_0_0_6px_rgb(var(--signal)/0.18),0_0_18px_3px_rgb(var(--signal)/0.7)]' : i < active ? 'border-white/60 bg-white/50' : 'border-white/35 bg-void group-hover:border-white'}`}>
                {i === active && <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />}
              </span>
              <span className={`font-mono text-[11px] tracking-[0.12em] transition-opacity duration-300 ${i === active ? 'text-signal opacity-100' : 'opacity-40 group-hover:opacity-80'}`}>{tag}{String(i + 1).padStart(2, '0')}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
