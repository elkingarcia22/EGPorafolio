'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, scrollToTop } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

type Navigate = (href: string, label?: string) => void

let navigateHandler: Navigate | null = null

const BAR_COUNT = 6

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

  const bars = () => rootRef.current?.querySelectorAll<HTMLElement>('[data-bar]') ?? []

  const navigate = useCallback<Navigate>(
    (href, nextLabel = '') => {
      if (reducedMotion || !rootRef.current) {
        router.push(href)
        return
      }
      setLabel(nextLabel)
      isCovering.current = true
      gsap.set(rootRef.current, { visibility: 'visible' })
      gsap.fromTo(
        bars(),
        { scaleY: 0, transformOrigin: '50% 100%' },
        {
          scaleY: 1,
          duration: 0.55,
          ease: 'expo.inOut',
          stagger: 0.05,
          onComplete: () => router.push(href),
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

  // Al cambiar de ruta: arriba del todo y retirar la cortina.
  useEffect(() => {
    scrollToTop()
    if (!isCovering.current || !rootRef.current) return
    isCovering.current = false
    const root = rootRef.current
    gsap.to(bars(), {
      scaleY: 0,
      transformOrigin: '50% 0%',
      duration: 0.7,
      delay: 0.15,
      ease: 'expo.inOut',
      stagger: 0.05,
      onComplete: () => {
        gsap.set(root, { visibility: 'hidden' })
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
    </div>
  )
}

interface TransitionLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string
  /** Texto que se ve durante la transición (ej. "N° 01.24 · Proyecto") */
  transitionLabel?: string
}

/** Link interno que pasa por la cortina antes de navegar. */
export function TransitionLink({ href, transitionLabel, onClick, ...rest }: TransitionLinkProps) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
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
