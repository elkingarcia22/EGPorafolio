'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

const OFFSET_X = 26
const OFFSET_Y = 14

/** Última posición del puntero, para aparecer ya junto al cursor y no viajar desde la esquina. */
const pointer = { x: -999, y: -999 }

/**
 * Etiqueta que acompaña al cursor mientras está sobre el EG:
 * "Desliza para seguir conectando". Se abre con un barrido y
 * se oculta al salir del monograma.
 */
export function HoverTuneLabel({ visible }: { visible: boolean }) {
  const { t } = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  // En un portal: dentro del hero, un ancestro con transform movería el `fixed` lejos del cursor.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el, { x: pointer.x + OFFSET_X, y: pointer.y + OFFSET_Y })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'expo' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'expo' })
    const move = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      xTo(e.clientX + OFFSET_X)
      yTo(e.clientY + OFFSET_Y)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [mounted])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (visible) gsap.set(el, { x: pointer.x + OFFSET_X, y: pointer.y + OFFSET_Y })
    gsap.to(el, {
      clipPath: visible ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
      autoAlpha: visible ? 1 : 0,
      duration: visible ? 0.55 : 0.3,
      ease: 'expo.out',
      // Cancela la animación anterior: si mostrar (más larga) terminara
      // después de ocultar, la etiqueta se quedaría pegada al cursor.
      overwrite: true,
    })
  }, [visible, mounted])

  if (!mounted) return null
  return createPortal(
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45] hidden md:block"
      style={{ clipPath: 'inset(0% 100% 0% 0%)', visibility: 'hidden' }}
    >
      <span className="flex items-center gap-2.5 bg-signal px-3.5 py-2 text-paper shadow-lg">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper" />
        <span className="brand-title whitespace-nowrap text-[11px]">{t(COPY.hero.keepTuning)}</span>
        <span className="text-xs">↓</span>
      </span>
    </div>,
    document.body,
  )
}
