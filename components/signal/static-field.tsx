'use client'

import { useEffect, useRef } from 'react'

/** Puntos por cada 10.000 px² (con tope) */
const DOT_DENSITY = 2.2
const MAX_DOTS = 2600
/** Cada cuánto cambia el parpadeo de la estática (como en el hero) */
const FLICKER_MS = 55
/** Puntos que, al disolverse la estática, se vuelven señal por un momento */
const SIGNAL_SHARE = 0.08

interface StaticFieldProps {
  /** 0 = estática completa, 1 = ya no queda ruido */
  progress: React.MutableRefObject<number>
  /** variable CSS (canales RGB) del color de la estática */
  colorVar?: string
  reducedMotion: boolean
  className?: string
}

function rgbVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(',')
}

/**
 * La estática del hero continúa en la sección siguiente y se disuelve a
 * medida que se lee: el ruido se apaga y unos pocos puntos se encienden en
 * azul justo antes de desaparecer, como si la señal saliera del ruido.
 */
export function StaticField({ progress, colorVar = '--ink', reducedMotion, className = '' }: StaticFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || reducedMotion) return

    const ink = rgbVar(colorVar)
    const signal = rgbVar('--signal')
    let width = 0
    let height = 0
    let dots: { x: number; y: number; s: number; seed: number; cut: number; signal: boolean }[] = []
    let frame = 0
    let visible = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(MAX_DOTS, Math.round(((width * height) / 10000) * DOT_DENSITY))
      dots = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        s: Math.random() < 0.85 ? 1.4 : 2.6,
        seed: Math.random() * 100,
        // Momento (0–1 del avance) en que este punto se apaga
        cut: Math.random(),
        signal: Math.random() < SIGNAL_SHARE,
      }))
    }

    const draw = (time: number) => {
      const p = progress.current
      ctx.clearRect(0, 0, width, height)
      if (p >= 1) return
      const tick = Math.floor(time / FLICKER_MS)
      for (const dot of dots) {
        // Cerca de su apagado, los puntos de señal se encienden en azul.
        const left = dot.cut - p
        if (left <= 0) continue
        const flash = dot.signal && left < 0.18
        if (!flash && Math.sin(dot.seed * 91.7 + tick * 1.3) <= -0.1) continue
        ctx.fillStyle = flash ? `rgba(${signal},${0.9 * (left / 0.18)})` : `rgba(${ink},0.38)`
        const s = flash ? 4 : dot.s
        ctx.fillRect(dot.x * width, dot.y * height, s, s)
      }
    }

    const loop = (time: number) => {
      if (visible) draw(time)
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
  }, [progress, colorVar, reducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />
}
