import type { Frame, FrameLink } from './types'

/** Tonos de apoyo, derivados del azul de la marca */
export const ICE = '150,190,255'
export const CYAN = '110,220,255'
/** Chispa: solo para neuronas que "disparan", muy poco */
export const SPARK = '255,84,170'

const spriteCache = new Map<string, HTMLCanvasElement>()

/**
 * Halo radial pre-dibujado (se cachea): pintar halos con drawImage es mucho
 * más barato que crear un degradado por nodo en cada cuadro.
 */
export function glowSprite(rgb: string, soft = 0.55): HTMLCanvasElement {
  const key = `${rgb}|${soft}`
  const cached = spriteCache.get(key)
  if (cached) return cached
  const size = 128
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const g = c.getContext('2d')
  if (g) {
    const r = size / 2
    const grad = g.createRadialGradient(r, r, 0, r, r, r)
    grad.addColorStop(0, `rgba(${rgb},1)`)
    grad.addColorStop(soft * 0.35, `rgba(${rgb},0.55)`)
    grad.addColorStop(soft, `rgba(${rgb},0.14)`)
    grad.addColorStop(1, `rgba(${rgb},0)`)
    g.fillStyle = grad
    g.fillRect(0, 0, size, size)
  }
  spriteCache.set(key, c)
  return c
}

/** Pinta un halo centrado en (x, y) con radio `r`. */
export function drawGlow(ctx: CanvasRenderingContext2D, sprite: HTMLCanvasElement, x: number, y: number, r: number, alpha: number): void {
  if (alpha <= 0.01 || r <= 0.5) return
  ctx.globalAlpha = Math.min(1, alpha)
  ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2)
  ctx.globalAlpha = 1
}

/** Número pseudoaleatorio estable a partir de un entero (curvaturas, grosores). */
export function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

/**
 * Punto de control de una conexión curva: se dobla hacia un lado según su
 * semilla y respira despacio, como un filamento vivo.
 */
export function curveControl(
  ax: number, ay: number, bx: number, by: number,
  seed: number, time: number, bend: number, sway: number,
): { x: number; y: number } {
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const dx = bx - ax
  const dy = by - ay
  const side = seed < 0.5 ? -1 : 1
  const amount = (0.35 + seed) * bend * side + Math.sin(time * 0.0006 + seed * 40) * sway
  return { x: mx - dy * amount, y: my + dx * amount }
}

/** Punto sobre una curva cuadrática. */
export function quadPoint(ax: number, ay: number, cx: number, cy: number, bx: number, by: number, t: number): { x: number; y: number } {
  const u = 1 - t
  return { x: u * u * ax + 2 * u * t * cx + t * t * bx, y: u * u * ay + 2 * u * t * cy + t * t * by }
}

/** Escalones de opacidad: agrupa conexiones para trazarlas con pocas llamadas. */
export const ALPHA_STEPS = 6

/** Reparte las conexiones por escalón de opacidad (la más tenue primero). */
export function bucketLinks(links: readonly FrameLink[]): FrameLink[][] {
  const buckets: FrameLink[][] = Array.from({ length: ALPHA_STEPS }, () => [])
  for (const link of links) {
    if (link.alpha <= 0.02) continue
    buckets[Math.min(ALPHA_STEPS - 1, Math.floor(link.alpha * ALPHA_STEPS))].push(link)
  }
  return buckets
}

/** Opacidad que representa a un escalón. */
export function bucketAlpha(step: number): number {
  return (step + 0.75) / ALPHA_STEPS
}

export type DepthLayer = 'far' | 'focus' | 'near'

/** Capa de profundidad de un nodo (0 = lejos, 1 = cerca). */
export function layerOf(depth: number): DepthLayer {
  if (depth < 0.22) return 'far'
  if (depth > 0.86) return 'near'
  return 'focus'
}

