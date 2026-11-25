'use client'

import { useEffect, useState } from 'react'

/** La pieza arranca cuando ya está bien adentro de la pantalla */
const ENTER_MARGIN = '0px 0px -25% 0px'

/**
 * `entered`: la pieza ya entró a la pantalla alguna vez (para animar una sola vez al llegar).
 * `visible`: está a la vista ahora (para pausar lo que corre en bucle cuando no se ve).
 */
export function useInView(ref: React.RefObject<Element | null>) {
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setEntered(true)
      },
      { rootMargin: ENTER_MARGIN },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return { entered, visible }
}
