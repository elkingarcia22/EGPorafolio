'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { CaseLead } from '@/components/case/case-lead'
import { PrinciplesStage } from './principles-stage'

/** 03 · La idea: la pregunta y cuatro principios, cada uno con su demostración. */
export function ObjetivosIdea() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal className="mono-label mb-4 text-center text-signal">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="mx-auto max-w-[24ch] text-center text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(OBJ_CASE.idea.hmw)}</p>
      <CaseLead className="mt-8">
        {t({
          es: 'Ninguna empresa cambia su método: el modelo, quién redacta, la medida y la duración se eligen, y todo lo demás lee esas reglas.',
          en: 'No company changes its method: model, who writes, measure and length are chosen, and everything else reads those rules.',
        })}
      </CaseLead>

      <div className="mt-[clamp(3.5rem,3rem+3vw,6rem)]">
        <PrinciplesStage />
      </div>
    </div>
  )
}
