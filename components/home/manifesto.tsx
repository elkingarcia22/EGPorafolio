'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { RevealWords } from '@/components/ui/reveal-words'
import { StaticField } from '@/components/signal/static-field'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

/**
 * Primer momento "señal": el sitio pasa a papel claro y habla en primera persona.
 * La estática del hero sigue aquí y se disuelve a medida que el texto se ilumina.
 */
export function Manifesto() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const noise = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom 70%',
        scrub: true,
        onUpdate: (self) => {
          noise.current = self.progress
        },
      })
      // El resumen entra como el bloque de la hoja de vida: la barra crece y el texto sube.
      gsap.timeline({ scrollTrigger: { trigger: '[data-mf-summary]', start: 'top 85%', toggleActions: 'play none none none' } })
        .from('[data-mf-summary] .brand-bar', { scaleY: 0, transformOrigin: '50% 0%', duration: 0.9, ease: 'expo.out' })
        .from('[data-mf-summary] p', { autoAlpha: 0, x: -18, duration: 0.9, ease: 'expo.out' }, '<0.15')
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="light" className="relative overflow-hidden px-[var(--gutter)] py-[clamp(6rem,4rem+10vw,14rem)]">
      <StaticField progress={noise} reducedMotion={reducedMotion} className="absolute inset-0 h-full w-full" />
      <div ref={rootRef} className="relative grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="00">{t(COPY.manifesto.label)}</SectionLabel>
        </div>
        <div className="md:col-span-9">
          <RevealWords
            text={t(COPY.manifesto.text)}
            className="text-[clamp(1.9rem,1rem+3.4vw,4.4rem)] font-light leading-[1.08] tracking-tight"
          />
          <div data-mf-summary className="mt-16 flex max-w-xl gap-5">
            <span className="brand-bar shrink-0" aria-hidden="true" />
            <p className="text-base leading-relaxed opacity-80">{t(PROFILE.summary)}</p>
          </div>
        </div>
      </div>
    </ToneSection>
  )
}
