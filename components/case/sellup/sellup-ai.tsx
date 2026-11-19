'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { SPLIT } from '@/lib/content/cases/sellup/sellup-agents'
import { BLUE, Section, useInView } from './ui'
import { RumboOrb } from './platform'
import { RumboPanel } from './ai-rumbo-panel'
import { RumboSearch } from './ai-rumbo-search'

/** Medido en la rama principal del repo de SellUp (15-05 al 17-11-2026). */
const BUILD_STATS: readonly { value: string; label: L }[] = [
  { value: '2.809', label: { es: 'commits en seis meses', en: 'commits in six months' } },
  { value: '1.724', label: { es: 'firmados por Claude', en: 'signed by Claude' } },
  { value: '168', label: { es: 'archivos de migración de base de datos', en: 'database migration files' } },
  { value: '148', label: { es: 'documentos de diseño y auditoría en docs/', en: 'design and audit docs in docs/' } },
]

/** Auditorías publicadas como fichas en claude.ai mientras se construía. */
const AUDITS: readonly { title: L; date: string }[] = [
  { title: { es: 'Dónde se van los créditos Apollo', en: 'Where Apollo credits go' }, date: '02-09' },
  { title: { es: 'Preflight Apollo vs Lusha', en: 'Apollo vs Lusha preflight' }, date: '02-09' },
  { title: { es: 'Auditoría uso de IA y costo', en: 'AI usage and cost audit' }, date: '13-10' },
  { title: { es: 'Catálogo de fuentes de contactos', en: 'Contact sources catalog' }, date: '20-10' },
  { title: { es: 'Auditoría árbol Agente 1', en: 'Agent 1 tree audit' }, date: '21-10' },
  { title: { es: 'Auditoría Agente 2', en: 'Agent 2 audit' }, date: '21-10' },
]

type View = 'both' | 'model' | 'rules'

