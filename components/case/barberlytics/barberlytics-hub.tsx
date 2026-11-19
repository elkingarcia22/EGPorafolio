'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { NextProject } from '@/components/case/next-project'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { OVERVIEW } from '@/lib/content/cases/barberlytics/overview'
import type { Project } from '@/lib/content/projects'
import { ClipperOrb } from './clipper-orb'
import { useReveal } from './use-reveal'

interface HubProject {
  slug: string
  index: string
  title: L
  what: L
  body: L
  stat: L
  ready: boolean
  visual: React.ReactNode
}

const IMG = '/cases/barberlytics'

const PROJECTS: readonly HubProject[] = [
  {
    slug: 'thema',
    index: '01',
    title: { es: 'Thema', en: 'Thema' },
    what: { es: 'Sistema de diseño', en: 'Design system' },
    body: { es: 'De un legado con cuatro fuentes de tokens a 218 componentes, 10 temas y reglas que la IA también sigue.', en: 'From a legacy with four token sources to 218 components, 10 themes and rules the AI follows too.' },
    stat: { es: '218 componentes · 22 familias', en: '218 components · 22 families' },
    ready: false,
    visual: <Image src={`${IMG}/thema-home.webp`} width={1140} height={620} alt="" sizes="(min-width: 768px) 45vw, 100vw" className="h-full w-full object-cover object-left-top" />,
  },
  {
    slug: 'reserva',
    index: '02',
    title: { es: 'Reserva en línea', en: 'Online booking' },
    what: { es: 'Booking flow', en: 'Booking flow' },
    body: { es: 'Quince productos comparados, cuatro versiones y un flujo que reserva «lo de siempre» en un toque.', en: 'Fifteen products compared, four versions and a flow that books “the usual” in one tap.' },
    stat: { es: '4 versiones · demo en vivo', en: '4 versions · live demo' },
    ready: true,
    visual: (
      <div className="flex h-full items-end justify-center gap-4 bg-[radial-gradient(circle_at_50%_120%,rgba(217,179,106,0.35),transparent_60%)] pt-8">
        {['booking-return', 'clipper-thread'].map((name, i) => (
          <div key={name} className={`w-[38%] max-w-[180px] overflow-hidden rounded-t-[26px] bg-[#0b0c0e] p-1.5 pb-0 ${i ? 'translate-y-6' : ''}`}>
            <Image src={`${IMG}/${name}.webp`} width={780} height={1688} alt="" sizes="180px" className="block h-auto w-full rounded-t-[20px]" />
          </div>
        ))}
      </div>
    ),
  },
  {
    slug: 'plataforma',
    index: '03',
    title: { es: 'Plataforma', en: 'Platform' },
    what: { es: 'El negocio por dentro', en: 'The business inside' },
    body: { es: 'De una app móvil a una plataforma web por roles: el dueño, la recepción y el barbero que alquila su silla.', en: 'From a mobile app to a role-based web platform: the owner, the front desk and the barber who rents a chair.' },
    stat: { es: '5 roles · 17 investigaciones', en: '5 roles · 17 research reports' },
    ready: false,
    visual: <Image src={`${IMG}/platform-calendar.webp`} width={2000} height={1250} alt="" sizes="(min-width: 768px) 45vw, 100vw" className="h-full w-full object-cover object-left-top" />,
  },
  {
    slug: 'clipper',
    index: '04',
    title: { es: 'Clipper', en: 'Clipper' },
    what: { es: 'La IA y su identidad', en: 'The AI and its identity' },
    body: { es: 'El poste de barbería hecho esfera: un asistente que consulta antes de responder y propone antes de actuar.', en: 'The barber pole turned sphere: an assistant that looks things up before answering and proposes before acting.' },
    stat: { es: '18 herramientas · 60 evaluaciones', en: '18 tools · 60 evaluations' },
    ready: false,
    visual: (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(46,156,176,0.18),transparent_65%)]">
        <ClipperOrb size={130} />
      </div>
    ),
  },
]

function ProjectCard({ project }: { project: HubProject }) {
  const { t } = useLocale()
  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0b0c0e]">
        <div className="h-full w-full transition-transform duration-700 ease-expo group-hover:scale-[1.04]">{project.visual}</div>
        {!project.ready && (
          <span className="mono-label absolute right-3 top-3 bg-void/80 px-2.5 py-1.5 text-paper/80 backdrop-blur">
            {t({ es: 'En construcción', en: 'In progress' })}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mono-label opacity-60">{project.index} · {t(project.what)}</p>
        <p className="mt-3 text-[clamp(1.8rem,1.2rem+1.6vw,2.6rem)] font-light leading-tight">{t(project.title)}</p>
        <p className="mt-3 text-sm leading-relaxed opacity-75">{t(project.body)}</p>
        <p className="mt-6 flex items-center justify-between border-t border-fg/15 pt-4 text-sm">
          <span className="opacity-70">{t(project.stat)}</span>
          {project.ready && <span className="text-signal transition-transform duration-500 ease-expo group-hover:translate-x-1">{t({ es: 'Ver caso', en: 'View case' })} ↗</span>}
        </p>
      </div>
    </>
  )
  const base = 'group flex h-full flex-col overflow-hidden border border-fg/15 bg-bg transition-colors duration-500'
  if (!project.ready) {
    return <div data-reveal aria-disabled="true" className={`${base} opacity-80`}>{inner}</div>
  }
  return (
    <TransitionLink
      data-reveal
      href={`/proyectos/barberlytics/${project.slug}`}
      transitionLabel={t(project.title)}
      data-cursor={t(COPY.work.open)}
      className={`${base} hover:border-signal`}
    >
      {inner}
    </TransitionLink>
  )
}

/** Portada de Barberlytics: el producto y sus cuatro proyectos para elegir. */
export function BarberlyticsHub({ next }: { next: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, reducedMotion)

  return (
    <article ref={ref}>
      <ToneSection tone="dark" className="px-[var(--gutter)] pb-[clamp(4rem,3rem+5vw,8rem)] pt-32">
        <div className="mb-14 flex items-center justify-between">
          <TransitionLink href="/#work" transitionLabel="EG" className="mono-label opacity-60 hover:opacity-100">
            ← {t(COPY.case.back)}
          </TransitionLink>
          <span className="mono-label opacity-60">{t(OVERVIEW.eyebrow)}</span>
        </div>
        <h1 className="text-[clamp(3rem,1rem+8vw,9.5rem)] font-light leading-[0.92] tracking-tight">{t(OVERVIEW.title)}</h1>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="text-xl leading-relaxed opacity-85 md:col-span-6">{t(OVERVIEW.tagline)}</p>
          <dl className="grid grid-cols-2 gap-6 md:col-span-5 md:col-start-8">
            {OVERVIEW.meta.map((m) => (
              <div key={m.label.es}>
                <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
                <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p data-reveal className="mono-label mb-6 mt-20 opacity-60">{t({ es: 'Cuatro proyectos de un mismo producto · elige uno', en: 'Four projects, one product · pick one' })}</p>
        <ul className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-10 md:grid-cols-12">
          <p data-reveal className="text-[clamp(1.1rem,0.95rem+0.6vw,1.45rem)] font-light leading-relaxed md:col-span-7">{t(OVERVIEW.context)}</p>
          <aside data-reveal className="border-l-2 border-signal pl-5 text-sm leading-relaxed opacity-80 md:col-span-4 md:col-start-9">{t(OVERVIEW.honesty)}</aside>
        </div>
      </ToneSection>
      <NextProject project={next} />
    </article>
  )
}
