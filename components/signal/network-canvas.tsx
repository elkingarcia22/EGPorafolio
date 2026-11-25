'use client'

import { useEffect, useRef } from 'react'
import { createNetworkStyles, hash, type FrameLink, type FrameNode, type FramePulse } from './styles'
import { getNetworkStyle } from './network-style-store'

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
  /** opacidad de la figura, 0–1 (la estática del fondo no cambia) */
  reveal?: React.MutableRefObject<number>
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

/** Volumen de la figura: grosor en fracción de su ancho */
const THICKNESS = 0.24
/** Distancia de la cámara (en anchos de figura): menor = perspectiva más marcada */
const CAMERA_DISTANCE = 1.5
/** Giro máximo (radianes) que provoca el cursor, y el giro propio en reposo */
const CURSOR_TURN = { yaw: 0.42, pitch: 0.24 }
const IDLE_TURN = { yaw: 0.2, pitch: 0.07 }
/** Suavizado de la cámara (0–1 por cuadro) */
const CAMERA_EASE = 0.045
/** Profundidad (en anchos de figura) desde la que llegan los nodos mientras la red se arma */
const FLY_IN_DEPTH = 3.2
/** Al aparecer después del viaje (ver `reveal`), la figura llega plana y de frente —igual al EG del viaje— y toma su volumen y su giro en este tiempo (ms) */
const SETTLE_MS = 1600

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
 * Red de conexiones en canvas 2D: nodos que pasan de ruido a red, conexiones
 * que arman la figura, impulsos que viajan entre nodos y nodos que se
 * encienden cerca del cursor. Lo usan el EG del inicio y Contacto.
 *
 * La figura tiene volumen: cada nodo tiene profundidad, la cámara gira con
 * el cursor y la escena se proyecta en perspectiva. Cómo se ve (nodos,
 * conexiones, desenfoque) lo decide la versión activa (ver ./styles).
 */
