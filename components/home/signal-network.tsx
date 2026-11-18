'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

const NODE_COUNT = 54
/** Distancia máxima (fracción del lado) para conectar dos nodos */
const LINK_DISTANCE = 0.24
const MAX_PULSES = 14
const PULSE_SPAWN_CHANCE = 0.06
/** Radio de influencia del cursor (fracción del lado) */
const CURSOR_RADIUS = 0.28

interface Node {
  /** posición "en red" (0–1) */
  x: number
  y: number
  /** posición de ruido inicial */
  nx: number
  ny: number
  phase: number
  size: number
  /** activación 0–1 (se enciende cuando llega un pulso o pasa el cursor) */
  glow: number
}

interface Pulse {
  from: number
  to: number
  t: number
  speed: number
}

function createNodes(): Node[] {
  const nodes: Node[] = []
  for (let i = 0; i < NODE_COUNT; i++) {
    // Distribución en disco, más densa hacia el centro.
    const angle = Math.random() * Math.PI * 2
    const radius = Math.pow(Math.random(), 0.7) * 0.44
    nodes.push({
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius,
      nx: Math.random(),
      ny: Math.random(),
      phase: Math.random() * Math.PI * 2,
      size: 1.2 + Math.random() * 2.2,
      glow: 0,
    })
  }
  return nodes
}

/**
 * Red de conexiones: nodos sueltos (ruido) que, al entrar en pantalla,
 * se enlazan y empiezan a pasarse señales. Los pulsos azules viajan por
 * las conexiones y el cursor activa los nodos cercanos.
 */
export function SignalNetwork({ label }: { label: string }) {
  const { reducedMotion } = useA11y()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progress = useRef(0)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || reducedMotion) {
      progress.current = 1
      return
    }
    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: 'top 90%',
      end: 'center 55%',
      scrub: 0.8,
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })
    return () => trigger.kill()
  }, [reducedMotion])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const styles = getComputedStyle(document.documentElement)
    const paper = styles.getPropertyValue('--paper').trim().split(/\s+/).join(',')
    const signal = styles.getPropertyValue('--signal').trim().split(/\s+/).join(',')

    const nodes = createNodes()
    const links: [number, number][] = []
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        if (Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y) < LINK_DISTANCE) links.push([a, b])
      }
    }
    const pulses: Pulse[] = []
    const mouse = { x: -9, y: -9 }
    let size = 0
    let visible = true
    let frame = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      size = wrap.clientWidth
      canvas.width = size * dpr
      canvas.height = size * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) / rect.width
      mouse.y = (e.clientY - rect.top) / rect.height
    }

    const draw = (time: number) => {
      const p = progress.current
      const ease = p * p * (3 - 2 * p)
      ctx.clearRect(0, 0, size, size)

      // Posición actual de cada nodo: del ruido a la red, con deriva suave.
      const pos = nodes.map((n) => {
        const drift = reducedMotion ? 0 : 0.012
        const x = n.nx + (n.x - n.nx) * ease + Math.sin(time * 0.0006 + n.phase) * drift
        const y = n.ny + (n.y - n.ny) * ease + Math.cos(time * 0.0005 + n.phase * 1.3) * drift
        const near = Math.max(0, 1 - Math.hypot(x - mouse.x, y - mouse.y) / CURSOR_RADIUS)
        n.glow = Math.max(n.glow * 0.94, near * ease)
        return { x: x * size, y: y * size }
      })

      // Conexiones: aparecen cuando la red ya se formó.
      const linkAlpha = Math.max(0, (ease - 0.45) / 0.55)
      if (linkAlpha > 0) {
        for (const [a, b] of links) {
          const glow = Math.max(nodes[a].glow, nodes[b].glow)
          ctx.strokeStyle = glow > 0.05 ? `rgba(${signal},${(0.25 + glow * 0.6) * linkAlpha})` : `rgba(${paper},${0.13 * linkAlpha})`
          ctx.lineWidth = glow > 0.05 ? 1.2 : 1
          ctx.beginPath()
          ctx.moveTo(pos[a].x, pos[a].y)
          ctx.lineTo(pos[b].x, pos[b].y)
          ctx.stroke()
        }
      }

      // Pulsos: señales que viajan de nodo a nodo.
      if (!reducedMotion && linkAlpha > 0.6 && pulses.length < MAX_PULSES && Math.random() < PULSE_SPAWN_CHANCE) {
        const [a, b] = links[Math.floor(Math.random() * links.length)]
        const forward = Math.random() < 0.5
        pulses.push({ from: forward ? a : b, to: forward ? b : a, t: 0, speed: 0.012 + Math.random() * 0.014 })
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        pulse.t += pulse.speed
        if (pulse.t >= 1) {
          nodes[pulse.to].glow = 1
          pulses.splice(i, 1)
          continue
        }
        const x = pos[pulse.from].x + (pos[pulse.to].x - pos[pulse.from].x) * pulse.t
        const y = pos[pulse.from].y + (pos[pulse.to].y - pos[pulse.from].y) * pulse.t
        ctx.fillStyle = `rgba(${signal},0.95)`
        ctx.beginPath()
        ctx.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(${signal},0.18)`
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()
      }

      // Nodos (cuadrados, como la estática del hero).
      nodes.forEach((n, i) => {
        const s = n.size + n.glow * 3
        if (n.glow > 0.05) {
          ctx.fillStyle = `rgba(${signal},${0.15 * n.glow})`
          ctx.beginPath()
          ctx.arc(pos[i].x, pos[i].y, s * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = n.glow > 0.3 ? `rgba(${signal},1)` : `rgba(${paper},${0.45 + 0.4 * ease})`
        ctx.fillRect(pos[i].x - s / 2, pos[i].y - s / 2, s, s)
      })
    }

    const loop = (time: number) => {
      if (visible) draw(time)
      frame = requestAnimationFrame(loop)
    }

    resize()
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(wrap)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    if (reducedMotion) draw(0)
    else frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reducedMotion])

  return (
    <div ref={wrapRef} role="img" aria-label={label} className="relative mx-auto aspect-square w-full max-w-md md:max-w-none">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  )
}
