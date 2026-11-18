'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TransitionLink } from '@/components/transition/page-transition'
import { A11yPanel } from './a11y-panel'
import { useLocale, type Locale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { ScrollTrigger, scrollToTarget } from '@/lib/motion'

const NAV = [
  { id: 'work', label: COPY.nav.work },
  { id: 'process', label: COPY.nav.process },
  { id: 'about', label: COPY.nav.about },
  { id: 'agent', label: COPY.nav.agent },
  { id: 'contact', label: COPY.nav.contact },
] as const

/** A partir de cuántos px de scroll el header toma fondo */
const SOLID_AFTER_PX = 40

/** Línea (px desde arriba) donde se mira qué sección queda bajo el header */
const HEADER_PROBE_PX = 64

/** ¿Hay bajo el header una sección que pide header transparente (el hero)? */
function isOverClearSection(): boolean {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-header-clear]')).some((el) => {
    const rect = el.getBoundingClientRect()
    return rect.top <= HEADER_PROBE_PX && rect.bottom > HEADER_PROBE_PX
  })
}

/**
 * true cuando el header necesita fondo propio: la página ya se desplazó y
 * lo que hay debajo no es el hero (ahí el fondo cortaría la estática).
 */
function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const check = () => setScrolled(window.scrollY > SOLID_AFTER_PX && !isOverClearSection())
    const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: check })
    check()
    return () => trigger.kill()
  }, [])
  return scrolled
}

/** Lectura tipo radio: el scroll de la página recorre 88.0 → 108.0 MHz. */
function FrequencyReadout() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (ref.current) ref.current.textContent = (88 + self.progress * 20).toFixed(1)
      },
    })
    return () => trigger.kill()
  }, [])
  return (
    <span className="mono-label hidden tabular-nums opacity-60 lg:inline" aria-hidden="true">
      FM <span ref={ref}>88.0</span>
    </span>
  )
}

function LanguageToggle() {
  const { locale, setLocale, t } = useLocale()
  const options: readonly Locale[] = ['es', 'en']
  return (
    <div role="group" aria-label={t(COPY.language)} className="flex items-center">
      {options.map((opt, i) => (
        <span key={opt} className="flex items-center">
          {i > 0 && <span className="mx-1 opacity-30">/</span>}
          <button
            type="button"
            lang={opt}
            aria-pressed={locale === opt}
            onClick={() => setLocale(opt)}
            className="mono-label opacity-40 transition-opacity hover:opacity-100 aria-pressed:opacity-100"
          >
            {opt.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}

/** Monograma EG con las líneas verticales de la hoja de vida. */
function Monogram() {
  return (
    <span className="relative flex h-10 items-center pl-3 pr-1 font-semibold tracking-tight" aria-hidden="true">
      <span className="absolute left-0 top-0 h-5 w-px bg-current" />
      <span className="text-lg">EG</span>
      <span className="absolute bottom-0 right-0 h-4 w-px bg-current" />
    </span>
  )
}

export function SiteHeader() {
  const { t } = useLocale()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [a11yOpen, setA11yOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const a11yButton = useRef<HTMLButtonElement>(null)
  const closeA11y = useCallback(() => setA11yOpen(false), [])
  const scrolled = useScrolled()
  const solid = scrolled || menuOpen

  const goTo = (id: string) => (event: React.MouseEvent) => {
    setMenuOpen(false)
    if (!isHome) return
    event.preventDefault()
    scrollToTarget(`#${id}`)
  }

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-50 text-fg transition-colors duration-700">
      {/* Fondo que toma el tono de la sección (oscuro/papel) y desenfoca lo de atrás */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-bg/75 backdrop-blur-md transition-opacity duration-500 ${solid ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="relative flex items-center justify-between gap-6 px-[var(--gutter)] py-4">
        <TransitionLink href="/" aria-label="Elkin Garcia — inicio" transitionLabel="EG">
          <Monogram />
        </TransitionLink>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.id}>
                <TransitionLink
                  href={`/#${item.id}`}
                  onClick={goTo(item.id)}
                  className="mono-label opacity-70 transition-opacity hover:opacity-100"
                >
                  {t(item.label)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <FrequencyReadout />
          <LanguageToggle />
          <button
            ref={a11yButton}
            type="button"
            aria-expanded={a11yOpen}
            aria-label={t(COPY.a11y.open)}
            onClick={() => setA11yOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center border border-fg/30 transition-colors hover:bg-fg hover:text-bg"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="4.5" r="1.8" />
              <path d="M5 8.5l7 1.5 7-1.5M12 10v5m0 0l-3.5 6M12 15l3.5 6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="mono-label md:hidden"
          >
            {menuOpen ? '✕' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Principal móvil" className="relative border-t border-fg/15 bg-bg px-[var(--gutter)] py-6 md:hidden">
          <ul className="space-y-4">
            {NAV.map((item, i) => (
              <li key={item.id} className="flex items-baseline gap-4">
                <span className="mono-label opacity-40">0{i + 1}</span>
                <TransitionLink href={`/#${item.id}`} onClick={goTo(item.id)} className="brand-title text-2xl">
                  {t(item.label)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <A11yPanel open={a11yOpen} onClose={closeA11y} returnFocusTo={a11yButton} />
    </header>
  )
}
