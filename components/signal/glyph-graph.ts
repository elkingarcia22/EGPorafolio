import type { NetworkGraph } from './network-canvas'
import { sampleGlyph } from './sample-glyph'

const WORLD_WIDTH = 8
/** Separación mínima entre nodos (unidades de mundo) */
const MIN_SPACING = { desktop: 0.22, mobile: 0.3 }
/**
 * Como en Contacto: cada nodo se une con TODOS sus vecinos dentro de este
 * radio. Eso forma una trama densa de líneas cruzadas: una estructura sólida.
 */
const LINK_REACH = { desktop: 0.78, mobile: 0.95 }
/** Margen del trazo que una línea puede tocar al pasar (letras más llenas) */
const STROKE_PADDING = 0.1
const PLACEMENT_TRIES = 30000

/** Ajustes para textos con letras más finas (p. ej. una palabra larga) */
export interface GlyphGraphOptions {
  spacing: { desktop: number; mobile: number }
  reach: { desktop: number; mobile: number }
  strokePadding: number
}

const DEFAULT_OPTIONS: GlyphGraphOptions = {
  spacing: MIN_SPACING,
  reach: LINK_REACH,
  strokePadding: STROKE_PADDING,
}

/**
 * Grafo que dibuja un texto (el monograma EG, una palabra): nodos repartidos
 * dentro de las letras y conexiones con sus vecinos cercanos, siempre por
 * dentro del trazo. Así son las líneas las que arman la forma.
 */
export async function buildGlyphGraph(
  text: string,
  small: boolean,
  options: GlyphGraphOptions = DEFAULT_OPTIONS,
): Promise<NetworkGraph> {
  const glyph = await sampleGlyph(text, 1, WORLD_WIDTH)
  const spacing = small ? options.spacing.mobile : options.spacing.desktop

  // Reparto tipo "disco de Poisson": al azar, pero sin nodos amontonados.
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < PLACEMENT_TRIES; i++) {
    const x = (Math.random() - 0.5) * glyph.width
    const y = (Math.random() - 0.5) * glyph.height
    if (!glyph.contains(x, y)) continue
    if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < spacing)) continue
    pts.push({ x, y })
  }

  const inside = (ax: number, ay: number, bx: number, by: number) =>
    [0.2, 0.4, 0.6, 0.8].every((k) => glyph.contains(ax + (bx - ax) * k, ay + (by - ay) * k, options.strokePadding))

  const reach = small ? options.reach.mobile : options.reach.desktop
  const links: [number, number][] = []
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) > reach) continue
      if (inside(pts[i].x, pts[i].y, pts[j].x, pts[j].y)) links.push([i, j])
    }
  }

  // Caja ajustada al contorno real de las letras (sin el aire del lienzo).
  const pad = spacing * 0.5
  const minX = Math.min(...pts.map((p) => p.x)) - pad
  const maxX = Math.max(...pts.map((p) => p.x)) + pad
  const minY = Math.min(...pts.map((p) => p.y)) - pad
  const maxY = Math.max(...pts.map((p) => p.y)) + pad
  const boxW = maxX - minX
  const boxH = maxY - minY

  // De mundo (y hacia arriba) a caja 0–1 (y hacia abajo).
  const nodes = pts.map((p) => ({ x: (p.x - minX) / boxW, y: (maxY - p.y) / boxH }))
  return {
    nodes,
    links,
    aspect: boxW / boxH,
    contains: (x, y) => glyph.contains(minX + x * boxW, maxY - y * boxH, 0.06),
  }
}
