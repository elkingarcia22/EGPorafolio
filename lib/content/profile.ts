import type { L } from '@/lib/i18n'

/** Datos reales tomados de la hoja de vida y de LinkedIn (nov 2026). */

export interface Role {
  title: L
  period: string
}

export interface Job {
  company: string
  location: L
  period: string
  /** Uno o varios cargos dentro de la misma empresa (el primero es el más reciente) */
  roles: readonly Role[]
  summary: L
  /** Detalles destacados: metodologías, clientes, módulos */
  highlights?: readonly L[]
}

export interface EarlyJob {
  title: L
  company: string
  period: string
  summary?: L
}

export interface Study {
  title: L
  school: string
  period: string
  note?: L
}

export interface Badge {
  level: number
  year: string
  /** color del sello UX-PM */
  color: string
}

export interface ToolGroup {
  title: L
  tools: readonly string[]
}

export const PROFILE = {
  firstName: 'elkin',
  lastName: 'GARCIA',
  email: 'garcia.elkin.salazar@gmail.com',
  /** Número en formato internacional sin "+" (WhatsApp y llamadas) */
  phone: '573202172738',
  phoneDisplay: '+57 320 217 2738',
  /** URL completa del perfil de LinkedIn; si está vacía, no se muestra */
  linkedin: '',
  location: { es: 'Bogotá, Colombia', en: 'Bogotá, Colombia' } satisfies L,
  role: { es: 'Diseñador UX/UI Specialist', en: 'UX/UI Design Specialist' } satisfies L,
  startYear: 2011,
  currentYear: 2026,
  summary: {
    es: 'Senior Product & UX/UI Designer con más de 10 años liderando proyectos digitales end-to-end. Combino investigación, diseño visual y sistemas de diseño, e integro IA para acelerar ideación, validación y pruebas. Hoy además construyo las herramientas: productos que usan miles de personas.',
    en: 'Senior Product & UX/UI Designer with 10+ years leading digital projects end to end. I combine research, visual design and design systems, and I use AI to speed up ideation, validation and testing. Today I also build the tools themselves: products used by thousands of people.',
  } satisfies L,
} as const

/** Experiencia principal en producto digital. */
export const JOBS: readonly Job[] = [
  {
    company: 'UBITS',
    location: { es: 'Colombia · Híbrido', en: 'Colombia · Hybrid' },
    period: '2021 — 2026',
    roles: [{ title: { es: 'Diseñador UX/UI Senior Specialist', en: 'Senior UX/UI Design Specialist' }, period: 'jun 2021 — hoy' }],
    summary: {
      es: 'Lidero proyectos digitales de principio a fin en software de Recursos Humanos: objetivos, encuestas y matriz de talento. Combino investigación, diseño visual y sistemas de diseño, y uso IA para acelerar la ideación y la validación; cada decisión se conecta con adopción, engagement y outcomes de producto.',
      en: 'I lead digital projects end to end in HR software: goals, surveys and talent matrix. I combine research, visual design and design systems, and use AI to speed up ideation and validation; every decision ties back to adoption, engagement and product outcomes.',
    },
    highlights: [
      { es: 'Objetivos', en: 'Goals' },
      { es: 'Encuestas', en: 'Surveys' },
      { es: 'Matriz de talento', en: 'Talent matrix' },
      { es: 'Herramientas internas con IA', en: 'Internal AI tools' },
    ],
  },
  {
    company: 'Barberlytics',
    location: { es: 'Remoto', en: 'Remote' },
    period: '2022 — 2025',
    roles: [{ title: { es: 'Diseñador UX/UI Lead', en: 'UX/UI Design Lead' }, period: '2022 — 2025' }],
    summary: {
      es: 'App web y móvil para barberías. Diseño integral enfocado en métricas de negocio: flujos de clientes, agenda y equipo; pasarelas de pago, productos y calendario; e IA orientada al servicio y a la estrategia del negocio.',
      en: 'Web and mobile app for barbershops. End-to-end design focused on business metrics: client, schedule and staff flows; payment gateways, products and calendar; plus AI focused on service and business strategy.',
    },
    highlights: [
      { es: 'Agenda', en: 'Scheduling' },
      { es: 'Pagos', en: 'Payments' },
      { es: 'IA de negocio', en: 'Business AI' },
    ],
  },
  {
    company: 'Siigo S.A.',
    location: { es: 'Bogotá · Híbrido', en: 'Bogotá · Hybrid' },
    period: '2017 — 2021',
    roles: [
      { title: { es: 'UX/UI Lead', en: 'UX/UI Lead' }, period: 'jul 2020 — jun 2021' },
      { title: { es: 'Diseñador UX/UI', en: 'UX/UI Designer' }, period: 'mar 2017 — jun 2021' },
      { title: { es: 'Diseñador gráfico Senior', en: 'Senior Graphic Designer' }, period: 'ago 2018 — dic 2019' },
    ],
    summary: {
      es: 'ERP contable para empresas y contadores. Diseñé productos y servicios desde la investigación hasta el producto final —ideación, diseño e implementación— en nómina, facturación electrónica, inventarios, POS y contabilidad.',
      en: 'Accounting ERP for companies and accountants. I designed products and services from research to final product —ideation, design and implementation— across payroll, e-invoicing, inventory, POS and accounting.',
    },
    highlights: [
      { es: 'Design Thinking', en: 'Design Thinking' },
      { es: 'Lean UX', en: 'Lean UX' },
      { es: 'Agile UX', en: 'Agile UX' },
      { es: 'Scrum', en: 'Scrum' },
      { es: 'Agile Inception', en: 'Agile Inception' },
      { es: 'Shape Up', en: 'Shape Up' },
    ],
  },
]

