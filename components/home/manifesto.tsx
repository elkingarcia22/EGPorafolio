'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { RevealWords } from '@/components/ui/reveal-words'
import { backdropQuiet } from './backdrop-journey'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

/** Momento (s) en que empieza la lectura, una vez encendido el nodo «00» */
const READ_AT_S = 0.5
/** Mientras se lee, el fondo casi desaparece: solo queda el nodo de la etiqueta */
const QUIET_LEVEL = 1
/** Paso entre palabras al leer (el texto es largo: más ágil que en el hero) */
const WORD_STAGGER_S = 0.055

/**
 * Enfoque: un solo punto. Al llegar a la sección, la red del fondo se apaga y
 * queda solo el nodo de «00 · Enfoque»; desde ahí el texto aparece palabra
 * por palabra, con tiempo propio.
 */
export function Manifesto() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root || reducedMotion) return
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('[data-word], [data-chip]')
      const hidden = () => gsap.set(words, { autoAlpha: 0, yPercent: 55, filter: 'blur(10px)' })
      hidden()

      let read: gsap.core.Tween | null = null
      const play = () => {
        read?.kill()
        read = gsap.to(words, {
          autoAlpha: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: WORD_STAGGER_S,
          ease: 'expo.out',
          delay: READ_AT_S,
        })
      }
      // Al entrar se viaja y se lee; al volver al inicio, todo queda listo para repetirse.
      ScrollTrigger.create({
        trigger: root,
        // El contenido empieza bajo el margen superior: arranca cuando la etiqueta entra en pantalla.
        start: 'top 88%',
        onEnter: play,
        onLeaveBack: () => {
          read?.kill()
          hidden()
        },
      })
      // Mientras la sección está en pantalla, el fondo se calma del todo.
      ScrollTrigger.create({
        trigger: root,
        start: 'top 88%',
        end: 'bottom 35%',
        onToggle: (self) => backdropQuiet.set('manifesto', self.isActive ? QUIET_LEVEL : 0),
      })
    }, root)
    return () => {
      backdropQuiet.set('manifesto', 0)
      ctx.revert()
    }
  }, [reducedMotion])

  return (
    <ToneSection
      tone="dark"
      className="relative px-[var(--gutter)] pb-[clamp(6rem,4rem+8vw,12rem)] pt-[clamp(12rem,8rem+12vw,20rem)]"
    >
      {/* Composición centrada: el viaje llega por el centro, como en el inicio */}
      <div ref={sectionRef} className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <SectionLabel index="00" fiber="from">{t(COPY.manifesto.label)}</SectionLabel>
        <div data-fiber-around className="relative mt-14">
          {/* Velo suave detrás del texto: la red sigue viva alrededor, pero no compite con la lectura */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[12%] -inset-y-[30%] -z-10 bg-[radial-gradient(ellipse_at_center,rgb(var(--void)/0.78)_0%,rgb(var(--void)/0.5)_45%,transparent_72%)]"
          />
          <RevealWords
            text={t(COPY.manifesto.text)}
            scrub={false}
            className="text-[clamp(1.9rem,1rem+3.4vw,4.4rem)] font-light leading-[1.1] tracking-tight [text-shadow:0_2px_18px_rgb(var(--void)/0.85)]"
          />
        </div>
      </div>
    </ToneSection>
  )
}
