'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PROCESS_STAGES } from '@/lib/content/process'
import { COPY } from '@/lib/content/copy'
import { ProcessPath } from './process/process-path'
import { backdropQuiet } from './backdrop-journey'

/** Tiempo que se queda cada etapa en el avance automático (ms): ágil, se lee de un vistazo */
const STAGE_MS = 2600
/** Acercamiento a la neurona activa: la fibra se mueve y cada neurona pasa al centro (más en pantallas angostas) */
const ZOOM = { wide: 1.8, narrow: 1.6 }
/** Si la persona elige una etapa, el avance automático espera esto antes de seguir (ms) */
const RESUME_AFTER_MS = 9000
/** Mientras se ve el proceso, el fondo se calma para que la fibra se lea */
const QUIET_LEVEL = 1

/** Cifra de dos dígitos («03») */
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Proceso: la luz azul baja hasta «02 · Proceso» (como en Enfoque), entra el
 * título y bajo él se dibuja la fibra, neurona por neurona. Ya armada, la
 * señal pasa de neurona en neurona: la activa crece y brilla, y arriba
 * aparece solo el nombre de la etapa y su frase. Avanza sola y
 * rápido; tocar una neurona lleva a esa etapa. Sin scroll fijo.
 */
export function ProcessFlow() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [build, setBuild] = useState(false)
  const [built, setBuilt] = useState(false)
  const [inView, setInView] = useState(false)
  const [pausedUntil, setPausedUntil] = useState(0)
  const [narrow, setNarrow] = useState(false)
  const stage = PROCESS_STAGES[active]
  const autoplay = built && inView && !reducedMotion && pausedUntil === 0

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Cuando la luz llega a la etiqueta, entra el título y la fibra se dibuja; mientras se ve, el fondo se calma.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('[data-pf-word]')
      if (!reducedMotion) gsap.set(words, { autoAlpha: 0, yPercent: 55, filter: 'blur(10px)' })
      ScrollTrigger.create({
        trigger: root,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          if (!reducedMotion) gsap.to(words, { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.07, ease: 'expo.out' })
          window.setTimeout(() => setBuild(true), reducedMotion ? 0 : 450)
        },
      })
      ScrollTrigger.create({
        trigger: root,
        start: 'top 65%',
        end: 'bottom 35%',
        onToggle: (self) => {
          setInView(self.isActive)
          backdropQuiet.set('process', self.isActive ? QUIET_LEVEL : 0)
        },
      })
    }, root)
    return () => {
      backdropQuiet.set('process', 0)
      ctx.revert()
    }
  }, [reducedMotion])

  // Avance automático: pasa a la siguiente etapa (y vuelve a empezar al final).
  useEffect(() => {
    if (!autoplay) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % PROCESS_STAGES.length), STAGE_MS)
    return () => window.clearTimeout(id)
  }, [autoplay, active])

  // Después de elegir una etapa, el avance automático vuelve a los pocos segundos.
  useEffect(() => {
    if (!pausedUntil) return
    const id = window.setTimeout(() => setPausedUntil(0), Math.max(0, pausedUntil - Date.now()))
    return () => window.clearTimeout(id)
  }, [pausedUntil])

  const select = useCallback((index: number) => {
    setActive(index)
    setPausedUntil(Date.now() + RESUME_AFTER_MS)
  }, [])
  const onBuilt = useCallback(() => setBuilt(true), [])

  // El nombre de la etapa entra enfocándose, rápido.
  useEffect(() => {
    const el = stageRef.current
    if (!el || reducedMotion || !built) return
    const tween = gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(el.querySelectorAll('[data-pf-line]'), { autoAlpha: 0, y: 12, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.06 }, 0)
    return () => {
      tween.progress(1).kill()
    }
  }, [active, built, reducedMotion])

  return (
    <ToneSection tone="dark" id="process" className="px-[var(--gutter)] pb-[clamp(5rem,4rem+4vw,9rem)] pt-[clamp(8rem,6rem+6vw,12rem)]">
      <div ref={rootRef} className="mx-auto flex max-w-6xl flex-col items-center">
        {/* La fibra que viene de Proyectos llega a esta etiqueta */}
        <SectionLabel index="02" thread={false} fiberTo="proyectos" className="mb-6">{t(COPY.process.label)}</SectionLabel>
        <h2 className="text-center text-[clamp(2rem,1rem+3.6vw,4.4rem)] font-light leading-[0.95] tracking-tight">
          {t(COPY.process.title).split(' ').map((word, i, all) => (
            <span key={i} data-pf-word className="inline-block">
              {word}
              {i < all.length - 1 && ' '}
            </span>
          ))}
        </h2>

        {/* La etapa en foco: solo su nombre y su frase, sobre la neurona */}
        <div
          ref={stageRef}
          key={active}
          aria-live="polite"
          className="mt-[clamp(2.5rem,2rem+2vw,4rem)] flex min-h-[clamp(6rem,5rem+3vw,8rem)] flex-col items-center justify-end text-center"
          style={built || reducedMotion ? undefined : { visibility: 'hidden' }}
        >
          <span data-pf-line className="mono-label tabular-nums text-paper/45">
            {pad(active + 1)} / {pad(PROCESS_STAGES.length)}
          </span>
          <span data-pf-line className="mt-2 text-[clamp(1.8rem,1.1rem+2.4vw,3.4rem)] font-light leading-none tracking-tight">{t(stage.title)}</span>
          <span data-pf-line className="mt-3 max-w-[42ch] text-sm leading-relaxed text-paper/60 md:text-base">{t(stage.body)}</span>
        </div>

        {/* La fibra: se dibuja bajo el título; luego se mueve para llevar cada neurona al centro */}
        <div className="mt-6 w-full overflow-x-clip md:mt-4">
          <ProcessPath
            labels={PROCESS_STAGES.map((s) => t(s.title))}
            active={active}
            onSelect={select}
            build={build}
            onBuilt={onBuilt}
            autoplayMs={autoplay ? STAGE_MS : null}
            zoom={built && !reducedMotion ? (narrow ? ZOOM.narrow : ZOOM.wide) : 1}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </ToneSection>
  )
}
