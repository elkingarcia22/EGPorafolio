'use client'

import { useEffect, useRef, useState } from 'react'
import { NetworkCanvas, type NetworkGraph } from '@/components/signal/network-canvas'
import { buildGlyphGraph } from '@/components/signal/glyph-graph'
import { ToneSection } from '@/components/ui/tone-section'
import { ScrollCue } from './scroll-cue'
import { HoverTuneLabel } from './hover-tune-label'
import { gsap, scrambleText } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

/** Duración mínima de la carga (la red central se arma en este tiempo) */
const LOAD_S = 2.2
/** Pausa con la red ya formada antes de deshacerse */
const LOAD_HOLD_S = 0.45
/** Red de la carga: nodos en una franja horizontal */
const LOADER_NODES = 22
const LOADER_ASPECT = 2.6
const LOADER_LINK = 0.2

/** Red pequeña para la carga: nodos repartidos en una franja, unidos con sus vecinos. */
function createLoaderGraph(): NetworkGraph {
  const nodes = Array.from({ length: LOADER_NODES }, (_, i) => ({
    x: 0.04 + (i / (LOADER_NODES - 1)) * 0.92 + (Math.random() - 0.5) * 0.05,
    y: 0.15 + Math.random() * 0.7,
  }))
  const links: [number, number][] = []
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const dx = (nodes[a].x - nodes[b].x) * LOADER_ASPECT
      const dy = nodes[a].y - nodes[b].y
      if (Math.hypot(dx, dy) < LOADER_LINK * LOADER_ASPECT) links.push([a, b])
    }
  }
  return { nodes, links, aspect: LOADER_ASPECT }
}
/** Momento en que empieza a escribirse el titular */
const HEADLINE_AT = LOAD_S + LOAD_HOLD_S + 0.45

/** Elementos que arrancan ocultos y aparecen en el arranque del hero. */
const BOOT_HIDDEN = 'opacity-0'

/**
 * Arranque: no hay pantalla de carga aparte. La estática aparece en
 * negro mientras carga, el titular "Todo producto empieza como ideas desconectadas"
 * se descifra desde caracteres de ruido y luego aparece la invitación
 * a deslizar. Encabezado y contador se integran en la misma escena.
 */
function useBoot(
  root: React.RefObject<HTMLDivElement | null>,
  headline: string,
  loaderProgress: React.MutableRefObject<number>,
  reducedMotion: boolean,
) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const q = gsap.utils.selector(el)
    const header = document.querySelector<HTMLElement>('[data-site-header]')
    const targets = [...q('[data-boot]'), ...(header ? [header] : [])]

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1 })
      gsap.set(q('[data-boot-counter]'), { autoAlpha: 0 })
      return
    }

    const counterEl = q('[data-boot-count]')[0] as HTMLElement | undefined
    const textEl = q('[data-boot-text]')[0] as HTMLElement | undefined
    const counter = { v: 0 }
    const dissolve = { v: 0 }
    loaderProgress.current = 0
    let cancelScramble: (() => void) | null = null
    if (header) gsap.set(header, { opacity: 0 })

    const tl = gsap.timeline({ paused: true })
    // 1 · Carga: en el centro una red se arma (nodos que llegan y se
    //     conectan) al ritmo del porcentaje.
    tl.to(q('[data-boot="field"]'), { opacity: 1, duration: 2.4, ease: 'power2.out' }, 0)
      .to(counter, {
        v: 100,
        duration: LOAD_S,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (counterEl) counterEl.textContent = String(Math.round(counter.v)).padStart(3, '0')
          loaderProgress.current = counter.v / 100
        },
      }, 0)
      // 2 · La red se deshace (los nodos vuelven a dispersarse) y desaparece.
      .to(dissolve, {
        v: 1,
        duration: 0.5,
        ease: 'power2.in',
        onUpdate: () => {
          loaderProgress.current = 1 - dissolve.v
        },
      }, LOAD_S + LOAD_HOLD_S)
      .to(q('[data-boot-counter]'), { autoAlpha: 0, filter: 'blur(8px)', scale: 0.96, duration: 0.4 }, LOAD_S + LOAD_HOLD_S + 0.15)
      // 3 · Empieza a escribirse el titular.
      .set(q('[data-boot="text"]'), { opacity: 1 }, HEADLINE_AT)
      .call(() => {
        if (textEl) cancelScramble = scrambleText(textEl, headline, 1100)
      }, undefined, HEADLINE_AT)
      .to(header ? [header] : [], { opacity: 1, duration: 0.8 }, HEADLINE_AT + 0.9)
      .fromTo(q('[data-boot="cue"]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, HEADLINE_AT + 1.2)

    // Espera a las fuentes para que el titular se descifre ya con su tipografía.
    let started = false
    const start = () => {
      if (started) return
      started = true
      tl.play()
    }
    document.fonts?.ready.then(start).catch(start)
    const fallback = window.setTimeout(start, 1500)

    return () => {
      window.clearTimeout(fallback)
      cancelScramble?.()
      tl.kill()
      if (header) gsap.set(header, { opacity: 1 })
    }
  }, [root, headline, loaderProgress, reducedMotion])
}

/**
 * Hero en tres tiempos, controlados por el scroll:
 * 1. "Todo producto empieza como ideas desconectadas."  (estática)
 * 2. "Mi trabajo es encontrar las conexiones…"  (la red se arma)
 * 3. Firma: elkin / GARCIA, como en la hoja de vida.
 */
