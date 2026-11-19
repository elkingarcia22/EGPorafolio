'use client'

import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { ProjectPreview } from '@/components/home/project-preview'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

export function NextProject({ project }: { project: Project }) {
  const { t } = useLocale()
  const title = t(project.title)
  return (
    <ToneSection tone="dark" className="px-[var(--gutter)] py-[clamp(5rem,3rem+8vw,10rem)]">
      <TransitionLink
        href={`/proyectos/${project.slug}`}
        transitionLabel={`N° ${project.frequency} · ${title}`}
        data-cursor={t(COPY.work.open)}
        className="group grid items-end gap-10 md:grid-cols-12"
      >
        <div className="md:col-span-7">
          <p className="mono-label mb-6 opacity-50">
            {t(COPY.case.next)} · N° {project.frequency}
          </p>
          <p className="text-[clamp(2.8rem,1rem+6vw,7.5rem)] font-light leading-[0.9] tracking-tight transition-transform duration-700 ease-expo group-hover:translate-x-3">
            {title} <span className="text-signal">↗</span>
          </p>
        </div>
        {/* La misma vista previa animada de la lista de proyectos de la portada */}
        <div className="overflow-hidden rounded-md shadow-[0_40px_90px_-35px_rgba(0,0,0,0.7)] ring-1 ring-white/10 md:col-span-5">
          <div className="transition-transform duration-700 ease-expo group-hover:scale-[1.03]">
            {/* En celular y tablet, la versión compacta que se lee; en escritorio, la de la portada */}
            <ProjectPreview project={project} compact className="lg:hidden" />
            <ProjectPreview project={project} className="hidden lg:block" />
          </div>
        </div>
      </TransitionLink>
    </ToneSection>
  )
}
