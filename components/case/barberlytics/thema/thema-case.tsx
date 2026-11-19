'use client'

import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { CaseShell } from '../shared/case-shell'
import { Dots, Idea } from '../shared/sections'
import { ThemaHero } from './thema-hero'
import { LogoBoard, LogoConstructionBoard, SystemBoard } from './thema-sketches'
import { TokenMatrix } from './token-matrix'
import { ThemaForm } from './thema-form'
import { ThemaAi, ThemaImpact } from './thema-ai-impact'
import { ThemaDemo } from './thema-demo'

function ThemaSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Tres tableros. Primero la marca: cómo «barbería» y «métricas» se vuelven un solo signo, las seis direcciones exploradas y la construcción del logo oficial con sus medidas reales. Después el sistema: de cuatro fuentes de tokens a pantallas que se arman solas, con la IA leyendo lo mismo.',
          en: 'Three boards. First the brand: how “barbershop” and “metrics” become one sign, the six directions explored and the official logo’s construction with its real measures. Then the system: from four token sources to screens that assemble themselves, with AI reading the same thing.',
        })}
      </p>
      <LogoBoard />
      <LogoConstructionBoard />
      <SystemBoard />
    </div>
  )
}

const ThemaDots = () => <Dots data={THEMA_CASE.dots} />
const ThemaPatterns = TokenMatrix
const ThemaIdea = () => <Idea data={THEMA_CASE.idea} />

/** Caso Thema: el sistema de diseño de Barberlytics, de los puntos a la demo. */
export function ThemaCase() {
  const { t } = useLocale()
  return (
    <CaseShell
      title={t(THEMA_CASE.title)}
      hero={<ThemaHero />}
      content={{
        puntos: ThemaDots,
        patrones: ThemaPatterns,
        idea: ThemaIdea,
        bocetos: ThemaSketches,
        forma: ThemaForm,
        ia: ThemaAi,
        impacto: ThemaImpact,
        demo: ThemaDemo,
      }}
    />
  )
}
