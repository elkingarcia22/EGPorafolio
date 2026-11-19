/**
 * El mapa de alineación real del ciclo «Objetivos de compañía 2026 · por trimestres»: geometría copiada del
 * sankey que dibuja el playground en staging (viewBox 855×460, corte al 19 nov 2026). El grosor es lo que
 * aporta cada área y el color, cómo va: rojo (destructive) por debajo de lo esperado; gris, lo que no se alineó.
 */

export type GoalId = 'ingresos' | 'marca' | 'eficiencia' | 'sin'

export interface SankeyLink {
  d: string
  w: number
  from: string
  to: GoalId
  tone: 'red' | 'muted'
}

export const SANKEY_LINKS: readonly SankeyLink[] = [
  { d: 'M382.5,212.8 C488.7,212.8 488.7,207.2 595,207.2', w: 66.98, from: 'marca', to: 'ingresos', tone: 'red' },
  { d: 'M160,206.1 C377.5,206.1 377.5,246.6 595,246.6', w: 11.82, from: 'Logística', to: 'ingresos', tone: 'red' },
  { d: 'M160,68.5 C377.5,68.5 377.5,158.4 595,158.4', w: 9.82, from: 'Operaciones', to: 'ingresos', tone: 'red' },
  { d: 'M160,151.7 C377.5,151.7 377.5,169.8 595,169.8', w: 7.69, from: 'Tecnología', to: 'ingresos', tone: 'red' },
  { d: 'M160,263.9 C377.5,263.9 377.5,256.2 595,256.2', w: 7.52, from: 'Marketing', to: 'ingresos', tone: 'red' },
  { d: 'M160,317.5 C377.5,317.5 377.5,263.1 595,263.1', w: 6.13, from: 'Finanzas', to: 'ingresos', tone: 'red' },
  { d: 'M160,36.5 C377.5,36.5 377.5,150.9 595,150.9', w: 5.13, from: 'Producto', to: 'ingresos', tone: 'red' },
  { d: 'M160,363.1 C377.5,363.1 377.5,267.9 595,267.9', w: 3.53, from: 'Comercial', to: 'ingresos', tone: 'red' },
  { d: 'M160,118.6 C377.5,118.6 377.5,164.7 595,164.7', w: 2.66, from: 'Legal', to: 'ingresos', tone: 'red' },
  { d: 'M160,402.1 C377.5,402.1 377.5,270.8 595,270.8', w: 2.2, from: 'Gente y Cultura', to: 'ingresos', tone: 'red' },
  { d: 'M160,432.8 C377.5,432.8 377.5,272.3 595,272.3', w: 1, from: 'Servicio al cliente', to: 'ingresos', tone: 'red' },
  { d: 'M160,162.2 C266.2,162.2 266.2,206.1 372.5,206.1', w: 13.18, from: 'Tecnología', to: 'marca', tone: 'red' },
  { d: 'M160,79.2 C266.2,79.2 266.2,188.0 372.5,188.0', w: 11.62, from: 'Operaciones', to: 'marca', tone: 'red' },
  { d: 'M160,216.4 C266.2,216.4 266.2,217.1 372.5,217.1', w: 8.82, from: 'Logística', to: 'marca', tone: 'red' },
  { d: 'M160,271.8 C266.2,271.8 266.2,225.7 372.5,225.7', w: 8.36, from: 'Marketing', to: 'marca', tone: 'red' },
  { d: 'M160,323.9 C266.2,323.9 266.2,233.2 372.5,233.2', w: 6.69, from: 'Finanzas', to: 'marca', tone: 'red' },
  { d: 'M160,122.7 C266.2,122.7 266.2,196.6 372.5,196.6', w: 5.66, from: 'Legal', to: 'marca', tone: 'red' },
  { d: 'M160,367.3 C266.2,367.3 266.2,238.9 372.5,238.9', w: 4.76, from: 'Comercial', to: 'marca', tone: 'red' },
  { d: 'M160,434.7 C266.2,434.7 266.2,244.8 372.5,244.8', w: 3, from: 'Servicio al cliente', to: 'marca', tone: 'red' },
  { d: 'M160,40.5 C266.2,40.5 266.2,180.8 372.5,180.8', w: 2.9, from: 'Producto', to: 'marca', tone: 'red' },
  { d: 'M160,404.2 C266.2,404.2 266.2,242.3 372.5,242.3', w: 2, from: 'Gente y Cultura', to: 'marca', tone: 'red' },
  { d: 'M160,290.4 C377.5,290.4 377.5,409.5 595,409.5', w: 12.05, from: 'Marketing', to: 'eficiencia', tone: 'red' },
  { d: 'M160,236.3 C377.5,236.3 377.5,397.6 595,397.6', w: 11.65, from: 'Logística', to: 'eficiencia', tone: 'red' },
  { d: 'M160,338.8 C377.5,338.8 377.5,420.1 595,420.1', w: 9.09, from: 'Finanzas', to: 'eficiencia', tone: 'red' },
  { d: 'M160,379.5 C377.5,379.5 377.5,428.1 595,428.1', w: 7.02, from: 'Comercial', to: 'eficiencia', tone: 'red' },
  { d: 'M160,179.2 C377.5,179.2 377.5,388.8 595,388.8', w: 5.99, from: 'Tecnología', to: 'eficiencia', tone: 'red' },
  { d: 'M160,96.8 C377.5,96.8 377.5,382.5 595,382.5', w: 4.86, from: 'Operaciones', to: 'eficiencia', tone: 'red' },
  { d: 'M160,412.1 C377.5,412.1 377.5,433.8 595,433.8', w: 4.43, from: 'Gente y Cultura', to: 'eficiencia', tone: 'red' },
  { d: 'M160,449.8 C377.5,449.8 377.5,438.2 595,438.2', w: 4.33, from: 'Servicio al cliente', to: 'eficiencia', tone: 'red' },
  { d: 'M160,129.4 C377.5,129.4 377.5,385.4 595,385.4', w: 1, from: 'Legal', to: 'eficiencia', tone: 'red' },
  { d: 'M160,45.2 C377.5,45.2 377.5,379.7 595,379.7', w: 1, from: 'Producto', to: 'eficiencia', tone: 'red' },
  { d: 'M160,441.9 C377.5,441.9 377.5,355.6 595,355.6', w: 11.39, from: 'Servicio al cliente', to: 'sin', tone: 'muted' },
  { d: 'M160,225.6 C377.5,225.6 377.5,318.7 595,318.7', w: 9.65, from: 'Logística', to: 'sin', tone: 'muted' },
  { d: 'M160,89.7 C377.5,89.7 377.5,298.3 595,298.3', w: 9.32, from: 'Operaciones', to: 'sin', tone: 'muted' },
  { d: 'M160,280.2 C377.5,280.2 377.5,327.7 595,327.7', w: 8.36, from: 'Marketing', to: 'sin', tone: 'muted' },
  { d: 'M160,172.5 C377.5,172.5 377.5,310.1 595,310.1', w: 7.42, from: 'Tecnología', to: 'sin', tone: 'muted' },
  { d: 'M160,330.7 C377.5,330.7 377.5,335.4 595,335.4', w: 7.06, from: 'Finanzas', to: 'sin', tone: 'muted' },
  { d: 'M160,372.8 C377.5,372.8 377.5,342.1 595,342.1', w: 6.33, from: 'Comercial', to: 'sin', tone: 'muted' },
  { d: 'M160,407.5 C377.5,407.5 377.5,347.6 595,347.6', w: 4.69, from: 'Gente y Cultura', to: 'sin', tone: 'muted' },
  { d: 'M160,127.3 C377.5,127.3 377.5,304.7 595,304.7', w: 3.46, from: 'Legal', to: 'sin', tone: 'muted' },
  { d: 'M160,43.4 C377.5,43.4 377.5,292.2 595,292.2', w: 2.86, from: 'Producto', to: 'sin', tone: 'muted' },
]

