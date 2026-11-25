'use client'

import { useEffect, useRef, useState } from 'react'
import { NetworkCanvas } from '@/components/signal/network-canvas'
import { NeuralFlight } from './neural-flight'
import { EgJourney } from './eg-journey'
import { NeuralBackdrop } from './neural-backdrop'
import { useIntroAutoplay } from './use-intro-autoplay'
import { ToneSection } from '@/components/ui/tone-section'
import { ScrollCue } from './scroll-cue'
import { HoverTuneLabel } from './hover-tune-label'
import { useMonogramCycle } from './use-monogram-cycle'
import { useHeroSnap, type HeroSnap } from './use-hero-snap'
import { gsap, scrollToHeroSignature, HERO_SIGNATURE_AT } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

/** Duración mínima de la carga: el viaje de neurona en neurona */
const LOAD_S = 3.6
/** Pausa con la red ya formada antes de deshacerse */
const LOAD_HOLD_S = 0.9
/** Momento en que empieza a escribirse el titular */
const HEADLINE_AT = LOAD_S + LOAD_HOLD_S + 0.75
/** Tiempo para leer el titular antes de que la entrada siga sola (desde que empieza a aparecer) */
const INTRO_READ_S = 2.3
/** Duración del salto final hacia el titular */
const WARP_S = 0.9

/** Elementos que arrancan ocultos y aparecen en el arranque del hero. */
const BOOT_HIDDEN = 'opacity-0'

/** Al volver al inicio: espera a que la cortina se retire y baja hasta el EG. */
const AUTO_SCROLL_DELAY_MS = 900
const AUTO_SCROLL_S = 2.4
/** Si al arrancar la página ya está deslizada más que esto, la carga se salta. */
const SCROLLED_PX = 80

/** Encuadre del EG en el lienzo */
const EG_FIT = { width: 0.62, height: 0.42, centerY: 0.38 }

/** Momentos de la línea de tiempo del hero en que se leen el puente y la firma */
const SIGNAL_READ_AT = 0.3
const NAME_READ_AT = 0.7
/** Margen para volver a esconderlos al subir (evita parpadeos justo en el borde) */
const READ_HYSTERESIS = 0.03

/** Momento de la línea de tiempo en que el puente ("Mi trabajo es diseñar…") está completo */
const SIGNAL_REST_AT = 0.52

/**
 * La carga solo se ve una vez por visita. Si vuelves al inicio desde otra página,
 * el hero aparece ya armado.
 */
let hasBooted = false

/**
 * Si se llega al inicio desde otra página del sitio: ya se vio la carga aquí, o la visita
 * empezó en otra ruta (por ejemplo, directo en un proyecto) y se navegó hasta el inicio.
 */
function arrivedFromAnotherPage(): boolean {
  if (hasBooted) return true
  if (typeof window === 'undefined') return false
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (!entry) return false
  // El hero solo vive en el inicio; al renderizarse, la URL aún puede ser la anterior.
  return new URL(entry.name).pathname !== '/'
}

/**
 * Arranque: no hay pantalla de carga aparte. La estática aparece en
 * negro mientras carga, el titular "Todo producto nace de una conexión…"
 * aparece desde el desenfoque y luego aparece la invitación
 * a deslizar. Encabezado y contador se integran en la misma escena.
 */
