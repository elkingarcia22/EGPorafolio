'use client'

import { useSyncExternalStore } from 'react'

export type NetworkStyleId = 'classic' | 'neuron' | 'synapse' | 'plexus'

export const NETWORK_STYLES: readonly { id: NetworkStyleId; label: string }[] = [
  { id: 'classic', label: 'Actual' },
  { id: 'neuron', label: 'V1 · Neurona' },
  { id: 'synapse', label: 'V2 · Sinapsis' },
  { id: 'plexus', label: 'V3 · Plexo' },
]

const DEFAULT_STYLE: NetworkStyleId = 'synapse'
/** Con ?red=1|2|3|0 en la URL se puede ver otra versión (para comparar) */
const URL_PARAM = 'red'
const URL_VALUES: Record<string, NetworkStyleId> = { '0': 'classic', '1': 'neuron', '2': 'synapse', '3': 'plexus' }

let current: NetworkStyleId | null = null
const listeners = new Set<() => void>()

function initial(): NetworkStyleId {
  const fromUrl = URL_VALUES[new URLSearchParams(window.location.search).get(URL_PARAM) ?? '']
  return fromUrl ?? DEFAULT_STYLE
}

/** Versión de la red activa (la leen los lienzos en cada cuadro). */
export function getNetworkStyle(): NetworkStyleId {
  if (typeof window === 'undefined') return DEFAULT_STYLE
  if (current === null) current = initial()
  return current
}

export function setNetworkStyle(next: NetworkStyleId): void {
  current = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useNetworkStyle(): NetworkStyleId {
  return useSyncExternalStore(subscribe, getNetworkStyle, () => DEFAULT_STYLE)
}
