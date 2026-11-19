'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { MODELS, type CompanyModel, type ModelId } from './models-data'

type Writer = 'leader' | 'collaborator' | 'hr'
type Measure = 'money' | 'percentage' | 'numeric' | 'boolean'
type Direction = 'increase' | 'decrease' | 'maintain'

const WRITERS: readonly { id: Writer; label: L; initials: string; path: L }[] = [
  { id: 'leader', label: { es: 'Líder', en: 'Lead' }, initials: 'LC', path: { es: 'Lo redacta el líder', en: 'The lead writes it' } },
  { id: 'collaborator', label: { es: 'Colaboradores', en: 'Employees' }, initials: 'MR', path: { es: 'Lo propone la persona; el líder aprueba', en: 'The person proposes; the lead approves' } },
  { id: 'hr', label: { es: 'RR. HH.', en: 'HR' }, initials: 'RH', path: { es: 'Lo define RR. HH.; sin paso de participantes', en: 'HR defines it; no participants step' } },
]

const MEASURES: readonly { id: Measure; label: L; symbol: string }[] = [
  { id: 'money', label: { es: 'Dinero', en: 'Money' }, symbol: '$' },
  { id: 'percentage', label: { es: 'Porcentaje', en: 'Percentage' }, symbol: '%' },
  { id: 'numeric', label: { es: 'Numérico', en: 'Number' }, symbol: '#' },
  { id: 'boolean', label: { es: 'Se cumple o no', en: 'Done or not' }, symbol: '✓' },
]

const DIRECTIONS: readonly { id: Direction; label: L; glyph: string }[] = [
  { id: 'increase', label: { es: 'Aumentar', en: 'Increase' }, glyph: '↗' },
  { id: 'decrease', label: { es: 'Reducir', en: 'Decrease' }, glyph: '↘' },
  { id: 'maintain', label: { es: 'Mantener', en: 'Maintain' }, glyph: '→' },
]

/** Los ejemplos del playground para cada medida y dirección. */
const EXAMPLES: Record<Exclude<Measure, 'boolean'>, Record<Direction, L>> = {
  money: {
    increase: { es: 'Aumentar las ventas del área de $50.000.000 a $80.000.000', en: 'Grow the area’s sales from $50M to $80M' },
    decrease: { es: 'Reducir los costos operativos de $15.000.000 a $10.000.000', en: 'Cut operating costs from $15M to $10M' },
    maintain: { es: 'Mantener los costos operativos entre $9.000.000 y $11.000.000 al mes', en: 'Keep operating costs between $9M and $11M a month' },
  },
  percentage: {
    increase: { es: 'Subir la satisfacción del cliente del 78 % al 90 %', en: 'Raise customer satisfaction from 78 % to 90 %' },
    decrease: { es: 'Bajar la tasa de cancelación de clientes del 15 % al 5 %', en: 'Lower customer churn from 15 % to 5 %' },
    maintain: { es: 'Mantener la satisfacción del cliente en 90 %, sin bajar del 85 %', en: 'Keep customer satisfaction at 90 %, never under 85 %' },
  },
  numeric: {
    increase: { es: 'Pasar de 12 a 20 clientes nuevos al mes', en: 'Go from 12 to 20 new customers a month' },
    decrease: { es: 'Reducir de 30 a 10 las quejas recibidas al mes', en: 'Cut complaints from 30 to 10 a month' },
    maintain: { es: 'Mantener el NPS entre 40 y 60', en: 'Keep NPS between 40 and 60' },
  },
}
const BOOLEAN_EXAMPLE: L = { es: 'Lanzar el nuevo CRM', en: 'Launch the new CRM' }
const NORTH: L = { es: 'Crecer los ingresos un 15 %', en: 'Grow revenue 15 %' }

