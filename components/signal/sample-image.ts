import type { ShapeSample } from './sample-glyph'

const GRID = 240

/** Rectángulo en fracciones (0–1) de la foto original */
export interface CropRect {
  x: number
  y: number
  w: number
  h: number
}

export interface ImageSampleOptions {
  /** Encuadre dentro de la foto */
  crop: CropRect
  /**
   * Silueta de la persona en coordenadas normalizadas de la foto original.
   * Si se da, todo lo de adentro es la persona (sin huecos por brillos).
   * Si no, se detecta la pared gris por color y conexión con el borde.
   */
  mask?: (u: number, v: number) => boolean
  /** Tope de brillo para la densidad (evita que destellos dominen) */
  maxLuminance?: number
  /**
   * 0 = densidad uniforme (forma sólida, como el EG); 1 = la densidad
   * sigue por completo la luz de la foto (semitono). Por defecto 1.
   */
  tonalDensity?: number
  /** Rango del brillo que se pasa al shader [mín, máx] (sombreado suave) */
  shadeRange?: readonly [number, number]
  /**
   * Profundidad de un modelo 3D (en píxeles de la foto) para el punto
   * (u, v). Si se da, reemplaza el relieve inventado desde la silueta.
   */
  depth?: (u: number, v: number) => number
}

const DEFAULT_OPTIONS: ImageSampleOptions = { crop: { x: 0.2, y: 0.06, w: 0.6, h: 0.6 } }
/** Radio útil de la foto (es circular), en fracción del lado */
const CIRCLE_RADIUS = 0.47
/** Fondo de la foto: gris claro y poco saturado (la pared) */
const BG_MAX_SATURATION = 0.14
const BG_MIN_LUMINANCE = 0.62
/** Suavizado de la silueta para inventar volumen (radio y pasadas) */
const BLUR_RADIUS = 7
const BLUR_PASSES = 3
/** Profundidad máxima del relieve, en fracción del ancho */
const DEPTH = 0.28
/** Dirección de la luz principal (arriba a la derecha), normalizada */
const LIGHT = { x: 0.6, y: -0.8 }
const MAX_TRIES_PER_POINT = 80

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    img.src = src
  })
}

function boxBlur(src: Float32Array, width: number, height: number, radius: number): Float32Array {
  const tmp = new Float32Array(src.length)
  const out = new Float32Array(src.length)
  const span = radius * 2 + 1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      for (let k = -radius; k <= radius; k++) sum += src[y * width + Math.min(width - 1, Math.max(0, x + k))]
      tmp[y * width + x] = sum / span
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      for (let k = -radius; k <= radius; k++) sum += tmp[Math.min(height - 1, Math.max(0, y + k)) * width + x]
      out[y * width + x] = sum / span
    }
  }
  return out
}

/** Estira (in situ) el brillo de los píxeles de la máscara a 0–1 por percentiles. */
function stretchInsideMask(lum: Float32Array, mask: Float32Array): void {
  const values: number[] = []
  for (let i = 0; i < lum.length; i++) if (mask[i] === 1) values.push(lum[i])
  if (values.length < 10) return
  values.sort((a, b) => a - b)
  const low = values[Math.floor(values.length * 0.05)]
  const high = values[Math.floor(values.length * 0.95)]
  const range = Math.max(0.05, high - low)
  for (let i = 0; i < lum.length; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - low) / range))
}

/**
 * Marca como fondo los píxeles con color de pared alcanzables desde el
 * borde del encuadre o desde fuera del círculo de la foto (relleno por inundación).
 */
function floodFromEdges(wallLike: Uint8Array, inCircle: Uint8Array, width: number, height: number): Uint8Array {
  const size = width
  const background = new Uint8Array(width * height)
  const queue: number[] = []
  const seed = (i: number) => {
    if (wallLike[i] === 1 && background[i] === 0) {
      background[i] = 1
      queue.push(i)
    }
  }
  for (let x = 0; x < width; x++) seed(x) // arriba
  for (let y = 0; y < height; y++) {
    seed(y * width) // izquierda
    seed(y * width + width - 1) // derecha
  }
  // Pared junto al borde del círculo original.
  for (let i = 0; i < width * height; i++) {
    if (inCircle[i] === 0) continue
    const x = i % width
    const y = (i - x) / width
    const nearOutside =
      (x > 0 && inCircle[i - 1] === 0) || (x < width - 1 && inCircle[i + 1] === 0) ||
      (y > 0 && inCircle[i - size] === 0) || (y < height - 1 && inCircle[i + size] === 0)
    if (nearOutside) seed(i)
  }
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head]
    const x = i % width
    if (x > 0) seed(i - 1)
    if (x < width - 1) seed(i + 1)
    if (i >= width) seed(i - width)
    if (i < width * (height - 1)) seed(i + width)
  }
  return background
}

/**
 * Convierte la foto en una nube de puntos 3D sin fondo:
 * 1. separa a la persona de la pared,
 * 2. inventa volumen suavizando la silueta (relieve tipo busto),
 * 3. marca los bordes iluminados (luz arriba a la derecha) para el brillo.
 */
