'use client'

import { useEffect, useRef } from 'react'
import { ToneSection, type Tone } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

/**
 * Cómo llega cada capítulo (para que no todos entren igual):
 * - thread: un hilo baja desde arriba hasta el nodo de la etiqueta.
 * - converge: dos fibras llegan desde los costados y se juntan en el nodo.
 * - bloom: un anillo grande se cierra sobre el nodo y lo enciende.
 * - warp: la cámara pasa a través: el contenido llega de muy cerca y se aleja a su lugar.
 */
export type ChapterEntry = 'thread' | 'converge' | 'bloom' | 'warp'

export interface ChapterMeta {
  id: string
  index: string
  title: string
  tone: Tone
  entry?: ChapterEntry
  /** Nombre de la fibra que llega a su nodo desde la sección anterior (ver <SectionFiber>) */
  fiberTo?: string
}

interface ChapterProps {
  meta: ChapterMeta
  children: React.ReactNode
}

/** Movimiento de cámara del contenido según la entrada */
const CAMERA: Record<ChapterEntry, gsap.TweenVars> = {
  thread: { scale: 0.93, y: 70, filter: 'blur(10px)' },
  bloom: { scale: 0.9, filter: 'blur(12px)' },
  converge: { scale: 0.96, y: 40, filter: 'blur(8px)' },
  warp: { scale: 1.14, filter: 'blur(16px)' },
}
const CAMERA_S = 1.3
/** Fibras de `converge`: desde qué altura arriba del nodo salen de los costados (px) */
const CONVERGE_RISE = 90

/** Fibras que llegan desde los dos costados del capítulo hasta el nodo, dibujadas con el scroll. */
function ConvergeLines({ nodeRef }: { nodeRef: React.RefObject<HTMLSpanElement | null> }) {
  const { reducedMotion } = useA11y()
  const svgRef = useRef<SVGSVGElement>(null)
  const pathsRef = useRef<SVGPathElement[]>([])

  useEffect(() => {
    const svg = svgRef.current
    const node = nodeRef.current
    const box = svg?.parentElement
    if (!svg || !node || !box) return
    const measure = () => {
      const b = box.getBoundingClientRect()
      const n = node.getBoundingClientRect()
      const x = n.left + n.width / 2 - b.left
      const y = n.top + n.height / 2 - b.top
      const w = box.clientWidth
      svg.setAttribute('viewBox', `0 0 ${w} ${box.clientHeight}`)
      const top = Math.max(0, y - CONVERGE_RISE)
      pathsRef.current[0]?.setAttribute('d', `M0 ${top} C${x * 0.5} ${top} ${x - 60} ${y} ${x} ${y}`)
      pathsRef.current[1]?.setAttribute('d', `M${w} ${top} C${x + (w - x) * 0.5} ${top} ${x + 60} ${y} ${x} ${y}`)
    }
    measure()
    ScrollTrigger.addEventListener('refreshInit', measure)
    const paths = pathsRef.current
    if (reducedMotion) {
      paths.forEach((p) => (p.style.strokeDashoffset = '0'))
      return () => ScrollTrigger.removeEventListener('refreshInit', measure)
    }
    const tween = gsap.fromTo(paths, { strokeDashoffset: 1 }, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: node, start: 'top 95%', end: 'top 60%', scrub: 0.5 },
    })
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', measure)
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [nodeRef, reducedMotion])

  return (
    <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {[0, 1].map((i) => (
        <path
          key={i}
          ref={(el) => {
            if (el) pathsRef.current[i] = el
          }}
          fill="none"
          stroke={i === 0 ? 'rgb(var(--signal))' : '#ff54aa'}
          strokeOpacity={0.75}
          strokeWidth={1.2}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1}
          style={{ filter: 'drop-shadow(0 0 5px rgb(var(--signal) / 0.6))' }}
        />
      ))}
    </svg>
  )
}

/** Anillo grande que se cierra sobre el nodo de la etiqueta cuando el capítulo llega. */
function BloomRing({ nodeRef }: { nodeRef: React.RefObject<HTMLSpanElement | null> }) {
  const { reducedMotion } = useA11y()
  const ringRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    const node = nodeRef.current
    if (!ring || !node || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.set(ring, { scale: 1, autoAlpha: 0 })
      gsap.timeline({ scrollTrigger: { trigger: node, start: 'top 80%', once: true } })
        .to(ring, { autoAlpha: 1, duration: 0.3 })
        .to(ring, { scale: 0.05, duration: 1.1, ease: 'expo.inOut' }, 0)
        .to(ring, { autoAlpha: 0, duration: 0.25 }, 0.95)
    })
    return () => ctx.revert()
  }, [nodeRef, reducedMotion])

  return (
    <span
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/70 opacity-0 shadow-[0_0_40px_6px_rgb(var(--signal)/0.35),inset_0_0_30px_rgb(var(--signal)/0.3)]"
    />
  )
}

/**
 * Capítulo de un caso: un nodo de la red. Llega a su etiqueta de una de cuatro
 * maneras (hilo, fibras que convergen, anillo que se cierra o paso de cámara)
 * y su contenido entra con el movimiento de cámara que le corresponde. Sin
 * fondos propios: todos comparten la misma red de fondo de la página.
 */
export function Chapter({ meta, children }: ChapterProps) {
  const { reducedMotion } = useA11y()
  const bodyRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLSpanElement>(null)
  const entry = meta.entry ?? 'thread'

  useEffect(() => {
    const body = bodyRef.current
    if (!body || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from(body, {
        ...CAMERA[entry],
        autoAlpha: 0,
        duration: CAMERA_S,
        ease: 'expo.out',
        // Sin transformaciones al terminar: lo de adentro (fijos, ampliaciones) se comporta normal.
        clearProps: 'transform,filter,opacity,visibility',
        scrollTrigger: { trigger: body, start: 'top 88%', once: true },
      })
    }, body)
    return () => ctx.revert()
  }, [reducedMotion, entry])

  return (
    <ToneSection
      tone={meta.tone}
      id={meta.id}
      data-chapter={meta.id}
      aria-labelledby={`${meta.id}-title`}
      className="relative scroll-mt-24 py-[clamp(4rem,3rem+6vw,9rem)]"
    >
      {entry === 'converge' && <ConvergeLines nodeRef={nodeRef} />}
      <header className="relative mb-[clamp(2rem,1.5rem+2vw,3.5rem)] flex justify-center">
        <h2 id={`${meta.id}-title`} className="sr-only">{meta.title}</h2>
        <span className="relative">
          <SectionLabel index={meta.index} thread={entry === 'thread' && !meta.fiberTo} fiberTo={meta.fiberTo} nodeRef={nodeRef}>{meta.title}</SectionLabel>
          {entry === 'bloom' && (
            <span className="pointer-events-none absolute left-[5px] top-1/2 h-0 w-0">
              <BloomRing nodeRef={nodeRef} />
            </span>
          )}
        </span>
      </header>
      <div ref={bodyRef} className="origin-top">{children}</div>
    </ToneSection>
  )
}
