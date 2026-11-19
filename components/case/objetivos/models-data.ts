import type { L } from '@/lib/i18n'

/**
 * Los modelos de objetivos tal como están en el playground de UBITS
 * (objetivos/modelo/constructor/objectiveModel.ts). Las reglas son las reales;
 * las «empresas tipo» que las usan son ilustrativas, no clientes.
 */
export type ModelId = 'smart' | 'okr' | 'kpi' | 'nct' | 'mbo'
export type RuleId = 'children' | 'north' | 'alignment' | 'closing' | 'cadence' | 'period'

export interface CompanyModel {
  id: ModelId
  label: string
  company: L
  why: L
  /** Cómo llama el modelo a sus piezas. */
  noun: L
  childNoun: L | null
  target: L
  example: L
  rules: Record<RuleId, L>
}

const YES: L = { es: 'Obligatorio', en: 'Required' }
const OPT: L = { es: 'Opcional', en: 'Optional' }

export const RULES: readonly { id: RuleId; label: L }[] = [
  { id: 'children', label: { es: 'Qué cuelga del objetivo', en: 'What hangs below' } },
  { id: 'north', label: { es: 'Norte de la empresa', en: 'Company north' } },
  { id: 'alignment', label: { es: 'Alineación', en: 'Alignment' } },
  { id: 'closing', label: { es: 'Cómo se cierra', en: 'How it closes' } },
  { id: 'cadence', label: { es: 'Cada cuánto se reporta', en: 'Reporting cadence' } },
  { id: 'period', label: { es: 'Duración sugerida', en: 'Suggested length' } },
]

export const MODELS: readonly CompanyModel[] = [
  {
    id: 'smart',
    label: 'SMART',
    company: { es: 'Mediana, sin método formal', en: 'Mid-size, no formal method' },
    why: { es: 'Quiere metas claras sin aprender un marco nuevo.', en: 'Wants clear goals without learning a new framework.' },
    noun: { es: 'Objetivo', en: 'Goal' },
    childNoun: { es: 'Acciones clave', en: 'Key actions' },
    target: { es: 'Meta', en: 'Target' },
    example: { es: 'Subir la satisfacción del cliente de 7,8 a 8,5 antes del 31 de marzo', en: 'Raise customer satisfaction from 7.8 to 8.5 by March 31' },
    rules: {
      children: { es: 'Acciones clave, opcionales', en: 'Key actions, optional' },
      north: OPT,
      alignment: OPT,
      closing: { es: 'Acumulado', en: 'Cumulative' },
      cadence: { es: 'Libre', en: 'Free' },
      period: { es: 'Trimestre', en: 'Quarter' },
    },
  },
  {
    id: 'okr',
    label: 'OKR',
    company: { es: 'Tecnológica en crecimiento', en: 'Growing tech company' },
    why: { es: 'Metas ambiciosas que cuelgan del norte, revisadas cada semana.', en: 'Ambitious goals hanging from the north, reviewed weekly.' },
    noun: { es: 'Objetivo', en: 'Objective' },
    childNoun: { es: 'Resultados clave', en: 'Key results' },
    target: { es: 'Meta', en: 'Target' },
    example: { es: 'Ser la plataforma más rápida · bajar la carga de 4 s a 1,5 s · reducir los bugs críticos un 40 %', en: 'Be the fastest platform · cut load from 4 s to 1.5 s · reduce critical bugs 40 %' },
    rules: {
      children: { es: 'Resultados clave, mueven el avance', en: 'Key results, drive progress' },
      north: YES,
      alignment: YES,
      closing: { es: 'Acumulado', en: 'Cumulative' },
      cadence: { es: 'Semanal', en: 'Weekly' },
      period: { es: 'Trimestre', en: 'Quarter' },
    },
  },
  {
    id: 'kpi',
    label: 'KPI',
    company: { es: 'Operación de servicio', en: 'Service operation' },
    why: { es: 'No persigue una meta: cuida que el indicador no se caiga.', en: 'Doesn’t chase a target: keeps the indicator from dropping.' },
    noun: { es: 'Indicador', en: 'Indicator' },
    childNoun: null,
    target: { es: 'Umbral', en: 'Threshold' },
    example: { es: 'Mantener la retención mensual por encima del 85 %, revisado cada mes', en: 'Keep monthly retention above 85 %, reviewed monthly' },
    rules: {
      children: { es: 'Nada', en: 'Nothing' },
      north: OPT,
      alignment: OPT,
      closing: { es: 'Umbral', en: 'Threshold' },
      cadence: { es: 'Mensual', en: 'Monthly' },
      period: { es: 'Mes', en: 'Month' },
    },
  },
  {
    id: 'nct',
    label: 'NCT',
    company: { es: 'Equipos de producto ágiles', en: 'Agile product teams' },
    why: { es: 'Quiere ver la estrategia y la ejecución en el mismo lugar.', en: 'Wants strategy and execution in one place.' },
    noun: { es: 'Compromiso', en: 'Commitment' },
    childNoun: { es: 'Tareas', en: 'Tasks' },
    target: { es: 'Meta', en: 'Target' },
    example: { es: 'El onboarding es donde perdemos clientes · bajar el abandono del registro del 40 % al 25 %', en: 'Onboarding is where we lose customers · cut sign-up drop-off from 40 % to 25 %' },
    rules: {
      children: { es: 'Tareas, obligatorias', en: 'Tasks, required' },
      north: YES,
      alignment: OPT,
      closing: { es: 'Acumulado', en: 'Cumulative' },
      cadence: { es: 'Semanal', en: 'Weekly' },
      period: { es: 'Trimestre', en: 'Quarter' },
    },
  },
  {
    id: 'mbo',
    label: 'MBO',
    company: { es: 'Corporativo con bono anual', en: 'Corporate with yearly bonus' },
    why: { es: 'Cascada de la dirección a cada persona, atada a la evaluación.', en: 'Cascade from leadership to each person, tied to review.' },
    noun: { es: 'Meta', en: 'Goal' },
    childNoun: { es: 'Hitos', en: 'Milestones' },
    target: { es: 'Meta', en: 'Target' },
    example: { es: 'Cerrar el año con el presupuesto de operación dentro de lo aprobado: cumplió / no cumplió', en: 'Close the year with the operating budget within plan: met / not met' },
    rules: {
      children: { es: 'Hitos, opcionales', en: 'Milestones, optional' },
      north: YES,
      alignment: YES,
      closing: { es: 'Cumplió o no', en: 'Met or not' },
      cadence: { es: 'Libre', en: 'Free' },
      period: { es: 'Año', en: 'Year' },
    },
  },
]
