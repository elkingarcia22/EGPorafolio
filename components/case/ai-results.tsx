'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

/** 06 · IA en el proceso: registro tipo terminal de prompts y resultados. */
export function AiLog({ project }: { project: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 80%' } })
        tl.from(step.querySelector('[data-prompt]'), { autoAlpha: 0, x: -12, duration: 0.5, ease: 'expo.out' })
          .from(step.querySelector('[data-bar-fill]'), { scaleX: 0, duration: 0.9, ease: 'power2.inOut' })
          .from(step.querySelector('[data-output]'), { autoAlpha: 0, y: 8, duration: 0.5, ease: 'expo.out' })
      })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div ref={ref} className="space-y-10">
      <p className="max-w-2xl text-[clamp(1.3rem,1rem+1.2vw,2rem)] font-light leading-snug">{t(project.ai.intro)}</p>
      <ol className="border border-fg/20 font-mono text-sm">
        {project.ai.steps.map((step, i) => (
          <li key={i} data-step className="border-b border-fg/15 p-5 last:border-b-0">
            <p data-prompt className="leading-relaxed">
              <span className="mr-2 text-signal">{step.tool} ▸</span>
              <span className="opacity-80">{t(step.prompt)}</span>
            </p>
            <span className="my-4 block h-px bg-fg/15" aria-hidden="true">
              <span data-bar-fill className="block h-px origin-left bg-signal" />
            </span>
            <p data-output className="flex items-start gap-2">
              <span className="opacity-40">↳</span>
              <span>{t(step.output)}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Contador que sube al entrar en pantalla. */
function Counter({ value, prefix = '', suffix }: { value: number; prefix?: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { reducedMotion } = useA11y()

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const state = { v: 0 }
    const tween = gsap.to(state, {
      v: value,
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(state.v)}${suffix}`
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, prefix, suffix, reducedMotion])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

/** 07 · Transmisión: métricas de resultado y aprendizajes. */
export function Results({ project }: { project: Project }) {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <dl className="grid gap-10 sm:grid-cols-3">
        {project.results.metrics.map((m) => (
          <div key={m.label.es} className="border-t-[6px] border-fg pt-5">
            <dd className="text-[clamp(3rem,1rem+5vw,6rem)] font-light leading-none" style={{ color: `rgb(${project.accent})` }}>
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} />
            </dd>
            <dt className="mt-3 text-sm opacity-70">{t(m.label)}</dt>
          </div>
        ))}
      </dl>
      <div>
        <p className="mono-label mb-6 opacity-50">{t(COPY.case.learnings)}</p>
        <ul className="space-y-4">
          {project.results.learnings.map((l, i) => (
            <li key={i} className="flex gap-5">
              <span className="brand-bar shrink-0" aria-hidden="true" />
              <p className="text-xl font-light leading-snug">{t(l)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
