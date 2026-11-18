'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { MockScreen } from '@/components/mock/mock-screen'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

export function CaseHero({ project }: { project: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.35 })
      gsap.from('[data-hero-fade]', { autoAlpha: 0, y: 20, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.6 })
      gsap.fromTo(
        '[data-hero-mock]',
        { yPercent: 8, scale: 0.92, filter: 'grayscale(1) contrast(1.4)' },
        {
          yPercent: -6,
          scale: 1,
          filter: 'grayscale(0) contrast(1)',
          ease: 'none',
          scrollTrigger: { trigger: '[data-hero-mock]', start: 'top bottom', end: 'bottom 40%', scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reducedMotion, project.slug])

  const meta = [
    { label: COPY.case.role, value: t(project.role) },
    { label: COPY.case.team, value: t(project.team) },
    { label: COPY.case.duration, value: t(project.duration) },
    { label: COPY.case.year, value: project.year },
  ]

  return (
    <ToneSection tone="dark" className="px-[var(--gutter)] pb-16 pt-32">
      <div ref={ref}>
        <div className="mb-14 flex items-center justify-between" data-hero-fade>
          <TransitionLink href="/#work" transitionLabel="EG" className="mono-label opacity-60 hover:opacity-100">
            ← {t(COPY.case.back)}
          </TransitionLink>
          <span className="mono-label opacity-60">
            FM {project.frequency} · {project.client}
          </span>
        </div>

        <h1 className="overflow-hidden text-[clamp(3rem,1rem+8vw,9.5rem)] font-light leading-[0.92] tracking-tight">
          <span data-hero-line className="block">{t(project.title)}</span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <p data-hero-fade className="text-xl leading-relaxed opacity-80 md:col-span-6">
            {t(project.tagline)}
          </p>
          <dl className="grid grid-cols-2 gap-6 md:col-span-5 md:col-start-8">
            {meta.map((m) => (
              <div key={m.label.es} data-hero-fade>
                <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-sm leading-relaxed">{m.value}</dd>
              </div>
            ))}
            <div className="col-span-2" data-hero-fade>
              <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
              <dd className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span key={tool} className="border border-fg/25 px-2.5 py-1 text-xs">{tool}</span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <p data-hero-fade className="mono-label mt-10 flex items-center gap-2 text-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
          {t(COPY.case.placeholder)}
        </p>

        <div data-hero-mock className="mx-auto mt-16 max-w-5xl">
          <div className="bg-paper/5 p-2 ring-1 ring-paper/10 md:p-3">
            <div className={project.mock === 'mobile' ? 'mx-auto max-w-[18rem]' : ''}>
              <MockScreen kind={project.mock} mode="ui" accent={project.accent} />
            </div>
          </div>
        </div>
      </div>
    </ToneSection>
  )
}
