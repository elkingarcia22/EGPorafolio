'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { APP, Pill, RumboOrb } from './platform'
import { useInView } from './ui'

/** Los seis tipos de búsqueda que ofrece Rumbo (como en la app). */
interface SearchType {
  name: L
  desc: L
  /** Respuestas del vendedor a País, Industria (o empresa) y Criterios. */
  answers: readonly [L, L, L]
  result: L
}

const TYPES: readonly SearchType[] = [
  {
    name: { es: 'Empresas por criterios', en: 'Companies by criteria' },
    desc: { es: 'Busca empresas según país, industria y criterios específicos.', en: 'Find companies by country, industry and specific criteria.' },
    answers: [{ es: 'México', en: 'Mexico' }, { es: 'Salud', en: 'Healthcare' }, { es: 'Más de 200 empleados, sin dueño en HubSpot', en: '200+ employees, no owner in HubSpot' }],
    result: { es: '12 candidatas · 3 libres en HubSpot · 9 nuevas', en: '12 candidates · 3 free in HubSpot · 9 new' },
  },
  {
    name: { es: 'Muchas empresas por criterios', en: 'Many companies by criteria' },
    desc: { es: 'Hasta 200 empresas de un país e industria, por rondas, con un tope de créditos que tú confirmas.', en: 'Up to 200 companies in one country and industry, in rounds, with a credit cap you confirm.' },
    answers: [{ es: 'Colombia', en: 'Colombia' }, { es: 'Manufactura', en: 'Manufacturing' }, { es: '150 empresas · tope de 40 créditos', en: '150 companies · 40-credit cap' }],
    result: { es: 'Ronda 1 de 4 · 38 candidatas · 0 créditos usados', en: 'Round 1 of 4 · 38 candidates · 0 credits used' },
  },
  {
    name: { es: 'Árbol de una empresa', en: 'A company’s tree' },
    desc: { es: 'Desde una empresa, encuentra su grupo y matriz, sus filiales y dónde opera en otros países.', en: 'From one company, find its group and parent, its subsidiaries and where it operates abroad.' },
    answers: [{ es: 'Toda la región', en: 'Whole region' }, { es: 'Empresa: Grupo Meridiano', en: 'Company: Grupo Meridiano' }, { es: 'Filiales con más de 200 empleados', en: 'Subsidiaries with 200+ employees' }],
    result: { es: '1 matriz · 7 filiales en 4 países', en: '1 parent · 7 subsidiaries in 4 countries' },
  },
  {
    name: { es: 'Competidores de una empresa', en: 'A company’s competitors' },
    desc: { es: 'Encuentra empresas que compiten con una de referencia.', en: 'Find companies that compete with a reference one.' },
    answers: [{ es: 'Perú', en: 'Peru' }, { es: 'Referencia: Andes Retail', en: 'Reference: Andes Retail' }, { es: 'Mismo tamaño o mayor', en: 'Same size or bigger' }],
    result: { es: '8 competidores · 2 ya en HubSpot con dueño', en: '8 competitors · 2 already owned in HubSpot' },
  },
  {
    name: { es: 'Proveedores de una empresa', en: 'A company’s suppliers' },
    desc: { es: 'Empresas que le venden a una empresa que tú eliges.', en: 'Companies that sell to a company you pick.' },
    answers: [{ es: 'Chile', en: 'Chile' }, { es: 'Cliente: Minera Austral', en: 'Client: Minera Austral' }, { es: 'Contratos públicos de los últimos 2 años', en: 'Public contracts, last 2 years' }],
    result: { es: '11 proveedores con contrato citado', en: '11 suppliers with a cited contract' },
  },
  {
    name: { es: 'Enriquecer empresa de HubSpot', en: 'Enrich a HubSpot company' },
    desc: { es: 'Pega el enlace de HubSpot: la traigo, completo sus datos y te la asigno si no tiene responsable.', en: 'Paste the HubSpot link: I bring it, fill in its data and assign it to you if it has no owner.' },
    answers: [{ es: 'Detectado: Guatemala', en: 'Detected: Guatemala' }, { es: 'Enlace de HubSpot pegado', en: 'HubSpot link pasted' }, { es: 'Completar industria, tamaño y número fiscal', en: 'Fill industry, size and tax ID' }],
    result: { es: '4 campos completados · asignada a ti', en: '4 fields filled · assigned to you' },
  },
]

const STEPS: readonly L[] = [
  { es: 'Tipo', en: 'Type' }, { es: 'País', en: 'Country' }, { es: 'Industria', en: 'Industry' },
  { es: 'Criterios', en: 'Criteria' }, { es: 'Resumen', en: 'Summary' }, { es: 'Revisión', en: 'Review' },
]

const QUESTIONS: readonly L[] = [
  { es: '¿En qué país buscamos?', en: 'Which country do we search?' },
  { es: '¿Qué industria o empresa de referencia?', en: 'Which industry or reference company?' },
  { es: '¿Algún criterio más?', en: 'Any more criteria?' },
]

