import type { ShapeSample } from './sample-glyph'

const GRID = 220
/** Radio del recorte circular, en fracción del lado de la imagen */
const CIRCLE_RADIUS = 0.47
/** Ajuste de contraste del brillo (valores bajo LOW → 0, sobre HIGH → 1) */
const LOW = 0.12
const HIGH = 0.92
const MAX_TRIES_PER_POINT = 60
/** Fondo de la foto: gris claro y poco saturado (la pared) */
const BG_MAX_SATURATION = 0.14
const BG_MIN_LUMINANCE = 0.62
/** Probabilidad de conservar un punto del fondo (textura sutil) */
const BG_KEEP = 0.03

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    img.src = src
  })
}

/**
 * Convierte una foto (recortada en círculo) en partículas tipo semitono:
 * las zonas claras reciben más puntos y más grandes; las oscuras, menos.
 */
export async function sampleImage(src: string, count: number, worldWidth: number): Promise<ShapeSample> {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = GRID
  canvas.height = GRID
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D no disponible')
  ctx.drawImage(img, 0, 0, GRID, GRID)
  const { data } = ctx.getImageData(0, 0, GRID, GRID)

  const center = GRID / 2
  const radius = GRID * CIRCLE_RADIUS
  /** Brillo ajustado de la persona; -1 si el píxel es fondo (pared). */
  const sampleAt = (x: number, y: number): number => {
    const i = (y * GRID + x) * 4
    const r = data[i] / 255
    const g = data[i + 1] / 255
    const b = data[i + 2] / 255
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const max = Math.max(r, g, b)
    const saturation = max === 0 ? 0 : (max - Math.min(r, g, b)) / max
    if (saturation < BG_MAX_SATURATION && l > BG_MIN_LUMINANCE) return -1
    return Math.min(1, Math.max(0, (l - LOW) / (HIGH - LOW)))
  }
  const inside = (x: number, y: number) => (x - center) ** 2 + (y - center) ** 2 <= radius ** 2

  const scale = worldWidth / GRID
  const points = new Float32Array(count * 3)
  const brightness = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    let px = center
    let py = center
    let b = 0
    // Muestreo por rechazo: los píxeles claros se aceptan más a menudo.
    for (let tries = 0; tries < MAX_TRIES_PER_POINT; tries++) {
      px = Math.random() * GRID
      py = Math.random() * GRID
      if (!inside(px, py)) continue
      const v = sampleAt(Math.floor(px), Math.floor(py))
      if (v < 0) {
        // Pared: casi siempre se descarta; unos pocos puntos tenues dan textura.
        b = 0.15
        if (Math.random() < BG_KEEP) break
        continue
      }
      b = v
      // La persona: zonas claras (piel) más densas; oscuras (pelo, barba) más tenues.
      if (Math.random() < 0.25 + b * 0.75) break
    }
    points[i * 3] = (px - center) * scale
    points[i * 3 + 1] = -(py - center) * scale
    points[i * 3 + 2] = (b - 0.5) * 0.4
    brightness[i] = b
  }

  const contains = (x: number, y: number, padding = 0): boolean => {
    const r = radius * scale + padding
    return x * x + y * y <= r * r
  }

  return { points, width: worldWidth, height: worldWidth, contains, brightness }
}
