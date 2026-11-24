'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { TransitionLink } from '@/components/transition/page-transition'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'
import { ContactIcon, useContactChannels, type ContactIconName } from './contact-channels'

/** Pausa antes de cerrar al sacar el cursor: deja cruzar el hueco entre el enlace y el panel. */
const CLOSE_DELAY_MS = 140
const COPIED_RESET_MS = 2000
const QUICK_ORDER: readonly ContactIconName[] = ['phone', 'whatsapp', 'mail', 'linkedin']

interface ContactMenuProps {
  /** Lleva a la sección de contacto del inicio (o hace scroll si ya se está ahí). */
  onContactClick: (event: React.MouseEvent) => void
}

/** «Contacto» del encabezado: lleva a la sección y, al pasar el cursor, despliega los accesos directos. */
export function ContactMenu({ onContactClick }: ContactMenuProps) {
  const { t } = useLocale()
  const pathname = usePathname()
  const panelId = useId()
  const channels = useContactChannels()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const rootRef = useRef<HTMLLIElement>(null)

  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const show = () => {
    cancelClose()
    setOpen(true)
  }
  const hideSoon = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }
  const hide = useCallback(() => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    setOpen(false)
  }, [])

  useEffect(hide, [pathname, hide])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      hide()
      rootRef.current?.querySelector<HTMLElement>('[data-contact-trigger]')?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, hide])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } catch {
      // Sin permiso de portapapeles: el correo sigue disponible en el enlace de arriba.
    }
  }

  return (
    <li
      ref={rootRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hideSoon()
      }}
    >
      <TransitionLink
        href="/#contact"
        data-contact-trigger
        onClick={(event) => {
          hide()
          onContactClick(event)
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className="mono-label flex items-center gap-1.5 opacity-70 transition-opacity hover:opacity-100 aria-expanded:opacity-100"
      >
        {t(COPY.nav.contact)}
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </TransitionLink>

      <div
        id={panelId}
        className={`absolute -right-6 top-full w-[23rem] pt-4 transition-[opacity,transform] duration-300 ease-expo ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
      >
        <div className="overflow-hidden border border-fg/15 bg-bg/95 text-fg shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <p className="flex items-center gap-2 px-5 pb-2 pt-4">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            <span className="mono-label opacity-60">{t(COPY.contact.menuTitle)}</span>
          </p>
          <ul>
            {channels.map((channel, i) => (
              <li key={channel.icon}>
                <a
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={hide}
                  className="group relative flex items-center gap-4 px-5 py-3 transition-colors duration-300 hover:bg-signal hover:text-paper focus-visible:bg-signal focus-visible:text-paper focus-visible:outline-none"
                  style={{ transitionDelay: open ? `${i * 30}ms` : '0ms' }}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-fg/15 transition-colors group-hover:border-paper/40 group-focus-visible:border-paper/40">
                    <ContactIcon name={channel.icon} className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] leading-tight">{t(channel.label)}</span>
                    <span className="mt-0.5 block truncate text-xs opacity-55 group-hover:opacity-80">{channel.value}</span>
                  </span>
                  <span aria-hidden="true" className="text-base opacity-40 transition-[transform,opacity] duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-4 border-t border-fg/10 px-5 py-3">
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={copyEmail}
              aria-live="polite"
              className="mono-label whitespace-nowrap opacity-60 transition-opacity hover:opacity-100"
            >
              {t(copied ? COPY.contact.copied : COPY.contact.copy)}
            </button>
            <TransitionLink
              href="/#contact"
              tabIndex={open ? 0 : -1}
              onClick={(event) => {
                hide()
                onContactClick(event)
              }}
              className="mono-label whitespace-nowrap opacity-60 transition-opacity hover:opacity-100"
            >
              {t(COPY.contact.goToSection)} →
            </TransitionLink>
          </div>
        </div>
      </div>
    </li>
  )
}

/** Accesos de un toque para el menú móvil: llamar, WhatsApp, correo y LinkedIn. */
export function ContactQuickActions({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLocale()
  // En el celular lo primero es llamar.
  const channels = [...useContactChannels()].sort((a, b) => QUICK_ORDER.indexOf(a.icon) - QUICK_ORDER.indexOf(b.icon))
  return (
    <ul className="mt-4 grid grid-cols-4 gap-2">
      {channels.map((channel) => (
        <li key={channel.icon}>
          <a
            href={channel.href}
            target={channel.external ? '_blank' : undefined}
            rel={channel.external ? 'noopener noreferrer' : undefined}
            onClick={onNavigate}
            aria-label={t(channel.label)}
            className="flex flex-col items-center gap-2 rounded-lg border border-fg/15 px-1 py-3 transition-colors active:bg-signal active:text-paper"
          >
            <ContactIcon name={channel.icon} className="h-5 w-5" />
            <span className="mono-label text-[0.6rem]">{t(channel.short)}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
