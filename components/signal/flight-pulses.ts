import type { FlightWorld } from './flight-world'

export interface FlightPulse {
  link: number
  /** avance 0–1 por la fibra */
  t: number
  /** true: de `a` a `b` */
  forward: boolean
  speed: number
}

const MAX_PULSES = 22
/** Brillo con el que queda la neurona a la que llega un impulso */
const ARRIVAL_GLOW = 0.8
/** Distancia por delante de la cámara en la que aparecen impulsos al azar */
const NEAR_RANGE = { from: 1, to: 9 }

/**
 * Impulsos del vuelo por la red: los que dispara una neurona al llegar a
 * ella, los que aparecen al azar cerca de la cámara, y el brillo de cada
 * neurona (se enciende al recibir un impulso y se apaga despacio).
 */
export function createFlightPulses(world: FlightWorld) {
  const pulses: FlightPulse[] = []
  const glow = new Float32Array(world.nodes.length)
  const linksOf = world.nodes.map(() => [] as number[])
  world.links.forEach((l, i) => {
    linksOf[l.a].push(i)
    linksOf[l.b].push(i)
  })

  return {
    pulses,
    glow,
    /** La neurona dispara: se enciende y suelta impulsos por sus fibras. */
    fire(node: number, count: number): void {
      glow[node] = 1
      for (const link of linksOf[node].slice(0, count)) {
        if (pulses.length >= MAX_PULSES) return
        pulses.push({ link, t: 0, forward: world.links[link].a === node, speed: 0.025 + Math.random() * 0.02 })
      }
    },
    /** A veces nace un impulso en una fibra cercana a la cámara. */
    spawnNear(cameraZ: number, chance: number): void {
      if (pulses.length >= MAX_PULSES || Math.random() >= chance) return
      const near: number[] = []
      world.links.forEach((l, i) => {
        const d = world.nodes[l.a].z - cameraZ
        if (d > NEAR_RANGE.from && d < NEAR_RANGE.to) near.push(i)
      })
      const link = near[Math.floor(Math.random() * near.length)]
      if (link !== undefined) pulses.push({ link, t: 0, forward: Math.random() < 0.5, speed: 0.02 + Math.random() * 0.02 })
    },
    /** Avanza un cuadro: los impulsos corren y las neuronas se apagan. */
    step(): void {
      for (let i = 0; i < glow.length; i++) glow[i] *= 0.96
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        pulse.t += pulse.speed
        if (pulse.t < 1) continue
        const link = world.links[pulse.link]
        const to = pulse.forward ? link.b : link.a
        glow[to] = Math.max(glow[to], ARRIVAL_GLOW)
        pulses.splice(i, 1)
      }
    },
    clear(): void {
      pulses.length = 0
      glow.fill(0)
    },
  }
}
