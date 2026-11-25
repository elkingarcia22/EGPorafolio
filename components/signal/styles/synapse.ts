import type { Frame, NetworkStyle } from './types'
import {
  bucketAlpha, bucketLinks, createDepthComposer, curveControl, drawGlow,
  glowSprite, linkLayer, layerOf, quadPoint, CYAN, ICE, SPARK, type DepthLayer,
} from './paint'

/** Foco corto: mucho desenfoque fuera del plano medio, como una macro */
const DOF = { far: 4, near: 9 }
/** Topes para los nodos vistos de muy cerca */
const MAX_CORE_PX = 7
const MAX_HALO_PX = 220
const MAX_FLARE_PX = 140
/** Desde este tamaño de núcleo (px) el halo crece más rápido: la neurona está cerca */
const CLOSE_REACH_PX = 4
/** Grosor de las fibras por capa: de cerca se ven más gruesas, como en la carga */
const LAYER_WIDTH: Record<DepthLayer, number> = { far: 0.8, focus: 1, near: 2.6 }
const BEND = 0.26
const SWAY = 0.07
/** Hebras por conexión (un haz de fibras) */
const STRANDS = [0, 0.13] as const

/**
 * V2 · Sinapsis. Fibras finas y luminosas, curvas como neuronas reales,
 * con nodos-estrella que destellan y nubes magenta y azules detrás. El foco
 * es corto: lo que no está en el plano medio se ve muy desenfocado.
 */
export function createSynapseStyle(): NetworkStyle {
  const composer = createDepthComposer()

  return {
    depth3d: true,
    draw(frame: Frame) {
      const { nodes, links, pulses, time, scale } = frame
      const k = Math.max(0.6, scale / 320)

      // La nebulosa y el bokeh los pinta el fondo único del inicio (ver <NeuralBackdrop>):
      // aquí no, porque quedarían cortados en el borde de la sección.

      const paintLayer = (g: CanvasRenderingContext2D, layer: DepthLayer) => {
        g.globalCompositeOperation = 'lighter'
        const buckets = bucketLinks(links.filter((l) => linkLayer(nodes[l.a].depth, nodes[l.b].depth) === layer))
        buckets.forEach((bucket, step) => {
          if (!bucket.length) return
          const alpha = bucketAlpha(step)
          for (const offset of STRANDS) {
            g.beginPath()
            for (const link of bucket) {
              const a = nodes[link.a]
              const b = nodes[link.b]
              const c = curveControl(a.x, a.y, b.x, b.y, (link.seed + offset) % 1, time, BEND, SWAY)
              g.moveTo(a.x, a.y)
              g.quadraticCurveTo(c.x, c.y, b.x, b.y)
            }
            g.lineWidth = (offset ? 0.5 : 0.85) * k * LAYER_WIDTH[layer]
            g.strokeStyle = `rgba(${offset ? CYAN : '225,235,255'},${(offset ? 0.16 : 0.3) * alpha})`
            g.stroke()
          }
        })

        // Nodos-estrella: núcleo blanco, halo frío y destello en cruz en los encendidos.
        for (const n of nodes) {
          if (layerOf(n.depth) !== layer || n.t < 0.05) continue
          const twinkle = 0.75 + 0.25 * Math.sin(time * 0.003 + n.phase * 3)
          // De cerca (al viajar dentro de la red) el núcleo se mantiene pequeño
          // y crece el halo: la neurona se ve como luz, como en la carga.
          const reach = (0.8 + n.size * 0.32) * k
          const r = Math.min(MAX_CORE_PX, reach)
          const hot = n.glow > 0.75
          const closeness = Math.max(1, reach / CLOSE_REACH_PX)
          drawGlow(g, glowSprite(hot ? SPARK : ICE), n.x, n.y, Math.min(MAX_HALO_PX, reach * (7 + n.glow * 10) * closeness), (0.32 + 0.5 * n.glow) * twinkle * n.t)
          g.fillStyle = `rgba(255,255,255,${(0.55 + 0.45 * n.t) * twinkle})`
          g.beginPath()
          g.arc(n.x, n.y, r, 0, Math.PI * 2)
          g.fill()
          if (n.size > 2.6 || hot) {
            const len = Math.min(MAX_FLARE_PX, reach * (9 + n.glow * 14))
            g.strokeStyle = `rgba(255,255,255,${0.32 * twinkle * n.t})`
            g.lineWidth = 0.6
            g.beginPath()
            g.moveTo(n.x - len, n.y)
            g.lineTo(n.x + len, n.y)
            g.moveTo(n.x, n.y - len * 0.6)
            g.lineTo(n.x, n.y + len * 0.6)
            g.stroke()
          }
        }

        // Impulsos: cometas que corren por la fibra principal.
        for (const p of pulses) {
          const lo = Math.min(p.from, p.to)
          const hi = Math.max(p.from, p.to)
          if (linkLayer(nodes[lo].depth, nodes[hi].depth) !== layer) continue
          const a = nodes[lo]
          const b = nodes[hi]
          const c = curveControl(a.x, a.y, b.x, b.y, p.seed, time, BEND, SWAY)
          const at = p.from === lo ? p.t : 1 - p.t
          const dir = p.from === lo ? -1 : 1
          for (let j = 9; j >= 0; j--) {
            const q = quadPoint(a.x, a.y, c.x, c.y, b.x, b.y, Math.min(1, Math.max(0, at + dir * j * 0.018)))
            drawGlow(g, glowSprite(j < 2 ? '255,255,255' : CYAN), q.x, q.y, (7 - j * 0.5) * k, 0.6 - j * 0.055)
          }
        }
        g.globalCompositeOperation = 'source-over'
      }

      composer.render(frame, DOF, paintLayer)
    },
  }
}
