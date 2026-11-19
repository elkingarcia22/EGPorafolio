'use client'

import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { TemplateSpectrum } from './idea-spectrum'

/** 03 · La idea: la pregunta, el eje (un constructor para cualquier caso de uso) y los principios. */
export function PromiseIdea() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.idea
  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[30ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(d.hmw)}</p>

      <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:items-end">
        <p data-reveal className="text-[clamp(1.3rem,1rem+0.9vw,1.8rem)] font-light leading-tight lg:col-span-5">{t(d.axis.title)}</p>
        <p data-reveal className="leading-relaxed opacity-80 lg:col-span-7">{t(d.axis.body)}</p>
      </div>
      <div className="mt-10">
        <TemplateSpectrum />
      </div>
      <p data-reveal className="mt-3 text-xs leading-relaxed opacity-60">
        {t({ es: 'Las siete plantillas reales del catálogo, medidas como las mide el producto; cada punto es una pregunta. Las de la NOM 035 son las del prototipo: una muestra del cuestionario oficial con su misma estructura.', en: 'The catalog’s seven real templates, measured the way the product measures them; each dot is a question. The NOM 035 ones are the prototype’s: a sample of the official questionnaire with the same structure.' })}
      </p>

      <ol className="mt-20 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {d.principles.map((p, i) => (
          <li key={p.title.es} data-reveal className="relative pl-14">
            <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-fg/25 font-mono text-xs">{i + 1}</span>
            <p className="text-xl leading-snug">{t(p.title)}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{t(p.body)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
