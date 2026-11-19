'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useLocale } from '@/lib/i18n'

/** Cuenta de 0 a `target` cuando `run` es verdadero. */
export function useCount(target: number, run: boolean, ms = 1200): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      setV(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, run, ms])
  return v
}

/** Formato de número con separador de miles a la española. */
export function fmt(n: number, decimals = 0): string {
  return n.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

/** Nota «Datos de ejemplo» bajo una réplica. */
export function SampleNote({ real = false }: { real?: boolean }) {
  const { t } = useLocale()
  return (
    <p className="mt-3 font-mono text-[10px] uppercase tracking-wider opacity-50">
      {real
        ? t({ es: 'Réplica de la plataforma · cifras agregadas reales de Producción (nov. 2026)', en: 'Platform replica · real aggregate Production figures (Nov 2026)' })
        : t({ es: 'Réplica de la plataforma · datos de ejemplo, empresas y personas ficticias', en: 'Platform replica · sample data, fictional companies and people' })}
    </p>
  )
}

/** KPI de la app: etiqueta, valor y nota. */
export function Kpi({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="min-w-0 px-3 py-2.5">
      <p className="truncate text-[10px] opacity-55">{label}</p>
      <p className="mt-1 text-[18px] font-medium tabular-nums leading-none">{value}</p>
      {note && <p className="mt-1 truncate text-[10px] opacity-45">{note}</p>}
    </div>
  )
}

/** Botón principal de la app. */
export function AppButton({ children, onClick, gradient, disabled }: { children: ReactNode; onClick?: () => void; gradient?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-medium text-white transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
      style={{ background: gradient ?? '#5b7eff' }}
    >
      {children}
    </button>
  )
}
