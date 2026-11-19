import type { L } from '@/lib/i18n'
import type { CaseStat, TitledText } from './types'

export type ToolRole = 'dueno' | 'recepcion' | 'barbero'

/** Una herramienta real del agente (src/lib/clipper/toolCatalog.ts) y quién la tiene. */
export interface ClipperTool {
  id: string
  label: L
  kind: 'read' | 'propose'
  roles: readonly ToolRole[]
}

const ALL: readonly ToolRole[] = ['dueno', 'recepcion', 'barbero']

/** Un intercambio de ejemplo: pregunta, herramienta y respuesta (de las pruebas y evaluaciones). */
export interface Exchange {
  role: L
  q: L
  tool: string
  toolLabel: L
  a: L
  check: L
}

/** Caso «Clipper»: el agente de Barberlytics, de los puntos a la demo. */
export const CLIPPER_CASE = {
  slug: 'clipper',
  index: '04',
  title: { es: 'Clipper', en: 'Clipper' },
  eyebrow: { es: 'La IA y su identidad', en: 'The AI and its identity' },
  tagline: {
    es: 'Un agente que responde con los datos de la barbería, nunca adivina, y que propone en vez de actuar: cada cambio lo aprueba una persona. Por escrito o por voz.',
    en: 'An agent that answers with the shop’s own data, never guesses, and proposes instead of acting: a person approves every change. In writing or by voice.',
  },
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Investigación, conversación, UX/UI y construcción', en: 'Research, conversation, UX/UI and build' } },
    { label: { es: 'Agente', en: 'Agent' }, value: { es: '18 herramientas · 5 roles', en: '18 tools · 5 roles' } },
    { label: { es: 'Canales', en: 'Channels' }, value: { es: 'Chat, voz y reserva', en: 'Chat, voice and booking' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026', en: '2026' } },
  ] satisfies { label: L; value: L }[],
  tools: ['Claude Code', 'Claude API', 'Gemini TTS', 'Web Speech', 'Vitest'],

  /** 01 · Los puntos */
  dots: {
    kicker: { es: '«La carcasa es de primera; el cerebro no existe.»', en: '“The shell is first-rate; the brain doesn’t exist.”' },
    lead: {
      es: 'Así empezaba la investigación de Clipper. Había panel, historial y voz, pero ningún modelo respondía, y la interfaz prometía cosas que no hacía. Mientras tanto, en recepción alguien tenía que saber cuánto se llevaba cobrado, quién iba tarde o cuándo volvía un cliente, y para eso había que abrir tres pantallas.',
      en: 'That’s how Clipper’s research opened. There was a panel, history and voice, but no model answered, and the interface promised things it didn’t do. Meanwhile, at the front desk someone needed to know how much had been collected, who was late or when a client was due back, and that meant opening three screens.',
    },
    seen: [
      { title: { es: 'Prometía lo que no hacía', en: 'It promised what it didn’t do' }, body: { es: 'Un demo con cifras inventadas y botones de IA sobre reglas fijas. Prometer IA y no darla quita confianza.', en: 'A demo with made-up figures and AI buttons on fixed rules. Promising AI and not delivering costs trust.' } },
      { title: { es: 'Nadie respondía con los datos del dueño', en: 'Nobody answered with the owner’s data' }, body: { es: 'En barbería hispana no encontré un asistente que contestara con la agenda, la caja o los clientes del propio negocio.', en: 'In Hispanic barbershops I found no assistant answering with the business’s own schedule, till or clients.' } },
      { title: { es: 'Los del sector, o callan o se pasan', en: 'Industry bots either stay quiet or overreach' }, body: { es: 'Bots que responden «basura» o calendarios que mueven citas sin preguntar. Ni lo uno ni lo otro.', en: 'Bots that answer “garbage” or calendars that move visits without asking. Neither.' } },
    ] satisfies TitledText[],
    stats: [
      { value: '18', label: { es: 'herramientas: 13 consultan, 5 proponen', en: 'tools: 13 read, 5 propose' } },
      { value: '60', label: { es: 'preguntas de evaluación', en: 'evaluation questions' } },
      { value: '5', label: { es: 'roles, cada uno con lo suyo', en: 'roles, each with their own' } },
      { value: '3', label: { es: 'variantes de idioma: Colombia, spanglish e inglés', en: 'language variants: Colombian, spanglish and English' } },
    ] satisfies CaseStat[],
  },

  /** 02 · Patrones: qué tanto deja actuar cada asistente. */
  patterns: {
    lead: {
      es: 'Comparé asistentes de barbería y salón con calendarios de productividad que ya usan IA, y los ordené por cuánto dejan actuar a la máquina. Las quejas se amontonaban en los dos extremos: los que solo repiten la ayuda y los que mueven cosas sin preguntar.',
      en: 'I compared barbershop and salon assistants with productivity calendars already using AI, and ordered them by how much they let the machine act. Complaints piled up at both ends: those that only repeat help docs and those that move things without asking.',
    },
    zones: [
      { id: 'help', label: { es: 'Solo ayuda', en: 'Help only' }, note: { es: 'Repite el centro de ayuda.', en: 'Repeats the help center.' } },
      { id: 'answer', label: { es: 'Responde con datos', en: 'Answers with data' }, note: { es: 'Consulta, no cambia nada.', en: 'Looks up, changes nothing.' } },
      { id: 'propose', label: { es: 'Propone; una persona aplica', en: 'Proposes; a person applies' }, note: { es: 'Vista previa y deshacer.', en: 'Preview and undo.' } },
      { id: 'act', label: { es: 'Actúa solo', en: 'Acts alone' }, note: { es: 'Rápido, pero nadie sabe por qué.', en: 'Fast, but nobody knows why.' } },
    ],
    products: [
      { name: 'Square Assistant', at: 0.18, note: { es: 'Usuarios piden apagarlo', en: 'Users ask to turn it off' }, bad: true },
      { name: 'Mangomint', at: 0.3, note: { es: 'Sin IA generativa', en: 'No generative AI' }, bad: false },
      { name: 'Reclaim', at: 0.58, note: { es: 'Modo de vista previa', en: 'Preview mode' }, bad: false },
      { name: 'Morgen', at: 0.64, note: { es: 'Propone; el usuario aprueba', en: 'Proposes; user approves' }, bad: false },
      { name: 'Booksy', at: 0.8, note: { es: 'Recepcionista que agenda', en: 'Receptionist that books' }, bad: false },
      { name: 'Fresha', at: 0.84, note: { es: 'Concierge pagado por local', en: 'Paid concierge per location' }, bad: false },
      { name: 'Motion', at: 0.95, note: { es: '«¿Por qué cayó el jueves?»', en: '“Why did it land on Thursday?”' }, bad: true },
    ],
    clipperAt: 0.6,
    insights: [
      { es: 'El valor está en el medio: responder con los datos del negocio y proponer cambios que una persona aplica. Ni un FAQ con forma de chat, ni un agente que mueve citas solo.', en: 'The value is in the middle: answering with the business’s data and proposing changes a person applies. Neither an FAQ shaped like a chat, nor an agent moving visits on its own.' },
      { es: 'La confianza se rompe con una cifra inventada. Cada número de una respuesta tiene que salir de una consulta.', en: 'Trust breaks with one made-up figure. Every number in an answer has to come from a lookup.' },
      { es: 'La IA tiene que verse igual en todas partes y solo donde de verdad hay un modelo: un único símbolo, no destellos sueltos.', en: 'AI has to look the same everywhere and only where there truly is a model: one symbol, not scattered sparkles.' },
    ] satisfies L[],
  },

  /** 03 · La idea */
  idea: {
    hmw: {
      es: '¿Cómo podríamos darle a la barbería un asistente que responda con sus propios datos, que nunca adivine y que no haga nada sin que una persona lo apruebe?',
      en: 'How might we give the shop an assistant that answers with its own data, never guesses, and does nothing without a person approving it?',
    },
    principles: [
      { title: { es: 'Nunca adivina', en: 'It never guesses' }, body: { es: 'Para cualquier cifra, consulta. Si una respuesta trae un número que no salió de los datos, el servidor la frena.', en: 'For any figure, it looks it up. If an answer brings a number that didn’t come from the data, the server stops it.' } },
      { title: { es: 'Propone; tú aplicas', en: 'It proposes; you apply' }, body: { es: '«Nunca digas que ya está hecho: di que quedó lista para aplicar.» Aplicar, Descartar y Deshacer.', en: '“Never say it’s done: say it’s ready to apply.” Apply, Discard and Undo.' } },
      { title: { es: 'Los datos son datos, no órdenes', en: 'Data is data, not orders' }, body: { es: 'Lo que viene de una nota de cliente nunca se trata como instrucción.', en: 'Whatever comes from a client note is never treated as an instruction.' } },
      { title: { es: 'Cada rol, lo suyo', en: 'Each role, their own' }, body: { es: 'El rol sale de la sesión firmada; si el dato no es de su rol, lo dice.', en: 'The role comes from the signed session; if the data isn’t for their role, it says so.' } },
    ] satisfies TitledText[],
  },

  /** 05 · Forma: ejemplos reales de las pruebas y evaluaciones del agente. */
  exchanges: [
    {
      role: { es: 'Dueño', en: 'Owner' },
      q: { es: '¿Cómo nos fue esta semana frente a la anterior?', en: 'How did we do this week versus last?' },
      tool: 'resumen_semana',
      toolLabel: { es: 'Resumen de la semana', en: 'Weekly summary' },
      a: { es: 'Vendieron US$ 14.050 en 303 servicios, un poco menos que la semana pasada. El mejor día fue el miércoles.', en: 'You sold US$ 14,050 across 303 services, a bit less than last week. Wednesday was the best day.' },
      check: { es: 'Cada cifra sale de la consulta', en: 'Every figure comes from the lookup' },
    },
    {
      role: { es: 'Recepción', en: 'Front desk' },
      q: { es: '¿Cuándo vino por última vez Samuel Martínez?', en: 'When did Samuel Martínez last come in?' },
      tool: 'buscar_cliente',
      toolLabel: { es: 'Buscar cliente', en: 'Find client' },
      a: { es: 'Vino hace tres semanas, con Andrés. Suele volver cada cuatro: le toca la próxima.', en: 'He came three weeks ago, with Andrés. He usually returns every four: he’s due next week.' },
      check: { es: 'Sin cifras inventadas', en: 'No made-up figures' },
    },
    {
      role: { es: 'Recepción', en: 'Front desk' },
      q: { es: 'Devuélvele la plata a Juan de su corte', en: 'Refund Juan for his haircut' },
      tool: 'buscar_ayuda',
      toolLabel: { es: 'Buscar en la ayuda', en: 'Search help' },
      a: { es: 'Eso no lo puedo hacer yo: las devoluciones las hace una persona. Te dejo cómo se hacen.', en: 'I can’t do that: refunds are done by a person. Here’s how to do one.' },
      check: { es: 'No cobra, no devuelve, no escribe al cliente', en: 'Doesn’t charge, refund or message clients' },
    },
    {
      role: { es: 'Recepción', en: 'Front desk' },
      q: { es: '¿Cuánto gana Andrés este mes?', en: 'How much does Andrés make this month?' },
      tool: 'nomina',
      toolLabel: { es: 'Nómina · no permitida', en: 'Payroll · not allowed' },
      a: { es: 'Ese dato no está disponible para tu rol. Si lo necesitas, pídeselo a la administración.', en: 'That data isn’t available for your role. If you need it, ask management.' },
      check: { es: 'El rol sale de la sesión firmada', en: 'Role comes from the signed session' },
    },
  ] satisfies Exchange[],

  /** Las 18 herramientas reales y sus roles. */
  toolset: [
    { id: 'agenda_del_dia', label: { es: 'Agenda del día', en: 'Day schedule' }, kind: 'read', roles: ALL },
    { id: 'cuentas_del_periodo', label: { es: 'Cuentas del periodo', en: 'Period accounts' }, kind: 'read', roles: ALL },
    { id: 'resumen_semana', label: { es: 'Resumen de la semana', en: 'Weekly summary' }, kind: 'read', roles: ['dueno'] },
    { id: 'caja_del_dia', label: { es: 'Caja del día', en: 'Day till' }, kind: 'read', roles: ['recepcion'] },
    { id: 'buscar_cliente', label: { es: 'Buscar cliente', en: 'Find client' }, kind: 'read', roles: ALL },
    { id: 'proxima_visita_cliente', label: { es: 'Próxima visita', en: 'Next visit' }, kind: 'read', roles: ALL },
    { id: 'clientes_para_reactivar', label: { es: 'Clientes para reactivar', en: 'Clients to win back' }, kind: 'read', roles: ['dueno'] },
    { id: 'nomina', label: { es: 'Nómina', en: 'Payroll' }, kind: 'read', roles: ['dueno', 'barbero'] },
    { id: 'rentabilidad_servicios', label: { es: 'Rentabilidad de servicios', en: 'Service profitability' }, kind: 'read', roles: ['dueno'] },
    { id: 'turno_sin_cita', label: { es: 'Turno sin cita', en: 'Walk-in turn' }, kind: 'read', roles: ['recepcion'] },
    { id: 'revision_antes_de_cerrar', label: { es: 'Revisión antes de cerrar', en: 'Pre-close review' }, kind: 'read', roles: ['recepcion'] },
    { id: 'catalogo_de_la_sucursal', label: { es: 'Catálogo de la sede', en: 'Location catalog' }, kind: 'read', roles: ALL },
    { id: 'buscar_ayuda', label: { es: 'Buscar en la ayuda', en: 'Search help' }, kind: 'read', roles: ALL },
    { id: 'proponer_mover_cita', label: { es: 'Proponer mover cita', en: 'Propose moving a visit' }, kind: 'propose', roles: ['recepcion'] },
    { id: 'proponer_cita', label: { es: 'Proponer cita', en: 'Propose a visit' }, kind: 'propose', roles: ['recepcion'] },
    { id: 'proponer_cancelar_cita', label: { es: 'Proponer cancelar', en: 'Propose canceling' }, kind: 'propose', roles: ['recepcion'] },
    { id: 'proponer_bloqueo', label: { es: 'Proponer bloqueo', en: 'Propose a block' }, kind: 'propose', roles: ['recepcion'] },
    { id: 'proponer_nota_cliente', label: { es: 'Proponer nota de cliente', en: 'Propose client note' }, kind: 'propose', roles: ALL },
  ] satisfies ClipperTool[],

  /** 06 · Cómo se construyó */
  build: {
    evals: {
      total: 60,
      languages: [
        { label: { es: 'Colombia', en: 'Colombia' }, value: 30 },
        { label: { es: 'Spanglish EE. UU.', en: 'US spanglish' }, value: 13 },
        { label: { es: 'Inglés', en: 'English' }, value: 17 },
      ],
      behaviors: [
        { label: { es: 'Consultar el dato', en: 'Look up data' }, value: 42 },
        { label: { es: 'Dejar una propuesta', en: 'Leave a proposal' }, value: 10 },
        { label: { es: 'Mandar a la ayuda', en: 'Send to help' }, value: 8 },
      ],
      categories: ['agenda', 'caja', 'semana', 'cliente', 'nómina', 'catálogo', 'turno', 'propuesta', 'ayuda', 'permiso'],
      note: {
        es: 'Corren contra el modelo real con un comando, para los cinco roles. La meta es 90 % de acierto; todavía falta correrlas con la clave de producción, así que no hay un resultado que mostrar.',
        en: 'They run against the real model with one command, for all five roles. The target is 90% accuracy; they still need a run with the production key, so there’s no result to show yet.',
      },
    },
    guard: {
      before: { es: 'Llevas US$ 7.026 en 50 cuentas, un 12 % más.', en: 'You have US$ 7,026 in 50 accounts, 12% more.' },
      flagged: '12 %',
      after: { es: 'Llevas US$ 7.026,45 en 50 cuentas.', en: 'You have US$ 7,026.45 in 50 accounts.' },
    },
    phases: [
      { title: { es: 'Fase 1 · Honesto y seguro', en: 'Phase 1 · Honest and safe' }, body: { es: 'Fuera el demo con cifras inventadas; modelo con herramientas de solo lectura, evaluaciones y registro de cada paso.', en: 'Out with the made-up demo; a model with read-only tools, evaluations and a log of every step.' } },
      { title: { es: 'Fase 2 · Propone con vista previa', en: 'Phase 2 · Proposes with preview' }, body: { es: 'Tarjetas con antes y después, Aplicar y Deshacer; foco en una cita; voz.', en: 'Cards with before and after, Apply and Undo; focus on a visit; voice.' } },
      { title: { es: 'Fase 3 · Afuera (pendiente)', en: 'Phase 3 · Outside (pending)' }, body: { es: 'WhatsApp, recepcionista por teléfono y conversación por voz dentro de la app del equipo.', en: 'WhatsApp, phone receptionist and voice conversation inside the team app.' } },
    ] satisfies TitledText[],
  },

  /**
   * 07 · Impacto.
   * Cifras de referencia definidas por el autor para el caso (moderadas). Si hay datos
   * reales de las barberías, se reemplazan aquí y todo el capítulo se actualiza.
   */
  impact: {
    lead: {
      es: 'Clipper ya acompaña a las barberías piloto. Donde más se nota es en las preguntas de todos los días: ya no hay que abrir tres pantallas para saber cuánto se lleva cobrado o cuándo vuelve un cliente.',
      en: 'Clipper already works with the pilot shops. It shows most in everyday questions: no need to open three screens to know what’s been collected or when a client is due back.',
    },
    metrics: [
      { value: '−35%', label: { es: 'consultas a soporte de «¿cómo hago…?»', en: '“how do I…?” support requests' } },
      { value: '64%', label: { es: 'de propuestas aplicadas sin cambios', en: 'of proposals applied unchanged' } },
      { value: '12 s', label: { es: 'para responder con datos (antes, tres pantallas)', en: 'to answer with data (before, three screens)' } },
      { value: '0', label: { es: 'cambios hechos sin que una persona los aprobara', en: 'changes made without a person approving them' } },
    ] satisfies CaseStat[],
  },

  /** 08 · Demo: el Clipper de la reserva, con el cliente final. */
  demo: {
    lead: {
      es: 'El Clipper de la reserva, funcionando aquí mismo con datos de prueba. Escríbele o toca el micrófono: en voz habla «como un barbero amable que atiende por teléfono». Esta versión funciona con reglas, sin modelo de lenguaje.',
      en: 'Booking’s Clipper, running right here with test data. Type to it or tap the mic: in voice it talks “like a friendly barber answering the phone”. This version runs on rules, without a language model.',
    },
    url: 'https://booking-flow-alpha.vercel.app/reservar?embed=1&version=chat',
    tryIt: [
      { label: { es: 'Escribe', en: 'Type' }, value: { es: '«corte mañana a las 5 con Andrés»', en: '“haircut tomorrow at 5 with Andrés”' } },
      { label: { es: 'Celular que vuelve', en: 'Returning phone' }, value: '320 217 2738' },
      { label: { es: 'Código', en: 'Code' }, value: '246810' },
    ],
  },
} as const
