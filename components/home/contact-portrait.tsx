'use client'

import { useEffect, useRef } from 'react'
import { SignalField, type ShapeLoader } from '@/components/signal/signal-field'
import { sampleImage } from '@/components/signal/sample-image'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { portraitDepth, portraitMask } from './portrait-model'

/** Foto base (circular, 400×400) + reconstrucción 3D de cabeza y torso. */
const PORTRAIT_SRC = '/images/elkin-portrait.jpg'
const PORTRAIT_PARTICLES = { desktop: 24000, mobile: 11000 }

const loadPortrait: ShapeLoader = (count, worldWidth) =>
  sampleImage(PORTRAIT_SRC, count, worldWidth, {
    // Cabeza y arranque de los hombros: el rostro es el protagonista.
    crop: { x: 0.16, y: 0.06, w: 0.66, h: 0.66 },
    mask: portraitMask,
    depth: portraitDepth,
    // Forma sólida como el EG; la foto solo aporta sombras suaves.
    tonalDensity: 0.55,
    shadeRange: [0.18, 1],
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
