import type { L } from '@/lib/i18n'

/**
 * Datos de la forma, la IA, el impacto y la demo del caso SellUp.
 * Cifras medidas en corridas reales de Producción (oct. 2026), según la ficha
 * «Agentes de SellUp» y docs/agent2a del repo.
 */

/** Agente 1: las cinco formas de buscar. */
export interface SearchMode {
  id: string
  name: L
  input: L
  sources: readonly L[]
  cost: L
  batch: L
}

export const SEARCH_MODES: readonly SearchMode[] = [
  {
    id: 'criterios',
    name: { es: 'Por criterios', en: 'By criteria' },
    input: { es: 'País + industria', en: 'Country + industry' },
    sources: [{ es: 'Libres de HubSpot', en: 'Free in HubSpot' }, { es: 'Registros oficiales', en: 'Official registries' }, { es: 'Banco', en: 'Bank' }, { es: 'Web', en: 'Web' }, { es: 'Bases comerciales', en: 'Commercial DBs' }],
    cost: { es: 'US$0,24–0,33 por empresa aceptada · US$0 las libres', en: 'US$0.24–0.33 per accepted company · US$0 the free ones' },
    batch: { es: 'Salud · México', en: 'Healthcare · Mexico' },
  },
  {
    id: 'competidores',
    name: { es: 'Competidores', en: 'Competitors' },
    input: { es: 'Empresa de referencia · hasta 3 países', en: 'Reference company · up to 3 countries' },
    sources: [{ es: 'Libres de HubSpot', en: 'Free in HubSpot' }, { es: 'Registros', en: 'Registries' }, { es: 'Juez de Rumbo', en: 'Rumbo judge' }, { es: '«Empresas parecidas»', en: '“Similar companies”' }],
    cost: { es: 'US$0,11–0,14 por empresa nueva', en: 'US$0.11–0.14 per new company' },
    batch: { es: 'Competidores de X · Colombia', en: 'Competitors of X · Colombia' },
  },
  {
    id: 'proveedores',
    name: { es: 'Proveedores', en: 'Suppliers' },
    input: { es: 'Referencia + país + industria', en: 'Reference + country + industry' },
    sources: [{ es: 'Compras públicas', en: 'Public procurement' }, { es: 'Casos de éxito en la web', en: 'Web case studies' }],
    cost: { es: '≈ US$0,16 por empresa nueva (privadas)', en: '≈ US$0.16 per new company (private)' },
    batch: { es: 'Proveedor de X · Chile', en: 'Supplier of X · Chile' },
  },
  {
    id: 'arbol',
    name: { es: 'Árbol', en: 'Tree' },
    input: { es: 'Grupo, filiales y países', en: 'Group, subsidiaries and countries' },
    sources: [{ es: 'Registros', en: 'Registries' }, { es: 'Rumbo en 3 ramas', en: 'Rumbo on 3 branches' }, { es: '1 crédito por grupo', en: '1 credit per group' }],
    cost: { es: 'US$0,6–1,1 por árbol · hasta ≈17 empresas', en: 'US$0.6–1.1 per tree · up to ≈17 companies' },
    batch: { es: 'Árbol · Grupo X', en: 'Tree · Group X' },
  },
  {
    id: 'importar',
    name: { es: 'Importar', en: 'Import' },
    input: { es: 'CSV o tabla pegada · hasta 100 filas', en: 'CSV or pasted table · up to 100 rows' },
    sources: [{ es: 'La lista del vendedor', en: 'The rep’s list' }, { es: 'Registros gratis', en: 'Free registries' }],
    cost: { es: 'US$0 · ≈ US$0,035 por fila si se enriquece', en: 'US$0 · ≈ US$0.035 per row if enriched' },
    batch: { es: 'Importación · 42 filas', en: 'Import · 42 rows' },
  },
]

/** Agente 1: las condiciones de «Libre en HubSpot». */
export const FREE_RULE: readonly L[] = [
  { es: 'No es cliente', en: 'Not a customer' },
  { es: 'No tiene un negocio abierto', en: 'No open deal' },
  { es: 'Nadie le hizo actividad de venta en 30 días', en: 'No sales activity in 30 days' },
  { es: 'Reciclada, en bolsa, sin dueño o con dueño desactivado', en: 'Recycled, pooled, ownerless or with a deactivated owner' },
  { es: 'Coincide el dominio exacto o el número fiscal', en: 'Exact domain or tax ID match' },
]

