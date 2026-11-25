'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NeuralFlight } from '@/components/home/neural-flight'
import { gsap, jumpToHash, scrollToTop } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

type Navigate = (href: string, label?: string) => void

let navigateHandler: Navigate | null = null

const BAR_COUNT = 6
/** Mientras llega la página, el porcentaje sube hasta aquí (0–1) y espera */
const WAIT_CAP = 0.9
/** Lo que tarda en llegar a ese tope, como la carga del inicio */
const LOAD_S = 2.2
/** Tiempo mínimo con la red a la vista: alcanza a tejer las conexiones en primer plano */
const MIN_SHOW_MS = 1400
/** El nombre del proyecto aparece palabra por palabra, como el titular del inicio */
const LABEL_AT_S = 0.35
const LABEL_STAGGER_S = 0.08
/** Cierre: el porcentaje llega a 100 y las conexiones se sueltan */
const FINISH_S = 0.35
const DISSOLVE_S = 0.5
/** Red de seguridad: si la navegación del cliente no llega, se carga la página completa. */
const HARD_NAV_MS = 12000

/**
 * Cortina de barras verticales (las barras de la hoja de vida) que cubre
 * la pantalla al salir de una página y se retira al entrar a la nueva.
 * Mientras cubre, se ve la misma carga del inicio: la cámara entra a la red
 * mientras los nodos en primer plano se conectan, y el nombre del destino
 * aparece palabra por palabra. Al llegar la página, la cámara salta hacia
 * adelante y la cortina se retira.
 */
export function TransitionOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
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

  /** El avance que lee la red (0–1). */
  const syncCounter = () => {
    loadProgress.current = counter.current.v / 100
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

  // El nombre del destino entra palabra por palabra cuando la cortina ya cubre.
  useEffect(() => {
    const words = labelRef.current?.querySelectorAll('[data-label-word]')
    if (!covered || !words?.length) return
    const tween = gsap.fromTo(words, { autoAlpha: 0, yPercent: 55, filter: 'blur(10px)' }, {
      autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: LABEL_STAGGER_S, ease: 'expo.out', delay: LABEL_AT_S,
    })
    return () => {
      tween.kill()
    }
  }, [covered, label, netKey])

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
      {/* La misma carga del inicio: la red armándose en primer plano y el nombre del destino */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${covered ? 'opacity-100 delay-150' : 'opacity-0'}`}>
        {showNet && <NeuralFlight key={netKey} progress={loadProgress} className="absolute inset-0 h-full w-full" />}
        <div className="relative flex h-full items-end justify-center px-[var(--gutter)] pb-[18svh]">
          {label && (
            <p ref={labelRef} className="max-w-3xl text-center text-[clamp(1.6rem,1rem+2.4vw,3.2rem)] font-light leading-[1.05] tracking-tight text-paper [text-shadow:0_2px_18px_rgb(var(--void)/0.85)]">
              {label.split(' ').map((word, i, all) => (
                <span key={`${netKey}-${i}`} data-label-word className="inline-block opacity-0">
                  {word}
                  {i < all.length - 1 && '\u00a0'}
                </span>
              ))}
            </p>
          )}
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
