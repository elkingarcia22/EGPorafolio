'use client'

import { useId, useState } from 'react'
import { useLocale } from '@/lib/i18n'

interface CaseLeadProps {
  children: string
  className?: string
}

/**
 * Texto de apoyo de un caso, corto a la vista: muestra dos líneas y el resto
 * se abre con «+». Así la página habla con lo visual y el detalle sigue ahí.
 */
export function CaseLead({ children, className = '' }: CaseLeadProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div data-reveal className={`group/lead mx-auto max-w-[60ch] text-center ${className}`}>
      <p id={id} className={`text-base leading-relaxed text-paper/65 transition-colors duration-300 md:text-lg ${open ? '' : 'line-clamp-2'}`}>
        {children}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/12 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/55 transition-colors duration-300 hover:border-white/35 hover:text-paper"
      >
        <span aria-hidden="true" className={`inline-block transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
        {open ? t({ es: 'Menos', en: 'Less' }) : t({ es: 'Leer más', en: 'Read more' })}
      </button>
    </div>
  )
}
