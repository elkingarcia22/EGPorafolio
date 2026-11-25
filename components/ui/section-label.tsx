'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useRiseIn } from '@/components/home/use-rise-in'

interface SectionLabelProps {
  index: string
  children: string
  className?: string
  /** el nodo de la etiqueta (p. ej. para que un viaje entre secciones aterrice en él) */
  nodeRef?: React.Ref<HTMLSpanElement>
  /** hilo que baja desde la sección anterior hasta el nodo (por defecto sí) */
  thread?: boolean
  /** nombre de la fibra que sale de este nodo (ver <SectionFiber>) */
  fiberFrom?: string
  /** nombre de la fibra que llega a este nodo */
  fiberTo?: string
  /**
   * Fibra que sube desde el nodo y se desvanece hacia arriba: mantiene la conexión a la vista
   * cuando la etiqueta queda fija y la fibra que llegó sigue de largo con la página.
   */
  riser?: boolean
  /**
   * El hilo nace detrás de este elemento (selector), en vez del borde de la sección: p. ej. sale
   * de detrás del chat del agente y baja hasta el nodo.
   */
  threadFrom?: string
}

/** Margen para que el hilo no toque el borde exacto de la sección */
const THREAD_GAP_PX = 6
/** Cuánto se mete el hilo por debajo del elemento del que nace (`threadFrom`) */
const THREAD_TUCK_PX = 40

/**
 * Etiqueta de sección: número + título espaciado + línea fina (estilo hoja de vida).
 *
 * Es además un nodo de la red del inicio: un hilo baja desde el borde de la
 * sección hasta la etiqueta mientras se desliza. Cuando llega, el nodo se
 * enciende en azul, la línea fina se tiende y el número y el título entran
 * nítidos. Así cada sección queda conectada
 * con la anterior.
 */
export function SectionLabel({ index, children, className = '', nodeRef, thread: withThread = true, fiberFrom, fiberTo, riser = false, threadFrom }: SectionLabelProps) {
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const threadRef = useRef<HTMLSpanElement>(null)
  const indexRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)

  useRiseIn(indexRef, reducedMotion, { start: 'top 82%' })
  useRiseIn(titleRef, reducedMotion, { start: 'top 82%', delay: 0.12 })

  useEffect(() => {
    const root = rootRef.current
    const thread = threadRef.current
    if (!root) return
    // Sin hilo: el nodo queda encendido apenas la etiqueta entra.
    if (!thread) {
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        onEnter: () => (root.dataset.lit = 'true'),
        onLeaveBack: () => (root.dataset.lit = 'false'),
      })
      return () => trigger.kill()
    }
    const section = root.closest<HTMLElement>('[data-section-tone]')

    // El hilo mide exactamente lo que hay entre el borde de la sección y el nodo.
    const measure = () => {
      const from = threadFrom ? document.querySelector(threadFrom) : null
      // Desde detrás de otro elemento (se mete un poco debajo de él) o desde el borde de la sección.
      const top = from ? from.getBoundingClientRect().bottom - THREAD_TUCK_PX : section?.getBoundingClientRect().top
      if (top === undefined) return
      const gap = root.getBoundingClientRect().top - top
      thread.style.height = `${Math.max(0, gap - THREAD_GAP_PX)}px`
    }
    measure()
    ScrollTrigger.addEventListener('refreshInit', measure)

    if (reducedMotion) {
      root.dataset.lit = 'true'
      return () => ScrollTrigger.removeEventListener('refreshInit', measure)
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(thread, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: thread,
          start: 'top 88%',
          end: 'bottom 62%',
          scrub: 0.4,
          onUpdate: (self) => {
            root.dataset.lit = String(self.progress > 0.97)
          },
        },
      })
    }, root)

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', measure)
      ctx.revert()
    }
  }, [reducedMotion, withThread, threadFrom])

  return (
    <div ref={rootRef} data-lit="false" className={`group/label flex items-center gap-4 ${className}`}>
      <span ref={nodeRef} data-fiber-from={fiberFrom} data-fiber-to={fiberTo} className="relative flex h-[10px] w-[10px] shrink-0" aria-hidden="true">
          <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[calc(100%+3px)] left-1/2 h-[clamp(5rem,12svh,9rem)] w-px -translate-x-1/2 bg-gradient-to-t from-white/80 via-white/35 to-transparent shadow-[0_0_8px_rgb(255_255_255/0.35)] transition-opacity duration-700 ${riser ? 'opacity-100' : 'opacity-0'}`}
          />
        {/* Hilo que llega desde la sección anterior */}
        {withThread && <span
          ref={threadRef}
          className="pointer-events-none absolute bottom-[calc(100%+4px)] left-1/2 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-signal/20 via-signal/80 to-signal shadow-[0_0_12px_rgb(var(--signal)/0.55)]"
        >
          {/* Impulso que recorre el hilo una vez encendido */}
          <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[lit=true]/label:animate-[thread-pulse_2.8s_cubic-bezier(.65,0,.35,1)_infinite] group-data-[lit=true]/label:opacity-100">
            <span className="absolute bottom-0 left-1/2 h-20 w-[4px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-white/70 to-white shadow-[0_0_14px_3px_rgb(var(--signal))]" />
          </span>
        </span>}
        {/* Nodo: redondo como los de la red; se enciende cuando la señal llega */}
        <span className="absolute inset-0 scale-75 rounded-full bg-fg/50 transition-[transform,background-color,box-shadow] duration-500 ease-expo group-data-[lit=true]/label:scale-100 group-data-[lit=true]/label:bg-signal group-data-[lit=true]/label:shadow-[0_0_0_6px_rgb(var(--signal)/0.2),0_0_26px_4px_rgb(var(--signal)/0.7)]" />
      </span>
      <span ref={indexRef} className="mono-label inline-block tabular-nums opacity-50">{index}</span>
      <span className="hairline h-px w-10 origin-left scale-x-0 transition-transform duration-700 ease-expo group-data-[lit=true]/label:scale-x-100" aria-hidden="true" />
      <span ref={titleRef} className="brand-title inline-block text-xs">{children}</span>
    </div>
  )
}
