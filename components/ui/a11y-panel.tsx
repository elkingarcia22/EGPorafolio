'use client'

import { useEffect, useRef } from 'react'
import { useA11y, type MotionPref, type TextSize } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'

interface A11yPanelProps {
  open: boolean
  onClose: () => void
  returnFocusTo: React.RefObject<HTMLButtonElement | null>
}

const TEXT_SIZES: readonly { value: TextSize; label: string }[] = [
  { value: 'base', label: 'A' },
  { value: 'lg', label: 'A+' },
  { value: 'xl', label: 'A++' },
]

function Segmented<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  name: string
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex border border-fg/30">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className="mono-label flex-1 px-3 py-2 transition-colors aria-checked:bg-fg aria-checked:text-bg"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between py-1"
    >
      <span className="text-sm">{label}</span>
      <span
        className={`relative h-5 w-9 border transition-colors duration-300 ${checked ? 'border-signal bg-signal' : 'border-fg/40'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute left-0.5 top-0.5 h-3.5 w-3.5 transition-transform duration-300 ${checked ? 'translate-x-4 bg-paper' : 'translate-x-0 bg-fg/50'}`}
        />
      </span>
    </button>
  )
}

/** Panel de accesibilidad: tamaño de texto, contraste, movimiento y enlaces. */
export function A11yPanel({ open, onClose, returnFocusTo }: A11yPanelProps) {
  const { settings, update, reset } = useA11y()
  const { t } = useLocale()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const trigger = returnFocusTo.current
    return () => {
      window.removeEventListener('keydown', onKey)
      trigger?.focus()
    }
  }, [open, onClose, returnFocusTo])

  if (!open) return null

  const motionOptions: readonly { value: MotionPref; label: string }[] = [
    { value: 'auto', label: t(COPY.a11y.motionAuto) },
    { value: 'reduced', label: t(COPY.a11y.motionReduced) },
    { value: 'full', label: t(COPY.a11y.motionFull) },
  ]

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="a11y-title"
      className="fixed right-[var(--gutter)] top-20 z-[75] w-[min(20rem,calc(100vw-2rem))] border border-fg/20 bg-bg p-5 text-fg shadow-2xl"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 id="a11y-title" className="brand-title text-xs">
          {t(COPY.a11y.title)}
        </h2>
        <button type="button" onClick={onClose} className="mono-label underline-offset-4 hover:underline">
          {t(COPY.a11y.close)}
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <p className="mono-label opacity-60">{t(COPY.a11y.text)}</p>
          <Segmented name={t(COPY.a11y.text)} options={TEXT_SIZES} value={settings.text} onChange={(v) => update({ text: v })} />
        </div>
        <div className="space-y-2">
          <p className="mono-label opacity-60">{t(COPY.a11y.motion)}</p>
          <Segmented name={t(COPY.a11y.motion)} options={motionOptions} value={settings.motion} onChange={(v) => update({ motion: v })} />
        </div>
        <div className="space-y-2 border-t border-fg/15 pt-4">
          <Toggle label={t(COPY.a11y.contrast)} checked={settings.highContrast} onChange={(v) => update({ highContrast: v })} />
          <Toggle label={t(COPY.a11y.links)} checked={settings.underlineLinks} onChange={(v) => update({ underlineLinks: v })} />
        </div>
        <button type="button" onClick={reset} className="mono-label opacity-60 underline-offset-4 hover:underline hover:opacity-100">
          {t(COPY.a11y.reset)}
        </button>
      </div>
    </div>
  )
}
