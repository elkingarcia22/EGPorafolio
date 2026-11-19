'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { MODELS, RULES, type CompanyModel } from './models-data'

const AUTO_MS = 3200

/** Cuántas reglas comparte un modelo con otro. */
const shared = (a: CompanyModel, b: CompanyModel) => RULES.filter((r) => a.rules[r.id].es === b.rules[r.id].es).length

/**
 * Simulación del estudio: cinco empresas tipo, cada una con su manera de escribir
 * objetivos. La tabla deja ver que no son cinco productos sino las mismas seis
 * reglas combinadas distinto.
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
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-fg/15 p-5">
        <span className="mono-label">{t({ es: 'Cómo escriben objetivos cinco empresas distintas', en: 'How five different companies write goals' })}</span>
        <span className="mono-label border border-dashed border-fg/30 px-2 py-1 opacity-70">{t({ es: 'Simulación · empresas tipo', en: 'Simulation · typical companies' })}</span>
      </figcaption>

      <div role="tablist" aria-label={t({ es: 'Empresas tipo', en: 'Typical companies' })} className="grid grid-cols-2 gap-px bg-fg/15 sm:grid-cols-5">
        {MODELS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => pick(i)}
            className="relative bg-bg p-4 text-left transition-colors hover:bg-fg/[0.05] aria-selected:bg-signal aria-selected:text-paper"
          >
            <span className="block text-2xl font-light tracking-tight">{m.label}</span>
            <span className="mt-1 block text-[12px] leading-snug opacity-75">{t(m.company)}</span>
            {i === active && auto && !reducedMotion && (
              <span key={active} className="obj-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-paper/70" style={{ animationDuration: `${AUTO_MS}ms` }} />
            )}
          </button>
        ))}
      </div>

      <div key={current.id} className="obj-fade grid gap-6 border-b border-fg/15 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <p className="text-lg leading-snug">{t(current.why)}</p>
        <p className="border-l-2 border-signal pl-4 text-sm leading-relaxed opacity-80">
          <span className="mono-label mb-1 block text-signal">{t(current.noun)} · {t({ es: 'ejemplo', en: 'example' })}</span>
          {t(current.example)}
        </p>
      </div>

      {/* Teléfono y tableta: en vez de una tabla de seis columnas que hay que deslizar, las reglas del
          modelo activo, cada una con los cinco modelos marcados según la compartan o no. */}
      <dl className="divide-y divide-fg/10 lg:hidden">
        {RULES.map((r, ri) => (
          <div key={r.id} className="grid gap-2 px-5 py-4">
            <dt className="text-[12px] leading-snug opacity-60">{t(r.label)}</dt>
            <dd key={`${current.id}-${r.id}`} className="obj-fade text-[16px] leading-snug" style={{ animationDelay: `${ri * 40}ms` }}>{t(current.rules[r.id])}</dd>
            <dd className="flex flex-wrap gap-1.5" aria-label={t({ es: 'Modelos con la misma regla', en: 'Models with the same rule' })}>
              {MODELS.map((m, i) => {
                const same = m.rules[r.id].es === current.rules[r.id].es
                const tone = i === active ? 'border-signal bg-signal text-paper' : same ? 'border-signal/50 bg-signal/10 text-signal' : 'border-fg/15 opacity-40'
                return (
                  <span key={m.id} className={`rounded-sm border px-2 py-0.5 font-mono text-[11px] transition-colors duration-500 ${tone}`}>
                    {m.label}
                  </span>
                )
              })}
            </dd>
          </div>
        ))}
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 py-4 font-mono text-[11px] tabular-nums">
          <span className="opacity-60">{t({ es: 'Reglas en común', en: 'Rules in common' })}</span>
          {MODELS.map((m, i) =>
            i === active ? null : (
              <span key={m.id}>
                {m.label} {shared(current, m)}/6
              </span>
            ),
          )}
        </div>
      </dl>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <caption className="sr-only">{t({ es: 'Reglas de cada modelo', en: 'Rules of each model' })}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[24%] p-3 text-left font-normal" />
              {MODELS.map((m, i) => (
                <th key={m.id} scope="col" className={`p-3 text-left font-mono text-[11px] font-normal transition-colors ${i === active ? 'text-signal' : 'opacity-50'}`}>
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RULES.map((r, ri) => (
              <tr key={r.id} className="border-t border-fg/10">
                <th scope="row" className="p-3 text-left font-normal opacity-70">{t(r.label)}</th>
                {MODELS.map((m, i) => {
                  const same = m.rules[r.id].es === current.rules[r.id].es
                  const tone = i === active ? 'bg-signal/15 text-fg' : same ? 'bg-signal/[0.07]' : 'opacity-40'
                  return (
                    <td key={m.id} className="p-1.5">
                      <span
                        className={`block rounded-sm px-2 py-1.5 transition-all duration-500 ${tone}`}
                        style={{ transitionDelay: `${ri * 40}ms` }}
                      >
                        {t(m.rules[r.id])}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className="border-t border-fg/15">
              <th scope="row" className="p-3 text-left font-mono text-[11px] font-normal opacity-60">{t({ es: 'Reglas en común', en: 'Rules in common' })}</th>
              {MODELS.map((m, i) => (
                <td key={m.id} className="p-3 font-mono text-[11px] tabular-nums">
                  {i === active ? <span className="text-signal">—</span> : <span>{shared(current, m)}/6</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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
