import type { Project } from './types'

/**
 * Ficha de SellUp para el listado. El caso completo vive en
 * lib/content/cases/sellup y se muestra con SellUpCase; los campos de proceso
 * de abajo resumen ese caso para cumplir el tipo Project.
 */
export const sellup: Project = {
  slug: 'sellup',
  frequency: '05.26',
  title: { es: 'SellUp', en: 'SellUp' },
  client: 'UBITS',
  year: '2026',
  accent: '91 126 255',
  mock: 'table',
  tagline: {
    es: 'La plataforma comercial con IA de UBITS: tres agentes que encuentran la empresa, la persona que decide y las palabras del primer contacto, con una persona aprobando cada paso.',
    en: 'UBITS’s AI sales platform: three agents that find the company, the decision-maker and the words for the first contact, with a person approving every step.',
  },
  role: { es: 'Producto, UX/UI y construcción con IA', en: 'Product, UX/UI and AI-assisted build' },
  team: { es: 'Equipo comercial de UBITS', en: 'UBITS sales team' },
  duration: { es: 'Mayo — noviembre 2026', en: 'May — November 2026' },
  tools: ['Claude Code', 'Claude API', 'Next.js', 'Supabase', 'HubSpot'],
  problem: {
    context: {
      es: 'El equipo buscaba prospectos a mano en bases de pago, sin criterio común ni control del gasto, y HubSpot se llenaba de duplicados.',
      en: 'The team searched for prospects by hand in paid databases, with no shared criteria or spend control, and HubSpot filled up with duplicates.',
    },
    quotes: [
      { text: { es: '“¿A cuál llamamos mañana, a quién y qué le decimos?”', en: '“Which one do we call tomorrow, who, and what do we say?”' }, who: { es: 'La pregunta de cada lunes', en: 'Every Monday’s question' } },
    ],
    stats: [
      { value: '206.000', label: { es: 'empresas de más de 200 empleados', en: 'companies over 200 employees' } },
      { value: '20', label: { es: 'países', en: 'countries' } },
      { value: '3', label: { es: 'agentes', en: 'agents' } },
    ],
  },
  research: {
    method: { es: 'Diseño funcional por agente y auditorías contra datos de Producción.', en: 'Functional design per agent and audits against Production data.' },
    clusters: [
      { title: { es: 'Costo', en: 'Cost' }, notes: [{ es: 'Cada crédito es dinero real', en: 'Every credit is real money' }] },
      { title: { es: 'Calidad', en: 'Quality' }, notes: [{ es: 'Sin basura en HubSpot', en: 'No junk in HubSpot' }] },
    ],
    insights: [{ es: 'Primero lo gratis, y que una persona decida.', en: 'Free first, and a person decides.' }],
  },
  idea: {
    hmw: { es: '¿Cómo podríamos darle a cada vendedor la empresa, la persona y las palabras correctas?', en: 'How might we give every rep the right company, person and words?' },
    principles: [{ title: { es: 'El modelo propone, la persona decide', en: 'The model proposes, the person decides' }, body: { es: 'Nada se aprueba solo.', en: 'Nothing approves itself.' } }],
  },
  sketches: { caption: { es: 'Las tres bandejas de revisión.', en: 'The three review queues.' }, notes: [{ es: 'nada entra solo', en: 'nothing gets in alone' }] },
  form: { caption: { es: 'Tres agentes, una misma regla.', en: 'Three agents, one rule.' } },
  ai: {
    intro: { es: 'El modelo juzga y redacta; las reglas verifican.', en: 'The model judges and writes; rules verify.' },
    steps: [{ tool: 'Claude Code', prompt: { es: 'Diseño por agente, construcción por partes, auditoría al cerrar.', en: 'Design per agent, build in parts, audit at the end.' }, output: { es: '3 agentes en producción', en: '3 agents in production' } }],
  },
  results: {
    metrics: [
      { value: 0.42, prefix: 'US$', suffix: '', label: { es: 'corrida real México × Salud', en: 'real Mexico × Healthcare run' } },
      { value: 42, suffix: '', label: { es: 'contactos con correo desde HubSpot, sin costo', en: 'contacts with email from HubSpot, at no cost' } },
    ],
    learnings: [{ es: 'Medir antes de construir.', en: 'Measure before building.' }],
  },
}