/** Capa de una conexión: la de su extremo más cercano a la cámara. */
export function linkLayer(depthA: number, depthB: number): DepthLayer {
  return layerOf(Math.max(depthA, depthB) > 0.86 ? Math.max(depthA, depthB) : (depthA + depthB) / 2)
}

/** Lo que el compositor necesita del cuadro: el lienzo y su densidad de píxeles */
export type LayerTarget = Pick<Frame, 'ctx' | 'dpr'>

export interface DepthOfField {
  /** desenfoque (px CSS) de lo lejano */
  far: number
  /** desenfoque (px CSS) de lo cercano */
  near: number
}

/**
 * Profundidad de campo: la escena se pinta en tres capas; la lejana y la
 * cercana se pasan por un desenfoque real (como una cámara con el foco en
 * el plano medio) y la del medio queda nítida.
 */
export function createDepthComposer() {
  const buffers: Partial<Record<'far' | 'near', HTMLCanvasElement>> = {}

  const buffer = (layer: 'far' | 'near', main: HTMLCanvasElement, dpr: number) => {
    let c = buffers[layer]
    if (!c) {
      c = document.createElement('canvas')
      buffers[layer] = c
    }
    if (c.width !== main.width || c.height !== main.height) {
      c.width = main.width
      c.height = main.height
    }
    const g = c.getContext('2d')
    if (!g) return null
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.clearRect(0, 0, c.width, c.height)
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    return { canvas: c, ctx: g }
  }

  const blurred = (frame: LayerTarget, layer: 'far' | 'near', px: number, paint: (ctx: CanvasRenderingContext2D) => void) => {
    const main = frame.ctx.canvas
    const b = buffer(layer, main, frame.dpr)
    if (!b) return
    paint(b.ctx)
    const ctx = frame.ctx
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.filter = `blur(${px * frame.dpr}px)`
    ctx.drawImage(b.canvas, 0, 0)
    ctx.restore()
  }

  return {
    render(frame: LayerTarget, dof: DepthOfField, paint: (ctx: CanvasRenderingContext2D, layer: DepthLayer) => void): void {
      blurred(frame, 'far', dof.far, (ctx) => paint(ctx, 'far'))
      paint(frame.ctx, 'focus')
      blurred(frame, 'near', dof.near, (ctx) => paint(ctx, 'near'))
    },
  }
}

interface BokehDot {
  x: number
  y: number
  depth: number
  r: number
  rgb: string
  alpha: number
  drift: number
  phase: number
}

/**
 * Partículas desenfocadas de fondo y primer plano. Se mueven con la cámara
 * (paralaje): las cercanas se desplazan más que las lejanas.
 */
export function createBokeh(count: number, palette: readonly string[], sizes: readonly [number, number] = [10, 60]) {
  const dots: BokehDot[] = Array.from({ length: count }, (_, i) => {
    const depth = Math.random()
    return {
      x: Math.random(),
      y: Math.random(),
      depth,
      r: sizes[0] + (sizes[1] - sizes[0]) * depth * depth,
      rgb: palette[i % palette.length],
      alpha: 0.05 + 0.13 * Math.random(),
      drift: 0.3 + Math.random(),
      phase: Math.random() * Math.PI * 2,
    }
  })
  return {
    draw(frame: Frame, filter: (depth: number) => boolean, strength = 1): void {
      const { ctx, width, height, time, camera } = frame
      for (const d of dots) {
        if (!filter(d.depth)) continue
        const par = (d.depth - 0.4) * 70
        const x = d.x * width + camera.x * par + Math.sin(time * 0.00012 * d.drift + d.phase) * 24
        const y = d.y * height + camera.y * par + Math.cos(time * 0.0001 * d.drift + d.phase) * 18
        const twinkle = 0.75 + 0.25 * Math.sin(time * 0.0012 + d.phase)
        drawGlow(ctx, glowSprite(d.rgb, 0.92), x, y, d.r, d.alpha * twinkle * strength)
      }
    },
  }
}
