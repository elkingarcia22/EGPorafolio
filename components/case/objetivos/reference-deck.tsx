'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { ModelStudy } from './model-study'

/** 02 · Patrones: el estudio de modelos y las reglas que quedaron escritas en el código. */
export function ObjetivosPatterns() {
  const { t } = useLocale()
  const { patterns } = OBJ_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <div className="mt-12">
        <ModelStudy />
      </div>

      <p data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Las reglas que quedaron', en: 'The rules that stayed' })}</p>
      <ol className="space-y-px overflow-hidden border border-fg/15 bg-fg/15">
        {patterns.insights.map((rule, i) => (
          <li key={rule.es} data-reveal className="group grid gap-4 bg-bg p-5 transition-colors hover:bg-fg/[0.04] md:grid-cols-[7rem_minmax(0,1fr)]">
            <span className="font-mono text-xs text-signal">regla_{String(i + 1).padStart(2, '0')}</span>
            <span className="text-lg leading-snug">{t(rule)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
