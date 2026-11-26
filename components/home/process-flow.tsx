'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { gsap, ScrollTrigger, getLenis } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PROCESS_STAGES } from '@/lib/content/process'
import { COPY } from '@/lib/content/copy'
import { ProcessPath } from './process/process-path'
import { backdropQuiet } from './backdrop-journey'

/** Tiempo que se queda cada etapa en el avance automático (ms): ágil, se lee de un vistazo */
const STAGE_MS = 2600
/** En el teléfono la línea se completa sola y rápido, etapa por etapa, y luego se explora tocando (ms) */
const SWEEP_MS = 650
/** Acercamiento a la neurona activa en pantallas anchas: la fibra se mueve y cada neurona pasa al centro */
const ZOOM = { wide: 1.8 }
/** Si la persona elige una etapa, el avance automático espera esto antes de seguir (ms) */
const RESUME_AFTER_MS = 9000
/** Mientras se ve el proceso, el fondo se calma para que la fibra se lea */
const QUIET_LEVEL = 1
/** Recorrido de scroll por etapa mientras la sección queda fija (alto de pantalla) */
const STEP_VH = 45
/** Tramo final del recorrido: se queda en la última neurona (sin avance automático) y de ella sale la fibra a Trayectoria */
const END_AT = 0.94
/** Al tocar una neurona, la página baja (o sube) hasta esa etapa en este tiempo (s) */
const JUMP_S = 0.9

/** Cifra de dos dígitos («03») */
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Proceso: la fibra que viene de Proyectos llega a «02 · Proceso» y debajo se
 * dibuja la línea, neurona por neurona. La sección queda fija mientras se
 * desliza: cada tramo del scroll es una etapa (la cámara lleva esa neurona al
 * centro y arriba aparece su nombre y su frase). También avanza sola si se
 * queda quieta, y tocar una neurona lleva a esa etapa. Al final la vista se
 * queda en la última neurona y de ella sale la fibra hacia Trayectoria.
 */
export function ProcessFlow() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [ending, setEnding] = useState(false)
  /** La sección quedó fija: la etiqueta muestra su fibra hacia arriba (la que llegó ya pasó de largo) */
  const [pinned, setPinned] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [build, setBuild] = useState(false)
  const [built, setBuilt] = useState(false)
  const [inView, setInView] = useState(false)
  const [pausedUntil, setPausedUntil] = useState(0)
  const [narrow, setNarrow] = useState(false)
  /** En el teléfono la línea ya se completó una vez: desde ahí solo cambia al tocar una neurona */
  const [swept, setSwept] = useState(false)
  const stage = PROCESS_STAGES[active]
  const last = PROCESS_STAGES.length - 1
  /** Sección fija con una etapa por tramo de scroll: solo en pantallas anchas */
  const pinScroll = !reducedMotion && !narrow
  const autoplay = built && inView && !reducedMotion && pausedUntil === 0 && !ending && !(narrow && swept)
  const stepMs = narrow ? SWEEP_MS : STAGE_MS

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Cuando la fibra llega a la etiqueta, la línea de Proceso se dibuja; mientras se ve, el fondo se calma.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          window.setTimeout(() => setBuild(true), reducedMotion ? 0 : 200)
        },
      })
      // Con el scroll: cada tramo del recorrido es una etapa (solo cambia al pasar a otro tramo,
      // así el avance automático y el scroll conviven).
      let fromScroll = -1
      const track = trackRef.current
      if (track && pinScroll) {
        ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          onToggle: (self) => setPinned(self.isActive),
          onUpdate: (self) => {
            setEnding(self.progress >= END_AT)
            const index = Math.min(PROCESS_STAGES.length - 1, Math.floor((self.progress / END_AT) * PROCESS_STAGES.length))
            if (index !== fromScroll) {
              fromScroll = index
              setActive(index)
            }
          },
        })
      }
      ScrollTrigger.create({
        trigger: track ?? root,
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
  }, [reducedMotion, pinScroll])

  // Avance automático: pasa a la siguiente etapa hasta la última.
  useEffect(() => {
    if (!autoplay) return
    // Se detiene en la última etapa: no vuelve a empezar.
    if (active >= last) {
      if (narrow) setSwept(true)
      return
    }
    const id = window.setTimeout(() => setActive((i) => Math.min(last, i + 1)), stepMs)
    return () => window.clearTimeout(id)
  }, [autoplay, active, last, narrow, stepMs])

  // Después de elegir una etapa, el avance automático vuelve a los pocos segundos.
  useEffect(() => {
    if (!pausedUntil) return
    const id = window.setTimeout(() => setPausedUntil(0), Math.max(0, pausedUntil - Date.now()))
    return () => window.clearTimeout(id)
  }, [pausedUntil])

  /** Tocar una neurona: la página va al tramo de esa etapa (y se queda ahí un momento). */
  const select = useCallback((index: number) => {
    setActive(index)
    setPausedUntil(Date.now() + RESUME_AFTER_MS)
    // En el teléfono tocar una neurona solo la muestra: la página no se mueve.
    if (narrow) {
      setSwept(true)
      return
    }
    const track = trackRef.current
    if (!track || reducedMotion) return
    const top = track.getBoundingClientRect().top + window.scrollY
    const span = track.offsetHeight - window.innerHeight
    const y = top + span * END_AT * ((index + 0.5) / PROCESS_STAGES.length)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: JUMP_S })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }, [reducedMotion, narrow])
  const onBuilt = useCallback(() => setBuilt(true), [])
  // En el teléfono no hay fibra horizontal que armar: la columna está lista al llegar.
  useEffect(() => {
    if (narrow && build) setBuilt(true)
  }, [narrow, build])

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
    <ToneSection tone="dark" id="process" className="px-[var(--gutter)] pb-[clamp(3rem,2rem+3vw,6rem)] pt-[clamp(4rem,3rem+3vw,7rem)]">
      {/* Sin título visible: la etiqueta y la fibra hablan solas (queda para lectores de pantalla) */}
      <h2 className="sr-only">{t(COPY.process.title)}</h2>
      {/* Recorrido de scroll: la parte de adentro queda fija mientras se pasa de etapa en etapa */}
      <div ref={trackRef} className="relative" style={!pinScroll ? undefined : { height: `calc(100svh + ${PROCESS_STAGES.length * STEP_VH}vh)` }}>
      <div
        ref={rootRef}
        data-sticky-end
        className={`mx-auto flex max-w-6xl flex-col items-center ${pinScroll ? 'sticky top-0 h-[100svh] justify-center pb-[4svh]' : ''}`}
      >
        {/* La fibra que viene de Proyectos llega a esta etiqueta; queda arriba mientras se recorre */}
        <div className={`flex justify-center ${!pinScroll ? '' : 'absolute inset-x-0 top-[clamp(5.5rem,11svh,8rem)]'}`}>
          <SectionLabel index="02" thread={false} fiberTo="proyectos" riser={pinned}>{t(COPY.process.label)}</SectionLabel>
        </div>

        {narrow ? (
          <ProcessColumn active={active} built={built} onSelect={select} />
        ) : (
          <>
        {/* La etapa en foco: solo su nombre y su frase, sobre la neurona (visible desde el comienzo) */}
        <div
          ref={stageRef}
          key={active}
          aria-live="polite"
          className="mt-[clamp(2.5rem,2rem+2vw,4rem)] flex min-h-[clamp(6rem,5rem+3vw,8rem)] flex-col items-center justify-end text-center"
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
            autoplayMs={autoplay && !narrow && active < last ? STAGE_MS : null}
            zoom={pinScroll ? ZOOM.wide : 1}
            fiberFrom="proceso"
            fiberFromCenter={pinScroll}
            reducedMotion={reducedMotion}
          />
        </div>
          </>
        )}
      </div>
      </div>
    </ToneSection>
  )
}

