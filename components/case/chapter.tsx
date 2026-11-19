'use client'

import { ToneSection, type Tone } from '@/components/ui/tone-section'

export interface ChapterMeta {
  id: string
  index: string
  title: string
  tone: Tone
}

interface ChapterProps {
  meta: ChapterMeta
  children: React.ReactNode
}

/** Capítulo de un caso: número grande + título + contenido. */
export function Chapter({ meta, children }: ChapterProps) {
  return (
    <ToneSection
      tone={meta.tone}
      id={meta.id}
      data-chapter={meta.id}
      aria-labelledby={`${meta.id}-title`}
      className="scroll-mt-24 border-t border-fg/15 py-[clamp(4rem,3rem+6vw,9rem)]"
    >
      <header data-reveal="mask" className="mb-12 flex items-baseline gap-5">
        <span className="mono-label opacity-50">{meta.index}</span>
        <h2 id={`${meta.id}-title`} className="brand-title text-[clamp(1.5rem,1rem+1.6vw,2.4rem)]">
          {meta.title}
        </h2>
      </header>
      {children}
    </ToneSection>
  )
}
