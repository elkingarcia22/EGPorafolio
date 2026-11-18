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

export function FrequencyVisual() {
  return (
    <svg viewBox="0 0 200 100" className="h-full w-full" fill="none" aria-hidden="true">
      <path d="M0 50 H200" className="stroke-current opacity-20" strokeWidth="0.5" />
      <path
        d="M0 50 C 10 10, 20 90, 30 50 S 50 20, 60 50 S 80 70, 90 50 S 110 35, 120 50 S 140 58, 150 50 S 170 47, 180 50 S 195 50, 200 50"
        className="stroke-current"
        strokeWidth="1.5"
        strokeDasharray="400"
        style={{ animation: 'wave 3.2s cubic-bezier(.16,1,.3,1) infinite' }}
      />
      <circle cx="30" cy="50" r="3" className="fill-signal" />
      <style>{`@keyframes wave { from { stroke-dashoffset: 400 } to { stroke-dashoffset: 0 } }`}</style>
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
