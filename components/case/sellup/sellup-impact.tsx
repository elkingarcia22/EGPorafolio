'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'

/**
 * Las métricas con que se mide SellUp, por vendedor y por semana. Todavía no
 * hay medición de antes y después: los valores son un escenario de referencia
 * (punto de partida estimado → meta). Con las cifras reales, solo cambian aquí.
 */
interface ImpactMetric {
  name: L
  from: string
  to: string
  delta: string
  unit: L
  moves: L
  how: L
  north?: boolean
}

const METRICS: readonly ImpactMetric[] = [
  {
    name: { es: 'Leads calificados', en: 'Qualified leads' },
    from: '10',
    to: '25',
    delta: '+150 %',
    unit: { es: 'empresas listas para trabajar, por vendedor a la semana', en: 'companies ready to work, per rep per week' },
    moves: { es: 'Los tres agentes en cadena: empresa libre, decisor y primer contacto, con una persona que aprueba cada paso.', en: 'The three chained agents: free company, decision-maker and first contact, with a person approving each step.' },
    how: { es: 'Empresas aprobadas en «Por revisar» por vendedor y semana.', en: 'Companies approved in “To review” per rep per week.' },
    north: true,
  },
  {
    name: { es: 'Buscar empresas', en: 'Finding companies' },
    from: '6 h',
    to: '1,5 h',
    delta: '−75 %',
    unit: { es: 'horas de búsqueda a la semana, por vendedor', en: 'search hours a week, per rep' },
    moves: { es: 'El agente 1 barre HubSpot, los registros oficiales y la web antes de pagar, y verifica que nadie la tenga.', en: 'Agent 1 sweeps HubSpot, official registries and the web before paying, and checks nobody owns it.' },
    how: { es: 'Tiempo entre lanzar una búsqueda y aprobar sus empresas.', en: 'Time from launching a search to approving its companies.' },
  },
  {
    name: { es: 'Buscar contactos', en: 'Finding contacts' },
    from: '5 h',
    to: '1 h',
    delta: '−80 %',
    unit: { es: 'horas buscando a quién decide, a la semana', en: 'hours finding who decides, per week' },
    moves: { es: 'El agente 2 empieza por HubSpot y lo ya conocido, y solo paga un perfil o un teléfono cuando hace falta.', en: 'Agent 2 starts with HubSpot and what’s already known, and only pays for a profile or phone when needed.' },
    how: { es: 'Tiempo entre pedir contactos y aprobarlos.', en: 'Time from requesting contacts to approving them.' },
  },
  {
    name: { es: 'Éxito del primer contacto', en: 'First-contact success' },
    from: '18 %',
    to: '30 %',
    delta: '+12 pp',
    unit: { es: 'de los primeros contactos que logran respuesta', en: 'of first contacts that get a reply' },
    moves: { es: 'El agente 3 llega con hechos citados de la empresa y del decisor, y un mensaje distinto por canal.', en: 'Agent 3 arrives with cited facts about the company and the decision-maker, and a different message per channel.' },
    how: { es: 'Respuestas en HubSpot sobre primeros contactos preparados en SellUp.', en: 'HubSpot replies to first contacts prepared in SellUp.' },
  },
]

/** Cada cuánto se enciende la siguiente métrica mientras pasan solas (ms) */
const STEP_MS = 4600
/** Al entrar, la fibra se tiende de una métrica a la siguiente (ms por tramo) */
const DRAW_MS = 380

/**
 * 06 · Impacto: las cuatro métricas sobre una sola fibra, con la métrica norte
 * primero. Al entrar se encienden una tras otra; después se lee una a la vez:
 * de dónde parte, a dónde llega y qué la mueve en SellUp. Tocar una métrica
 * la elige.
 */
