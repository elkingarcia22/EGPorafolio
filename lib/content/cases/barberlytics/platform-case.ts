import type { L } from '@/lib/i18n'
import type { Callout } from '@/components/case/kit/device'
import type { CaseImage, CaseStat, TitledText } from './types'

const IMG = '/cases/barberlytics'
const img = (name: string, width: number, height: number, alt: L): CaseImage => ({ src: `${IMG}/${name}.webp`, width, height, alt })

export type RoleId = 'dueno' | 'recepcion' | 'comision' | 'renta'

/** Lo que ve cada rol al entrar: la pantalla real y lo que conviene mirar. */
export interface RoleView {
  id: RoleId
  name: L
  person: string
  scope: L
  lands: L
  image: CaseImage
  callouts: readonly Callout[]
}

/** Un módulo de la plataforma, con su captura real. */
export interface ModuleShot {
  id: string
  name: L
  note: L
  image: CaseImage
}

/** Caso «Plataforma»: el negocio por dentro, de los puntos a la demo. */
export const PLATFORM_CASE = {
  slug: 'plataforma',
  index: '03',
  title: { es: 'Plataforma', en: 'Platform' },
  eyebrow: { es: 'El negocio por dentro', en: 'The business inside' },
  tagline: {
    es: 'Una sola plataforma donde cada persona de la barbería —del dueño al barbero que alquila la silla— ve justo lo suyo, y donde los módulos por fin se hablan entre sí.',
    en: 'One platform where everyone in the shop —from the owner to the barber who rents the chair— sees exactly their own, and where the modules finally talk to each other.',
  },
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Investigación, UX/UI y construcción', en: 'Research, UX/UI and build' } },
    { label: { es: 'Alcance', en: 'Scope' }, value: { es: '11 módulos · 5 roles', en: '11 modules · 5 roles' } },
    { label: { es: 'Superficie', en: 'Surface' }, value: { es: 'Web, de escritorio a tablet', en: 'Web, desktop to tablet' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026', en: '2026' } },
  ] satisfies { label: L; value: L }[],
  tools: ['Claude Code', 'React', 'TypeScript', 'MSW', 'Playwright'],

  /** 01 · Los puntos */
  dots: {
    kicker: { es: '¿Qué ve cada persona de la barbería?', en: 'What does each person in the shop see?' },
    lead: {
      es: 'Una barbería no la usa una persona: la usan el dueño, quien administra una sede, recepción y dos tipos de barbero que ganan distinto. La versión en producción era una app móvil, oscura y en inglés, que resolvía la agenda y el cobro, pero cada módulo vivía aparte y nadie miraba el rol de quien entraba.',
      en: 'A barbershop isn’t used by one person: it’s the owner, whoever runs a location, the front desk and two kinds of barbers who earn differently. The version in production was a mobile app, dark and in English, that handled scheduling and checkout, but every module lived on its own and nobody checked the role of whoever came in.',
    },
    seen: [
      { title: { es: 'Módulos bien hechos, desconectados', en: 'Well-made modules, disconnected' }, body: { es: 'El calendario no sabía de la nómina, ni la caja de los clientes. «La pantalla está bien, el cable no».', en: 'The calendar didn’t know about payroll, nor the till about clients. “The screen is fine, the wiring isn’t.”' } },
      { title: { es: 'Nada tenía guarda por rol', en: 'Nothing was guarded by role' }, body: { es: 'Un barbero podía ver el teléfono, el correo y la cuenta bancaria de sus colegas; el teléfono oculto era solo cosmético.', en: 'A barber could see colleagues’ phone, email and bank account; the masked phone was only cosmetic.' } },
      { title: { es: 'El barbero de renta no existía', en: 'The chair-rent barber didn’t exist' }, body: { es: 'Es su propio negocio dentro de la barbería, pero no veía ni sus ventas ni lo que debía de renta.', en: 'They’re their own business inside the shop, but saw neither their sales nor the rent they owed.' } },
    ] satisfies TitledText[],
    stats: [
      { value: '17', label: { es: 'investigaciones, una por módulo', en: 'research reports, one per module' } },
      { value: '28', label: { es: 'productos del sector comparados', en: 'industry products compared' } },
      { value: '5', label: { es: 'roles con su propia puerta de entrada', en: 'roles with their own front door' } },
      { value: '692', label: { es: 'acciones revisadas, rol por rol', en: 'actions reviewed, role by role' } },
    ] satisfies CaseStat[],
  },

  /** 02 · Patrones */
  patterns: {
    lead: {
      es: 'Investigué módulo por módulo con la misma plantilla —qué tiene hoy, qué le falta, cómo lo hace la competencia y dónde la IA ayuda de verdad— y crucé los diecisiete informes. Lo que se repetía en todos no era un problema de pantallas: era de conexiones.',
      en: 'I researched module by module with one template —what it has today, what it lacks, how competitors do it and where AI truly helps— and crossed the seventeen reports. What repeated in all of them wasn’t a screen problem: it was a wiring problem.',
    },
    competitors: ['Booksy', 'Fresha', 'Square', 'Vagaro', 'Boulevard', 'Mangomint', 'GlossGenius', 'Zenoti', 'Phorest', 'AgendaPro', 'Squire', 'theCut', 'Timely', 'Toast', 'Shopify', 'Loyverse', 'Lightspeed', 'QuickBooks', 'Xero', 'Wave', 'Expensify', 'Ramp', 'Brex', 'Dext', 'Alegra', 'Siigo', 'Treinta', 'Bold'],
    columns: [
      {
        title: { es: 'Desconexión', en: 'Disconnection' },
        color: 'pink',
        notes: [
          { es: 'El calendario no le avisa a la nómina', en: 'The calendar doesn’t tell payroll' },
          { es: 'WhatsApp a medias: aparece en 7 de 10 informes', en: 'WhatsApp half-built: in 7 of 10 reports' },
          { es: 'Ningún registro se cierra: cambiar una regla reescribe el pasado', en: 'No record ever closes: changing a rule rewrites the past' },
          { es: 'Cada módulo vuelve a pedir lo que otro ya sabe', en: 'Each module asks again for what another already knows' },
        ],
      },
      {
        title: { es: 'Roles', en: 'Roles' },
        color: 'orange',
        notes: [
          { es: 'Sin guarda por rol en ninguna acción', en: 'No role guard on any action' },
          { es: 'Recepción veía totales y márgenes', en: 'Front desk saw totals and margins' },
          { es: 'El de renta sin Métricas, Nómina ni Transacciones', en: 'Chair-rent barber without Metrics, Payroll or Transactions' },
          { es: 'El teléfono oculto era solo cosmético', en: 'The masked phone was only cosmetic' },
        ],
      },
      {
        title: { es: 'Dinero', en: 'Money' },
        color: 'yellow',
        notes: [
          { es: 'El dueño no puede ver la utilidad', en: 'The owner can’t see profit' },
          { es: 'Nómina legal ya resuelta; lo variable no', en: 'Legal payroll is solved; the variable part isn’t' },
          { es: 'Cierre de caja con cifras a la vista', en: 'Till closing with figures in plain sight' },
          { es: 'Comisiones y propinas cuadradas a mano', en: 'Commissions and tips reconciled by hand' },
        ],
      },
      {
        title: { es: '«IA» que eran reglas', en: '“AI” that was rules' },
        color: 'violet',
        notes: [
          { es: 'Badges de IA sobre reglas fijas', en: 'AI badges on fixed rules' },
          { es: 'Prometer IA y no darla quita confianza', en: 'Promising AI and not delivering costs trust' },
          { es: 'Ningún calendario del sector es «inteligente» de verdad', en: 'No calendar in the industry is truly “smart”' },
          { es: 'Regla: la IA solo explica, propone o redacta', en: 'Rule: AI only explains, proposes or drafts' },
        ],
      },
    ],
    insights: [
      { es: 'Los módulos estaban bien hechos; lo que faltaba era que se hablaran: una cita cobrada tenía que llegar sola a la nómina, al cliente y a las métricas.', en: 'The modules were well made; what was missing was for them to talk: a paid appointment had to reach payroll, the client and the metrics on its own.' },
      { es: 'El rol no es un filtro visual: decide qué datos salen del servidor. Ocultar en pantalla no protege a nadie.', en: 'A role isn’t a visual filter: it decides what data leaves the server. Hiding things on screen protects no one.' },
      { es: 'El barbero que alquila la silla necesita lo mismo que un dueño, recortado a él: ventas, renta, deducciones y su neto, aunque sea negativo.', en: 'The barber who rents the chair needs what an owner sees, cut down to them: sales, rent, deductions and their net, even when it’s negative.' },
    ] satisfies L[],
    before: {
      title: { es: 'Lo que había: la app móvil en producción', en: 'What existed: the mobile app in production' },
      note: { es: 'Oscura, en inglés y solo móvil. Resolvía la agenda y el cobro; todo lo demás vivía en pestañas sueltas.', en: 'Dark, in English and mobile-only. It handled scheduling and checkout; everything else lived in loose tabs.' },
      images: [
        img('v1-calendar', 720, 1280, { es: 'Calendario del día de un barbero en la app móvil.', en: 'A barber’s day calendar in the mobile app.' }),
        img('v1-dashboard', 720, 1280, { es: 'Dashboard móvil con ventas por tipo.', en: 'Mobile dashboard with sales by type.' }),
        img('v1-commission', 360, 853, { es: 'Alta de un barbero por comisión: precios y comisión por servicio.', en: 'Adding a commission barber: prices and commission per service.' }),
        img('v1-welcome', 720, 1316, { es: 'Cobro «Welcome back!» con la última cita para repetir.', en: '“Welcome back!” checkout with the last visit to rebook.' }),
      ],
    },
  },

  /** 03 · La idea */
  idea: {
    hmw: {
      es: '¿Cómo podríamos darle a cada persona de la barbería su propia puerta de entrada, sin perder que todo el negocio se mueva como una sola cosa?',
      en: 'How might we give everyone in the shop their own front door, without losing the whole business moving as one thing?',
    },
    principles: [
      { title: { es: 'El rol se decide en el servidor', en: 'Roles are decided on the server' }, body: { es: 'Cada respuesta llega ya recortada al rol. La pantalla no esconde: no recibe.', en: 'Every response arrives already trimmed to the role. The screen doesn’t hide: it never receives.' } },
      { title: { es: 'Cada quien entra por lo suyo', en: 'Everyone enters through their own' }, body: { es: 'Dueño y administración a Métricas; recepción y barberos al Calendario; el barbero ve «Lo que llevo» o «Mi negocio».', en: 'Owner and managers land on Metrics; front desk and barbers on the Calendar; barbers see “What I’ve made” or “My business”.' } },
      { title: { es: 'El cálculo es fijo; la IA explica y propone', en: 'Math is fixed; AI explains and proposes' }, body: { es: 'Lo que mueve dinero o le escribe a un cliente lo aprueba una persona. Nada se mueve solo y todo se deshace.', en: 'Anything that moves money or messages a client is approved by a person. Nothing moves on its own and everything can be undone.' } },
      { title: { es: 'Los periodos se cierran', en: 'Periods get closed' }, body: { es: 'La nómina se aprueba y queda fija: cambiar una regla mañana no reescribe lo que ya se pagó.', en: 'Payroll gets approved and locked: changing a rule tomorrow doesn’t rewrite what was already paid.' } },
    ] satisfies TitledText[],
  },

  /** 05 · Forma: «ver como», rol por rol (capturas reales de la demo). */
  roles: [
    {
      id: 'dueno',
      name: { es: 'Dueño', en: 'Owner' },
      person: 'Carolina Vargas',
      scope: { es: 'Toda la empresa', en: 'The whole company' },
      lands: { es: 'Métricas', en: 'Metrics' },
      image: img('role-owner-metrics', 2000, 1250, { es: 'Métricas del dueño: resumen de la semana, ventas, ticket, citas, cancelación y utilidad del mes.', en: 'Owner’s metrics: weekly summary, sales, ticket, appointments, cancellations and monthly profit.' }),
      callouts: [
        { x: 16.4, y: 17.4, w: 71.3, h: 21.3, title: { es: 'La semana, en una frase', en: 'The week, in one sentence' }, body: { es: 'Un resumen que se lee como lo contaría un administrador: quién vendió más, el mejor día y a quién confirmar.', en: 'A summary that reads the way a manager would tell it: top seller, best day and who to confirm.' } },
        { x: 16.4, y: 56.2, w: 71.3, h: 15.4, title: { es: 'Cuatro números, no cuarenta', en: 'Four numbers, not forty' }, body: { es: 'Ventas, ticket promedio, citas y cancelación, con su cambio frente al periodo anterior.', en: 'Sales, average ticket, appointments and cancellations, with their change vs. the previous period.' } },
        { x: 16.4, y: 82.8, w: 35.3, h: 16, title: { es: 'Por fin, la utilidad', en: 'Finally, profit' }, body: { es: 'Lo que queda después de costos y gastos: lo que ningún producto de reservas revisado le mostraba al dueño.', en: 'What’s left after costs and expenses: what no booking product reviewed showed the owner.' } },
      ],
    },
    {
      id: 'recepcion',
      name: { es: 'Recepción', en: 'Front desk' },
      person: 'Lucía Bernal',
      scope: { es: 'Su sede, sin cifras', en: 'Their location, no figures' },
      lands: { es: 'Calendario', en: 'Calendar' },
      image: img('role-desk-calendar', 2000, 1250, { es: 'Calendario de recepción: todos los barberos, sin totales de dinero, con entrada y cobro a la mano.', en: 'Front desk calendar: every barber, no money totals, with check-in and checkout at hand.' }),
      callouts: [
        { x: 6, y: 8.8, w: 34, h: 3.4, title: { es: 'Sin totales a la vista', en: 'No totals in sight' }, body: { es: 'Donde el dueño ve lo facturado del día, recepción no ve nada: cobra cada cita, pero el cierre de caja es a ciegas.', en: 'Where the owner sees the day’s billing, the front desk sees nothing: they charge each visit, but the till closes blind.' } },
        { x: 10.6, y: 13.7, w: 87.4, h: 6.1, title: { es: 'Todos los barberos', en: 'Every barber' }, body: { es: 'El calendario universal de la sede, para agendar a quien llegue con quien esté libre.', en: 'The location’s universal calendar, to book walk-ins with whoever is free.' } },
        { x: 73.9, y: 1.4, w: 8.1, h: 2.8, title: { es: 'Marcar entrada', en: 'Check in' }, body: { es: 'La acción más usada de recepción, siempre arriba.', en: 'The front desk’s most used action, always on top.' } },
      ],
    },
    {
      id: 'comision',
      name: { es: 'Barbero por comisión', en: 'Commission barber' },
      person: 'Andrés Beltrán',
      scope: { es: 'Solo lo suyo · «Lo que llevo»', en: 'Only their own · “What I’ve made”' },
      lands: { es: 'Calendario', en: 'Calendar' },
      image: img('role-barber-calendar', 2000, 1250, { es: 'Calendario de un barbero por comisión: solo su columna y lo que gana hoy.', en: 'A commission barber’s calendar: only their column and what they earn today.' }),
      callouts: [
        { x: 27.5, y: 9.1, w: 11, h: 2.7, title: { es: 'Lo que ganas hoy', en: 'What you earn today' }, body: { es: 'Su comisión del día, en la barra del calendario: la cifra que de verdad le importa.', en: 'Their commission for the day, in the calendar bar: the figure that really matters to them.' } },
        { x: 10.6, y: 13.7, w: 87.4, h: 6.1, title: { es: 'Una sola columna: la suya', en: 'One column: theirs' }, body: { es: 'No ve la agenda ni los datos de contacto de sus colegas; eso lo recorta el servidor.', en: 'They don’t see colleagues’ schedules or contact details; the server trims that.' } },
        { x: 10.8, y: 76, w: 87.1, h: 10.8, title: { es: 'Sus pausas, en su día', en: 'Their breaks, in their day' }, body: { es: 'El almuerzo y los bloqueos viven en la misma rejilla que las citas.', en: 'Lunch and blocks live on the same grid as appointments.' } },
      ],
    },
    {
      id: 'renta',
      name: { es: 'Barbero de renta', en: 'Chair-rent barber' },
      person: 'Paola Zuluaga',
      scope: { es: 'Lo suyo, con vista de negocio · «Mi negocio»', en: 'Their own, as a business · “My business”' },
      lands: { es: 'Calendario', en: 'Calendar' },
      image: img('role-renter-business', 2000, 1250, { es: '«Mi negocio» del barbero de renta: por qué esta cifra, ventas, renta, deducciones y pago neto.', en: 'The chair-rent barber’s “My business”: why this figure, sales, rent, deductions and net pay.' }),
      callouts: [
        { x: 16.4, y: 37.4, w: 71.3, h: 19, title: { es: '¿Por qué esta cifra?', en: 'Why this figure?' }, body: { es: 'La cuenta explicada en una frase: lo que vendió, lo que cobró la barbería y lo que le queda.', en: 'The math explained in one sentence: what they sold, what the shop collected and what’s left.' } },
        { x: 16.4, y: 57.6, w: 71.3, h: 13.2, title: { es: 'Lo de un dueño, recortado a él', en: 'An owner’s view, cut down to them' }, body: { es: 'Ventas, lo que guardó la barbería, la renta y su pago neto.', en: 'Sales, what the shop held, the rent and their net pay.' } },
        { x: 16.4, y: 72, w: 35.3, h: 27, title: { es: 'El neto, aunque sea negativo', en: 'The net, even when negative' }, body: { es: 'Renta y deducciones línea por línea: si una semana le debe a la barbería, lo ve antes de que se lo digan.', en: 'Rent and deductions line by line: if one week they owe the shop, they see it before being told.' } },
      ],
    },
  ] satisfies RoleView[],

  /** Los módulos, conectados entre sí. */
  modules: [
    { id: 'payroll', name: { es: 'Nómina', en: 'Payroll' }, note: { es: 'Comisiones, propinas y rentas; el periodo se aprueba y queda fijo.', en: 'Commissions, tips and rent; the period gets approved and locked.' }, image: img('platform-payroll', 2000, 1250, { es: 'Nómina de la semana: por pagar al equipo, por cobrar en rentas, comisiones y propinas.', en: 'Weekly payroll: owed to the team, rent to collect, commissions and tips.' }) },
    { id: 'clients', name: { es: 'Clientes', en: 'Clients' }, note: { es: 'Segmentos que salen de las visitas: nuevo, frecuente, en riesgo, perdido.', en: 'Segments that come from visits: new, frequent, at risk, lost.' }, image: img('platform-clients', 2000, 1250, { es: 'Clientes por segmento: nuevos, retenidos, frecuentes, en riesgo y perdidos.', en: 'Clients by segment: new, retained, frequent, at risk and lost.' }) },
    { id: 'transactions', name: { es: 'Transacciones', en: 'Transactions' }, note: { es: 'Lo facturado, lo cobrado y lo que falta por cobrar del periodo.', en: 'Billed, collected and still outstanding for the period.' }, image: img('platform-transactions', 2000, 1250, { es: 'Transacciones: facturado, cobrado y por cobrar del periodo.', en: 'Transactions: billed, collected and outstanding for the period.' }) },
    { id: 'team', name: { es: 'Equipo', en: 'Team' }, note: { es: 'Ocupación de sillas, ausencias por aprobar y personas por rol.', en: 'Chair occupancy, absences to approve and people by role.' }, image: img('platform-team', 2000, 1250, { es: 'Equipo: ocupación de sillas, servicios y personas por rol.', en: 'Team: chair occupancy, services and people by role.' }) },
    { id: 'services', name: { es: 'Servicios', en: 'Services' }, note: { es: 'Catálogo con margen: qué deja cada servicio y quién lo hace.', en: 'Catalog with margins: what each service earns and who does it.' }, image: img('platform-services', 2000, 1250, { es: 'Servicios con matriz de rentabilidad y margen promedio.', en: 'Services with a profitability matrix and average margin.' }) },
  ] satisfies ModuleShot[],

  /** 06 · IA */
  ai: {
    calendar: {
      title: { es: 'Un calendario que propone, no que decide', en: 'A calendar that proposes, not decides' },
      body: {
        es: 'Comparé 22 calendarios —12 de productividad, de Google a Motion, y 10 del sector— y ninguno de barbería era «inteligente» de verdad. Las reglas que salieron: la IA propone en la rejilla y no en un chat, lo que el cliente eligió no se mueve solo, y siempre se puede deshacer.',
        en: 'I compared 22 calendars —12 productivity ones, from Google to Motion, and 10 from the industry— and none in barbering was truly “smart”. The rules that came out: AI proposes on the grid, not in a chat; what the client chose never moves on its own; and everything can be undone.',
      },
      capabilities: [
        { es: 'Huecos sugeridos', en: 'Suggested gaps' },
        { es: 'Rellenar cancelaciones', en: 'Fill cancellations' },
        { es: 'Reacomodo por retraso', en: 'Delay reflow' },
        { es: 'Riesgo anticipado', en: 'Early risk warning' },
        { es: 'Abrir y cerrar el día', en: 'Open and close the day' },
      ] satisfies L[],
    },
    honest: {
      title: { es: 'Nada de «IA» decorativa', en: 'No decorative “AI”' },
      body: {
        es: 'Donde era una regla, el badge de IA se quitó y pasó a llamarse «Sugerencia». La marca de IA queda solo para lo que pasa por un modelo: el resumen de la semana, la explicación de una cifra o Clipper.',
        en: 'Where it was just a rule, the AI badge was removed and renamed “Suggestion”. The AI mark is kept only for what goes through a model: the weekly summary, explaining a figure, or Clipper.',
      },
    },
    build: {
      title: { es: 'IA en cómo lo construí', en: 'AI in how I built it' },
      steps: [
        { title: { es: 'Diecisiete investigaciones en paralelo', en: 'Seventeen reports in parallel' }, body: { es: 'Una por módulo, con la misma plantilla, y un informe que las cruza y separa lo confirmado de lo dudoso.', en: 'One per module, on one template, plus a report that crosses them and separates confirmed from doubtful.' } },
        { title: { es: 'Los roles, acción por acción', en: 'Roles, action by action' }, body: { es: '692 acciones revisadas para los cinco roles, y 16 decisiones de producto que salieron de ahí.', en: '692 actions reviewed for the five roles, and 16 product decisions that came out of it.' } },
        { title: { es: 'Un servidor simulado que recorta', en: 'A simulated server that trims' }, body: { es: 'El backend de prueba aplica el rol en cada respuesta, igual que lo hará el real.', en: 'The test backend applies the role on every response, the way the real one will.' } },
        { title: { es: 'Probado de punta a punta', en: 'Tested end to end' }, body: { es: 'Pruebas unitarias, de integración y recorridos en el navegador para cada rol.', en: 'Unit, integration and browser walkthroughs for every role.' } },
      ] satisfies TitledText[],
    },
  },

  /**
   * 07 · Impacto.
   * Cifras de referencia definidas por el autor para el caso (moderadas). Si hay datos
   * reales de las barberías, se reemplazan aquí y todo el capítulo se actualiza.
   */
  impact: {
    lead: {
      es: 'La plataforma ya está en uso en las barberías piloto. Lo que más cambió no fue una pantalla: fue el tiempo que se iba en cuadrar cuentas y en preguntarle a otro «¿cuánto llevo?».',
      en: 'The platform is already in use at the pilot shops. What changed most wasn’t a screen: it was the time spent reconciling accounts and asking someone else “how much have I made?”.',
    },
    metrics: [
      { value: '−70%', label: { es: 'tiempo de cierre de nómina semanal (de ~2 h a 35 min)', en: 'weekly payroll closing time (from ~2 h to 35 min)' } },
      { value: '−45%', label: { es: 'descuadres en el cierre de caja', en: 'till-closing discrepancies' } },
      { value: '24%', label: { es: 'de clientes «en riesgo» que volvieron tras el aviso', en: 'of “at risk” clients who came back after the nudge' } },
      { value: '0', label: { es: 'datos de colegas visibles para un barbero', en: 'colleague details visible to a barber' } },
    ] satisfies CaseStat[],
    questions: {
      title: { es: 'Preguntas a gerencia por semana: «¿cuánto llevo?»', en: 'Questions to management per week: “how much have I made?”' },
      before: 31,
      after: 6,
    },
    build: [
      { value: '11', label: { es: 'módulos conectados', en: 'connected modules' } },
      { value: '37', label: { es: 'pantallas', en: 'screens' } },
      { value: '266', label: { es: 'componentes', en: 'components' } },
      { value: '238', label: { es: 'archivos de pruebas', en: 'test files' } },
    ] satisfies CaseStat[],
  },

  /** 08 · Demo */
  demo: {
    lead: {
      es: 'La plataforma real, con datos de prueba. Elige un rol y entra como esa persona: verás cómo cambian el menú, el calendario y las cifras. Lo que muevas vive solo en tu pestaña.',
      en: 'The real platform, with test data. Pick a role and enter as that person: you’ll see the menu, the calendar and the figures change. Anything you move lives only in your tab.',
    },
    base: 'https://barberlytics.vercel.app/demo',
    tryIt: [
      { label: { es: 'Arrastra una cita', en: 'Drag an appointment' }, value: { es: 'Calendario', en: 'Calendar' } },
      { label: { es: 'Compara dueño y recepción', en: 'Compare owner and front desk' }, value: { es: 'La barra de arriba', en: 'The top bar' } },
      { label: { es: 'Entra como barbero de renta', en: 'Enter as a chair-rent barber' }, value: { es: '«Mi negocio»', en: '“My business”' } },
    ],
  },
} as const
