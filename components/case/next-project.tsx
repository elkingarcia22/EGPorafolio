'use client'

import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { ProjectGlyph } from '@/components/home/work-orbit/orbit-node'
import { projectTone } from '@/lib/palettes'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'

/**
 * El siguiente proyecto como la próxima neurona de la red, con el mismo
 * lenguaje del menú de proyectos: un hilo baja hasta su nodo (su marca, con el
 * halo de su color), y debajo su nombre, de quién es y una línea. Todo el
 * bloque lleva al caso con la transición de nodo a nodo.
 */
export function NextProject({ project }: { project: Project }) {
  const { t } = useLocale()
  const title = t(project.title)
  const tone = projectTone(project.slug)
  return (
    <ToneSection tone="dark" className="px-[var(--gutter)] pb-[clamp(5rem,3rem+8vw,10rem)] pt-[clamp(3rem,2rem+4vw,6rem)]">
      <TransitionLink
        href={`/proyectos/${project.slug}`}
        transitionLabel={`N° ${project.frequency} · ${title}`}
        data-cursor={t(COPY.work.open)}
        className="group mx-auto flex max-w-[760px] flex-col items-center text-center outline-none"
      >
        {/* El hilo que llega desde el caso que se termina de leer */}
        <span aria-hidden="true" className="h-[clamp(4rem,3rem+4vw,7rem)] w-px bg-gradient-to-b from-white/0 via-white/25 to-white/60" />

        {/* La neurona del siguiente caso: su marca, con el halo de su color que late */}
        <span className="relative mt-2 grid h-28 w-28 place-items-center">
          <span aria-hidden="true" className="absolute inset-[-30%] rounded-full opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-100" style={{ background: `radial-gradient(circle, rgb(${tone} / 0.45), transparent 70%)` }} />
          <span aria-hidden="true" className="absolute inset-0 rounded-full border animate-[nav-node-ping_2.8s_cubic-bezier(0,0,.2,1)_infinite]" style={{ borderColor: `rgb(${tone} / 0.5)` }} />
          <span
            className="relative grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-[rgb(var(--void))] transition-[transform,box-shadow] duration-700 ease-expo group-hover:scale-105"
            style={{ boxShadow: `0 0 0 6px rgb(${tone} / 0.12), 0 0 40px 6px rgb(${tone} / 0.35)` }}
          >
            <ProjectGlyph project={project} className="h-14 w-14" />
          </span>
        </span>

        <p className="mono-label mt-8 text-paper/55">
          {t(COPY.case.next)} · N° {project.frequency}
        </p>
        <p className="mt-4 text-balance text-[clamp(2.2rem,1rem+4.4vw,5rem)] font-light leading-[0.95] tracking-tight transition-transform duration-700 ease-expo group-hover:-translate-y-1">
          {title}
        </p>
        <p className="mt-4 flex items-center gap-2 text-[12px] text-paper/55">
          <span className="brand-title">{project.client}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{project.year.slice(-4)}</span>
        </p>
        <p className="mt-5 max-w-[52ch] text-balance text-base leading-relaxed text-paper/65 md:text-lg">{t(project.tagline)}</p>

        {/* Entrar: el mismo botón redondo del menú de proyectos */}
        <span
          aria-hidden="true"
          className="mt-8 grid h-12 w-12 place-items-center rounded-full border border-white/15 text-lg transition-[transform,border-color,background-color] duration-500 ease-expo group-hover:rotate-45 group-hover:border-white/40 group-hover:bg-white/[0.06]"
        >
          ↗
        </span>
      </TransitionLink>
    </ToneSection>
  )
}
