'use client'

interface StepNodesProps {
  count: number
  active: number
  onPick: (i: number) => void
  /** Nombre accesible de cada paso */
  labels: readonly string[]
  /** Color de cada nodo ya pasado (por defecto, la señal) */
  tone?: (i: number) => string | undefined
}

/**
 * Una fila de nodos unidos por una fibra que se llena hasta el paso activo:
 * el índice de las piezas que en el teléfono van de una en una.
 */
export function StepNodes({ count, active, onPick, labels, tone }: StepNodesProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[300px] items-center justify-between">
      <span aria-hidden="true" className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-white/12" />
      <span
        aria-hidden="true"
        className="absolute left-3 right-3 top-1/2 h-px origin-left -translate-y-1/2 bg-gradient-to-r from-signal to-[rgb(var(--spark))] transition-transform duration-700 ease-expo"
        style={{ transform: `translateY(-50%) scaleX(${count > 1 ? active / (count - 1) : 1})` }}
      />
      {Array.from({ length: count }, (_, i) => {
        const color = tone?.(i)
        return (
          <button key={i} type="button" onClick={() => onPick(i)} aria-label={labels[i]} aria-current={i === active} className="relative grid h-7 w-7 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-signal">
            <span
              className={`h-2.5 w-2.5 rounded-full border transition-all duration-500 ${i === active ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_14px_3px_rgb(var(--signal)/0.7)]' : i < active ? 'border-white/60 bg-signal' : 'border-white/35 bg-void'}`}
              style={color && i !== active ? { background: color, borderColor: color } : undefined}
            />
          </button>
        )
      })}
    </div>
  )
}
