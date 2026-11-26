'use client'

import { usePathname } from 'next/navigation'
import { TransitionLink } from '@/components/transition/page-transition'
import { ProjectGlyph } from '@/components/home/work-orbit/orbit-node'
import { ContactIcon, useContactChannels, type ContactIconName } from './contact-channels'
import { PROJECTS } from '@/lib/content/projects'
import { projectTone } from '@/lib/palettes'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

/** En el celular lo primero es llamar */
const CONTACT_ORDER: readonly ContactIconName[] = ['phone', 'whatsapp', 'mail', 'linkedin']
/** Retraso entre una entrada y la siguiente al abrir (ms) */
const STAGGER_MS = 45

export interface MobileMenuItem {
  id: string
  label: L
}

interface MobileMenuProps {
  items: readonly MobileMenuItem[]
  /** Ir al inicio, a una sección del inicio o abrir la hoja de vida */
  onHome: (event: React.MouseEvent) => void
  onSection: (id: string) => (event: React.MouseEvent) => void
  onCv: (event: React.MouseEvent) => void
  onClose: () => void
}

/** Entrada escalonada: cada fila sube y aparece un poco después que la anterior */
const enter = (i: number): React.CSSProperties => ({ animation: `mm-in 0.5s cubic-bezier(.16,1,.3,1) ${i * STAGGER_MS}ms both` })

/**
 * El menú del teléfono como una rama de la red: una fibra baja por la izquierda
 * y cada sección es un nodo sobre ella. «Proyectos» abre una rama con sus
 * casos (la marca de cada uno, con el halo de su color). Al final, los canales
 * de contacto como nodos redondos. La sección o el caso en que se está, encendido.
 */
export function MobileMenu({ items, onHome, onSection, onCv, onClose }: MobileMenuProps) {
  const { t } = useLocale()
  const pathname = usePathname()
  const channels = [...useContactChannels()].sort((a, b) => CONTACT_ORDER.indexOf(a.icon) - CONTACT_ORDER.indexOf(b.icon))
  const inProject = pathname.startsWith('/proyectos/')
  const activeId = pathname === '/' ? 'home' : inProject ? 'work' : null
  let row = 0

  return (
    <nav id="mobile-menu" aria-label="Principal móvil" className="relative max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-[rgb(var(--void)/0.92)] px-[var(--gutter)] pb-8 pt-6 backdrop-blur-xl lg:hidden">
      <ol className="relative">
        {/* La fibra que une las secciones */}
        <span aria-hidden="true" className="absolute bottom-5 left-[7px] top-5 w-px bg-gradient-to-b from-[rgb(var(--signal)/0.7)] via-white/15 to-white/5" />
        {items.map((item, i) => {
          const on = item.id === activeId
          const label = t(item.label)
          const className = `text-[1.7rem] font-light leading-none tracking-tight transition-colors ${on ? 'text-paper' : 'text-paper/80 active:text-paper'}`
          return (
            <li key={item.id} className="relative pl-9" style={enter(row++)}>
              {/* El nodo de la sección */}
              <span aria-hidden="true" className="absolute left-0 top-[0.95rem] grid h-[15px] w-[15px] place-items-center">
                {on && <span className="absolute inset-[-6px] rounded-full bg-[rgb(var(--signal)/0.25)] blur-[2px]" />}
                <span className={`relative h-[9px] w-[9px] rounded-full border ${on ? 'border-white bg-[#fffaf0] shadow-[0_0_12px_3px_rgb(var(--signal)/0.8)]' : 'border-white/40 bg-[rgb(var(--void))]'}`} />
              </span>
              <div className="flex items-baseline gap-3 py-2.5">
                {item.id === 'home' ? (
                  <TransitionLink href="/" transitionLabel="EG" onClick={onHome} aria-current={on ? 'page' : undefined} className={className}>
                    {label}
                  </TransitionLink>
                ) : item.id === 'cv' ? (
                  <button type="button" onClick={onCv} aria-haspopup="dialog" className={className}>
                    {label}
                  </button>
                ) : (
                  <TransitionLink href={`/#${item.id}`} onClick={onSection(item.id)} className={className}>
                    {label}
                  </TransitionLink>
                )}
                <span className="font-mono text-[11px] tabular-nums text-paper/35">0{i + 1}</span>
              </div>

              {/* La rama de los proyectos: cada caso con su marca y el halo de su color */}
              {item.id === 'work' && (
                <ul className="mb-2 mt-1 space-y-1">
                  {PROJECTS.map((project) => {
                    const here = pathname === `/proyectos/${project.slug}` || pathname.startsWith(`/proyectos/${project.slug}/`)
                    const tone = projectTone(project.slug)
                    return (
                      <li key={project.slug} style={enter(row++)}>
                        <TransitionLink
                          href={`/proyectos/${project.slug}`}
                          transitionLabel={`N° ${project.frequency} · ${t(project.title)}`}
                          onClick={onClose}
                          aria-current={here ? 'page' : undefined}
                          className={`flex items-center gap-3 rounded-2xl border px-2.5 py-2 transition-colors active:bg-white/[0.06] ${here ? 'border-white/20 bg-white/[0.05]' : 'border-transparent'}`}
                        >
                          <span className="relative grid h-9 w-9 shrink-0 place-items-center">
                            <span aria-hidden="true" className="absolute inset-[-4px] rounded-full blur-md" style={{ background: `rgb(${tone} / ${here ? 0.5 : 0.22})` }} />
                            <ProjectGlyph project={project} className="relative h-9 w-9" />
                          </span>
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate text-[15px] leading-tight text-paper/90">{t(project.title)}</span>
                            <span className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/45">
                              {project.client} · {project.year.slice(-4)}
                            </span>
                          </span>
                          <span aria-hidden="true" className="ml-auto text-paper/35">↗</span>
                        </TransitionLink>
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Contacto: los canales como nodos redondos */}
              {item.id === 'contact' && (
                <ul className="mt-2 flex gap-3" style={enter(row++)}>
                  {channels.map((channel) => (
                    <li key={channel.icon}>
                      <a
                        href={channel.href}
                        target={channel.external ? '_blank' : undefined}
                        rel={channel.external ? 'noopener noreferrer' : undefined}
                        onClick={onClose}
                        aria-label={t(channel.label)}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.04] shadow-[0_0_24px_-10px_rgb(var(--signal)/0.9)] transition-colors active:border-white/40 active:bg-white/10">
                          <ContactIcon name={channel.icon} className="h-5 w-5" />
                        </span>
                        <span className="font-mono text-[11px] text-paper/55">{t(channel.short)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
      <style>{'@keyframes mm-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } } @media (prefers-reduced-motion: reduce) { #mobile-menu [style*="mm-in"] { animation: none !important; } }'}</style>
    </nav>
  )
}
