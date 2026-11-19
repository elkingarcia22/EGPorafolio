'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { TransitionLink } from '@/components/transition/page-transition'
import { MockScreen } from '@/components/mock/mock-screen'
import { BarberlyticsPreview } from './previews/barberlytics-preview'
import { EncuestasPreview } from './previews/encuestas-preview'
import { ObjetivosPreview } from './previews/objetivos-preview'
import { HeroRumboCard } from '@/components/case/sellup/hero-rumbo'
import { gsap, scrambleText } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

/** Vistas previas propias por proyecto; el resto usa la pantalla genérica. */
const PREVIEWS: Partial<Record<string, () => React.JSX.Element>> = {
  barberlytics: BarberlyticsPreview,
  sellup: HeroRumboCard,
  objetivos: ObjetivosPreview,
  encuestas: EncuestasPreview,
}

function ProjectPreview({ project, className = '' }: { project: Project; className?: string }) {
  const Custom = PREVIEWS[project.slug]
  if (Custom) return <div className={`overflow-hidden ${className}`}><Custom /></div>
  return <MockScreen kind={project.mock} mode="ui" accent={project.accent} className={className} />
}

function WorkRow({ project, onHover }: { project: Project; onHover: (p: Project | null) => void }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const titleRef = useRef<HTMLSpanElement>(null)
  const title = t(project.title)

  const enter = () => {
    onHover(project)
    if (titleRef.current && !reducedMotion) scrambleText(titleRef.current, title, 450)
  }

  return (
    <li className="border-t border-fg/15 last:border-b">
      <TransitionLink
        href={`/proyectos/${project.slug}`}
        transitionLabel={`N° ${project.frequency} · ${title}`}
        data-cursor={t(COPY.work.open)}
        onMouseEnter={enter}
        onMouseLeave={() => onHover(null)}
        onFocus={enter}
        onBlur={() => onHover(null)}
        className="group grid grid-cols-12 items-baseline gap-4 py-7 transition-[padding] duration-500 ease-expo md:py-9 md:hover:pl-6"
      >
        <span className="mono-label col-span-12 opacity-50 md:col-span-2">N° {project.frequency}</span>
        <span
          ref={titleRef}
          className="col-span-12 text-[clamp(1.8rem,1rem+3vw,3.8rem)] font-light leading-none tracking-tight md:col-span-6"
        >
          {title}
        </span>
        <span className="brand-title col-span-6 text-xs opacity-70 md:col-span-2">{project.client}</span>
        <span className="mono-label col-span-5 text-right opacity-60 md:col-span-1">{project.year.slice(-4)}</span>
        <span
          aria-hidden="true"
          className="col-span-1 text-right text-xl transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:text-signal"
        >
          ↗
        </span>
        <div className="col-span-12 mt-4 md:hidden">
          <ProjectPreview project={project} className="rounded-md" />
        </div>
      </TransitionLink>
    </li>
  )
}

/** Lista de proyectos como "nodos" con vista previa que sigue al cursor. */
export function WorkList({ projects }: { projects: readonly Project[] }) {
  const { t } = useLocale()
  const [active, setActive] = useState<Project | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preview = previewRef.current
    if (!preview) return
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'expo' })
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'expo' })
    const move = (e: PointerEvent) => {
      xTo(e.clientX + 24)
      yTo(e.clientY - 120)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    const preview = previewRef.current
    if (!preview) return
    gsap.to(preview, {
      clipPath: active ? 'inset(0% 0% 0% 0%)' : 'inset(50% 50% 50% 50%)',
      duration: 0.6,
      ease: 'expo.out',
    })
  }, [active])

  return (
    <ToneSection tone="light" id="work" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="01" className="mb-8">{t(COPY.work.label)}</SectionLabel>
          <h2 className="text-[clamp(2.4rem,1rem+5vw,6rem)] font-light leading-[0.9] tracking-tight">{t(COPY.work.title)}</h2>
        </div>
      </div>

      <ul>
        {projects.map((project) => (
          <WorkRow key={project.slug} project={project} onHover={setActive} />
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden md:block ${active && PREVIEWS[active.slug] ? 'w-[min(32rem,38vw)]' : 'w-[min(26rem,32vw)]'}`}
        style={{ clipPath: 'inset(50% 50% 50% 50%)' }}
      >
        {active && (
          <div className="bg-void p-2 shadow-2xl">
            <ProjectPreview project={active} />
            <div className="flex items-center justify-between px-1 pt-2 text-paper">
              <span className="mono-label">N° {active.frequency}</span>
              <span className="h-2 w-2 rounded-full" style={{ background: `rgb(${active.accent})` }} />
            </div>
          </div>
        )}
      </div>
    </ToneSection>
  )
}
