/** Un nodo ya ubicado en el lienzo, listo para dibujarse. */
export interface FrameNode {
  x: number
  y: number
  /** 0 = todavía es ruido, 1 = ya está en su sitio */
  t: number
  /** 0–1: encendido por el cursor o por un impulso */
  glow: number
  /** tamaño base (px) */
  size: number
  /** fase propia para respiraciones y parpadeos */
  phase: number
  /** profundidad 0 (lejos) – 1 (cerca), fija por nodo */
  depth: number
}

/** Conexión visible en este cuadro. */
export interface FrameLink {
  a: number
  b: number
  /** opacidad de la conexión (se arma y se apaga con la red) */
  alpha: number
  /** número fijo por conexión (curvatura, grosor) */
  seed: number
}

/** Impulso viajando de un nodo a otro. */
export interface FramePulse {
  from: number
  to: number
  /** avance 0–1 */
  t: number
  seed: number
}

export interface FrameColors {
  /** canales "r,g,b" */
  paper: string
  signal: string
}

export interface Frame {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  /** ms */
  time: number
  nodes: readonly FrameNode[]
  links: readonly FrameLink[]
  pulses: readonly FramePulse[]
  colors: FrameColors
  /** densidad de píxeles del lienzo */
  dpr: number
  /** cámara: giro actual, -1 a 1 en cada eje (para paralajes) */
  camera: { x: number; y: number }
  /** alto de la figura en px (para escalar detalles) */
  scale: number
  /** avance global de la red, 0–1 */
  progress: number
  reducedMotion: boolean
}

/**
 * Un estilo dibuja la red. Recibe nodos, conexiones e impulsos ya
 * calculados por <NetworkCanvas> y solo decide cómo se ven.
 */
export interface NetworkStyle {
  /** la figura tiene volumen: se proyecta en 3D y gira con el cursor */
  depth3d: boolean
  /** se llama al cambiar el tamaño del lienzo (para preparar fondos) */
  resize?: (width: number, height: number) => void
  draw: (frame: Frame) => void
}
