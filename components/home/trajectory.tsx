'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { EARLY_JOBS, JOBS, SKILLS, STUDIES, TOOL_GROUPS, UX_PM_BADGES } from '@/lib/content/profile'

/** Sello UX-PM dibujado (hexágono + cinta), en el color de cada nivel. */
function UxPmBadge({ level, year, color }: { level: number; year: string; color: string }) {
  return (
    <li className="flex items-center gap-3">
      <svg viewBox="0 0 40 46" className="h-11 w-10 shrink-0" aria-hidden="true">
        <path d="M12 30 L8 45 L14 41 L18 45 L20 32 Z M28 30 L32 45 L26 41 L22 45 L20 32 Z" fill={color} opacity="0.8" />
        <circle cx="20" cy="18" r="17" fill={color} />
        <path d="M20 7 L29.5 12.5 V23.5 L20 29 L10.5 23.5 V12.5 Z" fill="none" stroke="#fff" strokeWidth="2.6" />
      </svg>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-wide">UX-PM</span>
        <span className="block text-xs opacity-60">
          level {level} · {year}
        </span>
      </span>
    </li>
  )
}

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
          scrollTrigger: { trigger: job, start: 'top 82%' },
        })
      })
      gsap.from('[data-reveal-item]', {
        autoAlpha: 0,
        x: -16,
        stagger: 0.04,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-side]', start: 'top 80%' },
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

        {/* Experiencia */}
        <div className="md:col-span-7">
          <h2 className="brand-title mb-10 text-3xl md:text-4xl">{t(COPY.about.experience)}</h2>
          <ol data-timeline className="relative space-y-14 pl-8">
            <span data-timeline-line className="absolute left-[3px] top-2 h-full w-px origin-top bg-fg/40" aria-hidden="true" />
            {JOBS.map((job) => (
              <li key={job.company} data-job className="relative">
                <span className="absolute -left-8 top-2 h-[7px] w-[7px] rounded-full bg-fg" aria-hidden="true" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="brand-title text-base">{job.company}</h3>
                  <span className="mono-label opacity-60">{job.period}</span>
                </div>
                <p className="mt-1 text-xs opacity-50">{t(job.location)}</p>

                <ul className="mt-4 space-y-1.5 border-l-[3px] border-fg pl-4">
                  {job.roles.map((role) => (
                    <li key={role.period} className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
                      <span className="font-medium">{t(role.title)}</span>
                      <span className="mono-label opacity-50">{role.period}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 max-w-xl leading-relaxed opacity-75">{t(job.summary)}</p>
                {job.highlights && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {job.highlights.map((h) => (
                      <li key={h.es} className="border border-fg/20 px-2 py-0.5 text-xs opacity-80">
                        {t(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          {/* Trayectoria previa */}
          <div className="mt-20">
            <h3 className="brand-title mb-6 text-sm opacity-70">{t(COPY.about.earlier)}</h3>
            <ul className="divide-y divide-fg/15 border-y border-fg/15">
              {EARLY_JOBS.map((job) => (
                <li key={job.company} className="grid gap-1 py-4 md:grid-cols-12 md:gap-4">
                  <span className="mono-label opacity-50 md:col-span-2">{job.period}</span>
                  <span className="md:col-span-4">
                    <span className="block text-sm font-medium">{t(job.title)}</span>
                    <span className="block text-xs opacity-60">{job.company}</span>
                  </span>
                  {job.summary && <span className="text-sm leading-relaxed opacity-70 md:col-span-6">{t(job.summary)}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna lateral */}
        <div data-side className="space-y-14 md:col-span-4 md:col-start-9 md:border-l md:border-fg/20 md:pl-10">
          <section aria-labelledby="edu-title">
            <h2 id="edu-title" className="brand-title mb-6 text-2xl">{t(COPY.about.education)}</h2>
            <ul className="space-y-5">
              {STUDIES.map((s) => (
                <li key={`${s.school}-${s.title.es}`} data-reveal-item>
                  <p className="brand-title text-xs leading-relaxed">{t(s.title)}</p>
                  <p className="mt-1 text-sm opacity-70">
                    {s.school} <span className="mx-1 opacity-40">|</span> {s.period}
                  </p>
                  {s.note && <p className="mt-0.5 text-xs opacity-50">{t(s.note)}</p>}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cert-title">
            <h2 id="cert-title" className="brand-title mb-6 text-2xl">{t(COPY.about.certifications)}</h2>
            <ul className="flex flex-col gap-4">
              {UX_PM_BADGES.map((b) => (
                <UxPmBadge key={b.level} {...b} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="skills-title">
            <h2 id="skills-title" className="brand-title mb-6 text-2xl">{t(COPY.about.skills)}</h2>
            <ul className="space-y-2">
              {SKILLS.map((skill) => (
                <li key={skill.es} data-reveal-item className="flex items-center gap-3 text-sm">
                  <span className="h-1 w-1 rounded-full bg-fg/60" aria-hidden="true" />
                  {t(skill)}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tools-title" className="space-y-6">
            <h2 id="tools-title" className="brand-title text-2xl">{t(COPY.about.tools)}</h2>
            {TOOL_GROUPS.map((group, gi) => (
              <div key={group.title.es}>
                <p className="mono-label mb-3 opacity-50">{t(group.title)}</p>
                <ul className="flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <li
                      key={tool}
                      className={`border px-3 py-1.5 text-sm transition-colors hover:border-signal hover:text-signal ${gi === 0 ? 'border-signal/60' : 'border-fg/25'}`}
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
    </ToneSection>
  )
}
