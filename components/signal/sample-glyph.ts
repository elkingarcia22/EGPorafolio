export interface GlyphSample {
  /** posiciones xyz consecutivas en unidades de mundo */
  points: Float32Array
  width: number
  height: number
}

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
export async function sampleGlyph(text: string, count: number, worldWidth: number): Promise<GlyphSample> {
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
  const points = new Float32Array(count * 3)
  const total = candidates.length / 2
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * total) * 2
    const jitter = () => (Math.random() - 0.5) * stride * scale
    points[i * 3] = (candidates[pick] - CANVAS_W / 2) * scale + jitter()
    points[i * 3 + 1] = -(candidates[pick + 1] - CANVAS_H / 2) * scale + jitter()
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.25
  }

  return { points, width: worldWidth, height: worldHeight }
}
