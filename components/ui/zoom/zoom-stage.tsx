'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { Shot } from './zoom-targets'

/** Teléfono: los controles del visor van abajo y el gesto principal es deslizar */
export const NARROW_QUERY = '(max-width: 767px)'

/** Hacia dónde se pasa: a la anterior (-1) o a la siguiente (1) */
export type Step = -1 | 1

/** Margen alrededor de un tablero ampliado (px): a los lados (más con flechas, en escritorio) y arriba + abajo */
const BOARD_MARGIN = { x: 24, xWithArrows: 184, y: 160, yWithBar: 260 }
/** Sensibilidad de la rueda del ratón al acercar */
const WHEEL_ZOOM = 0.0015
/** Límites del acercamiento */
const SCALE = { min: 1, max: 5, doubleTap: 2.5 }
/** Dos toques dentro de este tiempo (ms) y distancia (px) son un doble toque */
const DOUBLE_TAP = { ms: 300, px: 24 }
/** Un dedo que se mueve menos que esto (px) es un toque, no un arrastre */
const TAP_SLOP = 8

interface View {
  scale: number
  x: number
  y: number
}

const FULL_VIEW: View = { scale: SCALE.min, x: 0, y: 0 }

interface ZoomStageProps {
  shot: Shot
  /** La que está al frente: solo esa recibe gestos; al dejar de estarlo vuelve a la vista completa */
  active: boolean
  /** Hay más de una: se deja sitio a las flechas y a la barra de abajo */
  hasNav: boolean
  /** Arrastre de lado sin acercar (px desde donde empezó): lo lleva el carrusel */
  onSlideDrag?: (dx: number) => void
  /** Se soltó ese arrastre: el carrusel decide si pasa a la vecina o vuelve */
  onSlideRelease?: (dx: number, dy: number) => void
}

