'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { JOBS, SKILLS, STUDIES, TOOLS } from '@/lib/content/profile'

/** La hoja de vida hecha sitio: misma retícula, barras y línea de tiempo con puntos. */
export function Trajectory() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-timeline-line]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: true },
      })
      gsap.utils.toArray<HTMLElement>('[data-job]').forEach((job) => {
        gsap.from(job, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: job, start: 'top 80%' },
        })
      })
      gsap.from('[data-skill]', {
        autoAlpha: 0,
        x: -16,
        stagger: 0.05,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-skills]', start: 'top 80%' },
      })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="light" id="about" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div ref={ref} className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-12">
          <SectionLabel index="03">{t(COPY.about.label)}</SectionLabel>
        </div>

        <div className="md:col-span-7">
          <h2 className="brand-title mb-10 text-3xl md:text-4xl">{t(COPY.about.experience)}</h2>
          <ol data-timeline className="relative space-y-14 pl-8">
            <span data-timeline-line className="absolute left-[3px] top-2 h-full w-px origin-top bg-fg/40" aria-hidden="true" />
            {JOBS.map((job) => (
              <li key={job.company} data-job className="relative">
                <span className="absolute -left-8 top-2 h-[7px] w-[7px] rounded-full bg-fg" aria-hidden="true" />
                <h3 className="brand-title text-sm leading-relaxed">
                  {t(job.role)} <span className="mx-2 opacity-40">|</span> {job.period}
                </h3>
                <p className="brand-title mt-1 text-sm">{job.company}</p>
                <p className="mt-4 max-w-xl leading-relaxed opacity-75">{t(job.summary)}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-14 md:col-span-4 md:col-start-9 md:border-l md:border-fg/20 md:pl-10">
          <section aria-labelledby="edu-title">
            <h2 id="edu-title" className="brand-title mb-6 text-2xl">{t(COPY.about.education)}</h2>
            <ul className="space-y-5">
              {STUDIES.map((s) => (
                <li key={`${s.school}-${s.year}`}>
                  <p className="brand-title text-xs leading-relaxed">{t(s.title)}</p>
                  <p className="mt-1 text-sm opacity-70">
                    {s.school} <span className="mx-1 opacity-40">|</span> {s.year}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="skills-title" data-skills>
            <h2 id="skills-title" className="brand-title mb-6 text-2xl">{t(COPY.about.skills)}</h2>
            <ul className="space-y-2">
              {SKILLS.map((skill) => (
                <li key={skill.es} data-skill className="flex items-center gap-3 text-sm">
                  <span className="h-1 w-1 rounded-full bg-fg/60" aria-hidden="true" />
                  {t(skill)}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tools-title">
            <h2 id="tools-title" className="brand-title mb-6 text-2xl">{t(COPY.about.tools)}</h2>
            <ul className="flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <li key={tool} className="border border-fg/25 px-3 py-1.5 text-sm transition-colors hover:border-signal hover:text-signal">
                  {tool}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </ToneSection>
  )
}
