import type { L } from '@/lib/i18n'

/** Captura real del producto: archivo en /public/cases/encuestas, con su tamaño real. */
export interface Shot {
  src: string
  width: number
  height: number
  alt: L
}

export interface Fact {
  value: string
  label: L
  /** Marca la cifra como de referencia (no medida en producción). */
  reference?: boolean
}

export interface Titled {
  title: L
  body: L
}

/** Una parada del ciclo de una medición, con lo que estaba roto y lo que cambió. */
export interface Station {
  id: string
  name: L
  who: L
  before: L
  after: L
}

/** Un hallazgo de la auditoría, con el área del producto donde aparece. */
export interface Finding {
  area: 'lista' | 'constructor' | 'resultados' | 'privacidad' | 'carga'
  text: L
}

/** Una iteración del producto: qué se probó, qué se descartó y qué quedó. */
export interface Iteration {
  id: string
  name: string
  when: L
  shape: 'chat' | 'drawer' | 'tree' | 'system'
  tried: L
  dropped: L
  kept: L
}
