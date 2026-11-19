'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { MODELS, type ModelId } from './models-data'

type Writer = 'leader' | 'collaborator' | 'hr'
type Measure = 'money' | 'percentage' | 'numeric' | 'boolean'
type Direction = 'increase' | 'decrease' | 'maintain'

const WRITERS: readonly { id: Writer; label: L; path: L }[] = [
  { id: 'leader', label: { es: 'Líder', en: 'Lead' }, path: { es: 'Cada líder redacta los de su equipo', en: 'Each lead writes their team’s' } },
  { id: 'collaborator', label: { es: 'Colaboradores', en: 'Employees' }, path: { es: 'Cada persona propone los suyos y el líder aprueba', en: 'Each person proposes theirs and the lead approves' } },
  { id: 'hr', label: { es: 'RR. HH.', en: 'HR' }, path: { es: 'RR. HH. los define; el paso de participantes desaparece', en: 'HR defines them; the participants step disappears' } },
]

const MEASURES: readonly { id: Measure; label: L; symbol: string }[] = [
  { id: 'money', label: { es: 'Dinero', en: 'Money' }, symbol: '$' },
  { id: 'percentage', label: { es: 'Porcentaje', en: 'Percentage' }, symbol: '%' },
  { id: 'numeric', label: { es: 'Numérico', en: 'Number' }, symbol: '#' },
  { id: 'boolean', label: { es: 'Se cumple o no', en: 'Done or not' }, symbol: '✓' },
]

const DIRECTIONS: readonly { id: Direction; label: L }[] = [
  { id: 'increase', label: { es: 'Aumentar', en: 'Increase' } },
  { id: 'decrease', label: { es: 'Reducir', en: 'Decrease' } },
  { id: 'maintain', label: { es: 'Mantener', en: 'Maintain' } },
]

/** Los ejemplos del playground para cada medida y dirección. */
const EXAMPLES: Record<Exclude<Measure, 'boolean'>, Record<Direction, L>> = {
  money: {
    increase: { es: 'Aumentar las ventas del área de $50.000.000 a $80.000.000', en: 'Grow the area’s sales from $50M to $80M' },
    decrease: { es: 'Reducir los costos operativos de $15.000.000 a $10.000.000', en: 'Cut operating costs from $15M to $10M' },
    maintain: { es: 'Mantener los costos operativos entre $9.000.000 y $11.000.000 al mes', en: 'Keep operating costs between $9M and $11M a month' },
  },
  percentage: {
    increase: { es: 'Subir la satisfacción del cliente del 78 % al 90 %', en: 'Raise customer satisfaction from 78 % to 90 %' },
    decrease: { es: 'Bajar la tasa de cancelación de clientes del 15 % al 5 %', en: 'Lower customer churn from 15 % to 5 %' },
    maintain: { es: 'Mantener la satisfacción del cliente en 90 %, sin bajar del 85 %', en: 'Keep customer satisfaction at 90 %, never under 85 %' },
  },
  numeric: {
    increase: { es: 'Pasar de 12 a 20 clientes nuevos al mes', en: 'Go from 12 to 20 new customers a month' },
    decrease: { es: 'Reducir de 30 a 10 las quejas recibidas al mes', en: 'Cut complaints from 30 to 10 a month' },
    maintain: { es: 'Mantener el NPS entre 40 y 60', en: 'Keep NPS between 40 and 60' },
  },
}
const BOOLEAN_EXAMPLE: L = { es: 'Lanzar el nuevo CRM', en: 'Launch the new CRM' }

/** Lo que el producto cubre para que cualquier empresa entre sin cambiar su forma de trabajar. */
const COVERAGE: readonly L[] = [
  { es: '5 modelos y uno propio', en: '5 models and a custom one' },
  { es: 'Cascada empresa → grupo → persona', en: 'Cascade company → group → person' },
  { es: 'Por grupo o individuales', en: 'By group or individual' },
  { es: '4 tipos de medida', en: '4 measure types' },
  { es: 'Aumentar, reducir o mantener', en: 'Increase, decrease or maintain' },
  { es: 'De un mes a un año', en: 'From a month to a year' },
  { es: 'Quién redacta', en: 'Who writes' },
  { es: 'Recordatorios de avance', en: 'Progress reminders' },
  { es: 'Carga masiva por archivo', en: 'Bulk upload by file' },
  { es: 'Crear con IA', en: 'Create with AI' },
]

interface SegProps<T extends string> {
  label: string
  value: T
  options: readonly { id: T; label: L }[]
  onChange: (v: T) => void
}

