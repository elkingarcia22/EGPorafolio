'use client'

import { useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { SignalNetwork } from './signal-network'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

const COPIED_RESET_MS = 2000

type IconName = 'mail' | 'phone' | 'whatsapp' | 'linkedin'

const ICONS: Record<IconName, React.ReactNode> = {
  mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  whatsapp: (
    <>
      <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z" />
    </>
  ),
  linkedin: <path d="M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6A4 4 0 0 1 20 13v7h-4v-6a2 2 0 0 0-4 0v6h-4z" />,
}

interface Channel {
  icon: IconName
  label: L
  value: string
  href: string
  external?: boolean
}

function ChannelRow({ channel, index }: { channel: Channel; index: number }) {
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
        <svg
          viewBox="0 0 24 24"
          className="relative h-6 w-6 shrink-0 transition-colors group-hover:text-paper"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {ICONS[channel.icon]}
        </svg>
        <span className="relative min-w-0 flex-1 transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
          <span className="mono-label block opacity-60 transition-colors group-hover:text-paper group-hover:opacity-80">{t(channel.label)}</span>
          <span className="block break-all text-[clamp(1rem,0.8rem+1vw,1.75rem)] font-light leading-snug transition-colors group-hover:text-paper">
            {channel.value}
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

  const channels: Channel[] = [
    {
      icon: 'mail',
      label: COPY.contact.email,
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}?subject=${encodeURIComponent(t(COPY.contact.mailSubject))}`,
    },
    {
      icon: 'whatsapp',
      label: COPY.contact.whatsapp,
      value: PROFILE.phoneDisplay,
      href: `https://wa.me/${PROFILE.phone}?text=${encodeURIComponent(t(COPY.contact.waMessage))}`,
      external: true,
    },
    { icon: 'phone', label: COPY.contact.call, value: PROFILE.phoneDisplay, href: `tel:+${PROFILE.phone}` },
    ...(PROFILE.linkedin
      ? [
          {
            icon: 'linkedin' as const,
            label: COPY.contact.linkedin,
            value: PROFILE.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, ''),
            href: PROFILE.linkedin,
            external: true,
          },
        ]
      : []),
  ]

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
