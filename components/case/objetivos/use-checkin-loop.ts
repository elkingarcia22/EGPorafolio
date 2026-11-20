'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cuenta, type ObjetivoPersona } from './cascade-model'

interface LoopOptions {
  enabled: boolean
  every: number
}

export interface Checkin {
  o: ObjetivoPersona
  from: number
}

export interface CheckinState {
  objetivos: readonly ObjetivoPersona[]
  pulse: string | null
  pulseKey: number
  last: Checkin | null
  /** Registra un avance a mano (la demo) con la misma chispa que el recorrido automático. */
  report: (id: string, avance: number) => void
  /** Reemplaza un objetivo (aprobar, devolver). */
  update: (id: string, patch: Partial<ObjetivoPersona>) => void
}

const MAX = 120

/**
 * Un ciclo que se mueve solo: cada `every` ms alguien con un objetivo aprobado reporta un poco más.
 * Las actualizaciones crean objetos nuevos; el estado anterior no se toca.
 */
export function useCheckinLoop(initial: readonly ObjetivoPersona[], { enabled, every }: LoopOptions): CheckinState {
  const [objetivos, setObjetivos] = useState(initial)
  const [pulse, setPulse] = useState<string | null>(null)
  const [pulseKey, setPulseKey] = useState(0)
  const [last, setLast] = useState<Checkin | null>(null)
  const turn = useRef(0)

  const current = useRef(initial)
  current.current = objetivos

  /** Aplica un avance: un objeto nuevo para ese objetivo, la chispa y la tarjeta del último reporte. */
  const apply = useCallback((id: string, avance: number) => {
    const before = current.current.find((o) => o.id === id)
    if (!before) return
    const next = { ...before, avance: Math.max(0, Math.min(MAX, Math.round(avance))) }
    current.current = current.current.map((o) => (o.id === id ? next : o))
    setObjetivos(current.current)
    setLast({ o: next, from: before.avance })
    setPulse(id)
    setPulseKey((k) => k + 1)
  }, [])

  const update = useCallback((id: string, patch: Partial<ObjetivoPersona>) => {
    current.current = current.current.map((o) => (o.id === id ? { ...o, ...patch } : o))
    setObjetivos(current.current)
    setPulse(id)
    setPulseKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      const candidates = current.current.filter((o) => cuenta(o) && o.avance < MAX)
      if (candidates.length === 0) {
        // Todos llegaron al tope: empieza otro periodo con las cifras de partida. Los anillos bajan
        // con su transición en vez de quedarse quietos para siempre.
        current.current = initial
        setObjetivos(initial)
        setPulse(null)
        return
      }
      turn.current += 3
      const pick = candidates[turn.current % candidates.length]
      apply(pick.id, pick.avance + 3 + ((turn.current * 7) % 6))
    }, every)
    return () => window.clearInterval(id)
  }, [enabled, every, apply, initial])

  return { objetivos, pulse, pulseKey, last, report: apply, update }
}
