'use client'

import { useEffect, useRef } from 'react'
import { buildFlightWorld, type FlightNode } from '@/components/signal/flight-world'
import { createFlightRenderer, type FlightCamera } from '@/components/signal/flight-render'
import { createFlightPulses } from '@/components/signal/flight-pulses'
import { registerBackdropJourney, type JourneyRequest, backdropQuiet } from './backdrop-journey'
import { useA11y } from '@/lib/a11y'

/** Red de fondo: larga en profundidad (se recorre al bajar y en los viajes entre secciones) */
const WORLD = { waypoints: 3, spacing: 9, viewDistance: 6, radius: 8, count: 300, tail: 110 }
/** La cámara respira despacio (sin cortes) */
const DRIFT = { base: 6, amplitude: 3, speed: 0.00006 }
/** Cuánto avanza la cámara por cada pantalla que se baja: el scroll es el viaje */
const SCROLL_TRAVEL = 1.6
/** Opacidad: flotando, viajando y ya leyendo (la red se atenúa para que el texto se lea) */
const FADE = { drift: 0.55, travel: 0.95, read: 0.26 }
/** Tras llegar, cuánto espera antes de atenuarse (ms) */
const READ_DIM_AFTER_MS = 250
const FADE_EASE = 0.05
/** Cuánto se apaga el fondo cuando una sección pide calma (p. ej. mientras se arma el EG) */
const QUIET_DIM = 0.92
/** Distancia a la que la cámara se detiene frente a cada neurona del viaje */
const ARRIVE_DISTANCE = 3.4
/** Dónde busca la neurona de destino: cuánto más adelante de la cámara */
const TARGET_AHEAD = { min: 8, max: 13 }
/** Al soltar el ancla, cuánto tarda en volver a flotar (ms) */
const RETURN_MS = 1400
const ARRIVAL_PULSES = 6
/** Tamaño de las neuronas del viaje (se ven como neuronas principales, con anillo y destello) */
const ROUTE_SIZE = 3.6
/** 'dive-out': qué tan cerca pasa de la neurona y cuánto se aleja hacia la esquina */
const DIVE = { touch: 1.15, back: 6.5, side: 3.2, lift: 2.2, roll: 0.2 }
/** Brillo con el que la neurona de destino queda encendida mientras se lee */
const HOLD_GLOW = 0.7
const PULSE_CHANCE = { drift: 0.06, travel: 0.3 }
/** Punto de la pantalla hacia el que mira la cámara mientras flota */
const HOME = { x: 0.5, y: 0.45 }

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

type Stop = { x: number; y: number; z: number }

/** Neurona más cercana al eje de la cámara dentro de un tramo de profundidad. */
function pickNode(nodes: readonly FlightNode[], from: Stop, zMin: number, zMax: number): number {
  let best = -1
  let bestScore = Infinity
  nodes.forEach((n, i) => {
    if (n.z < zMin || n.z > zMax) return
    const score = Math.hypot(n.x - from.x, (n.y - from.y) * 1.3)
    if (score < bestScore) {
      bestScore = score
      best = i
    }
  })
  return best
}

/**
 * Fondo único del inicio: una sola red neuronal, fija detrás de todas las
 * secciones, así no hay cortes entre ellas. Al bajar, la cámara avanza por
 * la red; cuando una sección lo pide (ver backdropJourney), la cámara viaja
 * por esa misma red de neurona en neurona hasta quedar sobre el nodo de la
 * sección, y al seguir bajando vuelve a flotar. En las secciones claras la
 * red se desvanece.
 */
