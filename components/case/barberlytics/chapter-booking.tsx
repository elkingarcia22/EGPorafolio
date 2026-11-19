'use client'

import Image from 'next/image'
import { useLocale } from '@/lib/i18n'
import { BOOKING } from '@/lib/content/cases/barberlytics/booking'
import { Block, Body, ChapterOpening, Shot, SubHead } from './ui'

/**
 * Puerta a la demo en vivo: el celular con la portada abre la reserva real en
 * otra pestaña (el sitio de la reserva no permite mostrarse dentro de otro).
 */
function LiveDemo() {
  const { t } = useLocale()
  return (
    <div data-reveal className="flex flex-col items-center gap-5">
      <a
        href={BOOKING.demo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-[300px] max-w-full overflow-hidden rounded-[34px] bg-void p-2 ring-1 ring-fg/20 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
      >
        <span className="block overflow-hidden rounded-[26px]">
          <Image
            src="/cases/barberlytics/booking-cover.webp"
            width={390}
            height={844}
            alt=""
            sizes="300px"
            className="block h-auto w-full transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
          />
        </span>
        <span className="absolute inset-x-6 bottom-8 flex items-center justify-center bg-void/85 px-5 py-3 text-paper backdrop-blur transition-colors group-hover:bg-signal">
          <span className="mono-label">
            {t({ es: 'Abrir la reserva en vivo', en: 'Open the live booking' })} ↗
            <span className="sr-only"> {t({ es: '(se abre en otra pestaña)', en: '(opens in a new tab)' })}</span>
          </span>
        </span>
      </a>
      <p className="max-w-[34ch] text-center text-sm opacity-70">{t(BOOKING.demo.hint)}</p>
    </div>
  )
}

/** Capítulo 2 · La reserva del cliente. */
export function ChapterBooking() {
  const { t } = useLocale()

  return (
    <>
      <ChapterOpening intro={BOOKING.intro} />

      <Block className="!mt-0">
        <SubHead index="2.1">{t({ es: 'Quince productos, tres hallazgos', en: 'Fifteen products, three findings' })}</SubHead>
        <ul className="flex flex-wrap gap-2" aria-label={t({ es: 'Productos comparados', en: 'Products compared' })}>
          {BOOKING.competitors.map((name) => (
            <li key={name} data-reveal className="border border-fg/20 px-3 py-1.5 text-xs">
              {name}
            </li>
          ))}
        </ul>
        <dl className="mt-10 grid gap-8 md:grid-cols-3">
          {BOOKING.findings.map((f, i) => (
            <div key={f.title.es} data-reveal>
              <dt className="flex items-baseline gap-3 font-medium">
                <span className="mono-label text-signal">0{i + 1}</span>
                {t(f.title)}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed opacity-75">{t(f.body)}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block>
        <SubHead index="2.2">{t({ es: 'Cuatro versiones, cuatro preguntas', en: 'Four versions, four questions' })}</SubHead>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="mono-label opacity-60">
                <th scope="col" className="pb-3 font-normal">{t({ es: 'Versión', en: 'Version' })}</th>
                <th scope="col" className="pb-3 font-normal">{t({ es: 'Empieza por', en: 'Starts from' })}</th>
                <th scope="col" className="pb-3 font-normal">{t({ es: 'Para quién', en: 'For whom' })}</th>
              </tr>
            </thead>
            <tbody>
              {BOOKING.versions.map((v) => (
                <tr key={v.name.es} data-reveal className="border-t border-fg/15">
                  <th scope="row" className="py-4 pr-4 font-medium">{t(v.name)}</th>
                  <td className="py-4 pr-4 text-lg font-light">«{t(v.question)}»</td>
                  <td className="py-4 opacity-75">{t(v.for)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Body className="mt-8">{t(BOOKING.versionsNote)}</Body>
      </Block>

      <Block>
        <SubHead index="2.3">{t({ es: 'El flujo por defecto', en: 'The default flow' })}</SubHead>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {BOOKING.flow.map((img) => (
            <Shot key={img.src} image={img} frame="phone" sizes="(min-width: 640px) 25vw, 80vw" className="mx-auto w-full max-w-[16rem]" />
          ))}
        </div>
        <dl className="mt-12 grid gap-6 sm:grid-cols-2">
          {BOOKING.details.map((d) => (
            <div key={d.title.es} data-reveal className="border-l-2 border-signal pl-5">
              <dt className="font-medium">{t(d.title)}</dt>
              <dd className="mt-2 text-sm leading-relaxed opacity-75">{t(d.body)}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block>
        <SubHead index="2.4">{t({ es: 'Un flujo, cuatro superficies', en: 'One flow, four surfaces' })}</SubHead>
        <Body>{t(BOOKING.surfacesNote)}</Body>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {BOOKING.surfaces.map((img) => (
            <Shot key={img.src} image={img} sizes="(min-width: 1024px) 25vw, 100vw" />
          ))}
        </div>
      </Block>

      <Block>
        <SubHead index="2.5">{t({ es: 'Pruébalo', en: 'Try it' })}</SubHead>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <LiveDemo />
          <div>
            <p data-reveal className="mono-label mb-3 text-signal">{t({ es: 'Lo que falta', en: 'What’s left' })}</p>
            <Body>{t(BOOKING.pending)}</Body>
          </div>
        </div>
      </Block>
    </>
  )
}
