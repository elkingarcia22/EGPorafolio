import { buildFlightWorld } from './flight-world'
import { createFlightRenderer } from './flight-render'
import { createFlightPulses } from './flight-pulses'
import { createLinkSearch } from './flight-probes'

/** Dos neuronas en el camino (dos llegadas); pocos nodos alrededor para que la red se lea limpia */
const WORLD = { waypoints: 2, spacing: 10, viewDistance: 3.2, radius: 6, count: 160, tail: 22 }
/** Brillo con el que se encienden las neuronas al quedar conectadas */
const CONNECT_GLOW = 0.7
const PULSE_CHANCE = 0.35
/** Pulsos que salen de una neurona principal cuando la cámara llega a ella */
const ARRIVAL_PULSES = 6
/** Salto final: cuánto avanza la cámara mientras la carga se disuelve */
const WARP_DISTANCE = 34
/** Avance lento mientras la carga espera completa, antes del salto */
const HOLD_DRIFT = 0.0009
/** Si la carga no avanza en este tiempo (se saltó o ya terminó), el lienzo deja de dibujar */
const IDLE_STOP_MS = 6000

export interface FlightPoint {
  x: number
  y: number
}

export interface FlightLoopOptions {
  /** Avance de la carga, 0–1. Después de llegar a 1 vuelve a 0: ese tramo es el salto final. */
  progress: () => number
  /** Dónde queda en pantalla (px) la última neurona mientras espera completa, antes del salto */
  onAnchor?: (point: FlightPoint) => void
}

export interface FlightLoop {
  /** Tamaño del lienzo en px CSS y densidad de píxeles */
  resize: (width: number, height: number, dpr: number) => void
  /** Dibuja un cuadro; devuelve false cuando la carga terminó y el lienzo ya no dibuja más */
  frame: (time: number) => boolean
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * El vuelo de la carga, sin depender de la página: lo usa <NeuralFlight> en el hilo
 * principal o dentro de un worker (flight.worker.ts) con un OffscreenCanvas, para que
 * siga fluido aunque la página nueva se esté armando.
 */
export function createFlightLoop(ctx: CanvasRenderingContext2D, { progress, onAnchor }: FlightLoopOptions): FlightLoop {
  const world = buildFlightWorld(WORLD)
  const render = createFlightRenderer(world)
  const impulses = createFlightPulses(world)
  const search = createLinkSearch(world)
  const arrived = new Set<number>()

  let lastTime = 0
  let width = 0
  let height = 0
  let dpr = 1
  let peaked = false
  let peakAt = 0
  let lastZ = 0
  let idleSince = -1

  /** Posición de la cámara según el avance: tramos que frenan al llegar a cada neurona. */
  const cameraAt = (p: number, time: number) => {
    const { stops } = world
    const u = Math.min(0.9999, Math.max(0, p)) * (stops.length - 1)
    const seg = Math.floor(u)
    const k = easeInOut(u - seg)
    const a = stops[seg]
    const b = stops[seg + 1]
    if (k > 0.9 && !arrived.has(seg)) {
      arrived.add(seg)
      // Al llegar, la neurona se conecta con todas sus vecinas y dispara.
      search.connectNode(world.route[seg])
      impulses.fire(world.route[seg], ARRIVAL_PULSES)
    }
    return {
      x: a.x + (b.x - a.x) * k + Math.sin(time * 0.0007) * 0.15,
      y: a.y + (b.y - a.y) * k + Math.cos(time * 0.0006) * 0.12,
      z: a.z + (b.z - a.z) * k,
      roll: Math.sin(time * 0.0004) * 0.05 + (b.x - a.x) * 0.012 * Math.sin(Math.PI * k),
    }
  }

  /** Guarda dónde se ve la última neurona: de ahí parte la entrada de la página. */
  const reportAnchor = (camera: ReturnType<typeof cameraAt>) => {
    if (!onAnchor) return
    const node = world.nodes[world.route[world.route.length - 1]]
    const d = node.z - camera.z
    if (d <= 0.35) return
    const scale = (Math.min(width, height) * 0.85) / d
    const px = (node.x - camera.x) * scale
    const py = (node.y - camera.y) * scale
    const cos = Math.cos(camera.roll)
    const sin = Math.sin(camera.roll)
    onAnchor({ x: width * 0.5 + px * cos - py * sin, y: height * 0.5 + px * sin + py * cos })
  }

  const draw = (time: number) => {
    const p = Math.max(0, Math.min(1, progress()))
    if (p >= 0.999 && !peaked) {
      peaked = true
      peakAt = time
      impulses.glow[world.route[world.route.length - 1]] = 1
    }
    // Después del 100 %: espera con un avance lento y luego el salto.
    const exit = peaked ? 1 - p : 0
    const camera = cameraAt(peaked ? 1 : p, time)
    if (peaked) camera.z += (time - peakAt) * HOLD_DRIFT + exit * exit * WARP_DISTANCE
    if (peaked && exit < 0.02) reportAnchor(camera)
    const speed = Math.max(0, camera.z - lastZ)
    lastZ = camera.z

    // Búsqueda de conexiones en primer plano: fibras que salen, se quedan o se recogen.
    const dt = lastTime ? Math.min(64, time - lastTime) : 16
    lastTime = time
    for (const node of search.step(dt, camera.z, peaked ? 1 : p)) {
      impulses.glow[node] = Math.max(impulses.glow[node], CONNECT_GLOW)
    }
    // Impulsos al azar cerca de la cámara (solo corren por fibras ya conectadas).
    impulses.spawnNear(camera.z, PULSE_CHANCE * (0.3 + p))
    impulses.step()

    render({
      ctx,
      dpr,
      width,
      height,
      time,
      camera,
      speed,
      fade: peaked ? Math.min(1, p * 1.4) : Math.min(1, 0.35 + p * 2),
      glow: impulses.glow,
      pulses: impulses.pulses,
      linkGrow: search.grow,
    })
  }

  return {
    resize(w, h, ratio) {
      width = w
      height = h
      dpr = ratio
      ctx.canvas.width = w * ratio
      ctx.canvas.height = h * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    },
    frame(time) {
      if (idleSince < 0) idleSince = time
      draw(time)
      // Cuando la carga terminó y se disolvió (o nunca arrancó), el lienzo deja de dibujar.
      if (progress() > 0.001) idleSince = time
      if ((peaked && progress() <= 0.01) || time - idleSince > IDLE_STOP_MS) {
        ctx.clearRect(0, 0, width, height)
        return false
      }
      return true
    },
  }
}
