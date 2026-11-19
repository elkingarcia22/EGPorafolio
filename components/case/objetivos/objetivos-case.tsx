'use client'

import { useMemo, useRef } from 'react'
import { Chapter, type ChapterMeta } from '@/components/case/chapter'
import { ChapterNav } from '@/components/case/chapter-nav'
import { NextProject } from '@/components/case/next-project'
import { useReveal } from '@/components/case/barberlytics/use-reveal'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import type { Project } from '@/lib/content/projects'
import { ObjetivosHero } from './objetivos-hero'
import { LifecycleRing } from './lifecycle-ring'
import { ObjetivosPatterns } from './reference-deck'
import { ObjetivosIdea } from './objetivos-idea'
import { ObjetivosSketches } from './objetivos-sketches'
import { ObjetivosForm } from './objetivos-form'
import { ObjetivosAi } from './objetivos-ai'
import { ObjetivosImpact } from './objetivos-impact'
import { ObjetivosDemo } from './objetivos-demo'
import './objetivos.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'forma' | 'ia' | 'impacto' | 'demo'

const CHAPTERS: readonly { id: ChapterKey; tone: 'dark' | 'light' }[] = [
  { id: 'puntos', tone: 'dark' },
  { id: 'patrones', tone: 'dark' },
  { id: 'idea', tone: 'light' },
  { id: 'bocetos', tone: 'light' },
  { id: 'forma', tone: 'light' },
  { id: 'ia', tone: 'dark' },
  { id: 'impacto', tone: 'light' },
  { id: 'demo', tone: 'dark' },
]

/** 01 · Los puntos: de dónde partía el producto. */
function ObjetivosDots() {
  const { t } = useLocale()
  const { dots } = OBJ_CASE
  return (
    <div>
      <p data-reveal="mask" className="max-w-[22ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">{t(dots.kicker)}</p>
      <p data-reveal className="mb-14 mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(dots.lead)}</p>
      <LifecycleRing />
      <ol className="mt-14 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-3">
        {dots.seen.map((s, i) => (
          <li key={s.title.es} data-reveal className="bg-bg p-6">
            <span className="mono-label text-signal">0{i + 1}</span>
            <p className="mt-3 text-lg leading-snug">{t(s.title)}</p>
            <p className="mt-3 text-sm leading-relaxed opacity-70">{t(s.body)}</p>
          </li>
        ))}
      </ol>
      <dl className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {dots.facts.map((s) => (
          <div key={s.label.es} data-reveal>
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span data-count={s.value} className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{s.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const CONTENT: Record<ChapterKey, React.ComponentType> = {
  puntos: ObjetivosDots,
  patrones: ObjetivosPatterns,
  idea: ObjetivosIdea,
  bocetos: ObjetivosSketches,
  forma: ObjetivosForm,
  ia: ObjetivosAi,
  impacto: ObjetivosImpact,
  demo: ObjetivosDemo,
}

/** Caso Objetivos: portada, índice fijo, los ocho capítulos y el siguiente proyecto. */
export function ObjetivosCase({ next }: { next: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)
  const c = COPY.case.chapters

  const chapters: readonly ChapterMeta[] = useMemo(() => {
    const titles: Record<ChapterKey, string> = {
      puntos: t(c.problem),
      patrones: t(c.research),
      idea: t(c.idea),
      bocetos: t(c.sketches),
      forma: t(c.form),
      ia: t(c.ai),
      impacto: t(c.results),
      demo: t({ es: 'Demo', en: 'Demo' }),
    }
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: ch.tone }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      <ObjetivosHero />
      <div className="grid gap-10 px-[var(--gutter)] md:grid-cols-12">
        <aside className="md:col-span-3">
          <ChapterNav chapters={chapters} label={t(OBJ_CASE.title)} />
        </aside>
        <div className="min-w-0 md:col-span-9">
          {chapters.map((meta) => {
            const Content = CONTENT[meta.id as ChapterKey]
            return (
              <Chapter key={meta.id} meta={meta}>
                <Content />
              </Chapter>
            )
          })}
        </div>
      </div>
      <NextProject project={next} />
    </article>
  )
}
