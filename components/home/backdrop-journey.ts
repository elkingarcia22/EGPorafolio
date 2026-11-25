/**
 * Control del viaje del fondo único (ver <NeuralBackdrop>): una sección pide
 * que la cámara del fondo viaje por la red hasta quedar sobre un elemento
 * (p. ej. el nodo de su etiqueta), y luego la suelta para que vuelva a flotar.
 * Así las transiciones entre secciones ocurren en la misma red, sin lienzos
 * aparte que dejen bordes.
 */

/**
 * Movimientos de cámara disponibles:
 * - 'arrive': viaja hacia adelante de neurona en neurona y aterriza sobre el ancla.
 * - 'dive-out': entra en picada hasta una neurona (en primer plano, con sus
 *   conexiones encima) y luego se aleja en profundidad girando hacia una esquina.
 */
export type JourneyKind = 'arrive' | 'dive-out'

export interface JourneyRequest {
  /** movimiento de cámara (por defecto 'arrive') */
  kind?: JourneyKind
  /** elemento sobre el que aterriza la neurona de destino ('arrive') */
  anchor?: HTMLElement
  /** duración del viaje (ms) */
  durationMs: number
}

interface JourneyHandler {
  play: (request: JourneyRequest) => void
  release: () => void
}

let handler: JourneyHandler | null = null
/** Viaje en curso: solo quien lo pidió puede soltarlo (una sección no corta el viaje de la siguiente) */
let current = 0

/** Lo registra <NeuralBackdrop> al montarse. */
export function registerBackdropJourney(next: JourneyHandler | null): void {
  handler = next
}

export const backdropJourney = {
  /** La cámara del fondo hace el movimiento pedido. Devuelve un turno para poder soltarlo. */
  play(request: JourneyRequest): number {
    current += 1
    handler?.play(request)
    return current
  },
  /** La cámara vuelve a flotar con el scroll, si el viaje en curso es el de ese turno. */
  release(turn: number): void {
    if (turn !== current) return
    handler?.release()
  },
}

/** Calma del fondo (0–1) que pide cada sección; manda la mayor, para que dos secciones no se pisen. */
const quietLevels = new Map<string, number>()

export const backdropQuiet = {
  /** `owner` identifica a la sección que lo pide (hero, enfoque, proyectos…). */
  set(owner: string, level: number): void {
    quietLevels.set(owner, Math.min(1, Math.max(0, level)))
  },
  get(): number {
    let max = 0
    quietLevels.forEach((level) => (max = Math.max(max, level)))
    return max
  },
}