export async function sampleImage(
  src: string,
  count: number,
  worldWidth: number,
  options: ImageSampleOptions = DEFAULT_OPTIONS,
): Promise<ShapeSample> {
  const img = await loadImage(src)
  const w = img.naturalWidth
  const h = img.naturalHeight
  const { crop } = options
  const GW = GRID
  const GH = Math.round((GRID * crop.h * h) / (crop.w * w))
  const canvas = document.createElement('canvas')
  canvas.width = GW
  canvas.height = GH
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D no disponible')
  ctx.drawImage(img, crop.x * w, crop.y * h, crop.w * w, crop.h * h, 0, 0, GW, GH)
  const { data } = ctx.getImageData(0, 0, GW, GH)

  const centerX = GW / 2
  const centerY = GH / 2
  const total = GW * GH
  const lum = new Float32Array(total)
  const mask = new Float32Array(total)
  /** Píxel con color de pared (gris claro); todavía no sabemos si es fondo */
  const wallLike = new Uint8Array(total)
  const inCircle = new Uint8Array(total)
  const toPhoto = (x: number, y: number) => ({ u: crop.x + (x / GW) * crop.w, v: crop.y + (y / GH) * crop.h })

  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const i = y * GW + x
      const r = data[i * 4] / 255
      const g = data[i * 4 + 1] / 255
      const b = data[i * 4 + 2] / 255
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const max = Math.max(r, g, b)
      const saturation = max === 0 ? 0 : (max - Math.min(r, g, b)) / max
      const { u, v } = toPhoto(x, y)
      lum[i] = Math.min(options.maxLuminance ?? 1, l)
      if (options.mask) {
        mask[i] = options.mask(u, v) ? 1 : 0
      } else {
        // Foto circular: el recorte original, llevado al encuadre.
        const cu = u - 0.5
        const cv = v - 0.5
        inCircle[i] = cu * cu + cv * cv <= CIRCLE_RADIUS * CIRCLE_RADIUS ? 1 : 0
        wallLike[i] = saturation < BG_MAX_SATURATION && l > BG_MIN_LUMINANCE ? 1 : 0
      }
    }
  }

  if (!options.mask) {
    // Fondo = color de pared conectado con el borde de la foto: los brillos
    // de la piel (frente, nariz) no se vuelven huecos.
    const background = floodFromEdges(wallLike, inCircle, GW, GH)
    for (let i = 0; i < total; i++) mask[i] = inCircle[i] === 1 && background[i] === 0 ? 1 : 0
  }

  // Contraste: se estira el brillo de la persona entre sus percentiles 5 y 95,
  // para que ojos, gafas, nariz y barba se marquen aunque la foto sea plana.
  stretchInsideMask(lum, mask)

  // Volumen: la silueta suavizada funciona como mapa de profundidad.
  let height: Float32Array = mask
  for (let p = 0; p < BLUR_PASSES; p++) height = boxBlur(height, GW, GH, BLUR_RADIUS)

  const at = (arr: Float32Array, x: number, y: number) =>
    arr[Math.min(GH - 1, Math.max(0, y)) * GW + Math.min(GW - 1, Math.max(0, x))]

  const scale = worldWidth / GW
  const points = new Float32Array(count * 3)
  const brightness = new Float32Array(count)
  const rim = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    let px = centerX
    let py = centerY
    for (let tries = 0; tries < MAX_TRIES_PER_POINT; tries++) {
      px = Math.random() * GW
      py = Math.random() * GH
      const ix = Math.floor(px)
      const iy = Math.floor(py)
      if (mask[iy * GW + ix] === 0) continue
      // Densidad: mezcla entre forma sólida y semitono según tonalDensity.
      const tonal = options.tonalDensity ?? 1
      const accept = (1 - tonal) + tonal * (0.03 + 0.97 * Math.pow(lum[iy * GW + ix], 1.8))
      if (Math.random() < accept) break
    }
    const ix = Math.floor(px)
    const iy = Math.floor(py)
    const h = at(height, ix, iy)
    // Normal aproximada del relieve → borde iluminado por la luz principal.
    const gx = at(height, ix + 2, iy) - at(height, ix - 2, iy)
    const gy = at(height, ix, iy + 2) - at(height, ix, iy - 2)
    const slope = Math.min(1, Math.hypot(gx, gy) * 4)
    const facing = Math.max(0, (-gx * LIGHT.x - gy * LIGHT.y) / (Math.hypot(gx, gy) + 1e-4))

    points[i * 3] = (px - centerX) * scale
    points[i * 3 + 1] = -(py - centerY) * scale
    if (options.depth) {
      // Modelo 3D: píxeles de la foto → unidades de mundo.
      const { u, v } = toPhoto(px, py)
      points[i * 3 + 2] = options.depth(u, v) * (worldWidth / (crop.w * w)) + (lum[iy * GW + ix] - 0.5) * 2 * scale
    } else {
      // Centrado en z = 0: la mitad del relieve sale hacia la cámara.
      points[i * 3 + 2] = (Math.pow(h, 0.6) * DEPTH * GRID + lum[iy * GW + ix] * 6 - DEPTH * GRID * 0.5) * scale
    }
    const [shadeMin, shadeMax] = options.shadeRange ?? [0, 1]
    brightness[i] = shadeMin + (shadeMax - shadeMin) * lum[iy * GW + ix]
    rim[i] = slope * facing
  }

  const contains = (x: number, y: number, padding = 0): boolean => {
    const step = padding / scale
    const test = (dx: number, dy: number) => {
      const gx = Math.floor(x / scale + centerX + dx)
      const gy = Math.floor(-y / scale + centerY + dy)
      return gx >= 0 && gy >= 0 && gx < GW && gy < GH && mask[gy * GW + gx] === 1
    }
    return test(0, 0) || (step > 0 && (test(step, 0) || test(-step, 0) || test(0, step) || test(0, -step)))
  }

  return { points, width: worldWidth, height: GH * scale, contains, brightness, rim }
}
