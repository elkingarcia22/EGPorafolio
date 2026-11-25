'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { RevealWords } from '@/components/ui/reveal-words'
import { backdropJourney } from './backdrop-journey'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

/** Duración del viaje de nodo a nodo (ms) */
const JOURNEY_MS = 2200
/** Momento (s) en que empieza la lectura: justo antes de llegar a la neurona */
const READ_AT_S = 1.5
/** Paso entre palabras al leer (el texto es largo: más ágil que en el hero) */
const WORD_STAGGER_S = 0.055

/**
 * Enfoque: continúa el inicio. Al llegar a la sección, la cámara del fondo
 * único viaja por la misma red, de neurona en neurona, hasta aterrizar en el
 * nodo de «00 · Enfoque» (ver backdropJourney); desde ahí el texto aparece
 * palabra por palabra, con tiempo propio. No hay lienzo propio: es una sola
 * red para todo el inicio, sin bordes entre secciones.
 */
export function Manifesto() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const sectionRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root || reducedMotion) return
    /** Turno del viaje de cámara que pidió esta sección (solo ella lo suelta) */
    let turn = 0
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('[data-word], [data-chip]')
      const hidden = () => gsap.set(words, { autoAlpha: 0, yPercent: 55, filter: 'blur(10px)' })
      hidden()

      let read: gsap.core.Tween | null = null
      const play = () => {
        if (nodeRef.current) turn = backdropJourney.play({ anchor: nodeRef.current, durationMs: JOURNEY_MS })
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
          backdropJourney.release(turn)
          read?.kill()
          hidden()
        },
      })
      // Al dejar la sección hacia abajo, la cámara suelta el nodo y vuelve a flotar.
      ScrollTrigger.create({
        trigger: root,
        start: 'bottom 35%',
        onEnter: () => backdropJourney.release(turn),
      })
    }, root)
    return () => {
      backdropJourney.release(turn)
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
        <SectionLabel index="00" nodeRef={nodeRef}>{t(COPY.manifesto.label)}</SectionLabel>
        <div className="relative mt-14">
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
