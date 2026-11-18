'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

/** 01 · El ruido: contexto, voces de usuarios (con "interferencia") y datos del dolor. */
export function Problem({ project }: { project: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-quote]').forEach((q, i) => {
        gsap.fromTo(
          q,
          { autoAlpha: 0, x: i % 2 ? 40 : -40, skewX: i % 2 ? -8 : 8, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            x: 0,
            skewX: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: q, start: 'top 85%' },
          },
        )
      })
      gsap.from('[data-stat]', {
        autoAlpha: 0,
        y: 30,
        stagger: 0.12,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-stats]', start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div ref={ref} className="space-y-16">
      <p className="max-w-3xl text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-snug">{t(project.problem.context)}</p>

      <div>
        <p className="mono-label mb-6 opacity-50">{t(COPY.case.voices)}</p>
        <ul className="grid gap-4 md:grid-cols-2">
          {project.problem.quotes.map((q, i) => (
            <li
              key={i}
              data-quote
              className={`border border-fg/20 p-6 ${i % 2 ? 'md:translate-y-10' : ''}`}
            >
              <blockquote className="text-lg leading-relaxed">{t(q.text)}</blockquote>
              <p className="mono-label mt-4 opacity-50">— {t(q.who)}</p>
            </li>
          ))}
        </ul>
      </div>

      <dl data-stats className="grid grid-cols-1 gap-8 border-t border-fg/15 pt-10 sm:grid-cols-3">
        {project.problem.stats.map((s) => (
          <div key={s.value} data-stat>
            <dt className="order-2 mt-2 text-sm opacity-60">{t(s.label)}</dt>
            <dd className="text-[clamp(2.5rem,1rem+4vw,4.5rem)] font-light leading-none" style={{ color: `rgb(${project.accent})` }}>
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
