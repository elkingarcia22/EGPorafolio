'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { SELLUP_CASE, type AgentId, type CascadeStep } from '@/lib/content/cases/sellup/sellup-case'
import { Arrows, Board, Hand, Pin, Sketchy, Sticky, type StickyColor } from '@/components/case/kit/sketch'
import { useInView } from './ui'
import { SwipeBoard } from './swipe-board'

/** Medidas de diseño del tablero. */
const W = 1520
const H = 1080
const COL_X = [60, 550, 1040] as const
const STEP_W = 240
const STEP_Y0 = 190
const STEP_GAP = 118
const STEP_H = 84
const TICK_MS = 850
/** Pausa al final del recorrido antes de volver a empezar (en ticks). */
const REST_TICKS = 4

const stepY = (i: number) => STEP_Y0 + i * STEP_GAP
const pct = (v: number, total: number) => `${(v / total) * 100}%`

const COST_FILL: Record<CascadeStep['cost'], string> = { free: '#c9efc0', low: '#bfe0ff', paid: '#ffd2a8', human: '#dcd0ff' }
const COST_LABEL: Record<CascadeStep['cost'], L> = {
  free: { es: 'gratis', en: 'free' },
  low: { es: 'centavos', en: 'cents' },
  paid: { es: 'de pago', en: 'paid' },
  human: { es: 'persona', en: 'person' },
}

/** Fuentes conectadas a cada escalón, por agente (del catálogo de fuentes de SellUp). */
const SOURCES: Record<AgentId, readonly { text: L; color: StickyColor }[]> = {
  a1: [
    { text: { es: 'HubSpot: recicladas, en bolsa, sin dueño', en: 'HubSpot: recycled, pooled, ownerless' }, color: 'green' },
    { text: { es: 'Supersociedades SIIS · RUES · SECOP II · SUNAT · SII', en: 'Supersociedades SIIS · RUES · SECOP II · SUNAT · SII' }, color: 'green' },
    { text: { es: 'Banco de empresas verificadas', en: 'Verified company bank' }, color: 'green' },
    { text: { es: 'Tavily · Google, con fuente', en: 'Tavily · Google, with source' }, color: 'blue' },
    { text: { es: 'Apollo · Lusha, con tope', en: 'Apollo · Lusha, capped' }, color: 'orange' },
    { text: { es: '👤 vendedor', en: '👤 rep' }, color: 'violet' },
  ],
  a2: [
    { text: { es: 'Contactos de HubSpot', en: 'HubSpot contacts' }, color: 'green' },
    { text: { es: 'Memoria de SellUp · 180 días', en: 'SellUp memory · 180 days' }, color: 'green' },
    { text: { es: 'Apollo: buscar no cobra', en: 'Apollo: searching is free' }, color: 'green' },
    { text: { es: 'Apollo · 1 crédito por persona', en: 'Apollo · 1 credit per person' }, color: 'orange' },
    { text: { es: 'Sitio web: «equipo», «nosotros»', en: 'Website: “team”, “about”' }, color: 'blue' },
    { text: { es: '👤 vendedor', en: '👤 rep' }, color: 'violet' },
  ],
  a3: [
    { text: { es: 'Ficha · contactos · historial', en: 'Record · contacts · history' }, color: 'green' },
    { text: { es: 'Sitio oficial · hasta 5 páginas', en: 'Official site · up to 5 pages' }, color: 'blue' },
    { text: { es: 'Noticias y vacantes con fecha', en: 'Dated news and job posts' }, color: 'blue' },
    { text: { es: 'Prensa de RR. HH. del país', en: 'Country HR press' }, color: 'blue' },
    { text: { es: 'Rumbo busca y lee la web', en: 'Rumbo searches and reads the web' }, color: 'orange' },
    { text: { es: '👤 vendedor', en: '👤 rep' }, color: 'violet' },
  ],
}

type Scenario = 'real' | 'short'

/** Dónde se cumple la meta: el caso real medido y el caso en que lo gratis no alcanza. */
const STOP_AT: Record<Scenario, Record<AgentId, number>> = {
  real: { a1: 0, a2: 0, a3: 3 },
  short: { a1: 4, a2: 3, a3: 4 },
}

const SHORT_NOTE: Record<AgentId, L> = {
  a1: { es: 'Si lo gratis no alcanza, baja hasta Apollo y Lusha, con un tope de créditos por búsqueda.', en: 'If free isn’t enough, it steps down to Apollo and Lusha, with a credit cap per search.' },
  a2: { es: 'Si la búsqueda gratis no basta, completa perfiles: 1 crédito por persona, máximo 10.', en: 'If the free search isn’t enough, it completes profiles: 1 credit per person, at most 10.' },
  a3: { es: 'Si las fuentes del país no traen nada, Rumbo busca y lee la web, y cita cada frase.', en: 'If the country sources bring nothing, Rumbo searches and reads the web, citing every sentence.' },
}

const PACKET: Record<AgentId, L> = {
  a1: { es: 'empresa', en: 'company' },
  a2: { es: 'contacto', en: 'contact' },
  a3: { es: 'guion', en: 'script' },
}

