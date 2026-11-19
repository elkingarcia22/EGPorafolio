'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/** Azul de la plataforma UBITS. */
export const UBITS_BLUE = '#0c5bef'

/** Escenario oscuro con brillo: el fondo común de las piezas vivas de Forma. */
export function Stage({ glow = UBITS_BLUE, children, className = '' }: { glow?: string; children: React.ReactNode; className?: string }) {
  return (
    <div data-reveal="device" className={`relative overflow-hidden rounded-3xl bg-[#0b0d16] p-4 text-white md:p-8 ${className}`}>
      <span className="pointer-events-none absolute right-[8%] top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full opacity-25 blur-3xl transition-[background] duration-700" style={{ background: glow }} aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  )
}

/** Ventana clara con la barra del producto, como se ve la plataforma. */
export function AppWindow({ title, meta, children, className = '' }: { title: string; meta?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-[#f6f7fb] text-[#161a2c] shadow-[0_40px_90px_-35px_rgba(0,0,0,0.85)] ring-1 ring-white/10 ${className}`}>
      <div className="flex items-center gap-3 border-b border-black/[0.06] bg-white px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="text-[13px] font-medium">{title}</span>
        {meta && <span className="truncate text-[11px] text-black/45">{meta}</span>}
      </div>
      {children}
    </div>
  )
}

/** Avanza un paso cada `ms` mientras la pieza está en vista y el movimiento está permitido. */
export function useStepper(ms: number, steps: number, paused = false): { step: number; ref: React.RefObject<HTMLDivElement>; set: (n: number) => void } {
  const { reducedMotion } = useA11y()
  const [step, setStep] = useState(0)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || !inView) return
    const id = window.setTimeout(() => setStep((s) => (s + 1) % steps), ms)
    return () => window.clearTimeout(id)
  }, [step, ms, steps, paused, reducedMotion, inView])

  return { step: reducedMotion && !paused ? steps - 1 : step, ref, set: setStep }
}

/** Píldora de estado con el color de la plataforma. */
export function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors duration-500" style={{ background: `${color}1f`, color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  )
}

/** Barra de avance que se mueve con transform (no con width). */
export function ProgressBar({ value, color = UBITS_BLUE, max = 100, className = 'h-1.5' }: { value: number; color?: string; max?: number; className?: string }) {
  const ratio = Math.max(0, Math.min(1, value / max))
  return (
    <span className={`block overflow-hidden rounded-full bg-black/[0.07] ${className}`}>
      <span className="block h-full origin-left rounded-full transition-[transform,background-color] duration-1000 ease-expo" style={{ transform: `scaleX(${ratio})`, background: color }} />
    </span>
  )
}
