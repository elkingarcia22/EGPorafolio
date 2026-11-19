'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, jumpToHash, scrollToTop } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

type Navigate = (href: string, label?: string) => void

let navigateHandler: Navigate | null = null

const BAR_COUNT = 6
/** Si la página no llega en este tiempo tras cubrir, la cortina muestra que está cargando. */
const LOADING_HINT_MS = 260
/** Red de seguridad: si la navegación del cliente no llega, se carga la página completa. */
const HARD_NAV_MS = 12000

/**
 * Cortina de barras verticales (las barras de la hoja de vida) que cubre
 * la pantalla al salir de una página y se retira al entrar a la nueva.
 */
export function TransitionOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const isCovering = useRef(false)
  const [label, setLabel] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const bars = () => rootRef.current?.querySelectorAll<HTMLElement>('[data-bar]') ?? []

  const navigate = useCallback<Navigate>(
    (href, nextLabel = '') => {
      if (reducedMotion || !rootRef.current) {
        router.push(href)
        return
      }
      // Pide la página mientras la cortina cubre: al terminar ya está lista.
      router.prefetch(href)
      setLabel(nextLabel)
      isCovering.current = true
      document.documentElement.dataset.transitioning = 'true'
      gsap.set(rootRef.current, { visibility: 'visible' })
      gsap.fromTo(
        bars(),
        { scaleY: 0, transformOrigin: '50% 100%' },
        {
          scaleY: 1,
          duration: 0.42,
          ease: 'expo.inOut',
          stagger: 0.03,
          onComplete: () => {
            router.push(href)
            clearTimers()
            timers.current = [
              window.setTimeout(() => setIsWaiting(true), LOADING_HINT_MS),
              window.setTimeout(() => window.location.assign(href), HARD_NAV_MS),
            ]
          },
        },
      )
    },
    [reducedMotion, router],
  )

  useEffect(() => {
    navigateHandler = navigate
    return () => {
      navigateHandler = null
    }
  }, [navigate])

  // Al cambiar de ruta: a la sección del ancla (Proyectos → /#work) o arriba del todo, y retirar la cortina.
  useEffect(() => {
    if (!jumpToHash()) scrollToTop()
    clearTimers()
    setIsWaiting(false)
    if (!isCovering.current || !rootRef.current) return
    isCovering.current = false
    const root = rootRef.current
    gsap.to(bars(), {
      scaleY: 0,
      transformOrigin: '50% 0%',
      duration: 0.55,
      ease: 'expo.inOut',
      stagger: 0.03,
      onComplete: () => {
        gsap.set(root, { visibility: 'hidden' })
        delete document.documentElement.dataset.transitioning
      },
    })
  }, [pathname])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] flex"
      style={{ visibility: 'hidden' }}
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div key={i} data-bar className="h-full flex-1 bg-void" style={{ transform: 'scaleY(0)' }} />
      ))}
      <p className="mono-label caret absolute bottom-8 left-[var(--gutter)] text-paper/70">{label}</p>
      {/* Mientras la página llega: una línea que recorre el borde y el aviso de carga */}
      <div className={`absolute inset-x-0 bottom-0 h-[2px] overflow-hidden transition-opacity duration-300 ${isWaiting ? 'opacity-100' : 'opacity-0'}`}>
        <span className="absolute inset-y-0 left-0 w-2/5 bg-signal" style={{ animation: isWaiting ? 'curtain-load 1.1s cubic-bezier(0.65,0,0.35,1) infinite' : 'none' }} />
      </div>
      <p className={`mono-label absolute bottom-8 right-[var(--gutter)] text-paper/45 transition-opacity duration-300 ${isWaiting ? 'opacity-100' : 'opacity-0'}`}>
        Cargando…
      </p>
    </div>
  )
}

interface TransitionLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string
  /** Texto que se ve durante la transición (ej. "N° 01.24 · Proyecto") */
  transitionLabel?: string
}

/** Link interno que pasa por la cortina antes de navegar. */
export function TransitionLink({ href, transitionLabel, onClick, onMouseEnter, ...rest }: TransitionLinkProps) {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <Link
      href={href}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        // Precarga al pasar el cursor: el clic ya no espera a la red.
        if (href.startsWith('/') && !href.startsWith('/#')) router.prefetch(href)
      }}
      onClick={(event) => {
        onClick?.(event)
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0
        if (event.defaultPrevented || modified || href === pathname || !navigateHandler) return
        event.preventDefault()
        navigateHandler(href, transitionLabel)
      }}
      {...rest}
    />
  )
}
