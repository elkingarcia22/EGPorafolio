'use client'

import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import Image from 'next/image'
import { PhoneBody } from '@/components/case/kit/device'
import { CaseShell } from '../shared/case-shell'
import { Dots, Idea, Patterns } from '../shared/sections'
import { PlatformHero } from './platform-hero'
import { ProposeBoard, RoleMapBoard } from './platform-sketches'
import { PlatformForm } from './platform-form'
import { PlatformAi } from './platform-ai'
import { PlatformDemo, PlatformImpact } from './platform-impact-demo'

const TILTS = ['rotateY(18deg) rotateZ(-3deg)', 'rotateY(8deg) rotateZ(-1deg)', 'rotateY(-8deg) rotateZ(1deg)', 'rotateY(-18deg) rotateZ(3deg)']

/** 02 · Patrones: el tablero de hallazgos y, abajo, lo que había en producción. */
function PlatformPatterns() {
  const { t } = useLocale()
  const { before } = PLATFORM_CASE.patterns
  return (
    <div>
      <Patterns
        data={PLATFORM_CASE.patterns}
        boardTitle={{ es: 'Investigación · 17 módulos', en: 'Research · 17 modules' }}
        heading={{ es: '17 informes → 4 patrones', en: '17 reports → 4 patterns' }}
      />
      <h3 data-reveal="mask" className="mb-3 mt-[clamp(4rem,3rem+4vw,6rem)] text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(before.title)}</h3>
      <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">{t(before.note)}</p>
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 [perspective:1600px]">
        {before.images.map((image, i) => (
          <li key={image.src} className="group">
            <div className="transition-transform duration-700 ease-expo group-hover:![transform:none]" style={{ transform: TILTS[i] }}>
              <div data-reveal="device">
                <PhoneBody>
                  {/* Capturas de la app con su propia barra de estado: misma proporción para todas. */}
                  <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes="(min-width: 768px) 18vw, 45vw" className="block aspect-[9/19] w-full object-cover object-top" />
                </PhoneBody>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlatformSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-16">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({
          es: 'Antes de cualquier pantalla, dos tableros: quién ve qué en cada módulo —la matriz de la que salieron las dieciséis decisiones de roles— y cómo debería comportarse un calendario cuando alguien llega tarde.',
          en: 'Before any screen, two boards: who sees what in each module —the matrix the sixteen role decisions came from— and how a calendar should behave when someone runs late.',
        })}
      </p>
      <RoleMapBoard />
      <ProposeBoard />
    </div>
  )
}

const PlatformDots = () => <Dots data={PLATFORM_CASE.dots} />
const PlatformIdea = () => <Idea data={PLATFORM_CASE.idea} />

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
