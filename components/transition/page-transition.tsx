'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NeuralFlight } from '@/components/home/neural-flight'
import { gsap, jumpToHash, scrollToTop } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { landingNode, landingOf, lightNode, sourcePoint, visibleElement } from './transition-nodes'

type Navigate = (href: string, label?: string, trigger?: Element | null) => void
type Cover = (action: () => void, trigger?: Element | null, fallback?: Element | null) => void

let navigateHandler: Navigate | null = null
let coverHandler: Cover | null = null

/**
 * La misma transición de nodo a nodo, sin cambiar de página: la red cubre la pantalla,
 * `action` cambia lo que hay debajo (p. ej. abre o cierra la hoja de vida) y la última
 * neurona aterriza en el nodo que quede a la vista (o en `fallback` si no hay ninguno, p. ej.
 * el botón que abrió la hoja de vida). Sin transición (movimiento reducido o antes de
 * montarse la cortina), `action` corre de inmediato.
 */
export function coverTransition(action: () => void, trigger?: Element | null, fallback?: Element | null): void {
  if (coverHandler) coverHandler(action, trigger, fallback)
  else action()
}

/** Salida: el nodo destella y la red se abre desde él (s) */
const ZOOM_S = 0.85
/** Destello del nodo de salida: crece y se apaga cuando la red ya se abrió */
const FLARE_PX = 46
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
 * Transición entre páginas que viaja de nodo a nodo: la cámara entra al nodo
 * de la sección donde se hizo clic (o al del proyecto) y la red se abre desde él.
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

  /** El avance que lee la red (0–1). */
  const syncCounter = () => {
    loadProgress.current = counter.current.v / 100
  }

  /** La red se abre desde el nodo de salida hasta cubrir la pantalla; luego corre `onCovered`. */
  const startCover = useCallback((trigger: Element | null | undefined, onCovered: () => void) => {
    const root = rootRef.current
    if (!root) return
    counter.current.v = 0
    anchorRef.current = null
    syncCounter()
    setNetKey((k) => k + 1)
    setShowNet(true)
    setCovered(true)
    isCovering.current = true
    document.documentElement.dataset.transitioning = 'true'
    const from = sourcePoint(trigger)
    const lens = { r: 0 }
    const reach = Math.hypot(Math.max(from.x, window.innerWidth - from.x), Math.max(from.y, window.innerHeight - from.y))
    const openLens = () => { root.style.clipPath = `circle(${lens.r}px at ${from.x}px ${from.y}px)` }
    openLens()
    gsap.set(root, { visibility: 'visible' })
    const seed = seedRef.current
    const tl = gsap.timeline({
      onComplete: () => {
        if (seed) gsap.set(seed, { autoAlpha: 0 })
        root.style.clipPath = ''
        coveredAt.current = performance.now()
        loadTween.current = gsap.to(counter.current, { v: WAIT_CAP * 100, duration: LOAD_S, ease: 'power2.out', onUpdate: syncCounter })
        onCovered()
      },
    })
    // El nodo se enciende y dispara la red, que se abre desde él hasta cubrir la pantalla.
    // (No se escala la página: es muy alta y acercarla trababa cada cuadro.)
    if (seed) {
      // Desde un anillo (la O) sale con su tamaño y destella; desde un nodo de sección, crece desde el punto.
      const ring = from.size ?? FLARE_PX
      gsap.set(seed, { x: from.x, y: from.y, width: ring, height: ring, xPercent: -50, yPercent: -50, scale: from.size ? 1 : 0.3, autoAlpha: 1 })
      gsap.set(seed.querySelector('[data-seed-core]'), { autoAlpha: 1 })
      tl.to(seed, { scale: from.size ? 1.25 : 1.6, duration: ZOOM_S * 0.45, ease: 'power2.out' }, 0)
        .to(seed, { scale: from.size ? 3 : 5, autoAlpha: 0, duration: ZOOM_S * 0.55, ease: 'power2.in' }, ZOOM_S * 0.45)
    }
    tl.to(lens, { r: reach, duration: ZOOM_S * 0.75, ease: 'expo.in', onUpdate: openLens }, ZOOM_S * 0.25)
  }, [])

  /**
   * Retira la cortina: la carga llega a 100, la última neurona aterriza en el nodo de destino
   * (o la cámara salta y todo se disuelve). Devuelve cómo cancelarlo.
   */
  const uncover = useCallback((fallback?: Element | null): (() => void) => {
    const root = rootRef.current
    if (!isCovering.current || !root) {
      setCovered(false)
      return () => {}
    }
    isCovering.current = false
    // La carga sigue avanzando mientras se cumple el tiempo mínimo: si la página llega enseguida
    // (producción), la red no se queda quieta y apagada esperando.
    const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - coveredAt.current)) / 1000
    const dissolve = { v: 1 }
    let exit: gsap.core.Timeline | null = null
    const warp = () => gsap.to(dissolve, { v: 0, duration: DISSOLVE_S, ease: 'power2.in', onUpdate: () => { loadProgress.current = dissolve.v } })
    const reveal = (seeded: boolean) => { window.dispatchEvent(new CustomEvent<PageRevealInfo>(PAGE_REVEAL_EVENT, { detail: { seeded } })) }
    const finish = () => {
      setCovered(false)
      gsap.set(root, { visibility: 'hidden', opacity: 1 })
      if (seedRef.current) gsap.set(seedRef.current, { autoAlpha: 0 })
      delete document.documentElement.dataset.transitioning
      setShowNet(false)
    }
    const tl = gsap
      .timeline({ delay: wait })
      .call(() => { loadTween.current?.kill() })
      .to(counter.current, { v: 100, duration: FINISH_S, ease: 'power1.out', onUpdate: syncCounter })
      .to({}, { duration: SEED_MEASURE_S })
    tl.call(() => {
      const seed = seedRef.current
      const target = landingNode() ?? visibleElement(fallback)
      const from = anchorRef.current
      const landing = target ? landingOf(target) : null
      if (!seed || !target || !from || !landing) {
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
      const size = landing.size
      gsap.set(seed, { x: from.x, y: from.y, width: size, height: size, xPercent: -50, yPercent: -50, scale: 14 / size, autoAlpha: 1 })
      gsap.set(seed.querySelector('[data-seed-core]'), { autoAlpha: 1 })
      exit = gsap.timeline()
        .add(warp(), 0)
        .to(root, { autoAlpha: 0, duration: FADE_OUT_S, ease: 'power2.out' }, 0.15)
        .to(seed, { x: landing.x, y: landing.y, scale: 1, duration: SEED_S, ease: 'expo.inOut' }, 0)
        .to(seed.querySelector('[data-seed-core]'), { autoAlpha: 0, duration: SEED_S * 0.6, ease: 'power1.in' }, SEED_S * 0.4)
        .call(() => { lightNode(target); reveal(true) }, undefined, SEED_S - 0.05)
        .to(seed, { autoAlpha: 0, duration: 0.25 }, SEED_S + 0.1)
        .call(finish)
    })
    return () => {
      exit?.kill()
      tl.kill()
    }
  }, [])

  const navigate = useCallback<Navigate>(
    (href, _label, trigger) => {
      if (reducedMotion || !rootRef.current) {
        router.push(href)
        return
      }
      // Pide la página mientras la cortina cubre: al terminar ya está lista.
      router.prefetch(href)
      startCover(trigger, () => {
        router.push(href)
        clearTimers()
        timers.current = [window.setTimeout(() => window.location.assign(href), HARD_NAV_MS)]
      })
    },
    [reducedMotion, router, startCover],
  )

  /** Sin cambiar de página: tras cubrir, `action` cambia lo de debajo y la cortina se retira. */
  const inlineUncover = useRef<(() => void) | null>(null)
  const cover = useCallback<Cover>(
    (action, trigger, fallback) => {
      if (reducedMotion || !rootRef.current || isCovering.current) {
        action()
        return
      }
      startCover(trigger, () => {
        action()
        // Dos cuadros: lo nuevo (p. ej. el visor) ya está montado y medido cuando aterriza la neurona.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          inlineUncover.current = uncover(fallback)
        }))
      })
    },
    [reducedMotion, startCover, uncover],
  )

  useEffect(() => {
    coverHandler = cover
    return () => {
      coverHandler = null
      inlineUncover.current?.()
    }
  }, [cover])

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
    return uncover()
  }, [pathname, uncover])

  return (
    <>
    <div
      ref={rootRef}
      data-palette-scope
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] flex"
      style={{ visibility: 'hidden' }}
    >
      {/* El fondo de la red: se abre en círculo desde el nodo de salida */}
      <div className="absolute inset-0 bg-void" />
      {/* La misma carga del inicio: solo la red armándose en primer plano */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${covered ? 'opacity-100 delay-150' : 'opacity-0'}`}>
        {showNet && <NeuralFlight key={netKey} progress={loadProgress} anchor={anchorRef} className="absolute inset-0 h-full w-full" />}
      </div>
    </div>
    {/* La última neurona de la carga: viaja al destino de la página nueva y se vuelve su anillo */}
    <div
      ref={seedRef}
      data-palette-scope
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[96] rounded-full border border-white/70 shadow-[0_0_30px_6px_rgb(var(--signal)/0.55),inset_0_0_20px_rgb(var(--signal)/0.4)]"
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
        navigateHandler(href, transitionLabel, event.currentTarget)
      }}
      {...rest}
    />
  )
}
