import type { L } from '@/lib/i18n'

/** Datos reales tomados de la hoja de vida (nov 2026). */

export interface Job {
  role: L
  company: string
  period: string
  summary: L
}

export interface Study {
  title: L
  school: string
  year: string
}

export const PROFILE = {
  firstName: 'elkin',
  lastName: 'GARCIA',
  email: 'garcia.elkin.salazar@gmail.com',
  location: { es: 'Bogotá, Colombia', en: 'Bogotá, Colombia' } satisfies L,
  role: { es: 'Diseñador UX/UI Specialist', en: 'UX/UI Design Specialist' } satisfies L,
  startYear: 2014,
  currentYear: 2026,
  summary: {
    es: 'Senior Product & UX/UI Designer con más de 10 años liderando proyectos digitales end-to-end. Combino investigación, diseño visual y sistemas de diseño, e integro IA para acelerar ideación, validación y pruebas. Hoy además construyo las herramientas: productos que usan miles de personas.',
    en: 'Senior Product & UX/UI Designer with 10+ years leading digital projects end to end. I combine research, visual design and design systems, and I use AI to speed up ideation, validation and testing. Today I also build the tools themselves: products used by thousands of people.',
  } satisfies L,
} as const

export const JOBS: readonly Job[] = [
  {
    role: { es: 'Diseñador UX/UI Specialist', en: 'UX/UI Design Specialist' },
    company: 'UBITS S.A Solutions',
    period: '2021 — 2026',
    summary: {
      es: 'Software de Recursos Humanos. Lidero el diseño de módulos como objetivos, encuestas y matriz de talento, conectando cada decisión de diseño con adopción, engagement y outcomes de producto.',
      en: 'HR software. I lead the design of modules such as goals, surveys and talent matrix, tying every design decision to adoption, engagement and product outcomes.',
    },
  },
  {
    role: { es: 'Diseñador UX/UI Lead', en: 'UX/UI Design Lead' },
    company: 'Barberlytics',
    period: '2022 — 2025',
    summary: {
      es: 'App web y móvil para barberías: clientes, agenda y equipo; pasarelas de pago, productos y calendario; e IA orientada al servicio y a la estrategia de negocio.',
      en: 'Web and mobile app for barbershops: clients, schedule and staff; payment gateways, products and calendar; plus AI focused on service and business strategy.',
    },
  },
  {
    role: { es: 'Diseñador UX/UI Senior', en: 'Senior UX/UI Designer' },
    company: 'Siigo S.A',
    period: '2017 — 2021',
    summary: {
      es: 'ERP contable para empresas y contadores: nómina, facturación electrónica, inventarios, POS, contabilidad y métricas de negocio.',
      en: 'Accounting ERP for companies and accountants: payroll, e-invoicing, inventory, POS, accounting and business metrics.',
    },
  },
]

export const STUDIES: readonly Study[] = [
  { title: { es: 'Carrera de Diseño de Producto', en: 'Product Design track' }, school: 'Platzi', year: '2019' },
  { title: { es: 'Certificado Internacional de UX', en: 'International UX Certificate' }, school: 'UX Alliance', year: '2018' },
  { title: { es: 'Carrera de Diseño UX', en: 'UX Design track' }, school: 'Platzi', year: '2017' },
  { title: { es: 'Carrera de Diseño UI', en: 'UI Design track' }, school: 'Platzi', year: '2016' },
  { title: { es: 'Diseño Gráfico', en: 'Graphic Design' }, school: 'Universidad Los Libertadores', year: '2014' },
]

export const SKILLS: readonly L[] = [
  { es: 'Diseño de interacciones', en: 'Interaction design' },
  { es: 'Integración AI/UX', en: 'AI/UX integration' },
  { es: 'Prototipado no-code', en: 'No-code prototyping' },
  { es: 'User research & testing', en: 'User research & testing' },
  { es: 'Arquitectura de información', en: 'Information architecture' },
  { es: 'Design systems', en: 'Design systems' },
  { es: 'Pensamiento crítico', en: 'Critical thinking' },
  { es: 'Estrategia de producto', en: 'Product strategy' },
  { es: 'Empatía con el usuario', en: 'User empathy' },
]

export const TOOLS: readonly string[] = ['Figma / Make', 'Miro', 'Adobe', 'Cursor', 'Claude Code', 'ChatGPT', 'n8n / Make']
