'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'

/**
 * Las métricas con que se mide el rediseño: qué es cada una, qué del producto
 * la mueve (todo está en este caso) y cómo se mide, con su escenario de referencia
 * (punto de partida estimado → meta) mientras el módulo sale a clientes y llegan las cifras medidas.
 */
interface ImpactMetric {
  name: L
  what: L
  moves: L
  how: L
  /**
   * Escenario de referencia hasta tener las medidas de UBITS: punto de partida estimado,
   * meta del rediseño y cuánto cambia. Con las cifras reales, solo se reemplazan estos valores.
   */
  from: string
  to: string
  delta: string
  /** Qué se cuenta en `from` y `to`, en pocas palabras */
  unit: L
  /** Altura de la columna en el punto de partida y en la meta (0–1) */
  level: readonly [number, number]
  north?: boolean
}

const METRICS: readonly ImpactMetric[] = [
  {
    name: { es: 'Frecuencia de uso', en: 'Usage frequency' },
    what: { es: 'Empresas que lanzan al menos una medición cada trimestre.', en: 'Companies that launch at least one measurement every quarter.' },
    moves: { es: 'Plantillas con sus reglas, «Crear con IA» con Orbit y el histórico cargado: medir otra vez ya no empieza en blanco.', en: 'Templates with their rules, “Create with AI” with Orbit and loaded history: measuring again no longer starts blank.' },
    how: { es: 'Encuestas publicadas por empresa y por trimestre.', en: 'Surveys published per company per quarter.' },
    from: '30 %',
    to: '55 %',
    delta: '+25 pp',
    unit: { es: 'de las empresas miden cada trimestre', en: 'of companies measure every quarter' },
    level: [0.3, 0.55],
    north: true,
  },
  {
    name: { es: 'Usabilidad', en: 'Usability' },
    what: { es: 'Cuántas empresas y cuántos usuarios están usando el módulo en la plataforma.', en: 'How many companies and users are using the module on the platform.' },
    moves: { es: 'Cinco pasos con candado y resumen vivo, secciones que se numeran solas y una página por tema al responder.', en: 'Five locked steps with a live summary, self-numbering sections and one page per topic when answering.' },
    how: { es: 'Empresas con al menos una encuesta activa y administradores que entran cada mes.', en: 'Companies with at least one active survey and admins who log in each month.' },
    from: '35 %',
    to: '60 %',
    delta: '+25 pp',
    unit: { es: 'de las empresas cliente lo usan', en: 'of client companies use it' },
    level: [0.35, 0.6],
  },
  {
    name: { es: 'Retención', en: 'Retention' },
    what: { es: 'Empresas que renovaron su contrato por influencia del módulo de Encuestas.', en: 'Companies that renewed their contract thanks to the Surveys module.' },
    moves: { es: 'La medición ya no termina en un archivo: resultados en seis pestañas, accionables con dueño y la NOM 035 lista para cumplir.', en: 'Measurement no longer ends in a file: results in six tabs, owned actions and NOM 035 ready to comply.' },
    how: { es: 'Renovaciones de empresas que usan Encuestas, frente a las que no, y lo que oye el equipo comercial en cada renovación.', en: 'Renewals of companies using Surveys vs. those that don’t, and what sales hears at each renewal.' },
    from: '60 %',
    to: '80 %',
    delta: '+20 pp',
    unit: { es: 'de las empresas con Encuestas renuevan', en: 'of companies with Surveys renew' },
    level: [0.6, 0.8],
  },
  {
    name: { es: 'ARR', en: 'ARR' },
    what: { es: 'Ingreso recurrente al año del módulo de Encuestas: lo que ya tenía y lo que suman las empresas nuevas que lo compran.', en: 'Annual recurring revenue of the Surveys module: what it already had plus what new companies buying it add.' },
    moves: { es: 'Un módulo completo que se vende solo: clima, cultura, eNPS y NOM 035, del constructor a los accionables.', en: 'A complete module that sells on its own: climate, culture, eNPS and NOM 035, from builder to actions.' },
    how: { es: 'ARR del módulo en el CRM: contratos vigentes más los nuevos con Encuestas, en USD al año.', en: 'Module ARR in the CRM: current contracts plus new ones with Surveys, in USD per year.' },
    from: 'USD 0,8 M',
    to: 'USD 1 M',
    delta: '+25 %',
    unit: { es: 'ARR del módulo de Encuestas', en: 'Surveys module ARR' },
    level: [0.64, 0.8],
  },
]

/** Cada cuánto se enciende la siguiente métrica mientras pasan solas (ms) */
const STEP_MS = 4200
/** Cuánto tarda en subir el nivel de una columna (ms) */
const RISE_MS = 1400