/** La imagen o el tablero, con acercamiento por pellizco, doble toque, rueda y arrastre. */
export function ZoomStage({ shot, active, hasNav, onSlideDrag, onSlideRelease }: ZoomStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLElement | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const narrow = window.matchMedia(NARROW_QUERY).matches
  /** Un tablero se muestra a su tamaño de diseño, encogido para caber entre los controles */
  const room = {
    x: hasNav && !narrow ? BOARD_MARGIN.xWithArrows : BOARD_MARGIN.x,
    y: hasNav && narrow ? BOARD_MARGIN.yWithBar : BOARD_MARGIN.y,
  }
  const fit = shot.kind === 'node' ? Math.min((window.innerWidth - room.x) / shot.w, (window.innerHeight - room.y) / shot.h, 1.4) : 1

  useEffect(() => {
    const host = hostRef.current
    if (shot.kind !== 'node' || !host) return
    host.replaceChildren(shot.node)
    return () => host.replaceChildren()
  }, [shot])

  const view = useRef<View>(FULL_VIEW)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ moved: 0, pinched: false, sliding: false, start: { x: 0, y: 0 }, lastTap: { at: 0, x: 0, y: 0 } })

  /** Aplica la vista sin pasar por React (fluido mientras el dedo se mueve) */
  const apply = useCallback((next: View, animate = false) => {
    const stage = stageRef.current
    const img = imgRef.current
    if (!stage || !img) return
    // No deja que la imagen se vaya del todo fuera de la pantalla.
    const limitX = Math.max(0, (img.offsetWidth * next.scale - stage.clientWidth) / 2)
    const limitY = Math.max(0, (img.offsetHeight * next.scale - stage.clientHeight) / 2)
    const clamped = {
      scale: next.scale,
      x: Math.max(-limitX, Math.min(limitX, next.x)),
      y: Math.max(-limitY, Math.min(limitY, next.y)),
    }
    view.current = clamped
    img.style.transition = animate ? 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
    img.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0) scale(${clamped.scale})`
  }, [])

  // Al pasar a otra, la que se va vuelve a verse completa.
  useEffect(() => {
    if (!active && view.current.scale > SCALE.min) apply(FULL_VIEW, true)
  }, [active, apply])

  /** Acerca o aleja manteniendo fijo el punto `p` (relativo al centro de la pantalla) */
  const zoomAt = useCallback(
    (scale: number, p: { x: number; y: number }, animate = false) => {
      const current = view.current
      const next = Math.max(SCALE.min, Math.min(SCALE.max, scale))
      const k = next / current.scale
      apply({ scale: next, x: p.x - (p.x - current.x) * k, y: p.y - (p.y - current.y) * k }, animate)
    },
    [apply],
  )

  const local = (e: { clientX: number; clientY: number }) => {
    const r = stageRef.current?.getBoundingClientRect()
    return r ? { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 } : { x: 0, y: 0 }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) {
      gesture.current = { ...gesture.current, moved: 0, pinched: false, sliding: false, start: { x: e.clientX, y: e.clientY } }
    } else if (gesture.current.sliding) {
      // Un segundo dedo: es un pellizco, no un paso; el carrusel vuelve a su sitio.
      gesture.current.sliding = false
      onSlideRelease?.(0, 0)
    }
  }

  const onWheel = (e: React.WheelEvent) => {
    zoomAt(view.current.scale * Math.exp(-e.deltaY * WHEEL_ZOOM), local(e))
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const all = Array.from(pointers.current.values())
    if (all.length === 2) {
      const other = all.find((p) => p !== prev)
      if (!other) return
      const before = Math.hypot(prev.x - other.x, prev.y - other.y)
      const after = Math.hypot(e.clientX - other.x, e.clientY - other.y)
      const mid = local({ clientX: (e.clientX + other.x) / 2, clientY: (e.clientY + other.y) / 2 })
      if (before > 0) zoomAt(view.current.scale * (after / before), mid)
      gesture.current.moved += TAP_SLOP
      gesture.current.pinched = true
    } else if (all.length === 1) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      gesture.current.moved += Math.abs(dx) + Math.abs(dy)
      if (view.current.scale > SCALE.min) apply({ ...view.current, x: view.current.x + dx, y: view.current.y + dy })
      else if (!gesture.current.pinched && onSlideDrag && gesture.current.moved > TAP_SLOP) {
        // Sin acercar, arrastrar de lado mueve el carrusel entero.
        gesture.current.sliding = true
        onSlideDrag(e.clientX - gesture.current.start.x)
      }
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size > 0) return
    if (gesture.current.sliding) {
      gesture.current.sliding = false
      onSlideRelease?.(e.clientX - gesture.current.start.x, e.clientY - gesture.current.start.y)
      return
    }
    if (view.current.scale < SCALE.min + 0.02) apply(FULL_VIEW, true)
    if (gesture.current.moved > TAP_SLOP) return
    // Doble toque: acerca donde se tocó, o vuelve a la vista completa.
    const now = performance.now()
    const last = gesture.current.lastTap
    const isDouble = now - last.at < DOUBLE_TAP.ms && Math.hypot(e.clientX - last.x, e.clientY - last.y) < DOUBLE_TAP.px
    gesture.current.lastTap = { at: isDouble ? 0 : now, x: e.clientX, y: e.clientY }
    if (!isDouble) return
    if (view.current.scale > SCALE.min) apply(FULL_VIEW, true)
    else zoomAt(SCALE.doubleTap, local(e), true)
  }

  return (
    <div
      ref={stageRef}
      className={`absolute inset-0 isolate grid touch-none select-none place-items-center overflow-hidden px-3 pt-20 ${hasNav ? 'pb-36 md:px-24 md:pb-24' : 'pb-20'}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {shot.kind === 'img' ? (
        // eslint-disable-next-line @next/next/no-img-element -- la imagen original, a su tamaño real, para acercarla nítida
        <img
          ref={(el) => {
            imgRef.current = el
          }}
          src={shot.src}
          alt={shot.alt}
          draggable={false}
          className="max-h-full max-w-full origin-center rounded-md object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] will-change-transform"
        />
      ) : (
        <div
          ref={(el) => {
            imgRef.current = el
          }}
          className="relative origin-center will-change-transform"
          style={{ width: shot.w * fit, height: shot.h * fit }}
        >
          <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 origin-top-left text-[#2a2d33]" style={{ width: shot.w, transform: `scale(${fit})` }} />
        </div>
      )}
    </div>
  )
}
