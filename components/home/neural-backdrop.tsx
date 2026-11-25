'use client'

import { useEffect, useRef } from 'react'
import { buildFlightWorld } from '@/components/signal/flight-world'
import { createFlightRenderer } from '@/components/signal/flight-render'
import { createFlightPulses } from '@/components/signal/flight-pulses'

/** Red lejana: pocas neuronas, separadas, para que se lea como fondo */
const WORLD = { waypoints: 3, spacing: 9, viewDistance: 6, radius: 9, count: 150, tail: 30 }
/** La cámara avanza y retrocede muy despacio (sin cortes): la red respira */
const DRIFT = { base: 6, amplitude: 5, speed: 0.00006 }
/** Opacidad: más presente detrás del titular, tenue cuando ya está el EG */
const FADE = { headline: 0.6, rest: 0.34 }
/** Hasta qué avance del hero se considera "detrás del titular" */
const HEADLINE_UNTIL = 0.12
const PULSE_CHANCE = 0.06

interface NeuralBackdropProps {
  /** recorrido del hero, 0–1 */
  heroProgress: React.MutableRefObject<number>
  className?: string
}

/**
 * Fondo del hero: una red neuronal lejana y desenfocada (en lugar de un
 * espacio con ruido). Las neuronas respiran, las fibras se ven tenues y de
 * vez en cuando corre un impulso.
 */
export function NeuralBackdrop({ heroProgress, className }: NeuralBackdropProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const world = buildFlightWorld(WORLD)
    const render = createFlightRenderer(world, { centerY: 0.45, dust: 90 })
    const impulses = createFlightPulses(world)
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let visible = true
    let fade = FADE.headline

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const loop = (time: number) => {
      if (visible) {
        const target = heroProgress.current < HEADLINE_UNTIL ? FADE.headline : FADE.rest
        fade += (target - fade) * 0.04
        const camera = {
          x: Math.sin(time * 0.00009) * 1.2,
          y: Math.cos(time * 0.00007) * 0.8,
          z: DRIFT.base + Math.sin(time * DRIFT.speed) * DRIFT.amplitude,
          roll: Math.sin(time * 0.00011) * 0.04,
        }
        impulses.spawnNear(camera.z, PULSE_CHANCE)
        impulses.step()
        render({ ctx, dpr, width, height, time, camera, speed: 0, fade, glow: impulses.glow, pulses: impulses.pulses })
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
  }, [heroProgress])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
