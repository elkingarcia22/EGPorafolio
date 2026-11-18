'use client'

import { useEffect, useMemo, useState } from 'react'
import { buildGlyphGraph, type GlyphGraphOptions } from '@/components/signal/glyph-graph'
import type { NetworkGraph } from '@/components/signal/network-canvas'

/** Azar reproducible: el mismo dibujo en cada render (y en el PDF). */
function seeded(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface ConstellationProps {
  width: number
  height: number
  /** Cuántos nodos intentar colocar */
  count: number
  /** Distancia máxima para unir dos nodos (px) */
  reach: number
  seed?: number
  className?: string
  /** Índices de nodos resaltados con el color de acento */
  accentEvery?: number
}

/** Red decorativa: nodos repartidos y unidos con sus vecinos cercanos. */
export function Constellation({ width, height, count, reach, seed = 7, className, accentEvery = 6 }: ConstellationProps) {
  const { nodes, links } = useMemo(() => {
    const rand = seeded(seed)
    const minGap = reach * 0.45
    const pts: { x: number; y: number }[] = []
    for (let i = 0; i < count * 40 && pts.length < count; i++) {
      const x = rand() * width
      const y = rand() * height
      if (pts.every((p) => Math.hypot(p.x - x, p.y - y) > minGap)) pts.push({ x, y })
    }
    const pairs: [number, number][] = []
    pts.forEach((a, i) => {
      for (let j = i + 1; j < pts.length; j++) if (Math.hypot(a.x - pts[j].x, a.y - pts[j].y) < reach) pairs.push([i, j])
    })
    return { nodes: pts, links: pairs }
  }, [width, height, count, reach, seed])

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className} aria-hidden="true">
      {links.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="currentColor" strokeOpacity={0.28} strokeWidth={0.6} />
      ))}
      {nodes.map((n, i) => {
        const accent = i % accentEvery === 0
        const s = accent ? 3.2 : 2
        return <rect key={i} x={n.x - s / 2} y={n.y - s / 2} width={s} height={s} fill={accent ? 'rgb(var(--signal))' : 'currentColor'} />
      })}
    </svg>
  )
}

/** Red más abierta para tamaños pequeños (menos nodos, líneas más largas) */
export const SPARSE_GLYPH: GlyphGraphOptions = {
  spacing: { desktop: 0.42, mobile: 0.42 },
  reach: { desktop: 1.15, mobile: 1.15 },
  strokePadding: 0.12,
}

interface GlyphNetworkProps {
  text: string
  height: number
  className?: string
  options?: GlyphGraphOptions
}

/** Un texto (p. ej. "EG") dibujado como red, igual que en el hero. */
export function GlyphNetwork({ text, height, className, options }: GlyphNetworkProps) {
  const [graph, setGraph] = useState<NetworkGraph | null>(null)
  useEffect(() => {
    let cancelled = false
    buildGlyphGraph(text, false, options)
      .then((g) => {
        if (!cancelled) setGraph(g)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [text, options])

  const width = graph ? Math.round(height * graph.aspect) : height
  if (!graph) return <span style={{ display: 'inline-block', width, height }} className={className} />
  const p = (i: number) => ({ x: graph.nodes[i].x * width, y: graph.nodes[i].y * height })
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className} aria-hidden="true">
      {graph.links.map(([a, b]) => {
        const pa = p(a)
        const pb = p(b)
        return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="currentColor" strokeOpacity={0.5} strokeWidth={0.7} />
      })}
      {graph.nodes.map((_, i) => {
        const { x, y } = p(i)
        const lit = i % 7 === 0
        const s = lit ? 3 : 2
        return <rect key={i} x={x - s / 2} y={y - s / 2} width={s} height={s} fill={lit ? 'rgb(var(--signal))' : 'currentColor'} />
      })}
    </svg>
  )
}
