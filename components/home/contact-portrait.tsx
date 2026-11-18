'use client'

import { useEffect, useRef } from 'react'
import { SignalField, type ShapeLoader } from '@/components/signal/signal-field'
import { sampleImage } from '@/components/signal/sample-image'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { portraitDepth, portraitMask } from './portrait-model'

/** Foto base (circular, 400×400) + reconstrucción 3D de cabeza y torso. */
const PORTRAIT_SRC = '/images/elkin-portrait.jpg'
const PORTRAIT_PARTICLES = { desktop: 22000, mobile: 10000 }

const loadPortrait: ShapeLoader = (count, worldWidth) =>
  sampleImage(PORTRAIT_SRC, count, worldWidth, {
    // Cabeza y hombros
    crop: { x: 0.11, y: 0.06, w: 0.76, h: 0.94 },
    mask: portraitMask,
    depth: portraitDepth,
  })

/**
 * Retrato en partículas: al entrar en pantalla la estática se ordena
 * hasta formar la foto, como el EG del inicio. Con el cursor encima, vibra.
 */
export function ContactPortrait({ label }: { label: string }) {
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const progress = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) {
      progress.current = 1
      return
    }
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      end: 'top 25%',
      scrub: 0.8,
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })
    return () => trigger.kill()
  }, [reducedMotion])

  return (
    <div ref={ref} role="img" aria-label={label} className="relative aspect-[4/5] w-full">
      {/* El lienzo desborda la columna y se desvanece en los bordes: sin recuadro visible */}
      <div className="pointer-events-none absolute -inset-[18%] [mask-image:radial-gradient(closest-side,#000_70%,transparent)]">
        <SignalField
          look="portrait"
          progress={progress}
          reducedMotion={reducedMotion}
          shape={loadPortrait}
          offsetY={0.05}
          fitHeight={0.7}
          particles={PORTRAIT_PARTICLES}
          className="absolute inset-0"
        />
      </div>
    </div>
  )
}
