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
  },
]

/** Cada cuánto se enciende la siguiente métrica mientras pasan solas (ms) */
const STEP_MS = 4200
/** Al entrar, la fibra se tiende de una métrica a la siguiente (ms por tramo) */
const DRAW_MS = 380

/**
 * 07 · Impacto (con la misma forma que en Objetivos): las cuatro métricas del rediseño sobre una sola fibra, con la
 * métrica norte primero. Al entrar se encienden una tras otra; después se lee
 * una a la vez: qué la mueve en el producto y cómo se mide. Tocar una la
 * elige. De la última sale la fibra hacia «Demo».
 */
export function EncImpact() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [lit, setLit] = useState(reducedMotion ? METRICS.length : 0)
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
    const id = window.setTimeout(
      () => (lit < METRICS.length ? setLit((n) => n + 1) : setActive((a) => (a + 1) % METRICS.length)),
      lit < METRICS.length ? (lit === 0 ? 250 : DRAW_MS) : STEP_MS,
    )
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, hold, lit, active])

  const fill = Math.max(0, lit - 1) / (METRICS.length - 1)
  const current = METRICS[active]

  return (
    <div ref={rootRef} className="mx-auto max-w-[1000px]">
      <ol className="relative grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {/* La fibra que une las cuatro métricas: se tiende al entrar */}
        <span aria-hidden="true" className="absolute inset-x-[12.5%] top-[7px] hidden h-px bg-white/12 md:block" />
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] top-[7px] hidden h-px w-3/4 origin-left bg-gradient-to-r from-signal via-[rgb(var(--glow))] to-[rgb(var(--spark))] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform ease-out md:block"
          style={{ transform: `scaleX(${fill})`, transitionDuration: `${DRAW_MS}ms` }}
        />
        {METRICS.map((m, i) => {
          const on = i < lit
          const isActive = i === active && lit > 0
          return (
            <li key={m.name.es} className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  setHold(true)
                  setLit(METRICS.length)
                  setActive(i)
                }}
                aria-pressed={isActive}
                className="group flex flex-col items-center outline-none"
              >
                <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${isActive ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]' : on ? 'border-white/60 bg-signal' : 'border-white/35 bg-void'}`} />
                  {isActive && <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                  {i === METRICS.length - 1 && <span data-fiber-from="enc-demo" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                {m.north && <span className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-signal">{t({ es: 'Métrica norte', en: 'North star' })}</span>}
                <span className={`mt-3 bg-gradient-to-b from-white to-white/60 bg-clip-text text-[clamp(1.9rem,1.2rem+2.2vw,3.4rem)] font-light leading-none text-transparent tabular-nums transition-opacity duration-500 ${isActive ? 'opacity-100' : on ? 'opacity-60 group-hover:opacity-90' : 'opacity-20'}`} style={{ filter: isActive ? 'drop-shadow(0 0 18px rgb(var(--signal) / 0.55))' : 'none' }}>
                  {m.delta}
                </span>
                <span
                  className={`${m.north ? 'mt-1.5' : 'mt-4'} text-balance text-center text-[clamp(1.05rem,0.9rem+0.6vw,1.45rem)] font-light leading-tight tracking-tight transition-opacity duration-500 ${isActive ? 'opacity-100' : on ? 'opacity-55 group-hover:opacity-85' : 'opacity-25'}`}
                >
                  {t(m.name)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* La métrica en lectura: de dónde parte, a dónde llega y cuánto cambia */}
      <div key={`band-${active}`} className="obj-fade relative mx-auto mt-12 max-w-[880px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_70%_0%,rgb(var(--signal)/0.18),transparent_60%)] px-6 py-8 md:px-10">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">{t({ es: 'Escenario de referencia', en: 'Reference scenario' })} · {t(current.unit)}</p>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">{t({ es: 'Punto de partida', en: 'Starting point' })}</p>
            <p className="mt-2 text-[clamp(2rem,1.2rem+2.6vw,3.8rem)] font-light leading-none text-paper/45 tabular-nums">{current.from}</p>
          </div>
          {/* La fibra entre el antes y la meta, con la señal que la recorre */}
          <div className="relative flex w-[clamp(4rem,10vw,9rem)] flex-col items-center">
            <span className="rounded-full bg-signal px-3 py-1 text-sm font-medium text-on-signal shadow-[0_0_24px_-4px_rgb(var(--signal)/0.9)] tabular-nums">{current.delta}</span>
            <span className="relative mt-3 h-px w-full overflow-hidden bg-white/15">
              <span className="absolute inset-y-0 left-0 w-1/3 animate-[impact-flow_1.6s_cubic-bezier(.65,0,.35,1)_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />
            </span>
          </div>
          <div className="text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">{t({ es: 'Meta', en: 'Target' })}</p>
            <p className="mt-2 text-[clamp(2.4rem,1.4rem+3.2vw,4.6rem)] font-light leading-none tabular-nums" style={{ filter: 'drop-shadow(0 0 22px rgb(var(--signal) / 0.45))' }}>{current.to}</p>
          </div>
        </div>
      </div>

      {/* Qué es, qué la mueve y cómo se mide */}
      <div key={active} aria-live="polite" className="obj-fade mx-auto mt-8 grid max-w-[880px] gap-6 text-left md:grid-cols-3">
        {[
          { tag: t({ es: 'Qué es', en: 'What it is' }), text: t(current.what) },
          { tag: t({ es: 'Qué la mueve', en: 'What moves it' }), text: t(current.moves) },
          { tag: t({ es: 'Cómo se mide', en: 'How it’s measured' }), text: t(current.how) },
        ].map((col) => (
          <div key={col.tag} className="border-l border-white/12 pl-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">{col.tag}</p>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">{col.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
