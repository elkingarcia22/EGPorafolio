'use client'

import { useEffect, useState, type RefObject } from 'react'

/** El gradiente de IA del tema Premium de Barberlytics: oro champán → cobre → petróleo → azul */
export const AI = ['#f0ce86', '#de8c3a', '#2e9cb0', '#3f72d8'] as const
/** Rojo de lo que no funciona (lo roto, lo inventado, lo que el rol no ve) */
export const RED = '#ff6b72'

/** Está a la vista: solo entonces las escenas avanzan solas. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '0px 0px -25% 0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

interface AutoStepsOptions {
  /** Último paso (la escena completa) */
  last: number
  /** Cuánto dura cada paso (ms) */
  ms: (step: number) => number
  run: boolean
  reducedMotion: boolean
  /** Si se da, al completarse espera esto (ms) y vuelve a empezar */
  loopAfter?: number
}

/** Una escena que avanza sola, paso a paso, mientras se ve. */
export function useAutoSteps({ last, ms, run, reducedMotion, loopAfter }: AutoStepsOptions) {
  const [step, setStep] = useState(reducedMotion ? last : 0)
  useEffect(() => {
    if (reducedMotion) setStep(last)
  }, [reducedMotion, last])
  useEffect(() => {
    if (!run || reducedMotion) return
    if (step >= last) {
      if (loopAfter === undefined) return
      const id = window.setTimeout(() => setStep(0), loopAfter)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setStep((s) => Math.min(last, s + 1)), ms(step))
    return () => window.clearTimeout(id)
  }, [run, reducedMotion, step, last, ms, loopAfter])
  return [step, setStep] as const
}

interface CaptionProps {
  tag: string
  title: string
  sub?: string
  /** Cambia cuando cambia lo que dice: así entra con un fundido */
  id: string | number
}

/** La única frase de arriba: cambia con la escena o con la pieza que se toca. */
export function Caption({ tag, title, sub, id }: CaptionProps) {
  return (
    <div aria-live="polite" className="mx-auto flex min-h-[6.5rem] max-w-[60ch] flex-col items-center justify-end text-center">
      <div key={id} className="clp-fade flex flex-col items-center">
        <p className="mono-label text-[#f0ce86]">{tag}</p>
        <p className="mt-3 text-balance text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] font-light leading-[1.2] tracking-tight">{title}</p>
        {sub && <p className="mt-2 max-w-[52ch] text-balance text-sm leading-snug text-paper/60">{sub}</p>}
      </div>
    </div>
  )
}

/** Texto de apoyo: dos renglones como máximo. */
export function Lead({ children }: { children: string }) {
  return <p className="mx-auto mt-4 max-w-[62ch] text-balance text-center text-[15px] leading-relaxed text-paper/60 md:text-base">{children}</p>
}

/** Gradiente de IA para trazos SVG */
export function AiGradient({ id, vertical = false }: { id: string; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? '0' : '1'} y2={vertical ? '1' : '0'}>
      <stop offset="0" stopColor={AI[0]} />
      <stop offset="0.45" stopColor={AI[1]} />
      <stop offset="0.75" stopColor={AI[2]} />
      <stop offset="1" stopColor={AI[3]} />
    </linearGradient>
  )
}

/** Teclado: Enter y espacio activan una pieza con rol de botón */
export const onActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    fn()
  }
}
