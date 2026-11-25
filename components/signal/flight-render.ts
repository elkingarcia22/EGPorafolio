import type { FlightLink, FlightWorld } from './flight-world'
import { createDepthComposer, drawGlow, glowSprite, quadPoint, CYAN, ICE, SPARK, type DepthLayer } from './styles/paint'

/** Cámara: posición en el mundo y giro leve sobre su eje */
export interface FlightCamera {
  x: number
  y: number
  z: number
  roll: number
}

export interface FlightFrame {
  /** punto (fracciones del lienzo) hacia el que mira la cámara; por defecto, el de las opciones */
  center?: { x: number; y: number }
  ctx: CanvasRenderingContext2D
  dpr: number
  width: number
  height: number
  time: number
  camera: FlightCamera
  /** cuánto avanzó la cámara en este cuadro (para las estelas del polvo) */
  speed: number
  /** opacidad general (la carga se disuelve al final) */
  fade: number
  /** brillo de cada neurona (impulsos y llegadas) */
  glow: Float32Array
  pulses: readonly { link: number; t: number; forward: boolean }[]
  /**
   * Avance propio de cada conexión (0 = sin tender, 1 = conectada). Si se da,
   * reemplaza al tendido por cercanía: así una fibra puede salir a buscar, y
   * quedarse o recogerse (la búsqueda de conexiones de la carga).
   */
  linkGrow?: Float32Array
  /**
   * Distancia hasta la que todo se ve nítido (por defecto, la del viaje). Al
   * alejarse para mostrar una figura entera, se sube: la figura queda enfocada.
   */
  focusUntil?: number
  /** brillo base de las fibras (por defecto 0.28): más alto, la red se lee aun de lejos */
  linkAlpha?: number
}

const NEAR = 0.35
const FAR = 26
const FOG_START = 12
/** Distancia a la que la cámara "busca" conexiones por delante */
const REVEAL_AHEAD = 13
const REVEAL_SPAN = 4
const DOF = { far: 3, near: 10 }
/** Tope del núcleo y del destello (px): de cerca, la neurona es luz, no un disco */
const MAX_CORE_PX = 9
const MAX_FLARE_PX = 150
/** Nubes de fondo: [x, y, radio relativo al alto, color, paralaje] */
const CLOUDS: readonly [number, number, number, string, number][] = [
  [0.3, 0.4, 0.55, SPARK, 14],
  [0.72, 0.35, 0.6, '64,96,255', 22],
  [0.55, 0.68, 0.45, SPARK, 30],
  [0.15, 0.75, 0.5, '64,96,255', 18],
]

interface Projected {
  x: number
  y: number
  /** distancia a la cámara */
  d: number
  /** escala de perspectiva */
  s: number
}

export interface FlightRenderOptions {
  /** altura (fracción del lienzo) del punto hacia el que mira la cámara */
  centerY?: number
  /** partículas de polvo */
  dust?: number
}

