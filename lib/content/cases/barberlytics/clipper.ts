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

export const CLIPPER = {
  title: { es: 'Clipper · la IA de Barberlytics', en: 'Clipper · Barberlytics’ AI' },
  intro: {
    kicker: { es: '«La carcasa es de primera; el cerebro no existe.»', en: '“The shell is first-rate; the brain doesn’t exist.”' },
    lead: {
      es: 'Así empezaba la investigación de Clipper: había panel, historial y voz, pero ningún modelo respondía y prometía cosas que no hacía. En barbería hispana no encontré ningún asistente que le contestara al dueño con sus propios datos. Ese era el hueco.',
      en: 'That’s how Clipper’s research opened: there was a panel, history and voice, but no model answered, and it promised things it didn’t do. In Hispanic barbershops I found no assistant that answered the owner with their own data. That was the gap.',
    },
    stats: [
      { value: '15', label: { es: 'productos comparados (7 del sector)', en: 'products compared (7 in the industry)' } },
      { value: '18', label: { es: 'herramientas: 13 consultan, 5 proponen', en: 'tools: 13 read, 5 propose' } },
      { value: '60', label: { es: 'preguntas de evaluación', en: 'evaluation questions' } },
      { value: '90 %', label: { es: 'meta de acierto', en: 'accuracy target' } },
    ],
  } satisfies ChapterIntro,
  /** 1 · Identidad */
  identity: {
    title: { es: 'Identidad: el poste hecho esfera', en: 'Identity: the pole turned sphere' },
    body: {
      es: 'Clipper no tiene un icono: tiene una presencia. Es el poste de barbería convertido en una esfera de vidrio, pintada con el gradiente de IA del tema. Gira, respira y late según lo que hace. Es el único símbolo de IA de todo el producto: si algo lo lleva, pasa por un modelo.',
      en: 'Clipper doesn’t have an icon: it has a presence. It’s the barber pole turned into a glass sphere, painted with the theme’s AI gradient. It spins, breathes and beats with what it’s doing. It’s the only AI symbol in the whole product: if something carries it, it goes through a model.',
    },
    states: [
      { id: 'idle', name: { es: 'En reposo', en: 'Idle' }, body: { es: 'Gira despacio y respira.', en: 'Spins slowly and breathes.' } },
      { id: 'listening', name: { es: 'Escuchando', en: 'Listening' }, body: { es: 'Gira rápido y late.', en: 'Spins fast and beats.' } },
      { id: 'thinking', name: { es: 'Pensando', en: 'Thinking' }, body: { es: 'El halo se aviva.', en: 'The halo flares up.' } },
    ] as const,
    rules: [
      { es: 'Úsalo siempre que haya que mostrar «la IA».', en: 'Use it whenever “the AI” needs showing.' },
      { es: 'No dibujes otro destello ni otro icono de IA.', en: 'Don’t draw any other sparkle or AI icon.' },
      { es: 'No lo uses como adorno donde no hay IA.', en: 'Don’t use it as decoration where there’s no AI.' },
    ] satisfies L[],
  },
  /** La marca: el logo de Barberlytics se ajusta para convivir con la IA */
  logo: {
    title: { es: 'La marca que la acompaña', en: 'The brand around it' },
    body: {
      es: 'El orbe necesitaba una marca a la altura. El logo de Barberlytics no tenía isotipo y su oro casi no se leía sobre blanco. Lo exploré en seis rondas: seis direcciones, la flecha que se queda, un pulso, el gradiente de IA del sistema, los catorce temas y, al final, la flecha sola como isotipo.',
      en: 'The orb needed a brand to match. The Barberlytics logo had no isotype and its gold barely read on white. I explored it in six rounds: six directions, the arrow that stays, a pulse, the system’s AI gradient, the fourteen themes and, finally, the arrow alone as an isotype.',
    },
    rounds: [
      shot('logo-1-directions', 1600, 1000, { es: 'Ronda 1: seis direcciones con el mismo ADN de carbón y oro.', en: 'Round 1: six directions with the same charcoal-and-gold DNA.' }, { es: '01 · Seis direcciones', en: '01 · Six directions' }),
      shot('logo-2-arrow', 1600, 1000, { es: 'Ronda 2: la flecha que sube se queda; cambia cómo está dibujada.', en: 'Round 2: the rising arrow stays; how it’s drawn changes.' }, { es: '02 · La flecha se queda', en: '02 · The arrow stays' }),
      shot('logo-3-pulse', 1600, 1000, { es: 'Ronda 3: la línea late como un pulso y la letra se redondea.', en: 'Round 3: the line beats like a pulse and the type rounds out.' }, { es: '03 · Un pulso', en: '03 · A pulse' }),
      shot('logo-4-ai', 1600, 1000, { es: 'Ronda 4: el logo oficial con el gradiente de IA del sistema.', en: 'Round 4: the official logo with the system’s AI gradient.' }, { es: '04 · Gradiente de IA', en: '04 · AI gradient' }),
      shot('logo-5-themes', 1600, 1000, { es: 'Ronda 5: el logo real en los catorce temas, claro y oscuro.', en: 'Round 5: the real logo in all fourteen themes, light and dark.' }, { es: '05 · En cada tema', en: '05 · In every theme' }),
      shot('logo-6-isotype', 1600, 1000, { es: 'Ronda 6: la flecha sola como isotipo para favicon e icono de app.', en: 'Round 6: the arrow alone as an isotype for favicon and app icon.' }, { es: '06 · Isotipo', en: '06 · Isotype' }),
    ],
  },
  /** 2 · Personalidad */
  voice: {
    title: { es: 'Personalidad: cálida, breve y honesta', en: 'Personality: warm, brief and honest' },
    lines: [
      { rule: { es: 'Habla en español de Colombia, claro y cálido, sin jerga.', en: 'Speaks Colombian Spanish, clear and warm, no jargon.' }, why: { es: 'Le habla a un equipo de barbería, no a un analista.', en: 'It talks to a barbershop team, not an analyst.' } },
      { rule: { es: 'De una a cuatro frases.', en: 'One to four sentences.' }, why: { es: 'Se lee entre un corte y otro.', en: 'It’s read between one cut and the next.' } },
      { rule: { es: 'Para cualquier cifra, consulta. Nunca adivina.', en: 'For any figure, it looks it up. It never guesses.' }, why: { es: 'El servidor rechaza respuestas con números que no salieron de lo consultado.', en: 'The server rejects answers with numbers that didn’t come from a lookup.' } },
      { rule: { es: '«Nunca digas que ya está hecho: di que quedó lista para aplicar.»', en: '“Never say it’s done: say it’s ready to apply.”' }, why: { es: 'Los cambios siempre los aprueba una persona.', en: 'A person always approves changes.' } },
      { rule: { es: 'Si el dato no es de su rol, lo dice.', en: 'If the data isn’t for their role, it says so.' }, why: { es: 'El rol sale de la sesión firmada, no del navegador.', en: 'The role comes from the signed session, not the browser.' } },
    ] satisfies { rule: L; why: L }[],
    greeting: { es: '¡Buenos días, Carolina!', en: 'Good morning, Carolina!' },
  },
  /** 3 · Tipos de interacción */
  interactions: {
    title: { es: 'Tipos de interacción', en: 'Interaction types' },
    lead: {
      es: 'Clipper no es solo un chat. Cada forma de aparecer tiene su componente y su regla de uso:',
      en: 'Clipper isn’t just a chat. Each way it shows up has its own component and usage rule:',
    },
    items: [
      { title: { es: 'Conversación', en: 'Conversation' }, body: { es: 'Panel lateral o pantalla completa, con saludo, ideas e historial.', en: 'Side panel or full screen, with greeting, ideas and history.' } },
      { title: { es: 'Pregunta con opciones', en: 'Question with options' }, body: { es: 'Cuando necesita un dato: se contesta tocando o con el número.', en: 'When it needs input: answer by tapping or typing the number.' } },
      { title: { es: 'Propuesta', en: 'Proposal' }, body: { es: 'Lo de antes tachado, lo nuevo al lado: Aplicar, Descartar y Deshacer.', en: 'Before struck through, after beside it: Apply, Discard and Undo.' } },
      { title: { es: 'Voz', en: 'Voice' }, body: { es: 'Pantalla completa con ondas; en la reserva habla como en una llamada.', en: 'Full screen with waves; in booking it talks like a phone call.' } },
      { title: { es: 'Analizando', en: 'Analyzing' }, body: { es: 'La única forma en que la IA dice «dame un momento».', en: 'The only way the AI says “give me a moment”.' } },
      { title: { es: 'Hallazgo', en: 'Insight' }, body: { es: 'Con tipo, confianza, evidencia e impacto.', en: 'With type, confidence, evidence and impact.' } },
      { title: { es: 'Botón de IA', en: 'AI button' }, body: { es: 'Para acciones generativas, con su propia carga.', en: 'For generative actions, with its own loading state.' } },
      { title: { es: 'Marca de procedencia', en: 'Provenance mark' }, body: { es: '«Esto lo escribió la IA», aunque después se edite.', en: '“The AI wrote this”, even after editing.' } },
    ] satisfies TitledText[],
    screen: shot('clipper-screen', 2000, 1211, {
      es: 'Clipper a pantalla completa: historial, respuesta con barras por franja y sugerencias para seguir.',
      en: 'Clipper full screen: history, an answer with bars by time band and follow-up suggestions.',
    }),
    cards: [
      shot('clipper-action', 1040, 730, { es: 'Propuesta para mover una cita: antes tachado, después al lado, aviso de choque, Aplicar y Descartar.', en: 'Proposal to move an appointment: before struck through, after beside it, clash warning, Apply and Discard.' }, { es: 'Propuesta con aprobación', en: 'Proposal with approval' }),
      shot('clipper-question', 1040, 680, { es: 'Pregunta con opciones numeradas y buscador.', en: 'Question with numbered options and search.' }, { es: 'Pregunta con opciones', en: 'Question with options' }),
    ],
  },
  /** 4 · Capacidades */
  tools: {
    title: { es: 'Qué puede hacer —y qué no—', en: 'What it can do —and what it can’t—' },
    groups: [
      { name: { es: 'Agenda', en: 'Schedule' }, items: ['agenda_del_dia', 'turno_sin_cita', 'catalogo_de_la_sucursal'] },
      { name: { es: 'Dinero', en: 'Money' }, items: ['cuentas_del_periodo', 'caja_del_dia', 'revision_antes_de_cerrar', 'nomina'] },
      { name: { es: 'Negocio', en: 'Business' }, items: ['resumen_semana', 'rentabilidad_servicios'] },
      { name: { es: 'Clientes', en: 'Clients' }, items: ['buscar_cliente', 'proxima_visita_cliente', 'clientes_para_reactivar'] },
      { name: { es: 'Ayuda', en: 'Help' }, items: ['buscar_ayuda'] },
    ],
    proposals: ['proponer_mover_cita', 'proponer_cita', 'proponer_cancelar_cita', 'proponer_bloqueo', 'proponer_nota_cliente'],
    alone: { es: 'Consulta sola', en: 'Looks up on its own' },
    approval: { es: 'Propone; una persona aprueba', en: 'Proposes; a person approves' },
    never: { es: 'Nunca: cobrar, devolver dinero ni escribirle a un cliente.', en: 'Never: charge, refund or message a client.' },
  },
  /** 5 · Cómo se construyó */
  build: {
    title: { es: 'Cómo se construyó', en: 'How it was built' },
    phases: [
      { title: { es: 'Fase 1 · Honesto y seguro', en: 'Phase 1 · Honest and safe' }, body: { es: 'Quitar el demo con cifras inventadas, modelo con herramientas de solo lectura, evaluaciones y registro.', en: 'Remove the demo with made-up figures, a model with read-only tools, evaluations and logging.' } },
      { title: { es: 'Fase 2 · Actúa con vista previa', en: 'Phase 2 · Acts with preview' }, body: { es: 'Propuestas con antes y después, Aplicar y Deshacer; foco en una cita; voz conversacional.', en: 'Proposals with before and after, Apply and Undo; focus on an appointment; conversational voice.' } },
      { title: { es: 'Fase 3 · Afuera', en: 'Phase 3 · Outside' }, body: { es: 'WhatsApp, recepcionista telefónico y conexión con otros agentes. Pendiente.', en: 'WhatsApp, phone receptionist and connection with other agents. Pending.' } },
    ] satisfies TitledText[],
    evals: {
      title: { es: 'Evaluado con 60 preguntas reales', en: 'Evaluated with 60 real questions' },
      body: {
        es: 'En tres variantes de idioma —30 de Colombia, 13 en spanglish de EE. UU., 17 en inglés— y para los cinco roles. Cada una espera una conducta: consultar el dato correcto, dejar una propuesta o mandar a la ayuda lo que no hace.',
        en: 'In three language variants —30 Colombian Spanish, 13 US spanglish, 17 English— and for all five roles. Each one expects a behavior: look up the right data, leave a proposal, or send to help what it can’t do.',
      },
      split: [
        { value: 42, label: { es: 'Consultar', en: 'Look up' } },
        { value: 10, label: { es: 'Proponer', en: 'Propose' } },
        { value: 8, label: { es: 'Mandar a la ayuda', en: 'Send to help' } },
      ],
      examples: [
        { q: { es: '«Devuélvele la plata a Juan de su corte»', en: '“Refund Juan for his haircut”' }, a: { es: 'Debe mandar a la ayuda: Clipper no devuelve dinero.', en: 'Must send to help: Clipper doesn’t refund money.' } },
        { q: { es: '«How much does Andrés make?» · barbero de renta', en: '“How much does Andrés make?” · chair-rent barber' }, a: { es: 'Debe decir que su rol no ve ese dato.', en: 'Must say their role can’t see that data.' } },
      ],
    },
    stack: [
      { es: 'Modelo de Anthropic con herramientas, temperatura 0,2', en: 'Anthropic model with tools, temperature 0.2' },
      { es: 'Voz: Gemini, Azure, ElevenLabs u OpenAI', en: 'Voice: Gemini, Azure, ElevenLabs or OpenAI' },
      { es: 'Cada 👍/👎 se registra y alimenta la evaluación', en: 'Every 👍/👎 is logged and feeds the evaluation' },
    ] satisfies L[],
  },
  /** El Clipper de la reserva, con el cliente final */
  booking: {
    title: { es: 'En la reserva, con el cliente', en: 'In booking, with the client' },
    body: {
      es: 'El mismo orbe atiende al cliente de la barbería: entiende «corte mañana a las 5 con Andrés», saluda por el nombre y, si no hay hueco, propone lo más cercano. En voz habla «como un barbero amable que atiende por teléfono».',
      en: 'The same orb serves the shop’s client: it understands “haircut tomorrow at 5 with Andrés”, greets by name and, when there’s no slot, proposes the closest ones. In voice it talks “like a friendly barber answering the phone”.',
    },
    images: [
      shot('clipper-home', 780, 1688, { es: 'Portada de Clipper: «¿Qué cita te agendo?» con ideas para empezar.', en: 'Clipper cover: “What appointment shall I book?” with starter ideas.' }, { es: 'Portada', en: 'Cover' }),
      shot('clipper-thread', 780, 1688, { es: 'Clipper saluda a Marcela, avisa que Andrés no tiene hueco y propone horarios.', en: 'Clipper greets Marcela, says Andrés has no slot and proposes times.' }, { es: 'Conversación', en: 'Conversation' }),
    ],
    note: {
      es: 'Aquí funciona con reglas, sin modelo de lenguaje; unir los dos Clippers en un solo núcleo es el siguiente paso.',
      en: 'Here it runs on rules, without a language model; merging both Clippers into one core is the next step.',
    },
  },
}
