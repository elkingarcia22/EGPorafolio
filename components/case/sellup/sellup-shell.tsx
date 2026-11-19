'use client'

import { useMemo, useRef } from 'react'
import { Chapter, type ChapterMeta } from '@/components/case/chapter'
import { ChapterNav } from '@/components/case/chapter-nav'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { useReveal } from '../barberlytics/use-reveal'
import { NextProject } from '@/components/case/next-project'
import { PROJECTS } from '@/lib/content/projects'

export type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'forma' | 'ia' | 'impacto'

const CHAPTERS: readonly { id: ChapterKey; tone: 'dark' | 'light' }[] = [
  { id: 'puntos', tone: 'dark' },
  { id: 'patrones', tone: 'dark' },
  { id: 'idea', tone: 'dark' },
  { id: 'bocetos', tone: 'dark' },
  { id: 'forma', tone: 'dark' },
  { id: 'ia', tone: 'dark' },
  { id: 'impacto', tone: 'dark' },
]

export interface NextLink {
  slug: string
  title: L
}

interface SellUpShellProps {
  title: string
  hero: React.ReactNode
  content: Record<ChapterKey, React.ComponentType>
  next: NextLink
}

/** Armazón del caso SellUp: portada, índice fijo, los 8 capítulos y el salto al siguiente proyecto. */
export function SellUpShell({ title, hero, content, next }: SellUpShellProps) {
  const nextProject = PROJECTS.find((p) => p.slug === next.slug)
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
    }
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: ch.tone }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      {hero}
      <div className="grid gap-10 px-[var(--gutter)] lg:grid-cols-12">
        {/* En tableta el índice lateral se oculta y el capítulo usa todo el ancho, como en teléfono. */}
        <aside className="hidden lg:col-span-3 lg:block">
          <ChapterNav chapters={chapters} label={title} />
        </aside>
        <div className="min-w-0 lg:col-span-9">
          {chapters.map((meta) => {
            const Content = content[meta.id as ChapterKey]
            return (
              <Chapter key={meta.id} meta={meta}>
                <Content />
              </Chapter>
            )
          })}
        </div>
      </div>
      {nextProject && <NextProject project={nextProject} />}
    </article>
  )
}
