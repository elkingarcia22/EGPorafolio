'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { AiBuilderDemo } from './ai-builder'
import './ai-impact.css'

type Confidence = 'alta' | 'media' | 'baja'

const CONF: Record<Confidence, { label: L; meaning: L; color: string }> = {
  alta: { label: { es: 'Alta', en: 'High' }, meaning: { es: 'Cifra directa de la medición', en: 'A direct figure from the measurement' }, color: '#43a970' },
  media: { label: { es: 'Media', en: 'Medium' }, meaning: { es: 'Lectura razonable, conviene verificar', en: 'Reasonable reading, worth checking' }, color: '#f1c56c' },
  baja: { label: { es: 'Baja', en: 'Low' }, meaning: { es: 'Indicio, no conclusión', en: 'A hint, not a conclusion' }, color: '#f0a07a' },
}

/** Lecturas reales de la pestaña «Análisis con IA» de Clima Q1 2026, cada una con su evidencia. */
const READINGS: readonly { kind: L; claim: L; evidence: string; share: number; conf: Confidence }[] = [
  { kind: { es: 'Hallazgo', en: 'Finding' }, claim: { es: '«Colaboración y comunicación» es la fortaleza más sólida', en: '“Collaboration and communication” is the strongest area' }, evidence: '74,4 % · +35,4 pp', share: 74.4, conf: 'alta' },
  { kind: { es: 'Hallazgo', en: 'Finding' }, claim: { es: 'La participación se mantiene alta', en: 'Participation stays high' }, evidence: '91 % · 473 / 520', share: 91, conf: 'alta' },
  { kind: { es: 'Riesgo', en: 'Risk' }, claim: { es: '«Bienestar y carga de trabajo» está por debajo del resto', en: '“Well-being and workload” trails the rest' }, evidence: '18,9 % · −20,1 pp', share: 18.9, conf: 'alta' },
  { kind: { es: 'Hallazgo', en: 'Finding' }, claim: { es: 'Una sola pregunta marca el piso del resultado', en: 'A single question sets the floor of the result' }, evidence: '1 / 54', share: 1.9, conf: 'media' },
]

/** Cada afirmación de la IA viaja con la cifra que la sostiene y su confiabilidad. */
function Readings() {
  const { t } = useLocale()
  const [only, setOnly] = useState<Confidence | null>(null)
  return (
    <div className="rounded-2xl border border-fg/15 p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CONF) as Confidence[]).map((c) => (
          <button key={c} type="button" aria-pressed={only === c} onClick={() => setOnly(only === c ? null : c)} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${only === c ? 'border-fg bg-fg/10' : 'border-fg/20 opacity-70 hover:opacity-100'}`}>
            <span className="h-2 w-2 rounded-full" style={{ background: CONF[c].color }} /> {t(CONF[c].label)}
            <span className="hidden opacity-60 sm:inline">· {t(CONF[c].meaning)}</span>
          </button>
        ))}
      </div>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {READINGS.map((r) => {
          const dim = only !== null && only !== r.conf
          return (
            <li key={r.claim.es} data-reveal className={`relative overflow-hidden rounded-xl bg-fg/[0.04] p-4 ring-1 ring-fg/10 transition-opacity duration-500 ${dim ? 'opacity-20' : ''}`}>
              <span className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,#7aa2ff,#ff7a95)]" aria-hidden="true" />
              <p className="flex items-center justify-between gap-3">
                <span className="mono-label opacity-55">✦ {t(r.kind)}</span>
                <span className="rounded-full px-2 py-0.5 font-mono text-[10px] text-[#14161a]" style={{ background: CONF[r.conf].color }}>{t(CONF[r.conf].label)}</span>
              </p>
              <p className="mt-3 leading-snug">{t(r.claim)}</p>
              <p className="mt-4 flex items-center gap-3 font-mono text-xs">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-fg/10">
                  <span className="block h-full rounded-full" style={{ width: `${Math.max(r.share, 3)}%`, background: CONF[r.conf].color }} />
                </span>
                <span className="opacity-70">{r.evidence}</span>
              </p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

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
        <p data-reveal className="mono-label mb-5 text-signal">{t({ es: 'En el constructor · Crear encuesta con IA', en: 'In the builder · Create survey with AI' })}</p>
        <div data-reveal>
          <AiBuilderDemo />
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <p data-reveal className="mono-label text-signal">{t({ es: 'En resultados · Análisis con IA', en: 'In results · AI analysis' })}</p>
          <p data-reveal className="max-w-[46ch] text-sm opacity-70">{t({ es: 'Lecturas reales de Clima Q1 2026: ninguna afirmación sin la cifra que la sostiene.', en: 'Real readings from Climate Q1 2026: no claim without the number behind it.' })}</p>
        </div>
        <Readings />
      </section>

      <section>
        <p data-reveal className="mono-label mb-5 text-signal">{t({ es: 'En el proceso · Cómo se hizo este caso', en: 'In the process · How this case was made' })}</p>
        <ProcessStrip />
      </section>
    </div>
  )
}
