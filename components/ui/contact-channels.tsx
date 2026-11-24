'use client'

import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

export type ContactIconName = 'mail' | 'phone' | 'whatsapp' | 'linkedin'

const ICON_PATHS: Record<ContactIconName, React.ReactNode> = {
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

export function ContactIcon({ name, className = 'h-6 w-6' }: { name: ContactIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  )
}

export interface ContactChannel {
  icon: ContactIconName
  /** Frase completa: «Escríbeme un correo» */
  label: L
  /** Acción corta para botones de acceso rápido: «Correo» */
  short: L
  value: string
  href: string
  external?: boolean
}

/** Los canales de contacto (correo, WhatsApp, llamada, LinkedIn), listos para un clic. */
export function useContactChannels(): readonly ContactChannel[] {
  const { t } = useLocale()
  const channels: ContactChannel[] = [
    {
      icon: 'mail',
      label: COPY.contact.email,
      short: COPY.contact.quick.email,
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}?subject=${encodeURIComponent(t(COPY.contact.mailSubject))}`,
    },
    {
      icon: 'whatsapp',
      label: COPY.contact.whatsapp,
      short: COPY.contact.quick.whatsapp,
      value: PROFILE.phoneDisplay,
      href: `https://wa.me/${PROFILE.phone}?text=${encodeURIComponent(t(COPY.contact.waMessage))}`,
      external: true,
    },
    {
      icon: 'phone',
      label: COPY.contact.call,
      short: COPY.contact.quick.call,
      value: PROFILE.phoneDisplay,
      href: `tel:+${PROFILE.phone}`,
    },
  ]
  if (PROFILE.linkedin) {
    channels.push({
      icon: 'linkedin',
      label: COPY.contact.linkedin,
      short: COPY.contact.quick.linkedin,
      value: PROFILE.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, ''),
      href: PROFILE.linkedin,
      external: true,
    })
  }
  return channels
}
