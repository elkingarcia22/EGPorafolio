'use client'

import { useEffect, useRef } from 'react'
import { buildSynapseWorld } from '@/components/signal/flight-world'
import { createFlightRenderer } from '@/components/signal/flight-render'

/** Tramos del recorrido (0–1) en los que pasa cada cosa. */
export const JOURNEY = {
  fadeIn: [0.03, 0.12],
  /** la cámara recorre la fibra hasta la neurona de destino (solo ida) */
  travel: [0.06, 0.42],
  /** al llegar: lo que sigue puede nacer de esa neurona */
  formAt: 0.42,
  /** la fibra se apaga después de llegar */
  fadeOut: [0.5, 0.66],
} as const
/** Distancia a la que la cámara llega frente a la neurona de destino */
const ARRIVE_DISTANCE = 3.4
const MAX_FADE = 0.95

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smoothstep = ([a, b]: readonly [number, number], x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

interface SynapseJourneyProps {
  /** recorrido del hero, 0–1 */
  progress: React.MutableRefObject<number>
  /** altura (fracción del lienzo) donde queda la neurona de destino */
  centerY: number
  className?: string
}

/**
 * Viaje de ida de nodo a nodo: una sola fibra entre dos neuronas. Al
 * deslizar, la cámara la recorre junto a un impulso y se detiene frente a la
 * neurona de destino, a la altura `centerY`. Pensado para las transiciones
 * entre secciones (todavía sin usar).
 */
export function SynapseJourney({ progress, centerY, className }: SynapseJourneyProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const world = buildSynapseWorld()
    const render = createFlightRenderer(world, { centerY, dust: 160 })
    const glow = new Float32Array(world.nodes.length)
    const [from, to] = world.route.map((i) => world.nodes[i])
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let lastZ = 0
    let visible = true
    let cleared = false

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time: number, p: number, fade: number) => {
      const u = easeInOut(smoothstep([JOURNEY.travel[0], JOURNEY.travel[1]], p))
      const camera = {
        x: from.x * 0.6 + (to.x - from.x * 0.6) * u,
        y: from.y * 0.6 + (to.y - from.y * 0.6) * u,
        z: from.z - 4 + (to.z - ARRIVE_DISTANCE - (from.z - 4)) * u,
        // Un leve giro mientras viaja; al llegar queda derecha, centrada en el EG.
        roll: Math.sin(Math.PI * u) * 0.06,
      }
      const speed = Math.abs(camera.z - lastZ)
      lastZ = camera.z

      // La neurona de destino se enciende al llegar y sigue brillando: de allí nace el EG.
      glow[0] = 0.35 * (1 - u)
      glow[1] = Math.max(smoothstep([0.8, 1], u), 0.25)
      glow[2] = smoothstep([0.95, 1], u)

      // Un impulso viaja con la cámara por la fibra; al llegar, otro sale por la rama.
      const pulses = []
      if (u > 0.02 && u < 0.98) pulses.push({ link: 0, t: u, forward: true })
      const branch = smoothstep([JOURNEY.formAt, JOURNEY.formAt + 0.08], p)
      if (branch > 0 && branch < 1) pulses.push({ link: 1, t: branch, forward: true })

      render({ ctx, dpr, width, height, time, camera, speed, fade, glow, pulses })
    }

    const loop = (time: number) => {
      const p = clamp01(progress.current)
      const fade = smoothstep([JOURNEY.fadeIn[0], JOURNEY.fadeIn[1]], p) * (1 - smoothstep([JOURNEY.fadeOut[0], JOURNEY.fadeOut[1]], p)) * MAX_FADE
      if (visible && fade > 0.003) {
        draw(time, p, fade)
        cleared = false
      } else if (!cleared) {
        ctx.clearRect(0, 0, width, height)
        cleared = true
      }
      frame = requestAnimationFrame(loop)
    }

    resize()
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(canvas)
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [progress, centerY])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
