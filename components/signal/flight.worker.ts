/**
 * El vuelo de la carga en su propio hilo: dibuja en un OffscreenCanvas, así la red
 * sigue fluida aunque el hilo principal esté ocupado armando la página nueva.
 *
 * Mensajes que recibe (ver <NeuralFlight>):
 * - init: { canvas, width, height, dpr, colors, progress }
 * - progress: { value } · resize: { width, height, dpr } · colors: { colors }
 * Mensajes que envía: anchor { x, y } · done
 */
import { createFlightLoop, type FlightLoop } from './flight-loop'
import { setCanvasColors, type CanvasColors } from './styles/paint'

export type FlightWorkerMessage =
  | { type: 'init'; canvas: OffscreenCanvas; width: number; height: number; dpr: number; colors: CanvasColors; progress: number }
  | { type: 'progress'; value: number }
  | { type: 'resize'; width: number; height: number; dpr: number }
  | { type: 'colors'; colors: CanvasColors }

export type FlightWorkerReply = { type: 'anchor'; x: number; y: number } | { type: 'done' }

/** Un cuadro a 60 fps cuando el worker no tiene requestAnimationFrame */
const FRAME_MS = 1000 / 60

const scope = self as unknown as Worker & { requestAnimationFrame?: (cb: (time: number) => void) => number }
const reply = (message: FlightWorkerReply) => scope.postMessage(message)
const nextFrame = (cb: (time: number) => void) =>
  scope.requestAnimationFrame ? scope.requestAnimationFrame(cb) : setTimeout(() => cb(performance.now()), FRAME_MS)

let loop: FlightLoop | null = null
let progress = 0

const tick = (time: number) => {
  if (!loop) return
  if (loop.frame(time)) nextFrame(tick)
  else reply({ type: 'done' })
}

scope.addEventListener('message', (event: MessageEvent<FlightWorkerMessage>) => {
  const message = event.data
  if (message.type === 'init') {
    setCanvasColors(message.colors)
    progress = message.progress
    const ctx = message.canvas.getContext('2d') as unknown as CanvasRenderingContext2D | null
    if (!ctx) return
    loop = createFlightLoop(ctx, {
      progress: () => progress,
      onAnchor: (point) => reply({ type: 'anchor', ...point }),
    })
    loop.resize(message.width, message.height, message.dpr)
    nextFrame(tick)
  } else if (message.type === 'progress') {
    progress = message.value
  } else if (message.type === 'resize') {
    loop?.resize(message.width, message.height, message.dpr)
  } else if (message.type === 'colors') {
    setCanvasColors(message.colors)
  }
})