/** Lo que cuelga del objetivo, en singular, y cómo se comporta. */
const CHILD: Record<ModelId, { one: L; note: L } | null> = {
  smart: { one: { es: 'Acción clave', en: 'Key action' }, note: { es: 'el plan; no mueve el avance', en: 'the plan; doesn’t move progress' } },
  okr: { one: { es: 'Resultado clave', en: 'Key result' }, note: { es: 'mueve el avance', en: 'drives progress' } },
  kpi: null,
  nct: { one: { es: 'Tarea', en: 'Task' }, note: { es: 'obligatoria', en: 'required' } },
  mbo: { one: { es: 'Hito', en: 'Milestone' }, note: { es: 'opcional', en: 'optional' } },
}

/** Lo que el producto cubre para que cualquier empresa entre sin cambiar su forma de trabajar. */
const COVERAGE: readonly { glyph: string; label: L }[] = [
  { glyph: '◎', label: { es: '5 modelos y uno propio', en: '5 models and a custom one' } },
  { glyph: '⇣', label: { es: 'Cascada empresa → grupo → persona', en: 'Cascade company → group → person' } },
  { glyph: '◍', label: { es: 'Por grupo o individuales', en: 'By group or individual' } },
  { glyph: '$', label: { es: '4 tipos de medida', en: '4 measure types' } },
  { glyph: '↗', label: { es: 'Aumentar, reducir o mantener', en: 'Increase, decrease or maintain' } },
  { glyph: '◷', label: { es: 'De un mes a un año', en: 'From a month to a year' } },
  { glyph: '✎', label: { es: 'Quién redacta', en: 'Who writes' } },
  { glyph: '◔', label: { es: 'Recordatorios de avance', en: 'Progress reminders' } },
  { glyph: '⇪', label: { es: 'Carga masiva por archivo', en: 'Bulk upload by file' } },
  { glyph: '✦', label: { es: 'Crear con IA', en: 'Create with AI' } },
]

const INK = 'rgb(64,96,255)'

interface ChipsProps<T extends string> {
  label: string
  value: T
  options: readonly { id: T; label: L; glyph?: string; symbol?: string }[]
  onChange: (v: T) => void
}

