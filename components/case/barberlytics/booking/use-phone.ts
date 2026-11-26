'use client'

import { useNarrow } from '../use-narrow'

/** Por debajo de este ancho cada pieza usa su composición propia del teléfono */
const PHONE_QUERY = '(max-width: 767px)'

/** ¿Se ve en un teléfono? Entonces la pieza se recompone, no se achica. */
export function usePhone(): boolean {
  return useNarrow(PHONE_QUERY)
}