function Segmented<T extends string>({ label, value, options, onChange }: SegProps<T>) {
  const { t } = useLocale()
  return (
    <div>
      <p className="mono-label mb-2 opacity-60">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            onClick={() => onChange(o.id)}
            className="whitespace-nowrap border border-fg/20 px-3 py-1.5 text-[13px] transition-colors hover:border-fg/50 aria-checked:border-signal aria-checked:bg-signal aria-checked:text-paper"
          >
            {t(o.label)}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Escribe el texto letra por letra, como lo haría «Crear con IA». */
function useTypewriter(text: string, run: number, enabled: boolean): string {
  const [shown, setShown] = useState(text)
  const first = useRef(true)
  useEffect(() => {
    if (first.current || !enabled) {
      first.current = false
      setShown(text)
      return
    }
    let i = 0
    setShown('')
    const id = window.setInterval(() => {
      i += 2
      setShown(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 18)
    return () => window.clearInterval(id)
  }, [text, run, enabled])
  return shown
}

/**
 * La idea en una pieza: el producto se adapta a la empresa. Cada elección cambia
 * cómo se llama el objetivo, qué cuelga de él, cómo se cierra y quién lo escribe.
 */
export function ModelConfigurator() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [modelId, setModelId] = useState<ModelId>('okr')
  const [writer, setWriter] = useState<Writer>('leader')
  const [measure, setMeasure] = useState<Measure>('percentage')
  const [direction, setDirection] = useState<Direction>('increase')
  const [aiRun, setAiRun] = useState(0)

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0]
  const measureMeta = MEASURES.find((m) => m.id === measure) ?? MEASURES[0]
  const writerMeta = WRITERS.find((w) => w.id === writer) ?? WRITERS[0]
  const example = measure === 'boolean' ? BOOLEAN_EXAMPLE : EXAMPLES[measure][direction]
  const title = useTypewriter(t(example), aiRun, !reducedMotion)
  const against: L = direction === 'maintain' && measure !== 'boolean' ? { es: 'Rango aceptable', en: 'Acceptable range' } : model.target

  return (
    <figure data-reveal className="border border-fg/15">
      <figcaption className="mono-label border-b border-fg/15 p-5">
        {t({ es: 'Pruébalo: arma el ciclo como lo haría tu empresa', en: 'Try it: set up the cycle the way your company would' })}
      </figcaption>
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-6 border-b border-fg/15 p-5 md:border-b-0 md:border-r">
          <Segmented label={t({ es: 'Modelo', en: 'Model' })} value={modelId} options={MODELS.map((m) => ({ id: m.id, label: { es: m.label, en: m.label } }))} onChange={setModelId} />
          <Segmented label={t({ es: 'Quién redacta', en: 'Who writes' })} value={writer} options={WRITERS} onChange={setWriter} />
          <Segmented label={t({ es: 'Tipo de medida', en: 'Measure type' })} value={measure} options={MEASURES} onChange={setMeasure} />
          {measure !== 'boolean' && <Segmented label={t({ es: 'Dirección', en: 'Direction' })} value={direction} options={DIRECTIONS} onChange={setDirection} />}
        </div>

        <div className="flex flex-col gap-4 bg-fg/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="mono-label opacity-60">{t(writerMeta.path)}</span>
            <button
              type="button"
              onClick={() => setAiRun((n) => n + 1)}
              className="shrink-0 whitespace-nowrap rounded-full border border-signal/60 px-3 py-1 text-[12px] text-signal transition-colors hover:bg-signal hover:text-paper"
            >
              ✦ {t({ es: 'Crear con IA', en: 'Create with AI' })}
            </button>
          </div>

          <article key={model.id} className="obj-fade rounded-md border border-fg/15 bg-bg p-5 shadow-[0_18px_40px_-28px_rgb(0_0_0/0.6)]">
            <div className="flex items-start justify-between gap-3">
              <span className="mono-label text-signal">{t(model.noun)}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-signal/15 font-mono text-sm text-signal" aria-label={t(measureMeta.label)}>
                {measureMeta.symbol}
              </span>
            </div>
            <p className="mt-2 min-h-[3.2em] text-xl font-light leading-snug" aria-live="polite">
              {title}
              {title.length < t(example).length && <span className="ml-0.5 inline-block h-5 w-px translate-y-1 animate-pulse bg-signal" />}
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-fg/10 pt-4 text-[13px]">
              <div>
                <dt className="opacity-55">{t({ es: 'Se mide contra', en: 'Measured against' })}</dt>
                <dd>{t(against)}</dd>
              </div>
              <div>
                <dt className="opacity-55">{t({ es: 'Se cierra', en: 'Closes' })}</dt>
                <dd>{measure === 'boolean' ? t({ es: 'Cumplió o no', en: 'Met or not' }) : t(model.rules.closing)}</dd>
              </div>
              <div>
                <dt className="opacity-55">{t({ es: 'Debajo', en: 'Below' })}</dt>
                <dd>{model.childNoun ? t(model.childNoun) : t({ es: 'Nada', en: 'Nothing' })}</dd>
              </div>
              <div>
                <dt className="opacity-55">{t({ es: 'Se reporta', en: 'Reported' })}</dt>
                <dd>{t(model.rules.cadence)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="opacity-55">{t({ es: 'Cuelga de la empresa', en: 'Hangs from the company' })}</dt>
                <dd>{t(model.rules.north)}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>

      <div className="border-t border-fg/15 p-5">
        <p className="mono-label mb-4 opacity-60">{t({ es: 'Lo que cubre para que nadie cambie su forma de trabajar', en: 'What it covers so nobody changes how they work' })}</p>
        <ul className="flex flex-wrap gap-2">
          {COVERAGE.map((c, i) => (
            <li key={c.es} data-reveal="pop" style={{ transitionDelay: `${i * 40}ms` }} className="border border-fg/20 px-3 py-1.5 text-[13px]">
              <span className="mr-1.5 text-signal">✓</span>
              {t(c)}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
