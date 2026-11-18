'use client'

import { useEffect, useRef } from 'react'
import { SignalField } from '@/components/signal/signal-field'
import { ToneSection } from '@/components/ui/tone-section'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

/**
 * Hero en tres tiempos, controlados por el scroll:
 * 1. "Todo producto empieza como ruido."  (estática)
 * 2. "Mi trabajo es encontrar la señal."   (las partículas se ordenan)
 * 3. Firma: elkin / GARCIA, como en la hoja de vida.
 */
export function Hero() {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const sectionRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const q = gsap.utils.selector(section)

    if (reducedMotion) {
      progress.current = 1
      gsap.set(q('[data-phase]'), { autoAlpha: 0 })
      gsap.set(q('[data-phase="name"]'), { autoAlpha: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = gsap.utils.clamp(0, 1, self.progress / 0.72)
          },
        },
      })
      tl.to(q('[data-phase="noise"]'), { autoAlpha: 0, filter: 'blur(12px)', y: -40, duration: 0.18 }, 0.12)
        .fromTo(q('[data-phase="signal"]'), { autoAlpha: 0, y: 40, filter: 'blur(12px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.14 }, 0.32)
        .to(q('[data-phase="signal"]'), { autoAlpha: 0, y: -40, duration: 0.12 }, 0.58)
        .fromTo(q('[data-phase="name"]'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.7)
        .fromTo(q('[data-bar]'), { scaleY: 0 }, { scaleY: 1, duration: 0.14, stagger: 0.03 }, 0.72)
        .to(q('[data-hint]'), { autoAlpha: 0, duration: 0.08 }, 0.05)
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" aria-label="Elkin Garcia">
      <div ref={sectionRef} className="relative h-[320vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <SignalField progress={progress} reducedMotion={reducedMotion} className="absolute inset-0" />

          {/* 1 · Ruido */}
          <div data-phase="noise" className="pointer-events-none absolute inset-0 flex items-end px-[var(--gutter)] pb-[18vh]">
            <p className="max-w-[14ch] text-[clamp(2.5rem,1rem+6vw,6.5rem)] font-light leading-[0.95] tracking-tight">
              {t(COPY.hero.noise)}
            </p>
          </div>

          {/* 2 · Señal */}
          <div data-phase="signal" className="pointer-events-none invisible absolute inset-0 flex items-end justify-end px-[var(--gutter)] pb-[18vh] text-right">
            <p className="max-w-[16ch] text-[clamp(2.5rem,1rem+6vw,6.5rem)] font-light leading-[0.95] tracking-tight">
              {t(COPY.hero.signal).replace(/\.$/, '')}
              <span className="text-signal">.</span>
            </p>
          </div>

          {/* 3 · Firma (lockup de la hoja de vida) */}
          <div data-phase="name" className="invisible absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-10">
            <div className="flex items-end gap-5">
              <span data-bar className="brand-bar h-[clamp(6rem,14vw,12rem)] origin-bottom" aria-hidden="true" />
              <div>
                <h1 className="leading-[0.85]">
                  <span className="block text-[clamp(2rem,1rem+4vw,4.5rem)] font-light lowercase">{PROFILE.firstName}</span>
                  <span className="block text-[clamp(3rem,1rem+9vw,10rem)] font-medium tracking-[0.12em]">{PROFILE.lastName}</span>
                </h1>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 md:ml-[calc(6px+1.25rem)] md:flex-row md:items-end md:justify-between">
              <p className="flex items-center gap-3 text-lg">
                <span data-bar className="h-6 w-px origin-bottom bg-current" aria-hidden="true" />
                {t(PROFILE.role)}
              </p>
              <p className="max-w-md text-sm leading-relaxed opacity-70">{t(COPY.hero.tagline)}</p>
            </div>
          </div>

          <p data-hint className="mono-label caret absolute left-1/2 top-[22vh] -translate-x-1/2 whitespace-nowrap opacity-60">
            {t(COPY.hero.scroll)}
          </p>
        </div>
      </div>
    </ToneSection>
  )
}
