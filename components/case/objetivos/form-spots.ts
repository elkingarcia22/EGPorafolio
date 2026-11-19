import type { L } from '@/lib/i18n'

/** Zona de una captura (en % de la imagen de 2000×1250) con lo que hay que mirar ahí. */
export interface Spot {
  x: number
  y: number
  w: number
  h: number
  title: L
  body: L
}

/** Inicio de Objetivos (inicio.webp). */
export const HOME_SPOTS: readonly Spot[] = [
  { x: 21.8, y: 18.8, w: 76.6, h: 18.6, title: { es: 'Para atender', en: 'To attend' }, body: { es: 'Lo que pide acción, ordenado por prioridad, con el botón que lo resuelve: «Recordar a 12».', en: 'What needs action, ranked by priority, with the button that solves it: “Remind 12”.' } },
  { x: 21.8, y: 40.2, w: 76.6, h: 15.6, title: { es: 'El pulso', en: 'The pulse' }, body: { es: 'Avance, cumplidos y personas reportando, cada cifra contra los ciclos anteriores.', en: 'Progress, goals met and people reporting, each against past cycles.' } },
  { x: 72.4, y: 9.2, w: 26.4, h: 4.8, title: { es: 'Dos entradas', en: 'Two ways in' }, body: { es: 'Crear un ciclo paso a paso o cargar objetivos desde un archivo.', en: 'Create a cycle step by step or load goals from a file.' } },
  { x: 21.8, y: 72, w: 76.6, h: 27, title: { es: 'Los ciclos con su avance', en: 'Cycles with their progress' }, body: { es: 'Mes, trimestre, año o a medida conviven en la misma lista; el avance pasa de 100 % cuando se sobrecumple.', en: 'Month, quarter, year or custom live in one list; progress goes past 100 % when exceeded.' } },
]
