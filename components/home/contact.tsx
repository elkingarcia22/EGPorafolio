'use client'

import { useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

const COPIED_RESET_MS = 2000

export function Contact() {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } catch {
      // Sin permiso de portapapeles: el correo sigue visible como enlace.
    }
  }

  return (
    <ToneSection tone="dark" as="footer" id="contact" className="px-[var(--gutter)] pb-10 pt-[clamp(5rem,3rem+8vw,10rem)]">
      <SectionLabel index="05" className="mb-10">{t(COPY.contact.label)}</SectionLabel>
      <a
        href={`mailto:${PROFILE.email}`}
        data-cursor="✉"
        className="group block text-[clamp(3.5rem,1rem+12vw,14rem)] font-medium leading-[0.85] tracking-[0.06em]"
      >
        <span className="inline-block transition-transform duration-700 ease-expo group-hover:-translate-y-2">
          {t(COPY.contact.title).toUpperCase()}
        </span>
        <span className="inline-block text-signal transition-transform duration-700 ease-expo group-hover:translate-x-4">↗</span>
      </a>

      <div className="mt-14 grid gap-8 border-t border-fg/15 pt-8 md:grid-cols-3">
        <p className="max-w-xs leading-relaxed opacity-70">{t(COPY.contact.body)}</p>
        <div className="space-y-2">
          <a href={`mailto:${PROFILE.email}`} className="block underline-offset-4 hover:underline">
            {PROFILE.email}
          </a>
          <button type="button" onClick={copy} className="mono-label opacity-60 hover:opacity-100" aria-live="polite">
            {copied ? t(COPY.contact.copied) : t(COPY.contact.copy)}
          </button>
        </div>
        <p className="text-sm opacity-60 md:text-right">{t(PROFILE.location)}</p>
      </div>

      <div className="mt-16 flex flex-col gap-2 text-xs opacity-50 md:flex-row md:justify-between">
        <span className="mono-label">© {PROFILE.currentYear} Elkin Garcia</span>
        <span className="mono-label">{t(COPY.footer.built)}</span>
      </div>
    </ToneSection>
  )
}
