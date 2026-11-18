/**
 * Zona del retrato base (foto 400×400) que siempre es la persona.
 * Sirven para que el borrado de la pared no se "cuele" en la cara por
 * los brillos de la piel (frente, nariz) que tocan el borde de la cabeza.
 * Medidas en píxeles de la foto original.
 */
const PHOTO_SIZE = 400

/**
 * Centro del rostro: frente y nariz, donde están los brillos. Bien adentro
 * del contorno para no proteger la pared que hay a los costados de la cara.
 */
const FACE_CENTER = { cx: 188, cy: 100, rx: 30, ry: 46 }

function inEllipse(x: number, y: number, e: { cx: number; cy: number; rx: number; ry: number }): boolean {
  const dx = (x - e.cx) / e.rx
  const dy = (y - e.cy) / e.ry
  return dx * dx + dy * dy <= 1
}

/** true si (u, v) —normalizados en la foto— es siempre parte de la persona. */
export function portraitKeep(u: number, v: number): boolean {
  const x = u * PHOTO_SIZE
  const y = v * PHOTO_SIZE
  return inEllipse(x, y, FACE_CENTER)
}
