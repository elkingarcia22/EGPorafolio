'use client'

import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useTick } from './live-pieces'
import { aiStops, inkOn, shade, withAlpha } from './color-utils'

const OK = '#17b26a'
const NO = '#e5484d'

export interface ThemeDemoProps {
  /** Índice del tema que se está mostrando (todas las pruebas comparten el mismo). */
  index: number
}

const themeAt = (index: number) => THEMA_CASE.themes[index]

/** 01 · Un color entra y el sistema deriva el resto. */
export function DeriveDemo({ index }: ThemeDemoProps) {
  const { t } = useLocale()
  const { primary, name } = themeAt(index)
  const [a, b, c, d] = aiStops(primary)
  const derived = [
    { es: 'al pasar', en: 'hover', color: shade(primary, -0.12) },
    { es: 'superficie', en: 'surface', color: shade(primary, 0.86) },
    { es: 'borde', en: 'border', color: shade(primary, 0.55) },
    { es: 'foco', en: 'focus', color: withAlpha(primary, 0.45) },
    { es: 'modo oscuro', en: 'dark mode', color: shade(primary, -0.84) },
    { es: 'texto encima', en: 'on primary', color: inkOn(primary) },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="flex items-center gap-5">
        <span className="relative h-16 w-16 shrink-0 rounded-full transition-colors duration-700" style={{ background: primary }}>
          <span className="absolute -inset-1.5 rounded-full border border-fg/15" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-50">{t({ es: 'Entra un color', en: 'One color in' })}</p>
          <p className="text-2xl font-light tabular-nums">{primary} <span className="text-base opacity-50">· {name}</span></p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {derived.map((tk, i) => (
          <li key={tk.en} className="flex items-center gap-1.5 rounded-full border border-fg/15 bg-bg py-1 pl-1 pr-2.5 text-[11px]">
            <span className="h-4 w-4 rounded-full ring-1 ring-fg/10 transition-colors duration-700" style={{ background: tk.color, transitionDelay: `${i * 80}ms` }} />
            {t(tk)}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <span className="h-1 flex-1 rounded-full transition-[background] duration-700" style={{ background: `linear-gradient(90deg, ${a}, ${b} 35%, ${c} 70%, ${d})` }} />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50">{t({ es: 'gradiente de la IA', en: 'AI gradient' })}</span>
      </div>
    </div>
  )
}

const MEANINGS = [
  { es: 'Éxito', en: 'Success', color: OK },
  { es: 'Error', en: 'Error', color: NO },
  { es: 'Aviso', en: 'Warning', color: '#f38744' },
  { es: 'Info', en: 'Info', color: '#2e90fa' },
] as const

/** 02 · El tema cambia arriba; los significados de abajo no se mueven. */
export function MeaningDemo({ index }: ThemeDemoProps) {
  const { t } = useLocale()
  const { primary, name } = themeAt(index)
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors duration-700" style={{ background: primary, color: inkOn(primary) }}>
          {t({ es: 'Tema', en: 'Theme' })} · {name}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50">{t({ es: 'cambia', en: 'changes' })}</span>
      </div>
      <span className="h-px bg-fg/15" aria-hidden="true" />
      <div className="flex items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-1.5">
          {MEANINGS.map((m) => (
            <li key={m.en} className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: withAlpha(m.color, 0.14), color: m.color }}>
              {t(m)}
            </li>
          ))}
        </ul>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50">{t({ es: 'no cambia', en: 'stays' })}</span>
      </div>
    </div>
  )
}

/** 03 · Desde afuera solo se decide dónde va la pieza; cómo se ve no pasa. */
export function PiecesDemo({ index }: ThemeDemoProps) {
  const { primary } = themeAt(index)
  const props = [
    { code: 'slot="resumen"', ok: true },
    { code: 'color="#ff3b30"', ok: false },
    { code: 'className="rounded-none"', ok: false },
  ]
  return (
    <div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-5">
      <div className="rounded-lg border border-fg/15 bg-bg p-3">
        <p className="text-[10px] opacity-55">Ingresos del día</p>
        <p className="mt-0.5 text-lg font-medium tabular-nums">$ 2.676</p>
        <div className="mt-2 flex h-9 items-end gap-1">
          {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
            <span key={i} className="flex-1 rounded-sm transition-colors duration-700" style={{ height: `${h}%`, background: i === 5 ? primary : shade(primary, 0.7) }} />
          ))}
        </div>
      </div>
      <div className="font-mono text-[11px] leading-[1.9]">
        <p className="opacity-45">{'<KpiCard'}</p>
        {props.map((p) => (
          <p key={p.code} className="flex items-center justify-between gap-2 pl-3">
            <span className={p.ok ? '' : 'line-through opacity-40'}>{p.code}</span>
            <span style={{ color: p.ok ? OK : NO }}>{p.ok ? '✓' : '✕'}</span>
          </p>
        ))}
        <p className="opacity-45">{'/>'}</p>
      </div>
    </div>
  )
}

const AI_STEPS = 4
const AI_STEP_MS = 1400

/** 04 · La IA propone un color suelto, la validación lo bloquea y queda el token del tema. */
export function AiDemo({ index }: ThemeDemoProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tick = useTick(AI_STEP_MS)
  const step = reducedMotion ? AI_STEPS - 1 : tick % AI_STEPS
  const { primary } = themeAt(index)
  const fixed = step >= 2

  return (
    <div className="grid h-full grid-cols-[minmax(0,1.5fr)_auto] items-center gap-5">
      <div className="space-y-1.5 font-mono text-[11px] leading-relaxed" aria-live="polite">
        <p className="opacity-45">{t({ es: '// la IA escribe', en: '// the AI writes' })}</p>
        <p className={`transition-opacity duration-300 ${step >= 1 ? 'line-through opacity-40' : ''}`}>
          {'<Button className="'}<span style={{ color: NO }}>bg-[#E11D48]</span>{'">'}
        </p>
        <p className={`transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{ color: NO }}>
          {t({ es: 'bloqueado · color fuera del sistema', en: 'blocked · color outside the system' })}
        </p>
        <p className={`transition-opacity duration-300 ${fixed ? 'opacity-100' : 'opacity-0'}`}>
          {'<Button className="'}<span className="text-signal">bg-primary</span>{'">'} <span style={{ color: OK }}>✓</span>
        </p>
      </div>
      <span
        className="rounded-md px-4 py-2 text-[13px] font-medium transition-[background,color,opacity] duration-500"
        style={{ background: fixed ? primary : '#E11D48', color: fixed ? inkOn(primary) : '#fff', opacity: step === 1 ? 0.3 : 1 }}
      >
        {t({ es: 'Agendar', en: 'Book' })}
      </span>
    </div>
  )
}
