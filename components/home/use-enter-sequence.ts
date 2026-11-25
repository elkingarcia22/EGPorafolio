'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/motion'

export interface EnterStep {
  /** selector dentro de la raíz */
  selector: string
  /** estado inicial desde el que entra */
  from: gsap.TweenVars
  /** posición en la línea de tiempo (por defecto, un poco después del paso anterior) */
  at?: gsap.Position
}

/** Paso entre un elemento y el siguiente dentro de un mismo paso */
const STAGGER_S = 0.07

/**
 * Entrada en secuencia de una sección, una sola vez, cuando la raíz entra en
 * pantalla: cada paso aparece encadenado al anterior, como impulsos que
 * pasan de un nodo al siguiente.
 */
export function useEnterSequence(
  rootRef: React.RefObject<HTMLElement | null>,
  steps: readonly EnterStep[],
  reducedMotion: boolean,
  start = 'top 72%',
): void {
  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 0.9, ease: 'expo.out', stagger: STAGGER_S },
        scrollTrigger: { trigger: root, start, toggleActions: 'play none none none' },
      })
      steps.forEach(({ selector, from, at }, i) => {
        const targets = root.querySelectorAll(selector)
        if (targets.length) tl.from(targets, { ...from, clearProps: 'transform,filter' }, at ?? (i === 0 ? 0 : '<0.15'))
      })
    }, root)
    return () => ctx.revert()
    // Los pasos son constantes del módulo que los usa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, reducedMotion, start])
}
