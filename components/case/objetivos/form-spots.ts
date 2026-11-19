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

const STEPPER: Omit<Spot, 'title' | 'body'> = { x: 12.5, y: 20, w: 80, h: 4.4 }

/** Inicio de Objetivos (inicio.webp). */
export const HOME_SPOTS: readonly Spot[] = [
  { x: 21.8, y: 18.8, w: 76.6, h: 18.6, title: { es: 'Para atender', en: 'To attend' }, body: { es: 'Lo que pide acción, ordenado por prioridad, con el botón que lo resuelve: «Recordar a 12».', en: 'What needs action, ranked by priority, with the button that solves it: “Remind 12”.' } },
  { x: 21.8, y: 40.2, w: 76.6, h: 15.6, title: { es: 'El pulso', en: 'The pulse' }, body: { es: 'Avance, cumplidos y personas reportando, cada cifra contra los ciclos anteriores.', en: 'Progress, goals met and people reporting, each against past cycles.' } },
  { x: 72.4, y: 9.2, w: 26.4, h: 4.8, title: { es: 'Dos entradas', en: 'Two ways in' }, body: { es: 'Crear un ciclo paso a paso o cargar objetivos desde un archivo.', en: 'Create a cycle step by step or load goals from a file.' } },
  { x: 21.8, y: 72, w: 76.6, h: 27, title: { es: 'Los ciclos con su avance', en: 'Cycles with their progress' }, body: { es: 'Mes, trimestre, año o a medida conviven en la misma lista; el avance pasa de 100 % cuando se sobrecumple.', en: 'Month, quarter, year or custom live in one list; progress goes past 100 % when exceeded.' } },
]

/** Constructor, un paso por captura. */
export const BUILDER_SPOTS: Record<string, readonly Spot[]> = {
  general: [
    { ...STEPPER, title: { es: 'El recorrido se arma solo', en: 'The path builds itself' }, body: { es: 'Los pasos salen de las respuestas: quién redacta decide si hay participantes y asignación.', en: 'Steps come from the answers: who writes decides whether there are participants and assignment.' } },
    { x: 14, y: 55.6, w: 53.6, h: 8.8, title: { es: 'Duración en un toque', en: 'Length in one tap' }, body: { es: 'Mes, trimestre, semestre, año o a medida; la fecha de cierre se calcula sola.', en: 'Month, quarter, semester, year or custom; the close date is computed.' } },
    { x: 69.6, y: 26.8, w: 22.6, h: 32.4, title: { es: 'Así va el ciclo', en: 'How the cycle is going' }, body: { es: 'Cuenta lo que falta antes de continuar: 6 datos, uno por uno.', en: 'Counts what’s missing before moving on: 6 items, one by one.' } },
    { x: 12.8, y: 86, w: 56.2, h: 5.6, title: { es: 'Modelo de medición', en: 'Measurement model' }, body: { es: 'SMART, OKR, KPI, NCT, MBO o uno propio. Todo lo demás lee esas reglas.', en: 'SMART, OKR, KPI, NCT, MBO or a custom one. Everything else reads those rules.' } },
  ],
  company: [
    { ...STEPPER, title: { es: 'Cinco pasos', en: 'Five steps' }, body: { es: 'Parametrización, empresa, participantes, asignados y alineación.', en: 'Setup, company, participants, assigned and alignment.' } },
    { x: 56.6, y: 26.6, w: 12.4, h: 4, title: { es: 'Crear con IA', en: 'Create with AI' }, body: { es: 'Cinco preguntas y salen los objetivos de la empresa, con medida y dirección deducidas.', en: 'Five questions and the company goals come out, with measure and direction deduced.' } },
    { x: 54.4, y: 47.4, w: 12.2, h: 3.4, title: { es: 'Mejorar con IA', en: 'Improve with AI' }, body: { es: 'Con algo ya escrito, pule la redacción y completa lo que falte, ahí mismo.', en: 'With something already written, it polishes the wording and fills what’s missing, in place.' } },
    { x: 16.8, y: 79.6, w: 50.8, h: 9.2, title: { es: 'Medida y dirección', en: 'Measure and direction' }, body: { es: 'Dinero, porcentaje, numérico o se cumple; aumentar, reducir o mantener.', en: 'Money, percentage, number or done; increase, decrease or maintain.' } },
    { x: 69.8, y: 31.6, w: 22.2, h: 27.6, title: { es: 'Cada objetivo, «Listo»', en: 'Each goal, “Ready”' }, body: { es: 'El panel marca cuáles ya tienen todo lo necesario.', en: 'The panel flags which already have everything they need.' } },
  ],
  objectives: [
    { ...STEPPER, title: { es: 'Cuatro pasos hechos', en: 'Four steps done' }, body: { es: 'Falta solo la alineación, que llega detrás de un flag.', en: 'Only alignment is left, behind a flag.' } },
    { x: 13, y: 42.6, w: 55.6, h: 8.2, title: { es: 'Por grupos o por persona', en: 'By group or by person' }, body: { es: 'Comercial: 637 personas con 3 objetivos en una sola asignación.', en: 'Sales: 637 people with 3 goals in a single assignment.' } },
    { x: 69.8, y: 45, w: 22.2, h: 24, title: { es: 'Las cuentas del ciclo', en: 'The cycle’s numbers' }, body: { es: 'Objetivos de empresa, en grupo, asignaciones listas, personas y alineados.', en: 'Company goals, group goals, ready assignments, people and aligned.' } },
  ],
  carga: [
    { x: 60.4, y: 12, w: 37.4, h: 18.4, title: { es: '¿A qué ciclo van?', en: 'Which cycle?' }, body: { es: 'Los objetivos se resuelven contra las personas del ciclo; uno cerrado ya no recibe cambios.', en: 'Goals resolve against the cycle’s people; a closed one takes no changes.' } },
    { x: 60.4, y: 32.4, w: 37.4, h: 35.6, title: { es: 'La operación primero', en: 'Operation first' }, body: { es: 'Cargar, editar o actualizar avance: cada una espera columnas distintas.', en: 'Load, edit or update progress: each expects different columns.' } },
    { x: 86.6, y: 92.6, w: 11.2, h: 4.8, title: { es: 'Analizar antes de aplicar', en: 'Analyze before applying' }, body: { es: 'El archivo se analiza y se revisa fila a fila antes de aplicarse.', en: 'The file is analyzed and reviewed row by row before it’s applied.' } },
  ],
}
