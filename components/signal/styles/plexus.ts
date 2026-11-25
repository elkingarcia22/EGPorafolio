import type { Frame, NetworkStyle } from './types'
import {
  bucketAlpha, bucketLinks, createBokeh, createDepthComposer, drawGlow,
  glowSprite, linkLayer, layerOf, BLUE, CYAN, ICE, SPARK, type DepthLayer,
} from './paint'

const DOF = { far: 3.2, near: 8 }
/** Opacidad de las caras de la malla */
const FACE_ALPHA = 0.08

/**
 * V3 · Plexo. Malla tridimensional de líneas rectas y caras traslúcidas,
 * con nodos como esferas de luz que crecen al acercarse a la cámara, un
 * núcleo de luz magenta-azul en el centro y mucho bokeh cian alrededor.
 */
export function createPlexusStyle(): NetworkStyle {
  const composer = createDepthComposer()
  const bokeh = createBokeh(70, () => [CYAN, CYAN, ICE, BLUE], [12, 120])

  return {
    depth3d: true,
    draw(frame: Frame) {
      const { ctx, nodes, links, pulses, colors, time, scale, camera } = frame
      const k = Math.max(0.6, scale / 320)

      // Centro de la figura: allí late el núcleo de luz.
      let cx = 0
      let cy = 0
      let count = 0
      for (const n of nodes) {
        if (n.t < 0.5) continue
        cx += n.x
        cy += n.y
        count++
      }
      ctx.globalCompositeOperation = 'lighter'
      if (count) {
        const pulse = 0.85 + 0.15 * Math.sin(time * 0.0011)
        const strength = (count / nodes.length) * frame.progress
        drawGlow(ctx, glowSprite(SPARK, 0.9), cx / count, cy / count, scale * 0.85 * pulse, 0.22 * strength)
        drawGlow(ctx, glowSprite(colors.signal, 0.95), cx / count - camera.x * 20, cy / count, scale * 1.4, 0.2 * strength)
      }
      bokeh.draw(frame, (d) => d < 0.6, 1.1)
      ctx.globalCompositeOperation = 'source-over'

      // Vecinos de cada nodo (para las caras de la malla).
      const neighbors: number[][] = nodes.map(() => [])
      for (const l of links) {
        if (l.alpha < 0.3) continue
        neighbors[l.a].push(l.b)
        neighbors[l.b].push(l.a)
      }

      const paintLayer = (g: CanvasRenderingContext2D, layer: DepthLayer) => {
        g.globalCompositeOperation = 'lighter'

        // Caras: cada nodo forma un triángulo con dos de sus vecinos conectados entre sí.
        g.fillStyle = `rgba(${colors.signal},${FACE_ALPHA * frame.progress})`
        g.beginPath()
        nodes.forEach((n, i) => {
          if (layerOf(n.depth) !== layer || i % 2) return
          const [p, q] = neighbors[i]
          if (p === undefined || q === undefined || !neighbors[p].includes(q)) return
          g.moveTo(n.x, n.y)
          g.lineTo(nodes[p].x, nodes[p].y)
          g.lineTo(nodes[q].x, nodes[q].y)
          g.closePath()
        })
        g.fill()

        const buckets = bucketLinks(links.filter((l) => linkLayer(nodes[l.a].depth, nodes[l.b].depth) === layer))
        buckets.forEach((bucket, step) => {
          if (!bucket.length) return
          g.beginPath()
          for (const { a, b } of bucket) {
            g.moveTo(nodes[a].x, nodes[a].y)
            g.lineTo(nodes[b].x, nodes[b].y)
          }
          g.lineWidth = 0.9 * k
          g.strokeStyle = `rgba(${CYAN},${0.55 * bucketAlpha(step)})`
          g.stroke()
        })

        // Esferas de luz: más grandes cuanto más cerca de la cámara.
        for (const n of nodes) {
          if (layerOf(n.depth) !== layer || n.t < 0.05) continue
          const r = (0.9 + n.size * 0.45) * k * (0.6 + n.depth * 0.9) * (1 + n.glow * 0.8)
          const hot = n.glow > 0.75
          drawGlow(g, glowSprite(hot ? SPARK : CYAN), n.x, n.y, r * 4.5, (0.4 + 0.5 * n.glow) * n.t)
          g.fillStyle = `rgba(230,250,255,${0.5 + 0.5 * n.t})`
          g.beginPath()
          g.arc(n.x, n.y, r, 0, Math.PI * 2)
          g.fill()
        }

        for (const p of pulses) {
          const a = nodes[p.from]
          const b = nodes[p.to]
          if (linkLayer(a.depth, b.depth) !== layer) continue
          const x = a.x + (b.x - a.x) * p.t
          const y = a.y + (b.y - a.y) * p.t
          drawGlow(g, glowSprite('255,255,255'), x, y, 9 * k, 0.8)
          drawGlow(g, glowSprite(ICE), x, y, 22 * k, 0.35)
        }
        g.globalCompositeOperation = 'source-over'
      }

      composer.render(frame, DOF, paintLayer)
      ctx.globalCompositeOperation = 'lighter'
      bokeh.draw(frame, (d) => d > 0.86, 1)
      ctx.globalCompositeOperation = 'source-over'
    },
  }
}
