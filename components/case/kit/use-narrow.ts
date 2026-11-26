'use client'

import { useEffect, useState } from 'react'

/** Teléfono: por debajo de este ancho las piezas usan su versión vertical */
const NARROW_QUERY = '(max-width: 767px)'

/** ¿Pantalla de teléfono? (false en el servidor y hasta medir). */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY)
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return narrow
}
