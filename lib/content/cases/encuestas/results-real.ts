/**
 * La página de resultados de «Clima Organizacional - Q1 2026» (c2026-1) tal como la muestra el playground en staging
 * (`staging-playground.ubits.co/admin/desempeno-cultura/encuestas/c2026-1/resultados?ver=todos`) y las capturas
 * `res-*.webp`: cifras, textos y primeras filas copiados del producto, sin inventar. Solo en español, como el producto.
 */

export const HEADER = {
  title: 'Clima Organizacional - Q1 2026',
  status: 'Finalizada',
  meta: ['Clima', '15 ene 2026 – 30 ene 2026', '520 invitados', 'Pública'],
} as const

/** Cómo se dibuja la mini gráfica de cada tarjeta de cifras. */
export type Chart =
  | { kind: 'ring'; value: number; color: string }
  | { kind: 'donut'; parts: readonly { value: number; color: string }[] }
  | { kind: 'gauge'; value: number }
  | { kind: 'bars'; values: readonly number[] }

export interface Kpi {
  label: string
  /** La cifra grande; `count` es el número que cuenta hacia arriba, el resto se escribe tal cual. */
  value: string
  count?: { to: number; decimals?: number; prefix?: string; suffix?: string; thousands?: boolean }
  unit?: string
  detail: string
  info?: boolean
  chart: Chart
}

export type TabId = 'participacion' | 'favorabilidad' | 'preguntas' | 'enps' | 'ia' | 'accionables'

export interface Tab {
  id: TabId
  label: string
  isNew?: boolean
  kpis: readonly Kpi[]
}

const GREEN = '#1aa463'
const YELLOW = '#f2b51c'
const RED = '#c8102e'

