'use client'

import { useEffect, useRef } from 'react'
import { useA11y } from '@/lib/a11y'
import { AI } from './clp-kit'

export type WaveState = 'listening' | 'speaking' | 'thinking' | 'idle'

/* Las ondas del modo voz de Barberlytics (ChatVoiceMode): cuatro curvas con el
   gradiente de IA que se levantan con la voz y se calman en pausa. */
const MOTION: Record<WaveState, { amplitude: number; speed: number }> = {
  speaking: { amplitude: 0.62, speed: 1.2 },
  listening: { amplitude: 0.45, speed: 0.9 },
  thinking: { amplitude: 0.28, speed: 2.4 },
  idle: { amplitude: 0.06, speed: 0.35 },
}
const LAYERS = [
  { frequency: 1.6, speed: 1.1, scale: 1, width: 2.4, alpha: 0.9, stops: [0, 1, 2] },
  { frequency: 2.3, speed: -0.8, scale: 0.8, width: 1.8, alpha: 0.7, stops: [1, 2, 3] },
  { frequency: 1.1, speed: 0.6, scale: 0.65, width: 1.6, alpha: 0.6, stops: [3, 0, 1] },
  { frequency: 2.9, speed: -1.4, scale: 0.45, width: 1.2, alpha: 0.5, stops: [2, 3, 0] },
] as const
const POINTS = 100

interface VoiceWavesProps {
  state: WaveState
  /** Cambia con cada palabra: las ondas dan un salto */
  pulse: unknown
  className?: string
}

export function VoiceWaves({ state, pulse, className = '' }: VoiceWavesProps) {
  const { reducedMotion } = useA11y()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef(MOTION[state])
  const boost = useRef(0)
  useEffect(() => {
    target.current = MOTION[state]
  }, [state])
  useEffect(() => {
    boost.current = Math.min(1, boost.current + 0.5)
  }, [pulse])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let amplitude = target.current.amplitude
    let speed = target.current.speed
    let phase = 0
    let frame = 0
    let last = performance.now()
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      amplitude += (target.current.amplitude + boost.current * 0.35 - amplitude) * 0.08
      speed += (target.current.speed - speed) * 0.06
      boost.current *= 0.9
      phase += dt * speed * 2.2
      const { width, height } = canvas.getBoundingClientRect()
      const middle = height / 2
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      LAYERS.forEach((layer, index) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, AI[layer.stops[0]])
        gradient.addColorStop(0.5, AI[layer.stops[1]])
        gradient.addColorStop(1, AI[layer.stops[2]])
        const peak = middle * 0.9 * amplitude * layer.scale
        const curve = new Path2D()
        for (let p = 0; p <= POINTS; p += 1) {
          const t = p / POINTS
          const envelope = Math.sin(Math.PI * t) ** 2
          const wobble = Math.sin(phase * 0.7 + index) * 0.25 + 1
          const y = middle + Math.sin(t * Math.PI * 2 * layer.frequency + phase * layer.speed + index * 1.3) * peak * envelope * wobble
          if (p === 0) curve.moveTo(t * width, y)
          else curve.lineTo(t * width, y)
        }
        const body = new Path2D(curve)
        body.lineTo(width, middle)
        body.lineTo(0, middle)
        body.closePath()
        ctx.globalAlpha = layer.alpha * 0.18
        ctx.fillStyle = gradient
        ctx.fill(body)
        ctx.globalAlpha = layer.alpha
        ctx.lineWidth = layer.width
        ctx.strokeStyle = gradient
        ctx.stroke(curve)
      })
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }
    draw(last)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [reducedMotion])

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div className="pointer-events-none absolute inset-x-[15%] inset-y-[20%] rounded-full bg-[radial-gradient(closest-side,rgba(222,140,58,0.35),rgba(240,206,134,0.15)_55%,transparent)]" />
      <canvas ref={canvasRef} className="relative h-full w-full" />
    </div>
  )
}
