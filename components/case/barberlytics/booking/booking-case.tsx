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
import { BrowserMockup } from '@/components/case/kit/device'
import { useReveal } from '../use-reveal'
import { BookingDots, BookingIdea, BookingPatterns } from './booking-research'
import { FlowMapBoard, VersionsBoard } from './booking-sketches'
import { BookingForm } from './booking-form'
import { BookingAi, BookingImpact } from './booking-ai-impact'
import { BookingDemo } from './booking-demo'

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

/** Portada del caso Reserva. */
function BookingHero() {
  const { t } = useLocale()
  return (
    <ToneSection tone="dark" className="px-[var(--gutter)] pb-20 pt-32">
      <div className="mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
          ← Barberlytics
        </TransitionLink>
        <span className="mono-label opacity-60">{BOOKING_CASE.index} / 04 · {t(BOOKING_CASE.eyebrow)}</span>
      </div>
      <h1 className="text-[clamp(3rem,1rem+7vw,8.5rem)] font-light leading-[0.92] tracking-tight">{t(BOOKING_CASE.title)}</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <p className="text-xl leading-relaxed opacity-85 md:col-span-6">{t(BOOKING_CASE.tagline)}</p>
        <dl className="grid grid-cols-2 gap-6 md:col-span-5 md:col-start-8">
          {BOOKING_CASE.meta.map((m) => (
            <div key={m.label.es}>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div className="col-span-2">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-2">
              {BOOKING_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2.5 py-1 text-xs">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
      <div className="mx-auto mt-16 max-w-5xl">
        <BrowserMockup image={BOOKING_CASE.cover} withLegend={false} />
      </div>
    </ToneSection>
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
