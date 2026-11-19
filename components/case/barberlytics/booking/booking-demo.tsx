'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'
import { CaseDemo } from '@/components/case/kit/case-demo'

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
  const { demo } = BOOKING_CASE
  const [open, setOpen] = useState(false)

  return (
    <>
      <CaseDemo
        title={{ es: 'Reserva una cita, como un cliente.', en: 'Book a visit, like a client.' }}
        lead={demo.lead}
        url="booking-flow-alpha.vercel.app"
        image={{ src: BOOKING_CASE.cover.src, width: BOOKING_CASE.cover.width, height: BOOKING_CASE.cover.height }}
        accent={'217 179 106'}
        tryIt={demo.tryIt}
        onOpen={() => setOpen(true)}
      />
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
