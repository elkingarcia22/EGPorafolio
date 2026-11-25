'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterEntry, type ChapterMeta } from '@/components/case/chapter'
import { ChapterRail } from '@/components/case/chapter-rail'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { SectionFiber } from '@/components/home/section-fiber'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { useReveal } from '../use-reveal'
import { BookingHero } from './booking-hero'
import { RhythmScene } from './rhythm-scene'
import { AffinitySort } from './affinity-sort'
import { CoverRouter } from './cover-router'
import { ScreenCarousel } from './screen-carousel'
import { SurfaceSwitch } from './surface-switch'
import { PhraseParse } from './phrase-parse'
import { ReturnCurve } from './return-curve'
import { BookingDemo } from './booking-demo'
import { BackToHub } from './back-to-hub'
import './booking.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'bocetos' | 'ia' | 'impacto' | 'demo'

/** La red de fondo, calmada al máximo: en la portada y en los capítulos */
const QUIET = { hero: 1, chapters: 1 }
/** Dorado de Barberlytics, el acento de este caso */
const ACCENT = '217 179 106'

/** Cada capítulo recibe la fibra que sale de la pieza final del anterior */
const FIBER_TO: Record<ChapterKey, string> = { puntos: 'bk-puntos', patrones: 'bk-patrones', idea: 'bk-idea', bocetos: 'bk-bocetos', ia: 'bk-ia', impacto: 'bk-impacto', demo: 'bk-demo' }

const CHAPTERS: readonly { id: ChapterKey; entry: ChapterEntry }[] = [
  { id: 'puntos', entry: 'bloom' },
  { id: 'patrones', entry: 'thread' },
  { id: 'idea', entry: 'warp' },
  { id: 'bocetos', entry: 'thread' },
  { id: 'ia', entry: 'bloom' },
  { id: 'impacto', entry: 'warp' },
  { id: 'demo', entry: 'thread' },
]

/** 04 · Bocetos y forma: el carrusel de pantallas y, debajo, el mismo flujo en cuatro superficies */
function BookingSketchesAndForm() {
  return (
    <div>
      <ScreenCarousel />
      <div className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <SurfaceSwitch />
      </div>
    </div>
  )
}

const CONTENT: Record<ChapterKey, React.ComponentType> = {
  puntos: RhythmScene,
  patrones: AffinitySort,
  idea: CoverRouter,
  bocetos: BookingSketchesAndForm,
  ia: PhraseParse,
  impacto: ReturnCurve,
  demo: BookingDemo,
}

/** Caso Reserva: portada, índice fijo, los siete capítulos unidos por fibras y la vuelta a Barberlytics. */
export function BookingCase() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, reducedMotion)
  const c = COPY.case.chapters

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
    <article ref={ref} className="overflow-x-clip" style={{ ['--bk' as string]: ACCENT }}>
      <NeuralBackdrop />
      {/* Del último nodo del recorrido de la portada (la cita lista) baja la fibra hasta «Los puntos» */}
      <SectionFiber id="bk-puntos" side="right">
        <BookingHero />
        <div className="px-[var(--gutter)] lg:pl-[calc(var(--gutter)+88px)]">
          <ChapterRail chapters={chapters} label={t(BOOKING_CASE.title)} back={{ href: '/proyectos/barberlytics', label: { es: 'Barberlytics', en: 'Barberlytics' } }} />
          {/* Del final del ritmo de «Los puntos» a «Patrones», por la derecha */}
          <SectionFiber id="bk-patrones" side="right">
            {/* Del primer grupo (Fuertes) a «La idea», por la izquierda */}
            <SectionFiber id="bk-idea" side="left">
              {/* Del camino de quien llega a «Bocetos y forma», por la derecha */}
              <SectionFiber id="bk-bocetos" side="right">
                {/* Desde detrás de las superficies baja hasta «IA en el proceso» */}
                <SectionFiber id="bk-ia" side="down">
                  {/* Del primer paso de cómo se construyó a «Impacto», por la izquierda */}
                  <SectionFiber id="bk-impacto" side="left">
                    {/* De la última cifra baja hasta «Demo» */}
                    <SectionFiber id="bk-demo" side="down">
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
      <BackToHub />
    </article>
  )
}