/** El panel de Rumbo: la conversación avanza sola, o eliges el tipo de búsqueda. */
export function RumboPanel() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.35)
  const [type, setType] = useState(0)
  // 0 = elegir tipo, 1..3 = preguntas, 4 = resumen, 5 = revisión
  const [stage, setStage] = useState(0)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!seen) return
    const wait = stage === 0 ? (touched ? 99999 : 2600) : stage === 5 ? 5200 : 1500
    const id = window.setTimeout(() => {
      if (stage < 5) return setStage(stage + 1)
      setTouched(false)
      setType((n) => (n + 1) % TYPES.length)
      setStage(0)
    }, wait)
    return () => window.clearTimeout(id)
  }, [seen, stage, touched])

  const pick = (i: number) => {
    setTouched(true)
    setType(i)
    setStage(1)
  }
  const cur = TYPES[type]

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="order-2 lg:order-1">
        <p className="mono-label mb-3 opacity-60">{t({ es: 'Elige cómo buscar', en: 'Pick how to search' })}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {TYPES.map((ty, i) => (
            <li key={ty.name.es}>
              <button
                onClick={() => pick(i)}
                aria-pressed={type === i}
                className={`h-full w-full rounded-[12px] border p-3.5 text-left transition-colors ${type === i ? 'border-[#8b5cf6] bg-[#8b5cf6]/10' : 'border-fg/15 hover:border-fg/40'}`}
              >
                <span className="flex items-center justify-between gap-2 text-sm font-medium">{t(ty.name)}<span className="font-mono text-[10px] opacity-50">{i + 1}</span></span>
                <span className="mt-1 block text-xs leading-snug opacity-65">{t(ty.desc)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-1 overflow-hidden rounded-[16px] ring-1 ring-white/10 lg:order-2" style={{ background: APP.side, color: APP.text }} data-reveal="device">
        <header className="flex items-center gap-2.5 px-4 pt-4">
          <RumboOrb size={30} pulse={stage > 0 && stage < 5} />
          <span className="min-w-0">
            <span className="block text-sm font-medium">Rumbo</span>
            <span className="block truncate text-[11px] opacity-55">{t({ es: 'Generar empresas candidatas', en: 'Generate candidate companies' })}</span>
          </span>
        </header>
        <div className="mt-3 flex gap-4 border-b px-4 text-xs" style={{ borderColor: APP.line }}>
          <span className="border-b-2 border-[#5b7eff] pb-2">{t({ es: 'Conversación', en: 'Conversation' })}</span>
          <span className="pb-2 opacity-50">{t({ es: 'Búsquedas', en: 'Searches' })}</span>
        </div>
        <ol className="flex justify-between px-4 pt-3" aria-label={t({ es: 'Pasos', en: 'Steps' })}>
          {STEPS.map((s, i) => (
            <li key={s.es} className="flex flex-col items-center gap-1 text-[9px]">
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] transition-colors duration-500 ${i < stage ? 'bg-[#5b7eff] text-white' : i === stage ? 'bg-white text-black' : 'ring-1 ring-white/20 opacity-50'}`}>{i < stage ? '✓' : i + 1}</span>
              <span className={i === stage ? '' : 'opacity-45'}>{t(s)}</span>
            </li>
          ))}
        </ol>
        <div className="flex h-[300px] flex-col justify-end gap-2.5 overflow-hidden px-4 py-4 text-[12.5px]">
          <Bubble>{t({ es: 'Hola, te ayudaré a encontrar los prospectos que necesitas. ¿Qué tipo de prospectos quieres encontrar?', en: 'Hi, I’ll help you find the prospects you need. What kind of prospects do you want to find?' })}</Bubble>
          {stage >= 1 && <Mine>{t(cur.name)}</Mine>}
          {QUESTIONS.map((q, i) => stage >= i + 1 && (
            <div key={q.es} className="flex flex-col gap-2.5">
              <Bubble>{t(q)}</Bubble>
              {stage >= i + 2 && <Mine>{t(cur.answers[i])}</Mine>}
            </div>
          ))}
          {stage >= 5 && (
            <div className="animate-[ramp-in_.5s_ease] rounded-[12px] p-3 ring-1 ring-[#5b7eff]/40" style={{ background: APP.card }}>
              <p className="flex items-center gap-2 text-[11px] opacity-70"><RumboOrb size={14} />{t({ es: 'Listo para revisión', en: 'Ready for review' })}</p>
              <p className="mt-1.5 font-medium">{t(cur.result)}</p>
              <p className="mt-2 flex flex-wrap gap-1.5"><Pill tone="green">{t({ es: 'Con fuente citada', en: 'Source cited' })}</Pill><Pill tone="amber">{t({ es: 'Por revisar', en: 'To review' })}</Pill></p>
            </div>
          )}
          {stage > 0 && stage < 5 && <p className="flex items-center gap-1.5 text-[11px] opacity-50"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8b5cf6]" />{t({ es: 'Rumbo está escribiendo…', en: 'Rumbo is typing…' })}</p>}
        </div>
      </div>
    </div>
  )
}

function Bubble({ children }: { children: React.ReactNode }) {
  return <p className="flex gap-2"><RumboOrb size={16} className="mt-0.5" /><span className="leading-snug">{children}</span></p>
}

function Mine({ children }: { children: React.ReactNode }) {
  return <p className="ml-auto max-w-[85%] rounded-[12px] rounded-br-sm bg-[#5b7eff] px-3 py-1.5 text-white">{children}</p>
}
