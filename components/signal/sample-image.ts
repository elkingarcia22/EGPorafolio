import type { ShapeSample } from './sample-glyph'

const GRID = 260
/** Encuadre: cabeza y hombros (fracciones de la foto original) */
const CROP = { x: 0.2, y: 0.06, size: 0.6 }
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
/** Por debajo de este brillo, dentro de la zona de pelo, se considera pelo */
const HAIR_MAX_LUMINANCE = 0.42
/** Tono con el que se dibuja el pelo (0–1) */
const HAIR_TONE = 0.5
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

function boxBlur(src: Float32Array, size: number, radius: number): Float32Array {
  const tmp = new Float32Array(src.length)
  const out = new Float32Array(src.length)
  const span = radius * 2 + 1
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0
      for (let k = -radius; k <= radius; k++) sum += src[y * size + Math.min(size - 1, Math.max(0, x + k))]
      tmp[y * size + x] = sum / span
    }
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0
      for (let k = -radius; k <= radius; k++) sum += tmp[Math.min(size - 1, Math.max(0, y + k)) * size + x]
      out[y * size + x] = sum / span
    }
  }
  return out
}

/**
 * Marca como fondo los píxeles con color de pared alcanzables desde el
 * borde del encuadre o desde fuera del círculo de la foto (relleno por inundación).
 */