/** Agente 2: antes y después del arreglo del 20-10 (60 días previos). */
export const CONTACT_FIX = {
  before: [
    { value: 141, of: 193, label: { es: 'búsquedas en la base principal con 0 candidatos', en: 'main-base searches with 0 candidates' } },
    { value: 186, of: 193, label: { es: 'empresas identificadas por nombre, no por dominio', en: 'companies identified by name, not domain' } },
    { value: 124, of: 135, label: { es: 'búsquedas en la base de respaldo con 0 candidatos', en: 'backup-base searches with 0 candidates' } },
  ],
  after: [
    { label: { es: 'Davivienda, búsqueda vieja', en: 'Davivienda, old search' }, value: 0, unit: { es: 'personas', en: 'people' } },
    { label: { es: 'Davivienda, por dominio', en: 'Davivienda, by domain' }, value: 10, unit: { es: 'personas', en: 'people' } },
    { label: { es: 'Davivienda, HubSpot primero', en: 'Davivienda, HubSpot first' }, value: 42, unit: { es: 'con correo · US$0', en: 'with email · US$0' } },
  ],
} as const

/** Agente 3: los tipos de mensaje y cuándo se recomiendan. */
export const MESSAGE_TYPES: readonly { name: L; when: L; off?: boolean }[] = [
  { name: { es: 'Por un evento reciente', en: 'A recent event' }, when: { es: 'Noticia de la empresa en los últimos 90 días', en: 'Company news in the last 90 days' } },
  { name: { es: 'Por un dato', en: 'A data point' }, when: { es: 'Se le escribe a un CHRO o a un CEO', en: 'Writing to a CHRO or CEO' } },
  { name: { es: 'Por el problema', en: 'The problem' }, when: { es: 'El caso general', en: 'The general case' } },
  { name: { es: 'Directo y con permiso', en: 'Direct, with permission' }, when: { es: 'En Perú es el único permitido', en: 'The only one allowed in Peru' } },
  { name: { es: 'Pedir a quién dirigirse', en: 'Ask who to address' }, when: { es: 'No hay decisor identificado', en: 'No decision-maker identified' } },
  { name: { es: 'Dar valor primero', en: 'Value first' }, when: { es: 'Algo útil antes de pedir la reunión', en: 'Something useful before asking for the meeting' } },
  { name: { es: 'Por referencia', en: 'Referral' }, when: { es: 'Alguien refirió el contacto', en: 'Someone referred the contact' } },
  { name: { es: 'Pares del sector', en: 'Industry peers' }, when: { es: 'Apagado hasta tener clientes que se puedan nombrar', en: 'Off until there are nameable customers' }, off: true },
]

export type Channel = 'call' | 'email' | 'whatsapp' | 'linkedin'

export const CHANNELS: readonly { id: Channel; name: L; rule: L }[] = [
  { id: 'call', name: { es: 'Llamada', en: 'Call' }, rule: { es: 'Pedir permiso para 30 segundos; guion y mensaje de voz', en: 'Ask for 30 seconds; script and voicemail' } },
  { id: 'email', name: { es: 'Correo', en: 'Email' }, rule: { es: 'Asunto de 1–4 palabras, cuerpo de 50–90, un solo pedido', en: '1–4 word subject, 50–90 word body, one ask' } },
  { id: 'whatsapp', name: { es: 'WhatsApp', en: 'WhatsApp' }, rule: { es: 'En el primer contacto solo pide permiso', en: 'On first contact it only asks permission' } },
  { id: 'linkedin', name: { es: 'LinkedIn', en: 'LinkedIn' }, rule: { es: 'Menos de 300 caracteres; no vende ni pide reunión', en: 'Under 300 characters; no selling, no meeting ask' } },
]

/** 06 · IA: qué hace el modelo y qué hacen las reglas, por agente. */
export const SPLIT: readonly { agent: L; model: readonly L[]; rules: readonly L[] }[] = [
  {
    agent: { es: 'Agente 1', en: 'Agent 1' },
    model: [{ es: 'Juez de competidores', en: 'Competitor judge' }, { es: 'Rescate: completa web, sector y tamaño con cita', en: 'Rescue: fills site, sector and size with a citation' }, { es: 'Árbol del grupo en 3 ramas', en: 'Group tree on 3 branches' }],
    rules: [{ es: 'Duplicados por número fiscal, dominio y nombre', en: 'Duplicates by tax ID, domain and name' }, { es: 'Piso de 200 empleados', en: '200-employee floor' }, { es: '«Una empresa, un vendedor»', en: '“One company, one rep”' }],
  },
  {
    agent: { es: 'Agente 2', en: 'Agent 2' },
    model: [{ es: 'Leer el sitio: nombre y cargo con la frase exacta', en: 'Read the site: name and title with the exact quote' }],
    rules: [{ es: 'Reserva de créditos antes de llamar', en: 'Credit reservation before calling' }, { es: 'Privacidad que falla cerrada', en: 'Fail-closed privacy' }, { es: 'Cascada de teléfono 8 + 5', en: '8 + 5 phone waterfall' }],
  },
  {
    agent: { es: 'Agente 3', en: 'Agent 3' },
    model: [{ es: 'Investigar empresa y decisor', en: 'Research company and decision-maker' }, { es: 'Redactar por decisor y canal', en: 'Write per decision-maker and channel' }],
    rules: [{ es: 'Verificador sin IA: la cita tiene que estar en la fuente', en: 'Non-AI checker: the quote must be in the source' }, { es: 'Cifras sin fuente, tuteo, enlaces, largo', en: 'Unsourced figures, informal “tú”, links, length' }],
  },
]

