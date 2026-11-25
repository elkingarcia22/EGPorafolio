'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { backdropQuiet } from './backdrop-journey'
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

/** Mientras se lee la trayectoria, el fondo de red se calma (sin apagarse del todo) */
const QUIET_LEVEL = 0.75
/** Panel de vidrio oscuro, como las tarjetas de proyecto */
const GLASS = 'rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm'

/**
 * Trayectoria: la hoja de vida en la red. La fibra que viene de Proceso llega
 * a «03 · Trayectoria»; la experiencia es una fibra vertical que se dibuja con
 * el scroll —su punta brilla— y cada empleo es una neurona que se enciende al
 * llegar la señal. Lo demás (educación, certificaciones, habilidades,
 * herramientas) va en la misma columna, en paneles de vidrio que unen dos
 * temas, y de cada panel sale una fibra por un costado hacia el agente (ver
 * <ConvergeFibers>).
 */
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

      // Línea de tiempo: la fibra se dibuja con el scroll y su punta brilla donde va la señal.
      const head = el.querySelector<HTMLElement>('[data-timeline-head]')
      gsap.fromTo('[data-timeline-line]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-timeline]',
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: true,
          onUpdate: (self) => {
            if (!head) return
            head.style.top = `${self.progress * 100}%`
            head.style.opacity = self.progress > 0.01 && self.progress < 0.99 ? '1' : '0'
          },
        },
      })
      // El fondo se calma mientras se lee.
      ScrollTrigger.create({
        trigger: el,
        start: 'top 70%',
        end: 'bottom 30%',
        onToggle: (self) => backdropQuiet.set('about', self.isActive ? QUIET_LEVEL : 0),
      })

      // Cada empleo: el punto late, el bloque sube, los cargos entran en
      // cascada, la barra crece y los temas aparecen uno a uno.
      gsap.utils.toArray<HTMLElement>('[data-job]').forEach((job) => {
        const q = gsap.utils.selector(job)
        // El punto se enciende en azul cuando la señal de la línea llega a este empleo.
        ScrollTrigger.create({ trigger: job, start: 'top 62%', toggleClass: { targets: q('[data-job-dot]'), className: 'is-lit' } })
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
    return () => {
      backdropQuiet.set('about', 0)
      ctx.revert()
    }
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" id="about" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div ref={ref} className="mx-auto flex max-w-6xl flex-col items-center gap-16">
        <div className="flex justify-center">
          {/* La fibra que sale del final de Proceso llega a esta etiqueta */}
          <SectionLabel index="03" thread={false} fiberTo="proceso">{t(COPY.about.label)}</SectionLabel>
        </div>

        {/* Experiencia */}
        <div className="w-full max-w-3xl">
          <h2 className="brand-title mb-10 overflow-hidden text-center text-3xl md:text-4xl">
            <span data-reveal-title className="block">{t(COPY.about.experience)}</span>
          </h2>
          <ol data-timeline data-converge-from="right" className="relative space-y-14 pl-8">
            {/* La fibra: rastro tenue, lo ya recorrido en blanco y la punta que brilla */}
            <span className="absolute left-[3px] top-2 h-full w-px bg-white/10" aria-hidden="true" />
            <span data-timeline-line className="absolute left-[3px] top-2 h-full w-px origin-top bg-gradient-to-b from-white/30 via-white/70 to-white shadow-[0_0_8px_rgb(255_255_255/0.45)]" aria-hidden="true" />
            <span
              data-timeline-head
              aria-hidden="true"
              className="pointer-events-none absolute left-[3.5px] top-2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_0_5px_rgb(255_255_255/0.08),0_0_16px_4px_rgb(255_255_255/0.7)]"
            />
            {JOBS.map((job) => (
              <li key={job.company} data-job className="relative">
                <span data-job-dot className="absolute -left-[33px] top-7 h-[9px] w-[9px] rounded-full border border-white/40 bg-[rgb(var(--void))] transition-[background-color,box-shadow,transform,border-color] duration-500 ease-expo [&.is-lit]:scale-125 [&.is-lit]:border-white [&.is-lit]:bg-white [&.is-lit]:shadow-[0_0_0_5px_rgb(255_255_255/0.1),0_0_18px_4px_rgb(255_255_255/0.5)]" aria-hidden="true" />
                <div className={`${GLASS} p-6 transition-[border-color,background-color] duration-500 ease-expo hover:border-white/20 hover:bg-white/[0.05] md:p-7`}>
                <div data-job-head>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="brand-title text-base">{job.company}</h3>
                    <span className="mono-label opacity-60">{job.period}</span>
                  </div>
                  <p className="mt-1 text-xs opacity-50">{t(job.location)}</p>
                </div>

                <ul className="relative mt-4 space-y-1.5 pl-4">
                  <span data-job-bar className="absolute inset-y-0 left-0 w-[2px] rounded-full bg-white/50" aria-hidden="true" />
                  {job.roles.map((role) => (
                    <li key={role.period} data-job-role className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
                      <span className="font-medium">{t(role.title)}</span>
                      <span className="mono-label opacity-50">{role.period}</span>
                    </li>
                  ))}
                </ul>

                <p data-job-summary className="mt-4 max-w-xl leading-relaxed text-paper/70">{t(job.summary)}</p>
                {job.highlights && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {job.highlights.map((h) => (
                      <li key={h.es} data-job-chip className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-paper/80">
                        {t(h)}
                      </li>
                    ))}
                  </ul>
                )}
                </div>
              </li>
            ))}
          </ol>

          {/* Trayectoria previa */}
          <div data-early className="mt-20">
            <h3 className="brand-title mb-6 overflow-hidden text-center text-sm opacity-70">
              <span data-reveal-title className="block">{t(COPY.about.earlier)}</span>
            </h3>
            <ul data-converge-from="left" className={`${GLASS} divide-y divide-white/10 px-6`}>
              {EARLY_JOBS.map((job) => (
                <li key={job.company} data-early-row className="grid gap-1 py-4 md:grid-cols-12 md:gap-4">
                  <span className="mono-label flex items-center gap-2 opacity-50 md:col-span-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_8px_rgb(255_255_255/0.5)]" aria-hidden="true" />
                    {job.period}
                  </span>
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

        {/* Formación y herramientas: una sola columna, como la experiencia. Cada caja une dos temas
            y de cada una sale una fibra hacia el agente (ver <ConvergeFibers>) */}
        <div data-side className="flex w-full max-w-3xl flex-col gap-6">
          {/* Educación y certificaciones */}
          <section aria-labelledby="edu-title" data-reveal-group data-converge-from="right" className={`${GLASS} p-6 md:p-8`}>
            <h2 id="edu-title" className="brand-title mb-6 overflow-hidden text-2xl">
              <span data-reveal-title className="block">{t(COPY.about.education)}</span>
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2">
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
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 id="cert-title" className="mono-label mb-4 opacity-60">{t(COPY.about.certifications)}</h3>
              <ul data-badges className="flex flex-wrap gap-x-8 gap-y-4" aria-labelledby="cert-title">
                {UX_PM_BADGES.map((b) => (
                  <UxPmBadge key={b.level} {...b} />
                ))}
              </ul>
            </div>
          </section>

          {/* Tecnología y habilidades */}
          <section aria-labelledby="tools-title" data-converge-from="left" className={`${GLASS} space-y-6 p-6 md:p-8`}>
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
                      className={`rounded-full border px-3 py-1.5 text-sm transition-[border-color,background-color,color] duration-300 hover:border-white/50 hover:bg-white/10 hover:text-paper ${gi === 0 ? 'border-signal/60 bg-signal/10 text-paper' : 'border-white/15 bg-white/[0.03] text-paper/80'}`}
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div data-reveal-group className="border-t border-white/10 pt-6">
              <h3 id="skills-title" className="mono-label mb-4 opacity-60">{t(COPY.about.skills)}</h3>
              <ul className="grid gap-2 sm:grid-cols-2" aria-labelledby="skills-title">
                {SKILLS.map((skill) => (
                  <li key={skill.es} data-reveal-item className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_8px_rgb(255_255_255/0.45)]" aria-hidden="true" />
                    {t(skill)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </ToneSection>
  )
}
