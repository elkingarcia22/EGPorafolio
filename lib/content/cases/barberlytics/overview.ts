import type { L } from '@/lib/i18n'
import type { CaseImage, CaseStat } from './types'

const IMG = '/cases/barberlytics'

export const OVERVIEW = {
  eyebrow: { es: 'Caso 01 · Producto completo', en: 'Case 01 · Whole product' },
  title: { es: 'Barberlytics', en: 'Barberlytics' },
  tagline: {
    es: 'Un software para barberías, diseñado de punta a punta: el sistema de diseño, la reserva del cliente, la plataforma del negocio y su IA, Clipper.',
    en: 'Software for barbershops, designed end to end: the design system, the client booking, the business platform and its AI, Clipper.',
  },
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Lead UX/UI · diseño y construcción con IA', en: 'UX/UI Lead · design and build with AI' } },
    { label: { es: 'Periodo', en: 'Period' }, value: { es: '2022 — 2026', en: '2022 — 2026' } },
    { label: { es: 'Mercado', en: 'Market' }, value: { es: 'Barberías hispanohablantes en EE. UU. y Latinoamérica', en: 'Spanish-speaking barbershops in the US and Latin America' } },
    { label: { es: 'Estado', en: 'Status' }, value: { es: 'En uso · con demo pública', en: 'In use · with a public demo' } },
  ] as const satisfies readonly { label: L; value: L }[],
  tools: ['Figma', 'Claude Code', 'React', 'TypeScript', 'Vercel', 'Gemini TTS'],
  hero: {
    src: `${IMG}/platform-metrics.webp`,
    width: 2000,
    height: 1250,
    alt: {
      es: 'Métricas de Barberlytics: resumen de la semana escrito por Clipper, ventas, ticket promedio, citas y cancelación.',
      en: 'Barberlytics Metrics: a week summary written by Clipper, sales, average ticket, appointments and cancellations.',
    },
  } satisfies CaseImage,
  /** Lo que se cuenta en el caso: cuatro piezas de un mismo producto */
  pieces: [
    { id: 'thema', title: { es: 'Thema', en: 'Thema' }, what: { es: 'Sistema de diseño', en: 'Design system' }, stat: { es: '218 componentes', en: '218 components' } },
    { id: 'reserva', title: { es: 'Reserva', en: 'Booking' }, what: { es: 'Booking flow del cliente', en: 'Client booking flow' }, stat: { es: '4 versiones', en: '4 versions' } },
    { id: 'plataforma', title: { es: 'Plataforma', en: 'Platform' }, what: { es: 'El negocio por dentro', en: 'The business inside' }, stat: { es: '5 roles · 17 módulos', en: '5 roles · 17 modules' } },
    { id: 'clipper', title: { es: 'Clipper', en: 'Clipper' }, what: { es: 'La IA y su identidad', en: 'The AI and its identity' }, stat: { es: '18 herramientas', en: '18 tools' } },
  ] as const,
  context: {
    es: 'Una barbería vive de lo que se repite —el corte de siempre, cada tres semanas— y de lo que se libera a última hora. Hasta hace poco eso pasaba por el WhatsApp del dueño. Barberlytics junta la agenda, la caja, la nómina por comisión o renta, los clientes y la reserva en línea en un solo producto, y le suma un asistente que responde con los datos del negocio.',
    en: 'A barbershop lives on what repeats —the usual cut, every three weeks— and on what frees up at the last minute. Until recently all of that went through the owner’s WhatsApp. Barberlytics brings the schedule, the till, commission or chair-rent payroll, clients and online booking into one product, plus an assistant that answers with the business’s own data.',
  },
  honesty: {
    es: 'Cada proyecto cuenta su proceso completo —de la investigación al impacto— y termina con una demo para probarlo.',
    en: 'Each project tells its whole process —from research to impact— and ends with a demo you can try.',
  },
  stats: [
    { value: '218', label: { es: 'componentes documentados', en: 'documented components' } },
    { value: '17', label: { es: 'investigaciones por módulo', en: 'module research reports' } },
    { value: '692', label: { es: 'acciones mapeadas por rol', en: 'actions mapped by role' } },
    { value: '60', label: { es: 'preguntas para evaluar a Clipper', en: 'questions to evaluate Clipper' } },
  ] satisfies CaseStat[],
  live: {
    platform: 'https://barberlytics.vercel.app/docs',
    booking: 'https://booking-flow-alpha.vercel.app',
  },
}

export const CLOSING = {
  title: { es: 'Lo que me llevo', en: 'What I take away' },
  learnings: [
    {
      es: 'Un sistema de diseño escrito para que la IA también lo siga cambia la velocidad: las pantallas se arman, no se dibujan, y las reglas se cumplen solas.',
      en: 'A design system written so the AI follows it too changes the pace: screens get assembled, not drawn, and the rules enforce themselves.',
    },
    {
      es: 'Investigar con método —17 informes con la misma plantilla, fuentes marcadas como «declarado» o «sin verificar»— evita diseñar sobre suposiciones.',
      en: 'Researching with a method —17 reports on one template, sources marked as “claimed” or “unverified”— keeps the design off assumptions.',
    },
    {
      es: 'La IA útil es la que dice qué consultó, propone antes de actuar y nunca inventa una cifra. La honestidad también se diseña.',
      en: 'Useful AI says what it looked up, proposes before it acts and never makes up a number. Honesty is designed too.',
    },
  ] satisfies L[],
  next: {
    es: 'Pendiente: backend real con varias barberías, pasarela de pago, envío real de WhatsApp y el piloto.',
    en: 'Still to do: a real multi-shop backend, a payment gateway, real WhatsApp delivery and the pilot.',
  },
}
