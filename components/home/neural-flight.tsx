'use client'

import { useEffect, useRef } from 'react'
import { buildFlightWorld } from '@/components/signal/flight-world'
import { createFlightRenderer } from '@/components/signal/flight-render'
import { createFlightPulses } from '@/components/signal/flight-pulses'
import { createLinkSearch } from '@/components/signal/flight-probes'

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

interface NeuralFlightProps {
  /** Avance de la carga, 0–1. Después de llegar a 1 vuelve a 0: ese tramo es el salto final. */
  progress: React.MutableRefObject<number>
  className?: string
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Carga del inicio, sin texto: la cámara entra a una red neuronal con nodos
 * en primer plano que buscan conectarse (las fibras salen, unas fallan y se
 * recogen, otras se quedan; cada vez más, al ritmo de la carga) y vuela de
 * neurona en neurona. Al terminar, la última neurona dispara y la cámara
 * salta hacia adelante, hasta que aparece el titular.
 */
export function NeuralFlight({ progress, className }: NeuralFlightProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const world = buildFlightWorld(WORLD)
    const render = createFlightRenderer(world)
    const impulses = createFlightPulses(world)
    const search = createLinkSearch(world)
    let lastTime = 0
    const arrived = new Set<number>()

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let peaked = false
    let peakAt = 0
    let lastZ = 0
    let idleSince = performance.now()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

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

    const draw = (time: number) => {
      const p = Math.max(0, Math.min(1, progress.current))
      if (p >= 0.999 && !peaked) {
        peaked = true
        peakAt = time
        impulses.glow[world.route[world.route.length - 1]] = 1
      }
      // Después del 100 %: espera con un avance lento y luego el salto.
      const exit = peaked ? 1 - p : 0
      const camera = cameraAt(peaked ? 1 : p, time)
      if (peaked) camera.z += (time - peakAt) * HOLD_DRIFT + exit * exit * WARP_DISTANCE
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

    const loop = (time: number) => {
      draw(time)
      // Cuando la carga terminó y se disolvió (o nunca arrancó), el lienzo deja de dibujar.
      if (progress.current > 0.001) idleSince = time
      if ((peaked && progress.current <= 0.01) || time - idleSince > IDLE_STOP_MS) {
        ctx.clearRect(0, 0, width, height)
        return
      }
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