export const TABS: readonly Tab[] = [
  {
    id: 'participacion',
    label: 'Participación',
    kpis: [
      { label: 'Total de participación', info: true, value: '91 %', count: { to: 91, suffix: ' %' }, detail: 'Buena · 473 de 520 · meta 80 %', chart: { kind: 'ring', value: 91, color: GREEN } },
      { label: 'Estado de los invitados', value: '520', count: { to: 520 }, unit: 'en total', detail: '473 completadas · 31 en progreso · 16 faltan', chart: { kind: 'donut', parts: [{ value: 473, color: GREEN }, { value: 31, color: YELLOW }, { value: 16, color: RED }] } },
      { label: 'Área con menor participación', value: '20 %', count: { to: 20, suffix: ' %' }, detail: 'Finanzas 20 % · Comercial 25 % · Logística 77,8 %', chart: { kind: 'bars', values: [20, 25, 77.8] } },
    ],
  },
  {
    id: 'favorabilidad',
    label: 'Favorabilidad',
    kpis: [
      { label: 'Favorabilidad general', info: true, value: '39 %', count: { to: 39, suffix: ' %' }, detail: 'Desfavorable · meta 70 %', chart: { kind: 'ring', value: 39, color: RED } },
      { label: 'Distribución de respuestas', value: '21.497', count: { to: 21497, thousands: true }, unit: 'en total', detail: '8.362 favorables · 9.582 neutrales · 3.508 desfavorables · 45 ns/nr', chart: { kind: 'donut', parts: [{ value: 8362, color: GREEN }, { value: 9582, color: YELLOW }, { value: 3508, color: RED }] } },
      { label: 'Área más desfavorable', value: '3,0', count: { to: 3, decimals: 1 }, detail: 'Gente y Cultura 3,0 · Tecnología 3,1 · Producto 3,2', chart: { kind: 'bars', values: [3, 3.1, 3.2] } },
    ],
  },
  {
    id: 'preguntas',
    label: 'Preguntas',
    kpis: [
      { label: 'Sentimiento promedio', info: true, value: '45', count: { to: 45 }, detail: 'Neutral · 353 positivos · 256 neutrales · 469 negativos', chart: { kind: 'donut', parts: [{ value: 353, color: GREEN }, { value: 256, color: YELLOW }, { value: 469, color: RED }] } },
      { label: 'Resumen de respuestas', value: '54', count: { to: 54 }, unit: 'preguntas', detail: '24.897 de 28.080 respuestas posibles · 473 personas', chart: { kind: 'ring', value: 88.7, color: GREEN } },
      { label: 'Área con más sentimiento negativo', value: '51,8 %', count: { to: 51.8, decimals: 1, suffix: ' %' }, detail: 'Operaciones 51,8 % · Finanzas 50 % · Comercial 44,6 %', chart: { kind: 'bars', values: [51.8, 50, 44.6] } },
    ],
  },
  {
    id: 'enps',
    label: 'eNPS',
    kpis: [
      { label: 'Puntaje eNPS', info: true, value: '-3', count: { to: -3 }, detail: 'Crítico · 459 respuestas', chart: { kind: 'gauge', value: -3 } },
      { label: 'Distribución de respuestas', value: '459', count: { to: 459 }, unit: 'en total', detail: '206 promotores · 31 neutros · 222 detractores', chart: { kind: 'donut', parts: [{ value: 206, color: GREEN }, { value: 31, color: YELLOW }, { value: 222, color: RED }] } },
      { label: 'Área más detractora', value: '+3', count: { to: 3, prefix: '+' }, detail: 'Legal +3 · Logística +3 · Operaciones +7', chart: { kind: 'bars', values: [3, 3, 7] } },
    ],
  },
  {
    id: 'ia',
    label: 'Análisis con IA',
    isNew: true,
    kpis: [
      { label: 'Lecturas de la IA', info: true, value: '9', count: { to: 9 }, detail: '67 % con confiabilidad alta', chart: { kind: 'ring', value: 67, color: '#7c3aed' } },
      { label: 'Qué contiene la lectura', value: '9', count: { to: 9 }, unit: 'en total', detail: '3 hallazgos · 3 riesgos · 3 acciones sugeridas', chart: { kind: 'donut', parts: [{ value: 3, color: GREEN }, { value: 3, color: RED }, { value: 3, color: '#2563eb' }] } },
      { label: 'Sección con mayor foco accionable', value: '81,1 %', count: { to: 81.1, decimals: 1, suffix: ' %' }, detail: 'Bienestar y carga de trabajo 81,1 % · Desarrollo y crecimiento 79,1 % · Reconocimiento y compensación 76,3 %', chart: { kind: 'bars', values: [81.1, 79.1, 76.3] } },
    ],
  },
  { id: 'accionables', label: 'Accionables', isNew: true, kpis: [] },
]

/* El primer bloque de cada pestaña. */

export const PARTICIPATION_ROWS: readonly { initials: string; name: string; area: string; status: 'En progreso' | 'Falta' }[] = [
  { initials: 'JR', name: 'Juliana Ramírez Vargas', area: 'Producto', status: 'En progreso' },
  { initials: 'EH', name: 'Elena Hernández Rodríguez', area: 'Finanzas', status: 'En progreso' },
  { initials: 'DC', name: 'Daniel Cifuentes Restrepo', area: 'Legal', status: 'Falta' },
  { initials: 'AQ', name: 'Ana Quintero Cárdenas', area: 'Operaciones', status: 'Falta' },
]

export const FAVORABILITY = {
  section: { n: '1', title: 'Propósito y estrategia', meta: '6 preguntas · 2 subsecciones', value: '68,1 %' },
  sub: { n: '1.1', title: 'Claridad estratégica', meta: '3 preguntas', value: '59,2 %' },
  rows: [
    { q: 'Entiendo claramente la misión de la organización y hacia dónde va.', fav: 58, neu: 37, des: 5, value: '57,6 %' },
    { q: 'Conozco los objetivos estratégicos definidos para este año.', fav: 66, neu: 32, des: 2, value: '65,5 %' },
    { q: 'Las prioridades de la organización se mantienen estables el tiempo suficiente para poder avanzar en ellas.', fav: 55, neu: 35, des: 10, value: '54,7 %' },
  ],
  next: [
    { n: '1.2', title: 'Mi rol en la estrategia', value: '77,1 %' },
    { n: '2', title: 'Liderazgo', value: '36,8 %' },
  ],
} as const