const AGENTS: readonly AgentId[] = ['a1', 'a2', 'a3']

/** Recorrido del paquete: baja hasta la meta y salta a la persona. */
function routeFor(stopAt: number, last: number): readonly number[] {
  return [...Array.from({ length: stopAt + 1 }, (_, i) => i), last]
}

/** Un carril: el agente, su cascada de escalones y sus fuentes conectadas. */
function Lane({ id, col, active, pos, done, stopAt }: { id: AgentId; col: number; active: boolean; pos: number; done: boolean; stopAt: number }) {
  const { t } = useLocale()
  const cascade = SELLUP_CASE.patterns.cascades.find((c) => c.id === id)
  if (!cascade) return null
  const x = COL_X[col]
  const last = cascade.steps.length - 1
  const dim = `transition-opacity duration-500 ${active ? '' : 'opacity-30'}`
  return (
    <>
      <Pin x={x} y={112} w={430} className={dim}>
        <Hand size={1.7} className="block font-bold">{t(cascade.agent)}</Hand>
        <Hand size={1.15} className="block opacity-70">{t(cascade.goal)}</Hand>
      </Pin>
      {cascade.steps.map((s, i) => {
        const visited = active && (i <= Math.min(pos, stopAt) || (i === last && done))
        const skipped = active && i > stopAt && i < last && (pos === last || done)
        return (
          <Pin key={s.name.es} x={x} y={stepY(i)} w={STEP_W} className={dim}>
            <div className={`transition-opacity duration-500 ${skipped ? 'opacity-40' : ''}`}>
              <Sketchy fill={COST_FILL[s.cost]} className="flex items-center gap-[0.6cqw] px-[0.8cqw] py-[0.7cqw]" >
                <span className="grid h-[1.9cqw] w-[1.9cqw] shrink-0 place-items-center rounded-full border-[0.16cqw] border-[#2a2d33] bg-white/70">
                  <Hand size={1}>{visited ? '✓' : i + 1}</Hand>
                </span>
                <span className="min-w-0">
                  <Hand size={1.12} className={`block font-bold ${skipped ? 'line-through' : ''}`}>{t(s.name)}</Hand>
                  <Hand size={0.92} className="block opacity-70">{skipped ? t({ es: 'no hizo falta', en: 'not needed' }) : t(COST_LABEL[s.cost])}</Hand>
                </span>
              </Sketchy>
            </div>
          </Pin>
        )
      })}
      {SOURCES[id].map((src, i) => (
        <Pin key={src.text.es} x={x + STEP_W + 34} y={stepY(i) + 8} w={160} rotate={i % 2 ? 1.6 : -1.4} className={dim}>
          <Sticky color={src.color} small>{t(src.text)}</Sticky>
        </Pin>
      ))}
      <div className={`absolute inset-0 ${dim}`}>
        <Arrows
          paths={[
            ...cascade.steps.slice(0, -1).map((_, i) => ({ d: `M${x + STEP_W / 2} ${stepY(i) + STEP_H - 6} L${x + STEP_W / 2} ${stepY(i + 1) + 4}` })),
            ...SOURCES[id].map((_, i) => ({ d: `M${x + STEP_W + 32} ${stepY(i) + 40} L${x + STEP_W + 6} ${stepY(i) + 40}`, dashed: true })),
          ]}
        />
      </div>
    </>
  )
}

