'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TransitionLink } from '@/components/transition/page-transition'
import { A11yPanel } from './a11y-panel'
import { ProjectsMenu, ProjectsSubmenu } from './projects-menu'
import { ContactMenu, ContactQuickActions } from './contact-menu'
import { ContactIcon } from './contact-channels'
import { CvViewer, cvModeFromHash, type CvMode } from './cv-viewer'
import { useLocale, type Locale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { ScrollTrigger, scrollToHeroSignature, scrollToTarget } from '@/lib/motion'

const NAV = [
  { id: 'home', label: { es: 'Inicio', en: 'Home' } },
  { id: 'work', label: COPY.nav.work },
  { id: 'process', label: COPY.nav.process },
  { id: 'about', label: COPY.nav.about },
  // La hoja de vida abre un visor; el Agente va justo antes de Contacto, al final.
  { id: 'cv', label: COPY.cv.nav },
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

/** Total de conexiones que se van "encontrando" al recorrer la página */
const TOTAL_CONNECTIONS = 248

/** Contador: a medida que se recorre la página se encuentran más conexiones. */
function ConnectionsReadout() {
  const { t } = useLocale()
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (ref.current) ref.current.textContent = String(Math.round(self.progress * TOTAL_CONNECTIONS)).padStart(3, '0')
      },
    })
    return () => trigger.kill()
  }, [])
  return (
    <span className="mono-label hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 tabular-nums text-paper/70 backdrop-blur-sm lg:inline-flex" aria-hidden="true">
      {/* Neurona que late: el contador de conexiones de la red */}
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_rgb(var(--signal)/0.8)]" />
      </span>
      <span ref={ref}>000</span> {t(COPY.connections)}
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
  const [quickOpen, setQuickOpen] = useState(false)
  const a11yButton = useRef<HTMLButtonElement>(null)
  const closeA11y = useCallback(() => setA11yOpen(false), [])
  const scrolled = useScrolled()
  const solid = scrolled || menuOpen || quickOpen
  const [cvOpen, setCvOpen] = useState(false)
  const [cvMode, setCvMode] = useState<CvMode>('light')
  const openCv = () => {
    setMenuOpen(false)
    setCvMode('light')
    setCvOpen(true)
  }
  const closeCv = useCallback(() => {
    setCvOpen(false)
    if (cvModeFromHash(window.location.hash)) history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  // El enlace compartido (…/#hoja-de-vida o …/#hoja-de-vida-oscura) abre el visor en esa versión.
  useEffect(() => {
    const check = () => {
      const mode = cvModeFromHash(window.location.hash)
      if (!mode) return
      setCvMode(mode)
      setCvOpen(true)
    }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  /** Inicio (y el logo): en la portada sube hasta el EG; desde otra página, vuelve a la portada. */
  const goHome = (event: React.MouseEvent) => {
    setMenuOpen(false)
    if (!isHome) return
    event.preventDefault()
    if (window.location.hash) history.replaceState(null, '', '/')
    scrollToHeroSignature(1.8)
  }

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
        <TransitionLink
          href="/"
          aria-label="Elkin Garcia — inicio"
          transitionLabel="EG"
          onClick={goHome}
        >
          <Monogram />
        </TransitionLink>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) =>
              item.id === 'home' ? (
                <li key={item.id}>
                  <TransitionLink href="/" transitionLabel="EG" onClick={goHome} className="mono-label opacity-70 transition-opacity hover:opacity-100">
                    {t(item.label)}
                  </TransitionLink>
                </li>
              ) : item.id === 'work' ? (
                <ProjectsMenu key={item.id} onWorkClick={goTo(item.id)} />
              ) : item.id === 'contact' ? (
                <ContactMenu key={item.id} onContactClick={goTo(item.id)} />
              ) : item.id === 'cv' ? (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={openCv}
                    aria-haspopup="dialog"
                    className="mono-label opacity-70 transition-opacity hover:opacity-100"
                  >
                    {t(item.label)}
                  </button>
                </li>
              ) : (
                <li key={item.id}>
                  <TransitionLink
                    href={`/#${item.id}`}
                    onClick={goTo(item.id)}
                    className="mono-label opacity-70 transition-opacity hover:opacity-100"
                  >
                    {t(item.label)}
                  </TransitionLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5 min-[360px]:gap-3 sm:gap-5">
          <ConnectionsReadout />
          <LanguageToggle />
          <button
            ref={a11yButton}
            type="button"
            aria-expanded={a11yOpen}
            aria-label={t(COPY.a11y.open)}
            onClick={() => setA11yOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_18px_rgb(var(--signal)/0.4)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="4.5" r="1.8" />
              <path d="M5 8.5l7 1.5 7-1.5M12 10v5m0 0l-3.5 6M12 15l3.5 6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-expanded={quickOpen}
            aria-controls="mobile-quick-contact"
            aria-label={t(COPY.contact.menuTitle)}
            onClick={() => {
              setMenuOpen(false)
              setQuickOpen((v) => !v)
            }}
            className="flex h-8 items-center gap-1.5 rounded-full bg-signal px-3 text-on-signal transition-transform active:scale-95 lg:hidden"
          >
            {quickOpen ? (
              <span aria-hidden="true" className="text-sm leading-none">✕</span>
            ) : (
              <ContactIcon name="phone" className="h-3.5 w-3.5" />
            )}
            <span className="mono-label max-[359px]:sr-only">{t(COPY.nav.contact)}</span>
          </button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setQuickOpen(false)
              setMenuOpen((v) => !v)
            }}
            className="mono-label lg:hidden"
          >
            {menuOpen ? '✕' : 'Menu'}
          </button>
        </div>
      </div>

      {quickOpen && (
        <div id="mobile-quick-contact" className="relative border-t border-white/10 bg-[rgb(var(--void)/0.85)] px-[var(--gutter)] pb-5 pt-4 backdrop-blur-xl lg:hidden">
          <p className="mono-label opacity-60">{t(COPY.contact.menuTitle)}</p>
          <ContactQuickActions onNavigate={() => setQuickOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Principal móvil" className="relative max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-[rgb(var(--void)/0.88)] px-[var(--gutter)] py-6 backdrop-blur-xl lg:hidden">
          <ul className="space-y-4">
            {NAV.map((item, i) => (
              <li key={item.id} className="flex items-baseline gap-4">
                <span className="mono-label flex items-center gap-2 opacity-50">
                  <span className="h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-white/70 shadow-[0_0_8px_rgb(255_255_255/0.5)]" aria-hidden="true" />
                  0{i + 1}
                </span>
                {item.id === 'home' ? (
                  <TransitionLink href="/" transitionLabel="EG" onClick={goHome} className="brand-title text-2xl">
                    {t(item.label)}
                  </TransitionLink>
                ) : item.id === 'cv' ? (
                  <button type="button" onClick={openCv} aria-haspopup="dialog" className="brand-title text-2xl">
                    {t(item.label)}
                  </button>
                ) : (
                  <div className="min-w-0 flex-1">
                    <TransitionLink href={`/#${item.id}`} onClick={goTo(item.id)} className="brand-title text-2xl">
                      {t(item.label)}
                    </TransitionLink>
                    {item.id === 'work' && <ProjectsSubmenu onNavigate={() => setMenuOpen(false)} />}
                    {item.id === 'contact' && <ContactQuickActions onNavigate={() => setMenuOpen(false)} />}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      <A11yPanel open={a11yOpen} onClose={closeA11y} returnFocusTo={a11yButton} />
      <CvViewer open={cvOpen} onClose={closeCv} initialMode={cvMode} />
    </header>
  )
}
