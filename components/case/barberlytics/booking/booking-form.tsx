'use client'

import { useLocale, type L } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BrowserMockup, MonitorMockup, PhoneMockup, TabletMockup } from '@/components/case/kit/device'

function DeviceLabel({ index, label }: { index: number; label: L }) {
  const { t } = useLocale()
  return (
    <p data-reveal className="mono-label mt-4 flex items-center gap-2 opacity-70">
      <span className="text-signal">0{index}</span>
      {t(label)}
    </p>
  )
}

/** Los cuatro modos de la reserva, cada uno en su aparato. */
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

      <div className="grid items-end gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <MonitorMockup image={surfaces.monitor} />
          <DeviceLabel index={3} label={surfaces.labels.monitor} />
        </div>
        <div className="md:col-span-3">
          <TabletMockup image={surfaces.tablet} sizes="(min-width: 768px) 25vw, 70vw" />
          <DeviceLabel index={2} label={surfaces.labels.tablet} />
        </div>
        <div className="md:col-span-2">
          <PhoneMockup image={surfaces.phone} withLegend={false} sizes="(min-width: 768px) 15vw, 60vw" />
          <DeviceLabel index={1} label={surfaces.labels.phone} />
        </div>
      </div>

      <div className="mt-14">
        <BrowserMockup image={surfaces.widget} withLegend={false} sizes="(min-width: 1024px) 70vw, 100vw" />
        <DeviceLabel index={4} label={surfaces.labels.widget} />
      </div>
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
