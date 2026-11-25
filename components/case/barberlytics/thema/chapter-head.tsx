'use client'

import { CaseLead } from '@/components/case/case-lead'

interface ChapterHeadProps {
  /** La única frase del capítulo */
  phrase: React.ReactNode
  /** Apoyo de dos renglones como máximo */
  lead?: string
}

/** Arriba de cada capítulo de Thema: una sola frase y, debajo, el texto de apoyo. */
export function ChapterHead({ phrase, lead }: ChapterHeadProps) {
  return (
    <div className="mb-[clamp(2.5rem,2rem+2vw,4rem)]">
      <p data-reveal="mask" className="mx-auto max-w-[30ch] text-balance text-center text-[clamp(1.6rem,1.1rem+1.8vw,2.7rem)] font-light leading-[1.12] tracking-tight">
        {phrase}
      </p>
      {lead && <CaseLead className="mt-5">{lead}</CaseLead>}
    </div>
  )
}
