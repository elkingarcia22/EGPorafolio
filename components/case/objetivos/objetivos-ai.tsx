'use client'

import { useEffect, useMemo, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { Block, Body, SubHead } from '@/components/case/barberlytics/ui'
import { AREAS, EMPRESA, OBJETIVOS, avanceArea, avanceEmpresa, cuenta, pct } from './cascade-model'

/** Frentes y semillas del brief de «Crear con IA» (aiObjectiveBrief.ts). */
const FOCUS = [
  { id: 'crecimiento', label: 'Crecimiento', seeds: ['Aumentar las ventas de la empresa', 'Aumentar los clientes nuevos de la empresa', 'Aumentar los ingresos totales de la empresa'] },
  { id: 'rentabilidad', label: 'Rentabilidad', seeds: ['Reducir los costos operativos de la empresa', 'Aumentar el margen de rentabilidad de la empresa', 'Reducir el gasto general de la empresa'] },
  { id: 'clientes', label: 'Clientes', seeds: ['Subir la satisfacción de los clientes', 'Aumentar la retención de los clientes', 'Reducir los tickets de soporte sin resolver'] },
  { id: 'personas', label: 'Personas', seeds: ['Reducir la rotación de los colaboradores', 'Subir la cobertura de formación de los colaboradores', 'Mejorar el clima organizacional de la empresa'] },
  { id: 'operacion', label: 'Operación', seeds: ['Reducir los incidentes operativos de la empresa', 'Subir el cumplimiento de entregas a tiempo', 'Automatizar los procesos internos de la empresa'] },
  { id: 'producto', label: 'Producto', seeds: ['Lanzar nuevos productos al mercado', 'Aumentar la adopción de nuevas funcionalidades', 'Modernizar la tecnología de la empresa'] },
] as const

const AMBITION = [
  { id: 'conservador', label: 'Conservador', tagline: 'Metas que se cumplen' },
  { id: 'retador', label: 'Retador', tagline: 'Exige mejorar' },
  { id: 'agresivo', label: 'Agresivo', tagline: 'Metas de ruptura' },
] as const

/** Lo que el generador deduce del verbo: dirección y tipo de medida. */
function deduce(title: string): { direction: string; measure: string } {
  if (/^(Aumentar|Subir|Mejorar)/.test(title)) return { direction: 'Aumentar', measure: 'Porcentaje' }
  if (/^Reducir/.test(title)) return { direction: 'Reducir', measure: 'Numérico' }
  return { direction: 'Cumplir', measure: 'Hito (sí / no)' }
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/40 aria-pressed:border-signal aria-pressed:bg-signal aria-pressed:text-white">
      {children}
    </button>
  )
}

