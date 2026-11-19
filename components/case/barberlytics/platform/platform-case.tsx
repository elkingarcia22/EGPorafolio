'use client'

import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { CaseShell } from '../shared/case-shell'
import { PlatformHero } from './platform-hero'
import { PlatformDots } from './platform-dots'
import { PlatformIdea } from './platform-idea'
import { ViewsBoard } from './platform-sketches-views'
import { CardAnatomyBoard, ProposeBoard } from './platform-sketches'
import { PlatformPatterns } from './platform-patterns'
import { PlatformForm } from './platform-form'
import { PlatformAi } from './platform-ai'
import { PlatformDemo, PlatformImpact } from './platform-impact-demo'

function PlatformSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Antes de cualquier pantalla, tres tableros: qué tiene que decir una tarjeta sin abrir nada —y qué puede apagar cada barbería—, de cuántas formas se puede mirar el día y cómo debería comportarse el calendario cuando alguien llega tarde.',
          en: 'Before any screen, three boards: what a card has to say without opening anything —and what each shop can turn off—, how many ways there are to look at the day, and how the calendar should behave when someone runs late.',
        })}
      </p>
      <CardAnatomyBoard />
      <ViewsBoard />
      <ProposeBoard />
    </div>
  )
}


/** Caso Plataforma: de los puntos al impacto, más la demo por rol. */
export function PlatformCase() {
  const { t } = useLocale()
  return (
    <CaseShell
      title={t(PLATFORM_CASE.title)}
      hero={<PlatformHero />}
      content={{
        puntos: PlatformDots,
        patrones: PlatformPatterns,
        idea: PlatformIdea,
        bocetos: PlatformSketches,
        forma: PlatformForm,
        ia: PlatformAi,
        impacto: PlatformImpact,
        demo: PlatformDemo,
      }}
    />
  )
}
