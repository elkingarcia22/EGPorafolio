'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { Neuron } from './scroll-cue'

const OFFSET_X = 26
const OFFSET_Y = 14

/** Última posición del puntero, para aparecer ya junto al cursor y no viajar desde la esquina. */
const pointer = { x: -999, y: -999 }

/**
 * Etiqueta que acompaña al cursor mientras está sobre el EG:
 * "Desliza para seguir conectando". Cápsula de vidrio oscuro con una neurona
 * que late y una fibra corta por la que baja un impulso (como el indicador de
 * scroll del hero). Se abre con un barrido y se oculta al salir del monograma.
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
      overwrite: 'auto',
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
      <span className="flex items-center gap-3 rounded-full border border-white/15 bg-[rgb(var(--void)/0.72)] py-1.5 pl-1.5 pr-4 text-paper shadow-[0_12px_40px_-14px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md">
        <span className="grid h-7 w-7 place-items-center">
          <Neuron size="sm" live />
        </span>
        <span className="brand-title whitespace-nowrap text-[10px] text-paper/85">{t(COPY.hero.keepTuning)}</span>
        {/* Fibra corta: el impulso baja, hacia donde sigue la conexión */}
        <span className="relative h-5 w-px overflow-hidden bg-gradient-to-b from-white/10 via-white/30 to-white/10">
          <span className="absolute inset-x-0 top-0 h-2 rounded-full bg-white shadow-[0_0_6px_1px_rgb(150_190_255/0.9)] [animation:tune-impulse_1.4s_cubic-bezier(.65,0,.35,1)_infinite]" />
        </span>
      </span>
      <style>{`@keyframes tune-impulse { from { transform: translateY(-120%) } to { transform: translateY(260%) } }`}</style>
    </div>,
    document.body,
  )
}
