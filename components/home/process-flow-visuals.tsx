/** Las ocho etapas en trazos finos: cada una se mueve sola, despacio, en la misma línea gráfica. */

const VB = 'h-full w-full'
const LINE = 'stroke-current'

/** 01 · Puntos sueltos que parpadean. */
export function DotsMark() {
  const dots = Array.from({ length: 22 }, (_, i) => ({ x: 8 + ((i * 37) % 84), y: 8 + ((i * 53) % 84), d: (i % 7) * 0.25 }))
  return (
    <svg viewBox="0 0 100 100" className={VB} aria-hidden="true">
      {dots.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.2" className="fill-current" style={{ animation: `pf-blink 2.4s ease-in-out ${p.d}s infinite` }} />)}
    </svg>
  )
}

/** 02 · Los puntos se juntan en grupos. */
export function PatternsMark() {
  const groups = [{ x: 28, y: 32 }, { x: 70, y: 30 }, { x: 48, y: 72 }]
  return (
    <svg viewBox="0 0 100 100" className={VB} fill="none" aria-hidden="true">
      {groups.map((g, gi) => (
        <g key={gi}>
          <circle cx={g.x} cy={g.y} r="15" className={LINE} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={g.x + Math.cos(k * 1.6 + gi) * 7} cy={g.y + Math.sin(k * 1.6 + gi) * 7} r="2.2" className={gi === 0 ? 'fill-signal' : 'fill-current'} style={{ animation: `pf-pull 3s ease-in-out ${k * 0.15}s infinite`, transformOrigin: `${g.x}px ${g.y}px` }} />
          ))}
        </g>
      ))}
    </svg>
  )
}

/** 03 · La pregunta que lo ordena todo: un foco que se enciende. */
export function IdeaMark() {
  return (
    <svg viewBox="0 0 100 100" className={VB} fill="none" aria-hidden="true">
      <circle cx="50" cy="44" r="20" className={LINE} strokeWidth="1.4" />
      <path d="M42 66h16M44 74h12" className={LINE} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="50" cy="44" r="8" className="fill-signal" style={{ animation: 'pf-glow 2.6s ease-in-out infinite' }} />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = -Math.PI / 2 + (k - 2) * 0.55
        return <path key={k} d={`M${50 + Math.cos(a) * 27} ${44 + Math.sin(a) * 27}L${50 + Math.cos(a) * 34} ${44 + Math.sin(a) * 34}`} className={LINE} strokeWidth="1.4" strokeLinecap="round" style={{ animation: `pf-blink 2.6s ease-in-out ${k * 0.1}s infinite` }} />
      })}
    </svg>
  )
}

/** 04 · Un trazo a mano que se dibuja. */
export function SketchMark() {
  return (
    <svg viewBox="0 0 100 100" className={VB} fill="none" aria-hidden="true">
      <rect x="14" y="18" width="72" height="64" rx="4" className={LINE} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <path d="M22 40 C 32 26, 44 54, 56 38 S 74 30, 80 46" className={LINE} strokeWidth="1.6" strokeLinecap="round" pathLength={100} strokeDasharray="100" style={{ animation: 'pf-draw 3.2s cubic-bezier(.16,1,.3,1) infinite' }} />
      <path d="M24 62h30M24 70h20" className={LINE} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <circle cx="80" cy="46" r="2.6" className="fill-signal" />
    </svg>
  )
}

/** 05 · La pantalla que se arma por bloques. */
export function FormMark() {
  const boxes = [
    { x: 10, y: 12, w: 80, h: 10 },
    { x: 10, y: 28, w: 24, h: 60 },
    { x: 40, y: 28, w: 50, h: 28 },
    { x: 40, y: 62, w: 23, h: 26 },
    { x: 67, y: 62, w: 23, h: 26 },
  ]
  return (
    <svg viewBox="0 0 100 100" className={VB} fill="none" aria-hidden="true">
      {boxes.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2" className={i === 2 ? 'stroke-signal' : LINE} strokeWidth="1.2" style={{ animation: `pf-build 4s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </svg>
  )
}

/** 06 · La IA dentro del proceso: una chispa que gira sobre el trabajo. */
export function AiMark() {
  return (
    <svg viewBox="0 0 100 100" className={VB} fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="30" className={LINE} strokeWidth="0.8" opacity="0.35" />
      <g style={{ animation: 'pf-spin 9s linear infinite', transformOrigin: '50px 50px' }}>
        <circle cx="50" cy="20" r="3" className="fill-signal" />
        <circle cx="80" cy="50" r="2" className="fill-current" opacity="0.6" />
      </g>
      <path d="M50 36 L54 46 L64 50 L54 54 L50 64 L46 54 L36 50 L46 46 Z" className="fill-current" style={{ animation: 'pf-glow 2.4s ease-in-out infinite', transformOrigin: '50px 50px' }} />
    </svg>
  )
}

/** 07 · Lo que se mide: barras que suben. */
export function ImpactMark() {
  const bars = [28, 40, 36, 54, 66, 80]
  return (
    <svg viewBox="0 0 100 100" className={VB} fill="none" aria-hidden="true">
      <path d="M10 88H92" className={LINE} strokeWidth="0.8" opacity="0.4" />
      {bars.map((h, i) => (
        <rect key={i} x={14 + i * 13} y={88 - h} width="7" height={h} rx="1.5" className={i === bars.length - 1 ? 'fill-signal' : 'fill-current'} opacity={i === bars.length - 1 ? 1 : 0.55} style={{ animation: `pf-rise 3.6s cubic-bezier(.16,1,.3,1) ${i * 0.12}s infinite`, transformOrigin: `0 88px` }} />
      ))}
    </svg>
  )
}

/** 08 · Se prueba en vivo: un cursor que toca. */
export function DemoMark() {
  return (
    <svg viewBox="0 0 100 100" className={VB} fill="none" aria-hidden="true">
      <rect x="12" y="18" width="76" height="56" rx="5" className={LINE} strokeWidth="1.2" />
      <path d="M12 28H88" className={LINE} strokeWidth="0.8" opacity="0.4" />
      <path d="M44 40 L60 50 L44 60 Z" className="fill-current" opacity="0.8" />
      <g style={{ animation: 'pf-tap 3s ease-in-out infinite' }}>
        <path d="M66 60 L66 84 L72 78 L77 88 L81 86 L76 76 L84 76 Z" className="fill-signal" />
      </g>
    </svg>
  )
}

/** Las animaciones de las marcas (quietas con «reducir movimiento»). */
export function ProcessMarksStyle() {
  return (
    <style>{`
      @keyframes pf-blink { 50% { opacity: .2 } }
      @keyframes pf-pull { 50% { transform: scale(.55) } }
      @keyframes pf-glow { 50% { opacity: .45; transform: scale(.92) } }
      @keyframes pf-draw { 0% { stroke-dashoffset: 100 } 60%, 100% { stroke-dashoffset: 0 } }
      @keyframes pf-build { 0%, 10% { opacity: .15 } 35%, 85% { opacity: 1 } 100% { opacity: .15 } }
      @keyframes pf-spin { to { transform: rotate(360deg) } }
      @keyframes pf-rise { 0% { transform: scaleY(.2) } 45%, 100% { transform: scaleY(1) } }
      @keyframes pf-tap { 0%, 100% { transform: translate(0, 0) } 50% { transform: translate(-14px, -18px) } }
      @media (prefers-reduced-motion: reduce) { [style*='pf-'] { animation: none !important } }
      html[data-motion='reduced'] [style*='pf-'] { animation: none !important }
    `}</style>
  )
}
