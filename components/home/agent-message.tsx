'use client'

import { Fragment } from 'react'
import { TransitionLink } from '@/components/transition/page-transition'
import { CV_HASH } from '@/components/ui/cv-viewer'
import { useLocale } from '@/lib/i18n'
import { PROFILE } from '@/lib/content/profile'
import type { Project } from '@/lib/content/projects'

/** Lo que el agente pide mostrar además del texto: casos, contacto, hoja de vida y preguntas siguientes. */
export interface Extras {
  cases: string[]
  contact: boolean
  cv: boolean
  suggestions: string[]
}

const MARK = /\[\[(caso|contacto|cv|sugerencia)(?::([^\]]*))?\]\]/g

/** Separa el texto de las marcas [[…]]; mientras llega por partes, esconde una marca a medio escribir. */
export function parseReply(raw: string): { text: string; extras: Extras } {
  const extras: Extras = { cases: [], contact: false, cv: false, suggestions: [] }
  const text = raw
    .replace(MARK, (_, kind: string, arg?: string) => {
      const value = arg?.trim() ?? ''
      if (kind === 'caso' && value && !extras.cases.includes(value)) extras.cases.push(value)
      if (kind === 'contacto') extras.contact = true
      if (kind === 'cv') extras.cv = true
      if (kind === 'sugerencia' && value) extras.suggestions.push(value)
      return ''
    })
    .replace(/\[\[[^\]]*$/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { text, extras }
}

/** Negritas con **texto**. */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="font-medium text-fg">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  )
}

/** Markdown mínimo: párrafos y listas con guion. */
export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        if (lines.every((l) => /^\s*[-•]\s/.test(l))) {
          return (
            <ul key={i} className="space-y-1.5">
              {lines.map((l, k) => (
                <li key={k} className="flex gap-2"><span className="text-signal" aria-hidden="true">—</span>{inline(l.replace(/^\s*[-•]\s/, ''))}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{lines.map((l, k) => <Fragment key={k}>{k > 0 && <br />}{inline(l)}</Fragment>)}</p>
      })}
    </div>
  )
}

/** Tarjeta de un caso que el agente recomienda. */
export function CaseCard({ project }: { project: Project }) {
  const { t } = useLocale()
  return (
    <TransitionLink
      href={`/proyectos/${project.slug}`}
      transitionLabel={`N° ${project.frequency} · ${t(project.title)}`}
      className="group flex items-center gap-3 border border-fg/20 px-4 py-3 transition-colors duration-300 hover:border-signal"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `rgb(${project.accent})` }} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{t(project.title)}</span>
        <span className="mono-label mt-0.5 block opacity-50">{project.client} · {project.year}</span>
      </span>
      <span className="text-signal transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
      <span className="sr-only">{t({ es: 'Ver caso', en: 'View case' })}</span>
    </TransitionLink>
  )
}

const BTN = 'mono-label inline-flex items-center gap-2 border border-fg/25 px-3 py-2 transition-colors hover:bg-fg hover:text-bg'

/** Botones de contacto y hoja de vida. */
export function ContactActions({ contact, cv }: { contact: boolean; cv: boolean }) {
  const { t } = useLocale()
  return (
    <div className="flex flex-wrap gap-2">
      {contact && (
        <>
          <a className={BTN} href={`mailto:${PROFILE.email}`}>{t({ es: 'Correo', en: 'Email' })} ↗</a>
          <a className={BTN} href={`https://wa.me/${PROFILE.phone}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
          {PROFILE.linkedin && <a className={BTN} href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
        </>
      )}
      {cv && <a className={BTN} href={CV_HASH}>{t({ es: 'Ver hoja de vida', en: 'View résumé' })}</a>}
    </div>
  )
}
