'use client'

import { useEffect, useRef } from 'react'

/** Grafo en coordenadas de una caja 0–1 (x a la derecha, y hacia abajo). */
export interface NetworkGraph {
  nodes: readonly { x: number; y: number }[]
  links: readonly (readonly [number, number])[]
  /** ancho / alto de la caja */
  aspect: number
  /** ¿el punto (en coordenadas de caja) está sobre la figura? (para el hover) */
  contains?: (x: number, y: number) => boolean
}

export interface NetworkFit {
  /** ancho máximo de la caja, en fracción del lienzo */
  width: number
  /** alto máximo de la caja, en fracción del lienzo */
  height: number
  /** centro vertical de la caja, en fracción del lienzo */
  centerY: number
}

interface NetworkCanvasProps {
  graph: NetworkGraph | null
  /** 0 = ruido, 1 = red formada */
  progress: React.MutableRefObject<number>
  reducedMotion: boolean
  fit?: NetworkFit
  /** puntos de estática de fondo mientras es ruido (0 = ninguno) */
  noiseDots?: number
  /** cuánto de la estática queda cuando la red ya se formó (0 = se apaga del todo) */
  noiseFloor?: number
  /** la red se forma de izquierda a derecha en vez de toda a la vez */
  sweep?: boolean
  /** radio de influencia del cursor, en fracción del alto de la caja */
  cursorRadius?: number
  onHoverChange?: (hovering: boolean) => void
  className?: string
}

const DEFAULT_FIT: NetworkFit = { width: 1, height: 1, centerY: 0.5 }
const MAX_PULSES = 18
const PULSE_SPAWN_CHANCE = 0.08
const HOVER_MIN_PROGRESS = 0.8
/** Duración de la transformación entre dos figuras */
const MORPH_MS = 1300

interface Pulse {
  from: number
  to: number
  t: number
  speed: number
}

function rgbVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(',')
}

/**
 * Red de conexiones en canvas 2D: nodos que pasan de ruido a red, líneas
 * que arman la figura, impulsos azules que viajan entre nodos y nodos que
 * se encienden cerca del cursor. Lo usan el EG del inicio y Contacto.
 */
