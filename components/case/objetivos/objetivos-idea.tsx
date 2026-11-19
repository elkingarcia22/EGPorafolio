'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { ModelConfigurator } from './model-configurator'
import { PrinciplesStage } from './principles-stage'

/** 03 · La idea: la pregunta y cuatro principios, cada uno con su demostración. */
export function ObjetivosIdea() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[26ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(OBJ_CASE.idea.hmw)}</p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Lo central de la idea: no obligar a ninguna empresa a cambiar su método. El modelo, quién redacta, la medida y la duración se eligen; todo lo que viene después lee esas reglas.',
          en: 'The core of the idea: never force a company to change its method. Model, who writes, measure and length are chosen; everything after that reads those rules.',
        })}
      </p>
      <div className="mt-12">
        <ModelConfigurator />
      </div>

      <p data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Y cuatro principios que valen para cualquier modelo', en: 'And four principles that hold for any model' })}</p>
      <PrinciplesStage />
    </div>
  )
}
