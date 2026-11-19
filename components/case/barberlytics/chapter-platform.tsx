'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { PLATFORM } from '@/lib/content/cases/barberlytics/platform'
import { Block, Body, ChapterOpening, Shot, SubHead } from './ui'

/** Pestañas para recorrer los módulos rediseñados sin una pared de capturas. */
function ModuleTabs() {
  const { t } = useLocale()
  const images = PLATFORM.after.images
  const [active, setActive] = useState(0)
  return (
    <div>
      <div role="tablist" aria-label={t(PLATFORM.after.title)} className="mb-6 flex flex-wrap gap-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            id={`module-tab-${i}`}
            aria-selected={active === i}
            aria-controls="module-panel"
            onClick={() => setActive(i)}
            className="mono-label border border-fg/20 px-3 py-2 transition-colors hover:border-fg/60 aria-selected:border-signal aria-selected:bg-signal aria-selected:text-paper"
          >
            {img.caption ? t(img.caption) : i + 1}
          </button>
        ))}
      </div>
      <div id="module-panel" role="tabpanel" aria-labelledby={`module-tab-${active}`}>
        <Shot key={images[active].src} image={{ ...images[active], caption: undefined }} />
        <p className="mt-3 text-sm opacity-70">{t(images[active].alt)}</p>
      </div>
    </div>
  )
}

/** Capítulo 3 · La plataforma del negocio. */
export function ChapterPlatform() {
  const { t } = useLocale()
  const { before, roles, decisions, calendarAi } = PLATFORM

  return (
    <>
      <ChapterOpening intro={PLATFORM.intro} />

      <Block className="!mt-0">
        <SubHead index="3.1">{t(before.title)}</SubHead>
        <Body>{t(before.note)}</Body>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {before.images.map((img) => (
            <Shot key={img.src} image={img} frame="phone" sizes="(min-width: 768px) 20vw, 45vw" />
          ))}
        </div>
      </Block>

      <Block>
        <SubHead index="3.2">{t(roles.title)}</SubHead>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="mono-label opacity-60">
                <th scope="col" className="pb-3 font-normal">{t({ es: 'Rol', en: 'Role' })}</th>
                <th scope="col" className="pb-3 font-normal">{t({ es: 'Qué ve', en: 'What they see' })}</th>
                <th scope="col" className="pb-3 font-normal">{t({ es: 'Entra a', en: 'Lands on' })}</th>
              </tr>
            </thead>
            <tbody>
              {roles.items.map((r) => (
                <tr key={r.role.es} data-reveal className="border-t border-fg/15">
                  <th scope="row" className="py-4 pr-4 font-medium">{t(r.role)}</th>
                  <td className="py-4 pr-4 opacity-80">{t(r.scope)}</td>
                  <td className="py-4">{t(r.lands)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <blockquote data-reveal className="mt-10 border-l-4 border-signal pl-6 text-[clamp(1.1rem,0.9rem+0.6vw,1.4rem)] font-light leading-relaxed">
          {t(roles.insight)}
        </blockquote>
      </Block>

      <Block>
        <SubHead index="3.3">{t(PLATFORM.after.title)}</SubHead>
        <ModuleTabs />
      </Block>

      <Block>
        <SubHead index="3.4">{t({ es: 'Decisiones y su porqué', en: 'Decisions and their why' })}</SubHead>
        <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {decisions.map((d, i) => (
            <li key={d.title.es} data-reveal className="border-t border-fg/15 pt-4">
              <p className="flex items-baseline gap-3 font-medium">
                <span className="mono-label text-signal">0{i + 1}</span>
                {t(d.title)}
              </p>
              <p className="mt-2 text-sm leading-relaxed opacity-75">{t(d.why)}</p>
            </li>
          ))}
        </ol>
      </Block>

      <Block>
        <SubHead index="3.5">{t(calendarAi.title)}</SubHead>
        <Body>{t(calendarAi.body)}</Body>
        <ol className="mt-8 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-5">
          {calendarAi.steps.map((step, i) => (
            <li key={step.es} data-reveal className="bg-bg p-5">
              <span className="mono-label text-signal">{i + 1}</span>
              <span className="mt-2 block text-sm leading-snug">{t(step)}</span>
            </li>
          ))}
        </ol>
      </Block>
    </>
  )
}