function useBoot(
  root: React.RefObject<HTMLDivElement | null>,
  headline: string,
  loaderProgress: React.MutableRefObject<number>,
  reducedMotion: boolean,
  skipLoading: boolean,
  onIntroRead: React.MutableRefObject<() => void>,
) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const q = gsap.utils.selector(el)
    const header = document.querySelector<HTMLElement>('[data-site-header]')
    const targets = [...q('[data-boot]'), ...(header ? [header] : [])]

    if (reducedMotion || skipLoading) {
      hasBooted = true
      gsap.set(targets, { opacity: 1 })
      gsap.set(q('[data-boot-counter]'), { autoAlpha: 0 })
      loaderProgress.current = 0
      return
    }
    hasBooted = true

    const counterEl = q('[data-boot-count]')[0] as HTMLElement | undefined
    const counter = { v: 0 }
    const dissolve = { v: 0 }
    loaderProgress.current = 0
    if (header) gsap.set(header, { opacity: 0 })

    const tl = gsap.timeline({ paused: true })
    // 1 · Carga: un viaje por la red neuronal, de neurona en neurona, al
    //     ritmo del porcentaje (ver <NeuralFlight>).
    tl.set(q('[data-boot="field"]'), { opacity: 0 }, 0)
      .to(counter, {
        v: 100,
        duration: LOAD_S,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (counterEl) counterEl.textContent = String(Math.round(counter.v)).padStart(3, '0')
          loaderProgress.current = counter.v / 100
        },
      }, 0)
      // 2 · Salto: la cámara acelera hacia adelante y la carga desaparece.
      .to(dissolve, {
        v: 1,
        duration: WARP_S,
        ease: 'power2.in',
        onUpdate: () => {
          loaderProgress.current = 1 - dissolve.v
        },
      }, LOAD_S + LOAD_HOLD_S)
      .to(q('[data-boot-counter] [data-boot-label]'), { autoAlpha: 0, filter: 'blur(8px)', scale: 0.96, duration: 0.4 }, LOAD_S + LOAD_HOLD_S + 0.05)
      .to(q('[data-boot-counter]'), { autoAlpha: 0, duration: 0.3 }, LOAD_S + LOAD_HOLD_S + WARP_S)
      // La estática del hero aparece cuando el salto termina: del viaje al ruido.
      .to(q('[data-boot="field"]'), { opacity: 1, duration: 0.9, ease: 'power2.out' }, LOAD_S + LOAD_HOLD_S + WARP_S * 0.6)
      // 3 · El titular aparece limpio: sube y pasa de desenfocado a nítido.
      .fromTo(
        q('[data-boot="text"]'),
        { opacity: 0, y: 36, filter: 'blur(14px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', clearProps: 'filter' },
        HEADLINE_AT,
      )
      .to(header ? [header] : [], { opacity: 1, duration: 0.8 }, HEADLINE_AT + 0.9)
      .fromTo(q('[data-boot="cue"]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, HEADLINE_AT + 1.2)
      // 4 · Leído el titular, la entrada sigue sola hasta el EG y la firma.
      .call(() => onIntroRead.current(), undefined, HEADLINE_AT + INTRO_READ_S)

    // Espera a las fuentes para que el titular aparezca ya con su tipografía.
    let started = false
    const start = () => {
      if (started) return
      started = true
      tl.play()
    }
    document.fonts?.ready.then(start).catch(start)
    const fallback = window.setTimeout(start, 1500)

    // Al recargar con el scroll ya abajo (el navegador lo restaura), la carga no se queda
    // encima del EG: se completa al instante. Igual si se desliza mientras carga.
    const finishIfScrolled = () => {
      if (window.scrollY < SCROLLED_PX) return
      started = true
      tl.progress(1)
      window.removeEventListener('scroll', finishIfScrolled)
    }
    window.addEventListener('scroll', finishIfScrolled, { passive: true })
    finishIfScrolled()

    return () => {
      window.removeEventListener('scroll', finishIfScrolled)
      window.clearTimeout(fallback)
      tl.kill()
      if (header) gsap.set(header, { opacity: 1 })
    }
  }, [root, headline, loaderProgress, reducedMotion, skipLoading, onIntroRead])
}

/** Una línea de la firma, letra por letra, detrás de una máscara (sube al leerse). */
function SplitLine({ text, className }: { text: string; className: string }) {
  return (
    <span aria-hidden="true" className={`block overflow-hidden pb-[0.06em] ${className}`}>
      {Array.from(text).map((char, i) => (
        <span key={i} data-read-char className="inline-block">
          {char}
        </span>
      ))}
    </span>
  )
}

/**
 * Hero en tres tiempos, controlados por el scroll:
 * 1. "Todo producto nace de una conexión entre lo que somos y lo que necesitamos."
 * 2. "Mi trabajo es diseñar el puente entre las dos."  (la red se arma)
 * 3. Firma: elkin / GARCIA, como en la hoja de vida.
 */
