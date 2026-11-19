'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { TransitionLink } from '@/components/transition/page-transition'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROJECTS } from '@/lib/content/projects'

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
        <div className="overflow-hidden border border-fg/15 bg-bg/95 text-fg shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <ul>
            {PROJECTS.map((project, i) => (
              <li key={project.slug} className="border-b border-fg/10 last:border-b-0">
                <TransitionLink
                  href={`/proyectos/${project.slug}`}
                  transitionLabel={`N° ${project.frequency} · ${t(project.title)}`}
                  tabIndex={open ? 0 : -1}
                  onClick={hide}
                  className="group relative grid grid-cols-[4.25rem_1fr_auto] items-center gap-x-4 px-5 py-4 transition-colors duration-300 hover:bg-fg/[0.04] focus-visible:bg-fg/[0.06] focus-visible:outline-none"
                  style={{ transitionDelay: open ? `${i * 35}ms` : '0ms' }}
                >
                  {/* Barra del color del caso, crece al pasar el cursor */}
                  <span
                    className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-500 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
                    style={{ background: `rgb(${project.accent})` }}
                    aria-hidden="true"
                  />
                  <span className="mono-label whitespace-nowrap opacity-45 tabular-nums">N° {project.frequency}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-xl font-light leading-tight tracking-tight transition-transform duration-500 ease-expo group-hover:translate-x-1">
                      {t(project.title)}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-[11px] opacity-55">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${project.accent})` }} aria-hidden="true" />
                      <span className="brand-title">{project.client}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{project.year.slice(-4)}</span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-lg opacity-40 transition-[transform,opacity,color] duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" style={{ color: `rgb(${project.accent})` }}>
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

/** Los casos como sublista del menú móvil. */
export function ProjectsSubmenu({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLocale()
  return (
    <ul className="mt-3 space-y-2 border-l border-fg/15 pl-4">
      {PROJECTS.map((project) => (
        <li key={project.slug}>
          <TransitionLink
            href={`/proyectos/${project.slug}`}
            transitionLabel={`N° ${project.frequency} · ${t(project.title)}`}
            onClick={onNavigate}
            className="flex items-center gap-3 py-1 text-base font-light"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${project.accent})` }} aria-hidden="true" />
            {t(project.title)}
          </TransitionLink>
        </li>
      ))}
    </ul>
  )
}
