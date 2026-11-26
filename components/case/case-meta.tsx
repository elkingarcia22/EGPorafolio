'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

type Item = { label: string; value: string }

/** Desde qué ancho se ve la ficha completa; por debajo, la línea con su acordeón. */
const BREAKPOINT = {
  md: { compact: 'md:hidden', full: 'hidden md:grid' },
  lg: { compact: 'lg:hidden', full: 'hidden lg:grid' },
} as const

interface CaseMetaProps {
  /** Los datos del proyecto ya traducidos: el primero (el rol) es la línea que se ve cerrada. */
  items: readonly Item[]
  tools: readonly string[]
  /** Clases de la ficha completa (columna al lado del título, o rejilla bajo la frase). */
  fullClassName: string
  /** Clases de cada dato y de las herramientas en la ficha completa. */
  itemClassName?: string
  toolsClassName?: string
  chipClassName?: string
  breakpoint?: keyof typeof BREAKPOINT
  /** Clases del contenedor (orden en la rejilla de la portada). */
  className?: string
}

/**
 * La ficha del caso (rol, año, equipo, alcance y herramientas). En el teléfono era una rejilla de letra diminuta:
 * ahora es una sola línea —el rol— con «Ver más», que despliega lo demás en letra de lectura. Desde `breakpoint` se
 * ve la ficha completa como siempre.
 */
export function CaseMeta({ items, tools, fullClassName, itemClassName = '', toolsClassName = '', chipClassName = 'rounded-full border border-fg/20 px-2 py-0.5 text-[11px]', breakpoint = 'lg', className = '' }: CaseMetaProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  // Cerrado, lo de adentro no se enfoca ni se lee (React 18 aún no conoce `inert` como prop).
  useEffect(() => {
    panelRef.current?.toggleAttribute('inert', !open)
  }, [open])
  const bp = BREAKPOINT[breakpoint]
  const [first, ...rest] = items

  return (
    <div className={className}>
      {/* Teléfono: el rol en una línea y el resto en un acordeón */}
      <div className={`${bp.compact} border-t border-fg/15 pt-6`} data-hero-fade>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="min-w-0">
            <span className="mono-label mb-1 block opacity-50">{first?.label}</span>
            <span className="block text-[15px] leading-snug">{first?.value}</span>
          </span>
          <span className="mono-label mt-0.5 flex shrink-0 items-center gap-1.5 opacity-70">
            {open ? t({ es: 'Ver menos', en: 'Less' }) : t({ es: 'Ver más', en: 'More' })}
            <span aria-hidden="true" className={`inline-block transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
              +
            </span>
          </span>
        </button>
        <div id={panelId} className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div ref={panelRef} className="overflow-hidden">
            <dl className="mt-5 divide-y divide-fg/10 border-t border-fg/10">
              {rest.map((m) => (
                <div key={m.label} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="mono-label shrink-0 opacity-50">{m.label}</dt>
                  <dd className="text-right text-[15px] leading-snug">{m.value}</dd>
                </div>
              ))}
              <div className="py-3">
                <dt className="mono-label mb-2.5 opacity-50">{t(COPY.case.tools)}</dt>
                <dd className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span key={tool} className="rounded-full border border-fg/20 px-3 py-1 text-[13px]">
                      {tool}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Tablet y escritorio: la ficha completa */}
      <dl className={`${bp.full} ${fullClassName}`}>
        {items.map((m) => (
          <div key={m.label} data-hero-fade className={itemClassName}>
            <dt className="mono-label mb-1 opacity-50">{m.label}</dt>
            <dd className="text-[13px] leading-snug">{m.value}</dd>
          </div>
        ))}
        <div data-hero-fade className={toolsClassName}>
          <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <span key={tool} className={chipClassName}>
                {tool}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  )
}
