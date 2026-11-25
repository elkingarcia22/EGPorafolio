'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterEntry, type ChapterMeta } from '@/components/case/chapter'
import { ChapterRail } from '@/components/case/chapter-rail'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { SectionFiber } from '@/components/home/section-fiber'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useReveal } from '../use-reveal'
import { ThemaHero } from './thema-hero'
import { ThemaDots } from './thema-dots'
import { TokenAgreement } from './token-agreement'
import { ThemaIdea } from './thema-idea'
import { LogoSketches } from './logo-sketches'
import { ThemaForm } from './thema-form'
import { AiGate } from './ai-gate'
import { ThemaImpact } from './thema-impact'
import { ThemaDemo } from './thema-demo'
import './thema.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'ia' | 'impacto' | 'demo'

/** La red de fondo, calmada al máximo: en la portada y en los capítulos */
const QUIET = 1

/** Cada capítulo llega de una manera distinta; a todos llega una fibra desde el anterior */
const CHAPTERS: readonly { id: ChapterKey; entry: ChapterEntry }[] = [
  { id: 'puntos', entry: 'bloom' },
  { id: 'patrones', entry: 'thread' },
  { id: 'idea', entry: 'warp' },
  { id: 'bocetos', entry: 'thread' },
  { id: 'ia', entry: 'warp' },
  { id: 'impacto', entry: 'thread' },
  { id: 'demo', entry: 'bloom' },
]

/** 04 · Bocetos y forma: del boceto al logo oficial y, debajo, el sistema construido (un solo capítulo, como en Objetivos) */
function ThemaSketchesAndForm() {
  return (
    <div>
      <LogoSketches />
      <div className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <ThemaForm />
      </div>
    </div>
  )
}

const CONTENT: Record<ChapterKey, React.ComponentType> = {
  puntos: ThemaDots,
  patrones: TokenAgreement,
  idea: ThemaIdea,
  bocetos: ThemaSketchesAndForm,
  ia: AiGate,
  impacto: ThemaImpact,
  demo: ThemaDemo,
}

const BACK = { href: '/proyectos/barberlytics', label: { es: 'Proyectos de Barberlytics', en: 'Barberlytics projects' } }

/** Al final, el hilo baja hasta el nodo de Barberlytics: de vuelta a los otros proyectos. */
function BackToBarberlytics() {
  const { t } = useLocale()
  return (
    <ToneSection tone="dark" className="px-[var(--gutter)] pb-[clamp(5rem,3rem+8vw,10rem)] pt-[clamp(3rem,2rem+4vw,6rem)]">
      <TransitionLink href={BACK.href} transitionLabel="Barberlytics" className="group mx-auto flex max-w-[760px] flex-col items-center text-center outline-none">
        <span aria-hidden="true" className="h-[clamp(4rem,3rem+4vw,7rem)] w-px bg-gradient-to-b from-white/0 via-white/25 to-white/60" />
        <span className="relative mt-2 grid h-20 w-20 place-items-center">
          <span aria-hidden="true" className="absolute inset-[-30%] rounded-full opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-100" style={{ background: 'radial-gradient(circle, rgba(217,179,106,0.45), transparent 70%)' }} />
          <span aria-hidden="true" className="absolute inset-0 rounded-full border border-[#D9B36A]/50 animate-[nav-node-ping_2.8s_cubic-bezier(0,0,.2,1)_infinite]" />
          <span className="relative h-5 w-5 rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_6px_rgba(217,179,106,0.2),0_0_30px_6px_rgba(217,179,106,0.55)] transition-transform duration-700 ease-expo group-hover:scale-110" />
        </span>
        <p className="mono-label mt-8 text-paper/55">{t({ es: 'Volver a Barberlytics', en: 'Back to Barberlytics' })}</p>
        <p className="mt-4 text-balance text-[clamp(2.2rem,1rem+4.4vw,5rem)] font-light leading-[0.95] tracking-tight transition-transform duration-700 ease-expo group-hover:-translate-y-1">
          {t({ es: 'Ver los otros proyectos', en: 'See the other projects' })}
        </p>
        <span aria-hidden="true" className="mt-8 grid h-12 w-12 place-items-center rounded-full border border-white/15 text-lg transition-[transform,border-color,background-color] duration-500 ease-expo group-hover:rotate-45 group-hover:border-white/40 group-hover:bg-white/[0.06]">
          ↗
        </span>
      </TransitionLink>
    </ToneSection>
  )
}

/**
 * Caso Thema: portada con la cinta «un color → un tema», índice fijo y siete
 * capítulos sobre la misma red de fondo, unidos por fibras que se tienden con
 * el scroll; al final, de vuelta a Barberlytics.
 */
export function ThemaCase() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)

  useEffect(() => {
    backdropQuiet.set('case', QUIET)
    // Se vuelve a medir cuando el contenido de los capítulos ya está montado.
    ScrollTrigger.refresh()
    return () => backdropQuiet.set('case', 0)
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
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: 'dark' as const, entry: ch.entry, fiberTo: `th-${ch.id}` }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      <NeuralBackdrop />
      {/* Del tema que sale en la cinta de la portada baja la fibra hasta «Los puntos» */}
      <SectionFiber id="th-puntos" side="right">
      <ThemaHero />
      <div className="px-[var(--gutter)] lg:pl-[calc(var(--gutter)+88px)]">
        <ChapterRail chapters={chapters} label={t(THEMA_CASE.title)} back={BACK} />
        {/* De la última cifra de «Los puntos» a «Patrones» */}
        <SectionFiber id="th-patrones" side="right">
        {/* De lo prohibido a «La idea» */}
        <SectionFiber id="th-idea" side="left">
        {/* Del último principio a «Bocetos» */}
        <SectionFiber id="th-bocetos" side="right">
        {/* Del carrete de componentes a «IA en el proceso» */}
        <SectionFiber id="th-ia" side="down">
        {/* Del pie de «IA en el proceso» baja a «Impacto» */}
        <SectionFiber id="th-impacto" side="down">
        {/* De la calidad a «Demo» */}
        <SectionFiber id="th-demo" side="down">
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
      <BackToBarberlytics />
    </article>
  )
}
