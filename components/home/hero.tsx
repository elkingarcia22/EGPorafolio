'use client'

import { useEffect, useRef } from 'react'
import { SignalField } from '@/components/signal/signal-field'
import { ToneSection } from '@/components/ui/tone-section'
import { ScrollCue } from './scroll-cue'
import { gsap, scrambleText } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

const BOOT_MIN_S = 1.6

/** Elementos que arrancan ocultos y aparecen en el arranque del hero. */
const BOOT_HIDDEN = 'opacity-0'

/**
 * Arranque: no hay pantalla de carga aparte. La estática aparece en
 * negro mientras carga, el titular "Todo producto empieza como ruido"
 * se descifra desde caracteres de ruido y luego aparece la invitación
 * a deslizar. Encabezado y contador se integran en la misma escena.
 */
function useBoot(root: React.RefObject<HTMLDivElement | null>, headline: string, reducedMotion: boolean) {
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
    let cancelScramble: (() => void) | null = null
    if (header) gsap.set(header, { opacity: 0 })

    const tl = gsap.timeline({ paused: true })
    tl.to(q('[data-boot="field"]'), { opacity: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .to(counter, {
        v: 100,
        duration: BOOT_MIN_S,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterEl) counterEl.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      }, 0)
      .to(q('[data-boot-counter]'), { autoAlpha: 0, y: -10, duration: 0.4 }, BOOT_MIN_S)
      .set(q('[data-boot="text"]'), { opacity: 1 }, BOOT_MIN_S - 0.4)
      .call(() => {
        if (textEl) cancelScramble = scrambleText(textEl, headline, 1100)
      }, undefined, BOOT_MIN_S - 0.4)
      .to(header ? [header] : [], { opacity: 1, duration: 0.8 }, BOOT_MIN_S + 0.4)
      .fromTo(q('[data-boot="cue"]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, BOOT_MIN_S + 0.7)

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
  }, [root, headline, reducedMotion])
}

/**
 * Hero en tres tiempos, controlados por el scroll:
 * 1. "Todo producto empieza como ruido."  (estática)
 * 2. "Mi trabajo es encontrar la señal."   (las partículas se ordenan)
 * 3. Firma: elkin / GARCIA, como en la hoja de vida.
 */
export function Hero() {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const sectionRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const headline = t(COPY.hero.noise)

  useBoot(sectionRef, headline, reducedMotion)

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
      <div ref={sectionRef} className="relative h-[320vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div data-boot="field" className={`absolute inset-0 ${BOOT_HIDDEN}`}>
            <SignalField progress={progress} reducedMotion={reducedMotion} className="absolute inset-0" />
          </div>

          {/* Contador de arranque (se integra en la escena, sin pantalla aparte) */}
          <p data-boot-counter aria-hidden="true" className="mono-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tabular-nums opacity-70">
            {t(COPY.hero.loading)} <span data-boot-count>000</span>%
          </p>

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
          <div data-phase="signal" className="pointer-events-none invisible absolute inset-0 flex items-end justify-end px-[var(--gutter)] pb-[18vh] text-right">
            <p className="max-w-[16ch] text-[clamp(2.5rem,1rem+6vw,6.5rem)] font-light leading-[0.95] tracking-tight">
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