/** Tablero de la cadena: tres agentes en cascada, conectados a sus fuentes. */
export function CascadeBoard() {
  const { t } = useLocale()
  const [agent, setAgent] = useState<AgentId>('a1')
  const [scenario, setScenario] = useState<Scenario>('real')
  const [count, setCount] = useState(0)
  const [ref, seen] = useInView<HTMLDivElement>(0.25)

  const cascade = SELLUP_CASE.patterns.cascades.find((c) => c.id === agent) ?? SELLUP_CASE.patterns.cascades[0]
  const last = cascade.steps.length - 1
  const stopAt = STOP_AT[scenario][agent]
  const route = routeFor(stopAt, last)
  const cycle = route.length + REST_TICKS

  useEffect(() => {
    setCount(0)
  }, [agent, scenario])

  useEffect(() => {
    if (!seen) return
    const id = window.setInterval(() => setCount((v) => v + 1), TICK_MS)
    return () => window.clearInterval(id)
  }, [seen])

  const tick = count % cycle
  // Al cerrar la pausa el paquete se desvanece abajo y reaparece arriba con un fundido:
  // no sube rebobinando por la cascada.
  const leaving = tick === cycle - 1
  const looped = count >= cycle && tick === 0

  const step = Math.min(tick, route.length - 1)
  const pos = route[step]
  const done = tick >= route.length - 1
  const col = AGENTS.indexOf(agent)
  const px = COL_X[col] - 34
  const py = stepY(pos) + STEP_H / 2 - 14

  return (
    <div ref={ref} className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label={t({ es: 'Agente', en: 'Agent' })} className="inline-flex flex-wrap rounded-[12px] border border-fg/15 p-1 text-sm">
          {SELLUP_CASE.patterns.cascades.map((c) => (
            <button key={c.id} role="tab" aria-selected={agent === c.id} onClick={() => setAgent(c.id)} className={`rounded-[9px] px-3 py-1.5 transition-colors ${agent === c.id ? 'bg-fg text-bg' : 'opacity-65 hover:opacity-100'}`}>
              {t(c.agent)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setScenario((s) => (s === 'real' ? 'short' : 'real'))}
          aria-pressed={scenario === 'short'}
          className="rounded-full border border-fg/20 px-4 py-2 text-sm transition-colors hover:border-signal hover:text-signal"
        >
          {scenario === 'real' ? t({ es: '¿Y si lo gratis no alcanza?', en: 'What if free isn’t enough?' }) : t({ es: 'Volver al caso real', en: 'Back to the real case' })}
        </button>
      </div>

      <SwipeBoard designW={W} stops={COL_X.map((x) => x - 20)} focus={col}>
      <Board title={t({ es: 'SellUp · la cadena de los tres agentes', en: 'SellUp · the three-agent chain' })} w={W} h={H} label={t({ es: 'Boceto de los tres agentes en cascada, conectados a sus fuentes', en: 'Sketch of the three agents in cascade, connected to their sources' })}>
        <Pin x={60} y={30}><Hand size={2.3} className="font-bold">{t({ es: 'Tres agentes, una cadena: cada uno baja de lo gratis a lo de pago', en: 'Three agents, one chain: each steps down from free to paid' })}</Hand></Pin>
        <Pin x={1120} y={36} w={360}>
          <div className="flex flex-wrap justify-end gap-[0.6cqw]">
            {(['free', 'low', 'paid', 'human'] as const).map((c) => (
              <Sketchy key={c} fill={COST_FILL[c]} className="px-[0.6cqw] py-[0.2cqw]"><Hand size={0.95}>{t(COST_LABEL[c])}</Hand></Sketchy>
            ))}
          </div>
        </Pin>

        {AGENTS.map((id, i) => (
          <Lane key={id} id={id} col={i} active={agent === id} pos={pos} done={done} stopAt={stopAt} />
        ))}

        {/* La persona aprueba y pasa al siguiente agente */}
        <Arrows paths={[{ d: 'M470 128 C 495 112, 515 112, 540 128', accent: true }, { d: 'M960 128 C 985 112, 1005 112, 1030 128', accent: true }]} />
        <Pin x={466} y={150}><Hand size={1} className="text-[#e8743b]">{t({ es: '👤 aprueba → pasa', en: '👤 approves → moves on' })}</Hand></Pin>
        <Pin x={956} y={150}><Hand size={1} className="text-[#e8743b]">{t({ es: '👤 aprueba → pasa', en: '👤 approves → moves on' })}</Hand></Pin>

        {/* El paquete que recorre la cascada */}
        <div
          className="absolute z-10"
          style={{
            left: pct(px, W),
            top: pct(py, H),
            width: pct(30, W),
            opacity: leaving ? 0 : 1,
            transition: looped ? 'opacity 420ms ease-out 120ms' : 'left 700ms ease-out, top 700ms ease-out, opacity 320ms ease-in',
          }}
          aria-hidden="true"
        >
          <span className="block aspect-square w-full rounded-full border-[0.18cqw] border-[#2a2d33] bg-[#e8743b] shadow-[0_0_0_0.5cqw_rgba(232,116,59,0.25)]" />
          <Hand size={0.95} className="mt-[0.2cqw] block -translate-x-1/4 whitespace-nowrap text-[#e8743b]">{t(PACKET[agent])}</Hand>
        </div>

        {/* Reglas anotadas a mano */}
        <Pin x={60} y={918} w={430} rotate={-1.2}><Sticky color="yellow">{t({ es: 'Primero lo gratis. Se detiene apenas se cumple la meta', en: 'Free first. It stops as soon as the goal is met' })}</Sticky></Pin>
        <Pin x={550} y={918} w={430} rotate={1}><Sticky color="pink">{t({ es: 'Reserva créditos ANTES de llamar a un proveedor de pago', en: 'Reserves credits BEFORE calling a paid provider' })}</Sticky></Pin>
        <Pin x={1040} y={918} w={430} rotate={-0.8}><Sticky color="green">{t({ es: 'Cada dato con su cita. Sin cita, no es un hecho', en: 'Every fact with its quote. No quote, not a fact' })}</Sticky></Pin>
        <Pin x={60} y={1030}><Hand size={1.15} className="text-[#e8743b]">{t({ es: 'Una persona aprueba entre cada agente · nada se escribe en HubSpot sin ella', en: 'A person approves between each agent · nothing is written to HubSpot without them' })}</Hand></Pin>
      </Board>
      </SwipeBoard>

      <p role="status" className="max-w-[70ch] text-sm leading-relaxed opacity-80">
        <span className="mono-label mr-2 text-signal">{scenario === 'real' ? t({ es: 'Corrida real', en: 'Real run' }) : t({ es: 'Si falta', en: 'If short' })}</span>
        {scenario === 'real' ? t(cascade.stop) : t(SHORT_NOTE[agent])}
      </p>
    </div>
  )
}