export function NetworkCanvas({
  graph,
  progress,
  reducedMotion,
  fit = DEFAULT_FIT,
  noiseDots = 0,
  noiseFloor = 0,
  sweep = false,
  reveal,
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

    const styles = createNetworkStyles()
    const colors = { paper: rgbVar('--paper'), signal: rgbVar('--signal') }
    const n = graph.nodes.length
    const glow = new Float32Array(n)
    const sizes = Float32Array.from({ length: n }, () => 1.3 + Math.random() * 2)
    const phases = Float32Array.from({ length: n }, () => Math.random() * Math.PI * 2)
    // Profundidad propia de cada nodo (-1 lejos, 1 cerca): da volumen a la figura.
    const depthZ = Float32Array.from({ length: n }, () => Math.random() * 2 - 1)
    // Posición de ruido (fracción del lienzo) y retraso de llegada de cada nodo.
    const start = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random() }))
    // Desde dentro, los nodos ya están en su sitio: solo aparecen, casi a la vez.
    const delay = graph.nodes.map((node) => (sweep ? node.x * 0.45 + Math.random() * 0.08 : Math.random() * 0.25))
    const spread = sweep ? 0.53 : 0.25
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
    const camera = { yaw: 0, pitch: 0 }
    let width = 0
    let height = 0
    let dpr = 1
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
      dpr = Math.min(window.devicePixelRatio, 2)
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

    /** Volumen y giro de la figura (0 plana y de frente, 1 en 3D): sube al terminar de aparecer. */
    let settle = reveal ? 0 : 1
    let settleTime = 0
    const updateSettle = (time: number) => {
      const dt = settleTime ? Math.min(64, time - settleTime) : 16
      settleTime = time
      if (!reveal || reducedMotion) {
        settle = 1
        return
      }
      // Mientras el EG del viaje entrega la figura, esta queda plana: así coinciden sin salto.
      settle = reveal.current < 1 ? 0 : Math.min(1, settle + dt / SETTLE_MS)
    }
    const settled = () => settle * settle * (3 - 2 * settle)

    /** La cámara gira despacio sola y sigue al cursor (paralaje). */
    const updateCamera = (time: number, enabled: boolean) => {
      const px = pointer.active ? pointer.x / window.innerWidth - 0.5 : 0
      const py = pointer.active ? pointer.y / window.innerHeight - 0.5 : 0
      const idle = reducedMotion ? 0 : 1
      const targetYaw = enabled ? px * 2 * CURSOR_TURN.yaw + Math.sin(time * 0.00022) * IDLE_TURN.yaw * idle : 0
      const targetPitch = enabled ? -py * 2 * CURSOR_TURN.pitch + Math.cos(time * 0.00017) * IDLE_TURN.pitch * idle : 0
      const ease = reducedMotion ? 1 : CAMERA_EASE
      camera.yaw += (targetYaw * settled() - camera.yaw) * ease
      camera.pitch += (targetPitch * settled() - camera.pitch) * ease
      if (settle === 0) {
        camera.yaw = 0
        camera.pitch = 0
      }
    }

    const draw = (time: number) => {
      const p = reducedMotion ? 1 : progress.current
      const style = styles[getNetworkStyle()]
      const pointerInside = updateMouse()
      updateSettle(time)
      updateCamera(time, style.depth3d)
      ctx.clearRect(0, 0, width, height)
      const radius = box.h * cursorRadius

      // Estática de fondo: se apaga a medida que aparece la señal.
      if (noise.length) {
        const fade = Math.max(noiseFloor, 1 - p * 1.6)
        if (fade > 0) {
          const tick = Math.floor(time / 55)
          ctx.fillStyle = `rgba(${colors.paper},${0.22 * fade})`
          for (const dot of noise) {
            if (Math.sin(dot.seed * 91.7 + tick * 1.3) <= -0.1) continue
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

      // Proyección: la figura gira alrededor de su centro y se ve en perspectiva.
      const cx = box.x + box.w / 2
      const cy = box.y + box.h / 2
      const cosY = Math.cos(camera.yaw)
      const sinY = Math.sin(camera.yaw)
      const cosP = Math.cos(camera.pitch)
      const sinP = Math.sin(camera.pitch)
      const focal = box.w * CAMERA_DISTANCE
      const thick = box.w * THICKNESS * 0.5 * settled()

      const figureAlpha = reveal ? Math.min(1, Math.max(0, reveal.current)) : 1

      // Posición de cada nodo: del ruido a su lugar en la red.
      const nodes: FrameNode[] = boxNodes.map((node, i) => {
        const raw = Math.min(1, Math.max(0, (p - delay[i]) / (1 - spread)))
        const t = raw * raw * (3 - 2 * raw)
        const tx = box.x + node.x * box.w
        const ty = box.y + node.y * box.h
        const drift = reducedMotion ? 0 : 2.2
        const sx = start[i].x * width
        const sy = start[i].y * height
        let x = sx + (tx - sx) * t + Math.sin(time * 0.0007 + phases[i]) * drift
        let y = sy + (ty - sy) * t + Math.cos(time * 0.0006 + phases[i]) * drift
        let depth = 0.5
        let scale = 1
        if (style.depth3d) {
          const dx = x - cx
          const dy = y - cy
          // Mientras se arma, cada nodo llega desde el fondo hacia la cámara.
          const dz = depthZ[i] * thick * t - (1 - t) * FLY_IN_DEPTH * box.w
          const x1 = dx * cosY + dz * sinY
          const z1 = -dx * sinY + dz * cosY
          const y1 = dy * cosP - z1 * sinP
          const z2 = dy * sinP + z1 * cosP
          scale = focal / (focal - z2)
          x = cx + x1 * scale
          y = cy + y1 * scale
          // El foco sigue al volumen propio de cada nodo más que al giro: así la
          // figura se desenfoca por capas sin que media letra quede borrosa.
          const turnDepth = z2 / (thick * 2.4 + Math.abs(dx) * 0.6)
          depth = Math.min(1, Math.max(0, 0.5 + 0.5 * (depthZ[i] * t * 0.85 + turnDepth * 0.3)))
        }
        const near = radius > 0 ? Math.max(0, 1 - Math.hypot(x - mouse.x, y - mouse.y) / radius) : 0
        glow[i] = Math.max(glow[i] * 0.94, near * t, travelGlow * t)
        return { x, y, t: t * figureAlpha, glow: glow[i], size: sizes[i] * scale, phase: phases[i], depth }
      })

      // Hover: solo sobre la figura Y cerca de nodos que ya están en su sitio
      // (mientras la red se arma no hay nada que señalar).
      if (hoverCallback.current) {
        const bx = (mouse.x - box.x) / box.w
        const by = (mouse.y - box.y) / box.h
        const onShape = pointerInside && p > HOVER_MIN_PROGRESS && !!graph.contains?.(bx, by)
        const reach = box.h * 0.12
        setHovering(onShape && nodes.some((q) => q.t > 0.95 && Math.hypot(q.x - mouse.x, q.y - mouse.y) < reach))
      }

      // Conexiones: aparecen cuando sus dos nodos ya llegaron. Al transformarse,
      // las de la figura anterior se apagan y las nuevas se encienden.
      const links: FrameLink[] = []
      const linkSets: [readonly (readonly [number, number])[], number][] = from
        ? [
            [morphLinks, Math.max(0, 1 - rawMorph * 1.6)],
            [graph.links, Math.max(0, (rawMorph - 0.25) / 0.75)],
          ]
        : [[graph.links, 1]]
      for (const [set, setAlpha] of linkSets) {
        if (setAlpha <= 0) continue
        for (const [a, b] of set) {
          const alpha = Math.max(0, (Math.min(nodes[a].t, nodes[b].t) - 0.55) / 0.45) * setAlpha
          if (alpha <= 0) continue
          const lo = Math.min(a, b)
          const hi = Math.max(a, b)
          links.push({ a: lo, b: hi, alpha, seed: hash(lo * 1009 + hi) })
        }
      }

      // Impulsos: viajan de nodo a nodo y encienden el nodo al que llegan.
      if (!reducedMotion && !from && links.length > graph.links.length * 0.6 && pulses.length < MAX_PULSES && Math.random() < PULSE_SPAWN_CHANCE) {
        const [a, b] = graph.links[Math.floor(Math.random() * graph.links.length)]
        const forward = Math.random() < 0.5
        pulses.push({ from: forward ? a : b, to: forward ? b : a, t: 0, speed: 0.014 + Math.random() * 0.016 })
      }
      const framePulses: FramePulse[] = []
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        pulse.t += pulse.speed
        if (pulse.t >= 1) {
          glow[pulse.to] = 1
          nodes[pulse.to] = { ...nodes[pulse.to], glow: 1 }
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
        framePulses.push({ from: pulse.from, to: pulse.to, t: pulse.t, seed: hash(Math.min(pulse.from, pulse.to) * 1009 + Math.max(pulse.from, pulse.to)) })
      }

      style.draw({
        ctx,
        width,
        height,
        time,
        nodes,
        links,
        pulses: framePulses,
        colors,
        dpr,
        camera: { x: camera.yaw / CURSOR_TURN.yaw, y: camera.pitch / CURSOR_TURN.pitch },
        scale: box.h,
        progress: p,
        reducedMotion,
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
