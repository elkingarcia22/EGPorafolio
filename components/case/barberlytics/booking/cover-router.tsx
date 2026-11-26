'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { PhoneBody } from '@/components/case/kit/device'
import { useLocale, type L } from '@/lib/i18n'
import { BookingLede } from './booking-lede'
import { useAutoSteps } from './use-auto-steps'
import { usePhone } from './use-phone'

const IMG = '/cases/barberlytics'

interface Route {
  phone: string
  side: 0 | 1
  label: L
}

/** Los dos números de prueba de la demo: uno vuelve, el otro llega por primera vez */
const ROUTES: readonly Route[] = [
  { phone: '320 217 2738', side: 0, label: { es: 'Vuelve → «Arma tu cita», ya armada', en: 'Returning → “Build your appointment”, already set' } },
  { phone: '300 123 4567', side: 1, label: { es: 'Llega → «Conozcámonos», tres datos', en: 'New → “Let’s meet”, three fields' } },
]
const SIDES = [
  { src: 'booking-app-return', alt: { es: 'Quien vuelve: «Arma tu cita» con sede, servicio y barbero puestos.', en: 'Returning: “Build your appointment” with location, service and barber set.' }, name: { es: 'Quien vuelve', en: 'Returning' } },
  { src: 'booking-app-new', alt: { es: 'Quien llega: «Conozcámonos», un perfil corto.', en: 'New: “Let’s meet”, a short profile.' }, name: { es: 'Quien llega', en: 'New' } },
] as const
/** Ritmo: cada dígito, la pausa tras decidir y el cambio de número (ms) */
const TYPE_MS = 70
const DECIDED_MS = 2200
/** Dónde está el campo del celular en la captura de la portada (%) */
const FIELD = { left: 41.5, top: 34.3, width: 47.4, height: 4.4 }

/**
 * 04 · Bocetos y forma, debajo del cuaderno: del boceto a la app. En el centro,
 * la portada real; se escribe un celular y la reserva manda a cada quien por su
 * camino: el que vuelve a su cita ya armada, el que llega a un perfil corto.
 */
