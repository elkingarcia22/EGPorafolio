'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { CaseShell } from '../shared/case-shell'
import { Dots, Patterns } from '../shared/sections'
import { FlowMapBoard, VersionsBoard } from './booking-sketches'
import { BookingForm } from './booking-form'
import { BookingAi } from './booking-ai-impact'
import { BookingImpact } from './booking-impact'
import { BookingDemo } from './booking-demo'
import { BookingHero } from './booking-hero'
import { BookingIdea } from './booking-idea'
import { SketchToApp } from './sketch-to-app'

function BookingSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Antes de cualquier pantalla, el flujo en un tablero: dónde se separan quien vuelve y quien llega, dónde se pide el código y qué pasa cuando un día no tiene horas. Después, las cuatro versiones bocetadas lado a lado y cómo terminaron en la app.',
          en: 'Before any screen, the flow on a board: where returning and new clients split, where the code is asked for, and what happens when a day has no slots. Then, the four versions sketched side by side and how they ended up in the app.',
        })}
      </p>
      <FlowMapBoard />
      <VersionsBoard />
      <SketchToApp />
    </div>
  )
}

const BookingDotsChapter = () => <Dots data={BOOKING_CASE.dots} />
const BookingPatternsChapter = () => (
  <Patterns
    data={BOOKING_CASE.patterns}
    boardTitle={{ es: 'Benchmark · reserva en línea', en: 'Benchmark · online booking' }}
    heading={{ es: '15 productos → 4 grupos', en: '15 products → 4 groups' }}
  />
)

/** Caso Reserva: la estructura de los casos (de los puntos al impacto) más la demo en vivo. */
export function BookingCase() {
  const { t } = useLocale()
  return (
    <CaseShell
      title={t(BOOKING_CASE.title)}
      hero={<BookingHero />}
      content={{
        puntos: BookingDotsChapter,
        patrones: BookingPatternsChapter,
        idea: BookingIdea,
        bocetos: BookingSketches,
        forma: BookingForm,
        ia: BookingAi,
        impacto: BookingImpact,
        demo: BookingDemo,
      }}
    />
  )
}
