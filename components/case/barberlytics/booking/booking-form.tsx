'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BrowserMockup, MonitorMockup, PhoneMockup, TabletMockup } from '@/components/case/kit/device'

type SurfaceDevice = (typeof BOOKING_CASE.form.surfaces.devices)[number]

/** El aparato que corresponde a cada modo. */
function DeviceFor({ device }: { device: SurfaceDevice }) {
  if (device.kind === 'phone') return <PhoneMockup image={device.image} withLegend={false} sizes="(min-width: 768px) 18vw, 60vw" className="mx-auto w-[30%]" />
  if (device.kind === 'tablet') return <TabletMockup image={device.image} sizes="(min-width: 768px) 25vw, 70vw" className="mx-auto w-[52%]" />
  if (device.kind === 'monitor') return <MonitorMockup image={device.image} sizes="(min-width: 768px) 35vw, 90vw" className="w-[94%]" />
  return <BrowserMockup image={device.image} withLegend={false} sizes="(min-width: 768px) 35vw, 90vw" className="w-[94%]" />
}

/**
 * La misma pantalla (fecha y hora) en los cuatro modos, en una grilla de 2×2.
 * Cada aparato tiene su ángulo y se pone de frente al pasar el cursor.
 */
function Surfaces() {
  const { t } = useLocale()
  const { surfaces } = BOOKING_CASE.form
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
      <h3 data-reveal="mask" className="mb-4 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">
        <span className="mono-label text-signal">5.{BOOKING_CASE.form.screens.length + 1}</span>
        {t(surfaces.title)}
      </h3>
      <p data-reveal className="mb-12 max-w-[62ch] leading-relaxed opacity-80">{t(surfaces.body)}</p>

      <ul className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-2">
        {surfaces.devices.map((device, i) => (
          <li key={device.kind} className="group flex flex-col bg-bg">
            <div className="flex aspect-[5/4] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_60%,rgba(217,179,106,0.16),transparent_65%)] px-6 py-8 [perspective:1600px]">
              <div
                className="flex w-full items-center justify-center transition-transform duration-[900ms] ease-expo [transform-style:preserve-3d] group-hover:![transform:none]"
                style={{ transform: device.tilt }}
              >
                <DeviceFor device={device} />
              </div>
            </div>
            <div data-reveal className="flex items-baseline gap-4 border-t border-fg/15 p-5">
              <span className="mono-label text-signal">0{i + 1}</span>
              <p>
                <span className="block font-medium">{t(device.label)}</span>
                <span className="mt-1 block text-sm leading-relaxed opacity-70">{t(device.note)}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 05 · Forma: las pantallas reales, en su aparato y con lo importante destacado. */
export function BookingForm() {
  const { t } = useLocale()
  const { form } = BOOKING_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(form.lead)}</p>

      <div className="mt-14 space-y-[clamp(4rem,3rem+4vw,7rem)]">
        {form.screens.map((screen, i) => (
          <section key={screen.title.es}>
            <h3 data-reveal="mask" className="mb-8 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">
              <span className="mono-label text-signal">5.{i + 1}</span>
              {t(screen.title)}
            </h3>
            <PhoneMockup image={screen.image} callouts={screen.callouts} />
          </section>
        ))}
      </div>

      <Surfaces />
    </div>
  )
}
