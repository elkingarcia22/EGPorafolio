'use client'

/**
 * Piezas de las composiciones de teléfono del caso Encuestas: el mismo lenguaje
 * de escritorio (nodos con halo, fibras con señal) pero en HTML, con la letra
 * a su tamaño real en vez de un SVG ancho encogido.
 */

interface PhoneNodeProps {
  /** Encendido: halo, anillo que late y núcleo claro */
  on?: boolean
  /** Suelto: borde punteado, sin halo (algo que aún no existe) */
  loose?: boolean
  /** Color del halo; por defecto la señal */
  tone?: string
  size?: 'sm' | 'md'
  /** El punto del que sale la fibra al capítulo siguiente */
  fiberFrom?: string
}

export function PhoneNode({ on = false, loose = false, tone = 'rgb(var(--signal))', size = 'md', fiberFrom }: PhoneNodeProps) {
  const box = size === 'md' ? 'h-4 w-4' : 'h-3 w-3'
  return (
    <span className={`relative grid shrink-0 place-items-center ${box}`} aria-hidden="true">
      <span
        className="absolute -inset-3 rounded-full transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${tone}, transparent 70%)`, opacity: on ? 0.55 : 0 }}
      />
      {on && <span className="absolute -inset-[7px] rounded-full border animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" style={{ borderColor: tone }} />}
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-500 ${loose ? 'border-dashed border-white/50 bg-void' : on ? 'border-white bg-[#fffaf0]' : 'border-white/70'}`}
        style={{ background: loose || on ? undefined : tone, boxShadow: on ? `0 0 16px 3px ${tone}` : undefined }}
      />
      {fiberFrom && <span data-fiber-from={fiberFrom} className="absolute left-1/2 top-1/2 h-px w-px" />}
    </span>
  )
}

interface PhonePagerProps {
  count: number
  index: number
  onPick: (i: number) => void
  label: (i: number) => string
}

/** Los pasos de una pieza que avanza sola (y se desliza de lado): una raya por paso */
export function PhonePager({ count, index, onPick, label }: PhonePagerProps) {
  return (
    <div className="mt-6 flex justify-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(i)}
          aria-label={label(i)}
          aria-current={i === index}
          className="grid h-8 place-items-center px-0.5"
        >
          <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-7 bg-signal shadow-[0_0_10px_rgb(var(--signal)/0.7)]' : 'w-1.5 bg-white/25'}`} />
        </button>
      ))}
    </div>
  )
}

/** Una fibra vertical que se llena de arriba abajo, con su brillo */
export function PhoneFiber({ fill, className = '' }: { fill: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`absolute w-px ${className}`}>
      <span className="absolute inset-0 bg-white/12" />
      <span
        className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-signal via-[rgb(var(--glow))] to-[rgb(var(--spark))] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-700 ease-expo"
        style={{ transform: `scaleY(${fill})` }}
      />
    </span>
  )
}
