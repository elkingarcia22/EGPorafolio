'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BrowserMockup, PhoneMockup } from '@/components/case/kit/device'

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
            <h3 data-reveal className="mb-8 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">
              <span className="mono-label text-signal">5.{i + 1}</span>
              {t(screen.title)}
            </h3>
            <PhoneMockup image={screen.image} callouts={screen.callouts} />
          </section>
        ))}
      </div>

      <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <h3 data-reveal className="mb-4 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">
          <span className="mono-label text-signal">5.{form.screens.length + 1}</span>
          {t(form.surfaces.title)}
        </h3>
        <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">{t(form.surfaces.body)}</p>
        <BrowserMockup image={BOOKING_CASE.cover} withLegend={false} />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {form.surfaces.images.map((image) => (
            <BrowserMockup key={image.src} image={image} withLegend={false} />
          ))}
        </div>
      </section>
    </div>
  )
}
