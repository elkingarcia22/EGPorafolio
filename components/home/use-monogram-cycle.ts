'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildWordGraphs } from '@/components/signal/glyph-graph'
import type { NetworkGraph } from '@/components/signal/network-canvas'
import type { Locale } from '@/lib/i18n'

/** Monograma base: la red siempre vuelve a él */
const HOME = 'EG'
/** Siglas del mundo de producto, de dos en dos entre cada EG */
const TERMS: Record<Locale, readonly string[]> = {
  es: ['UX', 'UI', 'CX', 'IA', 'BX', 'DX'],
  en: ['UX', 'UI', 'CX', 'AI', 'BX', 'DX'],
}
/** Cada cuánto cambia sola la figura (con el EG ya formado): la transformación más una pausa corta */
const AUTO_MS = 1900
/** Pausa mínima entre dos cambios por hover (evita cambios en cadena) */
const HOVER_COOLDOWN_MS = 1000
/** Desde qué avance del scroll el EG cuenta como formado */
const FORMED_PROGRESS = 0.95

/** EG, dos siglas, EG, dos siglas… */
function buildSequence(terms: readonly string[]): string[] {
  const sequence: string[] = []
  for (let i = 0; i < terms.length; i += 2) sequence.push(HOME, ...terms.slice(i, i + 2))
  return sequence
}

interface MonogramCycle {
  graph: NetworkGraph | null
  /** Pasar a NetworkCanvas: avisa del hover y avanza la secuencia al entrar */
  onHoverChange: (hovering: boolean) => void
  hovering: boolean
}

/**
 * La red del hero va cambiando de forma: EG → UX → UI → EG → CX → IA → EG…
 * Cambia cada vez que el cursor entra en la figura y también sola cada
 * cierto tiempo, mientras el hero está en pantalla.
 */
export function useMonogramCycle(
  locale: Locale,
  progress: React.MutableRefObject<number>,
  active: boolean,
  reducedMotion: boolean,
): MonogramCycle {
  const [graphs, setGraphs] = useState<Record<string, NetworkGraph> | null>(null)
  const [step, setStep] = useState(0)
  const [hovering, setHovering] = useState(false)
  const lastChange = useRef(0)
  const sequence = useMemo(() => buildSequence(TERMS[locale]), [locale])

  // Todas las figuras se generan una vez (mientras corre la carga).
  useEffect(() => {
    let cancelled = false
    const words = Array.from(new Set([HOME, ...TERMS.es, ...TERMS.en]))
    buildWordGraphs(words, window.innerWidth < 768)
      .then((built) => {
        if (!cancelled) setGraphs(built)
      })
      .catch(() => {
        // Sin canvas el hero sigue funcionando con su tipografía.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const advance = useCallback(() => {
    lastChange.current = performance.now()
    setStep((s) => (s + 1) % sequence.length)
  }, [sequence.length])

  // Cambio automático: solo con el EG formado, el hero visible y la pestaña activa.
  useEffect(() => {
    if (!graphs || !active || reducedMotion) return
    const timer = window.setInterval(() => {
      const formed = progress.current > FORMED_PROGRESS
      const idle = performance.now() - lastChange.current > AUTO_MS * 0.6
      if (formed && idle && !document.hidden) advance()
    }, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [graphs, active, reducedMotion, progress, advance])

  // Al salir del hero vuelve al EG, para empezar de nuevo desde la marca.
  useEffect(() => {
    if (!active) setStep(0)
  }, [active])

  const onHoverChange = useCallback(
    (next: boolean) => {
      setHovering(next)
      if (next && !reducedMotion && performance.now() - lastChange.current > HOVER_COOLDOWN_MS) advance()
    },
    [advance, reducedMotion],
  )

  const word = sequence[step % sequence.length]
  return { graph: graphs?.[word] ?? null, onHoverChange, hovering }
}
