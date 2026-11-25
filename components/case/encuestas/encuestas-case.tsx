'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterEntry, type ChapterMeta } from '@/components/case/chapter'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { ScrollTrigger } from '@/lib/motion'
import { ChapterRail } from '@/components/case/chapter-rail'
import { SectionFiber } from '@/components/home/section-fiber'
import { CaseLead } from '@/components/case/case-lead'
import { NextProject } from '@/components/case/next-project'
import { useReveal } from '@/components/case/barberlytics/use-reveal'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { ENC } from '@/lib/content/cases/encuestas/chapters'
import type { Project } from '@/lib/content/projects'
import { EncHero } from './enc-hero'
import { EncCycleRing } from './enc-cycle-ring'
import { EncPatternLayers } from './enc-pattern-layers'
import { EncBuilderFan } from './enc-builder-fan'
import { EncSketchGrid } from './enc-sketch-grid'
import { EncSurfaces } from './enc-surfaces'
import { EncOrbitChain } from './enc-orbit-chain'
import { EncImpact } from './enc-impact'
import { SurveyDemo } from './demo'
// Las animaciones compartidas del lenguaje de Objetivos (obj-fade, branch-pulse, dots-signal, ms-pulse, orb-*)
import '../objetivos/objetivos.css'
import './encuestas.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'ia' | 'impacto' | 'demo'

/** Cuánto se calma la red de fondo: en la portada se ve; en los capítulos, deja leer */
const QUIET = { hero: 1, chapters: 1 }

/** Capítulos a los que llega una fibra que se tiende con el scroll desde la sección anterior */
const FIBER_TO: Record<ChapterKey, string> = {
  puntos: 'enc-puntos',
  patrones: 'enc-patrones',
  idea: 'enc-idea',
  bocetos: 'enc-bocetos',
  ia: 'enc-ia',
  impacto: 'enc-impacto',
  demo: 'enc-demo',
}

const CHAPTERS: readonly { id: ChapterKey; entry: ChapterEntry }[] = [
  { id: 'puntos', entry: 'bloom' },
  { id: 'patrones', entry: 'thread' },
  { id: 'idea', entry: 'thread' },
  { id: 'bocetos', entry: 'warp' },
  { id: 'ia', entry: 'bloom' },
  { id: 'impacto', entry: 'warp' },
  { id: 'demo', entry: 'thread' },
]

/** Cada capítulo: una frase de contexto y su gráfico (el detalle sale al tocar) */
const withLead = (key: keyof typeof ENC.leads, Graphic: React.ComponentType) =>
  function ChapterBody() {
    const { t } = useLocale()
    return (
      <div>
        <CaseLead>{t(ENC.leads[key])}</CaseLead>
        <Graphic />
      </div>
    )
  }

/** 04 · Bocetos y forma: la cuadrícula de tableros y, debajo, el producto construido (un solo capítulo) */
function EncSketchesAndForm() {
  const { t } = useLocale()
  return (
    <div>
      <CaseLead className="mb-10">{t(ENC.leads.bocetos)}</CaseLead>
      <EncSketchGrid />
      <div className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <CaseLead>{t(ENC.leads.forma)}</CaseLead>
        <EncSurfaces />
      </div>
    </div>
  )
}

const CONTENT: Record<ChapterKey, React.ComponentType> = {
  puntos: withLead('puntos', EncCycleRing),
  patrones: withLead('patrones', EncPatternLayers),
  idea: withLead('idea', EncBuilderFan),
  bocetos: EncSketchesAndForm,
  ia: withLead('ia', EncOrbitChain),
  impacto: withLead('impacto', EncImpact),
  demo: SurveyDemo,
}

/** Caso Encuestas: portada, índice fijo, los siete capítulos unidos por fibras y el siguiente proyecto. */
export function EncuestasCase({ next }: { next: Project }) {
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
      {/* De la «Lectura» de la portada baja la fibra hasta «Los puntos» */}
      <SectionFiber id="enc-puntos" side="right">
      <EncHero />
      <div className="px-[var(--gutter)] lg:pl-[calc(var(--gutter)+88px)]">
        <ChapterRail chapters={chapters} label={t(ENCUESTAS_CASE.title)} />
        {/* De «Actuar», el último momento del anillo (arriba a la izquierda), hasta «Patrones» */}
        <SectionFiber id="enc-patrones" side="left">
        {/* De «El histórico es la línea base» hacia la derecha, hasta «La idea» */}
        <SectionFiber id="enc-idea" side="right">
        {/* Del nodo del constructor, a la izquierda, hasta «Bocetos» */}
        <SectionFiber id="enc-bocetos" side="left">
        {/* De «Resultados», la última superficie del producto, hasta «IA en el proceso» */}
        <SectionFiber id="enc-ia" side="right">
        {/* Del centro del orbe de Orbit baja hasta «Impacto» */}
        <SectionFiber id="enc-impacto" side="down">
        {/* De la última pista de «Impacto» baja hasta «Demo» */}
        <SectionFiber id="enc-demo" side="down">
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
      <NextProject project={next} />
    </article>
  )
}
