/** Dónde y cómo se ve un proyecto en la órbita, para un giro dado */
export interface OrbitPlacement {
  /** centro del nodo respecto al centro del escenario (px) */
  x: number
  y: number
  /** 1 al frente, 0 atrás */
  depth: number
  scale: number
  blur: number
  opacity: number
  zIndex: number
}

export interface OrbitShape {
  /** radio horizontal de la órbita (px) */
  radius: number
  /** cuánto suben los nodos de atrás: la órbita se ve un poco desde arriba (px) */
  tilt: number
}

/** Tamaño del nodo de atrás respecto al del frente */
const BACK_SCALE = 0.42
/** Desenfoque máximo de los nodos lejanos (px) */
const MAX_BLUR = 4.5
const BACK_OPACITY = 0.55

/** Ángulo de un proyecto: el que está en `position` queda al frente. */
export function orbitAngle(index: number, position: number, count: number): number {
  return ((index - position) / count) * Math.PI * 2
}

/**
 * Proyección de la órbita: los proyectos giran en un anillo horizontal visto
 * levemente desde arriba. El del frente queda grande y nítido; los de atrás,
 * pequeños, altos y desenfocados (profundidad de campo).
 */
export function placeOnOrbit(angle: number, shape: OrbitShape): OrbitPlacement {
  const depth = (Math.cos(angle) + 1) / 2
  const near = depth ** 1.4
  return {
    x: Math.sin(angle) * shape.radius,
    y: -(1 - depth) * shape.tilt,
    depth,
    scale: BACK_SCALE + (1 - BACK_SCALE) * near,
    blur: (1 - depth) * MAX_BLUR,
    opacity: BACK_OPACITY + (1 - BACK_OPACITY) * depth,
    zIndex: Math.round(depth * 100),
  }
}

/** Índice equivalente más cercano a `from` (para girar por el camino corto). */
export function nearestTurn(index: number, from: number, count: number): number {
  const base = Math.round((from - index) / count) * count
  return index + base
}

/** Punto de una curva cuadrática (las fibras entre nodos). */
export function quadPoint(
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
): { x: number; y: number } {
  const u = 1 - t
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }
}
