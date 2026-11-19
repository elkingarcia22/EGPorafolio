'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CONTACT_FIX } from '@/lib/content/cases/sellup/sellup-agents'
import { BLUE, OK, STAGE, SURFACE, WARN, useInView } from './ui'

type Phase = 'idle' | 'reserve' | 'apollo' | 'lusha' | 'found' | 'settled'

interface LedgerRow {
  at: Phase
  text: L
}

const LEDGER: readonly LedgerRow[] = [
  { at: 'reserve', text: { es: 'Reserva atómica · hasta 13 créditos (8 Apollo + 5 Lusha)', en: 'Atomic reservation · up to 13 credits (8 Apollo + 5 Lusha)' } },
  { at: 'apollo', text: { es: 'Apollo · revelar teléfono…', en: 'Apollo · reveal phone…' } },
  { at: 'lusha', text: { es: 'Apollo: no_phone_found → Lusha por debajo, sin segundo clic', en: 'Apollo: no_phone_found → Lusha underneath, no second click' } },
  { at: 'found', text: { es: 'Número guardado con su procedencia', en: 'Number saved with its provenance' } },
  { at: 'settled', text: { es: 'Reserva liquidada · lo no usado se libera · costo no reportado = «desconocido»', en: 'Reservation settled · unused credits released · unreported cost = “unknown”' } },
]

const ORDER: readonly Phase[] = ['idle', 'reserve', 'apollo', 'lusha', 'found', 'settled']

/** 5.3 · Revelar teléfono: un clic, reserva primero y dos proveedores en cascada. */
export function PhoneWaterfall() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [apolloHas, setApolloHas] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')

  const run = () => {
    if (reducedMotion) {
      setPhase('settled')
      return
    }
    const seq: Phase[] = apolloHas ? ['reserve', 'apollo', 'found', 'settled'] : ['reserve', 'apollo', 'lusha', 'found', 'settled']
    seq.forEach((p, i) => window.setTimeout(() => setPhase(p), i * 900))
  }

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p)
  const rows = LEDGER.filter((r) => reached(r.at) && !(apolloHas && r.at === 'lusha'))
  const provider = apolloHas ? 'Apollo' : 'Lusha'

  return (
    <div data-reveal="device" className={STAGE}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className={`${SURFACE} self-start p-4`}>
          <p className="text-xs text-black/45">{t({ es: 'Contactos por revisar · ejemplo', en: 'Contacts to review · sample' })}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#5b7eff]/15 text-sm font-medium text-[#3150d8]">LM</span>
            <div>
              <p className="text-sm font-medium">Laura M.</p>
              <p className="text-xs text-black/55">{t({ es: 'Directora de Gestión Humana', en: 'Head of People' })}</p>
            </div>
            <span className="ml-auto rounded-md bg-black/[0.05] px-2 py-0.5 text-[11px] text-black/55">{t({ es: 'nuevo', en: 'new' })}</span>
          </div>
          <div className="mt-4 rounded-[12px] border border-black/[0.08] px-3 py-2.5 font-mono text-sm">
            {reached('found') ? <span>+57 3•• ••• ••12 <span className="ml-2 rounded bg-emerald-500/12 px-1.5 py-0.5 font-sans text-[10px] text-emerald-700">{provider}</span></span> : <span className="text-black/30">— — —</span>}
          </div>
          <button
            type="button"
            onClick={run}
            disabled={phase !== 'idle' && phase !== 'settled'}
            className="mt-4 w-full rounded-[12px] px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: BLUE }}
          >
            ☎ {phase === 'settled' ? t({ es: 'Revelar otra vez', en: 'Reveal again' }) : t({ es: 'Revelar teléfono', en: 'Reveal phone' })}
          </button>
          <label className="mt-3 flex items-center gap-2 text-xs text-black/60">
            <input type="checkbox" checked={apolloHas} onChange={(e) => { setApolloHas(e.target.checked); setPhase('idle') }} className="accent-[#5b7eff]" />
            {t({ es: 'Apollo sí tiene el número', en: 'Apollo does have the number' })}
          </label>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[{ name: 'Apollo', cap: 8, on: reached('apollo') }, { name: 'Lusha', cap: 5, on: reached('lusha') && !apolloHas }].map((p) => (
              <div key={p.name} className="rounded-[12px] border p-3 transition-colors duration-500" style={{ borderColor: p.on ? BLUE : 'rgba(255,255,255,0.08)' }}>
                <p className="text-white/60">{p.name}</p>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: p.cap }, (_, i) => (
                    <span key={i} className="h-3 flex-1 rounded-sm transition-colors duration-500" style={{ background: reached('reserve') ? (p.on ? BLUE : 'rgba(91,126,255,0.3)') : 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
                <p className="mt-1.5 font-mono text-[10px] text-white/45">{t({ es: 'tope', en: 'cap' })} {p.cap}</p>
              </div>
            ))}
          </div>
          <ol className="mt-4 space-y-1.5 font-mono text-[11px]" aria-live="polite">
            {rows.map((r) => (
              <li key={r.at} className="flex gap-2 rounded-md bg-white/[0.04] px-3 py-2 text-white/75">
                <span style={{ color: r.at === 'settled' ? OK : r.at === 'lusha' ? WARN : BLUE }}>›</span>
                {t(r.text)}
              </li>
            ))}
            {rows.length === 0 && <li className="px-3 py-2 text-white/35">{t({ es: 'Pulsa «Revelar teléfono»', en: 'Press “Reveal phone”' })}</li>}
          </ol>
        </div>
      </div>
      <p className="mt-6 text-xs text-white/50">{t({ es: '«Ver más números» muestra lo ya pagado: 0 llamadas, 0 créditos. «Buscar más números» es aparte, solo Lusha y con tope de 5.', en: '“See more numbers” shows what’s already paid: 0 calls, 0 credits. “Search more numbers” is separate, Lusha only, capped at 5.' })}</p>
    </div>
  )
}