export function createFlightRenderer(
  world: FlightWorld,
  { centerY = 0.5, dust: dustCount = 420 }: FlightRenderOptions = {},
) {
  const composer = createDepthComposer()
  const dust = Array.from({ length: dustCount }, () => ({ x: (Math.random() - 0.5) * 22, y: (Math.random() - 0.5) * 16, z: Math.random() * FAR }))

  return function render(f: FlightFrame): void {
    const { ctx, width, height, camera, time, glow } = f
    const focal = Math.min(width, height) * 0.85
    const cos = Math.cos(camera.roll)
    const sin = Math.sin(camera.roll)

    const project = (x: number, y: number, z: number): Projected | null => {
      const d = z - camera.z
      if (d < NEAR || d > FAR) return null
      const s = focal / d
      const px = (x - camera.x) * s
      const py = (y - camera.y) * s
      return { x: width * (f.center?.x ?? 0.5) + px * cos - py * sin, y: height * (f.center?.y ?? centerY) + px * sin + py * cos, d, s }
    }
    // La niebla empieza después de la zona enfocada: una figura vista de lejos no se apaga.
    const fogStart = Math.max(FOG_START, f.focusUntil ?? 0)
    const fog = (d: number) => Math.min(1, Math.max(0, 1 - (d - fogStart) / (FAR - FOG_START))) * Math.min(1, (d - NEAR) / 0.9)
    const farFrom = Math.max(10.5, f.focusUntil ?? 0)
    const layerOf = (d: number): DepthLayer => (d < 2.4 ? 'near' : d > farFrom ? 'far' : 'focus')
    const linkAlpha = f.linkAlpha ?? 0.28

    const pts = world.nodes.map((n) => project(n.x, n.y, n.z))
    // Una conexión se tiende cuando la cámara se acerca: va encontrando la red.
    const grow = (link: FlightLink, index: number) => {
      if (f.linkGrow) return f.linkGrow[index]
      const z = Math.min(world.nodes[link.a].z, world.nodes[link.b].z)
      // Con una figura enfocada de lejos, sus conexiones siguen tendidas hasta donde llega el foco.
      const ahead = Math.max(REVEAL_AHEAD, (f.focusUntil ?? 0) + REVEAL_SPAN)
      return Math.min(1, Math.max(0, (camera.z + ahead - z) / REVEAL_SPAN))
    }

    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'

    // Nebulosa: se mueve poco, como un fondo muy lejano.
    CLOUDS.forEach(([x, y, r, rgb, par], i) => {
      const breathe = 0.85 + 0.15 * Math.sin(time * 0.0005 + i * 1.7)
      drawGlow(ctx, glowSprite(rgb, 0.95), x * width - camera.x * par, y * height - camera.y * par, r * height * breathe, 0.17 * f.fade)
    })

    // Polvo: estelas que se alargan con la velocidad del viaje.
    ctx.strokeStyle = `rgba(200,220,255,${0.35 * f.fade})`
    ctx.lineWidth = 1
    ctx.beginPath()
    for (const p of dust) {
      if (p.z - camera.z < NEAR) p.z += FAR
      if (p.z - camera.z > FAR) p.z -= FAR
      const head = project(p.x + camera.x * 0.6, p.y + camera.y * 0.6, p.z)
      const tail = project(p.x + camera.x * 0.6, p.y + camera.y * 0.6, p.z + 0.06 + f.speed * 3)
      if (!head || !tail) continue
      ctx.moveTo(tail.x, tail.y)
      ctx.lineTo(head.x + 0.01, head.y)
    }
    ctx.stroke()

    const paint = (g: CanvasRenderingContext2D, layer: DepthLayer) => {
      g.globalCompositeOperation = 'lighter'
      // Fibras: dos hebras curvas por conexión.
      world.links.forEach((link, index) => {
        const a = pts[link.a]
        const b = pts[link.b]
        if (!a || !b) return
        const d = Math.min(a.d, b.d)
        if (layerOf(d) !== layer) return
        const k = grow(link, index)
        if (k <= 0) return
        const c = project(link.cx, link.cy, link.cz)
        if (!c) return
        const alpha = fog(Math.max(a.d, b.d)) * f.fade
        const lit = Math.max(glow[link.a], glow[link.b])
        // Mientras se tiende, solo se dibuja la parte ya recorrida.
        const cx = a.x + (c.x - a.x) * k
        const cy = a.y + (c.y - a.y) * k
        const end = quadPoint(a.x, a.y, c.x, c.y, b.x, b.y, k)
        const width = Math.min(2.4, 0.25 + 9 / d)
        g.lineWidth = width
        g.strokeStyle = `rgba(225,235,255,${(linkAlpha + lit * 0.5) * alpha})`
        g.beginPath()
        g.moveTo(a.x, a.y)
        g.quadraticCurveTo(cx, cy, end.x, end.y)
        g.stroke()
        g.lineWidth = width * 0.55
        g.strokeStyle = `rgba(${CYAN},${0.16 * alpha})`
        g.beginPath()
        g.moveTo(a.x + 1.5, a.y + 1)
        g.quadraticCurveTo(cx - 3, cy + 2, end.x + 1.5, end.y + 1)
        g.stroke()
        // La punta que busca la otra neurona.
        if (k < 1) drawGlow(g, glowSprite(ICE), end.x, end.y, 10, 0.8 * alpha)
      })

      // Neuronas: núcleo blanco, halo frío; las principales con destello en cruz.
      world.nodes.forEach((n, i) => {
        const p = pts[i]
        if (!p || layerOf(p.d) !== layer) return
        if (p.x < -300 || p.x > width + 300 || p.y < -300 || p.y > height + 300) return
        const alpha = fog(p.d) * f.fade
        const twinkle = 0.8 + 0.2 * Math.sin(time * 0.003 + n.phase * 3)
        const reach = n.size * 0.045 * p.s
        const r = Math.min(MAX_CORE_PX, reach)
        const hot = glow[i] > 0.6
        // El halo sí crece con la cercanía: la neurona se vuelve una nube de luz.
        const halo = Math.min(260, reach * (n.waypoint ? 9 : 6)) * (1 + glow[i] * 0.8)
        drawGlow(g, glowSprite(hot ? SPARK : ICE), p.x, p.y, halo, (0.35 + 0.55 * glow[i]) * alpha * twinkle)
        g.fillStyle = `rgba(255,255,255,${0.9 * alpha * twinkle})`
        g.beginPath()
        g.arc(p.x, p.y, Math.max(0.6, r), 0, Math.PI * 2)
        g.fill()
        // Soma: anillo fino alrededor de las neuronas principales cercanas.
        if (n.waypoint && reach > MAX_CORE_PX) {
          g.strokeStyle = `rgba(${hot ? SPARK : ICE},${0.55 * alpha})`
          g.lineWidth = 1.2
          g.beginPath()
          g.arc(p.x, p.y, Math.min(70, reach * 1.8), 0, Math.PI * 2)
          g.stroke()
        }
        if (n.waypoint || n.size > 2.2) {
          const len = Math.min(MAX_FLARE_PX, r * (n.waypoint ? 16 : 9) * (1 + glow[i] * 1.5))
          g.strokeStyle = `rgba(255,255,255,${0.35 * alpha * twinkle})`
          g.lineWidth = 0.7
          g.beginPath()
          g.moveTo(p.x - len, p.y)
          g.lineTo(p.x + len, p.y)
          g.moveTo(p.x, p.y - len * 0.6)
          g.lineTo(p.x, p.y + len * 0.6)
          g.stroke()
        }
      })

      // Impulsos: cometas que corren por las fibras.
      for (const pulse of f.pulses) {
        // Los impulsos solo corren por fibras ya conectadas.
        if (f.linkGrow && f.linkGrow[pulse.link] < 1) continue
        const link = world.links[pulse.link]
        const a = pts[link.a]
        const b = pts[link.b]
        const c = project(link.cx, link.cy, link.cz)
        if (!a || !b || !c || layerOf(Math.min(a.d, b.d)) !== layer) continue
        const at = pulse.forward ? pulse.t : 1 - pulse.t
        const dir = pulse.forward ? -1 : 1
        const alpha = fog(Math.max(a.d, b.d)) * f.fade
        for (let j = 8; j >= 0; j--) {
          const q = quadPoint(a.x, a.y, c.x, c.y, b.x, b.y, Math.min(1, Math.max(0, at + dir * j * 0.02)))
          drawGlow(g, glowSprite(j < 2 ? '255,255,255' : CYAN), q.x, q.y, Math.min(26, 3 + 40 / a.d) - j * 0.4, (0.65 - j * 0.06) * alpha)
        }
      }
      g.globalCompositeOperation = 'source-over'
    }

    composer.render(f, DOF, paint)
    ctx.globalCompositeOperation = 'source-over'
  }
}
