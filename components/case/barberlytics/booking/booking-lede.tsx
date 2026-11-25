'use client'

interface LedeProps {
  /** Etiqueta corta (mono) sobre la frase */
  tag: string
  /** La frase del capítulo (o el detalle de la pieza tocada) */
  title: string
  /** Una línea de apoyo, a lo sumo dos renglones */
  sub?: string
  /** Cambia la clave para que la frase entre de nuevo al tocar otra pieza */
  swapKey?: string | number
  className?: string
}

/**
 * Lo que dice cada capítulo: una sola frase y, si hace falta, dos renglones de
 * apoyo. Al tocar una pieza de la visualización, aquí sale su detalle.
 */
export function BookingLede({ tag, title, sub, swapKey, className = '' }: LedeProps) {
  return (
    <div aria-live="polite" className={`mx-auto flex min-h-[7.5rem] max-w-[60ch] flex-col items-center justify-end text-center ${className}`}>
      <p key={`${swapKey}-tag`} className="bk-fade mono-label text-[rgb(var(--bk))]">{tag}</p>
      <p key={`${swapKey}-title`} className="bk-fade mt-3 text-balance text-[clamp(1.3rem,1rem+1.2vw,2rem)] font-light leading-[1.18] tracking-tight">{title}</p>
      {sub && <p key={`${swapKey}-sub`} className="bk-fade mt-3 max-w-[56ch] text-balance text-sm leading-relaxed text-paper/60 md:text-base">{sub}</p>}
    </div>
  )
}
