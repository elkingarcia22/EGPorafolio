'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PhoneBody } from '@/components/case/kit/device'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'
import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'

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

/**
 * 07 · Demo: la reserva real, viva dentro de un celular (datos simulados: nada
 * se cobra ni se envía). Se elige la versión —según el cliente o Clipper— y al
 * lado quedan los datos para probarla. Solo se carga cuando se acerca a la vista.
 */
export function BookingDemo() {
  const { t } = useLocale()
  const { demo } = BOOKING_CASE
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [version, setVersion] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const current = demo.versions[version]

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* El nodo que recibe la fibra de «Impacto»: late, la demo está viva */}
      <span aria-hidden="true" className="relative grid h-14 w-14 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(var(--bk)/0.35),transparent_70%)]" />
        <span className="bk-ping absolute inset-2 rounded-full border border-[rgb(var(--bk)/0.6)]" />
        <span className="relative h-3.5 w-3.5 rounded-full border border-white bg-[rgb(var(--bk))] shadow-[0_0_20px_5px_rgb(var(--bk)/0.6)]" />
      </span>
      <h3 className="mt-6 text-balance text-center text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Reserva una cita, como un cliente.', en: 'Book a visit, like a client.' })}
      </h3>
      <p className="mt-3 max-w-[52ch] text-balance text-center text-sm leading-relaxed text-paper/60 md:text-base">{t(demo.lead)}</p>

      <div className="mt-12 grid w-full max-w-[860px] items-center gap-12 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[320px]">
          {/* Versiones: cambia la app que corre en el celular */}
          <div role="tablist" aria-label={t({ es: 'Versión', en: 'Version' })} className="mb-5 flex justify-center gap-2">
            {demo.versions.map((v, i) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={i === version}
                onClick={() => setVersion(i)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${i === version ? 'border-[rgb(var(--bk))] bg-[rgb(var(--bk)/0.12)] text-paper' : 'border-white/15 text-paper/60 hover:border-white/35 hover:text-paper'}`}
              >
                {t(v.name)}
              </button>
            ))}
          </div>
          <PhoneBody>
            <div className="relative aspect-[390/780] w-full bg-[#0b0c0e]">
              {near ? (
                <iframe key={current.id} src={current.url} title={t({ es: 'Reserva de Barberlytics, en vivo', en: 'Barberlytics booking, live' })} allow="microphone; autoplay" loading="lazy" className="absolute inset-0 h-full w-full" />
              ) : (
                <Image src="/cases/barberlytics/booking-app-cover.webp" fill sizes="320px" alt="" className="object-cover object-top" />
              )}
            </div>
          </PhoneBody>
        </div>

        {/* Para probarla: los datos de prueba, en columna */}
        <div className="flex flex-col items-center md:items-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[rgb(var(--bk))]">{t({ es: 'Para probarla', en: 'To try it' })}</p>
          <dl className="mt-5 grid w-full max-w-[360px] gap-4">
            {demo.tryIt.map((row) => (
              <div key={row.label.es} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-[13px] text-paper/55">{t(row.label)}</dt>
                <dd className="text-right font-mono text-[13px] tabular-nums">{typeof row.value === 'string' ? row.value : t(row.value)}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[rgb(var(--bk))] px-5 py-2.5 text-sm font-medium text-[#14110b] shadow-[0_0_30px_-6px_rgb(var(--bk)/0.8)] transition-transform duration-300 ease-expo hover:-translate-y-0.5"
          >
            {t({ es: 'Abrir en pantalla completa', en: 'Open full screen' })} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
