'use client'

import { useEffect, useState } from 'react'

/** Por debajo de este ancho (px) las piezas de Thema cambian a su versión de teléfono */
const NARROW_MAX = 767

/** ¿La pantalla es de teléfono? Arranca en false (escritorio) y se corrige al montar. */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${NARROW_MAX}px)`)
    const update = () => setNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return narrow
}
