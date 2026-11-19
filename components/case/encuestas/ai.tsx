'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { SHOTS } from '@/lib/content/cases/encuestas/case'
import { Screen } from './shared'

type Tweak = 'base' | 'corta' | 'clara' | 'neutral' | 'cercano'

/** Borradores reales del tipo que escribe un admin, con lo que devuelve cada atajo de «Redactar con IA». */
const DRAFTS: readonly { draft: string; out: Record<Tweak, string> }[] = [
  {
    draft: 'pues básicamente saber si el feedback del jefe es bueno',
    out: {
      base: 'Mi líder me da retroalimentación que me ayuda a mejorar.',
      corta: 'Recibo retroalimentación útil de mi líder.',
      clara: 'Mi líder me dice con claridad qué hago bien y qué puedo mejorar.',
      neutral: 'Recibo retroalimentación de mi líder sobre mi trabajo.',
      cercano: 'Tu líder te da retroalimentación que te sirve para crecer.',
    },
  },
  {
    draft: 'la excelente cultura de innovación que tenemos, ¿usted la siente?',
    out: {
      base: 'Siento que aquí se pueden proponer ideas nuevas.',
      corta: 'Aquí puedo proponer ideas nuevas.',
      clara: 'Cuando propongo una idea nueva, mi equipo la escucha y la considera.',
      neutral: 'En mi equipo se proponen ideas nuevas.',
      cercano: '¿Sientes que aquí puedes proponer ideas nuevas?',
    },
  },
]

const TWEAKS: readonly { id: Exclude<Tweak, 'base'>; label: L }[] = [
  { id: 'corta', label: { es: 'Más corta', en: 'Shorter' } },
  { id: 'clara', label: { es: 'Más clara', en: 'Clearer' } },
  { id: 'neutral', label: { es: 'Más neutral', en: 'More neutral' } },
  { id: 'cercano', label: { es: 'Tono cercano', en: 'Warmer tone' } },
]

/** Escribe un texto letra a letra (o de golpe con movimiento reducido). */
function useTyped(text: string): string {
  const { reducedMotion } = useA11y()
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(reducedMotion ? text.length : 0)
    if (reducedMotion) return
    const id = window.setInterval(() => setN((v) => (v >= text.length ? v : v + 2)), 22)
    return () => window.clearInterval(id)
  }, [text, reducedMotion])
  return text.slice(0, n)
}

/** «Redactar con IA»: de una frase suelta a una pregunta neutra, con atajos para ajustarla. */
function WordingLab() {
  const { t } = useLocale()
  const [d, setD] = useState(0)
  const [tweak, setTweak] = useState<Tweak>('base')
  const result = DRAFTS[d].out[tweak]
  const typed = useTyped(result)

  return (
    <div className="overflow-hidden rounded-2xl border border-fg/15">
      <div className="border-b border-fg/15 p-5">
        <p className="mono-label opacity-50">{t({ es: 'Lo que escribe el admin', en: 'What the admin types' })}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DRAFTS.map((x, i) => (
            <button key={x.draft} type="button" aria-pressed={i === d} onClick={() => { setD(i); setTweak('base') }} className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${i === d ? 'border-signal text-fg' : 'border-fg/20 opacity-60 hover:opacity-100'}`}>
              “{x.draft}”
            </button>
          ))}
        </div>
      </div>
      <div className="relative p-5">
        <span className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,#2d5cf7,#e11d48)]" aria-hidden="true" />
        <p className="mono-label bg-[linear-gradient(90deg,#7aa2ff,#ff7a95)] bg-clip-text text-transparent">✦ {t({ es: 'Pregunta propuesta', en: 'Proposed question' })} · {t({ es: 'Escala Likert · Grado de acuerdo', en: 'Likert · Agreement' })}</p>
        <p className="mt-3 min-h-[3.5rem] text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] font-light leading-snug" aria-live="polite">
          {typed}
          <span className="ml-0.5 inline-block w-px animate-[caret_1s_steps(1)_infinite] bg-current">&nbsp;</span>
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {TWEAKS.map((x) => (
            <button key={x.id} type="button" aria-pressed={tweak === x.id} onClick={() => setTweak(x.id)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${tweak === x.id ? 'border-fg bg-fg text-bg' : 'border-fg/25 hover:border-fg/60'}`}>
              {t(x.label)}
            </button>
          ))}
          {tweak !== 'base' && (
            <button type="button" onClick={() => setTweak('base')} className="rounded-full px-3 py-1.5 text-xs opacity-60 hover:opacity-100">↺ {t({ es: 'Deshacer', en: 'Undo' })}</button>
          )}
        </div>
      </div>
      <ul className="grid gap-px bg-fg/15 text-xs sm:grid-cols-4">
        {[
          { es: 'Quita muletillas', en: 'Drops filler words' },
          { es: '«feedback» → «retroalimentación»', en: 'Translates jargon' },
          { es: 'Neutraliza adjetivos con carga', en: 'Neutralizes loaded adjectives' },
          { es: 'De usted a tú', en: 'Formal to informal “you”' },
        ].map((r) => (
          <li key={r.es} className="bg-bg px-4 py-3 opacity-70">{t(r)}</li>
        ))}
      </ul>
    </div>
  )
}

type Confidence = 'alta' | 'media' | 'baja'

const CONF: Record<Confidence, { label: L; meaning: L; color: string }> = {
  alta: { label: { es: 'Alta', en: 'High' }, meaning: { es: 'Cifra directa de la medición', en: 'A direct figure from the measurement' }, color: '#43a970' },
  media: { label: { es: 'Media', en: 'Medium' }, meaning: { es: 'Lectura razonable, conviene verificar', en: 'Reasonable reading, worth checking' }, color: '#f1c56c' },
  baja: { label: { es: 'Baja', en: 'Low' }, meaning: { es: 'Indicio, no conclusión', en: 'A hint, not a conclusion' }, color: '#f0a07a' },
}