/** Brief de cinco preguntas → objetivos propuestos, que aparecen uno a uno. */
function BriefGenerator() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [focus, setFocus] = useState<(typeof FOCUS)[number]['id']>('clientes')
  const [ambition, setAmbition] = useState<(typeof AMBITION)[number]['id']>('retador')
  const [count, setCount] = useState(2)
  const [shown, setShown] = useState(0)
  const [run, setRun] = useState(0)

  const proposal = (FOCUS.find((f) => f.id === focus)?.seeds ?? []).slice(0, count)

  useEffect(() => {
    if (run === 0) return
    if (reducedMotion) {
      setShown(proposal.length)
      return
    }
    setShown(0)
    const timers = proposal.map((_, i) => window.setTimeout(() => setShown(i + 1), 450 + i * 650))
    return () => timers.forEach(window.clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  return (
    <div data-reveal className="grid overflow-hidden rounded-xl bg-[#121318] text-paper ring-1 ring-white/10 lg:grid-cols-2">
      <div className="space-y-6 border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
          <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#7b5cff] to-[#ff5ca8]" /> {t({ es: 'Crear con IA · brief', en: 'Create with AI · brief' })}
        </p>
        <fieldset>
          <legend className="mb-2 text-sm">{t({ es: '¿En qué se juega el ciclo?', en: 'What’s at stake this cycle?' })}</legend>
          <div className="flex flex-wrap gap-2">
            {FOCUS.map((f) => (
              <Chip key={f.id} on={focus === f.id} onClick={() => setFocus(f.id)}>{f.label}</Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm">{t({ es: '¿Qué tan exigentes deben ser las metas?', en: 'How demanding should targets be?' })}</legend>
          <div className="flex flex-wrap gap-2">
            {AMBITION.map((a) => (
              <Chip key={a.id} on={ambition === a.id} onClick={() => setAmbition(a.id)}>{a.label}</Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm">{t({ es: '¿Cuántos objetivos?', en: 'How many goals?' })}</legend>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <Chip key={n} on={count === n} onClick={() => setCount(n)}>{n}</Chip>
            ))}
          </div>
        </fieldset>
        <p className="text-[12px] leading-relaxed text-white/45">{t({ es: 'Las otras dos preguntas —qué momento vive la empresa y qué más tener en cuenta— son texto libre.', en: 'The other two questions —what moment the company is in and what else to consider— are free text.' })}</p>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-md bg-signal px-4 py-2 text-sm text-white transition-transform hover:-translate-y-0.5">
          {t({ es: 'Proponer objetivos', en: 'Propose goals' })} →
        </button>
      </div>
      <div className="min-h-[320px] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">{t({ es: 'Propuesta', en: 'Proposal' })} · {AMBITION.find((a) => a.id === ambition)?.tagline}</p>
        {run === 0 ? (
          <p className="mt-10 text-sm text-white/40">{t({ es: 'Responde y toca «Proponer objetivos».', en: 'Answer and tap “Propose goals”.' })}</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {proposal.map((title, i) => {
              const d = deduce(title)
              return (
                <li key={`${run}-${title}`} className={`rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-500 ease-expo ${i < shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
                  <p className="text-[15px]">{title}</p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-white/50">
                    <span>{d.direction}</span>
                    <span>{d.measure}</span>
                    <span>{t({ es: 'Peso', en: 'Weight' })} {Math.round(100 / proposal.length)} %</span>
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

type Confidence = 'Alta' | 'Media'
interface Reading {
  kind: L
  text: string
  evidence: string
  confidence: Confidence
}

/** Las lecturas son reglas sobre las cifras del ciclo de ejemplo, calculadas aquí mismo. */
function useReadings(): readonly Reading[] {
  return useMemo(() => {
    const pending = OBJETIVOS.filter((o) => !cuenta(o))
    const unaligned = AREAS.filter((a) => OBJETIVOS.some((o) => o.area === a && !o.empresa))
    const areas = AREAS.map((a) => ({ a, v: avanceArea(OBJETIVOS, a) })).filter((x) => x.v > 0).sort((x, y) => x.v - y.v)
    const company = EMPRESA.map((e) => ({ e, v: avanceEmpresa(OBJETIVOS, e.id) })).sort((x, y) => x.v - y.v)
    return [
      { kind: { es: 'Hallazgo', en: 'Finding' }, text: `«${company[company.length - 1].e.titulo}» es el que más avanza.`, evidence: `${pct(company[company.length - 1].v)} de avance ponderado por peso.`, confidence: 'Alta' },
      { kind: { es: 'Riesgo', en: 'Risk' }, text: `${areas[0].a} va por detrás del resto.`, evidence: `${pct(areas[0].v)} frente a ${pct(areas[areas.length - 1].v)} de ${areas[areas.length - 1].a}.`, confidence: 'Alta' },
      { kind: { es: 'Riesgo', en: 'Risk' }, text: `${pending.length} objetivos todavía no cuentan.`, evidence: pending.map((o) => `${o.persona}: ${o.etapa === 'por-aprobar' ? 'por aprobar' : 'por ajustar'}`).join(' · '), confidence: 'Media' },
      { kind: { es: 'Qué hacer', en: 'What to do' }, text: unaligned.length ? `Alinear ${unaligned.join(', ')} con un objetivo de empresa.` : 'Recordar a los líderes los objetivos por aprobar.', evidence: unaligned.length ? 'Su aporte hoy cae en «sin alinear».' : `${pending.length} pendientes.`, confidence: 'Media' },
    ]
  }, [])
}

/** La lectura de la IA: cada frase con su evidencia y su confiabilidad. */
function AiReading() {
  const { t } = useLocale()
  const readings = useReadings()
  const [open, setOpen] = useState(1)
  return (
    <div data-reveal className="overflow-hidden rounded-xl border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <p className="text-sm">{t({ es: 'Lectura de la IA', en: 'AI reading' })} · <span className="text-white/50">KPIs corporativos 2026</span></p>
        <span className="font-mono text-[10px] text-white/40">{t({ es: 'reglas sobre las cifras', en: 'rules over the numbers' })}</span>
      </div>
      <ol>
        {readings.map((r, i) => (
          <li key={r.text} className="border-b border-white/[0.06] last:border-0">
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="grid w-full grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-signal">{t(r.kind)}</span>
              <span className="text-[15px]">{r.text}</span>
              <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${r.confidence === 'Alta' ? 'bg-[#17b26a]/15 text-[#4fd1a1]' : 'bg-[#f38744]/15 text-[#f5a46e]'}`}>{r.confidence}</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-expo ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <p className="overflow-hidden px-5 text-sm text-white/60">
                <span className="block pb-4 pl-[6.5rem]">{t({ es: 'Evidencia', en: 'Evidence' })}: {r.evidence}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

const PIPE: readonly L[] = [
  { es: 'Commit en staging del playground', en: 'Commit on playground staging' },
  { es: 'Se cruza con los casos de uso', en: 'Matched with use cases' },
  { es: 'Claude redacta la propuesta con pantallazo', en: 'Claude drafts the proposal with a screenshot' },
  { es: 'Una persona la aprueba', en: 'A person approves it' },
]

/** El motor de sincronización: cada 15 minutos, del código al tablero, con una persona al final. */
function SyncPipeline() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  return (
    <figure data-reveal className="rounded-xl border border-white/10 p-6">
      <ol className="relative grid gap-6 md:grid-cols-4">
        <span className="absolute left-0 right-0 top-[11px] hidden h-px bg-white/15 md:block" aria-hidden="true">
          {!reducedMotion && <span className="obj-travel absolute -top-[3px] h-[7px] w-10 rounded-full bg-signal blur-[1px]" />}
        </span>
        {PIPE.map((step, i) => (
          <li key={step.es} className="relative">
            <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] ${i === PIPE.length - 1 ? 'bg-paper text-ink' : 'bg-signal text-white'}`}>{i + 1}</span>
            <p className="mt-3 text-sm leading-snug">{t(step)}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-6 font-mono text-[11px] leading-relaxed text-white/50">
        {t({ es: 'Corre cada 15 minutos en GitHub Actions. Nunca cambia un caso de uso ni escribe en Jira: propone y espera.', en: 'Runs every 15 minutes on GitHub Actions. It never changes a use case or writes to Jira: it proposes and waits.' })}
      </figcaption>
    </figure>
  )
}

/** 06 · IA: en el producto (crear, leer) y en el proceso (casos de uso y sincronización). */
export function ObjetivosAi() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(OBJ_CASE.ai.lead)}</p>
      <Block className="!mt-12">
        <SubHead index="6.1">{t({ es: 'Escribir: cinco preguntas, ningún campo técnico', en: 'Write: five questions, no technical fields' })}</SubHead>
        <Body className="mb-8">{t({ es: 'El autor dice en qué se juega el ciclo y qué tan exigente quiere ser; la dirección y el tipo de medida los deduce el generador. Ninguna respuesta viene marcada: una preseleccionada sería una respuesta que nadie dio.', en: 'The author says what’s at stake and how demanding to be; direction and measure type are deduced by the generator. No answer comes preselected: a preselected one would be an answer nobody gave.' })}</Body>
        <BriefGenerator />
      </Block>
      <Block>
        <SubHead index="6.2">{t({ es: 'Leer: frases con evidencia', en: 'Read: sentences with evidence' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Cada lectura trae de dónde sale y qué tan segura es. Estas se calculan en vivo sobre el ciclo de ejemplo de la portada.', en: 'Each reading shows where it comes from and how sure it is. These are computed live on the sample cycle from the cover.' })}</Body>
        <AiReading />
      </Block>
      <Block>
        <SubHead index="6.3">{t({ es: 'Construir: del código al tablero', en: 'Build: from code to board' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Los 926 casos de uso de Objetivos se abren en su pantalla exacta con ?caso=, y un motor revisa cada cambio del playground contra ellos.', en: 'The 926 Goals use cases open on their exact screen with ?caso=, and an engine checks every playground change against them.' })}</Body>
        <SyncPipeline />
      </Block>
    </div>
  )
}
