'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { ClipperOrb } from '../clipper-orb'

/** 06 · IA en el proceso: Clipper en la reserva y la IA en cómo se construyó. */
export function BookingAi() {
  const { t } = useLocale()
  const { product, build } = BOOKING_CASE.ai
  return (
    <div>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div data-reveal className="mb-6 flex items-center gap-4">
            <ClipperOrb size={56} />
            <h3 className="text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(product.title)}</h3>
          </div>
          <p data-reveal className="leading-relaxed opacity-80">{t(product.body)}</p>
        </div>

        {/* De la frase a la reserva */}
        <div className="lg:col-span-7">
          <div data-reveal className="border border-fg/15 p-6">
            <p className="mono-label mb-3 opacity-60">{t({ es: 'El cliente escribe', en: 'The client types' })}</p>
            <p className="text-2xl font-light">«{t(product.phrase)}»</p>
          </div>
          <p data-reveal className="mono-label my-3 text-center text-signal">↓ {t({ es: 'reglas, sin modelo', en: 'rules, no model' })} ↓</p>
          <dl data-reveal className="grid grid-cols-2 gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-4">
            {product.parsed.map((p) => (
              <div key={p.key.es} className="bg-bg p-4">
                <dt className="mono-label opacity-60">{t(p.key)}</dt>
                <dd className="mt-2 text-lg">{t(p.value)}</dd>
              </div>
            ))}
          </dl>
          <p data-reveal className="mt-4 border-l-2 border-signal pl-4 text-sm leading-relaxed opacity-80">{t(product.result)}</p>
        </div>
      </div>

      <div className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <h3 data-reveal className="mb-8 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(build.title)}</h3>
        <ol className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-4">
          {build.steps.map((step, i) => (
            <li key={step.title.es} data-reveal className="bg-bg p-6">
              <span className="mono-label text-signal">0{i + 1}</span>
              <p className="mt-3 font-medium">{t(step.title)}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{t(step.body)}</p>
            </li>
          ))}
        </ol>
        <p data-reveal className="mt-10 flex flex-wrap items-baseline gap-4">
          <span data-count={build.days.value} className="text-[clamp(3rem,2rem+3vw,5rem)] font-light leading-none text-signal">{build.days.value}</span>
          <span className="max-w-[30ch] text-lg leading-snug opacity-80">{t(build.days.label)}</span>
        </p>
      </div>
    </div>
  )
}
