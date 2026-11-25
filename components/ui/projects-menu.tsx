'use client'

import { projectTone } from '@/lib/palettes'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { TransitionLink } from '@/components/transition/page-transition'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROJECTS } from '@/lib/content/projects'
import { ProjectGlyph } from '@/components/home/work-orbit/orbit-node'

/** Pausa antes de cerrar al sacar el cursor: deja cruzar el hueco entre el enlace y el panel. */
const CLOSE_DELAY_MS = 140

interface ProjectsMenuProps {
  /** Lleva a la sección de proyectos del inicio (o hace scroll si ya se está ahí). */
  onWorkClick: (event: React.MouseEvent) => void
}

/** «Proyectos» del encabezado: al pasar el cursor o enfocarlo, despliega los casos. */
export function ProjectsMenu({ onWorkClick }: ProjectsMenuProps) {
  const { t } = useLocale()
  const pathname = usePathname()
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const rootRef = useRef<HTMLLIElement>(null)

  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const show = () => {
    cancelClose()
    setOpen(true)
  }
  const hideSoon = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }
  const hide = useCallback(() => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    setOpen(false)
  }, [])

  // Se cierra al cambiar de página y con Esc.
  useEffect(hide, [pathname, hide])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      hide()
      rootRef.current?.querySelector<HTMLElement>('[data-projects-trigger]')?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, hide])

  return (
    <li
      ref={rootRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hideSoon()
      }}
    >
      <TransitionLink
        href="/#work"
        data-projects-trigger
        onClick={(event) => {
          hide()
          onWorkClick(event)
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className="mono-label flex items-center gap-1.5 opacity-70 transition-opacity hover:opacity-100 aria-expanded:opacity-100"
      >
        {t(COPY.nav.work)}
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </TransitionLink>

      {/* El relleno superior es puente para el cursor entre el enlace y el panel. */}
      <div
        id={panelId}
        className={`absolute -left-6 top-full w-[30rem] pt-4 transition-[opacity,transform] duration-300 ease-expo ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[rgb(var(--void)/0.82)] p-2 text-fg shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8),0_0_60px_-20px_rgb(var(--signal)/0.35)] backdrop-blur-xl">
          {/* La fibra que une los casos, detrás de sus marcas */}
          <span aria-hidden="true" className="pointer-events-none absolute bottom-9 left-[2.15rem] top-9 w-px bg-gradient-to-b from-white/5 via-white/25 to-white/5" />
          <ul className="relative">
            {PROJECTS.map((project, i) => (
              <li key={project.slug}>
                <TransitionLink
                  href={`/proyectos/${project.slug}`}
                  transitionLabel={`N° ${project.frequency} · ${t(project.title)}`}
                  tabIndex={open ? 0 : -1}
                  onClick={hide}
                  className={`group relative flex items-center gap-4 rounded-xl px-3 py-3 transition-[background-color,opacity,transform] duration-500 ease-expo hover:bg-white/[0.05] focus-visible:bg-white/[0.07] focus-visible:outline-none ${open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}
                  style={{ transitionDelay: open ? `${i * 45}ms` : '0ms' }}
                >
                  {/* La marca del caso, en una neurona que se enciende con su color */}
                  <span
                    className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-[rgb(var(--void))] transition-[box-shadow,border-color] duration-500 ease-expo group-hover:border-white/25"
                  >
                    <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" style={{ boxShadow: `0 0 0 5px rgb(${projectTone(project.slug)} / 0.12), 0 0 22px 4px rgb(${projectTone(project.slug)} / 0.45)` }} aria-hidden="true" />
                    <ProjectGlyph project={project} className="relative h-7 w-7" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-light leading-tight tracking-tight transition-transform duration-500 ease-expo group-hover:translate-x-1">
                      {t(project.title)}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-[11px] text-paper/55">
                      <span className="brand-title">{project.client}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{project.year.slice(-4)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="mono-label tabular-nums">N° {project.frequency}</span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-sm opacity-50 transition-[transform,opacity,border-color] duration-500 ease-expo group-hover:rotate-45 group-hover:border-white/30 group-hover:opacity-100">
                    ↗
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

/** Los casos como sublista del menú móvil: cada uno con su marca, unidos por una fibra. */
export function ProjectsSubmenu({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLocale()
  return (
    <ul className="relative mt-3 space-y-1">
      <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-[0.95rem] top-4 w-px bg-white/15" />
      {PROJECTS.map((project) => (
        <li key={project.slug} className="relative">
          <TransitionLink
            href={`/proyectos/${project.slug}`}
            transitionLabel={`N° ${project.frequency} · ${t(project.title)}`}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg py-1.5 text-base font-light active:bg-white/5"
          >
            <ProjectGlyph project={project} className="h-8 w-8" />
            {t(project.title)}
          </TransitionLink>
        </li>
      ))}
    </ul>
  )
}
