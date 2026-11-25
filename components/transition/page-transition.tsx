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
/** Cierre: el porcentaje llega a 100 y las conexiones se sueltan */
const FINISH_S = 0.35
const DISSOLVE_S = 0.5
/** Al salir, la carga se disuelve en este tiempo (s), sin cortinilla */
const FADE_OUT_S = 0.7
/** La página nueva empieza a armarse un poco antes de que termine el salto (s) */
const REVEAL_LEAD_S = 0.2
/** La última neurona viaja hasta el destino de la página nueva (s) y se vuelve su anillo */
const SEED_S = 0.95
/** Espera breve tras el 100 %: la red guarda dónde quedó la última neurona */
const SEED_MEASURE_S = 0.06
/** Aviso a la página nueva: la carga se está yendo y ya puede armarse (ver `onPageReveal`) */
export const PAGE_REVEAL_EVENT = 'eg:page-reveal'

export interface PageRevealInfo {
  /** La última neurona de la carga llegó al `data-transition-target` de la página */
  seeded: boolean
}

/**
 * Llama a `start` cuando la página ya está a la vista: de inmediato si se llegó sin transición,
 * o cuando la carga entre páginas empieza a disolverse. Devuelve cómo cancelarlo.
 */
export function onPageReveal(start: (info: PageRevealInfo) => void): () => void {
  if (document.documentElement.dataset.transitioning !== 'true') {
    start({ seeded: false })
    return () => {}
  }
  const handler = (event: Event) => start({ seeded: (event as CustomEvent<PageRevealInfo>).detail?.seeded ?? false })
  window.addEventListener(PAGE_REVEAL_EVENT, handler, { once: true })
  return () => window.removeEventListener(PAGE_REVEAL_EVENT, handler)
}

/** Red de seguridad: si la navegación del cliente no llega, se carga la página completa. */
const HARD_NAV_MS = 12000

/**
 * Cortina de barras verticales (las barras de la hoja de vida) que cubre
 * la pantalla al salir de una página y se retira al entrar a la nueva.
 * Mientras cubre, se ve la misma carga del inicio, sin texto: la cámara entra
 * a la red mientras los nodos en primer plano se conectan. Al llegar la
 * página, la cámara salta hacia adelante y todo se disuelve.
 */
export function TransitionOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const seedRef = useRef<HTMLDivElement>(null)
  /** Dónde se ve la última neurona de la carga (px), para que viaje al destino */
  const anchorRef = useRef<{ x: number; y: number } | null>(null)
  const isCovering = useRef(false)
  const firstRoute = useRef(true)
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
    (href) => {
      if (reducedMotion || !rootRef.current) {
        router.push(href)
        return
      }
      // Pide la página mientras la cortina cubre: al terminar ya está lista.
      router.prefetch(href)
      counter.current.v = 0
      anchorRef.current = null
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
    let exit: gsap.core.Timeline | null = null
    const warp = () => gsap.to(dissolve, { v: 0, duration: DISSOLVE_S, ease: 'power2.in', onUpdate: () => { loadProgress.current = dissolve.v } })
    const reveal = (seeded: boolean) => { window.dispatchEvent(new CustomEvent<PageRevealInfo>(PAGE_REVEAL_EVENT, { detail: { seeded } })) }
    const finish = () => {
      setCovered(false)
      gsap.set(bars(), { scaleY: 0 })
      gsap.set(root, { visibility: 'hidden', opacity: 1 })
      if (seedRef.current) gsap.set(seedRef.current, { autoAlpha: 0 })
      delete document.documentElement.dataset.transitioning
      setShowNet(false)
    }
    const tl = gsap
      .timeline({ delay: wait })
      .to(counter.current, { v: 100, duration: FINISH_S, ease: 'power1.out', onUpdate: syncCounter })
      .to({}, { duration: SEED_MEASURE_S })
    tl.call(() => {
      const seed = seedRef.current
      const target = document.querySelector<HTMLElement>('[data-transition-target]')
      const from = anchorRef.current
      const box = target?.offsetParent?.getBoundingClientRect()
      if (!seed || !target || !from || !box) {
        // Sin destino: la cámara salta hacia adelante y todo se disuelve (sin cortinilla).
        exit = gsap.timeline()
          .add(warp())
          .call(() => reveal(false), undefined, DISSOLVE_S - REVEAL_LEAD_S)
          .to(root, { autoAlpha: 0, duration: FADE_OUT_S, ease: 'power2.out' }, DISSOLVE_S - REVEAL_LEAD_S)
          .call(finish)
        return
      }
      // Con destino: la última neurona queda encendida y viaja hasta él mientras la red se va;
      // al llegar crece hasta el tamaño del anillo y la página se arma desde ahí.
      const size = target.offsetWidth
      gsap.set(seed, { x: from.x, y: from.y, width: size, height: size, xPercent: -50, yPercent: -50, scale: 14 / size, autoAlpha: 1 })
      gsap.set(seed.querySelector('[data-seed-core]'), { autoAlpha: 1 })
      exit = gsap.timeline()
        .add(warp(), 0)
        .to(root, { autoAlpha: 0, duration: FADE_OUT_S, ease: 'power2.out' }, 0.15)
        .to(seed, { x: box.left + target.offsetLeft, y: box.top + target.offsetTop, scale: 1, duration: SEED_S, ease: 'expo.inOut' }, 0)
        .to(seed.querySelector('[data-seed-core]'), { autoAlpha: 0, duration: SEED_S * 0.6, ease: 'power1.in' }, SEED_S * 0.4)
        .call(() => reveal(true), undefined, SEED_S - 0.05)
        .to(seed, { autoAlpha: 0, duration: 0.25 }, SEED_S + 0.1)
        .call(finish)
    })
    return () => {
      exit?.kill()
      tl.kill()
    }
  }, [pathname])

  return (
    <>
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] flex"
      style={{ visibility: 'hidden' }}
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div key={i} data-bar className="h-full flex-1 bg-void" style={{ transform: 'scaleY(0)' }} />
      ))}
      {/* La misma carga del inicio: solo la red armándose en primer plano */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${covered ? 'opacity-100 delay-150' : 'opacity-0'}`}>
        {showNet && <NeuralFlight key={netKey} progress={loadProgress} anchor={anchorRef} className="absolute inset-0 h-full w-full" />}
      </div>
    </div>
    {/* La última neurona de la carga: viaja al destino de la página nueva y se vuelve su anillo */}
    <div
      ref={seedRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[71] rounded-full border border-white/70 shadow-[0_0_30px_6px_rgb(var(--signal)/0.55),inset_0_0_20px_rgb(var(--signal)/0.4)]"
      style={{ visibility: 'hidden' }}
    >
      <div data-seed-core className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#fff_0%,rgb(var(--signal))_35%,rgb(var(--signal)/0)_70%)]" />
    </div>
    </>
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
