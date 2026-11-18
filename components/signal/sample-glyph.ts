/** Figura muestreada en partículas (texto o imagen). */
export interface ShapeSample {
  /** posiciones xyz consecutivas en unidades de mundo */
  points: Float32Array
  width: number
  height: number
  /**
   * ¿El punto local (x, y) cae sobre las letras? `padding` (en unidades
   * de mundo) da un pequeño margen para que el hover no sea tan exigente.
   */
  contains: (x: number, y: number, padding?: number) => boolean
  /** Brillo 0–1 por partícula (solo imágenes); sin él, todas brillan igual */
  brightness?: Float32Array
  /** Intensidad del borde iluminado 0–1 por partícula (solo retratos) */
  rim?: Float32Array
}

/** Resolución de la máscara de las letras (1 celda = MASK_CELL px del canvas). */
const MASK_CELL = 4

const CANVAS_W = 1200
const CANVAS_H = 560

function resolveDisplayFamily(): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim()
  return raw || 'sans-serif'
}

/**
 * Dibuja el texto en un canvas oculto y devuelve `count` puntos dentro
 * de las letras, centrados y escalados a `worldWidth` unidades.
 */
export async function sampleGlyph(text: string, count: number, worldWidth: number): Promise<ShapeSample> {
  const family = resolveDisplayFamily()
  try {
    await document.fonts.load(`600 100px ${family}`)
  } catch {
    // Si la fuente no carga, se usa la de respaldo; la forma sigue siendo legible.
  }

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D no disponible')

  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 470px ${family}`
  ctx.fillText(text, CANVAS_W / 2, CANVAS_H / 2 + 20)

  const { data } = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)
  const candidates: number[] = []
  const stride = 3
  for (let y = 0; y < CANVAS_H; y += stride) {
    for (let x = 0; x < CANVAS_W; x += stride) {
      if (data[(y * CANVAS_W + x) * 4 + 3] > 128) candidates.push(x, y)
    }
  }

  const scale = worldWidth / CANVAS_W
  const worldHeight = CANVAS_H * scale

  // Máscara reducida de la forma: sirve para saber si el cursor está sobre una letra.
  const maskW = Math.ceil(CANVAS_W / MASK_CELL)
  const maskH = Math.ceil(CANVAS_H / MASK_CELL)
  const mask = new Uint8Array(maskW * maskH)
  for (let my = 0; my < maskH; my++) {
    for (let mx = 0; mx < maskW; mx++) {
      const px = Math.min(CANVAS_W - 1, mx * MASK_CELL + MASK_CELL / 2)
      const py = Math.min(CANVAS_H - 1, my * MASK_CELL + MASK_CELL / 2)
      mask[my * maskW + mx] = data[(py * CANVAS_W + px) * 4 + 3] > 128 ? 1 : 0
    }
  }
  const filled = (x: number, y: number): boolean => {
    const mx = Math.floor((x / scale + CANVAS_W / 2) / MASK_CELL)
    const my = Math.floor((-y / scale + CANVAS_H / 2) / MASK_CELL)
    return mx >= 0 && my >= 0 && mx < maskW && my < maskH && mask[my * maskW + mx] === 1
  }
  const contains = (x: number, y: number, padding = 0): boolean => {
    if (filled(x, y)) return true
    if (padding <= 0) return false
    // Revisa 8 puntos alrededor: margen de tolerancia en el borde de la letra.
    for (let a = 0; a < 8; a++) {
      const angle = (a / 8) * Math.PI * 2
      if (filled(x + Math.cos(angle) * padding, y + Math.sin(angle) * padding)) return true
    }
    return false
  }
  const points = new Float32Array(count * 3)
  const total = candidates.length / 2
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * total) * 2
    const jitter = () => (Math.random() - 0.5) * stride * scale
    points[i * 3] = (candidates[pick] - CANVAS_W / 2) * scale + jitter()
    points[i * 3 + 1] = -(candidates[pick + 1] - CANVAS_H / 2) * scale + jitter()
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.25
  }

  return { points, width: worldWidth, height: worldHeight, contains }
}
