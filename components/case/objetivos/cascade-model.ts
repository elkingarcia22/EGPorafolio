/**
 * Modelo pequeño de un ciclo de objetivos, con nombres y reglas sacados del playground de UBITS
 * (`modelo/configuracion.ts`, `modelo/resultados/seguimiento.ts`): la escala de cumplimiento, los estados
 * y la cascada empresa → área → persona. Lo usan la portada, los capítulos y la demo.
 */

export type TramoId = 'no-cumplio' | 'no-cumplio-parcial' | 'cumplio-parcial' | 'cumplido' | 'sobrecumplio'

export interface Tramo {
  id: TramoId
  nombre: string
  desde: number
  hasta: number
  /** Color del tramo (hex), igual a los tonos de la plataforma. */
  color: string
}

/** La escala de la plataforma (30-oct): 0 no cumplió; 1–69 parcial; 70–99 en parte; 100; 101–150. */
export const ESCALA: readonly Tramo[] = [
  { id: 'no-cumplio', nombre: 'No cumplió', desde: 0, hasta: 0, color: '#d92d20' },
  { id: 'no-cumplio-parcial', nombre: 'No cumplió parcialmente', desde: 1, hasta: 69, color: '#f38744' },
  { id: 'cumplio-parcial', nombre: 'Cumplió parcialmente', desde: 70, hasta: 99, color: '#0c5bef' },
  { id: 'cumplido', nombre: 'Cumplido', desde: 100, hasta: 100, color: '#067647' },
  { id: 'sobrecumplio', nombre: 'Sobrecumplió', desde: 101, hasta: 150, color: '#17b26a' },
]

export const tramoDe = (pct: number): Tramo => {
  const v = Math.round(Math.max(0, Math.min(150, pct)))
  return ESCALA.find((t) => v >= t.desde && v <= t.hasta) ?? ESCALA[ESCALA.length - 1]
}

export type Etapa = 'por-aprobar' | 'aprobado' | 'por-ajustar'

export interface ObjetivoPersona {
  id: string
  titulo: string
  persona: string
  area: string
  /** Objetivo de empresa al que empuja, o null si quedó sin alinear. */
  empresa: string | null
  peso: number
  avance: number
  etapa: Etapa
}

export interface ObjetivoEmpresa {
  id: string
  titulo: string
  corto: string
}

export const EMPRESA: readonly ObjetivoEmpresa[] = [
  { id: 'ingresos', titulo: 'Crecer los ingresos un 15 %', corto: 'Ingresos +15 %' },
  { id: 'marca', titulo: 'Ser la marca preferida de los clientes', corto: 'Marca preferida' },
  { id: 'eficiencia', titulo: 'Operar con más eficiencia', corto: 'Eficiencia' },
]

export const AREAS = ['Comercial', 'Marketing', 'Servicio al cliente', 'Operaciones', 'Gente y Cultura'] as const

/** Objetivos de ejemplo; los títulos vienen de los mocks del playground. */
export const OBJETIVOS: readonly ObjetivoPersona[] = [
  { id: 'o1', titulo: 'Cumplir el presupuesto de ventas del periodo', persona: 'Valentina Ríos', area: 'Comercial', empresa: 'ingresos', peso: 50, avance: 82, etapa: 'aprobado' },
  { id: 'o2', titulo: 'Aumentar las ventas del trimestre', persona: 'Esteban Díaz', area: 'Comercial', empresa: 'ingresos', peso: 40, avance: 64, etapa: 'aprobado' },
  { id: 'o3', titulo: 'Aumentar la satisfacción de clientes', persona: 'Isabella Mendoza', area: 'Marketing', empresa: 'marca', peso: 40, avance: 71, etapa: 'aprobado' },
  { id: 'o4', titulo: 'Subir la adopción de la plataforma', persona: 'Nicolás Rojas', area: 'Marketing', empresa: 'marca', peso: 30, avance: 38, etapa: 'aprobado' },
  { id: 'o5', titulo: 'Reducir el tiempo de respuesta a solicitudes', persona: 'Ricardo Torres', area: 'Servicio al cliente', empresa: 'marca', peso: 35, avance: 0, etapa: 'por-aprobar' },
  { id: 'o6', titulo: 'Mantener la calidad de las entregas sobre el 90 %', persona: 'Verónica Martínez', area: 'Operaciones', empresa: 'eficiencia', peso: 30, avance: 93, etapa: 'aprobado' },
  { id: 'o7', titulo: 'Reducir los costos operativos', persona: 'Carlos Navarro', area: 'Operaciones', empresa: 'eficiencia', peso: 40, avance: 47, etapa: 'aprobado' },
  { id: 'o8', titulo: 'Documentar los procesos críticos del área', persona: 'Alejandro Díaz', area: 'Gente y Cultura', empresa: null, peso: 20, avance: 25, etapa: 'por-ajustar' },
]

/** Por qué un líder devuelve un objetivo (textos del playground). */
export const MOTIVOS_DEVUELTO = [
  'La meta no se puede medir: falta el valor de partida y a cuánto hay que llegar.',
  'Está escrito como tarea. Dilo como resultado: qué cambia cuando se cumpla.',
  'No está alineado con ningún objetivo de empresa; elige a cuál empuja.',
] as const

/** Un objetivo sin aprobar no lleva avance (29-oct): solo cuentan los aprobados. */
export const cuenta = (o: ObjetivoPersona) => o.etapa === 'aprobado'

/** Avance de un objetivo de empresa: promedio ponderado por peso de lo aprobado que cuelga de él. */
export function avanceEmpresa(objetivos: readonly ObjetivoPersona[], empresa: string): number {
  const hijos = objetivos.filter((o) => o.empresa === empresa && cuenta(o))
  const peso = hijos.reduce((s, o) => s + o.peso, 0)
  if (peso === 0) return 0
  return hijos.reduce((s, o) => s + o.avance * o.peso, 0) / peso
}

export function avanceArea(objetivos: readonly ObjetivoPersona[], area: string): number {
  const hijos = objetivos.filter((o) => o.area === area && cuenta(o))
  if (hijos.length === 0) return 0
  return hijos.reduce((s, o) => s + o.avance, 0) / hijos.length
}

export const pct = (v: number) => `${v.toFixed(v % 1 === 0 ? 0 : 1).replace('.', ',')} %`
