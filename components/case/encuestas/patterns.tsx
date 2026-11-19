'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import type { Finding } from '@/lib/content/cases/encuestas/types'

type Area = Finding['area']

/** Cada área con el prefijo de sus casos de QA en el producto y un color propio. */
const AREAS: Record<Area, { label: L; code: string; color: string }> = {
  lista: { label: { es: 'Lista', en: 'List' }, code: 'LIS', color: '#7aa2ff' },
  constructor: { label: { es: 'Constructor', en: 'Builder' }, code: 'CRE', color: '#b18cff' },
  carga: { label: { es: 'Carga histórica', en: 'Historical upload' }, code: 'CAR', color: '#f1c56c' },
  resultados: { label: { es: 'Resultados', en: 'Results' }, code: 'RES', color: '#8ccfa4' },
  privacidad: { label: { es: 'Privacidad', en: 'Privacy' }, code: 'ANO', color: '#f0a07a' },
}

const ORDER = Object.keys(AREAS) as Area[]

/** 02 · Patrones: la auditoría como un tablero filtrable por parte del producto. */
export function AuditPatterns() {
  const { t } = useLocale()
  const p = ENCUESTAS_CASE.patterns
  const [area, setArea] = useState<Area | 'todo'>('todo')
  const visible = p.findings.filter((f) => area === 'todo' || f.area === area)
  const count = (a: Area) => p.findings.filter((f) => f.area === a).length

  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(p.lead)}</p>

      <div data-reveal className="mt-10 flex flex-wrap gap-2" role="group" aria-label={t({ es: 'Filtrar hallazgos por área', en: 'Filter findings by area' })}>
        <button type="button" aria-pressed={area === 'todo'} onClick={() => setArea('todo')} className={`mono-label border px-3 py-2 transition-colors ${area === 'todo' ? 'border-signal bg-signal text-paper' : 'border-fg/25 hover:border-fg/60'}`}>
          {t({ es: 'Todo', en: 'All' })} · {p.findings.length}
        </button>
        {ORDER.map((a) => (
          <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)} className={`mono-label flex items-center gap-2 border px-3 py-2 transition-colors ${area === a ? 'border-fg bg-fg text-bg' : 'border-fg/25 hover:border-fg/60'}`}>
            <span className="h-2 w-2 rounded-full" style={{ background: AREAS[a].color }} />
            {t(AREAS[a].label)} · {count(a)}
          </button>
        ))}
      </div>

      <ol className="mt-8 grid gap-3 md:grid-cols-2" aria-live="polite">
        {visible.map((f) => {
          const meta = AREAS[f.area]
          const index = p.findings.indexOf(f) + 1
          return (
            <li key={f.text.es} className="enc-fade relative overflow-hidden rounded-lg border border-fg/15 bg-fg/[0.03] p-5 pl-6">
              <span className="absolute inset-y-0 left-0 w-1" style={{ background: meta.color }} aria-hidden="true" />
              <p className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-wider opacity-60">
                <span>{meta.code}-{String(index).padStart(3, '0')}</span>
                <span>{t(meta.label)}</span>
              </p>
              <p className="mt-3 leading-snug">{t(f.text)}</p>
            </li>
          )
        })}
      </ol>

      <ol className="mt-16 space-y-4">
        {p.insights.map((insight, i) => (
          <li key={insight.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
