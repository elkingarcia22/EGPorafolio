'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'
import { Screen, UBITS_BLUE, useTicker } from './shared'

const ROUTE = '/admin/desempeno-cultura/encuestas'

interface Step {
  shot: ShotKey
  name: L
  why: L
}

const STEPS: readonly Step[] = [
  { shot: 'general', name: { es: 'Datos generales', en: 'General data' }, why: { es: 'Nombre, tipo, fechas y la decisión que gobierna medio producto: pública o anónima. Los errores solo salen al intentar avanzar; un formulario en blanco no te recibe en rojo.', en: 'Name, type, dates and the decision that governs half the product: public or anonymous. Errors only show when you try to advance; a blank form doesn’t greet you in red.' } },
  { shot: 'participantes', name: { es: 'Participantes', en: 'Participants' }, why: { es: 'Toda la empresa por defecto, porque es el caso común: reducirla es el acto deliberado. Va antes que el contenido a propósito.', en: 'The whole company by default, because it’s the common case: narrowing it is the deliberate act. It comes before content on purpose.' } },
  { shot: 'demograficos', name: { es: 'Datos demográficos', en: 'Demographics' }, why: { es: 'Solo tipos cerrados: el texto libre no agrupa nada («Bogotá», «bogota»…). Cada dato puede mostrarse o servir solo de filtro.', en: 'Closed types only: free text groups nothing (“Bogotá”, “bogota”…). Each field can be shown or used only as a filter.' } },
  { shot: 'secciones', name: { es: 'Secciones y preguntas', en: 'Sections & questions' }, why: { es: 'El árbol de hasta tres niveles, con el resumen vivo a la derecha. Las preguntas llegan escritas a mano, del banco o de un archivo.', en: 'The up-to-three-level tree, with the live summary on the right. Questions arrive typed, from the bank or from a file.' } },
  { shot: 'bienvenida', name: { es: 'Bienvenida y cierre', en: 'Welcome & closing' }, why: { es: 'Las dos páginas se editan a la vez para comparar el tono. En blanco, no se muestran.', en: 'Both pages are edited together to compare tone. Left blank, they don’t show.' } },
]

