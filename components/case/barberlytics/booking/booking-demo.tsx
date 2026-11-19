'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'

/**
 * 08 · Demo: la reserva real dentro de un celular. El iframe solo se carga al
 * pedirlo, así no pesa al abrir el caso ni atrapa el scroll de quien pasa.
 */
export function BookingDemo() {
  const { t } = useLocale()
  const { demo } = BOOKING_CASE
  const [version, setVersion] = useState(demo.versions[0])
  const [started, setStarted] = useState(false)

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-5">
        <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">
          {t({ es: 'Pruébala tú.', en: 'Try it yourself.' })}
        </p>
        <p data-reveal className="mt-5 leading-relaxed opacity-80">{t(demo.lead)}</p>

        <div data-reveal role="radiogroup" aria-label={t({ es: 'Versión de la reserva', en: 'Booking version' })} className="mt-8 flex gap-2">
          {demo.versions.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={version.id === v.id}
              onClick={() => {
                setVersion(v)
                setStarted(true)
              }}
              className="mono-label border border-fg/25 px-4 py-2.5 transition-colors hover:border-fg/60 aria-checked:border-signal aria-checked:bg-signal aria-checked:text-paper"
            >
              {t(v.name)}
            </button>
          ))}
        </div>

        <dl data-reveal className="mt-8 divide-y divide-fg/15 border-y border-fg/15">
          {demo.tryIt.map((item) => (
            <div key={item.label.es} className="flex items-baseline justify-between gap-4 py-3 text-sm">
              <dt className="opacity-60">{t(item.label)}</dt>
              <dd className="min-w-0 break-words text-right font-mono">{typeof item.value === 'string' ? item.value : t(item.value)}</dd>
            </div>
          ))}
        </dl>

        <a data-reveal href={demo.open} target="_blank" rel="noopener noreferrer" className="mono-label mt-6 inline-block opacity-70 underline-offset-4 hover:underline hover:opacity-100">
          {t({ es: 'Abrir la vista previa completa', en: 'Open the full preview' })} ↗
        </a>
      </div>

      <div data-reveal="device" className="min-w-0 lg:col-span-7">
        <PhoneBody className="mx-auto w-[360px] max-w-full">
          <StatusBar />
          <div className="relative h-[700px] max-h-[76vh]">
            {started ? (
              <iframe
                key={version.id}
                src={version.url}
                title={t({ es: 'Reserva de Barberlytics, en vivo', en: 'Barberlytics booking, live' })}
                className="h-full w-full bg-void"
              />
            ) : (
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="group absolute inset-0 flex flex-col items-center justify-end bg-[url('/cases/barberlytics/surface-phone.webp')] bg-cover bg-top pb-16"
              >
                <span className="bg-void/85 px-6 py-3.5 text-paper backdrop-blur transition-colors group-hover:bg-signal">
                  <span className="mono-label">▶ {t({ es: 'Iniciar la demo', en: 'Start the demo' })}</span>
                </span>
              </button>
            )}
          </div>
        </PhoneBody>
      </div>
    </div>
  )
}
