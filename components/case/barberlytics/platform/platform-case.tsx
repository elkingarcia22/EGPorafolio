'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Chapter, type ChapterEntry, type ChapterMeta } from '@/components/case/chapter'
import { NeuralBackdrop } from '@/components/home/neural-backdrop'
import { backdropQuiet } from '@/components/home/backdrop-journey'
import { ScrollTrigger } from '@/lib/motion'
import { ChapterRail } from '@/components/case/chapter-rail'
import { SectionFiber } from '@/components/home/section-fiber'
import { CaseLead } from '@/components/case/case-lead'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { PLATFORM } from '@/lib/content/cases/barberlytics/platform'
import { useReveal } from '../use-reveal'
import { PlatformHero } from './platform-hero'
import { GridHub } from './grid-hub'
import { SectorMatrix } from './sector-matrix'
import { CardAnatomy } from './card-anatomy'
import { LivingDay } from './living-day'
import { RoleDoors } from './role-doors'
import { GhostProposals } from './ghost-proposals'
import { StepsCollapse } from './steps-collapse'
import { PlatformDemo } from './platform-demo'
import './platform.css'

type ChapterKey = 'puntos' | 'patrones' | 'idea' | 'forma' | 'roles' | 'ia' | 'impacto' | 'demo'

/** Cuánto se calma la red de fondo: al máximo, para que se lea */
const QUIET = { hero: 1, chapters: 1 }

/** Todos sobre la misma red de fondo; cada uno llega de una manera distinta y recibe la fibra del anterior */
const CHAPTERS: readonly { id: ChapterKey; entry: ChapterEntry }[] = [
  { id: 'puntos', entry: 'bloom' },
  { id: 'patrones', entry: 'thread' },
  { id: 'idea', entry: 'warp' },
  { id: 'forma', entry: 'thread' },
  { id: 'roles', entry: 'bloom' },
  { id: 'ia', entry: 'warp' },
  { id: 'impacto', entry: 'thread' },
  { id: 'demo', entry: 'bloom' },
]

/** Una frase arriba y, cuando hace falta, el texto de apoyo (dos renglones como máximo) */
function Opening({ line, lead }: { line: L; lead?: L }) {
  const { t } = useLocale()
  return (
    <div className="mb-[clamp(2.5rem,2rem+2vw,4rem)]">
      <p data-reveal="mask" className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.8rem,1.2rem+2.2vw,3.2rem)] font-light leading-[1.08] tracking-tight">{t(line)}</p>
      {lead && <CaseLead className="mt-5">{t(lead)}</CaseLead>}
    </div>
  )
}

function Puntos() {
  return <GridHub />
}

function Patrones() {
  return (
    <div>
      <Opening
        line={{ es: '22 calendarios y la voz de quien los usa.', en: '22 calendars and the voice of those who use them.' }}
        lead={{ es: '12 de productividad y 10 de barbería y salón, contra una matriz del sector. Nadie reacomoda por retraso ni resume el día.', en: '12 productivity and 10 barbershop and salon, against an industry matrix. Nobody reflows for delays or summarizes the day.' }}
      />
      <SectorMatrix />
    </div>
  )
}

function Idea() {
  return <CardAnatomy />
}

function Forma() {
  return (
    <div>
      <Opening
        line={{ es: 'De agendada a cobrada, sin salir de la rejilla.', en: 'From booked to paid, without leaving the grid.' }}
        lead={{ es: 'Cada tarjeta dice en qué va la cita y qué sigue. La hora corre: mira cómo cambian.', en: 'Every card says where the visit is and what’s next. Time runs: watch them change.' }}
      />
      <LivingDay />
    </div>
  )
}

function Roles() {
  return (
    <div>
      <Opening line={PLATFORM.roles.title} lead={{ es: 'La misma barbería, recortada a cada quien. El rol se aplica en el servidor, no solo en la pantalla.', en: 'The same shop, cut down to each person. Roles are enforced on the server, not just on screen.' }} />
      <RoleDoors />
    </div>
  )
}

function Ia() {
  return (
    <div>
      <Opening line={PLATFORM_CASE.ai.title} lead={{ es: 'Propone en la rejilla y no en un chat; lo que el cliente eligió no se mueve solo, y todo se deshace.', en: 'It proposes on the grid, not in a chat; what the client chose never moves on its own, and everything can be undone.' }} />
      <GhostProposals />
    </div>
  )
}

function Impacto() {
  return (
    <div>
      <Opening line={{ es: 'Menos pasos en recepción.', en: 'Fewer steps at the front desk.' }} lead={{ es: 'Menos pasos por cita, menos citas perdidas y menos cuentas abiertas al cerrar el día.', en: 'Fewer steps per visit, fewer lost visits and fewer open tabs at closing time.' }} />
      <StepsCollapse />
    </div>
  )
}

const CONTENT: Record<ChapterKey, React.ComponentType> = {
  puntos: Puntos,
  patrones: Patrones,
  idea: Idea,
  forma: Forma,
  roles: Roles,
  ia: Ia,
  impacto: Impacto,
  demo: PlatformDemo,
}

/** Caso Plataforma: portada, índice fijo, los ocho capítulos unidos por fibras y la vuelta a Barberlytics. */
export function PlatformCase() {
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
      forma: t(c.form),
      roles: t({ es: 'Por rol', en: 'By role' }),
      ia: t(c.ai),
      impacto: t(c.results),
      demo: t({ es: 'Demo', en: 'Demo' }),
    }
    return CHAPTERS.map((ch, i) => ({ id: ch.id, index: String(i + 1).padStart(2, '0'), title: titles[ch.id], tone: 'dark' as const, entry: ch.entry, fiberTo: `pl-${ch.id}` }))
  }, [t, c])

  return (
    <article ref={ref} className="overflow-x-clip">
      {/* La misma red de fondo del inicio, de punta a punta */}
      <NeuralBackdrop />
      {/* De la etapa «Cobrada» de la portada sale la fibra que baja hasta «Los puntos» */}
      <SectionFiber id="pl-puntos" side="right">
        <PlatformHero />
        <div className="px-[var(--gutter)] lg:pl-[calc(var(--gutter)+88px)]">
          <ChapterRail chapters={chapters} label={t(PLATFORM_CASE.title)} back={{ href: '/proyectos/barberlytics', label: { es: 'Proyectos de Barberlytics', en: 'Barberlytics projects' } }} />
          {/* Del último nudo de «Lo que fallaba» a «Patrones» */}
          <SectionFiber id="pl-patrones" side="right">
          {/* De la última voz (lo que aplauden) a «La idea» */}
          <SectionFiber id="pl-idea" side="right">
          {/* De la tarjeta de la cita baja hasta «Forma» */}
          <SectionFiber id="pl-forma" side="down">
          {/* De la última pantalla real a «Por rol» */}
          <SectionFiber id="pl-roles" side="down">
          {/* De la pantalla del rol baja hasta «IA» */}
          <SectionFiber id="pl-ia" side="down">
          {/* De la propuesta de Clipper baja a «Impacto» */}
          <SectionFiber id="pl-impacto" side="down">
          {/* De la última cifra a «Demo» */}
          <SectionFiber id="pl-demo" side="down">
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
            {t({ es: 'Ver los otros proyectos', en: 'See the other projects' })} <span className="text-signal">↗</span>
          </p>
        </TransitionLink>
      </ToneSection>
    </article>
  )
}
