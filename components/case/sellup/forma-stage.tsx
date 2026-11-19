'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { useInView } from './ui'
import { Camera, useCompact, type View } from './camera'

/**
 * Escenario por escenas: una sola pantalla visible a la vez (panel de Rumbo,
 * tabla, detalle) que se reemplazan con un fundido. El reloj arranca al entrar
 * en pantalla y se puede saltar a una escena desde los pasos de arriba.
 */

/** Segundos desde que la pieza entró en pantalla (en bucle) y una función para saltar a un segundo. */
export function useSceneTime(loop: number, still: number): [React.RefObject<HTMLDivElement>, number, (to: number) => void] {
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  const tick = useTick(560)
  const [start, setStart] = useState<number | null>(null)
  const [held, setHeld] = useState<number | null>(null)
  useEffect(() => {
    if (seen && start === null) setStart(tick)
  }, [seen, start, tick])
  const jump = useCallback((to: number) => {
    setStart(tick - to)
    setHeld(to)
  }, [tick])
  if (reducedMotion) return [ref, held ?? still, jump]
  const time = start === null ? 0 : (((tick - start) % loop) + loop) % loop
  return [ref, time, jump]
}

/** Escala un bloque de medidas fijas (px de diseño) al ancho disponible, centrado. */
export function Scaled({ width, height, children, className = '', view }: { width: number; height: number; children: ReactNode; className?: string; view?: View }) {
  const compact = useCompact()
  if (compact && view) return <Camera width={width} height={height} view={view} className={className}>{children}</Camera>
  return <ScaledFull width={width} height={height} className={className}>{children}</ScaledFull>
}

function ScaledFull({ width, height, children, className = '' }: { width: number; height: number; children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(width)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const scale = Math.min(1, w / width)
  return (
    <div ref={box} className={`relative w-full ${className}`} style={{ height: height * scale }}>
      <div className="absolute top-0 origin-top-left" style={{ width, height, left: Math.max(0, (w - width * scale) / 2), transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

/** Las escenas, una sola visible: el alto del escenario sigue a la escena activa. */
export function SceneStage({ active, scenes }: { active: number; scenes: readonly ReactNode[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [heights, setHeights] = useState<readonly number[]>([])
  useEffect(() => {
    const ro = new ResizeObserver(() => setHeights(refs.current.map((el) => el?.offsetHeight ?? 0)))
    refs.current.forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [scenes.length])
  const h = heights[active]
  return (
    <div className="relative transition-[height] duration-[400ms] ease-expo" style={{ height: h ? h : undefined }}>
      {scenes.map((scene, i) => (
        <div
          key={i}
          ref={(el) => { refs.current[i] = el }}
          aria-hidden={i !== active}
          className={`${h ? 'absolute inset-x-0 top-0' : i === active ? 'relative' : 'absolute inset-x-0 top-0'} transition-[opacity,transform] duration-[400ms] ease-expo ${i === active ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-[0.985] opacity-0'}`}
        >
          {scene}
        </div>
      ))}
    </div>
  )
}

/** Fondo de la escena del panel: oscuro con un halo suave de los colores de la IA. */
export function Halo({ children }: { children: ReactNode }) {
  return (
    <div className="relative py-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[min(620px,90%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(126,43,224,0.28),rgba(40,94,230,0.12)_55%,transparent)] blur-2xl" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  )
}

/** Escena 1: el panel de Rumbo solo, centrado y legible. */
export function PanelScene({ children, height = 780 }: { children: ReactNode; height?: number }) {
  return (
    <Halo>
      <Scaled width={430} height={height}>
        <div className="h-full text-white antialiased" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>{children}</div>
      </Scaled>
    </Halo>
  )
}

/** Escena 3: solo el detalle (modal real), centrado y grande. */
export function DetailScene({ children, width = 960, height = 600, view }: { children: ReactNode; width?: number; height?: number; view?: View }) {
  return (
    <div className="py-2">
      <Scaled width={width} height={height} view={view}>{children}</Scaled>
    </div>
  )
}
