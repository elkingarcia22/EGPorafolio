'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap, scrollToTarget } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { OVERVIEW } from '@/lib/content/cases/barberlytics/overview'
import { Shot } from './ui'

/** Portada del caso: título, de qué trata, las cuatro piezas y la captura principal. */
export function BarberlyticsHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', { yPercent: 110, duration: 1.2, ease: 'expo.out', delay: 0.35 })
      gsap.from('[data-hero-fade]', { autoAlpha: 0, y: 20, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.6 })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" className="px-[var(--gutter)] pb-20 pt-32">
      <div ref={ref}>
        <div className="mb-14 flex items-center justify-between" data-hero-fade>
          <TransitionLink href="/#work" transitionLabel="EG" className="mono-label opacity-60 hover:opacity-100">
            ← {t(COPY.case.back)}
          </TransitionLink>
          <span className="mono-label opacity-60">{t(OVERVIEW.eyebrow)}</span>
        </div>

        <h1 className="overflow-hidden text-[clamp(3rem,1rem+8vw,9.5rem)] font-light leading-[0.92] tracking-tight">
          <span data-hero-line className="block">{t(OVERVIEW.title)}</span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <p data-hero-fade className="text-xl leading-relaxed opacity-85 md:col-span-6">
            {t(OVERVIEW.tagline)}
          </p>
          <dl className="grid grid-cols-2 gap-6 md:col-span-5 md:col-start-8">
            {OVERVIEW.meta.map((m) => (
              <div key={m.label.es} data-hero-fade>
                <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
              </div>
            ))}
            <div className="col-span-2" data-hero-fade>
              <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
              <dd className="flex flex-wrap gap-2">
                {OVERVIEW.tools.map((tool) => (
                  <span key={tool} className="border border-fg/25 px-2.5 py-1 text-xs">{tool}</span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {/* Las cuatro piezas: cada una lleva a su capítulo */}
        <ol className="mt-16 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
          {OVERVIEW.pieces.map((p, i) => (
            <li key={p.id} data-hero-fade>
              <a
                href={`#${p.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(`#${p.id}`)
                }}
                className="group block h-full bg-bg p-6 transition-colors hover:bg-signal hover:text-paper"
              >
                <span className="mono-label opacity-60">0{i + 1} · {t(p.what)}</span>
                <span className="mt-4 block text-3xl font-light">{t(p.title)}</span>
                <span className="mt-6 flex items-center justify-between text-sm opacity-80">
                  {t(p.stat)}
                  <span aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:translate-y-1">↓</span>
                </span>
              </a>
            </li>
          ))}
        </ol>

        <div data-hero-fade className="mt-16">
          <Shot image={OVERVIEW.hero} priority sizes="(min-width: 1280px) 1200px, 100vw" />
        </div>
      </div>
    </ToneSection>
  )
}
