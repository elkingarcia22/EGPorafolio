'use client'

import { useEffect, useRef } from 'react'
import { TransitionLink } from '@/components/transition/page-transition'
import { OrbitNode } from './orbit-node'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'
import { nearestTurn, orbitAngle, placeOnOrbit, quadPoint, type OrbitShape } from './orbit-math'

/** Radio de la órbita según el ancho del escenario, con tope en pantallas grandes */
const RADIUS = { ratio: 0.34, max: 470 }
/** Inclinación: cuánto suben los nodos de atrás, en proporción al radio */
const TILT = { ratio: 0.9, max: 190 }
/** Seguimiento del giro hacia el proyecto elegido (por cuadro de 60 fps) */
const FOLLOW = 0.085
/** Arrastre: cuántos px equivalen a pasar un proyecto (en proporción al radio) */
const DRAG_PER_ITEM = 1.1
/** Más de esto (px) ya es arrastre, no clic */
const DRAG_SLOP = 6
/** Después de arrastrar, durante este tiempo (ms) ningún clic abre un proyecto */
const CLICK_GUARD_MS = 350
/** Al pasar el cursor sobre un nodo lateral, gira al frente si se queda este tiempo (ms) */
const HOVER_INTENT_MS = 160
/** Impulso que viaja del centro al proyecto del frente (ms por recorrido) */
const PULSE_MS = 1700
/** Al nacer, la órbita llega girando media vuelta */
const BURST_SPIN = Math.PI

interface OrbitStageProps {
  projects: readonly Project[]
  /** giro pedido (entero, sin límite: el activo es su módulo) */
  target: number
  onSelect: (target: number) => void
  /** nacimiento de la órbita, 0–1: los nodos salen del centro y las fibras se tienden */
  burst: React.MutableRefObject<number>
  reducedMotion: boolean
}

/**
 * Escenario de la órbita: cada proyecto es un nodo circular de la red, unido
 * al centro y a sus vecinos por fibras. Gira como un carrusel en profundidad:
 * el del frente queda grande y nítido; los demás se alejan y se desenfocan.
 * Se gira arrastrando, con las flechas o tocando un nodo lejano.
 */
