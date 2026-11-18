'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

const NOTE_COLORS = ['#f4e27a', '#f2b8c6', '#a9d8f0', '#c4e8b0']

function scatter(seed: number) {
  const r = (n: number) => {
    const x = Math.sin(seed * 91.7 + n * 13.3) * 10000
    return x - Math.floor(x) - 0.5
  }
  return { x: r(1) * 420, y: r(2) * 260, rotate: r(3) * 50 }
}

/**
 * 02 · Frecuencia: tablero de afinidad. Las notas empiezan desordenadas
 * (ruido) y con el scroll se agrupan en clusters (patrón encontrado).
 */
export function Research({ project }: { project: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const notes = gsap.utils.toArray<HTMLElement>('[data-note]')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '[data-board]', start: 'top 80%', end: 'center 45%', scrub: 0.8 },
      })
      notes.forEach((note, i) => {
        const s = scatter(i + 1)
        tl.fromTo(
          note,
          { x: s.x, y: s.y, rotate: s.rotate },
          { x: 0, y: 0, rotate: (i % 3) - 1, ease: 'power3.out', duration: 1 },
          i * 0.03,
        )
      })
      tl.fromTo('[data-cluster-title]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4 }, '>-0.3')
      gsap.from('[data-insight]', {
        autoAlpha: 0,
        x: -20,
        stagger: 0.15,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-insights]', start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  let noteIndex = 0

  return (
    <div ref={ref} className="space-y-16">
      <p className="mono-label max-w-xl leading-relaxed opacity-70">{t(project.research.method)}</p>

      <div data-board className="relative grid gap-8 overflow-visible rounded-sm bg-fg/[0.04] p-6 md:grid-cols-3 md:p-10">
        {project.research.clusters.map((cluster, ci) => (
          <div key={ci}>
            <p data-cluster-title className="brand-title mb-4 border-b border-fg/30 pb-2 text-xs">
              {t(cluster.title)}
            </p>
            <ul className="flex flex-wrap gap-3">
              {cluster.notes.map((note) => {
                const i = noteIndex++
                return (
                  <li
                    key={i}
                    data-note
                    className="w-[8.5rem] p-3 text-sm leading-snug text-ink shadow-md"
                    style={{ background: NOTE_COLORS[ci % NOTE_COLORS.length] }}
                  >
                    {t(note)}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div data-insights>
        <p className="mono-label mb-6 opacity-50">{t(COPY.case.insights)}</p>
        <ol className="space-y-6">
          {project.research.insights.map((insight, i) => (
            <li key={i} data-insight className="flex gap-6">
              <span className="mono-label mt-2 shrink-0" style={{ color: `rgb(${project.accent})` }}>
                0{i + 1}
              </span>
              <p className="text-[clamp(1.25rem,1rem+1vw,1.9rem)] font-light leading-snug">{t(insight)}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