export function Hero() {
  const { reducedMotion } = useA11y()
  const { t, locale } = useLocale()
  const sectionRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [heroInView, setHeroInView] = useState(true)
  // Pasos en los que el hero puede quedar quieto: titular, puente, firma con el EG y salida.
  const snap = useRef<HeroSnap>({ trigger: null, rests: [] })
  useHeroSnap(snap, !reducedMotion)
  // El EG como red, que se transforma en UX, UI, CX… y vuelve al EG.
  // El EG lo arma el viaje (con tiempo propio); con movimiento reducido, el scroll.
  const egProgress = useRef(0)
  const egReveal = useRef(reducedMotion ? 1 : 0)
  const figureProgress = reducedMotion ? progress : egProgress
  const monogram = useMonogramCycle(locale, figureProgress, heroInView, reducedMotion)
  const headline = t(COPY.hero.noise)

  const loaderProgress = useRef(0)
  // Se decide al montar, antes de que useBoot marque la carga como vista.
  const [isReturn] = useState(arrivedFromAnotherPage)
  // Primera visita: después del titular, la entrada baja sola hasta el EG y la firma.
  const startIntro = useIntroAutoplay(snap, !reducedMotion && !isReturn)
  const introRef = useRef(startIntro)
  introRef.current = () => {
    if (!window.location.hash) startIntro()
  }
  useBoot(sectionRef, headline, loaderProgress, reducedMotion, isReturn, introRef)

  // De vuelta desde otra página: arranca en el titular y, cuando la cortina se retira,
  // el scroll baja solo hasta el EG con la firma.
  useEffect(() => {
    if (!isReturn || window.location.hash) return
    const timer = window.setTimeout(() => scrollToHeroSignature(AUTO_SCROLL_S), AUTO_SCROLL_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [isReturn])

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
        .fromTo(q('[data-phase="signal"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.3)
        .to(q('[data-phase="signal"]'), { autoAlpha: 0, y: -40, filter: 'blur(8px)', duration: 0.12 }, 0.58)
        .fromTo(q('[data-phase="name"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.7)
        .fromTo(q('[data-bar]'), { scaleY: 0 }, { scaleY: 1, duration: 0.14, stagger: 0.03 }, 0.72)

      // Lectura con tiempo propio (no sigue la velocidad del scroll): el puente
      // aparece palabra por palabra y la firma letra por letra, al ritmo de leer.
      const signalRead = gsap.timeline({ paused: true }).fromTo(
        q('[data-read-word]'),
        { autoAlpha: 0, yPercent: 55, filter: 'blur(10px)' },
        { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.11, ease: 'expo.out' },
      )
      const nameRead = gsap.timeline({ paused: true })
        .fromTo(q('[data-read-char]'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.045, ease: 'expo.out' })
        .fromTo(q('[data-read-meta]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' }, '-=0.7')
      let signalShown = false
      let nameShown = false
      tl.eventCallback('onUpdate', () => {
        const at = tl.time()
        if (!signalShown && at >= SIGNAL_READ_AT) {
          signalShown = true
          signalRead.restart()
        } else if (signalShown && at < SIGNAL_READ_AT - READ_HYSTERESIS) {
          signalShown = false
          signalRead.pause(0)
        }
        if (!nameShown && at >= NAME_READ_AT) {
          nameShown = true
          nameRead.restart()
        } else if (nameShown && at < NAME_READ_AT - READ_HYSTERESIS) {
          nameShown = false
          nameRead.pause(0)
        }
      })

      snap.current = {
        trigger: tl.scrollTrigger ?? null,
        rests: [0, SIGNAL_REST_AT / tl.duration(), HERO_SIGNATURE_AT, 1],
      }
    }, section)

    return () => {
      snap.current = { trigger: null, rests: [] }
      ctx.revert()
    }
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" aria-label="Elkin Garcia">
      <noscript>
        <style>{'[data-boot]{opacity:1!important}'}</style>
      </noscript>
      <div ref={sectionRef} data-header-clear data-hero-root className="relative h-[320vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div data-boot="field" className={`absolute inset-0 ${BOOT_HIDDEN}`}>
            {/* Fondo: una red neuronal lejana (no un espacio con ruido) */}
            {!reducedMotion && <NeuralBackdrop heroProgress={progress} className="absolute inset-0 h-full w-full" />}
            {/* Al deslizar: viaje por dentro del EG; al alejarse se ve el EG armado */}
            {!reducedMotion && (
              <EgJourney
                graph={monogram.graph}
                heroProgress={progress}
                egProgress={egProgress}
                egReveal={egReveal}
                fit={EG_FIT}
                skip={isReturn}
                className="absolute inset-0 h-full w-full"
              />
            )}
            <NetworkCanvas
              graph={monogram.graph}
              progress={figureProgress}
              reveal={reducedMotion ? undefined : egReveal}
              reducedMotion={reducedMotion}
              fit={EG_FIT}
              noiseDots={500}
              noiseFloor={0.35}
              sweep
              cursorRadius={0.32}
              onHoverChange={monogram.onHoverChange}
              className="absolute inset-0"
            />
          </div>

          {/* Contador de arranque (se integra en la escena, sin pantalla aparte) */}
          <div data-boot-counter aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-5 bg-[rgb(var(--void))] px-[var(--gutter)] pb-[12vh]">
            <NeuralFlight progress={loaderProgress} className="absolute inset-0 h-full w-full" />
            <span data-boot-label className="mono-label relative flex items-center gap-3 tabular-nums text-paper/70">
              <span className="h-px w-8 bg-current" />
              <span>{t(COPY.hero.loading)} · <span data-boot-count>000</span>%</span>
              <span className="h-px w-8 bg-current" />
            </span>
          </div>

          {/* 1 · Ruido */}
          <div data-phase="noise" className="pointer-events-none absolute inset-0 flex items-end px-[var(--gutter)] pb-[26vh] md:pb-[22vh]">
            <p
              data-boot="text"
              className={`max-w-[22ch] text-[clamp(2rem,0.9rem+3.8vw,4.6rem)] font-light leading-[1] tracking-tight ${BOOT_HIDDEN}`}
            >
              <span data-boot-text>{headline}</span>
            </p>
          </div>

          {/* 2 · Señal */}
          <div data-phase="signal" className="pointer-events-none invisible absolute inset-0 flex items-end justify-end px-[var(--gutter)] pb-[7vh] text-right">
            <p className="max-w-[18ch] text-[clamp(2.1rem,1rem+4.2vw,5rem)] font-light leading-[0.98] tracking-tight">
              {t(COPY.hero.signal).replace(/\.$/, '').split(' ').map((word, i, words) => (
                <span key={i} data-read-word className="inline-block">
                  {word}
                  {i === words.length - 1 && <span className="text-signal">.</span>}
                  {i < words.length - 1 && '\u00a0'}
                </span>
              ))}
            </p>
          </div>

          {/* 3 · Firma (lockup de la hoja de vida) */}
          <div data-phase="name" className="invisible absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-10">
            <div className="flex items-end gap-5">
              <span data-bar className="brand-bar h-[clamp(6rem,14vw,12rem)] origin-bottom" aria-hidden="true" />
              <h1 className="leading-[0.85]">
                <span className="sr-only">{PROFILE.firstName} {PROFILE.lastName}</span>
                <SplitLine text={PROFILE.firstName} className="text-[clamp(2rem,1rem+4vw,4.5rem)] font-light lowercase" />
                <SplitLine text={PROFILE.lastName} className="text-[clamp(3rem,1rem+9vw,10rem)] font-medium tracking-[0.12em]" />
              </h1>
            </div>
            <div className="mt-6 flex flex-col gap-4 md:ml-[calc(6px+1.25rem)] md:flex-row md:items-end md:justify-between">
              <p data-read-meta className="flex items-center gap-3 text-lg">
                <span data-bar className="h-6 w-px origin-bottom bg-current" aria-hidden="true" />
                {t(PROFILE.role)}
              </p>
              <p data-read-meta className="max-w-md text-sm leading-relaxed opacity-70">{t(COPY.hero.tagline)}</p>
            </div>
          </div>

          <HoverTuneLabel visible={monogram.hovering && heroInView} />

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
