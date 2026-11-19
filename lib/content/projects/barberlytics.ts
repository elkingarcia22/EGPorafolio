import type { Project } from './types'

/**
 * Ficha de Barberlytics para el listado y la base de datos. El caso completo
 * (real) vive en lib/content/cases/barberlytics y se muestra con BarberlyticsCase;
 * los campos de proceso de abajo quedan solo para cumplir el tipo Project.
 */
export const barberlytics: Project = {
  slug: 'barberlytics',
  frequency: '02.23',
  title: { es: 'La barbería que se agenda sola', en: 'The barbershop that books itself' },
  client: 'Barberlytics',
  year: '2022 — 2026',
  accent: '232 140 48',
  mock: 'mobile',
  tagline: {
    es: 'Software para barberías de punta a punta: sistema de diseño de 218 componentes, reserva en cuatro versiones, plataforma por roles y Clipper, su IA.',
    en: 'End-to-end barbershop software: a 218-component design system, booking in four versions, a role-based platform and Clipper, its AI.',
  },
  role: { es: 'Lead UX/UI · diseño y construcción con IA', en: 'UX/UI Lead · design and build with AI' },
  team: { es: 'Equipo de Barberlytics', en: 'Barberlytics team' },
  duration: { es: '2022 — 2026', en: '2022 — 2026' },
  tools: ['Figma', 'Claude Code', 'React', 'TypeScript', 'Vercel'],
  problem: {
    context: {
      es: 'Las barberías gestionaban citas por chat y libreta. Las sillas vacías y los clientes que no llegaban eran pérdidas invisibles.',
      en: 'Barbershops handled bookings through chat and notebooks. Empty chairs and no-shows were invisible losses.',
    },
    quotes: [
      { text: { es: '“Me paso el día contestando mensajes en vez de cortar.”', en: '“I spend the day answering messages instead of cutting hair.”' }, who: { es: 'Dueño de barbería', en: 'Shop owner' } },
      { text: { es: '“Si alguien cancela, esa hora se pierde.”', en: '“If someone cancels, that hour is gone.”' }, who: { es: 'Barbero', en: 'Barber' } },
    ],
    stats: [
      { value: '22%', label: { es: 'citas perdidas por no-show', en: 'appointments lost to no-shows' } },
      { value: '2 h/día', label: { es: 'en mensajes de agenda', en: 'spent on booking messages' } },
      { value: '0', label: { es: 'datos para decidir', en: 'data to make decisions' } },
    ],
  },
  research: {
    method: {
      es: 'Observación en 6 barberías, shadowing de un día completo y entrevistas a clientes frecuentes.',
      en: 'Observation in 6 barbershops, full-day shadowing and interviews with regular clients.',
    },
    clusters: [
      {
        title: { es: 'Tiempo', en: 'Time' },
        notes: [
          { es: 'Chat todo el día', en: 'Chatting all day' },
          { es: 'Doble reserva', en: 'Double booking' },
          { es: 'Sin recordatorios', en: 'No reminders' },
        ],
      },
      {
        title: { es: 'Dinero', en: 'Money' },
        notes: [
          { es: 'Pago en efectivo', en: 'Cash only' },
          { es: 'Comisiones a mano', en: 'Manual commissions' },
        ],
      },
      {
        title: { es: 'Relación', en: 'Relationship' },
        notes: [
          { es: 'Cliente fiel = barbero', en: 'Loyal client = barber' },
          { es: 'Historial en la memoria', en: 'History in memory' },
          { es: 'Fotos del corte', en: 'Haircut photos' },
        ],
      },
    ],
    insights: [
      { es: 'El cliente es fiel al barbero, no a la barbería.', en: 'Clients are loyal to the barber, not the shop.' },
      { es: 'La agenda es el corazón: todo lo demás cuelga de ella.', en: 'The schedule is the heart: everything else hangs off it.' },
    ],
  },
  idea: {
    hmw: {
      es: '¿Cómo podríamos llenar cada silla sin que el dueño toque el teléfono?',
      en: 'How might we fill every chair without the owner touching the phone?',
    },
    principles: [
      { title: { es: 'Agenda viva', en: 'Living schedule' }, body: { es: 'Huecos visibles y accionables al instante.', en: 'Gaps visible and actionable instantly.' } },
      { title: { es: 'Reservar en 3 toques', en: 'Book in 3 taps' }, body: { es: 'Barbero, servicio, hora. Nada más.', en: 'Barber, service, time. Nothing else.' } },
      { title: { es: 'IA de negocio', en: 'Business AI' }, body: { es: 'Sugiere promociones para las horas valle.', en: 'Suggests promos for slow hours.' } },
    ],
  },
  sketches: {
    caption: { es: 'Bocetos en la barbería misma, probados con papel en la mano del cliente.', en: 'Sketches made inside the shop, tested on paper in the client’s hand.' },
    notes: [
      { es: 'foto del barbero', en: 'barber photo' },
      { es: '3 toques', en: '3 taps' },
      { es: 'hueco = promo', en: 'gap = promo' },
    ],
  },
  form: {
    caption: { es: 'Del wireframe al producto: la reserva quedó en tres pasos.', en: 'From wireframe to product: booking ended up in three steps.' },
  },
  ai: {
    intro: { es: 'La IA vive dentro del producto, no solo en el proceso de diseño.', en: 'AI lives inside the product, not just in the design process.' },
    steps: [
      { tool: 'Claude', prompt: { es: 'Con el historial de citas, detecta horas valle y propone una promoción por barbero.', en: 'Using booking history, detect slow hours and propose a promo per barber.' }, output: { es: 'Motor de sugerencias semanales', en: 'Weekly suggestion engine' } },
      { tool: 'n8n', prompt: { es: 'Automatiza recordatorios 24 h y 2 h antes por WhatsApp.', en: 'Automate WhatsApp reminders 24 h and 2 h before.' }, output: { es: 'Flujo de recordatorios sin código', en: 'No-code reminder flow' } },
      { tool: 'Cursor', prompt: { es: 'Prototipo del flujo de reserva con datos de una barbería real.', en: 'Booking flow prototype with a real shop’s data.' }, output: { es: 'Validado con 20 clientes', en: 'Validated with 20 clients' } },
    ],
  },
  results: {
    metrics: [
      { value: 41, prefix: '−', suffix: '%', label: { es: 'no-shows', en: 'no-shows' } },
      { value: 18, prefix: '+', suffix: '%', label: { es: 'ocupación de sillas', en: 'chair occupancy' } },
      { value: 90, suffix: ' s', label: { es: 'para reservar', en: 'to book' } },
    ],
    learnings: [
      { es: 'Diseñar en el lugar donde ocurre el problema.', en: 'Design where the problem happens.' },
      { es: 'La IA más útil es la que no se nota.', en: 'The most useful AI is the one you don’t notice.' },
    ],
  },
}
