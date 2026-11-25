/**
 * Mundo 3D del vuelo de la carga: un túnel de neuronas a lo largo del eje z,
 * con una ruta de neuronas principales que la cámara visita una tras otra.
 * Unidades libres: la cámara mira hacia +z.
 */

export interface FlightNode {
  x: number
  y: number
  z: number
  size: number
  phase: number
  /** neurona principal de la ruta */
  waypoint: boolean
}

export interface FlightLink {
  a: number
  b: number
  /** punto de control de la curva (la fibra se dobla en 3D) */
  cx: number
  cy: number
  cz: number
  seed: number
}

export interface FlightWorld {
  nodes: FlightNode[]
  links: FlightLink[]
  /** índices de las neuronas principales, en orden de visita */
  route: number[]
  /** paradas de la cámara: inicio + una frente a cada neurona principal */
  stops: { x: number; y: number; z: number }[]
}

export interface FlightOptions {
  /** neuronas principales que se visitan */
  waypoints: number
  /** distancia en z entre una y otra */
  spacing: number
  /** distancia a la que la cámara se detiene frente a cada una */
  viewDistance: number
  /** radio del túnel de neuronas alrededor de la ruta */
  radius: number
  /** neuronas de relleno */
  count: number
  /** cuánto se extiende el túnel más allá de la última parada */
  tail: number
}

/** Conexiones por neurona y alcance máximo */
const LINKS_PER_NODE = 3
const LINK_REACH = 5.2
/** Cuánto se separa la ruta del eje central */
const ROUTE_WANDER = 0.45

const rand = (min: number, max: number) => min + Math.random() * (max - min)

