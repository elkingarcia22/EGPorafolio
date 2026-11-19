/**
 * El mapa de calor real de «Cultura y Valores - 2026 (2ª ola)» (open-cultura-ola2-2026), anónima, en Favorabilidad ›
 * Mapa de calor › Por área, tal como lo pinta el playground en staging: la sección 1 abierta como ejemplo y las demás
 * plegadas (`mapa-calor.tsx`). Cifras, filas, textos de las ayudas y tokens leídos de la página renderizada.
 * Solo en español, como el producto.
 */

export const HEATMAP_TITLE = 'Mapa de calor por área'
export const HEATMAP_DESC = '10 grupos · 4 con resultados reservados'

export const AREAS = ['Servicio al cliente', 'Gente y Cultura', 'Operaciones', 'Producto', 'Tecnología', 'Legal', 'Logística', 'Marketing', 'Finanzas', 'Comercial'] as const

/** Celda: un promedio de 1 a 5, «R» reservada (por debajo del mínimo) o «S» sin escala (pregunta abierta). */
export type Cell = number | 'R' | 'S'

export interface Row {
  /** 1 = sección raíz, 2 = subsección, 3 = pregunta (la sangría del producto: 0, ps-6, ps-10). */
  depth: 1 | 2 | 3
  numbering: string
  label: string
  total: number | null
  cells: readonly Cell[]
  /** Raíces plegadas: se ven con la flecha girada. */
  collapsed?: boolean
}

const R = 'R' as const
const S = 'S' as const
const reserved = [R, R, R, R] as const

export const ROWS: readonly Row[] = [
  { depth: 1, numbering: '1', label: 'Propósito y estrategia', total: 4.1, cells: [5.0, 3.3, 3.1, 5.0, 4.2, 2.6, ...reserved] },
  { depth: 2, numbering: '1.1', label: 'Misión y objetivos', total: 4.1, cells: [4.7, 5.0, 2.9, 3.8, 5.0, 4.9, ...reserved] },
  { depth: 3, numbering: '•', label: 'Entiendo claramente la misión de la organización y cómo impacta mi trabajo.', total: 4.3, cells: [4.7, 4.8, 2.1, 5.0, 5.0, 4.8, ...reserved] },
  { depth: 3, numbering: '•', label: 'Conozco los objetivos estratégicos y es claro cómo contribuyo a ellos.', total: 4.2, cells: [4.6, 5.0, 5.0, 5.0, 2.2, 5.0, ...reserved] },
  { depth: 3, numbering: '•', label: 'La organización comunica sus prioridades con la frecuencia suficiente.', total: 3.9, cells: [5.0, 5.0, 2.8, 5.0, 4.0, 3.3, ...reserved] },
  { depth: 2, numbering: '1.2', label: 'Alineación con el día a día', total: 4.0, cells: [4.6, 4.0, 3.9, 5.0, 5.0, 3.2, ...reserved] },
  { depth: 3, numbering: '•', label: 'Mis tareas diarias están conectadas con los objetivos del equipo.', total: 4.3, cells: [5.0, 5.0, 5.0, 3.7, 4.7, 5.0, ...reserved] },
  { depth: 3, numbering: '•', label: 'Sé qué se espera de mí en mi rol.', total: 3.8, cells: [4.8, 1.7, 2.6, 4.5, 3.0, 1.7, ...reserved] },
  { depth: 3, numbering: '•', label: '¿Qué te ayudaría a entender mejor hacia dónde va la organización?', total: null, cells: [S, S, S, S, S, S, S, S, S, S] },
  { depth: 1, numbering: '2', label: 'Liderazgo', total: 3.4, cells: [4.1, 3.8, 4.0, 4.7, 4.9, 2.0, ...reserved], collapsed: true },
  { depth: 1, numbering: '3', label: 'Experiencia general', total: 3.6, cells: [1.4, 1.8, 5.0, 2.6, 2.2, 3.3, ...reserved], collapsed: true },
]

/** Las ayudas reales de la fila 1 (Hint de cada celda): banda · respuestas · participantes. */
export const ROW1_HINTS: readonly string[] = [
  'Muy favorable · 65 respuestas · 141 participantes',
  'Neutral · 57 respuestas · 99 participantes',
  'Neutral · 20 respuestas · 31 participantes',
  'Muy favorable · 15 respuestas · 21 participantes',
  'Favorable · 8 respuestas · 12 participantes',
  'Desfavorable · 5 respuestas · 10 participantes',
  'Reservado · 2 respuestas · 5 participantes',
  'Reservado · 4 respuestas · 5 participantes',
  'Reservado · 1 respuesta · 4 participantes',
  'Reservado · 1 respuesta · 3 participantes',
]
export const RESERVED_NOTE = 'Por debajo del mínimo para mostrar resultados de este grupo.'

/** El mínimo de una encuesta anónima por defecto (`DEFAULT_ANONYMITY_THRESHOLD`). */
export const MIN_GROUP = 5