/** Trayectoria previa: diseño gráfico, dirección de arte y e-learning. */
export const EARLY_JOBS: readonly EarlyJob[] = [
  {
    title: { es: 'Diseñador gráfico', en: 'Graphic Designer' },
    company: 'ADD Consultores SAS',
    period: '2017 — 2019',
    summary: {
      es: 'Cursos e-learning de alta interactividad y gamificación para Contecar, Corficolombiana y Puerto de Cartagena.',
      en: 'Highly interactive, gamified e-learning courses for Contecar, Corficolombiana and Port of Cartagena.',
    },
  },
  {
    title: { es: 'Director de arte', en: 'Art Director' },
    company: 'PIXEL GD S.A.S.',
    period: '2016 — 2018',
    summary: {
      es: 'Piezas y campañas para multinacionales como CognosOnline, Blackboard y Rosetta Stone.',
      en: 'Pieces and campaigns for multinationals such as CognosOnline, Blackboard and Rosetta Stone.',
    },
  },
  {
    title: { es: 'Jefe de diseño', en: 'Head of Design' },
    company: 'Emisora Mariana',
    period: '2014 — 2016',
    summary: {
      es: 'Publicidad y diseño para la organización Agustinianos, la Emisora Mariana y la Universidad Agustiniana.',
      en: 'Advertising and design for the Augustinian organization, Emisora Mariana and Universidad Agustiniana.',
    },
  },
  { title: { es: 'Diseñador gráfico', en: 'Graphic Designer' }, company: 'AYZ Publicidad', period: '2012' },
  { title: { es: 'Practicante de diseño gráfico', en: 'Graphic Design Intern' }, company: 'Policía Nacional de Colombia', period: '2011' },
]

export const STUDIES: readonly Study[] = [
  {
    title: { es: 'Carrera de Diseño de Producto', en: 'Product Design track' },
    school: 'Platzi',
    period: '2019',
    note: { es: 'Aprobada el 28 de agosto de 2019', en: 'Completed August 28, 2019' },
  },
  {
    title: { es: 'Carrera de Diseño de Experiencia de Usuario (UX)', en: 'User Experience (UX) Design track' },
    school: 'Platzi',
    period: '2018 — 2019',
    note: { es: 'Aprobada el 23 de abril de 2019', en: 'Completed April 23, 2019' },
  },
  {
    title: { es: 'Carrera de Diseño de Interfaces (UI)', en: 'User Interface (UI) Design track' },
    school: 'Platzi',
    period: '2018 — 2019',
  },
  {
    title: { es: 'Certificación internacional UX-PM', en: 'International UX-PM certification' },
    school: 'UXalliance',
    period: '2018',
    note: { es: 'Niveles 1, 2 y 3', en: 'Levels 1, 2 and 3' },
  },
  {
    title: { es: 'Diseñador Gráfico (profesional)', en: 'Graphic Designer (bachelor’s)' },
    school: 'Fundación Universitaria Los Libertadores',
    period: '2010 — 2014',
  },
]

/** Sellos UX-PM de UXalliance (2018). */
export const UX_PM_BADGES: readonly Badge[] = [
  { level: 1, year: '2018', color: '#2cb5c0' },
  { level: 2, year: '2018', color: '#6db33f' },
  { level: 3, year: '2018', color: '#b88a2e' },
]

export const SKILLS: readonly L[] = [
  { es: 'Diseño de interacciones', en: 'Interaction design' },
  { es: 'Integración AI/UX', en: 'AI/UX integration' },
  { es: 'Prototipado en código y no-code', en: 'Code & no-code prototyping' },
  { es: 'User research & testing', en: 'User research & testing' },
  { es: 'Arquitectura de información', en: 'Information architecture' },
  { es: 'Design systems', en: 'Design systems' },
  { es: 'Pensamiento crítico', en: 'Critical thinking' },
  { es: 'Estrategia de producto', en: 'Product strategy' },
  { es: 'Empatía con el usuario', en: 'User empathy' },
]

/** Herramientas agrupadas; la IA va primero. */
export const TOOL_GROUPS: readonly ToolGroup[] = [
  {
    title: { es: 'IA', en: 'AI' },
    tools: ['Claude', 'Claude Code', 'Cursor', 'Antigravity', 'ChatGPT', 'Figma Make'],
  },
  {
    title: { es: 'Diseño', en: 'Design' },
    tools: ['Figma', 'Adobe'],
  },
  {
    title: { es: 'Producto y datos', en: 'Product & data' },
    tools: ['Supabase', 'Notion', 'Jira', 'n8n / Make'],
  },
]

/** Lista plana (la usa el agente). */
export const TOOLS: readonly string[] = TOOL_GROUPS.flatMap((g) => g.tools)