/** Lecturas reales de la pestaña «Análisis con IA» de Clima Q1 2026, cada una con su evidencia. */
const READINGS: readonly { kind: L; claim: L; evidence: string; conf: Confidence }[] = [
  { kind: { es: 'Hallazgo', en: 'Finding' }, claim: { es: '«Colaboración y comunicación» es la fortaleza más sólida', en: '“Collaboration and communication” is the strongest area' }, evidence: '74,4 % · +35,4 pp', conf: 'alta' },
  { kind: { es: 'Hallazgo', en: 'Finding' }, claim: { es: 'La participación se mantiene alta', en: 'Participation stays high' }, evidence: '91 % · 473 / 520', conf: 'alta' },
  { kind: { es: 'Riesgo', en: 'Risk' }, claim: { es: '«Bienestar y carga de trabajo» está por debajo del resto', en: '“Well-being and workload” trails the rest' }, evidence: '18,9 % · −20,1 pp', conf: 'alta' },
  { kind: { es: 'Hallazgo', en: 'Finding' }, claim: { es: 'Una sola pregunta marca el piso del resultado', en: 'A single question sets the floor of the result' }, evidence: '1 / 54', conf: 'media' },
]

/** Cada afirmación de la IA viaja con la cifra que la sostiene y su confiabilidad. */
function Readings() {
  const { t } = useLocale()
  const [only, setOnly] = useState<Confidence | null>(null)
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CONF) as Confidence[]).map((c) => (
          <button key={c} type="button" aria-pressed={only === c} onClick={() => setOnly(only === c ? null : c)} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${only === c ? 'border-fg' : 'border-fg/20 opacity-70 hover:opacity-100'}`}>
            <span className="h-2 w-2 rounded-full" style={{ background: CONF[c].color }} /> {t(CONF[c].label)} · {t(CONF[c].meaning)}
          </button>
        ))}
      </div>
      <ol className="mt-5 divide-y divide-fg/15 border-y border-fg/15">
        {READINGS.map((r) => {
          const dim = only !== null && only !== r.conf
          return (
            <li key={r.claim.es} className={`grid gap-2 py-4 transition-opacity duration-500 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline ${dim ? 'opacity-20' : ''}`}>
              <span className="mono-label opacity-50">{t(r.kind)}</span>
              <span className="leading-snug">{t(r.claim)}</span>
              <span className="flex items-center gap-3 font-mono text-xs">
                <span className="opacity-60">{r.evidence}</span>
                <span className="rounded-full px-2 py-0.5 text-[#14161a]" style={{ background: CONF[r.conf].color }}>{t(CONF[r.conf].label)}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const PROCESS: readonly { value: string; label: L }[] = [
  { value: '2', label: { es: 'guías escritas con Claude: «Recorrido» para quien prueba y «Anatomía» con cada regla en archivo:línea', en: 'guides written with Claude: “Journey” for testers and “Anatomy” with every rule at file:line' } },
  { value: '11', label: { es: 'defectos confirmados en la anatomía, cada uno con su forma de reproducirlo', en: 'confirmed defects in the anatomy, each with how to reproduce it' } },
  { value: '487', label: { es: 'casos de uso generados desde el tablero del rediseño, con su subtarea', en: 'use cases generated from the redesign board, with their subtask' } },
  { value: '3', label: { es: 'herramientas propias para el agente: buscar una pieza, leer sus reglas y revisar', en: 'in-house agent tools: find a component, read its rules and review' } },
]

/** 06 · IA: dentro del producto (redactar, leer resultados) y en el proceso de diseño. */
export function SurveyAi() {
  const { t } = useLocale()
  return (
    <div className="space-y-20">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({ es: 'La regla fue la misma en todas partes: la IA propone y la persona decide. Nunca confirma una carga, nunca inventa participantes y nunca afirma algo sin la cifra que lo sostiene. Hoy corre simulada, con el contrato listo para conectar el modelo sin tocar la interfaz.', en: 'The rule was the same everywhere: AI proposes and people decide. It never confirms an upload, never invents participants and never states anything without the number behind it. Today it runs simulated, with the contract ready to plug in the model without touching the UI.' })}
      </p>

      <section>
        <p data-reveal className="mono-label mb-5 text-signal">{t({ es: 'En el constructor · Redactar con IA', en: 'In the builder · Draft with AI' })}</p>
        <div data-reveal>
          <WordingLab />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p data-reveal className="mono-label mb-5 text-signal">{t({ es: 'En resultados · Análisis con IA', en: 'In results · AI analysis' })}</p>
          <div data-reveal>
            <Readings />
          </div>
        </div>
        <div data-reveal="device" className="lg:col-span-6">
          <Screen shot={SHOTS.ia} route="/admin/desempeno-cultura/encuestas/c2026-1/resultados" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </section>

      <section>
        <p data-reveal className="mono-label mb-6 text-signal">{t({ es: 'En el proceso', en: 'In the process' })}</p>
        <dl className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2">
          {PROCESS.map((p) => (
            <div key={p.label.es} data-reveal className="bg-bg p-6">
              <dt className="sr-only">{t(p.label)}</dt>
              <dd>
                <span data-count={p.value} className="block text-5xl font-light tabular-nums text-signal">{p.value}</span>
                <span className="mt-3 block text-sm leading-relaxed opacity-75">{t(p.label)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
