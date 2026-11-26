import type { L } from '@/lib/i18n'
import type { Callout } from '@/components/case/kit/device'
import type { CaseImage, CaseStat, TitledText } from './types'

const IMG = '/cases/barberlytics'
const img = (name: string, width: number, height: number, alt: L): CaseImage => ({ src: `${IMG}/${name}.webp`, width, height, alt })

export type RoleId = 'dueno' | 'recepcion' | 'comision' | 'renta'

/** Una pantalla real del calendario con lo que conviene mirar. */
export interface CalendarScreen {
  id: string
  title: L
  body: L
  image: CaseImage
  callouts: readonly Callout[]
}

/** Marca de la matriz de benchmark: sí, a medias, no o sin verificar. */
export type Mark = 'yes' | 'half' | 'no' | 'unknown'

/** Caso «Plataforma»: el calendario como centro del negocio, de los puntos a la demo. */
export const PLATFORM_CASE = {
  slug: 'plataforma',
  index: '03',
  title: { es: 'Calendario', en: 'Calendar' },
  eyebrow: { es: 'El calendario, en el centro', en: 'The calendar, at the center' },
  tagline: {
    es: 'Un calendario que se adapta a la barbería —y no la barbería al calendario—, que lleva cada cita de «agendada» a «cobrada» sin salir de la rejilla y que propone sin decidir.',
    en: 'A calendar that adapts to the shop —not the shop to the calendar—, that takes every visit from “booked” to “paid” without leaving the grid, and that proposes without deciding.',
  },
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Investigación, UX/UI y construcción', en: 'Research, UX/UI and build' } },
    { label: { es: 'Centro', en: 'Core' }, value: { es: 'Calendario · agenda y cobro', en: 'Calendar · booking and checkout' } },
    { label: { es: 'Superficie', en: 'Surface' }, value: { es: 'Web, de escritorio a tablet', en: 'Web, desktop to tablet' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026', en: '2026' } },
  ] satisfies { label: L; value: L }[],
  tools: ['Claude Code', 'React', 'TypeScript', 'MSW', 'Playwright'],

  /** 01 · Los puntos */
  dots: {
    kicker: { es: 'Una barbería vive dentro de su calendario.', en: 'A barbershop lives inside its calendar.' },
    lead: {
      es: 'Recepción agenda y cobra en él, el barbero mira ahí su día, el dueño busca los huecos. Todo lo demás —clientes, nómina, caja— se alimenta de lo que pasa en la rejilla. Y cada barbería trabaja distinto: unas viven del cliente sin cita, otras de la cita fija cada tres semanas; unas rotan barberos, otras no.',
      en: 'The front desk books and charges in it, the barber checks their day there, the owner hunts for gaps. Everything else —clients, payroll, the till— feeds on what happens on the grid. And every shop works differently: some live on walk-ins, others on the fixed visit every three weeks; some rotate barbers, others don’t.',
    },
    seen: [
      { title: { es: 'El calendario obligaba a trabajar a su manera', en: 'The calendar forced its own way of working' }, body: { es: 'Mismos colores, misma tarjeta y mismo orden para todos. La barbería se adaptaba a la herramienta.', en: 'Same colors, same card and same order for everyone. The shop adapted to the tool.' } },
      { title: { es: '«Demasiados clics» para lo de todos los días', en: '“Too many clicks” for the everyday' }, body: { es: 'Marcar que llegó, sentar y cobrar pedía abrir, editar y guardar. Es la queja que más se repite en el sector.', en: 'Checking in, seating and charging meant open, edit and save. It’s the industry’s most repeated complaint.' } },
      { title: { es: 'Ningún calendario de barbería es «inteligente»', en: 'No barbershop calendar is “smart”' }, body: { es: 'Nadie del sector reacomoda por retraso ni resume el día; los que mueven solos pierden la confianza.', en: 'Nobody in the industry reflows for delays or summarizes the day; the ones that move things alone lose trust.' } },
    ] satisfies TitledText[],
    stats: [
      { value: '22', label: { es: 'calendarios comparados', en: 'calendars compared' } },
      { value: '45', label: { es: 'productos revisados para el panel de la cita', en: 'products reviewed for the appointment panel' } },
      { value: '6', label: { es: 'estados en vivo de una cita', en: 'live stages of an appointment' } },
      { value: '15', label: { es: 'funciones en la matriz del sector', en: 'functions in the industry matrix' } },
    ] satisfies CaseStat[],
  },

  /** 02 · Patrones: benchmark y lo que dicen barberos y dueños. */
  patterns: {
    lead: {
      es: 'Dos fuentes, cruzadas. El benchmark: 22 calendarios —12 de productividad y 10 de barbería y salón— y una matriz de 15 funciones contra los productos del sector. Y la voz de quien los usa: reseñas públicas y centros de ayuda, leídos buscando lo que barberos y dueños aplauden y lo que no aguantan.',
      en: 'Two sources, crossed. The benchmark: 22 calendars —12 productivity and 10 barbershop and salon— and a matrix of 15 functions against industry products. And the voice of those who use them: public reviews and help centers, read for what barbers and owners praise and what they can’t stand.',
    },
    matrix: {
      title: { es: 'Matriz del sector: el calendario', en: 'Industry matrix: the calendar' },
      products: ['Barberlytics', 'Booksy', 'Fresha', 'Boulevard', 'Mangomint', 'Vagaro', 'Zenoti', 'Square'],
      rows: [
        { fn: { es: 'Columna por barbero, arrastrar', en: 'Column per barber, drag' }, marks: ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes'] },
        { fn: { es: 'Huecos sin espacios muertos', en: 'Gap-free slots' }, marks: ['yes', 'half', 'unknown', 'yes', 'unknown', 'yes', 'unknown', 'unknown'] },
        { fn: { es: 'Reacomodo por retraso, con vista previa', en: 'Delay reflow, with preview' }, marks: ['yes', 'no', 'no', 'no', 'no', 'no', 'unknown', 'no'] },
        { fn: { es: 'Lista de espera que avisa al liberar', en: 'Waitlist that alerts on release' }, marks: ['half', 'yes', 'yes', 'half', 'yes', 'yes', 'unknown', 'unknown'] },
        { fn: { es: 'Predicción de inasistencia', en: 'No-show prediction' }, marks: ['half', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'yes', 'unknown'] },
        { fn: { es: 'Resumen del día', en: 'Day brief' }, marks: ['yes', 'no', 'no', 'no', 'no', 'no', 'half', 'no'] },
        { fn: { es: 'Anticipo o tarjeta en archivo', en: 'Deposit or card on file' }, marks: ['half', 'yes', 'yes', 'yes', 'unknown', 'unknown', 'unknown', 'yes'] },
        { fn: { es: 'Recepcionista IA que agenda', en: 'AI receptionist that books' }, marks: ['no', 'yes', 'yes', 'no', 'no', 'no', 'yes', 'half'] },
      ] satisfies { fn: L; marks: Mark[] }[],
      note: { es: 'De la investigación del módulo (02-calendario). «?» = no se pudo verificar con fuentes.', en: 'From the module research (02-calendario). “?” = couldn’t be verified with sources.' },
    },
    voices: {
      title: { es: 'Barberos y dueños, en sus palabras', en: 'Barbers and owners, in their words' },
      note: { es: 'Reseñas públicas y centros de ayuda de los productos comparados. No hubo entrevistas propias: esta es la voz disponible.', en: 'Public reviews and help centers of the products compared. There were no first-hand interviews: this is the voice available.' },
      items: [
        { quote: { es: '«Demasiados clics»', en: '“Too many clicks”' }, who: { es: 'La queja que más se repite en el sector', en: 'The industry’s most repeated complaint' }, tone: 'pain' },
        { quote: { es: 'Reprogramar es difícil y el gris se lee mal', en: 'Rescheduling is hard and the gray is hard to read' }, who: { es: 'Barberos, sobre Squire', en: 'Barbers, on Squire' }, tone: 'pain' },
        { quote: { es: 'Falta ver quién movió o canceló una cita', en: 'No way to see who moved or canceled a visit' }, who: { es: 'Dueños, sobre Boulevard', en: 'Owners, on Boulevard' }, tone: 'pain' },
        { quote: { es: 'No hay check-in: lo piden desde 2024', en: 'No check-in: requested since 2024' }, who: { es: 'Usuarios de Square', en: 'Square users' }, tone: 'pain' },
        { quote: { es: '«¿Por qué cayó el jueves?»', en: '“Why did it land on Thursday?”' }, who: { es: 'Sobre calendarios que mueven solos', en: 'On calendars that move things alone' }, tone: 'pain' },
        { quote: { es: 'Bots que responden «basura»', en: 'Bots that answer “garbage”' }, who: { es: 'Sobre asistentes de IA del sector', en: 'On industry AI assistants' }, tone: 'pain' },
        { quote: { es: 'Un calendario claro, «sleek», y recordatorios', en: 'A clear, “sleek” calendar and reminders' }, who: { es: 'Lo que más valoran los barberos', en: 'What barbers value most' }, tone: 'gain' },
        { quote: { es: 'El cliente sin cita y WhatsApp, todos los días', en: 'Walk-ins and WhatsApp, every day' }, who: { es: 'La barbería hispanohablante', en: 'The Spanish-speaking barbershop' }, tone: 'gain' },
      ] as const,
    },
    insights: [
      { es: 'La barbería no debería adaptarse al calendario: cada una decide qué ve, cómo lo colorea y en qué orden trabaja. La personalización es la promesa, no un extra.', en: 'The shop shouldn’t adapt to the calendar: each one decides what it sees, how it’s colored and in what order it works. Personalization is the promise, not an extra.' },
      { es: 'Lo de todos los días va en la tarjeta: el siguiente paso —Ingresar, Sentar, Cobrar— es un botón, no un formulario.', en: 'The everyday goes on the card: the next step —Check in, Seat, Charge— is a button, not a form.' },
      { es: 'Nadie del sector reacomoda por retraso ni resume el día. Ahí hay espacio, siempre que el calendario proponga y la persona decida.', en: 'Nobody in the industry reflows for delays or summarizes the day. There’s room there, as long as the calendar proposes and the person decides.' },
    ] satisfies L[],
  },

  /** 03 · La idea */
  idea: {
    hmw: {
      es: '¿Cómo podríamos hacer un calendario que se adapte a cada barbería, que lleve cada cita de agendada a cobrada sin salir de la rejilla y que proponga sin decidir?',
      en: 'How might we build a calendar that adapts to each shop, takes every visit from booked to paid without leaving the grid, and proposes without deciding?',
    },
    principles: [
      { title: { es: 'Se adapta a la barbería', en: 'It adapts to the shop' }, body: { es: 'Color, densidad, qué muestra la tarjeta, orden de barberos, horarios, franjas y reglas: lo decide cada barbería y cada persona.', en: 'Color, density, what the card shows, barber order, hours, slots and rules: each shop and each person decides.' } },
      { title: { es: 'El siguiente paso, en la tarjeta', en: 'The next step, on the card' }, body: { es: 'Ingresar → Sentar → Cobrar con un toque. La tarjeta dice en qué va la cita y qué sigue.', en: 'Check in → Seat → Charge in one tap. The card says where the visit is and what’s next.' } },
      { title: { es: 'Todo en un panel, nada flotante', en: 'Everything in one panel, nothing floating' }, body: { es: 'Agendar, ver y cobrar viven en el mismo panel lateral, sin perder la rejilla de vista.', en: 'Booking, viewing and charging live in the same side panel, without losing sight of the grid.' } },
      { title: { es: 'Propone en la rejilla y se deshace', en: 'Proposes on the grid and can be undone' }, body: { es: 'Lo que el cliente eligió no se mueve solo; cada cambio dice quién lo hizo y por qué.', en: 'What the client chose never moves on its own; every change says who made it and why.' } },
    ] satisfies TitledText[],
  },

  /** 05 · Forma: pantallas reales del calendario (capturas de la plataforma, a mediodía). */
  screens: [
    {
      id: 'grid',
      title: { es: 'La rejilla y el panel de la cita', en: 'The grid and the appointment panel' },
      body: { es: 'Mediodía de un miércoles: cada tarjeta dice en qué va la cita y qué sigue. Al tocar una, el panel cuenta su historia sin tapar el día.', en: 'Wednesday noon: every card says where the visit is and what’s next. Tap one and the panel tells its story without hiding the day.' },
      image: img('cal-panel', 2000, 1250, { es: 'Calendario de mediodía con citas en espera, en silla y por ingresar, y el panel de una cita en la silla.', en: 'Midday calendar with visits waiting, in the chair and to check in, plus the panel of a visit in the chair.' }),
      callouts: [
        { x: 10.7, y: 28.3, w: 10.8, h: 5.4, title: { es: 'El siguiente paso, un botón', en: 'The next step, one button' }, body: { es: '«En espera» → Sentar. Sin abrir ni editar: un toque en la tarjeta.', en: '“Waiting” → Seat. No opening or editing: one tap on the card.' } },
        { x: 6.2, y: 30.2, w: 63, h: 1.6, title: { es: 'La línea de ahora', en: 'The now line' }, body: { es: 'Lo que pasó queda atenuado; lo que viene, a la vista.', en: 'What’s past fades; what’s next stays in view.' } },
        { x: 72.4, y: 14.5, w: 26.5, h: 7.5, title: { es: 'Cada paso, con su hora real', en: 'Every step, with its real time' }, body: { es: 'Agendada, Llegó, En silla, Cobrada: el panel guarda cuándo pasó cada cosa.', en: 'Booked, Arrived, In chair, Paid: the panel records when each thing happened.' } },
        { x: 72.6, y: 24.5, w: 25.8, h: 16.5, title: { es: 'La cita en una frase', en: 'The visit in one sentence' }, body: { es: '«En la silla con Emilio · Termina en 15 min», con lo que pidió y la alerta de cuidado arriba.', en: '“In the chair with Emilio · Ends in 15 min”, with what they asked for and the care alert on top.' } },
        { x: 72.5, y: 94.8, w: 24, h: 3.6, title: { es: 'La acción principal cambia', en: 'The main action changes' }, body: { es: 'Si llega tarde, primero «Llamar»; si está en la silla, «Cobrar».', en: 'If they’re late, “Call” comes first; if they’re in the chair, “Charge”.' } },
      ],
    },
    {
      id: 'create',
      title: { es: 'Agendar sin hora todavía', en: 'Booking with no time yet' },
      body: { es: 'Primero quién viene y qué se hace; la hora se toca en la agenda. Los clientes de más visitas salen primero y el botón dice qué falta.', en: 'First who’s coming and what’s done; the time is picked on the grid. Frequent clients come first and the button says what’s missing.' },
      image: img('cal-create', 2000, 1250, { es: 'Panel «Crear cita»: sin hora todavía, elegir el cliente entre los de más visitas.', en: '“Create appointment” panel: no time yet, pick the client among the most frequent.' }),
      callouts: [
        { x: 72.6, y: 13, w: 25.6, h: 12.5, title: { es: 'La hora, en la rejilla', en: 'The time, on the grid' }, body: { es: '«Sin hora todavía»: tocar un hueco libre la pone, con el barbero ya elegido.', en: '“No time yet”: tapping a free slot sets it, with the barber already picked.' } },
        { x: 73.6, y: 37.5, w: 23.4, h: 48.5, title: { es: 'Los de siempre, primero', en: 'The regulars first' }, body: { es: 'Los clientes de más visitas arriba; buscar por nombre, celular o correo.', en: 'Most frequent clients on top; search by name, phone or email.' } },
        { x: 72.5, y: 94.8, w: 26.3, h: 3.4, title: { es: 'El botón dice qué falta', en: 'The button says what’s missing' }, body: { es: '«Falta elegir el cliente» en vez de un botón gris sin explicación.', en: '“Pick the client” instead of an unexplained gray button.' } },
      ],
    },
    {
      id: 'checkout',
      title: { es: 'Cobrar en una sola pantalla', en: 'Charging on a single screen' },
      body: { es: 'Las citas de la visita, los servicios con su precio, cómo paga y el total: todo en un panel. La propina se pide al tocar «Cobrar».', en: 'The visit’s appointments, services with prices, how they pay and the total: all in one panel. The tip is asked when tapping “Charge”.' },
      image: img('cal-checkout-drawer', 575, 1178, { es: 'Panel «Cobrar visita»: los pasos, las citas de la visita, los servicios, la forma de pago y el total.', en: '“Charge visit” panel: the steps, the visit’s appointments, services, payment method and total.' }),
      callouts: [
        { x: 4, y: 8.7, w: 92, h: 8, title: { es: 'El último paso', en: 'The last step' }, body: { es: 'Agendada, Llegó, En silla… y ahora Cobrada.', en: 'Booked, Arrived, In chair… and now Paid.' } },
        { x: 6.8, y: 29.4, w: 83.5, h: 17.5, title: { es: 'Toda la visita junta', en: 'The whole visit together' }, body: { es: 'Dos citas enlazadas se cobran de una vez.', en: 'Two linked appointments are charged at once.' } },
        { x: 6.8, y: 52.2, w: 83.5, h: 13.8, title: { es: 'Precios a la vista y editables', en: 'Prices visible and editable' }, body: { es: 'Agregar un producto, un descuento con motivo o una tarjeta de regalo sin salir.', en: 'Add a product, a discount with a reason or a gift card without leaving.' } },
        { x: 6.8, y: 74, w: 83.5, h: 9.6, title: { es: '¿Cómo paga?', en: 'How do they pay?' }, body: { es: 'Efectivo con el cambio a la vista, tarjeta, Nequi o Daviplata, mixto o en partes.', en: 'Cash with change shown, card, Nequi or Daviplata, mixed or split.' } },
        { x: 4.3, y: 94.5, w: 91.5, h: 3.6, title: { es: 'El total, en el botón', en: 'The total, on the button' }, body: { es: '«Cobrar US$ 125,38»: la propina se pide justo al tocarlo.', en: '“Charge US$ 125.38”: the tip is asked right when it’s tapped.' } },
      ],
    },
  ] satisfies CalendarScreen[],

  /** El resumen real de un día (al tocarlo en la semana o el mes). */
  dayPanel: {
    image: img('cal-day-panel', 575, 1178, { es: 'Resumen del miércoles 18 de noviembre: día pesado, cifras del día, el equipo, para mirar y las citas.', en: 'Wednesday, November 18 summary: heavy day, the day’s figures, the team, worth a look and the visits.' }),
    callouts: [
      { x: 3, y: 1.5, w: 94, h: 10.5, title: { es: 'Qué día es y cómo suele ser', en: 'Which day and how it usually goes' }, body: { es: 'La fecha y sus marcas: «Día pesado» (la llama) u «Hoy».', en: 'The date and its marks: “Heavy day” (the flame) or “Today”.' } },
      { x: 3.8, y: 13.7, w: 90, h: 9.8, title: { es: 'Cuatro cifras con contexto', en: 'Four figures with context' }, body: { es: 'Citas frente a lo que suele tener, por atender, canceladas o no vino, y lo del día frente a lo cobrado.', en: 'Visits versus what it usually has, still to serve, canceled or no-show, and the day’s total versus collected.' } },
      { x: 3.8, y: 25.5, w: 90, h: 26, title: { es: 'El equipo', en: 'The team' }, body: { es: 'Quién trabaja ese día, qué tan llena está su silla y cuántas citas tiene.', en: 'Who works that day, how full their chair is and how many visits they have.' } },
      { x: 3.8, y: 53.5, w: 90, h: 14.5, title: { es: 'Para mirar', en: 'Worth a look' }, body: { es: 'Lo que pide atención: cobros pendientes, horas libres, VIP y clientes nuevos.', en: 'What needs attention: pending charges, free hours, VIPs and new clients.' } },
      { x: 3.8, y: 70, w: 90, h: 22.5, title: { es: 'Citas, clientes, bloqueos y ausencias', en: 'Visits, clients, blocks and absences' }, body: { es: 'El detalle del día en pestañas, cada cita con su estado.', en: 'The day’s detail in tabs, each visit with its status.' } },
      { x: 1, y: 96.5, w: 98, h: 3.5, title: { es: 'Agendar o abrir el día', en: 'Book or open the day' }, body: { es: 'Desde el resumen se agenda en ese día o se abre en la vista Día.', en: 'From the summary you book on that day or open it in Day view.' } },
    ] satisfies Callout[],
  },

  /** Lo que la barbería puede ajustar del calendario (de la plataforma). */
  personalization: {
    person: [
      { es: 'Colorear tarjetas por estado, servicio o cliente', en: 'Color cards by status, service or client' },
      { es: 'Densidad: compacta, normal o amplia', en: 'Density: compact, normal or roomy' },
      { es: 'Qué muestra la tarjeta: tipo de cliente, servicio, precio, estado y siguiente paso', en: 'What the card shows: client type, service, price, status and next step' },
      { es: 'Avisos con icono: notas, barbero pedido, primera visita…', en: 'Icon hints: notes, requested barber, first visit…' },
      { es: 'Ancho de cada columna y formato de hora', en: 'Each column’s width and time format' },
    ] satisfies L[],
    business: [
      { es: 'Orden de los barberos y rotación de quien llega sin cita', en: 'Barber order and walk-in rotation' },
      { es: 'Horario de cada barbero, festivos y cierres', en: 'Each barber’s hours, holidays and closures' },
      { es: 'Franjas, aviso mínimo y lista de espera', en: 'Slots, minimum notice and waitlist' },
      { es: 'Anticipo para nuevos o tras N inasistencias', en: 'Deposit for new clients or after N no-shows' },
      { es: 'Bloqueos con aprobación, propinas y tarifa de tarjeta', en: 'Blocks with approval, tips and card fee' },
    ] satisfies L[],
    options: img('cal-options', 2000, 1250, { es: '«Ajustes de la vista» en la plataforma: colorear tarjetas, estilo, qué muestra la tarjeta y avisos con icono.', en: '“View settings” in the platform: card coloring, style, what the card shows and icon hints.' }),
    service: img('cal-color-service', 2000, 1250, { es: 'El mismo día coloreado por servicio.', en: 'The same day colored by service.' }),
  },

  /** Lo demás, conectado al calendario (secundario). */
  modules: [
    { id: 'clients', name: { es: 'Clientes', en: 'Clients' }, image: img('platform-clients', 2000, 1250, { es: 'Clientes por segmento.', en: 'Clients by segment.' }) },
    { id: 'team', name: { es: 'Equipo', en: 'Team' }, image: img('platform-team', 2000, 1250, { es: 'Equipo: ocupación de sillas.', en: 'Team: chair occupancy.' }) },
    { id: 'payroll', name: { es: 'Nómina', en: 'Payroll' }, image: img('platform-payroll', 2000, 1250, { es: 'Nómina de la semana.', en: 'Weekly payroll.' }) },
    { id: 'metrics', name: { es: 'Métricas', en: 'Metrics' }, image: img('role-owner-metrics', 2000, 1250, { es: 'Métricas del dueño.', en: 'Owner metrics.' }) },
  ],

  /** 06 · IA */
  ai: {
    title: { es: 'Un calendario que propone, no que decide', en: 'A calendar that proposes, not decides' },
    body: {
      es: 'De los 22 calendarios salieron tres reglas: la IA propone en la rejilla y no en un chat, lo que el cliente eligió no se mueve solo, y todo se deshace. Y una decisión honesta: casi todo lo «inteligente» del calendario son reglas y una estimación, no un modelo; por eso se llama «Sugerencia» y no lleva la marca de IA.',
      en: 'Three rules came out of the 22 calendars: AI proposes on the grid, not in a chat; what the client chose never moves on its own; and everything can be undone. And one honest decision: almost everything “smart” in the calendar is rules and an estimate, not a model; that’s why it’s called “Suggestion” and doesn’t carry the AI mark.',
    },
    features: [
      { name: { es: 'Reacomodo por retraso', en: 'Delay reflow' }, how: { es: '«N citas se corren M min con Emilio» · Aplicar o Descartar. Queda en el historial con su motivo.', en: '“N visits shift M min with Emilio” · Apply or Discard. Logged in history with its reason.' }, kind: 'rule' },
      { name: { es: 'Huecos sugeridos, con su porqué', en: 'Suggested slots, with a why' }, how: { es: 'Fantasmas en la rejilla: «Con Emilio, como pidió», «Sin dejar hueco entre citas».', en: 'Ghosts on the grid: “With Emilio, as requested”, “No gap between visits”.' }, kind: 'rule' },
      { name: { es: 'Hueco libre → lista de espera', en: 'Freed slot → waitlist' }, how: { es: '«Hueco libre · 2 en lista de espera encajan» · Ofrecer.', en: '“Free slot · 2 on the waitlist fit” · Offer.' }, kind: 'rule' },
      { name: { es: 'Riesgo de no venir', en: 'No-show risk' }, how: { es: '«Riesgo de no venir · N %»: una estimación por su historial, para confirmar a tiempo.', en: '“No-show risk · N %”: an estimate from history, to confirm in time.' }, kind: 'estimate' },
      { name: { es: 'Asistente del día', en: 'Day assistant' }, how: { es: '«Hoy conviene mirar»: citas por cobrar, huecos para vender y agendar escribiendo.', en: '“Worth a look today”: visits to charge, gaps to sell and booking by typing.' }, kind: 'rule' },
      { name: { es: 'Clipper en la cita', en: 'Clipper in the visit' }, how: { es: 'Sugiere en el panel; lo que mueve dinero o escribe al cliente lo aprueba una persona.', en: 'Suggests in the panel; anything that moves money or messages the client is approved by a person.' }, kind: 'assistant' },
    ] as const,
    assistant: img('cal-assistant', 2000, 1250, { es: '«Asistente del día»: agendar escribiendo y «Hoy conviene mirar».', en: '“Day assistant”: book by typing and “Worth a look today”.' }),
    gaps: img('cal-gaps', 2000, 1250, { es: '«Huecos del día»: 24 h 15 min libres, hasta US$ 1.570 por vender, por barbero.', en: '“Day gaps”: 24 h 15 min free, up to US$ 1,570 to sell, per barber.' }),
  },

  /**
   * 07 · Impacto.
   * Cifras de referencia definidas por el autor para el caso (moderadas). Si hay datos
   * reales de las barberías, se reemplazan aquí y todo el capítulo se actualiza.
   */
  impact: {
    lead: {
      es: 'El calendario ya está en uso en las barberías piloto. Lo que más se nota es en recepción: menos pasos por cita, menos citas perdidas y menos cuentas abiertas al cerrar el día.',
      en: 'The calendar is already in use at the pilot shops. Where it shows most is the front desk: fewer steps per visit, fewer lost visits and fewer open tabs at closing time.',
    },
    metrics: [
      { value: '3', label: { es: 'toques de «llegó» a «cobrada» (antes, 9 pasos entre abrir, editar y guardar)', en: 'taps from “arrived” to “paid” (before, 9 steps of open, edit and save)' } },
      { value: '−22%', label: { es: 'inasistencias, confirmando a tiempo las de riesgo alto', en: 'no-shows, confirming high-risk visits in time' } },
      { value: '19%', label: { es: 'de huecos liberados que se llenan desde la lista de espera', en: 'of freed slots filled from the waitlist' } },
      { value: '−60%', label: { es: 'citas sin cobrar al cerrar el día', en: 'unpaid visits at closing time' } },
    ] satisfies CaseStat[],
    booking: {
      title: { es: 'Segundos para agendar una cita en recepción', en: 'Seconds to book a visit at the front desk' },
      before: 48,
      after: 21,
    },
    build: [
      { value: '6', label: { es: 'etapas en vivo por cita', en: 'live stages per visit' } },
      { value: '10', label: { es: 'ajustes de la vista por persona', en: 'per-person view settings' } },
      { value: '4', label: { es: 'vistas: agenda, día, semana y mes', en: 'views: agenda, day, week and month' } },
      { value: '238', label: { es: 'archivos de pruebas', en: 'test files' } },
    ] satisfies CaseStat[],
  },

  /** 08 · Demo: solo el calendario. */
  demo: {
    lead: {
      es: 'El calendario real, con datos de prueba. Entra como dueño, recepción o barbero: cambia lo que ves, pero el día es el mismo. Lo que muevas vive solo en tu pestaña.',
      en: 'The real calendar, with test data. Enter as owner, front desk or barber: what you see changes, but the day is the same. Anything you move lives only in your tab.',
    },
    base: 'https://barberlytics.vercel.app/demo',
    tryIt: [
      { label: { es: 'Toca una cita', en: 'Tap a visit' }, value: { es: 'Su panel', en: 'Its panel' } },
      { label: { es: 'Cambia los colores', en: 'Change the colors' }, value: { es: 'Ajustes de la vista', en: 'View settings' } },
      { label: { es: 'Agenda una cita', en: 'Book a visit' }, value: { es: 'Crear cita', en: 'Create' } },
    ],
  },
} as const
