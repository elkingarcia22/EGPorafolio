'use client'

import { useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { TransitionLink } from '@/components/transition/page-transition'
import { ProjectPreview } from './project-preview'
import { scrambleText } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

function WorkCard({ project }: { project: Project }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const titleRef = useRef<HTMLSpanElement>(null)
  const title = t(project.title)

  const enter = () => {
    if (titleRef.current && !reducedMotion) scrambleText(titleRef.current, title, 450)
  }

  return (
    <li className="border-t border-fg/15 pt-6 md:pt-8">
      <TransitionLink
        href={`/proyectos/${project.slug}`}
        transitionLabel={`N° ${project.frequency} · ${title}`}
        data-cursor={t(COPY.work.open)}
        onMouseEnter={enter}
        onFocus={enter}
        className="group flex h-full flex-col"
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="mono-label opacity-50">N° {project.frequency}</span>
          <span className="flex items-baseline gap-4">
            <span className="brand-title text-xs opacity-70">{project.client}</span>
            <span className="mono-label opacity-60">{project.year.slice(-4)}</span>
            <span
              aria-hidden="true"
              className="text-xl transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:text-signal"
            >
              ↗
            </span>
          </span>
        </div>
        <span
          ref={titleRef}
          className="mt-4 block text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.02] tracking-tight"
        >
          {title}
        </span>
        <div className="mt-6 overflow-hidden rounded-md transition-transform duration-700 ease-expo group-hover:-translate-y-1 lg:mt-auto lg:pt-6">
          <ProjectPreview project={project} className="rounded-md lg:hidden" compact />
          <ProjectPreview project={project} className="hidden rounded-md lg:block" />
        </div>
      </TransitionLink>
    </li>
  )
}

/** Proyectos como tarjetas: la vista previa se ve de una vez, sin tener que pasar el cursor. */
export function WorkList({ projects }: { projects: readonly Project[] }) {
  const { t } = useLocale()

  return (
    <ToneSection tone="light" id="work" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="01" className="mb-8">{t(COPY.work.label)}</SectionLabel>
          <h2 className="text-[clamp(2.4rem,1rem+5vw,6rem)] font-light leading-[0.9] tracking-tight">{t(COPY.work.title)}</h2>
        </div>
      </div>

      <ul className="grid gap-x-[clamp(2rem,1rem+3vw,4.5rem)] gap-y-16 lg:grid-cols-2 lg:gap-y-24">
        {projects.map((project) => (
          <WorkCard key={project.slug} project={project} />
        ))}
      </ul>
    </ToneSection>
  )
}
