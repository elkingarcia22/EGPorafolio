'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

/**
 * Cursor propio: un punto + un anillo que "sintoniza" (crece) sobre
 * elementos interactivos. Elementos con data-cursor="Texto" muestran
 * una etiqueta. Solo en dispositivos con puntero fino.
 */
export function Cursor() {
  const { reducedMotion } = useA11y()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
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
    const badge = badgeRef.current
    const badgeInner = badgeInnerRef.current
    if (!dot || !ring || !badge || !badgeInner) return
    document.documentElement.classList.add('has-cursor')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'expo' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'expo' })
    const badgeX = gsap.quickTo(badge, 'x', { duration: 0.35, ease: 'expo' })
    const badgeY = gsap.quickTo(badge, 'y', { duration: 0.35, ease: 'expo' })

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      badgeX(e.clientX)
      badgeY(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], input, textarea')
      const text = target?.dataset.cursor ?? ''
      if (text) setLabel(text)
      // Con etiqueta: un disco sólido que se lee sobre cualquier fondo; el anillo y el punto se esconden.
      gsap.to(ring, { scale: text ? 0.4 : target ? 1.8 : 1, autoAlpha: text ? 0 : 1, duration: 0.4, ease: 'expo.out', overwrite: 'auto' })
      gsap.to(dot, { autoAlpha: text ? 0 : 1, duration: 0.2, overwrite: 'auto' })
      gsap.to(badgeInner, { scale: text ? 1 : 0, autoAlpha: text ? 1 : 0, duration: text ? 0.5 : 0.3, ease: 'expo.out', overwrite: 'auto' })
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-difference">
        <div ref={dotRef} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-white" />
        <div ref={ringRef} className="absolute -left-5 -top-5 h-10 w-10 rounded-full border border-white/70" />
      </div>
      <div ref={badgeRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[81]">
        <div
          ref={badgeInnerRef}
          className="absolute -left-12 -top-12 flex h-24 w-24 items-center justify-center rounded-full bg-signal text-paper shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)]"
          style={{ transform: 'scale(0)', visibility: 'hidden' }}
        >
          <span className="mono-label whitespace-nowrap text-[11px] tracking-[0.16em]">{label}</span>
        </div>
      </div>
    </>
  )
}
