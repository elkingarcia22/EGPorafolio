import type { FlightWorld } from './flight-world'

/** Estado de cada conexión mientras la red se busca */
const IDLE = 0
const PROBING = 1
const CONNECTED = 2
const FAILING = 3

/** Cuánto tarda una fibra en tenderse hacia la otra neurona, y en recogerse si falla (ms) */
const PROBE_MS = 420
const FAIL_MS = 380
/** Intentos nuevos por segundo, al principio y al final */
const RATE = { start: 9, end: 24 }
/** Probabilidad de que un intento conecte, al principio y al final */
const SUCCESS = { start: 0.15, end: 0.55 }
/** Dónde se buscan conexiones: tramo de profundidad delante de la cámara */
const NEAR = { from: 0.4, to: 12 }
const PICK_TRIES = 24

/**
 * Búsqueda de conexiones dentro del viaje (la carga original, ahora en 3D):
 * cerca de la cámara, las neuronas lanzan fibras hacia sus vecinas. Al
 * principio casi todas fallan y se recogen; a medida que avanza la carga,
 * cada vez más se quedan y la red se va tejiendo en primer plano.
 */
export function createLinkSearch(world: FlightWorld) {
  const count = world.links.length
  /** avance de cada fibra, 0–1 (lo dibuja el renderer) */
  const grow = new Float32Array(count)
  const state = new Uint8Array(count)
  const willConnect = new Uint8Array(count)
  const linksOf = world.nodes.map(() => [] as number[])
  world.links.forEach((l, i) => {
    linksOf[l.a].push(i)
    linksOf[l.b].push(i)
  })
  let debt = 0

  const spawn = (cameraZ: number, chance: number) => {
    for (let t = 0; t < PICK_TRIES; t++) {
      const i = Math.floor(Math.random() * count)
      if (state[i] !== IDLE) continue
      const l = world.links[i]
      const d = Math.min(world.nodes[l.a].z, world.nodes[l.b].z) - cameraZ
      if (d < NEAR.from || d > NEAR.to) continue
      state[i] = PROBING
      willConnect[i] = Math.random() < chance ? 1 : 0
      return
    }
  }

  return {
    grow,
    /**
     * Avanza un cuadro. `progress` (0–1) hace que haya más intentos y más éxitos.
     * Devuelve las neuronas que acaban de quedar conectadas (para encenderlas).
     */
    step(dtMs: number, cameraZ: number, progress: number): number[] {
      const p = Math.min(1, Math.max(0, progress))
      debt += ((RATE.start + (RATE.end - RATE.start) * p) * dtMs) / 1000
      const chance = SUCCESS.start + (SUCCESS.end - SUCCESS.start) * p
      while (debt >= 1) {
        spawn(cameraZ, chance)
        debt -= 1
      }
      const lit: number[] = []
      for (let i = 0; i < count; i++) {
        if (state[i] === PROBING) {
          grow[i] = Math.min(1, grow[i] + dtMs / PROBE_MS)
          if (grow[i] < 1) continue
          if (willConnect[i]) {
            state[i] = CONNECTED
            lit.push(world.links[i].a, world.links[i].b)
          } else state[i] = FAILING
        } else if (state[i] === FAILING) {
          grow[i] = Math.max(0, grow[i] - dtMs / FAIL_MS)
          if (grow[i] <= 0) state[i] = IDLE
        }
      }
      return lit
    },
    /** La neurona se conecta con todas sus vecinas (al llegar la cámara a ella). */
    connectNode(node: number): void {
      for (const i of linksOf[node]) {
        if (state[i] === CONNECTED) continue
        state[i] = PROBING
        willConnect[i] = 1
      }
    },
  }
}
