'use client'

import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { RevealWords } from '@/components/ui/reveal-words'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

/** Primer momento "señal": el sitio pasa a papel claro y habla en primera persona. */
export function Manifesto() {
  const { t } = useLocale()
  return (
    <ToneSection tone="light" className="px-[var(--gutter)] py-[clamp(6rem,4rem+10vw,14rem)]">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="00">{t(COPY.manifesto.label)}</SectionLabel>
        </div>
        <div className="md:col-span-9">
          <RevealWords
            text={t(COPY.manifesto.text)}
            className="text-[clamp(1.9rem,1rem+3.4vw,4.4rem)] font-light leading-[1.08] tracking-tight"
          />
          <div className="mt-16 flex max-w-xl gap-5">
            <span className="brand-bar shrink-0" aria-hidden="true" />
            <p className="text-base leading-relaxed opacity-80">{t(PROFILE.summary)}</p>
          </div>
        </div>
      </div>
    </ToneSection>
  )
}
