'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'

const TOTAL = 80
const SEGMENT_TONE: Record<string, string> = {
  q4: 'bg-signal text-paper',
  q1: 'bg-signal/45 text-fg',
  backlog: 'bg-fg/15 text-fg',
}

/** Las 80 funcionalidades del alcance, repartidas en tres momentos. */
function Roadmap() {
  const { t } = useLocale()
  const { roadmap } = OBJ_CASE.impact
  const [active, setActive] = useState(roadmap[0].id)
  const current = roadmap.find((r) => r.id === active) ?? roadmap[0]
  return (
    <figure data-reveal className="border border-fg/15 p-6">
      <figcaption className="mono-label mb-6 opacity-70">{t({ es: 'Alcance: 80 funcionalidades en tres momentos', en: 'Scope: 80 features in three moments' })}</figcaption>
      <div className="flex h-16 w-full gap-1 overflow-hidden" role="tablist" aria-label={t({ es: 'Momentos del alcance', en: 'Scope moments' })}>
        {roadmap.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={r.id === active}
            onClick={() => setActive(r.id)}
            onMouseEnter={() => setActive(r.id)}
            data-reveal="right"
            className={`flex min-w-[6rem] gap-2 items-end justify-between p-3 text-left transition-[filter,transform] duration-300 hover:brightness-110 aria-selected:-translate-y-1 ${SEGMENT_TONE[r.id]}`}
            style={{ width: `${(r.count / TOTAL) * 100}%` }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]">{t(r.label)}</span>
            <span className="text-xl font-light tabular-nums">{r.count}</span>
          </button>
        ))}
      </div>
      <p key={current.id} className="obj-fade mt-6 max-w-[60ch] leading-relaxed">
        <span className="mono-label mr-3 text-signal">{t(current.label)}</span>
        {t(current.sample)}
      </p>
    </figure>
  )
}

/** 07 · Impacto: lo construido, lo esperado (de referencia) y lo aprendido. */
export function ObjetivosImpact() {
  const { t } = useLocale()
  const { impact } = OBJ_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(impact.lead)}</p>

      <p data-reveal className="mono-label mb-6 mt-14 opacity-60">{t({ es: 'Lo construido', en: 'What was built' })}</p>
      <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {impact.built.map((s) => (
          <div key={s.label.es} data-reveal>
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span data-count={s.value} className="block text-[clamp(2.6rem,1.6rem+2.8vw,4.2rem)] font-light leading-none tabular-nums">{s.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-16">
        <Roadmap />
      </div>

      <div data-reveal className="mt-16 border border-dashed border-fg/30 p-6">
        <p className="mono-label mb-6 flex flex-wrap items-center gap-3">
          <span className="bg-fg px-2 py-1 text-bg">{t({ es: 'Cifras de referencia', en: 'Reference figures' })}</span>
          <span className="opacity-60">{t({ es: 'Lo que esperamos mover; no son medidas en producción', en: 'What we expect to move; not measured in production' })}</span>
        </p>
        <dl className="grid gap-8 sm:grid-cols-3">
          {impact.reference.map((m) => (
            <div key={m.label.es}>
              <dt className="sr-only">{t(m.label)}</dt>
              <dd>
                <span className="block text-[clamp(2.2rem,1.4rem+2vw,3.2rem)] font-light leading-none text-signal tabular-nums">
                  {m.prefix}
                  <span data-count={m.value}>{m.value}</span>
                  {m.suffix}
                </span>
                <span className="mt-3 block text-sm leading-snug opacity-70">{t(m.label)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Lo aprendido', en: 'What I learned' })}</p>
      <ol className="space-y-4">
        {impact.learnings.map((l, i) => (
          <li key={l.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">0{i + 1}</span>
            <span className="text-lg leading-snug">{t(l)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
