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

interface WordSample {
  pts: { x: number; y: number }[]
  links: [number, number][]
  contains: (x: number, y: number, padding?: number) => boolean
}

/** Nodos y conexiones de una palabra, en unidades de mundo (sin normalizar). */
async function sampleWord(text: string, small: boolean, options: GlyphGraphOptions): Promise<WordSample> {
  const glyph = await sampleGlyph(text, 1, WORLD_WIDTH)
  const spacing = small ? options.spacing.mobile : options.spacing.desktop
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < PLACEMENT_TRIES; i++) {
    const x = (Math.random() - 0.5) * glyph.width
    const y = (Math.random() - 0.5) * glyph.height
    if (!glyph.contains(x, y)) continue
    if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < spacing)) continue
    pts.push({ x, y })
  }
  // De izquierda a derecha: así cada nodo viaja a una zona parecida al cambiar de palabra.
  pts.sort((a, b) => a.x - b.x)
  return { pts, links: [], contains: glyph.contains }
}

function linkWord(word: WordSample, small: boolean, options: GlyphGraphOptions): void {
  const reach = small ? options.reach.mobile : options.reach.desktop
  const inside = (ax: number, ay: number, bx: number, by: number) =>
    [0.2, 0.4, 0.6, 0.8].every((k) => word.contains(ax + (bx - ax) * k, ay + (by - ay) * k, options.strokePadding))
  const { pts } = word
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (pts[i].x === pts[j].x && pts[i].y === pts[j].y) continue
      if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) > reach) continue
      if (inside(pts[i].x, pts[i].y, pts[j].x, pts[j].y)) word.links.push([i, j])
    }
  }
}

/** Franjas verticales en que se ordenan los nodos para transformarse (más, más preciso el recorrido) */
const MORPH_COLUMNS = 24

/** Ordena los nodos por franjas de izquierda a derecha y, dentro de cada una, de arriba abajo. */
function sortForMorph(pts: { x: number; y: number }[]): void {
  const minX = Math.min(...pts.map((p) => p.x))
  const maxX = Math.max(...pts.map((p) => p.x))
  const span = Math.max(1e-6, maxX - minX)
  const column = (x: number) => Math.min(MORPH_COLUMNS - 1, Math.floor(((x - minX) / span) * MORPH_COLUMNS))
  pts.sort((a, b) => column(a.x) - column(b.x) || a.y - b.y)
}

/**
 * Grafos de varias palabras listos para transformarse entre sí: todos con
 * el mismo número de nodos (las palabras con menos nodos repiten algunos,
 * que quedan superpuestos) y una misma caja, así la red puede pasar de una
 * forma a otra moviendo cada nodo a su nuevo sitio.
 */
export async function buildWordGraphs(
  words: readonly string[],
  small: boolean,
  options: GlyphGraphOptions = DEFAULT_OPTIONS,
): Promise<Record<string, NetworkGraph>> {
  const samples: WordSample[] = []
  for (const word of words) samples.push(await sampleWord(word, small, options))

  // Mismo número de nodos: se duplican nodos al azar (quedan uno encima del otro).
  const count = Math.max(...samples.map((s) => s.pts.length))
  for (const sample of samples) {
    while (sample.pts.length < count) {
      const at = Math.floor(Math.random() * sample.pts.length)
      sample.pts.splice(at + 1, 0, { ...sample.pts[at] })
    }
    // Mismo orden en todas las figuras (de izquierda a derecha, y de arriba abajo en
    // cada franja): al transformarse, cada nodo viaja a un lugar cercano en vez de
    // cruzar la figura entera, y una palabra fluye hacia la otra.
    sortForMorph(sample.pts)
    linkWord(sample, small, options)
  }

  // Caja común: la más grande de todas, cada palabra centrada en ella.
  const spacing = small ? options.spacing.mobile : options.spacing.desktop
  const bounds = samples.map(({ pts }) => ({
    minX: Math.min(...pts.map((p) => p.x)),
    maxX: Math.max(...pts.map((p) => p.x)),
    minY: Math.min(...pts.map((p) => p.y)),
    maxY: Math.max(...pts.map((p) => p.y)),
  }))
  const boxW = Math.max(...bounds.map((b) => b.maxX - b.minX)) + spacing
  const boxH = Math.max(...bounds.map((b) => b.maxY - b.minY)) + spacing

  const graphs: Record<string, NetworkGraph> = {}
  samples.forEach((sample, i) => {
    const b = bounds[i]
    const cx = (b.minX + b.maxX) / 2
    const cy = (b.minY + b.maxY) / 2
    const left = cx - boxW / 2
    const top = cy + boxH / 2
    graphs[words[i]] = {
      nodes: sample.pts.map((p) => ({ x: (p.x - left) / boxW, y: (top - p.y) / boxH })),
      links: sample.links,
      aspect: boxW / boxH,
      contains: (x, y) => sample.contains(left + x * boxW, top - y * boxH, 0.06),
    }
  })
  return graphs
}
