'use client'

import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { AffinityBoard } from './patterns-board'

/** De dónde salen los hallazgos: no hubo entrevistas, hubo recorrido, reuniones y crítica. */
const SOURCES: readonly { value: string; label: L }[] = [
  { value: '83', label: { es: 'encuestas en la cuenta real auditada', en: 'surveys in the real audited account' } },
  { value: '↻', label: { es: 'reuniones con producto y desarrollo', en: 'meetings with product and engineering' } },
  { value: '✎', label: { es: 'crítica de nuestros propios prototipos', en: 'critique of our own prototypes' } },
]

/** 02 · Patrones: la auditoría como un tablero de afinidad que se agrupa solo. */
export function AuditPatterns() {
  const { t } = useLocale()
  const p = ENCUESTAS_CASE.patterns
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(p.lead)}</p>

      <ul data-reveal className="mt-8 flex flex-wrap gap-2" aria-label={t({ es: 'Fuentes', en: 'Sources' })}>
        {SOURCES.map((s) => (
          <li key={s.label.es} className="flex items-center gap-3 rounded-full border border-fg/20 bg-fg/[0.04] py-1.5 pl-1.5 pr-4 text-sm">
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-signal px-2 font-mono text-xs text-on-signal">{s.value}</span>
            {t(s.label)}
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <AffinityBoard />
      </div>

      <p className="mt-6 max-w-[62ch] text-xs leading-relaxed opacity-55">
        {t({
          es: 'Cada nota lleva el código de su caso de QA en el producto y la severidad que le di en la auditoría. Pasa por un grupo o un hallazgo para ver de dónde sale.',
          en: 'Each note carries its QA case code in the product and the severity I gave it in the audit. Hover a group or an insight to see where it comes from.',
        })}
      </p>
    </div>
  )
}