export function OrbitStage({ projects, target, onSelect, burst, reducedMotion }: OrbitStageProps) {
  const { t } = useLocale()
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const spokeRefs = useRef<(SVGPathElement | null)[]>([])
  const ringRefs = useRef<(SVGPathElement | null)[]>([])
  const pulseRef = useRef<SVGCircleElement>(null)
  const hubRef = useRef<HTMLSpanElement>(null)
  const targetRef = useRef(target)
  const dragRef = useRef<{ x: number; from: number; moved: boolean } | null>(null)
  const positionRef = useRef(target)
  /** Hasta cuándo (performance.now) se ignoran los clics, porque se acaba de arrastrar */
  const guardUntil = useRef(0)
  const hoverTimer = useRef(0)
  const count = projects.length

  targetRef.current = target

  useEffect(() => {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg || count === 0) return
    let width = 0
    let height = 0
    let shape: OrbitShape = { radius: 0, tilt: 0 }
    let frame = 0
    let last = 0
    let visible = false

    const resize = () => {
      width = stage.clientWidth
      height = stage.clientHeight
      const radius = Math.min(width * RADIUS.ratio, RADIUS.max)
      shape = { radius, tilt: Math.min(radius * TILT.ratio, TILT.max) }
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    }

    const draw = (time: number) => {
      const dt = last ? Math.min(64, time - last) : 16
      last = time
      const drag = dragRef.current
      if (!drag) {
        const follow = reducedMotion ? 1 : 1 - (1 - FOLLOW) ** (dt / 16.7)
        positionRef.current += (targetRef.current - positionRef.current) * follow
      }
      const b = reducedMotion ? 1 : burst.current
      const ease = 1 - (1 - b) ** 3
      const cx = width / 2
      const cy = height / 2 + shape.tilt * 0.3
      const hub = { x: cx, y: cy - shape.tilt / 2 }
      const spin = (1 - ease) * BURST_SPIN

      const centers = projects.map((_, i) => {
        const place = placeOnOrbit(orbitAngle(i, positionRef.current, count) + spin, shape)
        const x = hub.x + (cx + place.x - hub.x) * ease
        const y = hub.y + (cy + place.y - hub.y) * ease
        const el = itemRefs.current[i]
        if (el) {
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${place.scale * (0.15 + 0.85 * ease)})`
          el.style.opacity = String(place.opacity * Math.min(1, b * 2))
          el.style.filter = place.blur > 0.3 ? `blur(${place.blur.toFixed(1)}px)` : 'none'
          el.style.zIndex = String(place.zIndex)
        }
        return { x, y, depth: place.depth }
      })

      centers.forEach((c, i) => {
        const spoke = spokeRefs.current[i]
        if (spoke) {
          const control = { x: (hub.x + c.x) / 2, y: Math.min(hub.y, c.y) - shape.tilt * 0.35 }
          spoke.setAttribute('d', `M${hub.x},${hub.y} Q${control.x},${control.y} ${c.x},${c.y}`)
          spoke.style.strokeDashoffset = String(1 - ease)
          spoke.style.opacity = String(0.3 + 0.6 * c.depth)
        }
        const next = centers[(i + 1) % count]
        const ring = ringRefs.current[i]
        if (ring && next && count > 2) {
          const mid = { x: (c.x + next.x) / 2, y: (c.y + next.y) / 2 }
          const control = { x: hub.x + (mid.x - hub.x) * 1.35, y: hub.y + (mid.y - hub.y) * 1.35 }
          ring.setAttribute('d', `M${c.x},${c.y} Q${control.x},${control.y} ${next.x},${next.y}`)
          ring.style.strokeDashoffset = String(1 - Math.max(0, ease * 1.4 - 0.4))
          ring.style.opacity = String(0.15 + 0.35 * Math.min(c.depth, next.depth))
        }
      })

      // Impulso: del centro al proyecto del frente, una y otra vez.
      const pulse = pulseRef.current
      const front = centers[((Math.round(positionRef.current) % count) + count) % count]
      if (pulse && front && !reducedMotion) {
        const k = (time % PULSE_MS) / PULSE_MS
        const control = { x: (hub.x + front.x) / 2, y: Math.min(hub.y, front.y) - shape.tilt * 0.35 }
        const p = quadPoint(hub, control, front, k)
        pulse.setAttribute('cx', String(p.x))
        pulse.setAttribute('cy', String(p.y))
        pulse.style.opacity = String(b >= 1 ? Math.sin(Math.PI * k) : 0)
      }
      if (hubRef.current) {
        hubRef.current.style.transform = `translate3d(${hub.x}px, ${hub.y}px, 0) translate(-50%, -50%) scale(${0.6 + (1 - ease) * 1.6})`
      }
    }

    const loop = (time: number) => {
      draw(time)
      frame = visible ? requestAnimationFrame(loop) : 0
    }
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    // Solo se anima mientras se ve.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(loop)
    })
    io.observe(stage)
    resize()
    draw(performance.now())
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      io.disconnect()
    }
  }, [projects, count, burst, reducedMotion])

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return
    dragRef.current = { x: event.clientX, from: positionRef.current, moved: false }
  }
  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag || !stageRef.current) return
    const dx = event.clientX - drag.x
    if (!drag.moved && Math.abs(dx) < DRAG_SLOP) return
    if (!drag.moved) stageRef.current.setPointerCapture(event.pointerId)
    drag.moved = true
    const perItem = Math.min(stageRef.current.clientWidth * RADIUS.ratio, RADIUS.max) * DRAG_PER_ITEM
    positionRef.current = drag.from - dx / perItem
  }
  const endDrag = () => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.moved) {
      onSelect(Math.round(positionRef.current))
      // El clic que sigue a un arrastre no abre el proyecto.
      guardUntil.current = performance.now() + CLICK_GUARD_MS
    }
    dragRef.current = null
  }
  const blockClickAfterDrag = (event: React.MouseEvent) => {
    if (performance.now() > guardUntil.current) return
    event.preventDefault()
    event.stopPropagation()
  }
  /** Hover en un nodo lateral: si el cursor se queda, ese proyecto gira al frente. */
  const hoverNode = (event: React.PointerEvent, index: number) => {
    if (event.pointerType !== 'mouse' || dragRef.current) return
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => {
      // Mientras la órbita gira, los nodos pasan bajo el cursor: no se encadenan giros.
      if (Math.abs(positionRef.current - targetRef.current) > 0.08) return
      const current = ((Math.round(targetRef.current) % count) + count) % count
      if (index !== current) onSelect(nearestTurn(index, targetRef.current, count))
    }, HOVER_INTENT_MS)
  }
  const leaveNode = () => window.clearTimeout(hoverTimer.current)
  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  const active = ((target % count) + count) % count

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={blockClickAfterDrag}
      onDragStart={(event) => event.preventDefault()}
      className="relative isolate h-[clamp(22rem,14rem+20vw,34rem)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {projects.map((p, i) => (
          <path
            key={`ring-${p.slug}`}
            ref={(el) => { ringRefs.current[i] = el }}
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke="rgb(var(--fg))"
            strokeWidth={1}
          />
        ))}
        {projects.map((p, i) => (
          <path
            key={`spoke-${p.slug}`}
            ref={(el) => { spokeRefs.current[i] = el }}
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke={`rgb(${p.accent})`}
            strokeWidth={1.5}
          />
        ))}
        <circle ref={pulseRef} r={3.5} fill="white" style={{ filter: 'drop-shadow(0 0 6px white)' }} />
      </svg>

      {/* Centro de la órbita: el punto de donde nacen las conexiones */}
      <span
        ref={hubRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-3 w-3 bg-fg shadow-[0_0_0_6px_rgb(var(--fg)/0.08),0_0_28px_6px_rgb(var(--fg)/0.35)]"
      />

      <ul className="absolute inset-0">
        {projects.map((project, i) => {
          const title = t(project.title)
          const isActive = i === active
          return (
            <li
              key={project.slug}
              ref={(el) => { itemRefs.current[i] = el }}
              className="absolute left-0 top-0 will-change-transform"
            >
              <TransitionLink
                href={`/proyectos/${project.slug}`}
                transitionLabel={`N° ${project.frequency} · ${title}`}
                aria-label={`${title} — ${project.client}`}
                aria-current={isActive ? 'true' : undefined}
                data-cursor={isActive ? t(COPY.work.open) : t(COPY.work.drag)}
                draggable={false}
                onFocus={() => !isActive && onSelect(nearestTurn(i, targetRef.current, count))}
                onPointerEnter={(event) => hoverNode(event, i)}
                onPointerLeave={leaveNode}
                onClick={(event) => {
                  // Un nodo lateral no abre: gira al frente.
                  if (!isActive) {
                    event.preventDefault()
                    onSelect(nearestTurn(i, targetRef.current, count))
                  }
                }}
                className="group relative block aspect-square w-[clamp(9.5rem,5rem+11vw,16rem)] overflow-hidden rounded-full outline-none backdrop-blur-sm transition-[box-shadow,transform] duration-500 ease-expo focus-visible:ring-2 focus-visible:ring-signal aria-[current=true]:hover:scale-[1.03]"
                style={{ boxShadow: isActive ? `0 0 80px -16px rgb(${project.accent} / 0.6)` : undefined }}
              >
                <OrbitNode project={project} active={isActive} />
              </TransitionLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
