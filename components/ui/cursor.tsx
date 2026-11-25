'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

/** La cortina de transición marca el documento mientras tapa la página (ver page-transition). */
const isTransitioning = (): boolean => document.documentElement.dataset.transitioning === 'true'

/** Largo máximo (px) que se estira la fibra antes de volverse casi invisible */
const FIBER_MAX_PX = 140
/** Separación de la etiqueta respecto del puntero, para no tapar lo que se señala */
const BADGE_OFFSET_PX = 22

/**
 * Cursor propio, hecho sinapsis: una neurona-estrella en la punta y otra
 * (el anillo) que la sigue con retraso, unidas por una fibra que se estira
 * al moverse. Sobre elementos interactivos el anillo crece y se enciende;
 * los elementos con data-cursor="Texto" muestran una etiqueta de vidrio al
 * lado del puntero. Solo en dispositivos con puntero fino.
 */
export function Cursor() {
  const { reducedMotion } = useA11y()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const fiberRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const badgeInnerRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    const fiber = fiberRef.current
    const badge = badgeRef.current
    const badgeInner = badgeInnerRef.current
    if (!dot || !ring || !fiber || !badge || !badgeInner) return
    document.documentElement.classList.add('has-cursor')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'expo' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'expo' })
    const badgeX = gsap.quickTo(badge, 'x', { duration: 0.35, ease: 'expo' })
    const badgeY = gsap.quickTo(badge, 'y', { duration: 0.35, ease: 'expo' })

    // La fibra une el anillo con la punta: se recalcula en cada cuadro.
    const drawFiber = () => {
      const ax = Number(gsap.getProperty(ring, 'x'))
      const ay = Number(gsap.getProperty(ring, 'y'))
      const bx = Number(gsap.getProperty(dot, 'x'))
      const by = Number(gsap.getProperty(dot, 'y'))
      const length = Math.hypot(bx - ax, by - ay)
      const angle = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI
      fiber.style.transform = `translate(${ax}px, ${ay}px) rotate(${angle}deg) scaleX(${length})`
      fiber.style.opacity = String(length < 3 ? 0 : Math.max(0.15, 1 - length / FIBER_MAX_PX))
    }
    gsap.ticker.add(drawFiber)

    const html = document.documentElement
    const setAway = (away: boolean) => {
      if (away) html.dataset.cursorAway = 'true'
      else delete html.dataset.cursorAway
    }
    const onMove = (e: PointerEvent) => {
      // Al volver a la página, el cursor salta a donde está el mouse en vez de deslizarse desde donde quedó.
      if (html.dataset.cursorAway) {
        setAway(false)
        gsap.set([dot, ring, badge], { x: e.clientX, y: e.clientY })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      badgeX(e.clientX)
      badgeY(e.clientY)
    }
    const apply = (target: HTMLElement | null, text: string) => {
      if (text) setLabel(text)
      ring.dataset.active = String(!!target)
      gsap.to(ring, { scale: target ? 1.9 : 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' })
      gsap.to(badgeInner, {
        autoAlpha: text ? 1 : 0,
        x: text ? 0 : -8,
        scale: text ? 1 : 0.9,
        duration: text ? 0.45 : 0.25,
        ease: 'expo.out',
        overwrite: 'auto',
      })
    }
    const onOver = (e: PointerEvent) => {
      if (isTransitioning()) return
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], input, textarea')
      apply(target, target?.dataset.cursor ?? '')
    }
    // Al seguir un enlace, la cortina tapa la página: el cursor vuelve a su forma simple.
    const onClick = () => {
      if (isTransitioning()) apply(null, '')
    }
    // Al hacer clic, la neurona de la punta dispara.
    const onDown = (e: PointerEvent) => {
      onMove(e)
      gsap.fromTo(dot, { '--fire': 1 }, { '--fire': 0, duration: 0.6, ease: 'power2.out' })
    }

    // Fuera de la página o sin foco no llegan movimientos: se muestra el puntero del sistema.
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) setAway(true)
    }
    const onBlur = () => setAway(true)
    const onVisibility = () => document.hidden && setAway(true)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerover', onOver)
    window.addEventListener('click', onClick)
    document.addEventListener('pointerout', onLeave)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      gsap.ticker.remove(drawFiber)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerout', onLeave)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
      setAway(false)
      window.removeEventListener('click', onClick)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div aria-hidden="true" data-cursor-layer className="pointer-events-none fixed left-0 top-0 z-[80]">
        {/* Fibra: un píxel de largo que se escala hasta la distancia entre las dos neuronas */}
        <div
          ref={fiberRef}
          className="absolute left-0 top-0 h-px w-px origin-left bg-gradient-to-r from-[rgb(var(--signal)/0.15)] to-[rgb(var(--signal)/0.9)] opacity-0"
        />
        {/* Anillo: la neurona que sigue */}
        <div
          ref={ringRef}
          data-active="false"
          className="group/ring absolute -left-4 -top-4 h-8 w-8"
        >
          <span className="absolute inset-0 rounded-full border border-[rgb(var(--signal)/0.55)] transition-[border-color,box-shadow] duration-500 group-data-[active=true]/ring:border-[rgb(var(--signal))] group-data-[active=true]/ring:shadow-[0_0_14px_rgb(var(--signal)/0.55),inset_0_0_10px_rgb(var(--signal)/0.35)]" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--signal)/0.7)]" />
        </div>
        {/* Punta: neurona-estrella con halo y destello en cruz */}
        <div ref={dotRef} className="absolute left-0 top-0 [--fire:0]">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[radial-gradient(circle,rgb(var(--signal)/0.55)_0%,rgb(var(--signal)/0.12)_45%,transparent_70%)] [transform:scale(calc(1+var(--fire)*1.6))]" />
          <span className="absolute -left-[9px] top-0 h-px w-[18px] bg-gradient-to-r from-transparent via-[rgb(var(--fg)/0.55)] to-transparent" />
          <span className="absolute -top-[7px] left-0 h-[14px] w-px bg-gradient-to-b from-transparent via-[rgb(var(--fg)/0.45)] to-transparent" />
          <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-[rgb(var(--fg))] shadow-[0_0_6px_1px_rgb(var(--signal)/0.9)]" />
        </div>
      </div>
      <div ref={badgeRef} aria-hidden="true" data-cursor-layer className="pointer-events-none fixed left-0 top-0 z-[81]">
        <div
          ref={badgeInnerRef}
          className="absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-[rgb(var(--ice)/0.35)] bg-[rgb(10_11_13/0.62)] py-1.5 pl-2 pr-3 text-paper shadow-[0_8px_30px_-8px_rgb(var(--signal)/0.6)] backdrop-blur-md"
          style={{ left: BADGE_OFFSET_PX, top: BADGE_OFFSET_PX, visibility: 'hidden', opacity: 0 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgb(var(--ice))]" />
          <span className="mono-label text-[11px] tracking-[0.16em]">{label}</span>
        </div>
      </div>
    </>
  )
}
