/**
 * Modelo de proyección de impacto de SellUp. CIFRAS DE REFERENCIA:
 * supuestos moderados para ilustrar el orden de magnitud, no resultados medidos.
 */
export const ASSUMPTIONS = {
  weeks: 46,
  /** Valor anual promedio de un contrato nuevo (USD). */
  acv: 12000,
  /** De conexión a reunión. */
  meeting: 0.2,
  /** De reunión a cierre. */
  win: 0.08,
  connectManual: 0.18,
  connectSellUp: 0.3,
  manualPerWeek: 10,
  /** Costo de IA por empresa: búsqueda + contactos + preparación (USD). */
  aiPerCompany: 0.7,
  /** Infraestructura, proveedores y mantenimiento al año (USD). */
  platformYear: 30000,
  hoursSavedWeek: 4.5,
  hourly: 15,
} as const

/** Rampa de los primeros 12 meses: los cierres llegan con unos meses de retraso. */
const RAMP: readonly number[] = [0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1, 1, 1, 1]

export interface Projection {
  manualRunRate: number
  sellUpRunRate: number
  /** ARR incremental del primer año, con rampa. */
  year1: number
  cost: number
  hoursYear: number
  hoursValue: number
  roi: number
  /** ARR acumulado mes a mes: [manual, con SellUp]. */
  series: readonly (readonly [number, number])[]
}

export function project(sellers: number, perWeek: number): Projection {
  const a = ASSUMPTIONS
  const funnel = a.meeting * a.win * a.acv
  const manualRunRate = sellers * a.manualPerWeek * a.weeks * a.connectManual * funnel
  const sellUpRunRate = sellers * perWeek * a.weeks * a.connectSellUp * funnel
  const incremental = Math.max(0, sellUpRunRate - manualRunRate)
  const year1 = (incremental * RAMP.reduce((s, r) => s + r, 0)) / 12
  const cost = sellers * perWeek * a.weeks * a.aiPerCompany + a.platformYear
  const hoursYear = sellers * a.hoursSavedWeek * a.weeks
  const hoursValue = hoursYear * a.hourly
  const roi = (year1 + hoursValue - cost) / cost
  let m = 0
  let s = 0
  const series = RAMP.map((r) => {
    m += manualRunRate / 12
    s += manualRunRate / 12 + (incremental / 12) * r
    return [m, s] as const
  })
  return { manualRunRate, sellUpRunRate, year1, cost, hoursYear, hoursValue, roi, series }
}