export function buildFlightWorld(o: FlightOptions): FlightWorld {
  const nodes: FlightNode[] = []

  // Ruta: neuronas principales que zigzaguean alrededor del eje.
  const route: number[] = []
  for (let i = 0; i < o.waypoints; i++) {
    const angle = i * 2.1 + rand(-0.5, 0.5)
    const r = o.radius * ROUTE_WANDER * rand(0.4, 1)
    route.push(nodes.length)
    nodes.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r * 0.7,
      z: o.viewDistance + 2 + i * o.spacing,
      size: rand(3.2, 4.2),
      phase: Math.random() * Math.PI * 2,
      waypoint: true,
    })
  }

  // Centro del túnel a una profundidad dada (sigue a la ruta).
  const centerAt = (z: number) => {
    const wps = route.map((i) => nodes[i])
    if (z <= wps[0].z) return wps[0]
    for (let i = 1; i < wps.length; i++) {
      if (z <= wps[i].z) {
        const k = (z - wps[i - 1].z) / (wps[i].z - wps[i - 1].z)
        return { x: wps[i - 1].x + (wps[i].x - wps[i - 1].x) * k, y: wps[i - 1].y + (wps[i].y - wps[i - 1].y) * k }
      }
    }
    return wps[wps.length - 1]
  }

  const zEnd = nodes[route[route.length - 1]].z + o.tail
  for (let i = 0; i < o.count; i++) {
    const z = rand(-2, zEnd)
    const c = centerAt(z)
    const angle = Math.random() * Math.PI * 2
    // Más densas lejos del eje: la cámara vuela por un hueco entre neuronas.
    const r = o.radius * Math.sqrt(rand(0.04, 1))
    nodes.push({
      x: c.x + Math.cos(angle) * r,
      y: c.y + Math.sin(angle) * r * 0.75,
      z,
      size: Math.random() < 0.12 ? rand(2.2, 3) : rand(0.8, 1.8),
      phase: Math.random() * Math.PI * 2,
      waypoint: false,
    })
  }

  // Conexiones: cada neurona con sus vecinas más cercanas.
  const seen = new Set<string>()
  const links: FlightLink[] = []
  nodes.forEach((n, a) => {
    const near = nodes
      .map((m, b) => ({ b, d: Math.hypot(m.x - n.x, m.y - n.y, m.z - n.z) }))
      .filter(({ b, d }) => b !== a && d < LINK_REACH * (n.waypoint ? 1.5 : 1))
      .sort((p, q) => p.d - q.d)
      .slice(0, n.waypoint ? LINKS_PER_NODE + 4 : LINKS_PER_NODE)
    for (const { b, d } of near) {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`
      if (seen.has(key)) continue
      seen.add(key)
      const m = nodes[b]
      links.push({
        a,
        b,
        cx: (n.x + m.x) / 2 + rand(-0.35, 0.35) * d,
        cy: (n.y + m.y) / 2 + rand(-0.35, 0.35) * d,
        cz: (n.z + m.z) / 2 + rand(-0.2, 0.2) * d,
        seed: Math.random(),
      })
    }
  })

  const stops = [
    { x: 0, y: 0, z: 0 },
    ...route.map((i) => ({ x: nodes[i].x * 0.85, y: nodes[i].y * 0.85, z: nodes[i].z - o.viewDistance })),
  ]
  return { nodes, links, route, stops }
}

/**
 * Sinapsis mínima para el paso del titular al EG: una neurona de partida, la
 * de destino (de donde nace el EG) y una rama corta. Dos conexiones en total.
 */
export function buildSynapseWorld(): FlightWorld {
  const nodes: FlightNode[] = [
    { x: -1.6, y: 0.9, z: 3, size: 3.4, phase: 0, waypoint: true },
    { x: 0, y: 0, z: 12, size: 4, phase: 1.3, waypoint: true },
    { x: 2.6, y: -1.4, z: 15, size: 2.4, phase: 2.1, waypoint: false },
  ]
  const links: FlightLink[] = [
    { a: 0, b: 1, cx: 1.4, cy: 1.6, cz: 7.5, seed: 0.3 },
    { a: 1, b: 2, cx: 1.8, cy: 0.2, cz: 13.2, seed: 0.7 },
  ]
  return { nodes, links, route: [0, 1], stops: [] }
}

/** Grafo plano en caja 0–1 (como el del EG): nodos y conexiones */
interface PlaneGraph {
  nodes: readonly { x: number; y: number }[]
  links: readonly (readonly [number, number])[]
  aspect: number
}

/** Mundo hecho con una figura (el EG) al que se le da volumen y luego se aplana. */
export interface GlyphWorld extends FlightWorld {
  /** ancho de la figura en unidades del mundo */
  width: number
  /** profundidad propia de cada nodo, de -1 a 1 */
  depthOf: Float32Array
  /** desvío de la curva de cada conexión (unidades del mundo) */
  bendOf: Float32Array
}

/**
 * Mundo 3D a partir de una figura plana: cada nodo queda en su lugar de la
 * figura (centrada en el origen, en el plano z = 0) pero con una
 * profundidad propia; las neuronas de `route` (puntos de la caja 0–1) son
 * las que la cámara visita. Con `flattenGlyphWorld` el volumen se aplana.
 */
export function buildGlyphWorld(graph: PlaneGraph, width: number, route: readonly (readonly [number, number])[]): GlyphWorld {
  const height = width / graph.aspect
  const degree = new Uint16Array(graph.nodes.length)
  for (const [a, b] of graph.links) {
    degree[a]++
    degree[b]++
  }
  const hubFrom = Array.from(degree).sort((p, q) => q - p)[Math.floor(graph.nodes.length * 0.12)] ?? 99
  const routeIdx = route.map(([ax, ay]) => {
    let best = 0
    let bestD = Infinity
    graph.nodes.forEach((n, i) => {
      const d = Math.hypot(n.x - ax, n.y - ay)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    return best
  })
  const nodes: FlightNode[] = graph.nodes.map((n, i) => ({
    x: (n.x - 0.5) * width,
    y: (n.y - 0.5) * height,
    z: 0,
    size: routeIdx.includes(i) ? rand(3, 3.8) : degree[i] >= hubFrom ? rand(1.8, 2.6) : rand(0.8, 1.6),
    phase: Math.random() * Math.PI * 2,
    waypoint: routeIdx.includes(i),
  }))
  const links: FlightLink[] = graph.links.map(([a, b]) => ({ a, b, cx: 0, cy: 0, cz: 0, seed: Math.random() }))
  const world: GlyphWorld = {
    nodes,
    links,
    route: routeIdx,
    stops: [],
    width,
    depthOf: Float32Array.from(nodes, () => rand(-1, 1)),
    bendOf: Float32Array.from(links, () => rand(-0.5, 0.5)),
  }
  flattenGlyphWorld(world, 1, 0)
  return world
}

/**
 * Da volumen a la figura: `depth` es la profundidad máxima (unidades del
 * mundo) y `flat` (0–1) cuánto se ha aplanado ya. Con flat = 1 queda la
 * figura plana, con fibras rectas.
 */
export function flattenGlyphWorld(world: GlyphWorld, depth: number, flat: number): void {
  const k = 1 - flat
  world.nodes.forEach((n, i) => {
    n.z = world.depthOf[i] * depth * k
  })
  world.links.forEach((l, i) => {
    const a = world.nodes[l.a]
    const b = world.nodes[l.b]
    const len = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    const bend = world.bendOf[i] * len * (0.15 + 0.6 * k)
    l.cx = (a.x + b.x) / 2 - (b.y - a.y) * bend / (len || 1)
    l.cy = (a.y + b.y) / 2 + (b.x - a.x) * bend / (len || 1)
    l.cz = (a.z + b.z) / 2 + bend * k
  })
}
