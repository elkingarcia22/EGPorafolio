'use client'

import { useEffect, useState } from 'react'

/** Escritorio a partir de aquí: debajo, las composiciones del caso cambian de forma (no se encogen). */
export const DESKTOP_QUERY = '(min-width: 1024px)'
export const TABLET_QUERY = '(min-width: 768px)'

/**
 * Si la media query se cumple. En el servidor y en el primer render vale `fallback` (escritorio por
 * defecto, para que la portada no cambie al hidratar en pantallas grandes).
 */
export function useMedia(query: string, fallback = true): boolean {
  const [matches, setMatches] = useState(fallback)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}
