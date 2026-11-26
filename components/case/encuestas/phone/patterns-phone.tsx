'use client'

import { useLocale, type L } from '@/lib/i18n'
import { PhoneNode, PhonePager } from './phone-kit'

interface PatternsPhoneProps {
  areas: readonly { id: string; name: L; to: readonly number[]; findings: readonly L[] }[]
  insights: readonly { short: string; full: L }[]
  /** La parte que pasa la señal (o la elegida) */
  area: number
  /** La parte se abrió al tocarla: se ven sus hallazgos */
  areaOpen: boolean
  /** La idea abierta, si se tocó una */
  insightOpen: number | null
  lit: readonly number[]
  pulseKey: string
  onArea: (i: number) => void
  onInsight: (j: number) => void
  onStep: (i: number) => void
  reducedMotion: boolean
}

/**
 * 02 · Patrones en el teléfono: una parte del producto a la vez. Arriba, la
 * parte y cuántos hallazgos dejó; una fibra baja con la señal hasta las tres
 * ideas, y se encienden aquellas a las que lleva. Pasa sola y se desliza de
 * lado; tocar la parte abre sus hallazgos, tocar una idea, su frase.
 */
export function PatternsPhone({ areas, insights, area, areaOpen, insightOpen, lit, pulseKey, onArea, onInsight, onStep, reducedMotion }: PatternsPhoneProps) {
  const { t } = useLocale()
  const a = areas[area]

  return (
    <div className="relative mx-auto mt-6 max-w-[360px]">
      <button type="button" onClick={() => onArea(area)} aria-expanded={areaOpen} className="flex w-full items-center gap-4 text-left outline-none">
        <PhoneNode on />
        <span key={a.id} className="obj-fade min-w-0">
          <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">
            {t({ es: 'Parte', en: 'Area' })} {area + 1}/{areas.length} · {a.findings.length} {t({ es: 'hallazgos', en: 'findings' })}
          </span>
          <span className="mt-1 block text-[26px] font-light leading-tight">{t(a.name)}</span>
        </span>
        <span aria-hidden="true" className={`ml-auto font-mono text-lg text-paper/40 transition-transform duration-300 ${areaOpen ? 'rotate-45' : ''}`}>+</span>
      </button>

      {areaOpen && (
        <ul className="obj-fade ml-8 mt-4 space-y-3">
          {a.findings.map((f) => (
            <li key={f.es} className="border-l border-signal/50 pl-4 text-[14px] leading-relaxed text-paper/75">{t(f)}</li>
          ))}
        </ul>
      )}

      {/* La fibra que baja de la parte a las ideas, con su señal */}
      <div className="relative ml-[7.5px] h-16 w-px overflow-hidden bg-gradient-to-b from-signal to-[#ff54aa]/70">
        {!reducedMotion && <span key={pulseKey} className="absolute inset-x-[-1px] h-8 bg-gradient-to-b from-transparent via-white to-transparent" style={{ animation: 'enc-drop 1.2s cubic-bezier(.45,0,.2,1) both' }} />}
      </div>

      <ol className="space-y-1">
        {insights.map((ins, j) => {
          const on = lit.includes(j)
          const open = insightOpen === j
          return (
            <li key={ins.short}>
              <button type="button" onClick={() => onInsight(j)} aria-expanded={open} className="flex min-h-[48px] w-full items-center gap-4 text-left outline-none">
                <PhoneNode on={on} tone="#ff54aa" fiberFrom={j === insights.length - 1 ? 'enc-idea' : undefined} />
                <span className={`text-[17px] leading-snug transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-40'}`}>{ins.short}</span>
              </button>
              {open && <p className="obj-fade mb-3 ml-8 border-l border-[#ff54aa]/60 pl-4 text-[15px] font-light leading-snug text-paper/85">{t(ins.full)}</p>}
            </li>
          )
        })}
      </ol>

      <PhonePager count={areas.length} index={area} onPick={onStep} label={(i) => t(areas[i].name)} />
    </div>
  )
}
