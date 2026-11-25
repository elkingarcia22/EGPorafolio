import type { L } from '@/lib/i18n'

export interface SketchStep {
  image: string
  alt: L
  title: L
  sketch: L
  app: L
}

/** Cada decisión del tablero y la pantalla real en la que terminó (capturas de la app, datos de prueba). */
export const SKETCH_STEPS: readonly SketchStep[] = [
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
