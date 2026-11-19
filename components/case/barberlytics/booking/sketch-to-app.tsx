'use client'

import Image from 'next/image'
import { useLocale, type L } from '@/lib/i18n'
import { PhoneBody } from '@/components/case/kit/device'

interface Step {
  image: string
  alt: L
  title: L
  sketch: L
  app: L
}

/** Cada decisión del tablero y la pantalla real en la que terminó (capturas de la app, datos de prueba). */
const STEPS: readonly Step[] = [
  {
    image: 'booking-app-cover',
    alt: { es: 'Portada de la reserva: «Reserva tu cita» con solo el celular.', en: 'Booking cover: “Book your appointment” with just a phone number.' },
    title: { es: 'La portada decide', en: 'The cover decides' },
    sketch: { es: 'Un campo y nada más', en: 'One field, nothing else' },
    app: { es: 'Solo el celular; las sedes y «Mis citas» quedan a mano', en: 'Just the phone; locations and “My visits” at hand' },
  },
  {
    image: 'booking-app-return',
    alt: { es: 'Cliente que vuelve: «Arma tu cita» con sede, servicio y barbero puestos.', en: 'Returning client: “Build your appointment” with location, service and barber set.' },
    title: { es: 'Quien vuelve', en: 'Returning' },
    sketch: { es: 'Lo de siempre, ya puesto', en: 'The usual, already set' },
    app: { es: 'Sede, servicio y barbero de sus visitas; abajo, las horas del día', en: 'Location, service and barber from past visits; slots right below' },
  },
  {
    image: 'booking-app-new',
    alt: { es: 'Cliente nuevo: «Conozcámonos», un perfil corto y el consentimiento sin marcar.', en: 'New client: “Let’s meet”, a short profile and consent left unchecked.' },
    title: { es: 'Quien llega', en: 'New client' },
    sketch: { es: 'Perfil corto, no formulario', en: 'Short profile, not a form' },
    app: { es: 'Tres datos y las promociones sin marcar: no son condición para reservar', en: 'Three fields and promotions unchecked: not a condition to book' },
  },
  {
    image: 'booking-app-clipper',
    alt: { es: 'Clipper: «¿Qué cita te agendo?» con atajos como «Lo de siempre» y «Lo antes posible».', en: 'Clipper: “What should I book for you?” with shortcuts like “The usual” and “ASAP”.' },
    title: { es: 'Clipper', en: 'Clipper' },
    sketch: { es: 'Dime qué necesitas', en: 'Tell me what you need' },
    app: { es: 'Por escrito o por voz, con los atajos de siempre numerados', en: 'Typed or spoken, with the usual shortcuts numbered' },
  },
]

/** Del tablero a la app: los cuatro caminos bocetados, como quedaron en la reserva real. */
export function SketchToApp() {
  const { t } = useLocale()
  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-fg/15 pb-4">
        <h3 data-reveal="mask" className="text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t({ es: 'Del tablero a la app', en: 'From the board to the app' })}</h3>
        <span data-reveal className="mono-label opacity-50">{t({ es: 'Capturas reales · datos de prueba', en: 'Real screens · test data' })}</span>
      </div>
      <ol className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.image} data-reveal className={`group ${i % 2 ? 'lg:translate-y-14' : ''}`}>
            <PhoneBody className="mx-auto w-full max-w-[250px] transition-transform duration-700 ease-expo group-hover:-translate-y-2">
              <Image src={`/cases/barberlytics/${s.image}.webp`} width={780} height={1688} alt={t(s.alt)} sizes="(min-width: 1024px) 250px, 45vw" className="block h-auto w-full" />
            </PhoneBody>
            <div className="mt-5">
              <span className="mono-label text-signal">0{i + 1}</span>
              <p className="mt-1 text-xl font-light leading-tight">{t(s.title)}</p>
              <p className="mt-3 text-[13px] leading-snug">
                <span className="mono-label mr-1.5 opacity-45">{t({ es: 'Boceto', en: 'Sketch' })}</span>«{t(s.sketch)}»
              </p>
              <p className="mt-1.5 text-[13px] leading-snug opacity-70">
                <span className="mono-label mr-1.5 opacity-60">{t({ es: 'App', en: 'App' })}</span>
                {t(s.app)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
