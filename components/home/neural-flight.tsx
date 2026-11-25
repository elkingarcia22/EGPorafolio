'use client'

import { useEffect, useRef } from 'react'
import { createFlightLoop } from '@/components/signal/flight-loop'
import { canvasColors } from '@/components/signal/styles/paint'
import { PALETTE_EVENT } from '@/lib/palettes'
import type { FlightWorkerMessage, FlightWorkerReply } from '@/components/signal/flight.worker'

interface NeuralFlightProps {
  /** Avance de la carga, 0–1. Después de llegar a 1 vuelve a 0: ese tramo es el salto final. */
  progress: React.MutableRefObject<number>
  /** Dónde queda en pantalla (px) la última neurona mientras espera completa, antes del salto */
  anchor?: React.MutableRefObject<{ x: number; y: number } | null>
  className?: string
}

/**
 * Un lienzo cuyo control ya pasó a un worker no se puede volver a pasar. En desarrollo React
 * monta los efectos dos veces: el worker se conserva un instante para que el segundo montaje
 * lo retome en vez de quedarse sin lienzo.
 */
const workers = new WeakMap<HTMLCanvasElement, { worker: Worker; release: number }>()
/** Lo que espera el worker de un lienzo desmontado antes de cerrarse (ms) */
const RELEASE_MS = 100

function workerFor(canvas: HTMLCanvasElement, init: () => FlightWorkerMessage): Worker | null {
  const kept = workers.get(canvas)
  if (kept) {
    window.clearTimeout(kept.release)
    return kept.worker
  }
  if (typeof Worker === 'undefined' || !('transferControlToOffscreen' in canvas)) return null
  try {
    const worker = new Worker(new URL('../signal/flight.worker.ts', import.meta.url))
    const message = init()
    const offscreen = canvas.transferControlToOffscreen()
    worker.postMessage({ ...message, canvas: offscreen }, [offscreen])
    workers.set(canvas, { worker, release: 0 })
    return worker
  } catch {
    // Sin OffscreenCanvas o sin workers de módulo: se dibuja en el hilo principal.
    return null
  }
}

function releaseWorker(canvas: HTMLCanvasElement): void {
  const kept = workers.get(canvas)
  if (!kept) return
  kept.release = window.setTimeout(() => {
    kept.worker.terminate()
    workers.delete(canvas)
  }, RELEASE_MS)
}

const sizeOf = (canvas: HTMLCanvasElement) => ({
  width: canvas.clientWidth,
  height: canvas.clientHeight,
  dpr: Math.min(window.devicePixelRatio || 1, 2),
})

/**
 * Carga del inicio, sin texto: la cámara entra a una red neuronal con nodos
 * en primer plano que buscan conectarse (las fibras salen, unas fallan y se
 * recogen, otras se quedan; cada vez más, al ritmo de la carga) y vuela de
 * neurona en neurona. Al terminar, la última neurona dispara y la cámara
 * salta hacia adelante, hasta que aparece el titular.
 *
 * Se dibuja en un worker cuando el navegador lo permite: así la red no se
 * traba mientras la página nueva se arma detrás de la cortina.
 */
export function NeuralFlight({ progress, anchor, className }: NeuralFlightProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const worker = workerFor(canvas, () => ({ type: 'init', ...sizeOf(canvas), colors: canvasColors(), progress: progress.current }) as FlightWorkerMessage)
    return worker ? runInWorker(canvas, worker, progress, anchor) : runHere(canvas, progress, anchor)
  }, [progress, anchor])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}

type Anchor = NeuralFlightProps['anchor']

/** El worker dibuja; aquí solo se le pasan el avance, el tamaño y los colores. */
function runInWorker(canvas: HTMLCanvasElement, worker: Worker, progress: React.MutableRefObject<number>, anchor: Anchor): () => void {
  const send = (message: FlightWorkerMessage) => worker.postMessage(message)
  let frame = 0
  let sent = -1
  let done = false
  const sync = () => {
    if (progress.current !== sent) {
      sent = progress.current
      send({ type: 'progress', value: sent })
    }
    if (!done) frame = requestAnimationFrame(sync)
  }
  const onReply = (event: MessageEvent<FlightWorkerReply>) => {
    if (event.data.type === 'anchor' && anchor) anchor.current = { x: event.data.x, y: event.data.y }
    if (event.data.type === 'done') {
      done = true
      cancelAnimationFrame(frame)
    }
  }
  const onResize = () => send({ type: 'resize', ...sizeOf(canvas) })
  const onPalette = () => send({ type: 'colors', colors: canvasColors() })
  worker.addEventListener('message', onReply)
  window.addEventListener('resize', onResize)
  window.addEventListener(PALETTE_EVENT, onPalette)
  frame = requestAnimationFrame(sync)
  return () => {
    cancelAnimationFrame(frame)
    worker.removeEventListener('message', onReply)
    window.removeEventListener('resize', onResize)
    window.removeEventListener(PALETTE_EVENT, onPalette)
    releaseWorker(canvas)
  }
}

/** Sin worker: el mismo vuelo en el hilo principal. */
function runHere(canvas: HTMLCanvasElement, progress: React.MutableRefObject<number>, anchor: Anchor): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}
  const loop = createFlightLoop(ctx, {
    progress: () => progress.current,
    onAnchor: anchor ? (point) => (anchor.current = point) : undefined,
  })
  const resize = () => {
    const { width, height, dpr } = sizeOf(canvas)
    loop.resize(width, height, dpr)
  }
  let frame = 0
  const tick = (time: number) => {
    if (loop.frame(time)) frame = requestAnimationFrame(tick)
  }
  resize()
  window.addEventListener('resize', resize)
  frame = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
  }
}
