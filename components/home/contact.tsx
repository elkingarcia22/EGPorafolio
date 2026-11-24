'use client'

import { Fragment, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { SignalNetwork } from './signal-network'
import { useLocale } from '@/lib/i18n'
import { ContactIcon, useContactChannels, type ContactChannel } from '@/components/ui/contact-channels'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

const COPIED_RESET_MS = 2000

function ChannelRow({ channel, index }: { channel: ContactChannel; index: number }) {
  const { t } = useLocale()
  return (
    <li>
      <a
        href={channel.href}
        target={channel.external ? '_blank' : undefined}
        rel={channel.external ? 'noopener noreferrer' : undefined}
        data-cursor="↗"
        className="group relative flex items-center gap-4 overflow-hidden border-b border-fg/15 px-4 py-5 md:gap-5 md:px-6 md:py-6"
      >
        {/* Barrido de color en hover/focus */}
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-500 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />
        <span className="mono-label relative w-6 shrink-0 opacity-40 transition-colors group-hover:text-paper group-hover:opacity-80">0{index + 1}</span>
        <ContactIcon name={channel.icon} className="relative h-6 w-6 shrink-0 transition-colors group-hover:text-paper" />
        <span className="relative min-w-0 flex-1 transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
          <span className="mono-label block opacity-60 transition-colors group-hover:text-paper group-hover:opacity-80">{t(channel.label)}</span>
          <span className="block text-[clamp(1rem,0.8rem+1vw,1.75rem)] font-light leading-snug transition-colors [overflow-wrap:anywhere] group-hover:text-paper">
            {/* El correo parte antes de la @, nunca a mitad de palabra */}
            {channel.value.split('@').map((part, i) => (i === 0 ? part : <Fragment key={i}><wbr />@{part}</Fragment>))}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="relative text-2xl transition-all duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-paper"
        >
          ↗
        </span>
      </a>
    </li>
  )
}

/** Contacto: red de conexiones animada + canales directos (correo, llamada, WhatsApp, LinkedIn). */
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

  const channels = useContactChannels()

  return (
    <ToneSection tone="dark" as="footer" id="contact" className="px-[var(--gutter)] pb-10 pt-[clamp(5rem,3rem+8vw,10rem)]">
      <SectionLabel index="05" className="mb-12">{t(COPY.contact.label)}</SectionLabel>

      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <SignalNetwork label={t(COPY.contact.networkAlt)} />
        </div>

        <div className="min-w-0 md:col-span-7">
          <p className="mono-label mb-6 flex items-center gap-2 text-signal">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            {t(COPY.contact.available)}
          </p>
          <h2 className="text-[clamp(2.6rem,0.5rem+6.2vw,7rem)] font-medium leading-[0.85] tracking-[0.06em]">
            {t(COPY.contact.title).toUpperCase()}
            <span className="text-signal">.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed opacity-70">{t(COPY.contact.body)}</p>

          <ul className="mt-10 border-t border-fg/15">
            {channels.map((channel, i) => (
              <ChannelRow key={channel.icon} channel={channel} index={i} />
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
            <button type="button" onClick={copy} className="mono-label opacity-60 underline-offset-4 hover:underline hover:opacity-100" aria-live="polite">
              {copied ? `✓ ${t(COPY.contact.copied)}` : t(COPY.contact.copy)}
            </button>
            <span className="opacity-60">{t(PROFILE.location)}</span>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-2 border-t border-fg/15 pt-6 text-xs opacity-50 md:flex-row md:justify-between">
        <span className="mono-label">© {PROFILE.currentYear} Elkin Garcia</span>
        <span className="mono-label">{t(COPY.footer.built)}</span>
      </div>
    </ToneSection>
  )
}
