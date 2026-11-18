'use client'

import { useEffect, useRef } from 'react'
import { MockSketch } from '@/components/mock/mock-sketch'
import { RevealWords } from '@/components/ui/reveal-words'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

/** 03 · La idea: la pregunta "¿Cómo podríamos…?" y los principios. */
export function Idea({ project }: { project: Project }) {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <div>
        <p className="mono-label mb-6 opacity-50">{t(COPY.case.hmw)}</p>
        <RevealWords text={t(project.idea.hmw)} className="text-[clamp(1.9rem,1rem+3vw,4rem)] font-light leading-[1.08] tracking-tight" />
      </div>
      <ul className="grid gap-px bg-fg/15 md:grid-cols-3">
        {project.idea.principles.map((p, i) => (
          <li key={i} className="group bg-bg p-6 transition-colors duration-500">
            <span className="mono-label opacity-50">P{i + 1}</span>
            <h3 className="brand-title mt-6 text-sm">{t(p.title)}</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-70">{t(p.body)}</p>
            <span
              className="mt-6 block h-0.5 w-8 origin-left transition-transform duration-500 ease-expo group-hover:scale-x-[3]"
              style={{ background: `rgb(${project.accent})` }}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** 04 · Bocetos: tres exploraciones que se dibujan solas; la elegida lleva sello. */
export function Sketches({ project }: { project: Project }) {
  const { t, locale } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const strokes = el.querySelectorAll('[data-sketch-stroke]')
    if (reducedMotion) {
      gsap.set(strokes, { strokeDashoffset: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-sheet]').forEach((sheet) => {
        gsap.fromTo(
          sheet.querySelectorAll('[data-sketch-stroke]'),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: { trigger: sheet, start: 'top 85%', end: 'bottom 55%', scrub: true },
          },
        )
      })
      gsap.from('[data-stamp]', {
        scale: 2.4,
        autoAlpha: 0,
        rotate: -30,
        duration: 0.5,
        ease: 'back.out(2.5)',
        scrollTrigger: { trigger: '[data-stamp]', start: 'top 70%' },
      })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  const variants = [1, 2, 0]
  const isMobile = project.mock === 'mobile'

  return (
    <div ref={ref} className="space-y-10">
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-3' : 'md:grid-cols-3'}`}>
        {variants.map((variant, i) => {
          const chosen = variant === 0
          return (
            <figure key={variant} data-sheet className="relative bg-[#f7f5ef] p-4 text-ink shadow-[0_1px_0_rgba(0,0,0,.08),0_12px_30px_-12px_rgba(0,0,0,.25)]" style={{ rotate: `${(i - 1) * 1.2}deg` }}>
              <MockSketch kind={project.mock} variant={variant} className="w-full" />
              <figcaption className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                  {locale === 'es' ? 'Exploración' : 'Exploration'} {String.fromCharCode(65 + i)}
                </span>
                <span className="text-xs italic text-signal">{t(project.sketches.notes[i] ?? project.sketches.notes[0])}</span>
              </figcaption>
              {chosen && (
                <span
                  data-stamp
                  className="absolute -right-3 -top-3 rotate-[-8deg] border-2 border-signal bg-[#f7f5ef] px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-signal"
                >
                  ✓ {locale === 'es' ? 'Elegida' : 'Chosen'}
                </span>
              )}
            </figure>
          )
        })}
      </div>
      <p className="max-w-2xl leading-relaxed opacity-75">{t(project.sketches.caption)}</p>
    </div>
  )
}
