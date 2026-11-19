/**
 * Cifras reales de un ciclo del playground de UBITS, leídas del staging
 * (staging-playground.ubits.co · /objetivos/compania-2026-trimestres/resultados)
 * con corte al 19 nov 2026. Los textos de cada bloque son los de la plataforma.
 * Son datos sembrados del playground, no de un cliente.
 */

export const CICLO = {
  nombre: 'Objetivos de compañía 2026 · por trimestres',
  fechas: '3 may 2026 – 2 may 2027',
  personas: 80,
  objetivos: 286,
  reportaron: 79,
  corte: '19 nov 2026',
} as const

/** Periodos del ciclo. */
export const PERIODOS = [
  { id: 'Q1', estado: 'Cerrado', avance: 55.4 },
  { id: 'Q2', estado: 'Cerrado', avance: 56.1 },
  { id: 'Q3', estado: 'En curso', avance: 9.1, nota: '17 % del tiempo' },
  { id: 'Q4', estado: 'Por iniciar', avance: null, nota: '3 feb – 2 may 2027' },
] as const

/** «Cómo va»: avance real, lo esperado por calendario y adónde llega a este ritmo. */
export const PRONOSTICO = { avance: 9, calendario: 18, alCierre: 51, lectura: 'El avance va 9 puntos por detrás del calendario.' } as const

/** «Dónde mirar»: avance por área frente al calendario corrido (18 %). */
export const AVANCE_AREA = [
  { area: 'Comercial', v: 5.1 },
  { area: 'Logística', v: 8.4 },
  { area: 'Servicio al cliente', v: 8.6 },
  { area: 'Tecnología', v: 8.8 },
  { area: 'Gente y Cultura', v: 9 },
  { area: 'Marketing', v: 9.3 },
] as const

/** «Dónde se juega el ciclo»: peso por objetivo de empresa y alineación por área. */
export const PESO_EMPRESA = [
  { id: 'ingresos', label: 'Crecer los ingresos un 15 %', v: 22 },
  { id: 'marca', label: 'Ser la marca preferida de los clientes', v: 26 },
  { id: 'eficiencia', label: 'Operar con más eficiencia', v: 24 },
  { id: 'sin', label: 'Sin alinear', v: 28 },
] as const
export const ALINEACION_AREA = [
  { area: 'Servicio al cliente', v: 42 },
  { area: 'Gente y Cultura', v: 64.8 },
  { area: 'Comercial', v: 70.8 },
  { area: 'Legal', v: 72.6 },
  { area: 'Operaciones', v: 73.8 },
  { area: 'Producto', v: 75.4 },
] as const
export const ALINEACION_PROMEDIO = 70.7

/** «Qué hacer»: aprobación y devueltos sin corregir, por líder. */
export const APROBACION = [
  { id: 'aprobado', label: 'Aprobados', v: 244 },
  { id: 'por-aprobar', label: 'Por aprobar', v: 29 },
  { id: 'devuelto', label: 'Devueltos', v: 13 },
] as const
export const DEVUELTOS_LIDER = [
  { lider: 'Andrés Beltrán', objetivos: 4, v: 30.8 },
  { lider: 'Hernán Zapata', objetivos: 3, v: 23.1 },
  { lider: 'Marcela Ospina', objetivos: 2, v: 15.4 },
] as const

/** Ranking: participación de las últimas 8 semanas, podio y rachas. */
export const PARTICIPACION = [
  { semana: '25 sept', v: 0 },
  { semana: '2 oct', v: 0 },
  { semana: '9 oct', v: 0 },
  { semana: '16 oct', v: 0 },
  { semana: '23 oct', v: 0 },
  { semana: '30 oct', v: 43 },
  { semana: '6 nov', v: 66 },
  { semana: 'Esta', v: 38 },
] as const
export const PODIO = [
  { lugar: 2, area: 'Producto', v: 13.5 },
  { lugar: 1, area: 'Legal', v: 13.6 },
  { lugar: 3, area: 'Finanzas', v: 9.6 },
] as const
export const EN_RACHA = 8

export const fmt = (v: number) => `${v.toString().replace('.', ',')} %`
