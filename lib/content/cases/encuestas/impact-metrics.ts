import type { L } from '@/lib/i18n'

/**
 * Métricas del capítulo Impacto. El módulo todavía no corre con clientes, así que
 * todo lo que lleva `reference: true` es una meta de referencia, modesta a propósito,
 * no un resultado medido. Lo demás (NOM 035) son reglas verificadas en el playground.
 */

/** Una métrica que va de una línea base a una meta. `lowerIsBetter` invierte la lectura. */
export interface Shift {
  id: string
  label: L
  hint: L
  from: number
  to: number
  unit: string
  lowerIsBetter?: boolean
  reference: true
}

export const SUS: Shift = {
  id: 'sus',
  label: { es: 'Puntaje SUS del flujo de creación', en: 'SUS score of the creation flow' },
  hint: { es: 'Cómo la mediremos: prueba de usabilidad con admins de RR. HH. al salir. Hoy y meta son de referencia.', en: 'How we’ll measure it: a usability test with HR admins at launch. Today and goal are reference figures.' },
  from: 64,
  to: 76,
  unit: '',
  reference: true,
}

export const USABILITY: readonly Shift[] = [
  {
    id: 'exito',
    label: { es: 'Crean una encuesta sin ayuda', en: 'Create a survey unaided' },
    hint: { es: 'Éxito de tarea, desde plantilla', en: 'Task success, from a template' },
    from: 72,
    to: 88,
    unit: '%',
    reference: true,
  },
  {
    id: 'tiempo',
    label: { es: 'Tiempo para armar un clima desde plantilla', en: 'Time to build a climate survey from a template' },
    hint: { es: 'Índice: hoy = 100', en: 'Index: today = 100' },
    from: 100,
    to: 70,
    unit: '',
    lowerIsBetter: true,
    reference: true,
  },
  {
    id: 'abandono',
    label: { es: 'Abandonan la creación a mitad', en: 'Abandon creation midway' },
    hint: { es: 'Borradores sin publicar a los 7 días', en: 'Unpublished drafts after 7 days' },
    from: 18,
    to: 12,
    unit: '%',
    lowerIsBetter: true,
    reference: true,
  },
]

/** Rotación voluntaria trimestral (%), áreas con y sin plan de acción cerrado. Serie de referencia. */
export const TURNOVER = {
  quarters: ['T1', 'T2', 'T3', 'T4'] as const,
  withPlan: [14.0, 13.6, 13.0, 12.5],
  withoutPlan: [14.0, 14.1, 13.9, 14.0],
}

export const RETENTION: readonly Shift[] = [
  {
    id: 'participacion',
    label: { es: 'Participación con recordatorios por grupo', en: 'Participation with per-group reminders' },
    hint: { es: 'En vez de un recordatorio a toda la empresa', en: 'Instead of one company-wide reminder' },
    from: 78,
    to: 83,
    unit: '%',
    reference: true,
  },
  {
    id: 'planes',
    label: { es: 'Mediciones que terminan en un plan con dueño', en: 'Measurements that end in an owned plan' },
    hint: { es: 'Accionables creados desde resultados', en: 'Actions created from results' },
    from: 35,
    to: 45,
    unit: '%',
    reference: true,
  },
]

/** Reglas de la NOM-035-STPS-2018 tal como las aplica el producto (verificadas en el código del playground). */
export const NOM_RULES: readonly { value: string; label: L }[] = [
  { value: '3', label: { es: 'plantillas oficiales: Guías de Referencia I, II y III', en: 'official templates: Reference Guides I, II and III' } },
  { value: '100 %', label: { es: 'de participación exigida por la norma antes de leer un grupo', en: 'participation required by the standard before reading a group' } },
  { value: '1+', label: { es: 'dato demográfico obligatorio: la norma pide leer por grupo', en: 'required demographic: the standard asks to read by group' } },
  { value: '3', label: { es: 'documentos impresos: riesgo de la empresa, reporte individual y cartas de canalización', en: 'printed documents: company risk, individual report and referral letters' } },
]

export const NOM_GOALS: readonly Shift[] = [
  {
    id: 'adopcion',
    label: { es: 'Clientes en México que usan la plantilla normativa', en: 'Customers in Mexico using the normative template' },
    hint: { es: 'En su primer ciclo anual', en: 'In their first yearly cycle' },
    from: 25,
    to: 35,
    unit: '%',
    reference: true,
  },
  {
    id: 'reportes',
    label: { es: 'Tiempo para tener los reportes de la norma', en: 'Time to get the standard’s reports' },
    hint: { es: 'Índice: armado a mano = 100', en: 'Index: built by hand = 100' },
    from: 100,
    to: 60,
    unit: '',
    lowerIsBetter: true,
    reference: true,
  },
]
