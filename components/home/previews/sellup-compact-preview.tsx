'use client'

import { useA11y } from '@/lib/a11y'
import { Orbit } from '@/components/case/sellup/hero-rumbo'
import { useTick } from '@/components/case/barberlytics/thema/live-pieces'

const PHASE_MS = 3400
const PHASE_COUNT = 3

/**
 * SellUp en pantallas pequeñas: solo la órbita de Rumbo, grande y al centro, con los letreros de
 * fuentes a tamaño legible. La tarjeta lateral de escritorio no cabe sin encogerse, así que se omite.
 */
export function SellupCompactPreview() {
  const { reducedMotion } = useA11y()
  const tick = useTick(PHASE_MS)
  const phase = reducedMotion ? 0 : tick % PHASE_COUNT

  return (
    <div className="relative aspect-[4/3.4] overflow-hidden bg-[#0b0c0f] text-white md:aspect-[16/10]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_65%_at_50%_50%,rgba(126,43,224,0.2),transparent_70%)]" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 aspect-square h-[94%] -translate-x-1/2 -translate-y-1/2">
        <Orbit phase={phase} still={reducedMotion} markSize={56} />
      </div>
    </div>
  )
}
