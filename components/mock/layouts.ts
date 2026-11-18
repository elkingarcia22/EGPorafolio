import type { MockKind } from '@/lib/content/projects'

export type BlockRole = 'nav' | 'header' | 'card' | 'kpi' | 'chart' | 'list' | 'button' | 'avatar' | 'slot' | 'row' | 'panel' | 'total'

/** Bloque en coordenadas porcentuales del lienzo. */
export interface Block {
  role: BlockRole
  x: number
  y: number
  w: number
  h: number
  /** bloque destacado (usa el color del proyecto) */
  hot?: boolean
}

export interface MockLayout {
  /** proporción ancho/alto del lienzo */
  aspect: number
  blocks: readonly Block[]
}

const rows = (count: number, x: number, y: number, w: number, h: number, gap: number, role: BlockRole = 'row'): Block[] =>
  Array.from({ length: count }, (_, i) => ({ role, x, y: y + i * (h + gap), w, h }))

/**
 * Las mismas cajas alimentan el boceto, el wireframe y la UI final:
 * así se ve que es una sola idea que gana fidelidad.
 */
export const LAYOUTS: Record<MockKind, MockLayout> = {
  dashboard: {
    aspect: 16 / 10,
    blocks: [
      { role: 'nav', x: 0, y: 0, w: 16, h: 100 },
      { role: 'header', x: 19, y: 4, w: 78, h: 8 },
      { role: 'kpi', x: 19, y: 16, w: 24, h: 18, hot: true },
      { role: 'kpi', x: 46, y: 16, w: 24, h: 18 },
      { role: 'kpi', x: 73, y: 16, w: 24, h: 18 },
      { role: 'chart', x: 19, y: 38, w: 49, h: 58 },
      ...rows(5, 71, 38, 26, 9.6, 2.4, 'list'),
    ],
  },
  mobile: {
    aspect: 9 / 16,
    blocks: [
      { role: 'header', x: 6, y: 4, w: 88, h: 6 },
      { role: 'avatar', x: 6, y: 14, w: 26, h: 14, hot: true },
      { role: 'avatar', x: 37, y: 14, w: 26, h: 14 },
      { role: 'avatar', x: 68, y: 14, w: 26, h: 14 },
      ...rows(3, 6, 33, 88, 8, 2.5, 'list'),
      { role: 'slot', x: 6, y: 66, w: 27, h: 6 },
      { role: 'slot', x: 36.5, y: 66, w: 27, h: 6, hot: true },
      { role: 'slot', x: 67, y: 66, w: 27, h: 6 },
      { role: 'slot', x: 6, y: 74, w: 27, h: 6 },
      { role: 'slot', x: 36.5, y: 74, w: 27, h: 6 },
      { role: 'slot', x: 67, y: 74, w: 27, h: 6 },
      { role: 'button', x: 6, y: 87, w: 88, h: 8, hot: true },
    ],
  },
  upload: {
    aspect: 16 / 10,
    blocks: [
      { role: 'header', x: 3, y: 4, w: 94, h: 8 },
      { role: 'panel', x: 3, y: 16, w: 45, h: 70 },
      ...rows(6, 6, 22, 39, 7, 3),
      { role: 'panel', x: 52, y: 16, w: 45, h: 70, hot: true },
      ...rows(5, 55, 22, 39, 9, 3, 'list'),
      { role: 'button', x: 77, y: 90, w: 20, h: 7, hot: true },
    ],
  },
  table: {
    aspect: 16 / 10,
    blocks: [
      { role: 'header', x: 3, y: 4, w: 94, h: 8 },
      { role: 'card', x: 3, y: 16, w: 30, h: 7 },
      { role: 'button', x: 77, y: 16, w: 20, h: 7 },
      ...rows(7, 3, 28, 94, 7, 1.6),
      { role: 'total', x: 3, y: 89, w: 94, h: 8, hot: true },
    ],
  },
}
