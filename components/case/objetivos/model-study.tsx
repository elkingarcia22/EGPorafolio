'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { MODELS, RULES } from './models-data'

const AUTO_MS = 3600

/**
 * Simulación del estudio: cinco empresas tipo, cada una con su manera de escribir
 * objetivos. Se ve un modelo a la vez con sus seis reglas; el cierre explica que
 * todos combinan las mismas.
 */
export function ModelStudy() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || reducedMotion) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % MODELS.length), AUTO_MS)
    return () => window.clearInterval(id)
  }, [auto, reducedMotion])

  const pick = (i: number) => {
    setAuto(false)
    setActive(i)
  }
  const current = MODELS[active]

  return (
    <figure data-reveal className="border border-fg/15">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 pb-4 pt-5">
        <span className="mono-label">{t({ es: 'Cómo escriben objetivos cinco empresas distintas', en: 'How five different companies write goals' })}</span>
        <span className="mono-label opacity-50">{t({ es: 'Simulación', en: 'Simulation' })}</span>
      </figcaption>

      <div role="tablist" aria-label={t({ es: 'Empresas tipo', en: 'Typical companies' })} className="mx-5 grid grid-cols-5 border border-fg/20 p-1">
        {MODELS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => pick(i)}
            className="relative overflow-hidden py-2.5 font-mono text-[12px] tracking-wide transition-colors hover:bg-fg/[0.06] aria-selected:bg-signal aria-selected:text-paper sm:text-[13px]"
          >
            {m.label}
            {i === active && auto && !reducedMotion && (
              <span key={active} aria-hidden="true" className="obj-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-paper/70" style={{ animationDuration: `${AUTO_MS}ms` }} />
            )}
          </button>
        ))}
      </div>

      <div key={current.id} className="obj-fade p-5 md:p-6">
        <p className="mono-label text-signal">{t(current.company)}</p>
        <p className="mt-2 max-w-[40ch] text-[clamp(1.15rem,1rem+0.6vw,1.5rem)] font-light leading-snug">{t(current.why)}</p>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm leading-relaxed opacity-75">{t(current.example)}</p>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-fg/10 bg-fg/10 md:grid-cols-3">
          {RULES.map((r) => (
            <div key={r.id} className="bg-bg px-4 py-3">
              <dt className="text-[11px] leading-snug opacity-55">{t(r.label)}</dt>
              <dd className="mt-1 text-[15px] leading-snug">{t(current.rules[r.id])}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="border-t border-fg/15 p-5 text-sm leading-relaxed opacity-75">
        {t({
          es: 'Lo que salió de comparar: ningún modelo inventa piezas nuevas. Todos combinan las mismas seis reglas. Si el producto expone esas reglas, cada empresa trabaja como ya trabaja.',
          en: 'What came out of comparing: no model invents new pieces. They all combine the same six rules. If the product exposes those rules, each company works the way it already does.',
        })}
      </p>
    </figure>
  )
}
