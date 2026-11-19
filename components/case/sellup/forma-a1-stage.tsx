'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Escenario rápido del Agente 1: una escena a la vez, con transiciones de
 * velocidad (escala + desenfoque, 350 ms, curva exponencial) en vez de fundidos.
 * La escena que sale «atraviesa» la cámara; la que entra llega desde el fondo.
 * El alto es el de la escena más alta, para que la página no salte.
 */

export interface StageScene {
  node: ReactNode
  /** Punto desde donde entra (para el zoom del detalle desde su fila). */
  origin?: string
  /** Escala con la que llega; menor a 1 = viene del fondo. */
  from?: number
  /** Rebote al llegar (aterrizaje). */
  bounce?: boolean
}

const EXPO = 'cubic-bezier(0.16,1,0.3,1)'
const BOUNCE = 'cubic-bezier(0.34,1.56,0.64,1)'

function sceneStyle(i: number, active: number, s: StageScene): CSSProperties {
  const on = i === active
  const past = i < active
  const transform = on ? 'scale(1)' : past ? 'scale(1.25)' : `scale(${s.from ?? 0.88})`
  return {
    transform,
    opacity: on ? 1 : 0,
    filter: on ? 'blur(0px)' : `blur(${past ? 10 : 6}px)`,
    transformOrigin: s.origin ?? '50% 50%',
    transition: `transform 380ms ${on && s.bounce ? BOUNCE : EXPO}, opacity 260ms ${EXPO}, filter 320ms ${EXPO}`,
    pointerEvents: on ? 'auto' : 'none',
  }
}

export function FastStage({ active, scenes }: { active: number; scenes: readonly StageScene[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [h, setH] = useState(0)
  useEffect(() => {
    const ro = new ResizeObserver(() => setH(Math.max(0, ...refs.current.map((el) => el?.offsetHeight ?? 0))))
    refs.current.forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [scenes.length])
  return (
    <div className="relative" style={{ height: h || undefined }}>
      {scenes.map((s, i) => (
        <div key={i} className="absolute inset-x-0 top-1/2 -translate-y-1/2" aria-hidden={i !== active}>
          <div ref={(el) => { refs.current[i] = el }} className="will-change-transform" style={sceneStyle(i, active, s)}>
            {s.node}
          </div>
        </div>
      ))}
    </div>
  )
}