/** El asistente de cinco pasos, con la captura real de cada uno. */
export function StepperShots() {
  const { t } = useLocale()
  const [active, setActive] = useState(3)
  const step = STEPS[active]
  return (
    <div>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-2" role="tablist" aria-label={t({ es: 'Pasos para crear una encuesta', en: 'Steps to create a survey' })}>
        {STEPS.map((s, i) => {
          const done = i < active
          const on = i === active
          return (
            <li key={s.shot} className="flex items-center">
              <button type="button" role="tab" aria-selected={on} onClick={() => setActive(i)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm transition-colors hover:bg-fg/5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] transition-colors" style={on || done ? { background: UBITS_BLUE, color: '#fff' } : { border: '1px solid currentColor', opacity: 0.5 }}>
                  {done ? '✓' : i + 1}
                </span>
                <span className={on ? 'font-medium' : 'opacity-60'}>{t(s.name)}</span>
              </button>
              {i < STEPS.length - 1 && <span className="mx-1 hidden h-px w-6 sm:block" style={{ background: done ? UBITS_BLUE : 'currentColor', opacity: done ? 1 : 0.2 }} aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-start">
        <div key={step.shot} className="enc-fade lg:col-span-8">
          <Screen shot={SHOTS[step.shot]} route={`${ROUTE}/crear`} />
        </div>
        <div className="lg:col-span-4">
          <p className="mono-label opacity-50">{t({ es: 'Paso', en: 'Step' })} {active + 1} / 5</p>
          <p className="mt-2 text-2xl font-light leading-tight">{t(step.name)}</p>
          <p className="mt-4 leading-relaxed opacity-80">{t(step.why)}</p>
          <p className="mt-6 border-l-2 border-signal pl-4 text-sm leading-relaxed opacity-70">
            {t({ es: 'El candado es real: cada paso se desbloquea cuando el anterior está completo, y «Publicar» revisa los cinco a la vez y abre justo la pregunta que falta.', en: 'The lock is real: each step unlocks when the previous one is complete, and “Publish” checks all five at once and opens the exact question that’s missing.' })}
          </p>
        </div>
      </div>
    </div>
  )
}

const ANALYSIS: readonly L[] = [
  { es: 'Leyendo la estructura de cada archivo…', en: 'Reading each file’s structure…' },
  { es: 'Identificando el tipo de encuesta (Clima, Cultura o NPS)…', en: 'Identifying the survey type (Climate, Culture or NPS)…' },
  { es: 'Haciendo match con la estructura de encuestas de UBITS…', en: 'Matching against the UBITS survey structure…' },
  { es: 'Calculando favorabilidad y eNPS…', en: 'Computing favorability and eNPS…' },
]

const STAGES: readonly { name: L; shot?: ShotKey }[] = [
  { name: { es: 'Archivos', en: 'Files' } },
  { name: { es: 'Análisis', en: 'Analysis' }, shot: 'cargarAnaliza' },
  { name: { es: 'Datos generales', en: 'General data' }, shot: 'cargarDatos' },
  { name: { es: 'Estructura', en: 'Structure' }, shot: 'cargarEstructura' },
]

const MATCH = [
  { label: { es: 'Hacen match con UBITS', en: 'Match UBITS' }, n: 18, color: '#43a970', note: { es: 'Username o correo idéntico: se vinculan solos.', en: 'Identical username or email: linked automatically.' } },
  { label: { es: 'Posibles match', en: 'Possible matches' }, n: 4, color: '#7aa2ff', note: { es: 'Solo coincide el nombre: no vinculamos solos; decide la persona.', en: 'Only the name matches: we don’t link alone; a person decides.' } },
  { label: { es: 'Sin match', en: 'No match' }, n: 6, color: '#979ba3', note: { es: 'Se cargan como participantes sin usuario.', en: 'Loaded as participants without a user.' } },
] as const

/** La carga histórica: del archivo a la encuesta «Externa», con lo que la IA detecta y lo que decide la persona. */
export function UploadPipeline() {
  const { t } = useLocale()
  const [picked, setPicked] = useState<number | null>(null)
  const tick = useTicker(1900, picked === null)
  const stage = picked ?? tick % STAGES.length
  const current = STAGES[stage]

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <ol className="space-y-1" role="tablist" aria-label={t({ es: 'Etapas de la carga', en: 'Upload stages' })}>
          {STAGES.map((s, i) => (
            <li key={s.name.es}>
              <button type="button" role="tab" aria-selected={i === stage} onClick={() => setPicked(i)} className={`relative w-full overflow-hidden rounded-lg border px-4 py-3 text-left transition-colors ${i === stage ? 'border-signal' : 'border-fg/15 hover:border-fg/40'}`}>
                {i === stage && picked === null && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-signal enc-scan" aria-hidden="true" />}
                <span className="font-mono text-[10px] opacity-50">0{i + 1}</span> <span className="ml-2">{t(s.name)}</span>
              </button>
            </li>
          ))}
        </ol>
        <ul className="mt-6 space-y-2 text-sm">
          {ANALYSIS.map((m, i) => (
            <li key={m.es} className={`flex gap-2 transition-opacity duration-500 ${stage >= 1 && i <= (stage === 1 ? tick % 4 : 3) ? 'opacity-90' : 'opacity-25'}`}>
              <span className="text-signal">◆</span> {t(m)}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-7" aria-live="polite">
        {current.shot ? (
          <div key={current.shot} className="enc-fade">
            <Screen shot={SHOTS[current.shot]} route={ROUTE} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        ) : (
          <div key="drop" className="enc-fade flex aspect-[1152/900] flex-col items-center justify-center rounded-xl border-2 border-dashed border-fg/25 p-8 text-center">
            <span className="rounded-lg bg-[#e2f1e2] px-3 py-2 font-mono text-xs text-[#2c6b2f] shadow-lg">Clima 2025.xlsx · 37 KB</span>
            <p className="mt-6 text-lg">{t({ es: 'Elige los archivos o arrástralos aquí', en: 'Choose files or drag them here' })}</p>
            <p className="mt-1 text-sm opacity-60">{t({ es: 'Excel, CSV, PDF o imágenes · hasta 10 MB', en: 'Excel, CSV, PDF or images · up to 10 MB' })}</p>
          </div>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:col-span-12">
        {MATCH.map((m) => (
          <div key={m.label.es} data-reveal className="rounded-lg border border-fg/15 p-4">
            <p className="flex items-baseline justify-between gap-2">
              <span className="text-sm">{t(m.label)}</span>
              <span className="font-mono text-2xl tabular-nums" style={{ color: m.color }}>{m.n}</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed opacity-60">{t(m.note)}</p>
          </div>
        ))}
        <p className="text-sm leading-relaxed opacity-70 sm:col-span-3">
          {t({ es: 'La visibilidad no se elige, se deriva: la carga solo puede ser pública si el archivo trae una fila por persona; si no, se fuerza anónima y se explica por qué. El tipo de encuesta, en cambio, nunca se adivina: un histórico con el tipo equivocado se compararía con lo que no es.', en: 'Visibility isn’t chosen, it’s derived: an upload can only be public if the file has one row per person; otherwise it’s forced anonymous and the reason is shown. The survey type, however, is never guessed: history with the wrong type would be compared with the wrong thing.' })}
        </p>
      </div>
    </div>
  )
}

const TABS: readonly { shot: ShotKey; name: L; question: L }[] = [
  { shot: 'participacion', name: { es: 'Participación', en: 'Participation' }, question: { es: '¿Quién respondió y quién falta?', en: 'Who answered and who’s missing?' } },
  { shot: 'favorabilidad', name: { es: 'Favorabilidad', en: 'Favorability' }, question: { es: '¿Qué tan bien salió, y dónde?', en: 'How did it go, and where?' } },
  { shot: 'heatmap', name: { es: 'Mapa de calor', en: 'Heatmap' }, question: { es: '¿Qué grupo se separa del resto?', en: 'Which group stands apart?' } },
  { shot: 'comentarios', name: { es: 'Preguntas', en: 'Questions' }, question: { es: '¿Qué dijo la gente, una por una?', en: 'What did people say, one by one?' } },
  { shot: 'enps', name: { es: 'eNPS', en: 'eNPS' }, question: { es: '¿Nos recomiendan?', en: 'Would they recommend us?' } },
  { shot: 'ia', name: { es: 'Análisis con IA', en: 'AI analysis' }, question: { es: '¿Qué hago con todo esto?', en: 'What do I do with all this?' } },
  { shot: 'accionables', name: { es: 'Accionables', en: 'Actions' }, question: { es: '¿Quién hace qué, y para cuándo?', en: 'Who does what, and by when?' } },
  { shot: 'comparativo', name: { es: 'Comparativo', en: 'Comparison' }, question: { es: '¿Mejoramos frente a la medición anterior?', en: 'Did we improve on the last measurement?' } },
]

/** Resultados: cada pestaña responde una sola pregunta. */
export function ResultsTabs() {
  const { t } = useLocale()
  const [active, setActive] = useState(0)
  const tab = TABS[active]
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-fg/15" role="tablist" aria-label={t({ es: 'Pestañas de resultados', en: 'Results tabs' })}>
        {TABS.map((x, i) => (
          <button key={x.shot} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm transition-colors ${i === active ? 'border-signal text-signal' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            {t(x.name)}
          </button>
        ))}
      </div>
      <p key={`q-${active}`} className="enc-fade mt-6 text-[clamp(1.4rem,1rem+1.2vw,2rem)] font-light">«{t(tab.question)}»</p>
      <div key={tab.shot} className="enc-fade mt-6">
        <Screen shot={SHOTS[tab.shot]} route={tab.shot === 'comparativo' ? `${ROUTE}/comparativo` : `${ROUTE}/c2026-1/resultados`} />
      </div>
    </div>
  )
}