export function CoverRouter() {
  const { t } = useLocale()
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const [round, setRound] = useState(0)
  const [typed, setTyped] = useState(reducedMotion ? ROUTES[0].phone.length : 0)
  const route = ROUTES[round % ROUTES.length]
  const decided = typed >= route.phone.length

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = decided
      ? window.setTimeout(() => {
          setRound((r) => r + 1)
          setTyped(0)
        }, DECIDED_MS)
      : window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 500 : TYPE_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, decided, typed])

  const phone = usePhone()
  const lede = <BookingLede tag={t({ es: 'Del boceto a la app', en: 'From sketch to app' })} title={t({ es: 'La portada decide: un número, dos caminos.', en: 'The cover decides: one number, two paths.' })} sub={t({ es: 'Se escribe un celular y cada quien va por el suyo. Capturas reales con datos de prueba.', en: 'A phone number is typed and each person takes their own path. Real screens with test data.' })} />

  if (phone) {
    // En el teléfono: una sola pantalla. Se escribe el número en la portada y la
    // pantalla misma pasa al camino que le toca; debajo, la bifurcación se enciende.
    return (
      <div ref={ref} className="flex flex-col items-center">
        {lede}
        <figure className="relative mt-8 w-[62%] max-w-[240px]">
          <PhoneBody className="w-full">
            <Image src={`${IMG}/booking-app-cover.webp`} width={780} height={1688} alt={t({ es: 'Portada: «Reserva tu cita» con solo el celular.', en: 'Cover: “Book your appointment” with just a phone.' })} sizes="62vw" className="block h-auto w-full" />
            <span
              aria-hidden="true"
              className="absolute flex items-center overflow-hidden rounded-[4px] border bg-[#16130f] px-[4%] font-mono text-[11px] tabular-nums text-paper transition-[opacity,border-color] duration-300"
              style={{ left: `${FIELD.left - 4}%`, top: `${FIELD.top - 0.6}%`, width: `${FIELD.width + 6}%`, height: `${FIELD.height + 1.2}%`, borderColor: decided ? 'rgb(var(--bk))' : 'rgb(var(--bk) / 0.5)', opacity: decided ? 0 : 1 }}
            >
              {route.phone.slice(0, typed)}
              {!decided && <span className="bk-caret ml-px inline-block h-[1.1em] w-px bg-paper" />}
            </span>
            {SIDES.map((s, side) => (
              <Image key={s.src} src={`${IMG}/${s.src}.webp`} fill sizes="62vw" alt={t(s.alt)} className="object-cover object-top transition-[opacity,transform] duration-500 ease-expo" style={{ opacity: decided && route.side === side ? 1 : 0, transform: `translateX(${decided && route.side === side ? 0 : side ? 12 : -12}%)` }} />
            ))}
          </PhoneBody>
        </figure>

        {/* La bifurcación: del número a cada camino; se enciende el que toma */}
        <div className="mt-7 grid w-full max-w-[340px] grid-cols-[1fr_auto_1fr] items-center">
          {[0, 1].map((side) => {
            const on = decided && route.side === side
            const chip = (
              <span key={`chip-${side}`} className={`rounded-full border px-3 py-1.5 text-center text-[13px] transition-colors duration-300 ${side ? 'order-3' : 'order-1'} ${on ? 'border-[rgb(var(--bk))] bg-[rgb(var(--bk)/0.12)] text-paper' : 'border-white/12 text-paper/60'}`}>
                {t(SIDES[side].name)}
              </span>
            )
            return chip
          })}
          <span className="relative order-2 mx-3 grid h-10 w-24 place-items-center" aria-hidden="true">
            {[0, 1].map((side) => {
              const on = decided && route.side === side
              return <span key={side} className={`absolute top-1/2 h-[2px] w-1/2 rounded-full transition-[opacity,box-shadow] duration-500 ${side ? 'right-0' : 'left-0'}`} style={{ background: on ? 'rgb(var(--bk))' : 'rgb(255 255 255 / 0.12)', boxShadow: on ? '0 0 8px rgb(var(--bk) / 0.8)' : 'none' }} />
            })}
            <span className="relative h-3.5 w-3.5 rounded-full border border-white bg-[rgb(var(--bk))] shadow-[0_0_0_6px_rgb(var(--bk)/0.18),0_0_12px_rgb(var(--bk)/0.7)]" />
          </span>
        </div>
        <p key={`${round}-${decided}`} className="bk-fade mt-4 min-h-[2.6em] max-w-[30ch] text-balance text-center text-[14px] leading-snug text-paper/70">
          {decided ? t(route.label) : `${t({ es: 'Solo el celular', en: 'Just the phone' })}: ${route.phone.slice(0, typed)}`}
        </p>
      </div>
    )
  }

  return (
    <div ref={ref} className="flex flex-col items-center">
      {lede}

      <div className="relative mt-10 grid w-full max-w-[860px] grid-cols-[1fr_1.15fr_1fr] items-center gap-[clamp(0.75rem,4vw,3.5rem)]">
        {/* Las dos fibras: de la portada a cada camino; se enciende la que toma el número */}
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-24 w-full -translate-y-1/2 overflow-visible">
          {[0, 1].map((side) => {
            const on = decided && route.side === side
            const d = side === 0 ? 'M50 20 C40 20 30 20 16 20' : 'M50 20 C60 20 70 20 84 20'
            return (
              <g key={side}>
                <path d={d} fill="none" stroke="white" strokeOpacity={0.1} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                <path d={d} fill="none" stroke="rgb(var(--bk))" strokeWidth={2} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0 : 1} style={{ transition: on ? 'stroke-dashoffset .5s cubic-bezier(.5,0,.3,1)' : 'stroke-dashoffset .3s', filter: 'drop-shadow(0 0 4px rgb(var(--bk) / 0.7))' }} />
              </g>
            )
          })}
        </svg>

        {SIDES.map((s, side) => {
          const on = decided && route.side === side
          return (
            <figure key={s.src} className={`relative z-10 transition-[opacity,transform] duration-500 ease-expo ${side === 0 ? 'order-first' : 'order-last'}`} style={{ opacity: on ? 1 : 0.35, transform: `scale(${on ? 1 : 0.92})` }}>
              <PhoneBody className="mx-auto w-full max-w-[220px]">
                <Image src={`${IMG}/${s.src}.webp`} width={780} height={1688} alt={t(s.alt)} sizes="(min-width: 768px) 220px, 28vw" className="block h-auto w-full" />
              </PhoneBody>
              <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60">{t(s.name)}</figcaption>
            </figure>
          )
        })}

        {/* La portada real, con el celular que se escribe encima de su campo */}
        <figure className="relative z-10 order-2">
          <PhoneBody className="mx-auto w-full max-w-[250px]">
            <Image src={`${IMG}/booking-app-cover.webp`} width={780} height={1688} alt={t({ es: 'Portada: «Reserva tu cita» con solo el celular.', en: 'Cover: “Book your appointment” with just a phone.' })} sizes="(min-width: 768px) 250px, 32vw" className="block h-auto w-full" />
            <span
              aria-hidden="true"
              className="absolute flex items-center overflow-hidden rounded-[4px] border bg-[#16130f] px-[3%] font-mono text-[clamp(7px,1.4vw,12px)] tabular-nums text-paper transition-colors duration-300"
              style={{ left: `${FIELD.left}%`, top: `${FIELD.top}%`, width: `${FIELD.width}%`, height: `${FIELD.height}%`, borderColor: decided ? 'rgb(var(--bk))' : 'rgb(var(--bk) / 0.5)' }}
            >
              {route.phone.slice(0, typed)}
              {!decided && <span className="bk-caret ml-px inline-block h-[1.1em] w-px bg-paper" />}
            </span>
          </PhoneBody>
          <figcaption key={`${round}-${decided}`} className="bk-fade mt-3 min-h-[2.5em] text-balance text-center text-[11px] leading-snug text-paper/70">
            {decided ? t(route.label) : t({ es: 'Solo el celular', en: 'Just the phone' })}
          </figcaption>
        </figure>
      </div>

    </div>
  )
}
