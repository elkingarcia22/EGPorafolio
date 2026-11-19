import type { L } from '@/lib/i18n'
import type { CaseImage, ChapterIntro, TitledText } from './types'

const IMG = '/cases/barberlytics'
const shot = (name: string, width: number, height: number, alt: L, caption?: L): CaseImage => ({
  src: `${IMG}/${name}.webp`,
  width,
  height,
  alt,
  caption,
})

export const BOOKING = {
  title: { es: 'Reserva · el booking flow', en: 'Booking · the client flow' },
  intro: {
    kicker: { es: '¿Cómo se reserva «lo de siempre» en un toque?', en: 'How do you book “the usual” in one tap?' },
    lead: {
      es: 'La reserva es la cara pública del producto: habla con el cliente de la barbería, no con quien la administra. Antes de diseñar comparé quince productos y encontré dónde ya éramos fuertes, qué era estándar y nos faltaba, y qué valía la pena copiar.',
      en: 'Booking is the product’s public face: it talks to the shop’s client, not to whoever runs it. Before designing I compared fifteen products and found where we were already strong, what was standard and missing, and what was worth copying.',
    },
    stats: [
      { value: '15', label: { es: 'productos comparados', en: 'products compared' } },
      { value: '4', label: { es: 'versiones de la experiencia', en: 'versions of the experience' } },
      { value: '4', label: { es: 'superficies: celular, tablet, monitor, widget', en: 'surfaces: phone, tablet, monitor, widget' } },
      { value: '9', label: { es: 'días para cerrar casi dos fases', en: 'days to close almost two phases' } },
    ],
  } satisfies ChapterIntro,
  competitors: [
    'Booksy', 'Fresha', 'Squire', 'theCut', 'Square Appointments', 'Vagaro', 'Boulevard', 'GlossGenius',
    'Treatwell', 'Mindbody', 'Phorest', 'Timely', 'AgendaPro', 'Reservo', 'Reserve with Google',
  ],
  findings: [
    {
      title: { es: 'Donde ya éramos fuertes', en: 'Where we were strong' },
      body: {
        es: 'Proponer la próxima visita según la frecuencia del cliente; si un día no tiene horas, ofrecer barberos con habilidades parecidas —ninguno de los quince lo hace a ese nivel—; varias citas para otras personas en una sola reserva.',
        en: 'Proposing the next visit from the client’s frequency; when a day has no slots, offering barbers with similar skills —none of the fifteen does it at that level—; several appointments for other people in one booking.',
      },
    },
    {
      title: { es: 'Lo estándar que faltaba', en: 'Standard but missing' },
      body: {
        es: 'Anticipo condicional contra inasistencias, recordatorios por WhatsApp con «Confirmo / Reprogramar», reseñas solo de citas cumplidas y pagos locales como PSE y Nequi.',
        en: 'Conditional deposits against no-shows, WhatsApp reminders with “Confirm / Reschedule”, reviews only from completed visits and local payments like PSE and Nequi.',
      },
    },
    {
      title: { es: 'Riesgos en lo nuestro', en: 'Risks in our own flow' },
      body: {
        es: 'El celular revelaba el perfil a cualquiera, la casilla de marketing venía marcada y no había límite de intentos. Se corrigieron antes que cualquier pantalla nueva.',
        en: 'The phone number exposed the profile to anyone, the marketing box came pre-checked and attempts were unlimited. They were fixed before any new screen.',
      },
    },
  ] satisfies TitledText[],
  /** Cada versión parte de una pregunta distinta; comparten motor y cobro */
  versions: [
    { name: { es: 'Paso a paso', en: 'Step by step' }, question: { es: '¿Quién eres?', en: 'Who are you?' }, for: { es: 'Quien vuelve por «lo de siempre»', en: 'Returning for “the usual”' } },
    { name: { es: 'Agenda en lista', en: 'List agenda' }, question: { es: 'Arma tu cita', en: 'Build your appointment' }, for: { es: 'Quien busca hueco pronto', en: 'Looking for a slot soon' } },
    { name: { es: 'Según el cliente', en: 'By client' }, question: { es: 'La portada decide con el celular', en: 'The cover decides from the phone' }, for: { es: 'Todos · la versión por defecto', en: 'Everyone · the default' } },
    { name: { es: 'Clipper', en: 'Clipper' }, question: { es: 'Dime qué necesitas', en: 'Tell me what you need' }, for: { es: 'Quien prefiere escribir o hablar', en: 'Prefers to type or talk' } },
  ] satisfies { name: L; question: L; for: L }[],
  versionsNote: {
    es: '«No son pieles de lo mismo: cada una parte de una pregunta distinta.» Las cuatro comparten el mismo motor y el mismo cobro, así que precios, cupones y lealtad salen iguales en todas.',
    en: '“They aren’t skins of the same thing: each one starts from a different question.” All four share one engine and one checkout, so prices, coupons and loyalty come out the same everywhere.',
  },
  flow: [
    shot('booking-cover', 390, 844, { es: 'Portada: «Reserva tu cita» con el celular.', en: 'Cover: “Book your appointment” with a phone number.' }, { es: '1 · El celular decide', en: '1 · The phone decides' }),
    shot('booking-return', 780, 1688, { es: 'Cliente que vuelve: «Arma tu cita» con sede, servicio y barbero ya elegidos, y horas del día.', en: 'Returning client: “Build your appointment” with location, service and barber preselected, and today’s slots.' }, { es: '2a · Quien vuelve: todo listo', en: '2a · Returning: all set' }),
    shot('booking-new', 780, 1688, { es: 'Cliente nuevo: «Conozcámonos», un perfil corto con el consentimiento sin marcar.', en: 'New client: “Let’s meet”, a short profile with consent unchecked.' }, { es: '2b · Quien llega: conozcámonos', en: '2b · New: let’s meet' }),
  ],
  details: [
    { title: { es: '«Te toca el…»', en: '“You’re due on…”' }, body: { es: 'Fecha = última visita + su frecuencia; hora = la mediana de sus citas; su barbero primero.', en: 'Date = last visit + their frequency; time = the median of their visits; their barber first.' } },
    { title: { es: 'Día sin horas', en: 'Day with no slots' }, body: { es: 'Otros barberos que hacen lo pedido, comparten una habilidad y tienen hueco.', en: 'Other barbers who do the service, share a skill and have a slot.' } },
    { title: { es: 'Lista de espera', en: 'Waitlist' }, body: { es: 'Por franja; al liberarse una hora se ofrece a los 3 primeros y gana el primero.', en: 'By time band; a freed slot goes to the first 3 and the first one wins.' } },
    { title: { es: 'Una visita en partes', en: 'A visit in parts' }, body: { es: 'Corte con uno, barba con otro; una misma persona nunca queda en dos sillas.', en: 'Cut with one, beard with another; nobody ends up in two chairs.' } },
  ] satisfies TitledText[],
  surfaces: [
    shot('booking-tablet', 1600, 1000, { es: 'Vista previa en tablet.', en: 'Tablet preview.' }, { es: 'Tablet', en: 'Tablet' }),
    shot('booking-monitor', 1600, 1000, { es: 'Vista previa en monitor de recepción.', en: 'Front-desk monitor preview.' }, { es: 'Monitor', en: 'Monitor' }),
    shot('booking-widget', 1600, 1000, { es: 'Widget dentro del sitio de una barbería de ejemplo.', en: 'Widget inside a sample barbershop site.' }, { es: 'Widget', en: 'Widget' }),
  ],
  surfacesNote: {
    es: 'El mismo flujo se muda de marco sin reiniciarse: celular, tablet, monitor de recepción o widget en el sitio de la barbería. En español e inglés, con teclado y movimiento reducido.',
    en: 'The same flow moves between frames without restarting: phone, tablet, front-desk monitor or a widget on the shop’s site. In Spanish and English, with keyboard and reduced motion support.',
  },
  pending: {
    es: 'Lo que falta ya no es de pantalla: el pago es simulado, los mensajes quedan en una cola que nadie envía y Clipper, en la reserva, funciona con reglas, sin modelo de lenguaje.',
    en: 'What’s missing is no longer UI: payment is simulated, messages sit in a queue nobody sends, and Clipper in booking runs on rules, without a language model.',
  },
  demo: {
    url: 'https://booking-flow-alpha.vercel.app/reservar?embed=1',
    hint: {
      es: 'Prueba como cliente que vuelve: celular 320 217 2738 y código 246810.',
      en: 'Try it as a returning client: phone 320 217 2738 and code 246810.',
    },
  },
}