function floodFromEdges(wallLike: Uint8Array, inCircle: Uint8Array, size: number): Uint8Array {
  const background = new Uint8Array(size * size)
  const queue: number[] = []
  const seed = (i: number) => {
    if (wallLike[i] === 1 && background[i] === 0) {
      background[i] = 1
      queue.push(i)
    }
  }
  for (let i = 0; i < size; i++) {
    seed(i) // arriba
    seed(i * size) // izquierda
    seed(i * size + size - 1) // derecha
  }
  // Pared junto al borde del círculo original.
  for (let i = 0; i < size * size; i++) {
    if (inCircle[i] === 0) continue
    const x = i % size
    const y = (i - x) / size
    const nearOutside =
      (x > 0 && inCircle[i - 1] === 0) || (x < size - 1 && inCircle[i + 1] === 0) ||
      (y > 0 && inCircle[i - size] === 0) || (y < size - 1 && inCircle[i + size] === 0)
    if (nearOutside) seed(i)
  }
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head]
    const x = i % size
    if (x > 0) seed(i - 1)
    if (x < size - 1) seed(i + 1)
    if (i >= size) seed(i - size)
    if (i < size * (size - 1)) seed(i + size)
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
  /**
   * Máscara de la persona (blanco = persona), del mismo tamaño que la foto.
   * Si se da, reemplaza la detección de la pared por color.
   */
  maskSrc?: string,
  /**
   * Zona de pelo (u, v normalizados en la foto): ahí las partes oscuras se
   * aclaran para que el pelo se dibuje con partículas en vez de quedar vacío.
   */
  hairZone?: (u: number, v: number) => boolean,
): Promise<ShapeSample> {
  const [img, maskImg] = await Promise.all([loadImage(src), maskSrc ? loadImage(maskSrc) : null])
  const canvas = document.createElement('canvas')
  canvas.width = GRID
  canvas.height = GRID
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D no disponible')
  const w = img.naturalWidth
  const h = img.naturalHeight
  ctx.drawImage(img, CROP.x * w, CROP.y * h, CROP.size * w, CROP.size * h, 0, 0, GRID, GRID)
  const { data } = ctx.getImageData(0, 0, GRID, GRID)

  // Máscara con el mismo encuadre que la foto.
  let matte: Uint8ClampedArray | null = null
  if (maskImg) {
    ctx.clearRect(0, 0, GRID, GRID)
    ctx.drawImage(maskImg, CROP.x * maskImg.naturalWidth, CROP.y * maskImg.naturalHeight, CROP.size * maskImg.naturalWidth, CROP.size * maskImg.naturalHeight, 0, 0, GRID, GRID)
    matte = ctx.getImageData(0, 0, GRID, GRID).data
  }

  const center = GRID / 2
  const lum = new Float32Array(GRID * GRID)
  const mask = new Float32Array(GRID * GRID)
  /** Píxel con color de pared (gris claro); todavía no sabemos si es fondo */
  const wallLike = new Uint8Array(GRID * GRID)
  const inCircle = new Uint8Array(GRID * GRID)

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const i = y * GRID + x
      const r = data[i * 4] / 255
      const g = data[i * 4 + 1] / 255
      const b = data[i * 4 + 2] / 255
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const max = Math.max(r, g, b)
      const saturation = max === 0 ? 0 : (max - Math.min(r, g, b)) / max
      // El recorte circular de la foto original, llevado al encuadre.
      const u = CROP.x + (x / GRID) * CROP.size - 0.5
      const v = CROP.y + (y / GRID) * CROP.size - 0.5
      const insideCircle = u * u + v * v <= CIRCLE_RADIUS * CIRCLE_RADIUS
      // Pelo oscuro → tono medio con vetas, para que se vea como pelo.
      const isHair = l < HAIR_MAX_LUMINANCE && (hairZone?.(u + 0.5, v + 0.5) ?? false)
      lum[i] = isHair ? HAIR_TONE + 0.12 * Math.sin((x + y * 0.35) * 0.9) + l * 0.4 : l
      inCircle[i] = insideCircle ? 1 : 0
      wallLike[i] = saturation < BG_MAX_SATURATION && l > BG_MIN_LUMINANCE ? 1 : 0
    }
  }

  // Fondo = solo lo que tiene color de pared Y está conectado con el borde
  // de la foto. Así los brillos de la piel (frente, nariz) no se vuelven huecos.
  if (matte) {
    // Segmentación precisa: la silueta completa, sin huecos ni restos de pared.
    for (let i = 0; i < mask.length; i++) mask[i] = inCircle[i] === 1 && matte[i * 4] > 128 ? 1 : 0
  } else {
    const background = floodFromEdges(wallLike, inCircle, GRID)
    for (let i = 0; i < mask.length; i++) mask[i] = inCircle[i] === 1 && background[i] === 0 ? 1 : 0
  }

  // Volumen: la silueta suavizada funciona como mapa de profundidad.
  let height: Float32Array = mask
  for (let p = 0; p < BLUR_PASSES; p++) height = boxBlur(height, GRID, BLUR_RADIUS)

  const at = (arr: Float32Array, x: number, y: number) =>
    arr[Math.min(GRID - 1, Math.max(0, y)) * GRID + Math.min(GRID - 1, Math.max(0, x))]

  const scale = worldWidth / GRID
  const points = new Float32Array(count * 3)
  const brightness = new Float32Array(count)
  const rim = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    let px = center
    let py = center
    for (let tries = 0; tries < MAX_TRIES_PER_POINT; tries++) {
      px = Math.random() * GRID
      py = Math.random() * GRID
      const ix = Math.floor(px)
      const iy = Math.floor(py)
      if (mask[iy * GRID + ix] === 0) continue
      // La densidad sigue la luz de la foto: así se marcan ojos, gafas y barba.
      const accept = 0.06 + 0.94 * Math.pow(lum[iy * GRID + ix], 1.6)
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

    points[i * 3] = (px - center) * scale
    points[i * 3 + 1] = -(py - center) * scale
    // Centrado en z = 0: la mitad del relieve sale hacia la cámara.
    points[i * 3 + 2] = (Math.pow(h, 0.6) * DEPTH * GRID + lum[iy * GRID + ix] * 6 - DEPTH * GRID * 0.5) * scale
    brightness[i] = lum[iy * GRID + ix]
    rim[i] = slope * facing
  }

  const contains = (x: number, y: number, padding = 0): boolean => {
    const step = padding / scale
    const test = (dx: number, dy: number) => {
      const gx = Math.floor(x / scale + center + dx)
      const gy = Math.floor(-y / scale + center + dy)
      return gx >= 0 && gy >= 0 && gx < GRID && gy < GRID && mask[gy * GRID + gx] === 1
    }
    return test(0, 0) || (step > 0 && (test(step, 0) || test(-step, 0) || test(0, step) || test(0, -step)))
  }

  return { points, width: worldWidth, height: worldWidth, contains, brightness, rim }
}
