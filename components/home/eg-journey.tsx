'use client'

import { useEffect, useRef } from 'react'
import type { NetworkFit, NetworkGraph } from '@/components/signal/network-canvas'
import { buildGlyphWorld, flattenGlyphWorld, type GlyphWorld } from '@/components/signal/flight-world'
import { createFlightRenderer } from '@/components/signal/flight-render'
import { createFlightPulses } from '@/components/signal/flight-pulses'

/** Ancho del EG en unidades del mundo y profundidad que tiene al viajar por dentro */
const WORLD_WIDTH = 10
const WORLD_DEPTH = 4
/** Neuronas que se visitan (puntos de la caja del EG): de la E a la G */
const ROUTE: readonly [number, number][] = [[0.1, 0.25], [0.28, 0.75], [0.6, 0.22], [0.86, 0.66]]
/** Distancia a la que la cámara se detiene frente a cada neurona */
const VIEW_DISTANCE = 2.6
/** Duraciones (ms): viaje entre neuronas, alejarse y entregar al EG interactivo */
const FLY_MS = 2300
const PULL_MS = 1700
const HANDOFF_MS = 550
const FADE_IN_MS = 450
/** Avance del hero que dispara el viaje, y bajo el que se reinicia (al volver al titular) */
const TRIGGER_AT = 0.04
const RESET_BELOW = 0.015
/** Si al detectarlo ya se está más abajo que esto (volver desde otra página, recargar abajo), el EG aparece armado */
const SKIP_ABOVE = 0.6
const ARRIVAL_PULSES = 6
const PULSE_CHANCE = 0.3

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

interface EgJourneyProps {
  /** El EG (la figura con la que se construye el viaje) */
  graph: NetworkGraph | null
  /** recorrido del hero por scroll, 0–1 */
  heroProgress: React.MutableRefObject<number>
  /** salida: avance del EG interactivo (0 = sin armar, 1 = armado) */
  egProgress: React.MutableRefObject<number>
  /** salida: opacidad del EG interactivo (aparece al final del viaje) */
  egReveal: React.MutableRefObject<number>
  /** encuadre del EG (el mismo que usa el lienzo del EG) */
  fit: NetworkFit
  /** saltar el viaje (por ejemplo, al volver desde otra página) */
  skip: boolean
  className?: string
}

/** Ancho en px que ocupa el EG en pantalla (misma regla que <NetworkCanvas>) */
function egBoxWidth(width: number, height: number, fit: NetworkFit, aspect: number): number {
  const maxWidth = width < 768 ? Math.max(fit.width, 0.92) : fit.width
  return Math.min(width * maxWidth, height * fit.height * aspect)
}

/**
 * Paso del titular al EG, con tiempo propio (no sigue la velocidad del
 * scroll): la misma carga, pero hecha con la red del EG. Al deslizar, la
 * cámara viaja de neurona en neurona por dentro de las letras; luego se
 * aleja, la red se aplana y se ve el EG armado, que pasa al EG interactivo.
 */
