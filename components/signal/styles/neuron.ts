import type { Frame, FrameLink, NetworkStyle } from './types'
import {
  bucketAlpha, bucketLinks, createBokeh, createDepthComposer, curveControl, drawGlow,
  glowSprite, linkLayer, layerOf, quadPoint, CYAN, ICE, SPARK, type DepthLayer,
} from './paint'

/** Cuántos nodos (los más conectados) se dibujan como soma con anillo */
const HUB_SHARE = 0.11
const DOF = { far: 2.6, near: 6 }
/** Curvatura de las dendritas */
const BEND = 0.2
const SWAY = 0.05

/**
 * V1 · Neurona. Como una red neuronal ilustrada: los nodos más conectados
 * son somas con anillo y halo, las conexiones son dendritas curvas hechas
 * de puntos que fluyen, y algunas neuronas "disparan" en magenta.
 */
export function createNeuronStyle(): NetworkStyle {
  const composer = createDepthComposer()
  const bokeh = createBokeh(46, [ICE, CYAN, ICE, SPARK], [14, 90])

  const curve = (frame: Frame, link: FrameLink) => {
    const a = frame.nodes[link.a]
    const b = frame.nodes[link.b]
    return { a, b, c: curveControl(a.x, a.y, b.x, b.y, link.seed, frame.time, BEND, SWAY) }
  }

  return {
    depth3d: true,
    draw(frame) {
      const { ctx, nodes, links, pulses, colors, time, scale } = frame
      const k = Math.max(0.6, scale / 320)

      // Grado de cada nodo: los más conectados son somas.
      const degree = new Uint16Array(nodes.length)
      for (const l of links) {
        degree[l.a]++
        degree[l.b]++
      }
      const sorted = Array.from(degree).sort((x, y) => y - x)
      const hubMin = Math.max(3, sorted[Math.floor(nodes.length * HUB_SHARE)] ?? 99)

      bokeh.draw(frame, (d) => d < 0.6)

      const paintLayer = (g: CanvasRenderingContext2D, layer: DepthLayer) => {
        g.globalCompositeOperation = 'lighter'
        const inLayer = links.filter((l) => linkLayer(nodes[l.a].depth, nodes[l.b].depth) === layer)
        const buckets = bucketLinks(inLayer)

        // Dendritas: un tubo tenue y, encima, puntos que fluyen.
        buckets.forEach((bucket, step) => {
          if (!bucket.length) return
          const alpha = bucketAlpha(step)
          g.beginPath()
          for (const link of bucket) {
            const { a, b, c } = curve(frame, link)
            g.moveTo(a.x, a.y)
            g.quadraticCurveTo(c.x, c.y, b.x, b.y)
          }
          g.setLineDash([])
          g.lineWidth = 2.2 * k
          g.strokeStyle = `rgba(${colors.signal},${0.07 * alpha})`
          g.stroke()
          g.setLineDash([0.1, 4.2 * k])
          g.lineDashOffset = frame.reducedMotion ? 0 : -time * 0.012
          g.lineCap = 'round'
          g.lineWidth = 1.7 * k
          g.strokeStyle = `rgba(${ICE},${0.72 * alpha})`
          g.stroke()
        })
        g.setLineDash([])

        // Neuronas.
        nodes.forEach((n, i) => {
          if (layerOf(n.depth) !== layer || n.t < 0.05) return
          const breathe = 1 + 0.06 * Math.sin(time * 0.002 + n.phase)
          // Solo un impulso que llega a un soma lo hace disparar en magenta.
          const fired = n.glow > 0.75
          if (degree[i] >= hubMin && n.t > 0.6) {
            const r = (4.2 + (degree[i] - hubMin) * 0.25) * k * breathe * (0.7 + n.size / 5)
            const tone = fired ? SPARK : CYAN
            drawGlow(g, glowSprite(tone), n.x, n.y, r * (fired ? 6 : 4), (fired ? 0.75 : 0.42) * n.t)
            g.globalCompositeOperation = 'source-over'
            g.fillStyle = `rgba(8,12,30,${0.85 * n.t})`
            g.beginPath()
            g.arc(n.x, n.y, r, 0, Math.PI * 2)
            g.fill()
            g.globalCompositeOperation = 'lighter'
            g.lineWidth = 1.6 * k
            g.strokeStyle = `rgba(${fired ? SPARK : ICE},${0.95 * n.t})`
            g.stroke()
            if (fired) {
              g.beginPath()
              g.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2)
              g.fillStyle = `rgba(255,220,240,${0.9 * n.glow})`
              g.fill()
            }
          } else {
            const r = (0.9 + n.size * 0.35) * k * (1 + n.glow)
            drawGlow(g, glowSprite(CYAN), n.x, n.y, r * 5, (0.25 + 0.5 * n.glow) * n.t)
            g.fillStyle = `rgba(225,238,255,${(0.45 + 0.5 * n.t) * (0.7 + 0.3 * n.glow)})`
            g.beginPath()
            g.arc(n.x, n.y, r, 0, Math.PI * 2)
            g.fill()
          }
        })

        // Impulsos: una chispa con estela que recorre la dendrita.
        for (const p of pulses) {
          const lo = Math.min(p.from, p.to)
          const hi = Math.max(p.from, p.to)
          if (linkLayer(nodes[lo].depth, nodes[hi].depth) !== layer) continue
          const { a, b, c } = curve(frame, { a: lo, b: hi, alpha: 1, seed: p.seed })
          const at = p.from === lo ? p.t : 1 - p.t
          const dir = p.from === lo ? -1 : 1
          for (let j = 4; j >= 0; j--) {
            const q = quadPoint(a.x, a.y, c.x, c.y, b.x, b.y, Math.min(1, Math.max(0, at + dir * j * 0.025)))
            drawGlow(g, glowSprite(CYAN), q.x, q.y, (10 - j * 1.5) * k, 0.55 - j * 0.1)
          }
          const head = quadPoint(a.x, a.y, c.x, c.y, b.x, b.y, at)
          g.fillStyle = 'rgba(255,255,255,0.95)'
          g.beginPath()
          g.arc(head.x, head.y, 1.8 * k, 0, Math.PI * 2)
          g.fill()
        }
        g.globalCompositeOperation = 'source-over'
      }

      composer.render(frame, DOF, paintLayer)
      ctx.globalCompositeOperation = 'lighter'
      bokeh.draw(frame, (d) => d > 0.9, 0.8)
      ctx.globalCompositeOperation = 'source-over'
    },
  }
}
