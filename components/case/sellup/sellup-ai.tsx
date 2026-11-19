'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { SPLIT } from '@/lib/content/cases/sellup/sellup-agents'
import { BLUE, Section, useInView } from './ui'

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
                <li key={m.es} className="rounded-full p-px transition-all duration-700" style={{ backgroundImage: `linear-gradient(120deg,#9bb2ff,${BLUE},#8b5cf6)`, opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(10px)', transitionDelay: `${(r * 3 + i) * 90}ms` }}>
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

/** 06 · IA: la IA dentro del producto y la IA para construirlo. */
export function SellUpAi() {
  const { t } = useLocale()
  return (
    <div>
      <Section
        n="6.1"
        title={{ es: 'El modelo propone; el código decide qué es verdad', en: 'The model proposes; code decides what’s true' }}
        body={{ es: 'La regla de diseño fue separar lo que se juzga de lo que se comprueba. El modelo juzga y redacta. Las reglas comparan números fiscales, reservan créditos y descartan citas que no están en la fuente. Ninguna aprobación, precio ni escritura en HubSpot sale de un modelo.', en: 'The design rule was to separate what gets judged from what gets checked. The model judges and writes. Rules compare tax IDs, reserve credits and discard quotes that aren’t in the source. No approval, price or HubSpot write comes from a model.' }}
      >
        <ModelVsRules />
      </Section>
      <Section
        n="6.2"
        title={{ es: 'Construido con Claude Code', en: 'Built with Claude Code' }}
        body={{ es: 'Diseñé el producto y dirigí su construcción con Claude Code: cada agente nació como un documento de diseño en docs/, se construyó por partes con pruebas, y se cerró con una auditoría contra Producción en modo de solo lectura.', en: 'I designed the product and directed its build with Claude Code: each agent was born as a design document in docs/, built in parts with tests, and closed with a read-only audit against Production.' }}
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
      </Section>
      <Section
        n="6.3"
        title={{ es: 'Auditar antes de seguir', en: 'Audit before moving on' }}
        body={{ es: 'Cuando algo no cuadraba, la IA no adivinaba el arreglo: primero auditaba con datos reales y publicaba la ficha. Así se encontró que la búsqueda de contactos preguntaba mal, o dónde se iban los créditos de Apollo.', en: 'When something didn’t add up, the AI didn’t guess the fix: it audited with real data first and published the brief. That’s how we found the contact search was asking wrong, or where Apollo credits were going.' }}
      >
        <AuditStack />
      </Section>
    </div>
  )
}