export const COMMENTS = {
  section: { n: '3', title: 'Colaboración y comunicación', meta: '334 comentarios', negatives: '48 %' },
  question: { q: '¿Con qué área te resulta más difícil coordinar y por qué?', pos: 28, neu: 24, neg: 48, total: 334 },
  items: [
    { text: 'Las reuniones consumen el día entero y no queda tiempo para el trabajo real.', who: 'Isabella Cárdenas Restrepo · Servicio al cliente · México · 12 feb', topic: 'Procesos' },
    { text: 'Falta claridad sobre cómo se decide un ascenso. He visto promociones sin criterio visible.', who: 'Carlos Ortiz López · Logística · México · 11 feb', topic: 'Crecimiento' },
  ],
} as const

export const ENPS = {
  section: { n: '1', title: 'Recomendabilidad General', meta: '4 preguntas · 2 subsecciones', value: '+24' },
  sub: { n: '1.1', title: 'Satisfacción laboral', meta: '2 preguntas · 1 subsección', value: '+16' },
  row: { q: 'Me siento orgulloso/a de formar parte de esta empresa.', pro: 66, neu: 0, det: 34, value: '+7' },
  next: [
    { n: '1.2', title: 'Confianza en la organización', value: '+31' },
    { n: '2', title: 'Compromiso y Lealtad', value: '+10' },
  ],
} as const

export const AI_READING = {
  summary:
    'La medición cierra con 39 % de favorabilidad y 91 % de participación (473 de 520 personas). Frente a la medición anterior la favorabilidad sube 4,1 pp. El contraste está entre "Colaboración y comunicación" (74,4 %), que sostiene el resultado, y "Bienestar y carga de trabajo" (18,9 %), donde se concentra el problema.',
  findings: [
    { title: '"Colaboración y comunicación" es la fortaleza más sólida', confidence: 'Alta', body: 'Es el bloque con mayor favorabilidad de la encuesta y está por encima del promedio general en 35,4 pp. Sirve como base para explicar los cambios que vengan: lo que funciona aquí es lo que la organización ya sabe hacer.', evidence: '3 Colaboración y comunicación: 74,4 % · 2796 respuestas' },
    { title: 'La participación se mantiene alta', confidence: 'Alta' },
    { title: 'Una sola pregunta marca el piso del resultado', confidence: 'Media' },
  ],
} as const

export const ACTIONS = {
  total: 14,
  note: 'Cada accionable funciona con tareas: se le asigna una a quien debe actuar (el líder, el grupo, el responsable del módulo) y solo queda marcada como hecha cuando el entregable está completo: el plan terminado, el objetivo aceptado, el pulso respondido. Mientras tanto sigue abierta y el recordatorio sigue llegando.',
  group: { n: '1', title: 'Desempeño', meta: 'Pulsos, objetivos, evaluación 360 y matriz de talento: medir el clima y volverlo un entregable del líder.', count: 6 },
  items: [
    { title: 'Pulso de control a 30 días sobre Bienestar y carga de trabajo', module: 'Encuestas', who: '520 personas · 520 colaboradores medidos', score: 98 },
    { title: 'OKR de clima para el líder de Gente y Cultura', module: 'Objetivos', who: '1 persona · Lucía Fernández, líder de Gente y Cultura', score: 96 },
    { title: 'Evaluación 360 de 10 líderes centrada en Bienestar y carga de trabajo', module: 'Evaluación 360', who: '10 personas · 10 líderes evaluados', score: 90 },
    { title: 'Pulso focalizado en Gente y Cultura', module: 'Encuestas', who: '144 personas · 144 colaboradores de Gente y Cultura', score: 88 },
  ],
} as const
