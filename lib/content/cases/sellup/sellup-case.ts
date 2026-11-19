import type { L } from '@/lib/i18n'
import type { CaseStat, TitledText } from '@/lib/content/cases/barberlytics/types'

/**
 * Caso «SellUp»: la plataforma comercial con IA de UBITS y sus tres agentes.
 * Fuentes: el repo de SellUp (docs/ y src/), y la ficha «Agentes de SellUp»
 * (corte del 15 al 29 de octubre de 2026). Las cifras son medidas en corridas
 * reales salvo donde se marca «referencia».
 */

export type AgentId = 'a1' | 'a2' | 'a3'

/** Un paso de una cascada «primero lo gratis». */
export interface CascadeStep {
  name: L
  cost: 'free' | 'low' | 'paid' | 'human'
  note: L
}

export interface Cascade {
  id: AgentId
  agent: L
  goal: L
  stop: L
  steps: readonly CascadeStep[]
}

export const SELLUP_CASE = {
  slug: 'sellup',
  title: { es: 'SellUp', en: 'SellUp' },
  eyebrow: { es: 'Plataforma comercial con IA · UBITS', en: 'AI sales platform · UBITS' },
  tagline: {
    es: 'Tres agentes que encuentran la empresa, dan con la persona que decide y preparan el primer contacto. Una persona aprueba cada paso y nada se paga si lo gratis alcanza.',
    en: 'Three agents that find the company, reach the person who decides and prepare the first contact. A person approves every step, and nothing gets paid for if the free sources are enough.',
  },
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Producto, UX/UI y construcción con IA', en: 'Product, UX/UI and AI-assisted build' } },
    { label: { es: 'Agentes', en: 'Agents' }, value: { es: '3 en producción', en: '3 in production' } },
    { label: { es: 'Alcance', en: 'Scope' }, value: { es: '20 países · HubSpot', en: '20 countries · HubSpot' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026', en: '2026' } },
  ] satisfies { label: L; value: L }[],
  tools: ['Claude Code', 'Claude API', 'Next.js', 'Supabase', 'HubSpot', 'Apollo', 'Lusha', 'Tavily'],

  /** 01 · Los puntos */
  dots: {
    kicker: { es: '206.000 empresas. ¿A cuál llamamos mañana, a quién y qué le decimos?', en: '206,000 companies. Which one do we call tomorrow, who, and what do we say?' },
    lead: {
      es: 'Es el universo de empresas de más de 200 empleados en los 20 países donde vende UBITS. El equipo comercial buscaba prospectos a mano en Apollo o Lusha, sin un criterio común y sin saber cuántos créditos se iban en cada búsqueda. Lo que encontraba entraba a HubSpot sin revisión, con duplicados y con empresas que ya tenía otro vendedor.',
      en: 'That’s the universe of companies with more than 200 employees across the 20 countries where UBITS sells. The sales team searched for prospects by hand in Apollo or Lusha, with no shared criteria and no idea how many credits each search burned. Whatever they found went into HubSpot unreviewed, with duplicates and companies another rep already owned.',
    },
    seen: [
      { title: { es: 'Cada crédito es dinero real', en: 'Every credit is real money' }, body: { es: 'Las bases de datos comerciales cobran por persona y por teléfono, y nadie sabía cuánto costaba un prospecto que sirviera.', en: 'Commercial databases charge per person and per phone number, and nobody knew what a useful prospect cost.' } },
      { title: { es: 'HubSpot se llenaba de ruido', en: 'HubSpot was filling up with noise' }, body: { es: 'Empresas repetidas, matrices confundidas con filiales y cuentas de otro vendedor. Un CRM sucio es peor que uno vacío.', en: 'Repeated companies, parents mixed up with subsidiaries and accounts owned by another rep. A dirty CRM is worse than an empty one.' } },
      { title: { es: 'Lo gratis estaba ahí, sin usar', en: 'The free data was there, unused' }, body: { es: 'Registros oficiales de cada país, compras públicas y miles de empresas «recicladas» en HubSpot que nadie atendía.', en: 'Each country’s official registries, public procurement and thousands of “recycled” HubSpot companies nobody was working.' } },
    ] satisfies TitledText[],
    stats: [
      { value: '206.000', label: { es: 'empresas de más de 200 empleados en los 20 países', en: 'companies over 200 employees across the 20 countries' } },
      { value: '20', label: { es: 'países con sus registros oficiales conectados', en: 'countries with their official registries connected' } },
      { value: '80', label: { es: 'fuentes oficiales verificadas (auditoría del 14-10)', en: 'official sources verified (14-Oct audit)' } },
      { value: '3', label: { es: 'agentes en producción, una persona entre cada uno', en: 'agents in production, a person between each' } },
    ] satisfies CaseStat[],
  },

  /** 02 · Patrones: la misma cascada en los tres agentes */
  patterns: {
    lead: {
      es: 'Al documentar cada agente apareció la misma forma tres veces: una escalera que baja de lo gratis a lo de pago y se detiene apenas se cumple la meta. Elige un agente y mira dónde se para.',
      en: 'Documenting each agent, the same shape showed up three times: a staircase that steps down from free to paid and stops as soon as the goal is met. Pick an agent and see where it stops.',
    },
    cascades: [
      {
        id: 'a1',
        agent: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' },
        goal: { es: 'Meta: 5 empresas útiles', en: 'Goal: 5 useful companies' },
        stop: { es: 'México × Salud se detuvo en el primer escalón: 10 empresas libres de HubSpot, 0 créditos de bases comerciales.', en: 'Mexico × Healthcare stopped at the first step: 10 free HubSpot companies, 0 commercial database credits.' },
        steps: [
          { name: { es: 'Empresas libres de HubSpot', en: 'Free HubSpot companies' }, cost: 'free', note: { es: 'Recicladas, en bolsa o sin dueño', en: 'Recycled, pooled or ownerless' } },
          { name: { es: 'Registros oficiales del país', en: 'Official country registries' }, cost: 'free', note: { es: 'SII, SUNAT, RUES… por industria y tamaño', en: 'SII, SUNAT, RUES… by industry and size' } },
          { name: { es: 'Banco de empresas', en: 'Company bank' }, cost: 'free', note: { es: '1.951 verificadas esperando dueño', en: '1,951 verified, waiting for an owner' } },
          { name: { es: 'Búsqueda web', en: 'Web search' }, cost: 'low', note: { es: 'Con fuente obligatoria', en: 'Source required' } },
          { name: { es: 'Bases de datos comerciales', en: 'Commercial databases' }, cost: 'paid', note: { es: 'Con tope de créditos por búsqueda', en: 'Credit cap per search' } },
          { name: { es: 'Por revisar', en: 'To review' }, cost: 'human', note: { es: 'El vendedor aprueba o descarta', en: 'The rep approves or discards' } },
        ],
      },
      {
        id: 'a2',
        agent: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' },
        goal: { es: 'Meta: hasta 5 decisores por fuente', en: 'Goal: up to 5 decision-makers per source' },
        stop: { es: 'Davivienda: 42 contactos con correo salieron de HubSpot, sin pagar nada.', en: 'Davivienda: 42 contacts with email came from HubSpot, without paying anything.' },
        steps: [
          { name: { es: 'HubSpot primero', en: 'HubSpot first' }, cost: 'free', note: { es: 'Nunca los de otro vendedor activo', en: 'Never another active rep’s' } },
          { name: { es: 'Lo que SellUp ya conocía', en: 'What SellUp already knew' }, cost: 'free', note: { es: '180 días de vigencia', en: '180 days valid' } },
          { name: { es: 'Buscar en la base de contactos', en: 'Search the contact base' }, cost: 'free', note: { es: 'Buscar no cobra', en: 'Searching is free' } },
          { name: { es: 'Completar perfiles', en: 'Complete profiles' }, cost: 'paid', note: { es: '1 crédito por persona, tope 10', en: '1 credit per person, cap 10' } },
          { name: { es: 'El sitio de la empresa', en: 'The company website' }, cost: 'low', note: { es: 'Nombre y cargo con la frase exacta', en: 'Name and title with the exact quote' } },
          { name: { es: 'Contactos por revisar', en: 'Contacts to review' }, cost: 'human', note: { es: 'Nada se aprueba solo', en: 'Nothing approves itself' } },
        ],
      },
      {
        id: 'a3',
        agent: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' },
        goal: { es: 'Meta: hechos citados de la empresa y del decisor', en: 'Goal: cited facts about the company and the decision-maker' },
        stop: { es: 'Una investigación vale 30 días: otro decisor o canal de la misma empresa no la paga otra vez.', en: 'Research is valid for 30 days: another decision-maker or channel at the same company doesn’t pay for it again.' },
        steps: [
          { name: { es: 'Lo que SellUp ya sabe', en: 'What SellUp already knows' }, cost: 'free', note: { es: 'Ficha, contactos, historial', en: 'Record, contacts, history' } },
          { name: { es: 'El sitio oficial', en: 'The official site' }, cost: 'low', note: { es: 'Hasta 5 páginas', en: 'Up to 5 pages' } },
          { name: { es: 'Noticias y talento', en: 'News and talent' }, cost: 'low', note: { es: 'Búsqueda web con fecha', en: 'Dated web search' } },
          { name: { es: 'Prensa de RR. HH. del país', en: 'Country HR press' }, cost: 'low', note: { es: 'Fuentes propias de cada país', en: 'Each country’s own sources' } },
          { name: { es: 'Rumbo busca y lee', en: 'Rumbo searches and reads' }, cost: 'paid', note: { es: 'Solo si no hubo resultados', en: 'Only if nothing turned up' } },
          { name: { es: 'Revisar y contactar', en: 'Review and reach out' }, cost: 'human', note: { es: 'No envía nada solo', en: 'Sends nothing on its own' } },
        ],
      },
    ] satisfies Cascade[],
    insights: [
      { es: 'El costo no se optimiza al final: se diseña en el orden de las fuentes.', en: 'Cost isn’t optimized at the end: it’s designed into the order of the sources.' },
      { es: 'Un nombre parecido no es la misma empresa. Solo el dominio exacto o el número fiscal oficial cuentan.', en: 'A similar name isn’t the same company. Only the exact domain or the official tax ID count.' },
      { es: 'La confianza viene de decir de dónde salió cada dato: «3 ya estaban en HubSpot y 6 son nuevos».', en: 'Trust comes from saying where each piece of data came from: “3 were already in HubSpot and 6 are new.”' },
    ] satisfies L[],
  },

  /** 03 · La idea */
  idea: {
    hmw: {
      es: '¿Cómo podríamos darle a cada vendedor la empresa, la persona y las palabras correctas, sin gastar un crédito de más ni escribir en HubSpot sin permiso?',
      en: 'How might we give every rep the right company, the right person and the right words, without spending an extra credit or writing to HubSpot without permission?',
    },
    principles: [
      { title: { es: 'El modelo propone, las herramientas verifican, la persona decide', en: 'The model proposes, tools verify, the person decides' }, body: { es: 'Ningún agente aprueba solo. Todo llega a una bandeja de revisión o queda marcado para revisar.', en: 'No agent approves on its own. Everything lands in a review queue or gets flagged for review.' } },
      { title: { es: 'Primero lo gratis', en: 'Free first' }, body: { es: 'HubSpot, los registros oficiales y lo ya guardado antes que cualquier proveedor de pago.', en: 'HubSpot, official registries and what’s already stored before any paid provider.' } },
      { title: { es: 'HubSpot se escribe solo cuando una persona actúa', en: 'HubSpot is written only when a person acts' }, body: { es: 'Buscar e investigar solo leen. Al aprobar se escribe, y nunca se pisa un campo lleno.', en: 'Searching and researching only read. Approving writes, and a filled field is never overwritten.' } },
      { title: { es: 'Todo deja rastro', en: 'Everything leaves a trace' }, body: { es: 'Cada corrida registra fuente, créditos y costo. Si un proveedor no reporta el costo, queda «desconocido», nunca cero.', en: 'Every run records source, credits and cost. If a provider doesn’t report cost, it stays “unknown”, never zero.' } },
    ] satisfies TitledText[],
  },
} as const
