'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterEntry, type ChapterMeta } from '@/components/case/chapter'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { ScrollTrigger } from '@/lib/motion'
import { ChapterNav } from '@/components/case/chapter-nav'
import { CaseLead } from '@/components/case/case-lead'
import { NextProject } from '@/components/case/next-project'
import { useReveal } from '@/components/case/barberlytics/use-reveal'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import type { Project } from '@/lib/content/projects'
import { ObjetivosHero } from './objetivos-hero'
import { DotsScene } from './dots-scene'
import { ObjetivosPatterns } from './reference-deck'
import { ObjetivosIdea } from './objetivos-idea'
import { ObjetivosSketches } from './objetivos-sketches'
import { ObjetivosForm } from './objetivos-form'
import { ObjetivosAi } from './objetivos-ai'
import { ObjetivosImpact } from './objetivos-impact'
import { ObjetivosDemo } from './objetivos-demo'
import './objetivos.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'forma' | 'ia' | 'impacto' | 'demo'

/** Cuánto se calma la red de fondo: en la portada se ve; en los capítulos, deja leer */
const QUIET = { hero: 0.2, chapters: 0.75 }

/** Todos sobre la misma red de fondo; cada uno llega de una manera distinta */
const CHAPTERS: readonly { id: ChapterKey; entry: ChapterEntry }[] = [
  { id: 'puntos', entry: 'bloom' },
  { id: 'patrones', entry: 'converge' },
  { id: 'idea', entry: 'thread' },
  { id: 'bocetos', entry: 'warp' },
  { id: 'forma', entry: 'converge' },
  { id: 'ia', entry: 'bloom' },
  { id: 'impacto', entry: 'warp' },
  { id: 'demo', entry: 'thread' },
]

/** 01 · Los puntos: una escena con cámara que conecta los momentos del ciclo. */
function ObjetivosDots() {
  const { t } = useLocale()
  return (
    <div>
      <CaseLead>{t(OBJ_CASE.dots.lead)}</CaseLead>
      <DotsScene />
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

  // La red de fondo se calma mientras se leen los capítulos.
  useEffect(() => {
    backdropQuiet.set('case', QUIET.hero)
    const trigger = ScrollTrigger.create({
      trigger: `#${CHAPTERS[0].id}`,
      endTrigger: `#${CHAPTERS[CHAPTERS.length - 1].id}`,
      start: 'top 85%',
      end: 'bottom 40%',
      onToggle: (self) => backdropQuiet.set('case', self.isActive ? QUIET.chapters : QUIET.hero),
    })
    return () => {
      trigger.kill()
      backdropQuiet.set('case', 0)
    }
  }, [])
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
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: 'dark' as const, entry: ch.entry }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      {/* La misma red de fondo del inicio, de punta a punta: sin cortes entre capítulos */}
      <NeuralBackdrop />
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
