'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { CASCADE_STEPS, CascadeCanvas } from '@/components/case/objetivos/alignment-builder'

/** Lo que tarda el mapa en desvanecerse (y en volver) entre un ciclo y el siguiente. */
const FADE_MS = 450

const COUNTER = ['1 persona', '1 persona → 1 grupo', '1 persona → 1 grupo → 2 objetivos', '3 de 3 objetivos de empresa con aporte', '3 de 3 objetivos de empresa con aporte']

/**
 * Vista previa de Objetivos en la lista de proyectos: el mapa de alineación en
 * cascada. La cámara arranca en una persona, sigue a su grupo y a los objetivos
 * de empresa, y se aleja hasta mostrar el ciclo entero (datos del staging).
 */
export function ObjetivosPreview() {
  const { reducedMotion } = useA11y()
  const last = CASCADE_STEPS.length - 1
  const [phase, setPhase] = useState(reducedMotion ? last : 0)
  // Al cerrar el ciclo el mapa se desvanece entero y vuelve a montarse en la primera toma,
  // en vez de borrar las líneas de golpe y viajar con la cámara de vuelta.
  const [leaving, setLeaving] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    if (leaving) {
      const id = window.setTimeout(() => {
        setPhase(0)
        setCycle((c) => c + 1)
        setLeaving(false)
      }, FADE_MS)
      return () => window.clearTimeout(id)
    }
    const next = () => (phase === last ? setLeaving(true) : setPhase(phase + 1))
    const id = window.setTimeout(next, CASCADE_STEPS[phase])
    return () => window.clearTimeout(id)
  }, [phase, leaving, last, reducedMotion])

  return (
    <div className="relative flex aspect-[4/3] flex-col justify-center overflow-hidden bg-[#0b0d16] px-[5%]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_25%_40%,rgba(12,91,239,0.25),transparent_70%),radial-gradient(40%_50%_at_85%_90%,rgba(123,92,255,0.2),transparent_70%)]" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-lg bg-white text-[#161a2c] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] px-2.5 py-1.5">
          <span className="text-[10px] font-semibold">Mapa de alineación</span>
          <span key={phase} className="truncate text-[8px] font-medium text-[#0c5bef] animate-[ramp-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">{COUNTER[phase]}</span>
        </div>
        <div className="transition-opacity ease-out" style={{ opacity: leaving ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}>
          <CascadeCanvas key={cycle} phase={phase} />
        </div>
      </div>
      <span className="absolute bottom-[3%] left-[5%] font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
        {phase >= 3 ? 'Persona → grupo → empresa' : 'Alineando'}
      </span>
      <span className="sr-only">El mapa de alineación en cascada: una persona aporta a su grupo, el grupo a los objetivos de empresa, y la vista se aleja hasta mostrar todo el ciclo.</span>
    </div>
  )
}
