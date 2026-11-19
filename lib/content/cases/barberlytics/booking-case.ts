import type { L } from '@/lib/i18n'
import type { Callout } from '@/components/case/kit/device'
import type { CaseImage, CaseStat, TitledText } from './types'

const IMG = '/cases/barberlytics'
const img = (name: string, width: number, height: number, alt: L): CaseImage => ({ src: `${IMG}/${name}.webp`, width, height, alt })

/** Caso «Reserva»: la estructura de los casos (puntos → impacto) más la demo. */
export const BOOKING_CASE = {
  slug: 'reserva',
  index: '02',
  title: { es: 'Reserva en línea', en: 'Online booking' },
  eyebrow: { es: 'Booking flow', en: 'Booking flow' },
  tagline: {
    es: 'Que quien vuelve reserve «lo de siempre» en un toque, y que quien llega por primera vez no sienta que llena un formulario.',
    en: 'Let returning clients book “the usual” in one tap, and let first-timers never feel they’re filling in a form.',
  },
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Investigación, UX/UI y construcción', en: 'Research, UX/UI and build' } },
    { label: { es: 'Superficies', en: 'Surfaces' }, value: { es: 'Celular, tablet, monitor y widget', en: 'Phone, tablet, monitor and widget' } },
    { label: { es: 'Idiomas', en: 'Languages' }, value: { es: 'Español e inglés', en: 'Spanish and English' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026', en: '2026' } },
  ] satisfies { label: L; value: L }[],
  tools: ['Claude Code', 'React', 'TypeScript', 'MSW', 'Gemini TTS'],
  cover: img('booking-tablet', 1600, 1000, {
    es: 'La reserva de Barberlytics en la vista previa de tablet: «Reserva tu cita» con el celular.',
    en: 'Barberlytics booking in the tablet preview: “Book your appointment” with a phone number.',
  }),

  /** 01 · Los puntos */
  dots: {
    kicker: { es: 'Una barbería vive de lo que se repite y de lo que se libera a última hora.', en: 'A barbershop lives on what repeats and on what frees up at the last minute.' },
    lead: {
      es: 'La reserva es la cara pública del producto: no habla con quien administra la barbería, habla con su cliente. Y ese cliente casi siempre quiere lo mismo —su corte, con su barbero, cada tantas semanas— o la primera hora libre. Lo que había no estaba hecho para ninguno de los dos.',
      en: 'Booking is the product’s public face: it doesn’t talk to whoever runs the shop, it talks to the client. And that client almost always wants the same thing —their cut, with their barber, every few weeks— or the first free slot. What existed wasn’t built for either.',
    },
    seen: [
      { title: { es: 'El caso dominante es «el corte de siempre»', en: 'The dominant case is “the usual cut”' }, body: { es: 'Mismo servicio, mismo barbero, a un ritmo que se repite. Reservarlo no debería pedir decidir nada de nuevo.', en: 'Same service, same barber, on a repeating rhythm. Booking it shouldn’t ask to decide anything again.' } },
      { title: { es: 'La cultura es de hueco pronto', en: 'It’s a “next free slot” culture' }, body: { es: 'Quien llega por primera vez no busca un barbero: busca la hora más cercana.', en: 'First-timers aren’t looking for a barber: they want the nearest time.' } },
      { title: { es: 'Lo que faltaba no era otra pantalla', en: 'What was missing wasn’t another screen' }, body: { es: 'Inasistencias sin protección, recordatorios que solo se prometían en el texto y un perfil que el celular revelaba a cualquiera.', en: 'No-shows without protection, reminders only promised in the copy, and a profile anyone could reveal with a phone number.' } },
    ] satisfies TitledText[],
    stats: [
      { value: '15', label: { es: 'productos comparados', en: 'products compared' } },
      { value: '7', label: { es: 'riesgos en el flujo propio', en: 'risks in our own flow' } },
      { value: '0', label: { es: 'recordatorios que se enviaran de verdad', en: 'reminders actually sent' } },
      { value: '2', label: { es: 'clientes distintos: el que vuelve y el que llega', en: 'different clients: returning and new' } },
    ] satisfies CaseStat[],
  },

  /** 02 · Patrones */
  patterns: {
    lead: {
      es: 'Comparé quince productos de reserva con sus páginas y centros de ayuda, marcando lo no confirmado. Al agrupar lo encontrado salieron cuatro columnas: lo que ya hacíamos mejor que nadie, lo estándar que nos faltaba, lo que valía la pena copiar y lo que era un riesgo en lo nuestro.',
      en: 'I compared fifteen booking products through their pages and help centers, flagging anything unconfirmed. Clustering the findings gave four columns: what we already did better than anyone, what was standard and missing, what was worth copying, and what was a risk in our own flow.',
    },
    competitors: ['Booksy', 'Fresha', 'Squire', 'theCut', 'Square', 'Vagaro', 'Boulevard', 'GlossGenius', 'Treatwell', 'Mindbody', 'Phorest', 'Timely', 'AgendaPro', 'Reservo', 'Reserve with Google'],
    columns: [
      {
        title: { es: 'Fuertes', en: 'Strong' },
        color: 'green',
        notes: [
          { es: 'Proponer la próxima visita según su frecuencia', en: 'Propose the next visit from their frequency' },
          { es: 'Día sin horas → barberos con habilidades parecidas', en: 'Day with no slots → barbers with similar skills' },
          { es: 'Varias citas, para otras personas («Tu gente»)', en: 'Several appointments, for other people (“Your people”)' },
          { es: 'Lista de espera por franja', en: 'Waitlist by time band' },
          { es: 'Pagar en la barbería, de primera', en: 'Pay at the shop, first-class' },
        ],
      },
      {
        title: { es: 'Estándar que faltaba', en: 'Standard, missing' },
        color: 'pink',
        notes: [
          { es: 'Anticipo contra inasistencias (condicional)', en: 'Deposit against no-shows (conditional)' },
          { es: 'Recordatorios por WhatsApp: «Confirmo / Reprogramar»', en: 'WhatsApp reminders: “Confirm / Reschedule”' },
          { es: 'Reseñas solo de citas cumplidas', en: 'Reviews only from completed visits' },
          { es: 'Pagos locales: PSE y Nequi', en: 'Local payments: PSE and Nequi' },
          { es: 'Regalos, paquetes y membresías', en: 'Gifts, packages and memberships' },
        ],
      },
      {
        title: { es: 'Para copiar', en: 'Worth copying' },
        color: 'blue',
        notes: [
          { es: 'Cita recurrente · Squire', en: 'Recurring appointment · Squire' },
          { es: '«Lo antes posible» · theCut', en: '“As soon as possible” · theCut' },
          { es: 'Horas que no dejan huecos · Boulevard', en: 'Slots that leave no gaps · Boulevard' },
          { es: 'Foto de referencia del corte · Vagaro', en: 'Reference photo of the cut · Vagaro' },
          { es: 'Asistente por WhatsApp · AgendaPro', en: 'WhatsApp assistant · AgendaPro' },
        ],
      },
      {
        title: { es: 'Riesgos propios', en: 'Our own risks' },
        color: 'orange',
        notes: [
          { es: 'El celular revelaba el perfil a cualquiera', en: 'The phone number revealed the profile to anyone' },
          { es: 'Casilla de marketing ya marcada', en: 'Marketing box pre-checked' },
          { es: 'Sin límite de intentos', en: 'No attempt limit' },
          { es: 'Sin zona horaria', en: 'No time zone' },
        ],
      },
    ],
    insights: [
      { es: 'Nuestra ventaja estaba en conocer al cliente que vuelve. Había que llevarla a la primera pantalla.', en: 'Our edge was knowing the returning client. It had to reach the very first screen.' },
      { es: 'El nuevo y el que vuelve necesitan caminos distintos, pero con un solo motor detrás.', en: 'New and returning clients need different paths, with one engine behind them.' },
      { es: 'Antes de cualquier pantalla nueva había que cerrar los riesgos: privacidad, consentimiento e intentos.', en: 'Before any new screen, the risks had to close: privacy, consent and attempts.' },
    ] satisfies L[],
  },

  /** 03 · La idea */
  idea: {
    hmw: {
      es: '¿Cómo podríamos hacer que reservar «lo de siempre» tome un toque, sin que quien llega por primera vez sienta un formulario?',
      en: 'How might we make booking “the usual” take one tap, without first-timers feeling a form?',
    },
    principles: [
      { title: { es: 'La portada decide', en: 'The cover decides' }, body: { es: 'Con solo el celular ya sé si vuelves o si llegas: cada uno entra por su camino.', en: 'From the phone number alone I know if you’re back or new: each takes their own path.' } },
      { title: { es: 'No son pieles de lo mismo', en: 'Not skins of the same thing' }, body: { es: 'Cada versión parte de una pregunta distinta, pero todas comparten motor y cobro.', en: 'Each version starts from a different question, but all share one engine and checkout.' } },
      { title: { es: 'Un solo lenguaje de elegir', en: 'One language for choosing' }, body: { es: 'Círculo para una opción, casilla para varias. En toda la reserva.', en: 'A circle for one, a checkbox for many. Across the whole flow.' } },
      { title: { es: 'Identidad cuando hace falta', en: 'Identity when it matters' }, body: { es: 'El código llega antes de cobrar, no antes de mirar horas.', en: 'The code comes before paying, not before browsing slots.' } },
    ] satisfies TitledText[],
  },

  /** 05 · Forma: capturas reales con lo importante destacado */
  form: {
    lead: {
      es: 'Las tres pantallas que cuentan la idea. Pasa por los números para ver cada decisión.',
      en: 'The three screens that tell the idea. Hover the numbers to see each decision.',
    },
    screens: [
      {
        title: { es: 'Quien vuelve: todo listo', en: 'Returning: all set' },
        image: img('booking-return', 780, 1688, { es: 'Cliente que vuelve: «Arma tu cita» con sede, servicio y barbero ya elegidos.', en: 'Returning client: “Build your appointment” with location, service and barber preselected.' }),
        callouts: [
          { x: 52, y: 1, w: 37, h: 4.5, title: { es: 'Clipper, siempre a mano', en: 'Clipper, always at hand' }, body: { es: 'Quien prefiere escribir o hablar cambia a la conversación sin perder lo elegido.', en: 'Anyone who’d rather type or talk switches to the chat without losing choices.' } },
          { x: 4, y: 34, w: 91, h: 29, title: { es: '«Lo de siempre», ya puesto', en: '“The usual”, already set' }, body: { es: 'Sede, servicio y barbero salen de sus visitas: solo confirma o cambia.', en: 'Location, service and barber come from their visits: just confirm or change.' } },
          { x: 4, y: 70, w: 93, h: 9.5, title: { es: 'Días a un toque', en: 'Days one tap away' }, body: { es: 'Una tira de días en vez de un calendario: la cultura es de hueco pronto.', en: 'A strip of days instead of a calendar: it’s a next-free-slot culture.' } },
          { x: 4, y: 82, w: 66, h: 12, title: { es: 'Horas con caras', en: 'Slots with faces' }, body: { es: 'Por franja, con quién puede atender en cada hora.', en: 'By time band, with who can take each slot.' } },
        ] satisfies Callout[],
      },
      {
        title: { es: 'Quien llega: conozcámonos', en: 'New: let’s meet' },
        image: img('booking-new', 780, 1688, { es: 'Cliente nuevo: «Conozcámonos», perfil corto y consentimiento sin marcar.', en: 'New client: “Let’s meet”, a short profile and unchecked consent.' }),
        callouts: [
          { x: 3, y: 9, w: 94, h: 9, title: { es: 'Un tono, no un trámite', en: 'A tone, not paperwork' }, body: { es: '«La próxima vez solo pondrás tu celular»: se explica por qué se pide.', en: '“Next time you’ll just enter your phone”: it says why it asks.' } },
          { x: 3, y: 21, w: 95, h: 42, title: { es: 'Solo lo necesario', en: 'Only what’s needed' }, body: { es: 'Nombre, apellido, correo para el recibo y el celular que ya escribió.', en: 'First name, last name, email for the receipt and the phone already typed.' } },
          { x: 3, y: 66, w: 95, h: 17, title: { es: 'Consentimiento sin marcar', en: 'Consent left unchecked' }, body: { es: 'Era uno de los riesgos: ahora la casilla de promociones llega vacía y con fecha.', en: 'It was one of the risks: the promotions box now arrives empty and dated.' } },
        ] satisfies Callout[],
      },
      {
        title: { es: 'Clipper: dime qué necesitas', en: 'Clipper: tell me what you need' },
        image: img('clipper-thread', 780, 1688, { es: 'Clipper saluda a Marcela, avisa que Andrés no tiene hueco y propone horas.', en: 'Clipper greets Marcela, says Andrés has no slot and proposes times.' }),
        callouts: [
          { x: 36, y: 21, w: 31, h: 4.5, title: { es: 'Te reconoce', en: 'It knows you' }, body: { es: 'Con el celular sabe quién es y la saluda por su nombre.', en: 'From the phone it knows who it is and greets her by name.' } },
          { x: 36, y: 27, w: 61, h: 10, title: { es: 'Entiende la frase', en: 'It understands the sentence' }, body: { es: '«Corte mañana a las 5 con Andrés»: si no hay hueco, lo dice y propone lo más cercano.', en: '“Haircut tomorrow at 5 with Andrés”: if there’s no slot, it says so and proposes the closest.' } },
          { x: 35, y: 39, w: 63, h: 45, title: { es: 'Opciones numeradas', en: 'Numbered options' }, body: { es: 'Se contesta tocando, con el número o escribiendo. Primero su barbero, luego otros a la misma hora.', en: 'Answer by tapping, typing the number or writing. Their barber first, then others at the same time.' } },
        ] satisfies Callout[],
      },
    ],
    surfaces: {
      title: { es: 'Un flujo, cuatro superficies', en: 'One flow, four surfaces' },
      body: {
        es: 'El mismo flujo se muda de marco sin reiniciarse: celular, tablet, monitor de recepción o widget en el sitio de la barbería.',
        en: 'The same flow moves between frames without restarting: phone, tablet, front-desk monitor or a widget on the shop’s site.',
      },
      phone: img('surface-phone', 780, 1688, { es: 'La reserva en el celular del cliente.', en: 'Booking on the client’s phone.' }),
      tablet: img('surface-tablet', 1200, 1615, { es: 'La reserva en una tablet, con botones más grandes.', en: 'Booking on a tablet, with bigger targets.' }),
      monitor: img('surface-monitor', 2000, 1053, { es: 'La reserva en el monitor de recepción de la barbería.', en: 'Booking on the shop’s front-desk monitor.' }),
      widget: img('surface-widget', 2000, 1053, { es: 'La reserva como widget dentro del sitio web de una barbería.', en: 'Booking as a widget inside a barbershop’s website.' }),
      labels: {
        phone: { es: 'Celular', en: 'Phone' },
        tablet: { es: 'Tablet', en: 'Tablet' },
        monitor: { es: 'Monitor de recepción', en: 'Front-desk monitor' },
        widget: { es: 'Widget en el sitio de la barbería', en: 'Widget on the shop’s website' },
      },
    },
  },

  /** 06 · IA en el proceso */
  ai: {
    product: {
      title: { es: 'IA en la reserva: Clipper', en: 'AI in booking: Clipper' },
      body: {
        es: 'Clipper convierte una frase en una reserva. Aquí funciona con reglas, sin modelo de lenguaje: rápido, predecible y sin costo por mensaje. En voz habla «como un barbero amable que atiende por teléfono».',
        en: 'Clipper turns a sentence into a booking. Here it runs on rules, without a language model: fast, predictable and with no per-message cost. In voice it talks “like a friendly barber answering the phone”.',
      },
      phrase: { es: 'corte mañana a las 5 con Andrés', en: 'haircut tomorrow at 5 with Andrés' },
      parsed: [
        { key: { es: 'servicio', en: 'service' }, value: { es: 'Corte', en: 'Haircut' } },
        { key: { es: 'día', en: 'day' }, value: { es: 'mañana', en: 'tomorrow' } },
        { key: { es: 'hora', en: 'time' }, value: { es: '5:00 p. m.', en: '5:00 p.m.' } },
        { key: { es: 'barbero', en: 'barber' }, value: { es: 'Andrés', en: 'Andrés' } },
      ],
      result: { es: 'Sin hueco → propone lo más cercano con él, o esa hora con otro barbero.', en: 'No slot → proposes the closest with him, or that time with another barber.' },
    },
    build: {
      title: { es: 'IA en cómo lo construí', en: 'AI in how I built it' },
      steps: [
        { title: { es: 'Investigar con método', en: 'Research with method' }, body: { es: 'Quince productos comparados con fuentes, separando lo confirmado de lo dudoso.', en: 'Fifteen products compared with sources, separating confirmed from doubtful.' } },
        { title: { es: 'Diseñar dentro del sistema', en: 'Design inside the system' }, body: { es: 'Con Claude Code y las reglas de Thema: cada pieza nueva se creó documentada (selector, tira de días, horas por franja, recibo).', en: 'With Claude Code and Thema’s rules: every new piece was created documented (selector, day strip, time bands, receipt).' } },
        { title: { es: 'Probar con un backend simulado', en: 'Test with a simulated backend' }, body: { es: '30 rutas que se comportan como el servidor real, con el mismo cálculo de precios.', en: '30 routes that behave like the real server, with the same pricing logic.' } },
        { title: { es: 'Exportar con un comando', en: 'Export with one command' }, body: { es: 'La reserva sale del sistema a su propio repositorio, lista para publicar.', en: 'Booking leaves the system for its own repository, ready to publish.' } },
      ] satisfies TitledText[],
      days: { value: '9', label: { es: 'días para cerrar casi toda la fase 1 y 2 de la investigación', en: 'days to close almost all of the research’s phases 1 and 2' } },
    },
  },

  /** 07 · Impacto */
  impact: {
    note: {
      es: 'Todavía no hay barberías en producción, así que estas cifras son del producto, no de negocio.',
      en: 'There are no barbershops in production yet, so these are product figures, not business ones.',
    },
    metrics: [
      { value: 9, suffix: '', label: { es: 'días para cerrar casi dos fases', en: 'days to close almost two phases' } },
      { value: 16, suffix: '', label: { es: 'tipos de paso en el flujo', en: 'step types in the flow' } },
      { value: 30, suffix: '', label: { es: 'rutas de backend simulado', en: 'simulated backend routes' } },
      { value: 19, suffix: '', label: { es: 'archivos de prueba de la reserva', en: 'booking test files' } },
    ],
    closed: [
      { es: 'Anticipo condicional, con cliente de confianza exento', en: 'Conditional deposit, trusted clients exempt' },
      { es: 'Límite de intentos y consentimiento sin marcar', en: 'Attempt limits and unchecked consent' },
      { es: 'Recordatorios programados y calendario con alarma', en: 'Scheduled reminders and calendar file with alarms' },
      { es: 'Cita fija, «Lo antes posible» y fotos de referencia', en: 'Recurring appointment, “ASAP” and reference photos' },
      { es: 'Reseñas solo de citas cumplidas', en: 'Reviews only from completed visits' },
      { es: 'Paquetes, tarjetas de regalo y membresía', en: 'Packages, gift cards and membership' },
    ] satisfies L[],
    learnings: [
      { es: 'Conocer al cliente que vuelve vale más que cualquier filtro: la mejor reserva es la que ya viene armada.', en: 'Knowing the returning client beats any filter: the best booking is the one that comes pre-built.' },
      { es: 'Cuatro versiones con un solo motor dejan explorar sin multiplicar los errores.', en: 'Four versions on one engine let you explore without multiplying bugs.' },
    ] satisfies L[],
    pending: {
      es: 'Lo que falta ya no es de pantalla: pago real, moneda local, mensajes que salgan de verdad y unir este Clipper con el de la plataforma.',
      en: 'What’s left isn’t UI anymore: real payments, local currency, messages that actually go out, and merging this Clipper with the platform’s.',
    },
  },

  /** 08 · Demo */
  demo: {
    lead: {
      es: 'Es la reserva real, funcionando aquí mismo. Los datos son de prueba: nada se cobra ni se envía.',
      en: 'It’s the real booking, running right here. The data is test data: nothing is charged or sent.',
    },
    versions: [
      { id: 'mixed', name: { es: 'Según el cliente', en: 'By client' }, url: 'https://booking-flow-alpha.vercel.app/reservar?embed=1' },
      { id: 'chat', name: { es: 'Clipper', en: 'Clipper' }, url: 'https://booking-flow-alpha.vercel.app/reservar?embed=1&version=chat' },
    ],
    tryIt: [
      { label: { es: 'Cliente que vuelve', en: 'Returning client' }, value: '320 217 2738' },
      { label: { es: 'Código', en: 'Code' }, value: '246810' },
      { label: { es: 'Cliente nuevo', en: 'New client' }, value: { es: 'cualquier otro número', en: 'any other number' } },
      { label: { es: 'En Clipper escribe', en: 'In Clipper type' }, value: { es: '«corte mañana a las 5 con Andrés»', en: '“haircut tomorrow at 5 with Andrés”' } },
    ],
    open: 'https://booking-flow-alpha.vercel.app',
  },
}
