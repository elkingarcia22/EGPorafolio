'use client'

import { useEffect, useRef } from 'react'
import { SignalField, type ShapeLoader } from '@/components/signal/signal-field'
import { sampleImage } from '@/components/signal/sample-image'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

const PORTRAIT_SRC = '/images/elkin-portrait.jpg'
const loadPortrait: ShapeLoader = (count, worldWidth) => sampleImage(PORTRAIT_SRC, count, worldWidth)
const PORTRAIT_PARTICLES = { desktop: 26000, mobile: 11000 }

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
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className="relative aspect-[4/5] w-full [mask-image:radial-gradient(ellipse_at_50%_45%,#000_45%,transparent_78%)]"
      style={{
        background:
          'radial-gradient(ellipse at 55% 35%, rgb(28 58 160 / 0.9) 0%, rgb(14 32 104 / 0.85) 38%, rgb(8 18 60 / 0.6) 62%, transparent 85%)',
      }}
    >
      <SignalField
        look="portrait"
        progress={progress}
        reducedMotion={reducedMotion}
        shape={loadPortrait}
        offsetY={0}
        fitHeight={1.05}
        particles={PORTRAIT_PARTICLES}
        className="absolute inset-0"
      />
    </div>
  )
}
