'use client'

import { useLocale } from '@/lib/i18n'
import { THEMA } from '@/lib/content/cases/barberlytics/thema'
import { Block, Body, ChapterOpening, Shot, SubHead } from './ui'

const MAX_FAMILY = THEMA.families[0][1]

/** Capítulo 1 · Thema, el sistema de diseño. */
export function ChapterThema() {
  const { t } = useLocale()
  const { themeModel, aiRules } = THEMA

  return (
    <>
      <ChapterOpening intro={THEMA.intro} />
      <Shot image={THEMA.hero} priority={false} />

      <Block>
        <SubHead index="1.1">{t(themeModel.title)}</SubHead>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Body>{t(themeModel.body)}</Body>
            <ul className="mt-8 grid grid-cols-5 gap-2" aria-label="Temas">
              {themeModel.swatches.map(([name, hex]) => (
                <li key={name} data-reveal className="group">
                  <span className="block aspect-square rounded-full ring-1 ring-fg/15 transition-transform duration-500 ease-expo group-hover:-translate-y-1" style={{ background: hex }} />
                  <span className="mt-1.5 block truncate text-[10px] opacity-60">{name}</span>
                </li>
              ))}
            </ul>
          </div>
          <Shot image={themeModel.image} frame="plain" className="lg:col-span-7" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </Block>

      <Block>
        <SubHead index="1.2">{t({ es: 'Fundamentos', en: 'Foundations' })}</SubHead>
        <dl className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-3">
          {THEMA.foundations.map((f) => (
            <div key={f.title.es} data-reveal className="bg-bg p-6">
              <dt className="brand-title text-xs">{t(f.title)}</dt>
              <dd className="mt-3 text-sm leading-relaxed opacity-75">{t(f.body)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {THEMA.foundationImages.map((img) => (
            <Shot key={img.src} image={img} frame="plain" sizes="(min-width: 768px) 40vw, 100vw" />
          ))}
        </div>
      </Block>

      <Block>
        <SubHead index="1.3">{t({ es: '218 componentes, 22 familias', en: '218 components, 22 families' })}</SubHead>
        <ol className="space-y-1.5" aria-label={t({ es: 'Componentes por familia', en: 'Components per family' })}>
          {THEMA.families.map(([name, count]) => (
            <li key={name} data-reveal className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm">
              <span className="font-mono text-xs opacity-70">{name}</span>
              <span className="h-2 bg-fg/10">
                <span
                  className={`block h-full ${name === 'ai' || name === 'atmosphere' ? 'bg-signal' : 'bg-fg/50'}`}
                  style={{ width: `${(count / MAX_FAMILY) * 100}%` }}
                />
              </span>
              <span className="text-right tabular-nums opacity-70">{count}</span>
            </li>
          ))}
        </ol>
        <Body className="mt-8">{t(THEMA.familiesNote)}</Body>
        <Shot image={THEMA.atmosphere} frame="plain" className="mt-8" />
      </Block>

      <Block>
        <SubHead index="1.4">{t(aiRules.title)}</SubHead>
        <Body>{t(aiRules.lead)}</Body>
        <ol className="mt-8 space-y-3">
          {aiRules.rules.map((rule, i) => (
            <li key={rule.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-3">
              <span className="mono-label text-signal">0{i + 1}</span>
              <span className="text-lg leading-snug">{t(rule)}</span>
            </li>
          ))}
        </ol>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2">
          {aiRules.enforcement.map((e) => (
            <div key={e.title.es} data-reveal className="border-l-2 border-signal pl-5">
              <dt className="font-medium">{t(e.title)}</dt>
              <dd className="mt-2 text-sm leading-relaxed opacity-75">{t(e.body)}</dd>
            </div>
          ))}
        </dl>
        <Shot image={aiRules.image} frame="plain" className="mt-10" />
        <ul className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {THEMA.quality.map((q) => (
            <li key={q.label.es} data-reveal>
              <span className="block text-4xl font-light tabular-nums">{q.value}</span>
              <span className="mono-label opacity-60">{t(q.label)}</span>
            </li>
          ))}
        </ul>
      </Block>
    </>
  )
}
