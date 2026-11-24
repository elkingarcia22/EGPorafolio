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
  const accent = `rgb(${project.accent})`

  const enter = () => {
    if (titleRef.current && !reducedMotion) scrambleText(titleRef.current, title, 450)
  }

  return (
    <li className="flex">
      <TransitionLink
        href={`/proyectos/${project.slug}`}
        transitionLabel={`N° ${project.frequency} · ${title}`}
        data-cursor={t(COPY.work.open)}
        onMouseEnter={enter}
        onFocus={enter}
        className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-fg/10 bg-fg/[0.025] p-2.5 transition-[border-color,box-shadow,transform] duration-500 ease-expo hover:-translate-y-1 hover:border-fg/25 hover:shadow-[0_24px_48px_-28px_rgb(var(--fg)/0.45)]"
      >
        <div className="relative overflow-hidden rounded-lg">
          <div className="transition-transform duration-700 ease-expo group-hover:scale-[1.035]">
            <ProjectPreview project={project} compact />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-1.5 pt-5">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            <span className="brand-title text-[0.68rem] opacity-70">{project.client}</span>
            <span className="mono-label ml-auto opacity-50">N° {project.frequency}</span>
          </div>

          <span
            ref={titleRef}
            className="mt-3 block text-[clamp(1.6rem,0.9rem+1.6vw,2.6rem)] font-light leading-[1.05] tracking-tight"
          >
            {title}
          </span>

          <p className="mb-6 mt-3 line-clamp-3 text-sm leading-relaxed opacity-65">{t(project.tagline)}</p>

          <div className="mt-auto flex items-center justify-between border-t border-fg/10 pt-4">
            <span className="mono-label opacity-70 transition-opacity group-hover:opacity-100">{t(COPY.work.open)}</span>
            <span
              aria-hidden="true"
              className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-fg/15 text-base transition-[transform,background-color,border-color,color] duration-500 ease-expo group-hover:rotate-45 group-hover:border-transparent group-hover:text-paper"
            >
              <span className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-expo group-hover:scale-100" style={{ background: accent }} />
              <span className="relative">↗</span>
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-700 ease-expo group-hover:scale-x-100"
          style={{ background: accent }}
        />
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

      <ul className="grid gap-5 md:grid-cols-2 lg:gap-8">
        {projects.map((project) => (
          <WorkCard key={project.slug} project={project} />
        ))}
      </ul>
    </ToneSection>
  )
}
