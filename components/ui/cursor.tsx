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
    if (!dot || !ring) return
    document.documentElement.classList.add('has-cursor')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'expo' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'expo' })

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], input, textarea')
      const text = target?.dataset.cursor ?? ''
      setLabel(text)
      gsap.to(ring, {
        scale: target ? (text ? 2.6 : 1.8) : 1,
        duration: 0.4,
        ease: 'expo.out',
      })
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
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-difference">
      <div ref={dotRef} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-white" />
      <div
        ref={ringRef}
        className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70"
      >
        {label && <span className="mono-label whitespace-nowrap text-[5px] text-white">{label}</span>}
      </div>
    </div>
  )
}