export function NetworkCanvas({
  graph,
  progress,
  reducedMotion,
  fit = DEFAULT_FIT,
  noiseDots = 0,
  noiseFloor = 0,
  sweep = false,
  cursorRadius = 0.28,
  onHoverChange,
  className = '',
}: NetworkCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoverCallback = useRef(onHoverChange)
  hoverCallback.current = onHoverChange
  // Se actualiza en el render: la escena lo lee al montarse.
  const graphRef = useRef(graph)
  graphRef.current = graph
  /** La escena registra aquí cómo transformarse hacia otra figura */
  const morphRef = useRef<((next: NetworkGraph) => void) | null>(null)
  const nodeCount = graph?.nodes.length ?? 0

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const initial = graphRef.current
    if (!wrap || !canvas || !ctx || !initial) return
    /** Figura actual (cambia al transformarse) */
    let graph: NetworkGraph = initial

    const paper = rgbVar('--paper')
    const signal = rgbVar('--signal')
    const n = graph.nodes.length
    const glow = new Float32Array(n)
    const sizes = Float32Array.from({ length: n }, () => 1.3 + Math.random() * 2)
    const phases = Float32Array.from({ length: n }, () => Math.random() * Math.PI * 2)
    // Posición de ruido (fracción del lienzo) y retraso de llegada de cada nodo.
    const start = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random() }))
    const delay = graph.nodes.map((node) => (sweep ? node.x * 0.45 + Math.random() * 0.08 : Math.random() * 0.25))
    const noise = Array.from({ length: noiseDots }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() < 0.85 ? 1.4 : 2.6,
      seed: Math.random() * 100,
    }))
    const pulses: Pulse[] = []
    /** Cursor en coordenadas de pantalla; se pasa al lienzo en cada cuadro */
    const pointer = { x: -9999, y: -9999, active: false }
    const mouse = { x: -9999, y: -9999 }
    let width = 0
    let height = 0
    let box = { x: 0, y: 0, w: 1, h: 1 }
    let visible = true
    let hovering = false
    let frame = 0
    // Transformación: de dónde viene cada nodo (coordenadas de caja) y qué conexiones se apagan.
    let morphFrom: { x: number; y: number }[] | null = null
    let morphLinks: readonly (readonly [number, number])[] = []
    let morphStart = 0
    let boxNodes = graph.nodes.map((node) => ({ x: node.x, y: node.y }))

    morphRef.current = (next) => {
      if (next === graph || next.nodes.length !== n) return
      morphFrom = boxNodes.map((node) => ({ ...node }))
      morphLinks = graph.links
      morphStart = performance.now()
      graph = next
      pulses.length = 0
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      width = wrap.clientWidth
      height = wrap.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // En pantallas angostas la figura usa casi todo el ancho.
      const maxWidth = width < 768 ? Math.max(fit.width, 0.92) : fit.width
      const w = Math.min(width * maxWidth, height * fit.height * graph.aspect)
      const h = w / graph.aspect
      box = { x: (width - w) / 2, y: height * fit.centerY - h / 2, w, h }
    }

    const setHovering = (next: boolean) => {
      if (next === hovering) return
      hovering = next
      hoverCallback.current?.(next)
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }

    /**
     * Pasa el cursor a coordenadas del lienzo con la posición ACTUAL del
     * lienzo: si la página se desplaza sin mover el ratón, el cursor sigue
     * en su sitio real (no donde estaba antes del scroll).
     */
    const updateMouse = () => {
      const rect = wrap.getBoundingClientRect()
      const inside =
        pointer.active && pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom
      mouse.x = inside ? pointer.x - rect.left : -9999
      mouse.y = inside ? pointer.y - rect.top : -9999
      return inside
    }

    const draw = (time: number) => {
      const p = reducedMotion ? 1 : progress.current
      const pointerInside = updateMouse()
      ctx.clearRect(0, 0, width, height)
      const radius = box.h * cursorRadius

      // Estática de fondo: se apaga a medida que aparece la señal.
      if (noise.length) {
        const fade = Math.max(noiseFloor, 1 - p * 1.6)
        if (fade > 0) {
          const tick = Math.floor(time / 55)
          for (const dot of noise) {
            const on = Math.sin(dot.seed * 91.7 + tick * 1.3) > -0.1
            if (!on) continue
            ctx.fillStyle = `rgba(${paper},${0.22 * fade})`
            ctx.fillRect(dot.x * width, dot.y * height, dot.s, dot.s)
          }
        }
      }

      // Transformación en curso: 0 → 1 con aceleración suave.
      const rawMorph = morphFrom ? Math.min(1, (performance.now() - morphStart) / MORPH_MS) : 1
      const morph = rawMorph < 0.5 ? 4 * rawMorph ** 3 : 1 - (-2 * rawMorph + 2) ** 3 / 2
      if (morphFrom && rawMorph >= 1) morphFrom = null
      const from = morphFrom
      boxNodes = graph.nodes.map((node, i) =>
        from ? { x: from[i].x + (node.x - from[i].x) * morph, y: from[i].y + (node.y - from[i].y) * morph } : node,
      )
      // Mientras viajan, los nodos se encienden como un impulso.
      const travelGlow = from ? 0.7 * Math.sin(Math.PI * rawMorph) : 0

      // Posición de cada nodo: del ruido a su lugar en la red.
      const pos = boxNodes.map((node, i) => {
        const raw = Math.min(1, Math.max(0, (p - delay[i]) / (1 - (sweep ? 0.53 : 0.25))))
        const t = raw * raw * (3 - 2 * raw)
        const tx = box.x + node.x * box.w
        const ty = box.y + node.y * box.h
        const drift = reducedMotion ? 0 : 2.2
        const x = start[i].x * width + (tx - start[i].x * width) * t + Math.sin(time * 0.0007 + phases[i]) * drift
        const y = start[i].y * height + (ty - start[i].y * height) * t + Math.cos(time * 0.0006 + phases[i]) * drift
        const near = radius > 0 ? Math.max(0, 1 - Math.hypot(x - mouse.x, y - mouse.y) / radius) : 0
        glow[i] = Math.max(glow[i] * 0.94, near * t, travelGlow * t)
        return { x, y, t }
      })

      // Hover: solo sobre la figura Y cerca de nodos que ya están en su sitio
      // (mientras la red se arma no hay nada que señalar).
      if (hoverCallback.current) {
        const bx = (mouse.x - box.x) / box.w
        const by = (mouse.y - box.y) / box.h
        const onShape = pointerInside && p > HOVER_MIN_PROGRESS && !!graph.contains?.(bx, by)
        const reach = box.h * 0.12
        setHovering(onShape && pos.some((q) => q.t > 0.95 && Math.hypot(q.x - mouse.x, q.y - mouse.y) < reach))
      }

      // Conexiones: aparecen cuando sus dos nodos ya llegaron. Al transformarse,
      // las de la figura anterior se apagan y las nuevas se encienden.
      let formedLinks = 0
      const linkSets: [readonly (readonly [number, number])[], number][] = from
        ? [
            [morphLinks, Math.max(0, 1 - rawMorph * 2.2)],
            [graph.links, Math.max(0, (rawMorph - 0.45) / 0.55)],
          ]
        : [[graph.links, 1]]
      for (const [links, setAlpha] of linkSets) {
       if (setAlpha <= 0) continue
       for (const [a, b] of links) {
        const alpha = Math.max(0, (Math.min(pos[a].t, pos[b].t) - 0.55) / 0.45) * setAlpha
        if (alpha <= 0) continue
        formedLinks++
        const g = Math.max(glow[a], glow[b])
        ctx.strokeStyle = g > 0.05 ? `rgba(${signal},${(0.3 + g * 0.6) * alpha})` : `rgba(${paper},${0.2 * alpha})`
        ctx.lineWidth = g > 0.05 ? 1.2 : 1
        ctx.beginPath()
        ctx.moveTo(pos[a].x, pos[a].y)
        ctx.lineTo(pos[b].x, pos[b].y)
        ctx.stroke()
       }
      }

      // Impulsos: viajan de nodo a nodo y encienden el nodo al que llegan.
      if (!reducedMotion && !from && formedLinks > graph.links.length * 0.6 && pulses.length < MAX_PULSES && Math.random() < PULSE_SPAWN_CHANCE) {
        const [a, b] = graph.links[Math.floor(Math.random() * graph.links.length)]
        const forward = Math.random() < 0.5
        pulses.push({ from: forward ? a : b, to: forward ? b : a, t: 0, speed: 0.014 + Math.random() * 0.016 })
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        pulse.t += pulse.speed
        if (pulse.t >= 1) {
          glow[pulse.to] = 1
          // A veces el impulso sigue a un vecino: una cadena de disparos.
          if (Math.random() < 0.55) {
            const next = graph.links.filter(([a, b]) => a === pulse.to || b === pulse.to)
            const pick = next[Math.floor(Math.random() * next.length)]
            if (pick) {
              const to = pick[0] === pulse.to ? pick[1] : pick[0]
              pulses.push({ from: pulse.to, to, t: 0, speed: pulse.speed })
            }
          }
          pulses.splice(i, 1)
          continue
        }
        const x = pos[pulse.from].x + (pos[pulse.to].x - pos[pulse.from].x) * pulse.t
        const y = pos[pulse.from].y + (pos[pulse.to].y - pos[pulse.from].y) * pulse.t
        ctx.fillStyle = `rgba(${signal},0.18)`
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(${signal},0.95)`
        ctx.beginPath()
        ctx.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Nodos: cuadrados, como la estática; azules cuando están activos.
      pos.forEach(({ x, y, t }, i) => {
        const s = sizes[i] + glow[i] * 3
        if (glow[i] > 0.05) {
          ctx.fillStyle = `rgba(${signal},${0.15 * glow[i]})`
          ctx.beginPath()
          ctx.arc(x, y, s * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = glow[i] > 0.3 ? `rgba(${signal},1)` : `rgba(${paper},${0.4 + 0.45 * t})`
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
      })
    }

    const loop = (time: number) => {
      if (visible) draw(time)
      frame = requestAnimationFrame(loop)
    }

    resize()
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) setHovering(false)
    })
    observer.observe(wrap)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    if (reducedMotion) draw(0)
    else frame = requestAnimationFrame(loop)

    return () => {
      morphRef.current = null
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      setHovering(false)
    }
    // fit y opciones se fijan al montar. Un grafo con otro número de nodos
    // reinicia la escena; uno con el mismo número se transforma (ver abajo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeCount, reducedMotion, progress])

  // Cambio de figura con el mismo número de nodos: transformación animada.
  useEffect(() => {
    if (graph) morphRef.current?.(graph)
  }, [graph])

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  )
}
