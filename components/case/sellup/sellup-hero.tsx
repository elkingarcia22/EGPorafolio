'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { HeroRumbo } from './hero-rumbo'
import { SellUpMark, SellUpWordmark } from './ui'

export function SellUpHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3 }, 0.15)
        .from('[data-hero-mark]', { autoAlpha: 0, scale: 0.3, rotate: -40, duration: 1.4 }, 0.1)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute -right-[20vw] -top-[30vw] h-[80vw] w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgba(91,126,255,0.22),rgba(29,63,196,0.1)_50%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/#work" transitionLabel={t(COPY.case.back)} className="mono-label opacity-60 hover:opacity-100">
            ← {t(COPY.case.back)}
          </TransitionLink>
          <span className="mono-label opacity-60">{t(SELLUP_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <h1 className="flex items-center gap-[0.18em] text-[clamp(3.2rem,1rem+8vw,10rem)] font-light leading-[0.9] tracking-tight md:col-span-7">
            <span data-hero-mark className="inline-block"><SellUpMark size={96} className="!h-[0.78em] !w-[0.78em]" /></span>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-hero-word className="inline-block"><SellUpWordmark /></span>
            </span>
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 md:col-span-5">{t(SELLUP_CASE.tagline)}</p>
        </div>

        <div className="relative mt-14" data-hero-fade>
          <HeroRumbo />
        </div>

        <dl className="relative mt-14 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-5">
          {SELLUP_CASE.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div data-hero-fade className="col-span-2 md:col-span-1">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {SELLUP_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2 py-0.5 text-[11px]">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </ToneSection>
  )
}