interface ProcessColumnProps {
  active: number
  built: boolean
  onSelect: (index: number) => void
}

/**
 * Proceso en el teléfono: las seis etapas de pie, sobre una fibra vertical que
 * se enciende de arriba abajo mientras avanza sola. La etapa en curso se abre y
 * muestra su frase; tocar otra la abre. De la última sale la fibra a Trayectoria.
 */
function ProcessColumn({ active, built, onSelect }: ProcessColumnProps) {
  const { t } = useLocale()
  const last = PROCESS_STAGES.length - 1
  return (
    <ol className="relative mt-10 w-full max-w-[360px] text-left">
      {/* La fibra: tenue entera y, encima, lo ya recorrido */}
      <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 w-px bg-white/12" />
      <span
        aria-hidden="true"
        className="absolute left-[11px] top-6 w-px origin-top bg-gradient-to-b from-[rgb(var(--signal))] via-[rgb(var(--ice))] to-[rgb(var(--spark))] shadow-[0_0_8px_rgb(var(--signal)/0.7)] transition-transform duration-500 ease-out"
        style={{ bottom: 24, transform: `scaleY(${built ? active / last : 0})` }}
      />
      {PROCESS_STAGES.map((s, i) => {
        const on = built && i <= active
        const current = i === active
        return (
          <li key={s.title.es}>
            <button type="button" onClick={() => onSelect(i)} aria-current={current ? 'step' : undefined} className="relative flex w-full items-start gap-4 py-3 text-left outline-none">
              <span className="relative mt-1 grid h-[23px] w-[23px] shrink-0 place-items-center">
                {current && <span aria-hidden="true" className="absolute inset-[-8px] rounded-full bg-[rgb(var(--signal)/0.22)]" />}
                <span
                  aria-hidden="true"
                  className={`relative rounded-full border transition-all duration-500 ${current ? 'h-3.5 w-3.5 border-white bg-white shadow-[0_0_14px_3px_rgb(var(--signal)/0.8)]' : on ? 'h-2.5 w-2.5 border-white/80 bg-[rgb(var(--signal))]' : 'h-2.5 w-2.5 border-white/40 bg-[rgb(var(--void))]'}`}
                />
                {i === last && <span data-fiber-from="proceso" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-3">
                  <span className={`text-[1.35rem] font-light leading-tight transition-opacity duration-500 ${current ? 'opacity-100' : on ? 'opacity-85' : 'opacity-45'}`}>{t(s.title)}</span>
                  <span className="font-mono text-[11px] tabular-nums text-paper/40">{pad(i + 1)}</span>
                </span>
                {/* La frase de la etapa en curso: se abre bajo su nombre */}
                <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${current ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <span className="overflow-hidden">
                    <span className="block pt-2 text-[15px] leading-relaxed text-paper/70">{t(s.body)}</span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
