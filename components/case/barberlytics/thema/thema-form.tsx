'use client'

import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { ThemeShowcase } from './theme-showcase'
import { LiveCollage } from './live-collage'
import { DocsAsCode } from './docs-as-code'
import { FoundationsLive } from './foundations-live'

function SubTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <h3 data-reveal="mask" className="mb-6 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">
      <span className="mono-label text-signal">{index}</span>
      {children}
    </h3>
  )
}

/** 05 · Forma: temas, componentes en uso, documentación como código y fundamentos. */
export function ThemaForm() {
  const { t } = useLocale()
  const { form } = THEMA_CASE
  return (
    <div>
      <section>
        <SubTitle index="5.1">{t({ es: 'Un primario, seis identidades', en: 'One primary, six identities' })}</SubTitle>
        <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">{t(form.themesLead)}</p>
        <div data-reveal="device">
          <ThemeShowcase tilt="perspective(1800px) rotateX(6deg)" />
        </div>
      </section>

      <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <SubTitle index="5.2">{t({ es: 'Las piezas, en uso', en: 'The pieces, in use' })}</SubTitle>
        <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">{t(form.familiesNote)}</p>
        <LiveCollage />
      </section>

      <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <SubTitle index="5.3">{t({ es: 'La documentación es código', en: 'The docs are code' })}</SubTitle>
        <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">
          {t({
            es: 'Cada componente tiene una ficha en el código: descripción, controles del playground, props y guías de uso. De esa ficha salen la página de la documentación, el catálogo que lee la IA y las pruebas.',
            en: 'Every component has a sheet in code: description, playground controls, props and usage guides. From that sheet come the docs page, the catalog the AI reads and the tests.',
          })}
        </p>
        <DocsAsCode />
      </section>

      <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <SubTitle index="5.4">{t({ es: 'Fundamentos', en: 'Foundations' })}</SubTitle>
        <FoundationsLive />
      </section>
    </div>
  )
}
