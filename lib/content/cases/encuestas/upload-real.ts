/**
 * La carga histórica tal como la hace el playground con el archivo de muestra «Clima con participantes 2025.xlsx»
 * (Carga-historica-de-encuestas-V2/demo-samples). Las cifras salen de correr el análisis real del producto
 * (`analyzeUploaded` + `buildReviewItems` + `buildStructureSummary`) sobre ese archivo; los textos, de
 * `components/cargar/*` y `modelo/carga-historica/*`. Solo en español, como el producto.
 */

export const FILE = { name: 'Clima con participantes 2025.xlsx', size: '37 KB' } as const

export const STEPS = ['Archivos', 'Datos generales', 'Estructura'] as const

export const HEADER = {
  title: 'Cargar encuestas',
  description: 'Trae a UBITS encuestas que aplicaste por fuera, una a la vez.',
  analyzingTitle: 'Analizando el archivo',
  analyzingDescription: 'Estamos extrayendo y validando la información de tus encuestas.',
} as const

export const DROPZONE = {
  title: '¿Qué encuesta quieres cargar?',
  description: 'Sube el reporte o la base de respuestas de una encuesta de Clima, Cultura o NPS. Detectamos el tipo, las fechas, la participación, las secciones y los participantes.',
  zoneTitle: 'Elige los archivos o arrástralos aquí',
  zoneDescription: 'Excel, CSV, PDF o imágenes · hasta 10 MB',
} as const

/** `getAnalyzingCopy('files', avance, 1)`: el mensaje según el avance (arranca en 35, sube 2 cada 70 ms). */
export function analyzingStatus(progress: number): string {
  if (progress < 20) return 'Abriendo 1 archivo…'
  if (progress < 45) return 'Leyendo la estructura de cada archivo…'
  if (progress < 70) return 'Identificando el tipo de encuesta (Clima, Cultura o NPS)…'
  if (progress < 90) return 'Verificando si hay más de una encuesta en tus archivos…'
  return 'Finalizando análisis…'
}
export const ANALYSIS = { start: 35, step: 2, tickMs: 70 } as const

export const GENERAL = {
  title: 'Confirma los datos generales',
  description: 'Es lo que identificamos en los archivos. Ajústalo si algo no coincide.',
  name: 'Encuesta de Clima con participantes 2025',
  typeHint: 'No lo adivinamos: una carga con el tipo equivocado se compararía con las encuestas que no son.',
  types: ['Clima', 'Cultura', 'NPS'],
  dates: '3 mar 2025 – 21 mar 2025',
  datesHint: 'Las fechas en las que se aplicó la encuesta que estás cargando. Las sugerimos a partir del nombre del archivo.',
  visibilityHint: 'Solo puede cargarse como pública si los archivos traen las respuestas de cada participante.',
} as const

export const SUMMARY = {
  title: 'Revisa lo que vamos a cargar',
  description: 'Es lo que encontramos en los archivos. Abre una sección para ver sus preguntas.',
  indicators: [
    { label: 'Participación', value: 87.5, format: (v: number) => `${v.toFixed(1)}%`, detail: '28 de 32 respondieron' },
    { label: 'Favorabilidad neta', value: 65, format: (v: number) => `+${Math.round(v)}`, detail: '74 % favorable · 9 % desfavorable' },
    { label: 'eNPS', value: 50, format: (v: number) => String(Math.round(v)), detail: '64 % promotores · 14 % detractores' },
  ],
  participantsNote: 'La encuesta se carga pública: cada respuesta queda a nombre del usuario de UBITS con el que se vincule.',
} as const

export interface Person {
  name: string
  id: string
  idType: string
  suggestion?: { name: string; username: string; context: string }
}

export const GROUPS: readonly { title: string; tone: 'positive' | 'warning' | 'neutral'; count: number; note: string; people: readonly Person[] }[] = [
  {
    title: 'Hacen match con UBITS',
    tone: 'positive',
    count: 18,
    note: 'Su identificador coincide con el username o el correo de un usuario de UBITS, así que los vinculamos automáticamente. Sus respuestas suman a los reportes y segmentaciones de UBITS. Si alguno quedó mal vinculado, puedes corregirlo.',
    people: [{ name: 'Camila Rojas Mena', id: 'camila.rojas@empresa.co', idType: 'Correo' }],
  },
  {
    title: 'Posibles match',
    tone: 'warning',
    count: 4,
    note: 'Su identificador no coincide con el username ni con el correo de ningún usuario de UBITS, pero su nombre y apellido son idénticos a los de uno. No los vinculamos solos: decide si es el mismo usuario, si es otro, o si se crea sin usuario en la encuesta.',
    people: [
      { name: 'Francisca Leiva Toro', id: 'fran.leiva88@gmail.com', idType: 'Correo', suggestion: { name: 'Francisca Leiva Toro', username: 'francisca.leiva@empresa.co', context: 'Producción · Analista · Osorno' } },
      { name: 'Pedro Pérez González', id: '0091', idType: 'Número de documento', suggestion: { name: 'Pedro Pérez González', username: '12876543', context: 'Logística · Operario · Puerto Montt' } },
    ],
  },
  {
    title: 'Sin match en UBITS',
    tone: 'neutral',
    count: 6,
    note: 'Su identificador no coincide con el username ni con el correo de ningún usuario de UBITS, y tampoco hay un nombre igual, así que se crean como participantes solo de esta encuesta. Si sabes a qué usuario corresponden, usa "Asociar usuario".',
    people: [],
  },
]

/** Cómo queda armada: secciones con sus preguntas y los demográficos detectados. */
export const STRUCTURE = {
  sections: [
    ['Liderazgo', 3],
    ['Comunicación', 2],
    ['Desarrollo', 2],
    ['Bienestar', 2],
    ['eNPS', 1],
    ['Sin sección', 1],
  ] as const,
  demographics: ['Área', 'Cargo', 'Sede', 'Antigüedad'],
} as const