/** Áreas (columna izquierda): x 150, ancho 10. */
export const SANKEY_AREAS: readonly { area: string; y: number; h: number }[] = [
  { area: 'Comercial', y: 361.4, h: 21.6 },
  { area: 'Finanzas', y: 314.4, h: 29 },
  { area: 'Gente y Cultura', y: 401, h: 13.3 },
  { area: 'Legal', y: 117.3, h: 12.7 },
  { area: 'Logística', y: 200.2, h: 41.9 },
  { area: 'Marketing', y: 260.2, h: 36.3 },
  { area: 'Operaciones', y: 63.7, h: 35.6 },
  { area: 'Producto', y: 34, h: 11.7 },
  { area: 'Servicio al cliente', y: 432.4, h: 19.6 },
  { area: 'Tecnología', y: 147.9, h: 34.3 },
]

/** Objetivos de empresa (nodos de destino) con sus textos de la plataforma. */
export const SANKEY_GOALS: readonly { id: GoalId; x: number; y: number; h: number; title: string; meta: string; labelX: number; labelY: number; anchor: 'start' | 'middle'; pushes: string; tone: 'red' | 'muted' }[] = [
  { id: 'ingresos', x: 595, y: 148.4, h: 124.4, title: 'Crecer los ingresos un 15 %', meta: '48,6 % del peso · avance 9,8 %', labelX: 615, labelY: 203.6, anchor: 'start', pushes: 'Operaciones 17,2 % · Tecnología 16,8 % · Logística 16,6 %', tone: 'red' },
  { id: 'marca', x: 372.5, y: 179.4, h: 67, title: 'Ser la marca preferida de los…', meta: '26,2 % del peso · avance 11 %', labelX: 377.5, labelY: 159.4, anchor: 'middle', pushes: 'Tecnología 19,7 % · Operaciones 17,3 % · Logística 13,2 %', tone: 'red' },
  { id: 'eficiencia', x: 595, y: 379.4, h: 61.1, title: 'Operar con más eficiencia', meta: '23,8 % del peso · avance 8,3 %', labelX: 615, labelY: 402.9, anchor: 'start', pushes: 'Marketing 19,7 % · Logística 19,1 % · Finanzas 14,9 %', tone: 'red' },
  { id: 'sin', x: 595, y: 290.8, h: 70.5, title: 'Sin alinear', meta: '27,6 % del peso · avance 9,5 %', labelX: 615, labelY: 319.1, anchor: 'start', pushes: 'Servicio al cliente 16,1 % · Logística 13,7 % · Operaciones 13,2 %', tone: 'muted' },
]
