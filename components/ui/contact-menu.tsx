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
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[rgb(var(--void)/0.82)] p-2 text-fg shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8),0_0_60px_-20px_rgb(var(--signal)/0.35)] backdrop-blur-xl">
          <p className="flex items-center gap-2 px-3 pb-2 pt-3">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="mono-label opacity-60">{t(COPY.contact.menuTitle)}</span>
          </p>
          {/* La fibra que une los canales, detrás de sus neuronas */}
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[4.5rem] left-[1.95rem] top-[3.6rem] w-px bg-gradient-to-b from-white/5 via-white/25 to-white/5" />
          <ul className="relative">
            {channels.map((channel, i) => (
              <li key={channel.icon}>
                <a
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={hide}
                  className={`group relative flex items-center gap-4 rounded-xl px-3 py-2.5 transition-[background-color,opacity,transform] duration-500 ease-expo hover:bg-white/[0.05] focus-visible:bg-white/[0.07] focus-visible:outline-none ${open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}
                  style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
                >
                  {/* El canal en una neurona que se enciende al pasar */}
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-[rgb(var(--void))] transition-[border-color,box-shadow] duration-500 ease-expo group-hover:border-white/35 group-hover:shadow-[0_0_0_5px_rgb(var(--signal)/0.12),0_0_22px_4px_rgb(var(--signal)/0.45)] group-focus-visible:border-white/35">
                    <ContactIcon name={channel.icon} className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] leading-tight">{t(channel.label)}</span>
                    <span className="mt-0.5 block truncate text-xs text-paper/55 group-hover:text-paper/80">{channel.value}</span>
                  </span>
                  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-xs opacity-50 transition-[transform,opacity,border-color] duration-500 ease-expo group-hover:rotate-45 group-hover:border-white/30 group-hover:opacity-100">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-center justify-between gap-4 border-t border-white/10 px-3 pb-2 pt-3">
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
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-1 py-3 backdrop-blur-sm transition-[background-color,border-color] active:border-white/40 active:bg-white/10"
          >
            <ContactIcon name={channel.icon} className="h-5 w-5" />
            <span className="mono-label text-[0.6rem]">{t(channel.short)}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