/** 5.4 · Cuando la búsqueda daba cero: el diagnóstico y el arreglo del 20-10. */
export function ZeroFix() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>()
  const max = Math.max(...CONTACT_FIX.after.map((a) => a.value))
  return (
    <div ref={ref} data-reveal="device" className="grid gap-px overflow-hidden rounded-[20px] border border-fg/15 bg-fg/15 md:grid-cols-2">
      <div className="bg-bg p-6">
        <p className="mono-label opacity-60">{t({ es: 'Antes · 60 días hasta el 20-10', en: 'Before · 60 days to 20-Oct' })}</p>
        <ul className="mt-5 space-y-5">
          {CONTACT_FIX.before.map((b) => (
            <li key={b.label.es}>
              <p className="flex items-baseline justify-between gap-3"><span className="text-2xl font-light tabular-nums">{b.value}<span className="text-sm opacity-50"> / {b.of}</span></span></p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-fg/10"><span className="block h-full rounded-full bg-[#f59e0b] transition-[width] duration-[1400ms] ease-expo" style={{ width: seen ? `${(b.value / b.of) * 100}%` : '0%' }} /></div>
              <p className="mt-2 text-sm opacity-70">{t(b.label)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-bg p-6">
        <p className="mono-label opacity-60">{t({ es: 'Después · primeras corridas del 20-10', en: 'After · first runs on 20-Oct' })}</p>
        <ul className="mt-5 flex h-[220px] items-end gap-4">
          {CONTACT_FIX.after.map((a, i) => (
            <li key={a.label.es} className="flex flex-1 flex-col items-center justify-end gap-2 text-center">
              <span className="text-2xl font-light tabular-nums text-signal">{a.value}</span>
              <span className="w-full rounded-t-md bg-signal transition-[height] duration-[1400ms] ease-expo" style={{ height: seen ? `${Math.max(4, (a.value / max) * 140)}px` : '4px', transitionDelay: `${i * 200}ms` }} />
              <span className="text-[11px] leading-tight opacity-70">{t(a.label)}<br /><span className="opacity-60">{t(a.unit)}</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed opacity-75">{t({ es: 'Tres errores en cadena: filtros no documentados, la empresa buscada con un parámetro que la base no reconocía, y cuentas guardadas confundidas con empresas de la base.', en: 'Three chained errors: undocumented filters, the company searched with a parameter the base didn’t recognize, and saved accounts mixed up with the base’s companies.' })}</p>
      </div>
    </div>
  )
}