/** Qué decide el modelo y qué deciden las reglas, agente por agente. */
function ModelVsRules() {
  const { t } = useLocale()
  const [view, setView] = useState<View>('both')
  const [ref, seen] = useInView<HTMLDivElement>()
  const views: readonly { id: View; label: L }[] = [
    { id: 'both', label: { es: 'Todo', en: 'All' } },
    { id: 'model', label: { es: 'Modelo', en: 'Model' } },
    { id: 'rules', label: { es: 'Reglas en código', en: 'Rules in code' } },
  ]
  return (
    <div ref={ref} data-reveal="device">
      <div role="radiogroup" className="mb-6 inline-flex rounded-[12px] border border-fg/15 p-1 text-sm">
        {views.map((v) => (
          <button key={v.id} role="radio" aria-checked={view === v.id} onClick={() => setView(v.id)} className={`rounded-[9px] px-3 py-1.5 transition-colors ${view === v.id ? 'bg-fg text-bg' : 'opacity-65 hover:opacity-100'}`}>
            {t(v.label)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {SPLIT.map((row, r) => (
          <div key={row.agent.es} className="grid gap-3 border-t border-fg/15 pt-3 md:grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)]">
            <p className="mono-label pt-2 opacity-60">{t(row.agent)}</p>
            <ul className={`flex flex-wrap content-start gap-2 transition-opacity duration-500 ${view === 'rules' ? 'opacity-15' : 'opacity-100'}`}>
              {row.model.map((m, i) => (
                <li key={m.es} className="rounded-full p-px transition-all duration-700" style={{ backgroundImage: `linear-gradient(120deg,#9bb2ff,${BLUE},#7c3aed)`, opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(10px)', transitionDelay: `${(r * 3 + i) * 90}ms` }}>
                  <span className="block rounded-full bg-bg px-3 py-1.5 text-sm">✦ {t(m)}</span>
                </li>
              ))}
            </ul>
            <ul className={`flex flex-wrap content-start gap-2 transition-opacity duration-500 ${view === 'model' ? 'opacity-15' : 'opacity-100'}`}>
              {row.rules.map((m, i) => (
                <li key={m.es} className="rounded-md border border-fg/25 px-3 py-1.5 font-mono text-xs transition-all duration-700" style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(10px)', transitionDelay: `${(r * 3 + i) * 90 + 150}ms` }}>
                  {t(m)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Las auditorías, apiladas como fichas: cada una cambió una decisión. */
function AuditStack() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {AUDITS.map((a, i) => (
        <article
          key={a.title.es}
          className="rounded-[16px] border border-fg/15 bg-bg p-4 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)] transition-all duration-[1100ms] ease-expo"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? `rotate(${[-1.5, 1, -0.6, 1.2, -1.1, 0.7][i]}deg)` : `translate(${-(i % 3) * 60}%, ${-Math.floor(i / 3) * 60}%) rotate(0deg)`,
            transitionDelay: `${i * 90}ms`,
          }}
        >
          <p className="font-mono text-[10px] opacity-50">claude.ai · {a.date}-2026</p>
          <p className="mt-2 leading-snug">{t(a.title)}</p>
        </article>
      ))}
    </div>
  )
}

/** 06 · IA: Rumbo, la IA de SellUp, y cómo se construyó con Claude Code. */
export function SellUpAi() {
  const { t } = useLocale()
  return (
    <div>
      <div className="mb-4 flex items-center gap-4" data-reveal>
        <RumboOrb size={56} pulse />
        <p className="max-w-[26ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">
          {t({ es: 'Rumbo, la IA que trabaja dentro de SellUp.', en: 'Rumbo, the AI that works inside SellUp.' })}
        </p>
      </div>
      <p data-reveal className="max-w-[62ch] leading-relaxed opacity-80">
        {t({ es: 'Rumbo no es un chat aparte: es la misma IA detrás de los tres agentes. Conversa para entender qué busca el vendedor, baja la cascada de fuentes, lee y cita, y entrega todo a una bandeja donde una persona decide.', en: 'Rumbo isn’t a separate chat: it’s the same AI behind all three agents. It talks to understand what the rep wants, steps down the cascade of sources, reads and cites, and hands everything to a queue where a person decides.' })}
      </p>
      <Section
        n="6.1"
        title={{ es: 'Una conversación en seis pasos', en: 'A conversation in six steps' }}
        body={{ es: 'En vez de un formulario con veinte filtros, Rumbo pregunta lo justo: tipo, país, industria y criterios. Muestra el resumen antes de gastar nada. Elige un tipo de búsqueda o deja que la conversación avance sola.', en: 'Instead of a form with twenty filters, Rumbo asks just enough: type, country, industry and criteria. It shows the summary before spending anything. Pick a search type or let the conversation run.' }}
      >
        <RumboPanel />
      </Section>
      <Section
        n="6.2"
        title={{ es: 'Cómo busca Rumbo', en: 'How Rumbo searches' }}
        body={{ es: 'Rumbo consulta primero lo gratis, lee la fuente, guarda la frase exacta que respalda cada dato y verifica contra el dominio o el número fiscal. Se detiene apenas cumple la meta: si no hace falta pagar, no paga.', en: 'Rumbo checks free sources first, reads the source, saves the exact quote behind every fact and verifies against the domain or tax ID. It stops as soon as it hits the goal: if it doesn’t need to pay, it doesn’t.' }}
      >
        <RumboSearch />
      </Section>
      <Section
        n="6.3"
        title={{ es: 'Rumbo propone; el código decide qué es verdad', en: 'Rumbo proposes; code decides what’s true' }}
        body={{ es: 'La regla de diseño fue separar lo que se juzga de lo que se comprueba. Rumbo juzga y redacta. Las reglas comparan números fiscales, reservan créditos y descartan citas que no están en la fuente. Ninguna aprobación, precio ni escritura en HubSpot sale de un modelo.', en: 'The design rule was to separate what gets judged from what gets checked. Rumbo judges and writes. Rules compare tax IDs, reserve credits and discard quotes that aren’t in the source. No approval, price or HubSpot write comes from a model.' }}
      >
        <ModelVsRules />
      </Section>
      <Section
        n="6.4"
        title={{ es: 'Construido con Claude Code', en: 'Built with Claude Code' }}
        body={{ es: 'Diseñé el producto y dirigí su construcción con Claude Code: cada agente nació como un documento de diseño, se construyó por partes con pruebas y se cerró con una auditoría contra Producción en modo de solo lectura. Cuando algo no cuadraba, primero se auditaba con datos reales.', en: 'I designed the product and directed its build with Claude Code: each agent was born as a design document, built in parts with tests and closed with a read-only audit against Production. When something didn’t add up, it was audited with real data first.' }}
      >
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {BUILD_STATS.map((s) => (
            <div key={s.label.es} data-reveal>
              <dt className="sr-only">{t(s.label)}</dt>
              <dd>
                <span className="block text-[clamp(2.2rem,1.5rem+2vw,3.4rem)] font-light leading-none tabular-nums text-signal">{s.value}</span>
                <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.label)}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-10"><AuditStack /></div>
      </Section>
    </div>
  )
}