export function NeuralBackdrop({ className = '' }: { className?: string }) {
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || reducedMotion) return

    const world = buildFlightWorld(WORLD)
    const render = createFlightRenderer(world, { centerY: HOME.y, dust: 140 })
    const impulses = createFlightPulses(world)
    const root = document.documentElement
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let fade = 0
    let lastZ = 0
    let cleared = true
    /** Desplazamiento acumulado: al soltar un viaje, la deriva sigue desde donde quedó */
    let driftOffset = 0

    // Viaje en curso
    let mode: 'drift' | 'travel' | 'hold' | 'return' = 'drift'
    let started = 0
    let duration = 1
    let anchor: HTMLElement | null = null
    /** Giro hacia la esquina en 'dive-out' (0 = sin giro); signo = lado de la esquina */
    let cornerRoll = 0
    let stops: Stop[] = []
    let route: number[] = []
    let arrived = new Set<number>()
    let leaveFrom: { camera: FlightCamera; center: { x: number; y: number } } | null = null
    let lastCamera: FlightCamera = { x: 0, y: 0, z: DRIFT.base, roll: 0 }
    let lastCenter = { ...HOME }
    /** Neuronas del viaje convertidas en principales (se restauran al soltar) */
    let promoted: { index: number; size: number; waypoint: boolean }[] = []

    const restoreRoute = () => {
      promoted.forEach(({ index, size, waypoint }) => {
        world.nodes[index].size = size
        world.nodes[index].waypoint = waypoint
      })
      promoted = []
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const driftCamera = (time: number): FlightCamera => ({
      x: Math.sin(time * 0.00009) * 1.2,
      y: Math.cos(time * 0.00007) * 0.8,
      z: DRIFT.base + driftOffset + Math.sin(time * DRIFT.speed) * DRIFT.amplitude + (window.scrollY / Math.max(1, window.innerHeight)) * SCROLL_TRAVEL,
      roll: Math.sin(time * 0.00011) * 0.04,
    })

    /** Centro del ancla en fracciones de la pantalla (el lienzo ocupa toda la ventana). */
    const anchorCenter = () => {
      if (!anchor || !width || !height) return { ...HOME }
      const rect = anchor.getBoundingClientRect()
      return { x: (rect.left + rect.width / 2) / width, y: (rect.top + rect.height / 2) / height }
    }

    registerBackdropJourney({
      play: ({ kind = 'arrive', anchor: target, durationMs }: JourneyRequest) => {
        const from = { x: lastCamera.x, y: lastCamera.y, z: lastCamera.z }
        const end = pickNode(world.nodes, from, from.z + TARGET_AHEAD.min, from.z + TARGET_AHEAD.max)
        if (end < 0) return
        if (kind === 'dive-out') {
          // Picada: casi toca una neurona (en primer plano) y luego se aleja girando a una esquina.
          const n = world.nodes[end]
          const side = Math.random() < 0.5 ? -1 : 1
          const touch = { x: n.x + 0.25 * side, y: n.y + 0.15, z: n.z - DIVE.touch }
          route = [end]
          stops = [from, touch, { x: touch.x + side * DIVE.side, y: touch.y - DIVE.lift, z: touch.z - DIVE.back }]
          cornerRoll = side * DIVE.roll
        } else {
          // Un solo salto: directo a la neurona de destino, sin paradas intermedias.
          route = [end]
          cornerRoll = 0
        }
        restoreRoute()
        promoted = route.map((index) => ({ index, size: world.nodes[index].size, waypoint: world.nodes[index].waypoint }))
        route.forEach((index) => {
          world.nodes[index].size = ROUTE_SIZE
          world.nodes[index].waypoint = true
        })
        if (kind === 'arrive') {
          stops = [from, ...route.map((i) => ({ x: world.nodes[i].x, y: world.nodes[i].y, z: world.nodes[i].z - ARRIVE_DISTANCE }))]
        }
        arrived = new Set()
        anchor = target ?? null
        duration = durationMs
        started = performance.now()
        mode = 'travel'
      },
      release: () => {
        if (mode === 'drift' || mode === 'return') return
        leaveFrom = { camera: { ...lastCamera }, center: { ...lastCenter } }
        // La deriva continúa desde la profundidad alcanzada (no retrocede).
        driftOffset += lastCamera.z - driftCamera(performance.now()).z
        started = performance.now()
        mode = 'return'
      },
    })

    const travelCamera = (now: number): { camera: FlightCamera; center: { x: number; y: number }; k: number } => {
      const t = Math.min(1, (now - started) / duration)
      const u = Math.min(0.9999, t) * (stops.length - 1)
      const seg = Math.floor(u)
      const k = easeInOut(u - seg)
      const a = stops[seg]
      const b = stops[seg + 1]
      // Cada neurona de la ruta dispara al llegar (el tramo de alejarse no tiene neurona).
      const reached = route[seg]
      if (k > 0.9 && !arrived.has(seg) && reached !== undefined) {
        arrived.add(seg)
        impulses.fire(reached, ARRIVAL_PULSES)
      }
      const center = anchorCenter()
      const settle = easeInOut(t)
      return {
        camera: {
          x: lerp(a.x, b.x, k),
          y: lerp(a.y, b.y, k),
          z: lerp(a.z, b.z, k),
          // En 'dive-out' la cámara gira hacia la esquina mientras se aleja y luego se endereza a medias.
          roll: (b.x - a.x) * 0.012 * Math.sin(Math.PI * k) * (1 - t) + cornerRoll * Math.sin(Math.PI * Math.min(1, t * 1.25)),
        },
        // La neurona de destino termina justo sobre el ancla.
        center: { x: lerp(HOME.x, center.x, settle), y: lerp(HOME.y, center.y, settle) },
        k: t,
      }
    }

    const loop = (time: number) => {
      const now = performance.now()
      let camera: FlightCamera
      let center = { ...HOME }
      let target = FADE.drift

      if (mode === 'travel' || mode === 'hold') {
        const step = travelCamera(now)
        camera = step.camera
        center = step.center
        if (step.k >= 1) mode = 'hold'
        // La neurona de destino queda encendida sobre el nodo de la sección.
        if (mode === 'hold') {
          const end = route[route.length - 1]
          impulses.glow[end] = Math.max(impulses.glow[end], HOLD_GLOW)
        }
        target = mode === 'hold' && now - started > duration + READ_DIM_AFTER_MS ? FADE.read : FADE.travel
      } else if (mode === 'return' && leaveFrom) {
        const k = easeInOut(Math.min(1, (now - started) / RETURN_MS))
        const drift = driftCamera(time)
        camera = {
          x: lerp(leaveFrom.camera.x, drift.x, k),
          y: lerp(leaveFrom.camera.y, drift.y, k),
          z: lerp(leaveFrom.camera.z, drift.z, k),
          roll: lerp(leaveFrom.camera.roll, drift.roll, k),
        }
        center = { x: lerp(leaveFrom.center.x, HOME.x, k), y: lerp(leaveFrom.center.y, HOME.y, k) }
        if (k >= 1) {
          mode = 'drift'
          restoreRoute()
        }
      } else {
        camera = driftCamera(time)
      }
      lastCamera = camera
      lastCenter = center

      if (mode === 'drift') target *= 1 - backdropQuiet.get() * QUIET_DIM
      if (root.dataset.tone === 'light') target = 0
      fade += (target - fade) * FADE_EASE
      if (fade > 0.01) {
        // Al moverse, el polvo se estira: se siente el avance.
        const speed = Math.abs(camera.z - lastZ)
        lastZ = camera.z
        impulses.spawnNear(camera.z, mode === 'drift' ? PULSE_CHANCE.drift : PULSE_CHANCE.travel)
        impulses.step()
        render({ ctx, dpr, width, height, time, camera, speed, fade, glow: impulses.glow, pulses: impulses.pulses, center })
        cleared = false
      } else if (!cleared) {
        ctx.clearRect(0, 0, width, height)
        cleared = true
      }
      frame = requestAnimationFrame(loop)
    }

    resize()
    // El lienzo vigila su propio tamaño: en el celular la barra del navegador
    // cambia el alto sin avisar a la ventana, y el destino quedaría desfasado.
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)
    frame = requestAnimationFrame(loop)
    return () => {
      registerBackdropJourney(null)
      cancelAnimationFrame(frame)
      sizeObserver.disconnect()
    }
  }, [reducedMotion])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none fixed inset-0 -z-10 h-full w-full ${className}`} />
}
