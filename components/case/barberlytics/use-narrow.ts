'use client'

import { useEffect, useState } from 'react'

/** Celular (por defecto, ≤ 640 px): para recomponer una pieza en vez de achicarla. */
export function useNarrow(query = '(max-width: 640px)'): boolean {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return narrow
}
