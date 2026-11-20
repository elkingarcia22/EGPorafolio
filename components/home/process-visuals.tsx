/** Pequeñas piezas visuales (SVG + CSS) para cada etapa del proceso. */

const NOISE_DOTS = Array.from({ length: 90 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 100,
  s: 1 + ((i * 7) % 3),
  d: (i % 9) * 0.12,
}))

export function NoiseVisual() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {NOISE_DOTS.map((dot, i) => (
        <rect
          key={i}
          x={dot.x}
          y={dot.y}
          width={dot.s}
          height={dot.s}
          className="fill-current"
          style={{ animation: `flicker 0.9s steps(2) ${dot.d}s infinite` }}
        />
      ))}
      <style>{`@keyframes flicker { 50% { opacity: .15 } }`}</style>
    </svg>
  )
}

const PATTERN_NODES = [
  { x: 14, y: 22 },
  { x: 38, y: 70 },
  { x: 62, y: 30 },
  { x: 86, y: 78 },
  { x: 100, y: 48 },
  { x: 124, y: 18 },
  { x: 140, y: 72 },
  { x: 166, y: 36 },
  { x: 188, y: 82 },
  { x: 182, y: 12 },
]

/** Conexiones débiles: el ruido de fondo entre los puntos. */
const FAINT_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 3], [2, 5], [3, 6], [5, 9], [6, 8], [7, 9], [0, 2], [6, 7],
]

/** El patrón que emerge: conexiones que convergen en el nodo central (4). */
const PATTERN_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 2], [2, 4], [1, 4], [4, 3], [4, 5], [4, 6], [6, 7], [5, 7], [7, 8],
]

const HUB = 4
const EDGE_LENGTH = 120

export function PatternVisual() {
  return (
    <svg viewBox="0 0 200 100" className="pattern-visual h-full w-full" fill="none" aria-hidden="true">
      {FAINT_EDGES.map(([a, b], i) => (
        <line
          key={`f${i}`}
          x1={PATTERN_NODES[a].x}
          y1={PATTERN_NODES[a].y}
          x2={PATTERN_NODES[b].x}
          y2={PATTERN_NODES[b].y}
          className="stroke-current opacity-15"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      ))}
      {PATTERN_EDGES.map(([a, b], i) => (
        <line
          key={`p${i}`}
          x1={PATTERN_NODES[a].x}
          y1={PATTERN_NODES[a].y}
          x2={PATTERN_NODES[b].x}
          y2={PATTERN_NODES[b].y}
          className={a === HUB || b === HUB ? 'stroke-signal' : 'stroke-current'}
          strokeWidth="1.1"
          strokeDasharray={EDGE_LENGTH}
          style={{ animation: `connect 4s ${i * 0.22}s cubic-bezier(.16,1,.3,1) infinite` }}
        />
      ))}
      {PATTERN_NODES.map((n, i) =>
        i === HUB ? null : (
          <circle
            key={`n${i}`}
            cx={n.x}
            cy={n.y}
            r="2.2"
            className="fill-current"
            style={{ animation: `node 4s ${i * 0.18}s ease-in-out infinite` }}
          />
        ),
      )}
      <circle
        cx={PATTERN_NODES[HUB].x}
        cy={PATTERN_NODES[HUB].y}
        r="5"
        className="stroke-signal"
        strokeWidth="0.8"
        style={{ transformOrigin: `${PATTERN_NODES[HUB].x}px ${PATTERN_NODES[HUB].y}px`, animation: 'hub 2s ease-out infinite' }}
      />
      <circle cx={PATTERN_NODES[HUB].x} cy={PATTERN_NODES[HUB].y} r="3.4" className="fill-signal" />
      <style>{`
        @keyframes connect {
          0% { stroke-dashoffset: ${EDGE_LENGTH}; opacity: 0 }
          10% { opacity: 1 }
          45%, 80% { stroke-dashoffset: 0; opacity: 1 }
          100% { stroke-dashoffset: 0; opacity: 0 }
        }
        @keyframes node { 0%, 100% { opacity: .35 } 40%, 80% { opacity: 1 } }
        @keyframes hub { from { transform: scale(1); opacity: .9 } to { transform: scale(2.6); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) {
          .pattern-visual * { animation: none !important; stroke-dashoffset: 0 }
        }
      `}</style>
    </svg>
  )
}

export function FormVisual() {
  const boxes = [
    { x: 4, y: 6, w: 92, h: 10 },
    { x: 4, y: 22, w: 28, h: 72 },
    { x: 36, y: 22, w: 60, h: 34 },
    { x: 36, y: 60, w: 28, h: 34 },
    { x: 68, y: 60, w: 28, h: 34 },
  ]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
      {boxes.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          className="stroke-current"
          strokeWidth="0.8"
          strokeDasharray="300"
          style={{ animation: `draw 2.8s ${i * 0.2}s cubic-bezier(.16,1,.3,1) infinite alternate` }}
        />
      ))}
      <rect x="40" y="27" width="20" height="3" className="fill-signal" />
      <style>{`@keyframes draw { from { stroke-dashoffset: 300 } to { stroke-dashoffset: 0 } }`}</style>
    </svg>
  )
}

export function BroadcastVisual() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r="12"
          className="stroke-current"
          strokeWidth="0.8"
          style={{ transformOrigin: '50px 50px', animation: `pulse 2.4s ${i * 0.8}s ease-out infinite` }}
        />
      ))}
      <circle cx="50" cy="50" r="6" className="fill-signal" />
      <style>{`@keyframes pulse { from { transform: scale(1); opacity: .9 } to { transform: scale(3.6); opacity: 0 } }`}</style>
    </svg>
  )
}
