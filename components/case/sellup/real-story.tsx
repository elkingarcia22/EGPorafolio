'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { RUMBO_GRADIENT } from './platform'
import { useInView } from './ui'

/**
 * Piezas para contar una historia en bucle sobre una réplica de la app:
 * el reloj que arranca al entrar en pantalla, la fila de pasos y el dock flotante.
 */

/** Segundos desde que la pieza entró en pantalla, en bucle de `loop` segundos. */
export function useStoryTime(loop: number, still: number): [React.RefObject<HTMLDivElement>, number] {
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  const tick = useTick(1000)
  const [start, setStart] = useState<number | null>(null)
  useEffect(() => {
    if (seen && start === null) setStart(tick)
  }, [seen, start, tick])
  const time = reducedMotion ? still : start === null ? 0 : (tick - start) % loop
  return [ref, time]
}

export interface StoryStep {
  label: L
  /** Segundo en que empieza este paso. */
  from: number
}

/** Índice del paso en curso según el tiempo. */
export function stepAt(steps: readonly StoryStep[], time: number): number {
  return steps.reduce((acc, s, i) => (time >= s.from ? i : acc), 0)
}

/** Fila de pasos encima del marco: dice qué está pasando. */
export function StorySteps({ steps, time, kicker }: { steps: readonly StoryStep[]; time: number; kicker: L }) {
  const { t } = useLocale()
  const now = stepAt(steps, time)
  return (
    <ol className={`mb-5 grid gap-2 ${steps.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`} aria-live="polite">
      {steps.map((s, i) => {
        const on = i === now
        const past = i < now
        return (
          <li key={s.label.es} className={`flex items-center gap-3 rounded-[14px] px-4 py-3 ring-1 transition-all duration-500 ${on ? 'bg-[#6b8cff]/[0.14] ring-[#6b8cff]/60' : 'bg-white/[0.02] ring-white/10'}`}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] tabular-nums transition-colors duration-500 ${on ? 'bg-[#6b8cff] text-[#0a0a0a]' : past ? 'bg-[#6b8cff]/20 text-[#9db0ff]' : 'bg-white/[0.07] text-white/55'}`}>{past ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
            <span>
              <span className="mono-label block text-white/45">{t(kicker)} · {i + 1}</span>
              <span className={`text-sm ${on || past ? 'text-white' : 'text-white/45'}`}>{t(s.label)}{on ? '…' : past ? ' ✓' : ''}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Nota bajo la réplica. */
export function ReplicaNote({ real = false }: { real?: boolean }) {
  const { t } = useLocale()
  return (
    <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">
      {real
        ? t({ es: 'Réplica de la pantalla real · cifras agregadas reales de Producción (nov. 2026)', en: 'Replica of the real screen · real aggregate Production figures (Nov 2026)' })
        : t({ es: 'Réplica de la pantalla real · datos de ejemplo', en: 'Replica of the real screen · sample data' })}
    </p>
  )
}

/** Dock flotante de la app (centrado en el área de contenido). */
export function RealDock({ children, busy, label, done }: { children?: ReactNode; busy: boolean; label: string; done?: boolean }) {
  return (
    <div className="absolute bottom-5 left-[738px] z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-[#141414]/95 p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] backdrop-blur">
      {children}
      <span className="flex min-w-[300px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-[13.5px] font-medium" style={{ background: RUMBO_GRADIENT }}>
        {done ? <Check className="h-4 w-4" /> : busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {label}
      </span>
    </div>
  )
}

/** Anillo de «elemento destacado». */
export const HIGHLIGHT = {
  borderColor: 'rgba(107,140,255,0.8)',
  background: 'linear-gradient(90deg,rgba(107,140,255,0.16),rgba(126,43,224,0.06))',
  boxShadow: '0 0 0 4px rgba(107,140,255,0.18), 0 20px 40px -20px rgba(107,140,255,0.6)',
} as const

/** Cursor simulado que se mueve a (x, y) en coordenadas de la pantalla de 1240 px. */
export function FakeCursor({ x, y, click, show = true }: { x: number; y: number; click: boolean; show?: boolean }) {
  return (
    <span className="pointer-events-none absolute z-30 transition-all duration-700 ease-expo" style={{ left: x, top: y, opacity: show ? 1 : 0 }} aria-hidden="true">
      {click && <span className="absolute -left-3 -top-3 h-7 w-7 animate-ping rounded-full bg-white/40" />}
      <svg width="18" height="22" viewBox="0 0 18 22"><path d="M1 1 L1 17 L5.5 13 L8.5 20 L11 19 L8 12 L14 12 Z" fill="white" stroke="#0a0a0a" strokeWidth="1.2" /></svg>
    </span>
  )
}
