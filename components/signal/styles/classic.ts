import type { Frame, NetworkStyle } from './types'

/** El estilo original: líneas rectas finas, nodos cuadrados como la estática. */
export function createClassicStyle(): NetworkStyle {
  return {
    depth3d: false,
    draw(frame: Frame) {
      const { ctx, nodes, links, pulses, colors } = frame
      const { paper, signal } = colors

      for (const { a, b, alpha } of links) {
        const g = Math.max(nodes[a].glow, nodes[b].glow)
        ctx.strokeStyle = g > 0.05 ? `rgba(${signal},${(0.3 + g * 0.6) * alpha})` : `rgba(${paper},${0.2 * alpha})`
        ctx.lineWidth = g > 0.05 ? 1.2 : 1
        ctx.beginPath()
        ctx.moveTo(nodes[a].x, nodes[a].y)
        ctx.lineTo(nodes[b].x, nodes[b].y)
        ctx.stroke()
      }

      for (const pulse of pulses) {
        const from = nodes[pulse.from]
        const to = nodes[pulse.to]
        const x = from.x + (to.x - from.x) * pulse.t
        const y = from.y + (to.y - from.y) * pulse.t
        ctx.fillStyle = `rgba(${signal},0.18)`
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(${signal},0.95)`
        ctx.beginPath()
        ctx.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const { x, y, t, glow, size } of nodes) {
        const s = size + glow * 3
        if (glow > 0.05) {
          ctx.fillStyle = `rgba(${signal},${0.15 * glow})`
          ctx.beginPath()
          ctx.arc(x, y, s * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = glow > 0.3 ? `rgba(${signal},1)` : `rgba(${paper},${0.4 + 0.45 * t})`
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
      }
    },
  }
}
