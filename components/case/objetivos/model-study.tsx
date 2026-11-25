'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { MODELS, type ModelId } from './models-data'

const AUTO_MS = 3200

interface Knob {
  label: L
  options: readonly L[]
  /** Qué opción usa cada modelo (índice en `options`), según models-data.ts. */
  pick: Record<ModelId, number>
}

const OPT: L = { es: 'Opcional', en: 'Optional' }
const REQ: L = { es: 'Obligatorio', en: 'Required' }

/** Las mismas seis perillas para todos los modelos: solo cambia en qué posición está cada una. */
const KNOBS: readonly Knob[] = [
  { label: { es: 'Norte', en: 'North' }, options: [OPT, REQ], pick: { smart: 0, okr: 1, kpi: 0, nct: 1, mbo: 1 } },
  { label: { es: 'Alineación', en: 'Alignment' }, options: [OPT, REQ], pick: { smart: 0, okr: 1, kpi: 0, nct: 0, mbo: 1 } },
  { label: { es: 'Debajo', en: 'Below' }, options: [{ es: 'Nada', en: 'None' }, OPT, REQ], pick: { smart: 1, okr: 2, kpi: 0, nct: 2, mbo: 1 } },
  { label: { es: 'Cierre', en: 'Closing' }, options: [{ es: 'Acumulado', en: 'Cumulative' }, { es: 'Umbral', en: 'Threshold' }, { es: 'Sí / no', en: 'Yes / no' }], pick: { smart: 0, okr: 0, kpi: 1, nct: 0, mbo: 2 } },
  { label: { es: 'Reporte', en: 'Reporting' }, options: [{ es: 'Libre', en: 'Free' }, { es: 'Semanal', en: 'Weekly' }, { es: 'Mensual', en: 'Monthly' }], pick: { smart: 0, okr: 1, kpi: 2, nct: 1, mbo: 0 } },
  { label: { es: 'Duración', en: 'Length' }, options: [{ es: 'Mes', en: 'Month' }, { es: 'Trimestre', en: 'Quarter' }, { es: 'Año', en: 'Year' }], pick: { smart: 1, okr: 1, kpi: 0, nct: 1, mbo: 2 } },
]

/**
 * Simulación del estudio: cinco empresas tipo. No son cinco productos sino las
 * mismas seis perillas en distinta posición; al cambiar de modelo solo se mueven.
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
    <figure data-reveal className="border border-fg/15 p-5 md:p-6">
      <figcaption className="mono-label mb-4 opacity-70">{t({ es: 'Cinco formas de escribir objetivos, las mismas seis reglas', en: 'Five ways to write goals, the same six rules' })}</figcaption>

      <div role="tablist" aria-label={t({ es: 'Modelos', en: 'Models' })} className="grid grid-cols-5 border border-fg/20 p-1">
        {MODELS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => pick(i)}
            className="relative overflow-hidden py-2.5 font-mono text-[12px] tracking-wide transition-colors hover:bg-fg/[0.06] aria-selected:bg-signal aria-selected:text-on-signal sm:text-[13px]"
          >
            {m.label}
            {i === active && auto && !reducedMotion && (
              <span key={active} aria-hidden="true" className="obj-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-paper/70" style={{ animationDuration: `${AUTO_MS}ms` }} />
            )}
          </button>
        ))}
      </div>

      <p key={current.id} className="obj-fade mt-4 text-sm opacity-70">{t(current.company)}</p>

      <dl className="mt-5 space-y-2.5" aria-live="polite">
        {KNOBS.map((k, ki) => {
          const at = k.pick[current.id]
          const n = k.options.length
          return (
            <div key={k.label.es} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
              <dt className="mono-label text-[10px] opacity-60">{t(k.label)}</dt>
              <dd className="relative grid rounded-full bg-fg/[0.07] p-0.5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {/* La perilla: se desliza a la opción del modelo activo */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0.5 left-0.5 rounded-full bg-signal transition-transform duration-500 ease-expo"
                  style={{ width: `calc((100% - 4px) / ${n})`, transform: `translateX(${at * 100}%)`, transitionDelay: `${ki * 50}ms` }}
                />
                {k.options.map((o, oi) => (
                  <span
                    key={o.es}
                    className={`relative truncate px-1 py-1.5 text-center text-[12px] transition-colors duration-500 sm:text-[13px] ${oi === at ? 'text-paper' : 'opacity-45'}`}
                    style={{ transitionDelay: `${ki * 50}ms` }}
                  >
                    {t(o)}
                  </span>
                ))}
              </dd>
            </div>
          )
        })}
      </dl>
    </figure>
  )
}
