'use client'

interface CaseLeadProps {
  children: string
  className?: string
}

/**
 * Texto de apoyo de un caso: una idea en dos renglones como máximo, centrada.
 * La página habla con lo visual; el texto solo da el contexto justo.
 */
export function CaseLead({ children, className = '' }: CaseLeadProps) {
  return (
    <div data-reveal className={`mx-auto max-w-[68ch] text-center ${className}`}>
      <p className="text-balance text-base leading-relaxed text-paper/65 md:text-lg">{children}</p>
    </div>
  )
}
