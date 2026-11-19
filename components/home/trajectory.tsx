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
    <li data-badge className="flex items-center gap-3">
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
      /** Dispara una animación una sola vez cuando `trigger` entra en pantalla. */
      const onEnter = (trigger: Element, start = 'top 85%') => ({ trigger, start, toggleActions: 'play none none none' })

      // Títulos: se revelan de abajo hacia arriba detrás de una máscara.
      gsap.utils.toArray<HTMLElement>('[data-reveal-title]').forEach((title) => {
        gsap.from(title, { yPercent: 110, duration: 1, ease: 'expo.out', scrollTrigger: onEnter(title, 'top 90%') })
      })

      // Línea de tiempo: se dibuja con el scroll.
      gsap.fromTo('[data-timeline-line]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: true },
      })

      // Cada empleo: el punto late, el bloque sube, los cargos entran en
      // cascada, la barra crece y los temas aparecen uno a uno.
      gsap.utils.toArray<HTMLElement>('[data-job]').forEach((job) => {
        const q = gsap.utils.selector(job)
        gsap.timeline({ scrollTrigger: onEnter(job, 'top 82%') })
          .from(q('[data-job-dot]'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
          .from(q('[data-job-head]'), { autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out' }, '<0.05')
          .from(q('[data-job-bar]'), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.7, ease: 'expo.out' }, '<0.15')
          .from(q('[data-job-role]'), { autoAlpha: 0, x: -24, duration: 0.6, ease: 'expo.out', stagger: 0.08 }, '<0.1')
          .from(q('[data-job-summary]'), { autoAlpha: 0, y: 16, duration: 0.8, ease: 'expo.out' }, '<0.15')
          .from(q('[data-job-chip]'), { autoAlpha: 0, y: 10, scale: 0.85, duration: 0.45, ease: 'back.out(2)', stagger: 0.05 }, '<0.2')
      })

      // Trayectoria previa: las filas se trazan y entran una tras otra.
      gsap.from('[data-early-row]', {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: onEnter(el.querySelector('[data-early]') ?? el),
      })

      // Columna lateral: educación, habilidades en cascada.
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-reveal-item]'), {
          autoAlpha: 0,
          x: -18,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: onEnter(group),
        })
      })

      // Sellos UX-PM: aparecen con un pequeño giro, uno tras otro.
      gsap.from('[data-badge]', {
        autoAlpha: 0,
        scale: 0.6,
        rotate: -25,
        duration: 0.7,
        ease: 'back.out(2.2)',
        stagger: 0.12,
        scrollTrigger: onEnter(el.querySelector('[data-badges]') ?? el),
      })

      // Herramientas: los chips caen en su lugar, grupo por grupo.
      gsap.utils.toArray<HTMLElement>('[data-tool-group]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-tool]'), {
          autoAlpha: 0,
          y: -14,
          scale: 0.9,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.05,
          scrollTrigger: onEnter(group, 'top 90%'),
        })
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
          <h2 className="brand-title mb-10 overflow-hidden text-3xl md:text-4xl">
            <span data-reveal-title className="block">{t(COPY.about.experience)}</span>
          </h2>
          <ol data-timeline className="relative space-y-14 pl-8">
            <span data-timeline-line className="absolute left-[3px] top-2 h-full w-px origin-top bg-fg/40" aria-hidden="true" />
            {JOBS.map((job) => (
              <li key={job.company} data-job className="relative">
                <span data-job-dot className="absolute -left-8 top-2 h-[7px] w-[7px] rounded-full bg-fg" aria-hidden="true" />
                <div data-job-head>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="brand-title text-base">{job.company}</h3>
                    <span className="mono-label opacity-60">{job.period}</span>
                  </div>
                  <p className="mt-1 text-xs opacity-50">{t(job.location)}</p>
                </div>

                <ul className="relative mt-4 space-y-1.5 pl-4">
                  <span data-job-bar className="absolute inset-y-0 left-0 w-[3px] bg-fg" aria-hidden="true" />
                  {job.roles.map((role) => (
                    <li key={role.period} data-job-role className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
                      <span className="font-medium">{t(role.title)}</span>
                      <span className="mono-label opacity-50">{role.period}</span>
                    </li>
                  ))}
                </ul>

                <p data-job-summary className="mt-4 max-w-xl leading-relaxed opacity-75">{t(job.summary)}</p>
                {job.highlights && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {job.highlights.map((h) => (
                      <li key={h.es} data-job-chip className="border border-fg/20 px-2 py-0.5 text-xs opacity-80">
                        {t(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          {/* Trayectoria previa */}
          <div data-early className="mt-20">
            <h3 className="brand-title mb-6 overflow-hidden text-sm opacity-70">
              <span data-reveal-title className="block">{t(COPY.about.earlier)}</span>
            </h3>
            <ul className="divide-y divide-fg/15 border-y border-fg/15">
              {EARLY_JOBS.map((job) => (
                <li key={job.company} data-early-row className="grid gap-1 py-4 md:grid-cols-12 md:gap-4">
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
          <section aria-labelledby="edu-title" data-reveal-group>
            <h2 id="edu-title" className="brand-title mb-6 overflow-hidden text-2xl">
              <span data-reveal-title className="block">{t(COPY.about.education)}</span>
            </h2>
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
            <h2 id="cert-title" className="brand-title mb-6 overflow-hidden text-2xl">
              <span data-reveal-title className="block">{t(COPY.about.certifications)}</span>
            </h2>
            <ul data-badges className="flex flex-col gap-4">
              {UX_PM_BADGES.map((b) => (
                <UxPmBadge key={b.level} {...b} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="skills-title" data-reveal-group>
            <h2 id="skills-title" className="brand-title mb-6 overflow-hidden text-2xl">
              <span data-reveal-title className="block">{t(COPY.about.skills)}</span>
            </h2>
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
            <h2 id="tools-title" className="brand-title overflow-hidden text-2xl">
              <span data-reveal-title className="block">{t(COPY.about.tools)}</span>
            </h2>
            {TOOL_GROUPS.map((group, gi) => (
              <div key={group.title.es} data-tool-group>
                <p className="mono-label mb-3 opacity-50">{t(group.title)}</p>
                <ul className="flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <li
                      key={tool}
                      data-tool
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
