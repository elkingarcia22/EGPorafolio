/**
 * Reconstrucción 3D aproximada del retrato (foto base 400×400).
 * Medidas tomadas sobre la foto y contrastadas con otras fotos de
 * referencia: cabeza ligeramente girada hacia la derecha de la imagen,
 * pelo largo recogido, gafas, barba y camisa de cuadros con brazos cruzados.
 *
 * Todo en píxeles de la foto original.
 */
export const PHOTO_SIZE = 400

type Point = readonly [number, number]

/** Contorno del torso (hombros y brazos cruzados). */
const TORSO: readonly Point[] = [
  [128, 168], [222, 168], [262, 192], [292, 232], [312, 300], [318, 400],
  [52, 400], [56, 330], [66, 262], [92, 214],
]

const HEAD = { cx: 180, cy: 112, rx: 60, ry: 80 }
const BEARD = { cx: 172, cy: 168, rx: 42, ry: 44 }
const NECK = { x0: 148, x1: 202, y0: 180, y1: 225 }
/** Rasgos del modelo de cara (centro, radios, altura en px) */
const NOSE = { x: 203, y: 120, sx: 8, sy: 15, z: 24 }
const BROW = { x: 190, y: 88, sx: 34, sy: 7, z: 6 }
const EYES: readonly { x: number; y: number }[] = [{ x: 166, y: 101 }, { x: 214, y: 101 }]
const EYE = { sx: 11, sy: 7, z: -7 }
const CHEEKS: readonly { x: number; y: number }[] = [{ x: 158, y: 130 }, { x: 222, y: 128 }]
const CHEEK = { sx: 14, sy: 12, z: 6 }
const LIPS = { x: 188, y: 142, sx: 18, sy: 6, z: 7 }
/** Profundidad máxima de cada volumen (px) */
const HEAD_DEPTH = 58
const BEARD_DEPTH = 44
const TORSO_DEPTH = 50
const TORSO_BACK = -26

function ellipse(x: number, y: number, e: { cx: number; cy: number; rx: number; ry: number }): number {
  const dx = (x - e.cx) / e.rx
  const dy = (y - e.cy) / e.ry
  return 1 - dx * dx - dy * dy
}

function bump(x: number, y: number, cx: number, cy: number, sx: number, sy: number): number {
  return Math.exp(-(((x - cx) ** 2) / (2 * sx * sx) + ((y - cy) ** 2) / (2 * sy * sy)))
}

function insidePolygon(x: number, y: number, poly: readonly Point[]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function insideCircle(x: number, y: number): boolean {
  const c = PHOTO_SIZE / 2
  return (x - c) ** 2 + (y - c) ** 2 <= (PHOTO_SIZE * 0.47) ** 2
}

/** Silueta: cabeza, barba, cuello y torso (sin la pared). */
export function portraitMask(u: number, v: number): boolean {
  const x = u * PHOTO_SIZE
  const y = v * PHOTO_SIZE
  if (!insideCircle(x, y)) return false
  return (
    ellipse(x, y, HEAD) >= 0 ||
    ellipse(x, y, BEARD) >= 0 ||
    (x >= NECK.x0 && x <= NECK.x1 && y >= NECK.y0 && y <= NECK.y1) ||
    insidePolygon(x, y, TORSO)
  )
}

/** Profundidad del modelo (px; positivo = hacia la cámara). */
export function portraitDepth(u: number, v: number): number {
  const x = u * PHOTO_SIZE
  const y = v * PHOTO_SIZE
  let z = -Infinity

  const head = ellipse(x, y, HEAD)
  if (head >= 0) {
    let face = Math.sqrt(head) * HEAD_DEPTH
    face += NOSE.z * bump(x, y, NOSE.x, NOSE.y, NOSE.sx, NOSE.sy)
    face += BROW.z * bump(x, y, BROW.x, BROW.y, BROW.sx, BROW.sy)
    face += LIPS.z * bump(x, y, LIPS.x, LIPS.y, LIPS.sx, LIPS.sy)
    for (const e of EYES) face += EYE.z * bump(x, y, e.x, e.y, EYE.sx, EYE.sy)
    for (const c of CHEEKS) face += CHEEK.z * bump(x, y, c.x, c.y, CHEEK.sx, CHEEK.sy)
    z = Math.max(z, face)
  }
  const beard = ellipse(x, y, BEARD)
  if (beard >= 0) z = Math.max(z, Math.sqrt(beard) * BEARD_DEPTH)
  if (x >= NECK.x0 && x <= NECK.x1 && y >= NECK.y0 && y <= NECK.y1) z = Math.max(z, 18)
  if (insidePolygon(x, y, TORSO)) {
    const across = Math.max(0, 1 - ((x - 185) / 150) ** 2)
    z = Math.max(z, Math.sqrt(across) * TORSO_DEPTH + TORSO_BACK)
  }
  // Centrado aproximado alrededor de z = 0 para que gire sobre su eje.
  return Number.isFinite(z) ? z - HEAD_DEPTH * 0.5 : 0
}
