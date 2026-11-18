interface SectionLabelProps {
  index: string
  children: React.ReactNode
  className?: string
}

/** Etiqueta de sección: número + título espaciado + línea fina (estilo hoja de vida). */
export function SectionLabel({ index, children, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="mono-label opacity-50">{index}</span>
      <span className="hairline h-px w-10" aria-hidden="true" />
      <span className="brand-title text-xs">{children}</span>
    </div>
  )
}
