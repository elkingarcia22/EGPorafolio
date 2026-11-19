'use client'

import type * as React from 'react'
import './clipper-orb.css'

export type ClipperOrbState = 'idle' | 'listening' | 'thinking'

/*
 * El orbe de Clipper tal como vive en Barberlytics (ClipperOrb del sistema Thema), con el
 * gradiente de IA del tema Premium. Las franjas del poste: rectas, a 45°, en un lienzo de 100×100;
 * `STRIPE_PERIOD` es lo que se desplaza la animación para que el ciclo empalme sin salto.
 */
const STRIPE_PERIOD = 24
const STRIPE_THICKNESS = 12

function stripePath(baseline: number): string {
  return `M-2,${baseline + 52}L102,${baseline - 52}L102,${baseline - 52 + STRIPE_THICKNESS}L-2,${baseline + 52 + STRIPE_THICKNESS}Z`
}

const STRIPES = Array.from({ length: 14 }, (_, i) => stripePath(-96 + i * STRIPE_PERIOD)).join('')

interface ClipperOrbProps {
  size?: number
  state?: ClipperOrbState
  className?: string
}

/** La presencia de Clipper: el poste de barbería hecho esfera de vidrio. */
export function ClipperOrb({ size = 128, state = 'idle', className = '' }: ClipperOrbProps) {
  return (
    <span
      aria-hidden="true"
      data-state={state}
      className={`clipper-orb inline-block ${className}`}
      style={{ '--clipper-orb-size': `${size}px` } as React.CSSProperties}
    >
      <span className="clipper-orb__halo" />
      <span className="clipper-orb__ring" />
      <span className="clipper-orb__sphere">
        <svg className="clipper-orb__stripes" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <path className="clipper-orb__stripes-band" d={STRIPES} />
        </svg>
      </span>
      <span className="clipper-orb__glass" />
    </span>
  )
}
