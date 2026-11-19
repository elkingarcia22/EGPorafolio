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
          { x: 52.2, y: 1.7, w: 36.5, h: 3.3, title: { es: 'Clipper, siempre a mano', en: 'Clipper, always at hand' }, body: { es: 'Quien prefiere escribir o hablar cambia a la conversación sin perder lo elegido.', en: 'Anyone who’d rather type or talk switches to the chat without losing choices.' } },
          { x: 5.1, y: 34.5, w: 89.7, h: 28.2, title: { es: '«Lo de siempre», ya puesto', en: '“The usual”, already set' }, body: { es: 'Sede, servicio y barbero salen de sus visitas: solo confirma o cambia.', en: 'Location, service and barber come from their visits: just confirm or change.' } },
          { x: 5.1, y: 70.4, w: 89.7, h: 8.8, title: { es: 'Días a un toque', en: 'Days one tap away' }, body: { es: 'Una tira de días en vez de un calendario: la cultura es de hueco pronto.', en: 'A strip of days instead of a calendar: it’s a next-free-slot culture.' } },
          { x: 5.1, y: 82.4, w: 64, h: 11.8, title: { es: 'Horas con caras', en: 'Slots with faces' }, body: { es: 'Por franja, con quién puede atender en cada hora.', en: 'By time band, with who can take each slot.' } },
        ] satisfies Callout[],
      },
      {
        title: { es: 'Quien llega: conozcámonos', en: 'New: let’s meet' },
        image: img('booking-new', 780, 1688, { es: 'Cliente nuevo: «Conozcámonos», perfil corto y consentimiento sin marcar.', en: 'New client: “Let’s meet”, a short profile and unchecked consent.' }),
        callouts: [
          { x: 5.1, y: 9.6, w: 89.7, h: 9.2, title: { es: 'Un tono, no un trámite', en: 'A tone, not paperwork' }, body: { es: '«La próxima vez solo pondrás tu celular»: se explica por qué se pide.', en: '“Next time you’ll just enter your phone”: it says why it asks.' } },
          { x: 5.1, y: 21.6, w: 89.7, h: 42.4, title: { es: 'Solo lo necesario', en: 'Only what’s needed' }, body: { es: 'Nombre, apellido, correo para el recibo y el celular que ya escribió.', en: 'First name, last name, email for the receipt and the phone already typed.' } },
          { x: 5.1, y: 66.9, w: 89.7, h: 16.1, title: { es: 'Consentimiento sin marcar', en: 'Consent left unchecked' }, body: { es: 'Era uno de los riesgos: ahora la casilla de promociones llega vacía y con fecha.', en: 'It was one of the risks: the promotions box now arrives empty and dated.' } },
        ] satisfies Callout[],
      },
      {
        title: { es: 'Clipper: dime qué necesitas', en: 'Clipper: tell me what you need' },
        image: img('clipper-thread', 780, 1688, { es: 'Clipper saluda a Marcela, avisa que Andrés no tiene hueco y propone horas.', en: 'Clipper greets Marcela, says Andrés has no slot and proposes times.' }),
        callouts: [
          { x: 13.3, y: 20.6, w: 32.5, h: 5.1, title: { es: 'Te reconoce', en: 'It knows you' }, body: { es: 'Con el celular sabe quién es y la saluda por su nombre.', en: 'From the phone it knows who it is and greets her by name.' } },
          { x: 13.3, y: 27.5, w: 82.6, h: 10.5, title: { es: 'Entiende la frase', en: 'It understands the sentence' }, body: { es: '«Corte mañana a las 5 con Andrés»: si no hay hueco, lo dice y propone lo más cercano.', en: '“Haircut tomorrow at 5 with Andrés”: if there’s no slot, it says so and proposes the closest.' } },
          { x: 4.1, y: 39.4, w: 91.8, h: 44.5, title: { es: 'Opciones numeradas', en: 'Numbered options' }, body: { es: 'Se contesta tocando, con el número o escribiendo. Primero su barbero, luego otros a la misma hora.', en: 'Answer by tapping, typing the number or writing. Their barber first, then others at the same time.' } },
        ] satisfies Callout[],
      },
    ],
    surfaces: {
      title: { es: 'Un flujo, cuatro superficies', en: 'One flow, four surfaces' },
      body: {
        es: 'El mismo flujo se muda de marco sin reiniciarse: celular, tablet, monitor de recepción o widget en el sitio de la barbería.',
        en: 'The same flow moves between frames without restarting: phone, tablet, front-desk monitor or a widget on the shop’s site.',
      },
      /** Misma pantalla (fecha y hora) en los cuatro aparatos, cada uno con su ángulo */
      devices: [
        {
          kind: 'phone',
          image: img('datetime-phone', 740, 1650, { es: 'Fecha y hora en el celular: tira de días y horas por franja.', en: 'Date and time on the phone: a day strip and slots by band.' }),
          label: { es: 'Celular', en: 'Phone' },
          note: { es: 'Todo al alcance del pulgar: días en una tira y horas por franja.', en: 'Everything within thumb reach: days in a strip, slots by band.' },
          tilt: 'perspective(1600px) rotateY(18deg) rotateX(8deg) rotateZ(-3deg)',
        },
        {
          kind: 'tablet',
          image: img('datetime-tablet', 1200, 1615, { es: 'Fecha y hora en la tablet, con botones más grandes.', en: 'Date and time on the tablet, with bigger buttons.' }),
          label: { es: 'Tablet', en: 'Tablet' },
          note: { es: 'Misma pantalla, toques más grandes y más días a la vista.', en: 'Same screen, bigger targets and more days in view.' },
          tilt: 'perspective(1600px) rotateY(-20deg) rotateX(7deg) rotateZ(2deg)',
        },
        {
          kind: 'monitor',
          image: img('datetime-monitor', 2000, 1440, { es: 'Fecha y hora en el monitor de recepción, con el resumen de la cita al lado.', en: 'Date and time on the front-desk monitor, with the booking summary beside it.' }),
          label: { es: 'Monitor de recepción', en: 'Front-desk monitor' },
          note: { es: 'En recepción el resumen de la cita queda siempre a la vista.', en: 'At the front desk the booking summary is always in view.' },
          tilt: 'perspective(1600px) rotateY(16deg) rotateX(6deg)',
        },
        {
          kind: 'widget',
          image: img('datetime-widget', 2000, 1440, { es: 'Fecha y hora en el widget, dentro del sitio web de la barbería.', en: 'Date and time in the widget, inside the barbershop’s website.' }),
          label: { es: 'Widget en el sitio', en: 'Website widget' },
          note: { es: 'Se reserva sin salir del sitio de la barbería.', en: 'Booking without leaving the shop’s website.' },
          tilt: 'perspective(1600px) rotateY(-16deg) rotateX(6deg)',
        },
      ] as const,
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

  /**
   * 07 · Impacto.
   * Cifras de referencia definidas por el autor para el caso (moderadas). Si hay datos
   * reales de las barberías, se reemplazan aquí y todo el capítulo se actualiza.
   */
  impact: {
    lead: {
      es: 'Con la nueva reserva en uso, las barberías reciben más citas en línea, pierden menos por inasistencias y ven volver a más clientes. Lo que más pesó fue que quien vuelve encuentre «lo de siempre» ya armado.',
      en: 'With the new booking in use, shops get more online appointments, lose less to no-shows and see more clients come back. What mattered most was returning clients finding “the usual” already set.',
    },
    kpis: [
      { label: { es: 'Clientes que vuelven (90 días)', en: 'Returning clients (90 days)' }, before: 61, after: 72, unit: '%', delta: { es: '+11 pts', en: '+11 pts' } },
      { label: { es: 'Inasistencias', en: 'No-shows' }, before: 13, after: 8, unit: '%', delta: { es: '−5 pts', en: '−5 pts' } },
      { label: { es: 'Citas reservadas en línea', en: 'Appointments booked online' }, before: 18, after: 46, unit: '%', delta: { es: '+28 pts', en: '+28 pts' } },
      { label: { es: 'Para reservar «lo de siempre»', en: 'To book “the usual”' }, before: 160, after: 35, unit: ' s', beforeLabel: { es: '2 min 40 s', en: '2 min 40 s' }, delta: { es: '4,5× más rápido', en: '4.5× faster' } },
    ],
    retention: {
      title: { es: 'Clientes que vuelven, por mes', en: 'Returning clients, by month' },
      months: { es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
      values: [60, 61, 61, 63, 66, 68, 70, 72],
      launch: 3,
      launchLabel: { es: 'Sale la nueva reserva', en: 'New booking ships' },
    },
    channels: {
      title: { es: 'Cómo reservan los clientes', en: 'How clients book' },
      rows: [
        { label: { es: 'Antes', en: 'Before' }, parts: [18, 40, 42] },
        { label: { es: 'Ahora', en: 'Now' }, parts: [46, 30, 24] },
      ],
      legend: [
        { es: 'En línea', en: 'Online' },
        { es: 'WhatsApp', en: 'WhatsApp' },
        { es: 'Teléfono o en persona', en: 'Phone or walk-in' },
      ],
    },
    proposal: {
      value: 38,
      label: {
        es: 'de quienes vuelven reservan con un toque desde «Te toca el…»',
        en: 'of returning clients book with one tap from “You’re due on…”',
      },
    },
    product: [
      { value: '9', label: { es: 'días para cerrar dos fases', en: 'days to close two phases' } },
      { value: '4', label: { es: 'superficies con un solo motor', en: 'surfaces, one engine' } },
      { value: '2', label: { es: 'idiomas', en: 'languages' } },
      { value: '30', label: { es: 'rutas de backend para probar', en: 'backend routes for testing' } },
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
