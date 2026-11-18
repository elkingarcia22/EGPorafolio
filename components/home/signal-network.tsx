'use client'

import { useEffect, useMemo, useRef } from 'react'
import { NetworkCanvas, type NetworkGraph } from '@/components/signal/network-canvas'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

const NODE_COUNT = 54
/** Distancia máxima (fracción del lado) para conectar dos nodos */
const LINK_DISTANCE = 0.24

/** Red en disco, más densa hacia el centro. */
function createDiscGraph(): NetworkGraph {
  const nodes = Array.from({ length: NODE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.pow(Math.random(), 0.7) * 0.44
    return { x: 0.5 + Math.cos(angle) * radius, y: 0.5 + Math.sin(angle) * radius }
  })
  const links: [number, number][] = []
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      if (Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y) < LINK_DISTANCE) links.push([a, b])
    }
  }
  return { nodes, links, aspect: 1 }
}

/**
 * Red de conexiones de Contacto: nodos sueltos (ruido) que, al entrar en
 * pantalla, se enlazan y empiezan a pasarse impulsos.
 */
export function SignalNetwork({ label }: { label: string }) {
  const { reducedMotion } = useA11y()
  const wrapRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const graph = useMemo(() => (typeof window === 'undefined' ? null : createDiscGraph()), [])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || reducedMotion) {
      progress.current = 1
      return
    }
    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: 'top 90%',
      end: 'center 55%',
      scrub: 0.8,
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })
    return () => trigger.kill()
  }, [reducedMotion])

  return (
    <div ref={wrapRef} role="img" aria-label={label} className="relative mx-auto aspect-square w-full max-w-md md:max-w-none">
      <NetworkCanvas graph={graph} progress={progress} reducedMotion={reducedMotion} className="absolute inset-0" />
    </div>
  )
}
