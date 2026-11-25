'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterEntry, type ChapterMeta } from '@/components/case/chapter'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { ScrollTrigger } from '@/lib/motion'
import { ChapterRail } from '@/components/case/chapter-rail'
import { SectionFiber } from '@/components/home/section-fiber'
import { NextProject } from '@/components/case/next-project'
import { useReveal } from '@/components/case/barberlytics/use-reveal'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROJECTS } from '@/lib/content/projects'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { SellUpHero } from './sellup-hero'
import { SellUpDots } from './sellup-dots'
import { SellUpPatterns } from './sellup-patterns'
import { SellUpIdea } from './sellup-idea'
import { SellUpSketches } from './sellup-sketches'
import { SellUpForm } from './sellup-form'
import { SellUpAi } from './sellup-ai'
import { SellUpImpact } from './sellup-impact'
import { SellUpDemo } from './sellup-demo'
import './sellup.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'ia' | 'impacto' | 'demo'

/** El siguiente proyecto, como lo pasa la página */
export interface NextLink {
  slug: string
  title: L
}

/** Cuánto se calma la red de fondo: en la portada se ve; en los capítulos, deja leer */
const QUIET = { hero: 1, chapters: 1 }

/** Capítulos a los que llega una fibra que se tiende con el scroll desde la sección anterior */
const FIBER_TO: Partial<Record<ChapterKey, string>> = { puntos: 'su-puntos', patrones: 'su-patrones', idea: 'su-idea', bocetos: 'su-bocetos', ia: 'su-ia', impacto: 'su-impacto', demo: 'su-demo' }

/** Todos sobre la misma red de fondo; cada uno llega de una manera distinta */
const CHAPTERS: readonly { id: ChapterKey; entry: ChapterEntry }[] = [
  { id: 'puntos', entry: 'bloom' },
  { id: 'patrones', entry: 'thread' },
  { id: 'idea', entry: 'thread' },
  { id: 'bocetos', entry: 'warp' },
  { id: 'ia', entry: 'bloom' },
  { id: 'impacto', entry: 'warp' },
  { id: 'demo', entry: 'thread' },
]

/** 04 · Bocetos y forma: el tablero dibujado y, debajo, los tres agentes construidos (un solo capítulo) */
function SellUpSketchesAndForm() {
  return (
    <div>
      <SellUpSketches />
      <div className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <SellUpForm />
      </div>
    </div>
  )
}

const CONTENT: Record<ChapterKey, React.ComponentType> = {
  puntos: SellUpDots,
  patrones: SellUpPatterns,
  idea: SellUpIdea,
  bocetos: SellUpSketchesAndForm,
  ia: SellUpAi,
  impacto: SellUpImpact,
  demo: SellUpDemo,
}

/** Caso SellUp: portada, índice fijo, los siete capítulos unidos por fibras y el siguiente proyecto. */
export function SellUpCase({ next }: { next: NextLink }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)
  const nextProject = PROJECTS.find((p) => p.slug === next.slug)

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
      bocetos: t({ es: 'Bocetos y forma', en: 'Sketches and form' }),
      ia: t(c.ai),
      impacto: t(c.results),
      demo: t({ es: 'Demo', en: 'Demo' }),
    }
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: 'dark' as const, entry: ch.entry, fiberTo: FIBER_TO[ch.id] }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      <NeuralBackdrop />
      {/* La cadena de la portada sigue con el scroll y baja, como una fibra, hasta «Los puntos» */}
      <SectionFiber id="su-puntos" side="right">
      <SellUpHero />
      <div className="px-[var(--gutter)] lg:pl-[calc(var(--gutter)+88px)]">
        <ChapterRail chapters={chapters} label={t(SELLUP_CASE.title)} />
        {/* De la empresa elegida entre las 206.000 sale la fibra hasta «Patrones» */}
        <SectionFiber id="su-patrones" side="right">
        {/* Del último escalón (la persona) sale hacia la izquierda, hasta «La idea» */}
        <SectionFiber id="su-idea" side="left">
        {/* Del nodo de abajo del anillo de principios, hacia la derecha, hasta «Bocetos» */}
        <SectionFiber id="su-bocetos" side="right">
        {/* Desde detrás de los agentes construidos baja hasta «IA en el proceso» */}
        <SectionFiber id="su-ia" side="down">
        {/* De la persona que decide, al pie de la columna de Rumbo, baja hasta «Impacto» */}
        <SectionFiber id="su-impacto" side="down">
        {/* Del total del último recibo baja hasta «Demo» */}
        <SectionFiber id="su-demo" side="down">
        <div className="mx-auto min-w-0 max-w-6xl">
          {chapters.map((meta) => {
            const Content = CONTENT[meta.id as ChapterKey]
            return (
              <Chapter key={meta.id} meta={meta}>
                <Content />
              </Chapter>
            )
          })}
        </div>
        </SectionFiber>
        </SectionFiber>
        </SectionFiber>
        </SectionFiber>
        </SectionFiber>
        </SectionFiber>
      </div>
      </SectionFiber>
      {nextProject && <NextProject project={nextProject} />}
    </article>
  )
}
