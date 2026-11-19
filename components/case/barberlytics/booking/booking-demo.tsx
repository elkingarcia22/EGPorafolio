'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'

const DEMO_ID = 'reserva'

/** La vista previa real (celular, tablet, monitor y widget) en el modal a pantalla completa. */
function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLocale()
  const url = BOOKING_CASE.demo.open
  return (
    <RecordModal
      ids={[DEMO_ID]}
      openId={open ? DEMO_ID : null}
      onOpenChange={(id) => id === null && onClose()}
      title={t({ es: 'Barberlytics · Reserva en línea', en: 'Barberlytics · Online booking' })}
      titleLeading={<Image src="/cases/barberlytics/booking-app-cover.webp" width={36} height={36} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover object-top" />}
      description={url.replace('https://', '')}
      actions={<NewTabLink href={url} />}
    >
      <iframe src={url} title={t({ es: 'Reserva de Barberlytics, en vivo', en: 'Barberlytics booking, live' })} allow="microphone; autoplay" className="w-full flex-1 bg-void" />
    </RecordModal>
  )
}

/** 08 · Demo: la reserva real; el celular es la vista previa y abre la demo a pantalla completa. */
export function BookingDemo() {
  const { t } = useLocale()
  const { demo } = BOOKING_CASE
  const [open, setOpen] = useState(false)

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-5">
        <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">
          {t({ es: 'Pruébala tú.', en: 'Try it yourself.' })}
        </p>
        <p data-reveal className="mt-5 leading-relaxed opacity-80">{t(demo.lead)}</p>

        <dl data-reveal className="mt-8 divide-y divide-fg/15 border-y border-fg/15">
          {demo.tryIt.map((item) => (
            <div key={item.label.es} className="flex items-baseline justify-between gap-4 py-3 text-sm">
              <dt className="opacity-60">{t(item.label)}</dt>
              <dd className="min-w-0 break-words text-right font-mono">{typeof item.value === 'string' ? item.value : t(item.value)}</dd>
            </div>
          ))}
        </dl>

        <button
          data-reveal
          type="button"
          onClick={() => setOpen(true)}
          className="mono-label mt-8 border border-fg/25 px-5 py-3 transition-colors hover:border-signal hover:bg-signal hover:text-paper"
        >
          ⤢ {t({ es: 'Abrir la demo a pantalla completa', en: 'Open the demo full screen' })}
        </button>
      </div>

      <div data-reveal="device" className="min-w-0 lg:col-span-7">
        <button type="button" onClick={() => setOpen(true)} className="group mx-auto block w-[360px] max-w-full" aria-label={t({ es: 'Abrir la demo a pantalla completa', en: 'Open the demo full screen' })}>
          <PhoneBody className="w-full transition-transform duration-700 ease-expo group-hover:-translate-y-2">
            <StatusBar />
            <div className="relative h-[700px] max-h-[76vh] overflow-hidden">
              <Image src="/cases/barberlytics/booking-app-cover.webp" width={780} height={1688} alt="" sizes="360px" className="h-full w-full object-cover object-top transition-[filter] duration-500 group-hover:brightness-75" />
              <span className="absolute inset-x-0 bottom-16 flex justify-center">
                <span className="bg-void/85 px-6 py-3.5 text-paper backdrop-blur transition-colors group-hover:bg-signal">
                  <span className="mono-label">⤢ {t({ es: 'Iniciar la demo', en: 'Start the demo' })}</span>
                </span>
              </span>
            </div>
          </PhoneBody>
        </button>
      </div>

      <BookingModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