export function Hero() {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const sectionRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [hoveringEg, setHoveringEg] = useState(false)
  const [heroInView, setHeroInView] = useState(true)
  const [egGraph, setEgGraph] = useState<NetworkGraph | null>(null)

  // El EG como red: nodos dentro de las letras y líneas que arman la forma.
  useEffect(() => {
    let cancelled = false
    buildGlyphGraph('EG', window.innerWidth < 768)
      .then((graph) => {
        if (!cancelled) setEgGraph(graph)
      })
      .catch(() => {
        // Sin canvas el hero sigue funcionando con su tipografía.
      })
    return () => {
      cancelled = true
    }
  }, [])
  const headline = t(COPY.hero.noise)

  const loaderProgress = useRef(0)
  const [loaderGraph, setLoaderGraph] = useState<NetworkGraph | null>(null)
  useEffect(() => setLoaderGraph(createLoaderGraph()), [])
  useBoot(sectionRef, headline, loaderProgress, reducedMotion)

  // La etiqueta del EG nunca debe verse fuera del hero.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting))
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const q = gsap.utils.selector(section)

    if (reducedMotion) {
      progress.current = 1
      gsap.set(q('[data-phase]'), { autoAlpha: 0 })
      gsap.set(q('[data-phase="name"]'), { autoAlpha: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = gsap.utils.clamp(0, 1, self.progress / 0.72)
          },
        },
      })
      tl.to(q('[data-hint-wrap]'), { autoAlpha: 0, y: 30, duration: 0.06 }, 0.02)
        .to(q('[data-phase="noise"]'), { autoAlpha: 0, filter: 'blur(12px)', y: -40, duration: 0.18 }, 0.12)
        .fromTo(q('[data-phase="signal"]'), { autoAlpha: 0, y: 40, filter: 'blur(12px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.14 }, 0.32)
        .to(q('[data-phase="signal"]'), { autoAlpha: 0, y: -40, duration: 0.12 }, 0.58)
        .fromTo(q('[data-phase="name"]'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.7)
        .fromTo(q('[data-bar]'), { scaleY: 0 }, { scaleY: 1, duration: 0.14, stagger: 0.03 }, 0.72)
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" aria-label="Elkin Garcia">
      <noscript>
        <style>{'[data-boot]{opacity:1!important}'}</style>
      </noscript>
      <div ref={sectionRef} data-header-clear className="relative h-[320vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div data-boot="field" className={`absolute inset-0 ${BOOT_HIDDEN}`}>
            <NetworkCanvas
              graph={egGraph}
              progress={progress}
              reducedMotion={reducedMotion}
              fit={{ width: 0.62, height: 0.42, centerY: 0.38 }}
              noiseDots={1600}
              sweep
              cursorRadius={0.32}
              onHoverChange={setHoveringEg}
              className="absolute inset-0"
            />
          </div>

          {/* Contador de arranque (se integra en la escena, sin pantalla aparte) */}
          <div data-boot-counter aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-[var(--gutter)]">
            <NetworkCanvas
              graph={loaderGraph}
              progress={loaderProgress}
              reducedMotion={reducedMotion}
              cursorRadius={0}
              className="relative h-[clamp(120px,22vw,190px)] w-[min(86vw,500px)]"
            />
            <span className="mono-label flex items-center gap-3 tabular-nums opacity-60">
              <span className="h-px w-8 bg-current" />
              <span>{t(COPY.hero.loading)} · <span data-boot-count>000</span>%</span>
              <span className="h-px w-8 bg-current" />
            </span>
          </div>

          {/* 1 · Ruido */}
          <div data-phase="noise" className="pointer-events-none absolute inset-0 flex items-end px-[var(--gutter)] pb-[26vh] md:pb-[22vh]">
            <p
              data-boot="text"
              className={`max-w-[14ch] text-[clamp(2.5rem,1rem+6vw,6.5rem)] font-light leading-[0.95] tracking-tight ${BOOT_HIDDEN}`}
            >
              <span data-boot-text>{headline}</span>
            </p>
          </div>

          {/* 2 · Señal */}
          <div data-phase="signal" className="pointer-events-none invisible absolute inset-0 flex items-end justify-end px-[var(--gutter)] pb-[7vh] text-right">
            <p className="max-w-[18ch] text-[clamp(2.1rem,1rem+4.2vw,5rem)] font-light leading-[0.98] tracking-tight">
              {t(COPY.hero.signal).replace(/\.$/, '')}
              <span className="text-signal">.</span>
            </p>
          </div>

          {/* 3 · Firma (lockup de la hoja de vida) */}
          <div data-phase="name" className="invisible absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-10">
            <div className="flex items-end gap-5">
              <span data-bar className="brand-bar h-[clamp(6rem,14vw,12rem)] origin-bottom" aria-hidden="true" />
              <h1 className="leading-[0.85]">
                <span className="block text-[clamp(2rem,1rem+4vw,4.5rem)] font-light lowercase">{PROFILE.firstName}</span>
                <span className="block text-[clamp(3rem,1rem+9vw,10rem)] font-medium tracking-[0.12em]">{PROFILE.lastName}</span>
              </h1>
            </div>
            <div className="mt-6 flex flex-col gap-4 md:ml-[calc(6px+1.25rem)] md:flex-row md:items-end md:justify-between">
              <p className="flex items-center gap-3 text-lg">
                <span data-bar className="h-6 w-px origin-bottom bg-current" aria-hidden="true" />
                {t(PROFILE.role)}
              </p>
              <p className="max-w-md text-sm leading-relaxed opacity-70">{t(COPY.hero.tagline)}</p>
            </div>
          </div>

          <HoverTuneLabel visible={hoveringEg && heroInView} />

          <div data-hint-wrap className="pointer-events-none absolute inset-0">
            <div data-boot="cue" className={`absolute inset-0 [&>button]:pointer-events-auto ${BOOT_HIDDEN}`}>
              <ScrollCue />
            </div>
          </div>
        </div>
      </div>
    </ToneSection>
  )
}
