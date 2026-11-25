'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterEntry, type ChapterMeta } from '@/components/case/chapter'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { ChapterRail } from '@/components/case/chapter-rail'
import { SectionFiber } from '@/components/home/section-fiber'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { useReveal } from '../use-reveal'
import { ClipperCover } from './clp-hero'
import { ClipperDotsScene } from './clp-dots'
import { ClipperPains } from './clp-pains'
import { ClipperBenefits } from './clp-benefits'
import { ClipperSketches } from './clp-sketches'
import { ClipperVoice } from './clp-voice'
import { ClipperStack } from './clp-stack'
import { ClipperImpact } from './clp-impact'
import { ClipperLiveDemo } from './clp-demo'
import './clipper-case.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'forma' | 'ia' | 'impacto' | 'demo'

/** La red de fondo, lo más quieta posible: en la portada y en los capítulos */
const QUIET = 1

/** Cada capítulo recibe la fibra que sale de la pieza final del anterior */
const FIBER_TO: Record<ChapterKey, string> = {
  puntos: 'clp-puntos',
  patrones: 'clp-patrones',
  idea: 'clp-idea',
  bocetos: 'clp-bocetos',
  forma: 'clp-forma',
  ia: 'clp-ia',
  impacto: 'clp-impacto',
  demo: 'clp-demo',
}

const CHAPTERS: readonly { id: ChapterKey; entry: ChapterEntry }[] = [
  { id: 'puntos', entry: 'bloom' },
  { id: 'patrones', entry: 'thread' },
  { id: 'idea', entry: 'warp' },
  { id: 'bocetos', entry: 'bloom' },
  { id: 'forma', entry: 'thread' },
  { id: 'ia', entry: 'warp' },
  { id: 'impacto', entry: 'bloom' },
  { id: 'demo', entry: 'thread' },
]

const CONTENT: Record<ChapterKey, React.ComponentType> = {
  puntos: ClipperDotsScene,
  patrones: ClipperPains,
  idea: ClipperBenefits,
  bocetos: ClipperSketches,
  forma: ClipperVoice,
  ia: ClipperStack,
  impacto: ClipperImpact,
  demo: ClipperLiveDemo,
}

const BACK = { href: '/proyectos/barberlytics', label: { es: 'Proyectos de Barberlytics', en: 'Barberlytics projects' } satisfies L }

/** Caso Clipper: portada, índice fijo, ocho capítulos unidos por fibras y la vuelta a Barberlytics. */
export function ClipperCase() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)

  useEffect(() => {
    backdropQuiet.set('case', QUIET)
    return () => backdropQuiet.set('case', 0)
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
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: 'dark' as const, entry: ch.entry, fiberTo: FIBER_TO[ch.id] }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      <NeuralBackdrop />
      {/* De la herramienta de la portada baja una fibra hasta «Los puntos» */}
      <SectionFiber id="clp-puntos" side="right">
        <ClipperCover />
        <div className="px-[var(--gutter)] lg:pl-[calc(var(--gutter)+88px)]">
          <ChapterRail chapters={chapters} label={t(CLIPPER_CASE.title)} back={BACK} />
          {/* Del orbe apagado de «Los puntos» a «Patrones» */}
          <SectionFiber id="clp-patrones" side="left">
            {/* De la frase del dueño a Clipper, a «La idea» */}
            <SectionFiber id="clp-idea" side="right">
              {/* Del centro del orbe de «La idea» baja a «Bocetos» */}
              <SectionFiber id="clp-bocetos" side="down">
                {/* Del carrusel de bocetos a «Forma» (la voz) */}
                <SectionFiber id="clp-forma" side="left">
                  {/* Del botón para escuchar a Clipper a «IA en el proceso» */}
                  <SectionFiber id="clp-ia" side="right">
                    {/* De «Responde», la última pieza de la cadena, baja a «Impacto» */}
                    <SectionFiber id="clp-impacto" side="down">
                      {/* De la última cresta de la onda baja a «Demo» */}
                      <SectionFiber id="clp-demo" side="down">
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
          </SectionFiber>
        </div>
      </SectionFiber>
      <ToneSection tone="dark" className="border-t border-fg/15 px-[var(--gutter)] py-[clamp(4rem,3rem+5vw,8rem)]">
        <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="group block">
          <p className="mono-label mb-4 opacity-60">{t({ es: 'Volver a Barberlytics', en: 'Back to Barberlytics' })}</p>
          <p className="text-[clamp(2.4rem,1rem+5vw,6rem)] font-light leading-[0.95] tracking-tight transition-transform duration-700 ease-expo group-hover:translate-x-3">
            {t({ es: 'Ver los otros proyectos', en: 'See the other projects' })} <span className="text-[#f0ce86]">↗</span>
          </p>
        </TransitionLink>
      </ToneSection>
    </article>
  )
}