/**
 * 06 · Impacto: cuatro columnas que se llenan. Cada métrica parte de su nivel
 * estimado (la línea punteada) y sube hasta la meta; arriba flota cuánto
 * cambia. Se encienden una tras otra; tocar una dice qué es, qué la mueve y
 * cómo se mide. De la última sale la fibra hacia «Demo».
 */
export function EncImpact() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  const [hold, setHold] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion || hold) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % METRICS.length), STEP_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, hold, active])

  const risen = reducedMotion || inView
  const current = METRICS[active]

  return (
    <div ref={rootRef} className="mx-auto max-w-[920px]">
      <p className="mt-6 text-center font-mono text-[11px] md:text-[10px] uppercase tracking-[0.18em] text-paper/45">{t({ es: 'Escenario de referencia', en: 'Reference scenario' })} · {t({ es: 'punto de partida → meta', en: 'starting point → target' })}</p>

      <ol className="mt-10 grid grid-cols-4 items-end gap-3 sm:gap-8">
        {METRICS.map((m, i) => {
          const on = i === active
          const [from, to] = m.level
          const level = !risen ? 0 : on ? to : from
          return (
            <li key={m.name.es} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  setHold(true)
                  setActive(i)
                }}
                aria-pressed={on}
                aria-label={`${t(m.name)}: ${m.from} → ${m.to}`}
                className="group flex w-full flex-col items-center outline-none"
              >
                {/* La columna: el nivel sube del punto de partida a la meta */}
                <span className={`relative block h-[clamp(11rem,8rem+12vw,17rem)] w-full max-w-[7rem] overflow-hidden rounded-[999px_999px_18px_18px] border transition-colors duration-500 ${on ? 'border-white/40' : 'border-white/12 group-hover:border-white/25'}`}>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 origin-bottom bg-gradient-to-t from-signal/25 to-signal/90 transition-transform ease-expo"
                    style={{ height: '100%', transform: `scaleY(${level})`, transitionDuration: `${RISE_MS}ms`, transitionDelay: `${i * 140}ms`, opacity: on ? 1 : 0.4 }}
                  />
                  {/* La superficie del líquido, que brilla en la métrica elegida */}
                  <span aria-hidden="true" className="absolute inset-x-0 h-px bg-white transition-[bottom] ease-expo" style={{ bottom: `${level * 100}%`, transitionDuration: `${RISE_MS}ms`, transitionDelay: `${i * 140}ms`, boxShadow: on ? '0 0 14px 3px rgb(var(--signal) / 0.8)' : 'none', opacity: on ? 1 : 0.5 }} />
                  {/* El punto de partida */}
                  <span aria-hidden="true" className="absolute inset-x-2 border-t border-dashed border-white/60" style={{ bottom: `${from * 100}%` }} />
                  {i === METRICS.length - 1 && <span data-fiber-from="enc-demo" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className={`mt-3 rounded-full px-2 py-0.5 text-[12px] tabular-nums transition-colors sm:text-sm ${on ? 'bg-signal text-on-signal' : 'text-paper/55'}`}>{m.delta}</span>
                {m.north && <span className="mt-2 font-mono text-[11px] md:text-[9px] uppercase tracking-[0.16em] text-signal">{t({ es: 'Norte', en: 'North star' })}</span>}
                <span className={`mt-1.5 text-balance text-center text-[13px] leading-tight transition-opacity sm:text-base ${on ? 'opacity-100' : 'opacity-55 group-hover:opacity-85'}`}>{t(m.name)}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* La métrica elegida: de dónde parte, a dónde llega, qué la mueve */}
      <div key={active} aria-live="polite" className="obj-fade mx-auto mt-12 max-w-[760px] text-center">
        <p className="text-[clamp(1.3rem,1rem+1.2vw,2rem)] font-light tabular-nums">
          <span className="text-paper/45">{current.from}</span>
          <span className="mx-3 text-signal">→</span>
          <span>{current.to}</span>
          <span className="ml-3 text-sm text-paper/55">{t(current.unit)}</span>
        </p>
        <p className="mx-auto mt-4 max-w-[60ch] text-balance text-sm leading-relaxed text-paper/75 md:text-base">{t(current.moves)}</p>
        <p className="mt-3 font-mono text-[11px] text-paper/45">
          {t({ es: 'Qué es', en: 'What it is' })}: {t(current.what)} · {t({ es: 'Cómo se mide', en: 'How it’s measured' })}: {t(current.how)}
        </p>
      </div>
    </div>
  )
}