export function SellUpImpact() {
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

  // Lo elegido se queda un rato y luego vuelve a pasar solo.
  useEffect(() => {
    if (!hold) return
    const id = window.setTimeout(() => setHold(false), STEP_MS * 2)
    return () => window.clearTimeout(id)
  }, [hold, active])

  const fill = Math.max(0, lit - 1) / (METRICS.length - 1)
  const current = METRICS[active]

  return (
    <div ref={rootRef} className="mx-auto max-w-[1000px]">
      <ol className="relative grid grid-cols-2 gap-y-10 md:grid-cols-4">
        <span aria-hidden="true" className="absolute inset-x-[12.5%] top-[7px] hidden h-px bg-white/12 md:block" />
        <span aria-hidden="true" className="absolute left-[12.5%] top-[7px] hidden h-px w-3/4 origin-left bg-gradient-to-r from-[#285ee6] via-[#7e2be0] to-[#d22d6a] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform ease-out md:block" style={{ transform: `scaleX(${fill})`, transitionDuration: `${DRAW_MS}ms` }} />
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
                </span>
                {m.north && <span className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-signal">{t({ es: 'Métrica norte', en: 'North star' })}</span>}
                <span className={`mt-3 bg-gradient-to-b from-white to-white/60 bg-clip-text text-[clamp(1.9rem,1.2rem+2.2vw,3.4rem)] font-light leading-none text-transparent tabular-nums transition-opacity duration-500 ${isActive ? 'opacity-100' : on ? 'opacity-60 group-hover:opacity-90' : 'opacity-20'}`} style={{ filter: isActive ? 'drop-shadow(0 0 18px rgb(var(--signal) / 0.55))' : 'none' }}>
                  {m.delta}
                </span>
                <span className={`${m.north ? 'mt-1.5' : 'mt-4'} text-balance text-center text-[clamp(1.05rem,0.9rem+0.6vw,1.45rem)] font-light leading-tight tracking-tight transition-opacity duration-500 ${isActive ? 'opacity-100' : on ? 'opacity-55 group-hover:opacity-85' : 'opacity-25'}`}>
                  {t(m.name)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* La métrica en lectura: de dónde parte, a dónde llega y cuánto cambia */}
      <div key={`band-${active}`} className="su-fade relative mx-auto mt-12 max-w-[880px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_70%_0%,rgb(var(--signal)/0.18),transparent_60%)] px-6 py-8 md:px-10">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">{t({ es: 'Escenario de referencia', en: 'Reference scenario' })} · {t(current.unit)}</p>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">{t({ es: 'Antes', en: 'Before' })}</p>
            <p className="mt-2 text-[clamp(2rem,1.2rem+2.6vw,3.8rem)] font-light leading-none text-paper/45 tabular-nums">{current.from}</p>
          </div>
          <div className="relative flex w-[clamp(4rem,10vw,9rem)] flex-col items-center">
            <span className="rounded-full bg-signal px-3 py-1 text-sm font-medium text-on-signal shadow-[0_0_24px_-4px_rgb(var(--signal)/0.9)] tabular-nums">{current.delta}</span>
            <span className="relative mt-3 h-px w-full overflow-hidden bg-white/15">
              <span className="absolute inset-y-0 left-0 w-1/3 animate-[su-flow_1.6s_cubic-bezier(.65,0,.35,1)_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />
            </span>
          </div>
          <div className="text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">{t({ es: 'Con SellUp', en: 'With SellUp' })}</p>
            <p className="mt-2 text-[clamp(2.4rem,1.4rem+3.2vw,4.6rem)] font-light leading-none tabular-nums" style={{ filter: 'drop-shadow(0 0 22px rgb(var(--signal) / 0.45))' }}>{current.to}</p>
          </div>
        </div>
      </div>

      {/* Qué la mueve y cómo se mide */}
      <div key={active} aria-live="polite" className="su-fade mx-auto mt-8 grid max-w-[880px] gap-6 text-left md:grid-cols-2">
        {[
          { tag: t({ es: 'Qué la mueve en SellUp', en: 'What moves it in SellUp' }), text: t(current.moves) },
          { tag: t({ es: 'Cómo se mide', en: 'How it’s measured' }), text: t(current.how) },
        ].map((col) => (
          <div key={col.tag} className="border-l border-white/12 pl-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">{col.tag}</p>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">{col.text}</p>
          </div>
        ))}
      </div>

      {/* De aquí baja la fibra hacia «Demo» */}
      <span aria-hidden="true" className="relative mx-auto mt-12 block h-2.5 w-2.5 rounded-full border border-white/70 bg-signal shadow-[0_0_14px_rgb(var(--signal))]">
        <span data-fiber-from="su-demo" className="absolute left-1/2 top-1/2 h-px w-px" />
      </span>
    </div>
  )
}
