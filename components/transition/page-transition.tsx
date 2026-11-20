'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ConnectionSearch } from '@/components/home/connection-search'
import { gsap, jumpToHash, scrollToTop } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

type Navigate = (href: string, label?: string) => void

let navigateHandler: Navigate | null = null

const BAR_COUNT = 6
/** Mientras llega la página, el porcentaje sube hasta aquí (0–1) y espera */
const WAIT_CAP = 0.9
/** Lo que tarda en llegar a ese tope, como la carga del inicio */
const LOAD_S = 2.2
/** Tiempo mínimo con la red a la vista: alcanza a buscar y tejer algunas conexiones */
const MIN_SHOW_MS = 900
/** Cierre: el porcentaje llega a 100 y las conexiones se sueltan */
const FINISH_S = 0.35
const DISSOLVE_S = 0.5
/** Red de seguridad: si la navegación del cliente no llega, se carga la página completa. */
const HARD_NAV_MS = 12000

/**
 * Cortina de barras verticales (las barras de la hoja de vida) que cubre
 * la pantalla al salir de una página y se retira al entrar a la nueva.
 * Mientras cubre, se ve la misma carga del inicio: nodos que buscan
 * conectarse y el porcentaje de la conexión.
 */
export function TransitionOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const isCovering = useRef(false)
  const firstRoute = useRef(true)
  const [label, setLabel] = useState('')
  /** La cortina ya tapa la pantalla: se muestra el centro (carga y página). */
  const [covered, setCovered] = useState(false)
  /** Cada navegación monta una red nueva (la anterior se detiene al soltarse) */
  const [netKey, setNetKey] = useState(0)
  const [showNet, setShowNet] = useState(false)
  const loadProgress = useRef(0)
  const counter = useRef({ v: 0 })
  const coveredAt = useRef(0)
  const loadTween = useRef<gsap.core.Tween | null>(null)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const bars = () => rootRef.current?.querySelectorAll<HTMLElement>('[data-bar]') ?? []

  /** El porcentaje en pantalla y el avance que lee la red, siempre juntos. */
  const syncCounter = () => {
    loadProgress.current = counter.current.v / 100
    if (countRef.current) countRef.current.textContent = String(Math.round(counter.current.v)).padStart(3, '0')
  }

  const navigate = useCallback<Navigate>(
    (href, nextLabel = '') => {
      if (reducedMotion || !rootRef.current) {
        router.push(href)
        return
      }
      // Pide la página mientras la cortina cubre: al terminar ya está lista.
      router.prefetch(href)
      setLabel(nextLabel)
      counter.current.v = 0
      syncCounter()
      setNetKey((k) => k + 1)
      setShowNet(true)
      setCovered(true)
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
            coveredAt.current = performance.now()
            router.push(href)
            loadTween.current = gsap.to(counter.current, { v: WAIT_CAP * 100, duration: LOAD_S, ease: 'power2.out', onUpdate: syncCounter })
            clearTimers()
            timers.current = [window.setTimeout(() => window.location.assign(href), HARD_NAV_MS)]
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

  // Al cambiar de ruta: a la sección del ancla (Proyectos → /#work) o arriba del todo; la carga
  // llega a 100, las conexiones se sueltan y la cortina se retira.
  useEffect(() => {
    // En la primera carga el navegador ya resuelve el ancla; saltar aquí choca con las animaciones que se arman.
    if (firstRoute.current) firstRoute.current = false
    else if (!jumpToHash()) scrollToTop()
    clearTimers()
    if (!isCovering.current || !rootRef.current) {
      setCovered(false)
      return
    }
    isCovering.current = false
    const root = rootRef.current
    loadTween.current?.kill()
    const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - coveredAt.current)) / 1000
    const dissolve = { v: 1 }
    const tl = gsap
      .timeline({ delay: wait })
      .to(counter.current, { v: 100, duration: FINISH_S, ease: 'power1.out', onUpdate: syncCounter })
      .call(() => setCovered(false))
      .to(dissolve, { v: 0, duration: DISSOLVE_S, ease: 'power2.in', onUpdate: () => { loadProgress.current = dissolve.v } })
      .to(bars(), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.55, ease: 'expo.inOut', stagger: 0.03 }, '<0.1')
      .call(() => {
        gsap.set(root, { visibility: 'hidden' })
        delete document.documentElement.dataset.transitioning
        setShowNet(false)
      })
    return () => {
      tl.kill()
    }
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
      {/* La misma carga del inicio: nodos que buscan conectarse y el porcentaje */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${covered ? 'opacity-100 delay-150' : 'opacity-0'}`}>
        {showNet && <ConnectionSearch key={netKey} progress={loadProgress} className="absolute inset-0 h-full w-full" />}
        <div className="relative flex h-full flex-col items-center justify-center gap-5 px-[var(--gutter)]">
          <span className="mono-label flex items-center gap-3 tabular-nums text-paper/70">
            <span className="h-px w-8 bg-current" />
            <span>{t(COPY.hero.loading)} · <span ref={countRef}>000</span>%</span>
            <span className="h-px w-8 bg-current" />
          </span>
          {label && <p className="mono-label caret text-paper/80">{label}</p>}
        </div>
      </div>
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
