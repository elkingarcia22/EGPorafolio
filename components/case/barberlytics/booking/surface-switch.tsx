'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { BookingLede } from './booking-lede'
import { useAutoSteps, useCycle } from './use-auto-steps'
import { useSwipe } from '@/components/case/kit/use-swipe'

/** Tiempo en cada superficie mientras pasan solas (ms) */
const SURFACE_MS = 2800
/** Ancho del marco de cada aparato (fracción del escenario): al cambiar, un marco se va y entra el otro */
const FRAME_W: Record<string, string> = { phone: '30%', tablet: '46%', monitor: '100%', widget: '100%' }
const FRAME_R: Record<string, string> = { phone: '34px', tablet: '24px', monitor: '12px', widget: '10px' }

/**
 * 04 · Bocetos y forma, segunda parte: la misma pantalla de fecha y hora se
 * muda de marco sin reiniciarse —celular, tablet, monitor y widget—. Pasan
 * solas; tocar una superficie la deja quieta y muestra su nota.
 */
export function SurfaceSwitch() {
  const { t } = useLocale()
  const { surfaces } = BOOKING_CASE.form
  const devices = surfaces.devices
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const [picked, setPicked] = useState(false)
  const [active, setActive] = useCycle(devices.length, SURFACE_MS, inView && !picked && !reducedMotion)
  const current = devices[active]
  // En el teléfono también se pasa deslizando el dedo de lado.
  useSwipe(ref, {
    onNext: () => {
      setPicked(true)
      setActive((active + 1) % devices.length)
    },
    onPrev: () => {
      setPicked(true)
      setActive((active - 1 + devices.length) % devices.length)
    },
  })

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede
        tag={picked ? t(current.label) : t({ es: 'Un flujo', en: 'One flow' })}
        title={picked ? t(current.note) : t(surfaces.title)}
        sub={picked ? undefined : t({ es: 'Celular, tablet, monitor de recepción o widget en el sitio de la barbería: el mismo flujo, sin reiniciarse.', en: 'Phone, tablet, front-desk monitor or a widget on the shop’s site: the same flow, never restarting.' })}
        swapKey={picked ? active : 'all'}
      />

      {/* El escenario: un solo marco que cambia de forma; adentro, la captura de esa superficie */}
      <div className="relative mt-10 flex aspect-[2000/1440] w-full max-w-[820px] items-center justify-center">
        {devices.map((d, i) => {
          const on = i === active
          return (
            <div
              key={d.kind}
              aria-hidden={!on}
              className="absolute inset-y-0 left-1/2 overflow-hidden bg-[#0b0c0e] shadow-[0_40px_90px_-40px_rgb(0_0_0/0.9),inset_0_0_0_1.5px_rgb(255_255_255/0.12)] transition-[opacity,transform] duration-700 ease-expo"
              style={{ width: FRAME_W[d.kind], borderRadius: FRAME_R[d.kind], padding: 8, opacity: on ? 1 : 0, transform: `translateX(-50%) scale(${on ? 1 : 0.92})` }}
            >
              <Image src={d.image.src} width={d.image.width} height={d.image.height} alt={t(d.image.alt)} sizes="(min-width: 820px) 820px, 100vw" className="h-full w-full object-cover object-top" style={{ borderRadius: `calc(${FRAME_R[d.kind]} - 8px)` }} />
            </div>
          )
        })}
        {/* Del escenario sale la fibra que baja hasta «IA en el proceso» */}
        <span data-fiber-from="bk-ia" className="absolute bottom-0 left-1/2 h-px w-px" />
      </div>

      <div role="tablist" aria-label={t(surfaces.title)} className="mt-6 flex flex-wrap justify-center gap-2">
        {devices.map((d, i) => (
          <button
            key={d.kind}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => {
              setActive(i)
              setPicked(true)
            }}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${i === active ? 'border-[rgb(var(--bk))] bg-[rgb(var(--bk)/0.12)] text-paper' : 'border-white/15 text-paper/60 hover:border-white/35 hover:text-paper'}`}
          >
            {t(d.label)}
          </button>
        ))}
      </div>
    </div>
  )
}
