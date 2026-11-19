'use client'

import { useLocale, type L } from '@/lib/i18n'
import { OrbitBuilder } from './ai-orbit'
import { OrbitMobile } from './ai-orbit-mobile'
import './ai-impact.css'

const PROCESS: readonly { value: string; label: L }[] = [
  { value: '2', label: { es: 'guías con Claude: «Recorrido» y «Anatomía», cada regla en archivo:línea', en: 'guides with Claude: “Journey” and “Anatomy”, every rule at file:line' } },
  { value: '11', label: { es: 'defectos confirmados, cada uno con cómo reproducirlo', en: 'confirmed defects, each with how to reproduce it' } },
  { value: '487', label: { es: 'casos de uso generados desde el tablero, con su subtarea', en: 'use cases generated from the board, with their subtask' } },
  { value: '3', label: { es: 'herramientas propias del agente sobre el sistema de diseño', en: 'in-house agent tools over the design system' } },
]

const TOOLS = ['buscar_pieza', 'reglas_para', 'revisar'] as const

/** Cómo se hizo el caso con IA, en una sola franja. */
function ProcessStrip() {
  const { t } = useLocale()
  return (
    <div data-reveal className="overflow-hidden rounded-2xl border border-fg/15">
      <dl className="grid grid-cols-2 divide-fg/15 lg:grid-cols-4 lg:divide-x">
        {PROCESS.map((p, i) => (
          <div key={p.label.es} className={`p-5 ${i < 2 ? 'border-b border-fg/15 lg:border-b-0' : ''} ${i % 2 === 0 ? 'border-r border-fg/15 lg:border-r-0' : ''}`}>
            <dt className="sr-only">{t(p.label)}</dt>
            <dd>
              <span data-count={p.value} className="block text-4xl font-light tabular-nums text-signal">{p.value}</span>
              <span className="mt-2 block text-xs leading-relaxed opacity-70">{t(p.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="flex flex-wrap items-center gap-2 border-t border-fg/15 bg-fg/[0.03] px-5 py-3 font-mono text-[11px]">
        <span className="opacity-55">MCP ds-ubits</span>
        {TOOLS.map((tool) => (
          <span key={tool} className="rounded-md border border-fg/20 px-2 py-0.5">{tool}()</span>
        ))}
      </p>
    </div>
  )
}

/** 06 · IA: crear una encuesta conversando, leer resultados con evidencia y el proceso del caso. */
export function SurveyAi() {
  const { t } = useLocale()
  return (
    <div className="space-y-20">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <p data-reveal className="text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] font-light leading-tight lg:col-span-7">
          {t({ es: 'Cuentas qué quieres medir y la encuesta se arma frente a ti.', en: 'You say what you want to measure and the survey builds itself in front of you.' })}
        </p>
        <p data-reveal className="leading-relaxed opacity-75 lg:col-span-5">
          {t({ es: 'Es el agente real del constructor, repetido con sus textos y tiempos. Pregunta solo lo que falta, cuenta lo que hace mientras lo hace y lo que crea queda editable desde el primer segundo: la IA propone, la persona decide.', en: 'This is the builder’s real agent, replayed with its own copy and timings. It asks only what’s missing, says what it’s doing while it does it, and everything it creates is editable from the first second: AI proposes, people decide.' })}
        </p>
      </div>

      <section>
        <p data-reveal className="mono-label mb-5 text-signal">{t({ es: 'Orbit, el agente de UBITS · Crear encuesta con IA', en: 'Orbit, UBITS’s agent · Create survey with AI' })}</p>
        <div data-reveal>
          <OrbitBuilder mobile={OrbitMobile} />
        </div>
      </section>

      <section>
        <p data-reveal className="mono-label mb-5 text-signal">{t({ es: 'En el proceso · Cómo se hizo este caso', en: 'In the process · How this case was made' })}</p>
        <ProcessStrip />
      </section>
    </div>
  )
}
