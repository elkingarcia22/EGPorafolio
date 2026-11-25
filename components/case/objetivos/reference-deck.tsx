'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { CaseLead } from '@/components/case/case-lead'
import { ModelStudy } from './model-study'
import { NeuronQuotes } from './neuron-quotes'

/** 02 · Patrones: el estudio de modelos como una red y las reglas que quedaron escritas en el código. */
export function ObjetivosPatterns() {
  const { t } = useLocale()
  return (
    <div>
      <CaseLead className="mb-10">{t(OBJ_CASE.patterns.lead)}</CaseLead>
      <ModelStudy />
      <NeuronQuotes label={{ es: 'Las reglas que quedaron', en: 'The rules that stayed' }} items={OBJ_CASE.patterns.insights} tag="regla_" />
    </div>
  )
}
