'use client'

import { useMemo, useRef } from 'react'
import { Chapter, type ChapterMeta } from '@/components/case/chapter'
import { ChapterNav } from '@/components/case/chapter-nav'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { useReveal } from '../use-reveal'
import { BookingDots, BookingIdea, BookingPatterns } from './booking-research'
import { FlowMapBoard, VersionsBoard } from './booking-sketches'
import { BookingForm } from './booking-form'
import { BookingAi, BookingImpact } from './booking-ai-impact'
import { BookingDemo } from './booking-demo'
import { BookingHero } from './booking-hero'

function BookingSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Antes de cualquier pantalla, el flujo en un tablero: dónde se separan quien vuelve y quien llega, dónde se pide el código y qué pasa cuando un día no tiene horas. Después, las cuatro versiones bocetadas lado a lado.',
          en: 'Before any screen, the flow on a board: where returning and new clients split, where the code is asked for, and what happens when a day has no slots. Then, the four versions sketched side by side.',
        })}
      </p>
      <FlowMapBoard />
      <VersionsBoard />
    </div>
  )
}

/** Caso Reserva: la estructura de los casos (de los puntos al impacto) más la demo en vivo. */
export function BookingCase() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)
  const c = COPY.case.chapters

  const chapters: readonly ChapterMeta[] = useMemo(
    () => [
      { id: 'puntos', index: '01', title: t(c.problem), tone: 'dark' },
      { id: 'patrones', index: '02', title: t(c.research), tone: 'dark' },
      { id: 'idea', index: '03', title: t(c.idea), tone: 'light' },
      { id: 'bocetos', index: '04', title: t(c.sketches), tone: 'light' },
      { id: 'forma', index: '05', title: t(c.form), tone: 'light' },
      { id: 'ia', index: '06', title: t(c.ai), tone: 'dark' },
      { id: 'impacto', index: '07', title: t(c.results), tone: 'light' },
      { id: 'demo', index: '08', title: t({ es: 'Demo', en: 'Demo' }), tone: 'dark' },
    ],
    [t, c],
  )
  const content = [BookingDots, BookingPatterns, BookingIdea, BookingSketches, BookingForm, BookingAi, BookingImpact, BookingDemo]

  return (
    <article ref={ref}>
      <BookingHero />
      <div className="grid gap-10 px-[var(--gutter)] md:grid-cols-12">
        <aside className="md:col-span-3">
          <ChapterNav chapters={chapters} label={t(BOOKING_CASE.title)} />
        </aside>
        <div className="min-w-0 md:col-span-9">
          {chapters.map((meta, i) => {
            const Content = content[i]
            return (
              <Chapter key={meta.id} meta={meta}>
                <Content />
              </Chapter>
            )
          })}
        </div>
      </div>
      <ToneSection tone="dark" className="border-t border-fg/15 px-[var(--gutter)] py-[clamp(4rem,3rem+5vw,8rem)]">
        <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="group block">
          <p className="mono-label mb-4 opacity-60">{t({ es: 'Volver a Barberlytics', en: 'Back to Barberlytics' })}</p>
          <p className="text-[clamp(2.4rem,1rem+5vw,6rem)] font-light leading-[0.95] tracking-tight transition-transform duration-700 ease-expo group-hover:translate-x-3">
            {t({ es: 'Ver los otros tres proyectos', en: 'See the other three projects' })} <span className="text-signal">↗</span>
          </p>
        </TransitionLink>
      </ToneSection>
    </article>
  )
}
