'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { CaseLead } from '@/components/case/case-lead'
import { ModelStudy } from './model-study'

/** 02 · Patrones: el estudio de modelos como una red. */
export function ObjetivosPatterns() {
  const { t } = useLocale()
  return (
    <div>
      <CaseLead className="mb-10">{t(OBJ_CASE.patterns.lead)}</CaseLead>
      <ModelStudy />
    </div>
  )
}