export function EgJourney({ graph, heroProgress, egProgress, egReveal, fit, skip, className }: EgJourneyProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef(graph)
  graphRef.current = graph
  const ready = graph !== null

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !ready) return

    let world: GlyphWorld | null = null
    let render: ReturnType<typeof createFlightRenderer> | null = null
    let impulses: ReturnType<typeof createFlightPulses> | null = null
    let state: 'idle' | 'playing' | 'done' = 'idle'
    let startedAt = 0
    let arrived = new Set<number>()
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let lastZ = 0
    let cleared = true

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const setEg = (visible: number) => {
      egProgress.current = visible > 0 ? 1 : 0
      egReveal.current = visible
    }

    const clear = () => {
      if (cleared) return
      ctx.clearRect(0, 0, width, height)
      cleared = true
    }

    // El mundo se arma con la figura del momento (el EG) cada vez que empieza el viaje.
    const begin = (time: number) => {
      const current = graphRef.current
      if (!current) return
      world = buildGlyphWorld(current, WORLD_WIDTH, ROUTE)
      render = createFlightRenderer(world, { centerY: fit.centerY, dust: 260 })
      impulses = createFlightPulses(world)
      arrived = new Set()
      startedAt = time
      state = 'playing'
    }

    /** Cámara durante el viaje: tramos que frenan al llegar a cada neurona. */
    const flyCamera = (w: GlyphWorld, f: number, time: number) => {
      const way = w.route.map((i) => w.nodes[i])
      const stops = [
        { x: way[0].x + 1.6, y: way[0].y + 0.9, z: way[0].z - VIEW_DISTANCE - 6 },
        ...way.map((n) => ({ x: n.x, y: n.y, z: n.z - VIEW_DISTANCE })),
      ]
      const u = Math.min(0.9999, f) * (stops.length - 1)
      const seg = Math.floor(u)
      const k = easeInOut(u - seg)
      const a = stops[seg]
      const b = stops[seg + 1]
      if (k > 0.9 && !arrived.has(seg)) {
        arrived.add(seg)
        impulses?.fire(w.route[seg], ARRIVAL_PULSES)
      }
      return {
        x: a.x + (b.x - a.x) * k + Math.sin(time * 0.0007) * 0.12,
        y: a.y + (b.y - a.y) * k + Math.cos(time * 0.0006) * 0.1,
        z: a.z + (b.z - a.z) * k,
        roll: Math.sin(time * 0.0004) * 0.05 + (b.x - a.x) * 0.012 * Math.sin(Math.PI * k),
      }
    }

    const draw = (time: number) => {
      if (!world || !render || !impulses) return
      const e = time - startedAt
      const f = clamp01(e / FLY_MS)
      const g = easeInOut(clamp01((e - FLY_MS) / PULL_MS))
      const h = clamp01((e - FLY_MS - PULL_MS) / HANDOFF_MS)

      // Al alejarse, el volumen se aplana: la red vuelve a ser la figura del EG.
      flattenGlyphWorld(world, WORLD_DEPTH, g)
      const fly = flyCamera(world, f, time)
      const graphNow = graphRef.current
      const aspect = graphNow?.aspect ?? 2
      const focal = Math.min(width, height) * 0.85
      // Distancia final: el EG del viaje ocupa exactamente el lugar del EG interactivo.
      const finalZ = -(WORLD_WIDTH * focal) / egBoxWidth(width, height, fit, aspect)
      const camera = {
        x: fly.x * (1 - g),
        y: fly.y * (1 - g),
        z: fly.z + (finalZ - fly.z) * g,
        roll: fly.roll * (1 - g),
      }
      const speed = Math.abs(camera.z - lastZ)
      lastZ = camera.z

      impulses.spawnNear(camera.z, PULSE_CHANCE * (1 - g))
      impulses.step()
      render({
        ctx,
        dpr,
        width,
        height,
        time,
        camera,
        speed,
        fade: clamp01(e / FADE_IN_MS) * (1 - h),
        glow: impulses.glow,
        pulses: impulses.pulses,
      })
      cleared = false
      setEg(h)
      if (h >= 1) {
        state = 'done'
        clear()
      }
    }

    const loop = (time: number) => {
      const p = heroProgress.current
      if (state !== 'idle' && p < RESET_BELOW) {
        // De vuelta al titular: todo listo para viajar otra vez.
        state = 'idle'
        setEg(0)
        clear()
      } else if (state === 'idle' && p > TRIGGER_AT) {
        if (skip || p > SKIP_ABOVE) {
          state = 'done'
          setEg(1)
        } else {
          begin(time)
        }
      }
      if (state === 'playing') draw(time)
      frame = requestAnimationFrame(loop)
    }

    resize()
    setEg(0)
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [ready, heroProgress, egProgress, egReveal, fit, skip])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
