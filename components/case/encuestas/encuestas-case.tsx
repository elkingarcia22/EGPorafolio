'use client'

import { useMemo, useRef } from 'react'
import { Chapter, type ChapterMeta } from '@/components/case/chapter'
import { ChapterNav } from '@/components/case/chapter-nav'
import { NextProject } from '@/components/case/next-project'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import type { Project } from '@/lib/content/projects'
import { useReveal } from '@/components/case/barberlytics/use-reveal'
import { EncuestasHero } from './hero'
import { CycleDots } from './dots'
import { AuditPatterns } from './patterns'
import { PromiseIdea } from './idea'
import { IterationSketches } from './sketches'
import { SurveyForm } from './form'
import { SurveyAi } from './ai'
import { SurveyImpact } from './impact'
import { SurveyDemo } from './demo'
import './encuestas.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'forma' | 'ia' | 'impacto' | 'demo'

const CHAPTERS: readonly { id: ChapterKey; tone: 'dark' | 'light'; Content: React.ComponentType }[] = [
  { id: 'puntos', tone: 'dark', Content: CycleDots },
  { id: 'patrones', tone: 'dark', Content: AuditPatterns },
  { id: 'idea', tone: 'light', Content: PromiseIdea },
  { id: 'bocetos', tone: 'light', Content: IterationSketches },
  { id: 'forma', tone: 'light', Content: SurveyForm },
  { id: 'ia', tone: 'dark', Content: SurveyAi },
  { id: 'impacto', tone: 'light', Content: SurveyImpact },
  { id: 'demo', tone: 'dark', Content: SurveyDemo },
]

/** Caso Encuestas: portada, índice fijo y los ocho capítulos, con el siguiente proyecto al final. */
export function EncuestasCase({ next }: { next: Project }) {
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
      <EncuestasHero />
      <div className="grid gap-10 px-[var(--gutter)] md:grid-cols-12">
        <aside className="md:col-span-3">
          <ChapterNav chapters={chapters} label={t(ENCUESTAS_CASE.title)} />
        </aside>
        <div className="min-w-0 md:col-span-9">
          {chapters.map((meta, i) => {
            const { Content } = CHAPTERS[i]
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