/** 07 · Impacto: recibos de corridas reales. */
export interface Receipt {
  agent: L
  title: L
  date: string
  lines: readonly { label: L; value: string }[]
  total: { label: L; value: string }
  note: L
}

export const RECEIPTS: readonly Receipt[] = [
  {
    agent: { es: 'Agente 1', en: 'Agent 1' },
    title: { es: 'México × Salud', en: 'Mexico × Healthcare' },
    date: '15-10-2026',
    lines: [
      { label: { es: 'Fichas leídas en HubSpot', en: 'HubSpot records read' }, value: '33' },
      { label: { es: 'Confirmadas libres', en: 'Confirmed free' }, value: '20' },
      { label: { es: 'Entregadas a «Por revisar»', en: 'Delivered to “To review”' }, value: '10' },
      { label: { es: 'Créditos de bases comerciales', en: 'Commercial DB credits' }, value: '0' },
      { label: { es: 'Revisión de Rumbo', en: 'Rumbo review' }, value: 'US$0,37' },
      { label: { es: '3 búsquedas web', en: '3 web searches' }, value: 'US$0,05' },
    ],
    total: { label: { es: 'Total de la corrida', en: 'Run total' }, value: 'US$0,42' },
    note: { es: 'Rumbo reclasificó una empresa que HubSpot tenía como Salud: por eso la revisión es obligatoria.', en: 'Rumbo reclassified a company HubSpot had as Healthcare: that’s why review is mandatory.' },
  },
  {
    agent: { es: 'Agente 2', en: 'Agent 2' },
    title: { es: 'Davivienda · contactos', en: 'Davivienda · contacts' },
    date: '20-10-2026',
    lines: [
      { label: { es: 'Búsqueda vieja', en: 'Old search' }, value: '0' },
      { label: { es: 'Búsqueda por dominio', en: 'Search by domain' }, value: '10' },
      { label: { es: 'HubSpot primero, con correo', en: 'HubSpot first, with email' }, value: '42' },
    ],
    total: { label: { es: 'Costo de HubSpot primero', en: 'HubSpot-first cost' }, value: 'US$0' },
    note: { es: 'No faltaba gente en la base: le preguntábamos mal y, a veces, por otra empresa.', en: 'The base wasn’t missing people: we were asking it wrong and, sometimes, about another company.' },
  },
  {
    agent: { es: 'Agente 3', en: 'Agent 3' },
    title: { es: 'Davivienda · primer contacto', en: 'Davivienda · first contact' },
    date: '17-10-2026',
    lines: [
      { label: { es: 'Investigación', en: 'Research' }, value: '35 s' },
      { label: { es: 'Preparación', en: 'Preparation' }, value: '20 s' },
    ],
    total: { label: { es: 'Investigación + preparación', en: 'Research + preparation' }, value: 'US$0,098' },
    note: { es: 'De 20 preparaciones de la dueña del producto, 13 salieron listas sin revisar.', en: 'Of the product owner’s 20 preparations, 13 came out ready without review.' },
  },
]

export const LEARNINGS: readonly L[] = [
  { es: 'Medir antes de construir: el registro de costos llegó antes que el primer agente, y por eso cada decisión tiene un número detrás.', en: 'Measure before building: cost tracking arrived before the first agent, so every decision has a number behind it.' },
  { es: 'Cuando un agente devuelve cero, casi nunca falta el dato: falta la pregunta correcta.', en: 'When an agent returns zero, the data is rarely missing: the right question is.' },
  { es: 'La aprobación humana no frena: es lo que deja que el equipo confíe en lo que entra a HubSpot.', en: 'Human approval doesn’t slow things down: it’s what lets the team trust what goes into HubSpot.' },
]
