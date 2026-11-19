'use client'

import Image from 'next/image'
import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { BrowserMockup } from '@/components/case/kit/device'
import { ThemeShowcase } from './theme-showcase'

function SubTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <h3 data-reveal="mask" className="mb-6 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">
      <span className="mono-label text-signal">{index}</span>
      {children}
    </h3>
  )
}

/** Pared de componentes reales, en columnas tipo mosaico. */
function ComponentWall() {
  const { t } = useLocale()
  const { components, familiesNote } = THEMA_CASE.form
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
      <SubTitle index="5.2">{t({ es: 'Las piezas', en: 'The pieces' })}</SubTitle>
      <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">{t(familiesNote)}</p>
      <ul className="columns-1 gap-5 sm:columns-2 xl:columns-3 [&>li]:mb-5">
        {components.map((c) => (
          <li key={c.id} data-reveal="device" className="group break-inside-avoid">
            <figure className="overflow-hidden rounded-xl bg-[#0b0c0e] ring-1 ring-white/10 transition-transform duration-500 ease-expo group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
              <Image src={c.image.src} width={c.image.width} height={c.image.height} alt={t(c.image.alt)} sizes="(min-width: 1280px) 22vw, (min-width: 640px) 35vw, 90vw" className="block h-auto w-full" />
              <figcaption className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-paper">
                <span className="font-mono text-xs">{c.name}</span>
                <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/60">{c.family}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 05 · Forma: temas, componentes, documentación y fundamentos. */
export function ThemaForm() {
  const { t } = useLocale()
  const { form } = THEMA_CASE
  const foundationLabels: readonly L[] = [{ es: 'Tipografía', en: 'Typography' }, { es: 'Colores y tokens', en: 'Colors and tokens' }]
  return (
    <div>
      <section>
        <SubTitle index="5.1">{t({ es: 'Un primario, seis identidades', en: 'One primary, six identities' })}</SubTitle>
        <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">{t(form.themesLead)}</p>
        <div data-reveal="device">
          <ThemeShowcase tilt="perspective(1800px) rotateX(6deg)" />
        </div>
      </section>

      <ComponentWall />

      <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <SubTitle index="5.3">{t(form.docs.title)}</SubTitle>
        <BrowserMockup image={form.docs.image} callouts={form.docs.callouts} />
      </section>

      <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <SubTitle index="5.4">{t({ es: 'Fundamentos', en: 'Foundations' })}</SubTitle>
        <div className="grid gap-10 md:grid-cols-2">
          {form.foundations.map((image, i) => (
            <div key={image.src} className="[perspective:1600px]">
              <div className="transition-transform duration-700 ease-expo hover:![transform:none]" style={{ transform: i ? 'rotateY(-10deg) rotateX(4deg)' : 'rotateY(10deg) rotateX(4deg)' }}>
                <BrowserMockup image={image} withLegend={false} sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
              <p data-reveal className="mono-label mt-4 opacity-70">{t(foundationLabels[i])}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
