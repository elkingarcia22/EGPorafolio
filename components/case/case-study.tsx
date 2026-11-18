'use client'

import { useMemo } from 'react'
import { CaseHero } from './case-hero'
import { Chapter, type ChapterMeta } from './chapter'
import { ChapterNav } from './chapter-nav'
import { Problem } from './problem'
import { Research } from './research'
import { Idea, Sketches } from './idea-sketches'
import { FormCompare } from './form-compare'
import { AiLog, Results } from './ai-results'
import { NextProject } from './next-project'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

/**
 * Caso de estudio con la narrativa del sitio: empieza oscuro (ruido:
 * problema e investigación) y se aclara hacia la señal (idea, forma, resultados).
 */
export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const { t } = useLocale()
  const c = COPY.case.chapters

  const chapters: readonly ChapterMeta[] = useMemo(
    () => [
      { id: 'ruido', index: '01', title: t(c.problem), tone: 'dark' },
      { id: 'frecuencia', index: '02', title: t(c.research), tone: 'dark' },
      { id: 'idea', index: '03', title: t(c.idea), tone: 'light' },
      { id: 'bocetos', index: '04', title: t(c.sketches), tone: 'light' },
      { id: 'forma', index: '05', title: t(c.form), tone: 'light' },
      { id: 'ia', index: '06', title: t(c.ai), tone: 'dark' },
      { id: 'transmision', index: '07', title: t(c.results), tone: 'light' },
    ],
    [t, c],
  )

  const content = [Problem, Research, Idea, Sketches, FormCompare, AiLog, Results]

  return (
    <article>
      <CaseHero project={project} />
      <div className="grid gap-10 px-[var(--gutter)] md:grid-cols-12">
        <aside className="md:col-span-3">
          <ChapterNav chapters={chapters} label={t(project.title)} />
        </aside>
        <div className="md:col-span-9">
          {chapters.map((meta, i) => {
            const Content = content[i]
            return (
              <Chapter key={meta.id} meta={meta}>
                <Content project={project} />
              </Chapter>
            )
          })}
        </div>
      </div>
      <NextProject project={next} />
    </article>
  )
}
