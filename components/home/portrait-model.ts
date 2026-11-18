/**
 * Zonas del retrato base (foto 400×400) que siempre son la persona.
 * Sirven para que el borrado de la pared no se "cuele" en la cara por
 * los brillos de la piel (frente, nariz) que tocan el borde de la cabeza.
 * Medidas en píxeles de la foto original.
 */
const PHOTO_SIZE = 400

/** Cara y frente (un poco hacia adentro del contorno de la cabeza) */
const FACE = { cx: 182, cy: 108, rx: 52, ry: 70 }
/** Barba y mentón */
const BEARD = { cx: 172, cy: 165, rx: 34, ry: 38 }

function inEllipse(x: number, y: number, e: { cx: number; cy: number; rx: number; ry: number }): boolean {
  const dx = (x - e.cx) / e.rx
  const dy = (y - e.cy) / e.ry
  return dx * dx + dy * dy <= 1
}

/** true si (u, v) —normalizados en la foto— es siempre parte de la persona. */
export function portraitKeep(u: number, v: number): boolean {
  const x = u * PHOTO_SIZE
  const y = v * PHOTO_SIZE
  return inEllipse(x, y, FACE) || inEllipse(x, y, BEARD)
}
