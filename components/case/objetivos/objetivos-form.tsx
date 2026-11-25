'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { CaseLead } from '@/components/case/case-lead'
import { AlignmentBuilder } from './alignment-builder'
import { ResultsFolder } from './results-folder'

/** La pantalla aterriza: llega inclinada y lejos, y se acuesta frente a la cámara */
const LAND = { rotateX: 16, y: 90, scale: 0.94, blur: 8, duration: 1.4 }

interface StationProps {
  index: string
  title: L
  lead: L
  /** Sin marco de vidrio: la pieza va directo sobre la página */
  bare?: boolean
  /** Fibra que nace detrás de la pieza y sale por su izquierda hacia el capítulo siguiente (ver <SectionFiber>) */
  fiberFrom?: string
  children: React.ReactNode
}

/**
 * Una estación de la fibra que recorre el capítulo: el hilo baja hasta su
 * nodo (se dibuja con el scroll), debajo el nombre y una línea, y colgando del
 * nodo la pieza real del producto en un marco de vidrio, que aterriza al llegar.
 */
function Station({ index, title, lead, bare = false, fiberFrom, children }: StationProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-station-thread]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top 90%', end: 'top 45%', scrub: 0.4 } })
      gsap.from('[data-station-node]', { scale: 0, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', scrollTrigger: { trigger: root, start: 'top 50%', once: true } })
      gsap.from('[data-station-frame]', {
        rotateX: LAND.rotateX,
        y: LAND.y,
        scale: LAND.scale,
        autoAlpha: 0,
        filter: `blur(${LAND.blur}px)`,
        transformPerspective: 1400,
        transformOrigin: '50% 0%',
        duration: LAND.duration,
        ease: 'expo.out',
        clearProps: 'transform,filter,opacity,visibility',
        scrollTrigger: { trigger: '[data-station-frame]', start: 'top 85%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={rootRef} className="relative flex flex-col items-center pt-[clamp(5rem,4rem+4vw,8rem)]">
      {/* El hilo que llega desde la estación anterior */}
      <span data-station-thread aria-hidden="true" className="absolute left-1/2 top-0 h-[clamp(5rem,4rem+4vw,8rem)] w-px origin-top -translate-x-1/2 bg-gradient-to-b from-white/5 via-signal/70 to-signal shadow-[0_0_10px_rgb(var(--signal)/0.6)]" />
      <span data-station-node aria-hidden="true" className="relative block h-3.5 w-3.5 rounded-full border border-white bg-signal shadow-[0_0_0_6px_rgb(var(--signal)/0.18),0_0_20px_4px_rgb(var(--signal)/0.7)]">
        <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.6s_cubic-bezier(0,0,.2,1)_infinite]" />
      </span>
      <h3 data-reveal className="mt-5 text-center">
        <span className="mono-label text-signal">{index}</span>
        <span className="mt-2 block text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-tight tracking-tight">{t(title)}</span>
      </h3>
      <CaseLead className="mt-4">{t(lead)}</CaseLead>
      {/* De la estación cuelga la pieza real */}
      <span aria-hidden="true" className="mt-6 h-10 w-px bg-gradient-to-b from-signal to-white/10" />
      <div data-station-frame className={`relative ${bare ? 'w-full' : 'w-full rounded-[28px] border border-white/10 bg-white/[0.03] p-2 shadow-[0_40px_100px_-50px_rgb(var(--signal)/0.6)] md:p-3'}`}>
        {/* La fibra al próximo capítulo nace detrás de la pieza y asoma por su borde de abajo, al centro */}
        {fiberFrom && <span data-fiber-from={fiberFrom} aria-hidden="true" className="pointer-events-none absolute bottom-6 left-1/2 h-px w-px" />}
        {children}
      </div>
    </section>
  )
}

/** La forma (dentro de «04 · Bocetos y forma»): el producto construido, como dos estaciones de una misma fibra. */
export function ObjetivosForm() {
  const { t } = useLocale()
  const { form } = OBJ_CASE
  return (
    <div>
      <CaseLead>{t(form.lead)}</CaseLead>

      <Station
        index="4.1"
        title={{ es: 'Resultados, pestaña por pestaña', en: 'Results, tab by tab' }}
        lead={{ es: 'Las siete pestañas reales de Resultados de un ciclo cerrado: pasan solas o toca un separador.', en: 'The seven real Results tabs of a closed cycle: they pass on their own, or tap a divider.' }}
        bare
      >
        <ResultsFolder />
      </Station>

      <Station
        fiberFrom="obj-ia"
        index="4.2"
        title={{ es: 'Alinear: el último paso de crear un ciclo', en: 'Align: the last step of creating a cycle' }}
        lead={{ es: 'El último paso antes de publicar conecta lo asignado con la estrategia, en cascada: persona, grupo y empresa.', en: 'The last step before publishing connects what was assigned with strategy, as a cascade: person, group and company.' }}
      >
        <AlignmentBuilder />
      </Station>

    </div>
  )
}