function Chips<T extends string>({ label, value, options, onChange }: ChipsProps<T>) {
  const { t } = useLocale()
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            onClick={() => onChange(o.id)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/70 ring-1 ring-white/10 transition-[background-color,color,transform] duration-300 hover:text-white active:scale-95 aria-checked:bg-white aria-checked:text-[#0b0d16] aria-checked:ring-white"
          >
            {(o.glyph ?? o.symbol) && <span className="font-mono opacity-60">{o.glyph ?? o.symbol}</span>}
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

/** El cierre del objetivo, dibujado según el modelo: barra acumulada, umbral o cumplió/no. */
function Closing({ model, binary, maintain }: { model: CompanyModel; binary: boolean; maintain: boolean }) {
  const { t } = useLocale()
  if (binary || model.id === 'mbo') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="obj-fade rounded-full bg-[#17b26a]/15 px-3 py-1 text-[12px] font-medium text-[#067647]">✓ {t({ es: 'Cumplió', en: 'Met' })}</span>
        <span className="rounded-full bg-black/[0.05] px-3 py-1 text-[12px] text-black/40">{t({ es: 'No cumplió', en: 'Not met' })}</span>
        <span className="ml-auto font-mono text-[10px] text-black/40">{t({ es: 'sin grados intermedios', en: 'no in-between' })}</span>
      </div>
    )
  }
  if (model.id === 'kpi' || maintain) {
    return (
      <div>
        <svg viewBox="0 0 240 40" className="h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
          <rect x="0" y="8" width="240" height="18" fill="rgba(23,178,106,0.12)" />
          <line x1="0" x2="240" y1="26" y2="26" stroke="#17b26a" strokeDasharray="4 4" />
          <path d="M0 20 L30 16 L60 22 L90 13 L120 18 L150 11 L180 17 L210 14 L240 16" fill="none" stroke={INK} strokeWidth="2.2" pathLength={1} strokeDasharray={1} className="obj-draw" />
        </svg>
        <p className="mt-1 font-mono text-[10px] text-black/45">{maintain && model.id !== 'kpi' ? t({ es: 'dentro del rango = 100 %', en: 'inside the range = 100 %' }) : t({ es: 'umbral que hay que mantener', en: 'threshold to keep' })}</p>
      </div>
    )
  }
  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
        <span className="obj-bar block h-full w-[72%] origin-left rounded-full" style={{ background: INK }} />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-black/45">
        <span>{t({ es: 'acumulado', en: 'cumulative' })}</span>
        <span>72 % · {t({ es: 'Cumplió parcialmente', en: 'Partly met' })}</span>
      </div>
    </div>
  )
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
  const binary = measure === 'boolean'
  const maintain = direction === 'maintain' && !binary
  const fullTitle = t(binary ? BOOLEAN_EXAMPLE : EXAMPLES[measure][direction])
  const title = useTypewriter(fullTitle, aiRun, !reducedMotion)
  const northRequired = model.rules.north.es === 'Obligatorio'
  const against: L = maintain ? { es: 'Rango aceptable', en: 'Acceptable range' } : model.target
  const child = CHILD[model.id]

  const facts: readonly [L, L][] = [
    [{ es: 'Se reporta', en: 'Reported' }, model.rules.cadence],
    [{ es: 'Duración', en: 'Length' }, model.rules.period],
    [{ es: 'Alineación', en: 'Alignment' }, model.rules.alignment],
    [{ es: 'Se mide contra', en: 'Against' }, against],
  ]

  return (
    <figure data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0b0d16] text-white">
      <span className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-signal opacity-25 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#7b5cff] opacity-20 blur-3xl" aria-hidden="true" />

      {/* Modelos: la primera decisión, la más grande. */}
      <div role="radiogroup" aria-label={t({ es: 'Modelo', en: 'Model' })} className="relative grid grid-cols-2 border-b border-white/10 sm:grid-cols-5">
        {MODELS.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={m.id === modelId} onClick={() => {
              setModelId(m.id)
              // Un KPI no persigue una meta: se cuida en un nivel.
              if (m.id === 'kpi') setDirection('maintain')
            }} className="group relative px-5 py-5 text-left transition-colors hover:bg-white/[0.04]">
            <span className={`block text-[clamp(1.4rem,1rem+1vw,2rem)] font-light tracking-tight transition-colors duration-300 ${m.id === modelId ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>{m.label}</span>
            <span className={`mt-1 block text-[12px] transition-colors duration-300 ${m.id === modelId ? 'text-white/70' : 'text-white/30'}`}>{t(m.tagline)}</span>
            <span className={`absolute inset-x-5 bottom-0 h-0.5 origin-left bg-signal transition-transform duration-500 ease-expo ${m.id === modelId ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="relative grid gap-10 p-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:p-8">
        <div className="space-y-6">
          <Chips label={t({ es: 'Quién redacta', en: 'Who writes' })} value={writer} options={WRITERS} onChange={setWriter} />
          <Chips label={t({ es: 'Tipo de medida', en: 'Measure type' })} value={measure} options={MEASURES} onChange={setMeasure} />
          <div className={`transition-opacity duration-300 ${binary ? 'pointer-events-none opacity-30' : ''}`} aria-hidden={binary}>
            <Chips label={t({ es: 'Dirección', en: 'Direction' })} value={direction} options={DIRECTIONS} onChange={setDirection} />
          </div>
          <dl key={`${model.id}-${direction}`} className="obj-fade grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 text-[12px]">
            {facts.map(([k, v]) => (
              <div key={k.es} className="bg-[#0f1220] px-3 py-2.5">
                <dt className="text-white/40">{t(k)}</dt>
                <dd className="mt-0.5 text-white/90">{t(v)}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* La vista previa: el norte, la línea que baja y el objetivo armado con las reglas elegidas. */}
        <div className="relative pb-6">
          <div className={`relative mx-auto w-[86%] rounded-xl px-4 py-2.5 transition-colors duration-500 ${northRequired ? 'bg-signal text-paper' : 'border border-dashed border-white/25 text-white/60'}`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
              {t({ es: 'Norte de la empresa', en: 'Company north' })} · {northRequired ? t({ es: 'obligatorio', en: 'required' }) : t({ es: 'opcional', en: 'optional' })}
            </span>
            <span className="mt-0.5 block text-sm">{t(NORTH)}</span>
          </div>
          <span className="relative mx-auto block h-8 w-px overflow-hidden bg-white/15" aria-hidden="true">
            {northRequired && !reducedMotion && <span className="obj-drip absolute inset-x-0 top-0 h-3 bg-signal" />}
          </span>

          <article key={`${model.id}-${measure}`} className="obj-rise relative rounded-2xl bg-white p-5 text-[#0b0d16] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-2">
              <span className="rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ background: 'rgba(64,96,255,0.1)', color: INK }}>{t(model.noun)}</span>
              <span className="truncate text-[11px] text-black/45">{t(writerMeta.path)}</span>
              <span className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0b0d16] text-[10px] font-medium text-white" title={t(writerMeta.label)}>{writerMeta.initials}</span>
            </div>
            <p className="mt-3 min-h-[3.1em] text-[clamp(1.05rem,0.9rem+0.5vw,1.35rem)] leading-snug" aria-live="polite">
              <span className="mr-2 inline-grid h-6 w-6 -translate-y-0.5 place-items-center rounded-full bg-black/[0.06] align-middle font-mono text-[11px]">{measureMeta.symbol}</span>
              {title}
              {title.length < fullTitle.length && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse" style={{ background: INK }} />}
            </p>

            <div className="mt-4">
              <Closing model={model} binary={binary} maintain={maintain} />
            </div>

            {child && (
              <ul className="mt-4 space-y-2 border-t border-black/[0.06] pt-3">
                {[1, 2].map((n, i) => (
                  <li key={`${model.id}-${n}`} className="obj-fade flex items-center gap-2.5 text-[12px]" style={{ animationDelay: `${180 + i * 130}ms` }}>
                    <span className={`h-3.5 w-3.5 shrink-0 rounded ${model.id === 'okr' ? '' : 'border border-black/25'}`} style={model.id === 'okr' ? { background: 'rgba(64,96,255,0.18)' } : undefined} />
                    <span className="whitespace-nowrap text-black/75">{t(child.one)} {n}</span>
                    {model.id === 'okr' ? (
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                        <span className="obj-bar block h-full origin-left rounded-full" style={{ width: n === 1 ? '64%' : '81%', background: INK }} />
                      </span>
                    ) : (
                      <span className="flex-1" />
                    )}
                    <span className="whitespace-nowrap font-mono text-[10px] text-black/40">{t(child.note)}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <button
            type="button"
            onClick={() => setAiRun((n) => n + 1)}
            className="absolute bottom-0 right-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7b5cff] to-signal px-4 py-2 text-[12px] font-medium text-white shadow-[0_12px_30px_-10px_rgba(64,96,255,0.9)] transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            ✦ {t({ es: 'Crear con IA', en: 'Create with AI' })}
          </button>
        </div>
      </div>

      <div className="relative border-t border-white/10 p-5 md:p-8">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Lo que cubre para que nadie cambie su forma de trabajar', en: 'What it covers so nobody changes how they work' })}</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {COVERAGE.map((c, i) => (
            <li
              key={c.label.es}
              data-reveal="pop"
              style={{ transitionDelay: `${i * 50}ms` }}
              className="group rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10 transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-signal/20 font-mono text-[13px] text-[#9fb2ff] transition-colors group-hover:bg-signal group-hover:text-white">{c.glyph}</span>
              <span className="mt-2.5 block text-[12px] leading-snug text-white/80">{t(c.label)}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
