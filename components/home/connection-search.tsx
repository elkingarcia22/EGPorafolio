'use client'

import { useEffect, useRef } from 'react'

/** Nodos por cada 10.000 px² de pantalla (con tope) */
const NODE_DENSITY = 1.3
const MAX_NODES = 170
/** Distancia máxima a la que un nodo "busca" vecinos (fracción del lado corto) */
const SEARCH_REACH = 0.2
/** Cuánto tarda una línea en tenderse hacia el otro nodo */
const PROBE_MS = 420
/** Cuánto dura un intento fallido mientras se recoge y apaga */
const FAIL_MS = 380
/** Intentos nuevos por segundo, al principio y al final de la carga */
const PROBES_PER_S = { start: 10, end: 34 }
/** Probabilidad de que un intento conecte, al principio y al final */
const SUCCESS = { start: 0.12, end: 0.7 }
/** Conexiones máximas que llegan a quedar cuando la carga está completa */
const MAX_LINKS = 260
const PAPER = '241,240,236'
const SIGNAL = '64,96,255'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  lit: number
}

interface Probe {
  a: number
  b: number
  born: number
  ok: boolean
}

interface Props {
  /** Avance de la carga, 0–1 (al bajar, las conexiones se sueltan) */
  progress: React.MutableRefObject<number>
  className?: string
}

/**
 * Fondo de la carga: nodos sueltos que lanzan líneas hacia sus vecinos,
 * como si buscaran conexión. Al principio casi todas fallan; a medida que
 * avanza la carga, cada vez más se quedan y la red se va tejiendo.
 */
export function ConnectionSearch({ progress, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let probes: Probe[] = []
    let links = new Set<string>()
    let frame = 0
    let last = performance.now()
    let spawnDebt = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(MAX_NODES, Math.round(((width * height) / 10000) * NODE_DENSITY))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        lit: 0,
      }))
      probes = []
      links = new Set()
    }

    const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)

    const spawnProbe = (now: number, p: number) => {
      const a = Math.floor(Math.random() * nodes.length)
      const reach = Math.min(width, height) * SEARCH_REACH
      const near: number[] = []
      nodes.forEach((n, i) => {
        if (i !== a && Math.hypot(n.x - nodes[a].x, n.y - nodes[a].y) < reach) near.push(i)
      })
      if (!near.length) return
      const b = near[Math.floor(Math.random() * near.length)]
      if (links.has(key(a, b))) return
      const chance = SUCCESS.start + (SUCCESS.end - SUCCESS.start) * p
      probes.push({ a, b, born: now, ok: Math.random() < chance })
    }

    const drawLinks = () => {
      const reach = Math.min(width, height) * SEARCH_REACH * 1.4
      ctx.lineWidth = 0.7
      for (const k of Array.from(links)) {
        const [a, b] = k.split('-').map(Number)
        const na = nodes[a]
        const nb = nodes[b]
        const d = Math.hypot(na.x - nb.x, na.y - nb.y)
        if (d > reach) {
          links.delete(k)
          continue
        }
        ctx.strokeStyle = `rgba(${PAPER},${0.2 * (1 - d / reach) + 0.05})`
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.lineTo(nb.x, nb.y)
        ctx.stroke()
      }
    }

    // Intentos en curso: la línea se tiende; si conecta queda, si no se recoge.
    const drawProbes = (now: number) => {
      const reach = Math.min(width, height) * SEARCH_REACH * 1.4
      probes = probes.filter((pr) => {
        const age = now - pr.born
        const na = nodes[pr.a]
        const nb = nodes[pr.b]
        // Si un nodo dio la vuelta por el borde, el intento se suelta en vez de cruzar el lienzo.
        if (Math.hypot(na.x - nb.x, na.y - nb.y) > reach) return false
        let reachT = Math.min(1, age / PROBE_MS)
        let alpha = 0.55
        if (age > PROBE_MS) {
          if (pr.ok) {
            links.add(key(pr.a, pr.b))
            na.lit = 1
            nb.lit = 1
            return false
          }
          const back = Math.min(1, (age - PROBE_MS) / FAIL_MS)
          reachT = 1 - back * 0.85
          alpha = 0.4 * (1 - back)
          if (back >= 1) return false
        }
        const ex = na.x + (nb.x - na.x) * reachT
        const ey = na.y + (nb.y - na.y) * reachT
        ctx.strokeStyle = pr.ok ? `rgba(${SIGNAL},0.9)` : `rgba(${PAPER},${alpha})`
        ctx.lineWidth = pr.ok ? 1 : 0.6
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.lineTo(ex, ey)
        ctx.stroke()
        // Punta que busca
        ctx.fillStyle = pr.ok ? `rgba(${SIGNAL},1)` : `rgba(${PAPER},${alpha + 0.2})`
        ctx.fillRect(ex - 1.5, ey - 1.5, 3, 3)
        return true
      })
    }

    const draw = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const p = Math.max(0, Math.min(1, progress.current))
      ctx.clearRect(0, 0, width, height)

      // Las conexiones se sueltan cuando la carga termina y se disuelve.
      const keep = Math.round(p * MAX_LINKS)
      if (links.size > keep) Array.from(links).slice(0, links.size - keep).forEach((k) => links.delete(k))

      for (const n of nodes) {
        n.x = (n.x + n.vx * dt * 0.06 + width) % width
        n.y = (n.y + n.vy * dt * 0.06 + height) % height
        n.lit *= 0.95
      }

      // Nuevos intentos de conexión, cada vez más seguidos.
      if (p > 0 && p < 1) {
        spawnDebt += ((PROBES_PER_S.start + (PROBES_PER_S.end - PROBES_PER_S.start) * p) * dt) / 1000
        while (spawnDebt >= 1) {
          spawnProbe(now, p)
          spawnDebt -= 1
        }
      }

      drawLinks()
      drawProbes(now)

      for (const n of nodes) {
        const s = 1.6 + n.lit * 2.2
        ctx.fillStyle = n.lit > 0.05 ? `rgba(${SIGNAL},${0.35 + n.lit * 0.65})` : `rgba(${PAPER},0.32)`
        ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s)
      }
    }

    // Cuando la carga terminó y la red se soltó, el lienzo deja de dibujar.
    let peaked = false
    const loop = (now: number) => {
      draw(now)
      if (progress.current >= 1) peaked = true
      if (peaked && progress.current <= 0.01 && !links.size && !probes.length) return
      frame = requestAnimationFrame(loop)
    }
    resize()
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [progress])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
