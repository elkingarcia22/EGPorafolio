'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { MODELS, type ModelId } from './models-data'

const AUTO_MS = 4000

type Kids = 'none' | 'optional' | 'required' | 'drive'
type Close = 'cumulative' | 'threshold' | 'binary'
type Cadence = 'weekly' | 'monthly' | 'free'

/** Las seis reglas de cada modelo (models-data.ts) traducidas a formas dibujables. */
const SHAPE: Record<ModelId, { north: boolean; align: boolean; kids: Kids; close: Close; cadence: Cadence; months: number }> = {
  smart: { north: false, align: false, kids: 'optional', close: 'cumulative', cadence: 'free', months: 3 },
  okr: { north: true, align: true, kids: 'drive', close: 'cumulative', cadence: 'weekly', months: 3 },
  kpi: { north: false, align: false, kids: 'none', close: 'threshold', cadence: 'monthly', months: 1 },
  nct: { north: true, align: false, kids: 'required', close: 'cumulative', cadence: 'weekly', months: 3 },
  mbo: { north: true, align: true, kids: 'optional', close: 'binary', cadence: 'free', months: 12 },
}

const CLOSE_NAME: Record<Close, L> = {
  cumulative: { es: 'Acumulado', en: 'Cumulative' },
  threshold: { es: 'Umbral', en: 'Threshold' },
  binary: { es: 'Cumplió o no', en: 'Met or not' },
}
const CADENCE_NAME: Record<Cadence, L> = {
  weekly: { es: 'Semanal', en: 'Weekly' },
  monthly: { es: 'Mensual', en: 'Monthly' },
  free: { es: 'Libre', en: 'Free' },
}
const MONTHS_NAME: Record<number, L> = {
  1: { es: 'Mes', en: 'Month' },
  3: { es: 'Trimestre', en: 'Quarter' },
  12: { es: 'Año', en: 'Year' },
}

/** Doce semanas: cuáles llevan reporte según la cadencia. */
const WEEKS = 12
const LIT: Record<Cadence, readonly number[]> = {
  weekly: Array.from({ length: WEEKS }, (_, i) => i),
  monthly: [3, 7, 11],
  free: [1, 2, 6, 10],
}

const FADE = 'transition-[opacity,stroke,fill] duration-500'
const KID_X = [62, 160, 258] as const

/** Norte → objetivo → piezas: la estructura del modelo, dibujada. */
function Structure({ id, noun, child }: { id: ModelId; noun: string; child: string | null }) {
  const { t } = useLocale()
  const s = SHAPE[id]
  const kidsOn = s.kids !== 'none'
  const kidSolid = s.kids === 'required' || s.kids === 'drive'
  return (
    <svg viewBox="0 0 320 206" className="h-auto w-full" aria-hidden="true">
      {/* Norte de la empresa */}
      <circle cx={160} cy={20} r={11} strokeWidth={1.5} strokeDasharray={s.north ? undefined : '3 3'} className={`${FADE} ${s.north ? 'fill-signal stroke-signal' : 'fill-transparent stroke-fg/40'}`} />
      <text x={180} y={24} fontSize={11} className={`fill-current font-mono uppercase ${FADE}`} style={{ opacity: s.north ? 0.9 : 0.4 }}>
        {t({ es: 'Norte', en: 'North' })} · {s.north ? t({ es: 'obligatorio', en: 'required' }) : t({ es: 'opcional', en: 'optional' })}
      </text>

      {/* Alineación */}
      <line x1={160} y1={33} x2={160} y2={74} strokeWidth={1.5} strokeDasharray={s.align ? undefined : '3 4'} className={`${FADE} ${s.align ? 'stroke-signal' : 'stroke-fg/35'}`} />

      {/* El objetivo */}
      <rect x={95} y={76} width={130} height={38} rx={6} strokeWidth={1.5} className="fill-fg/[0.06] stroke-fg/70" />
      <text x={160} y={100} textAnchor="middle" fontSize={14} className="fill-current">{noun}</text>

      {/* Lo que cuelga del objetivo */}
      {KID_X.map((x, i) => (
        <g key={x} className={FADE} style={{ opacity: kidsOn ? 1 : 0, transitionDelay: `${i * 60}ms` }}>
          <line x1={160} y1={114} x2={x} y2={150} strokeWidth={1.2} strokeDasharray={kidSolid ? undefined : '3 3'} className={`${FADE} ${s.kids === 'drive' ? 'stroke-signal' : 'stroke-fg/40'}`} />
          <rect x={x - 38} y={150} width={76} height={26} rx={5} strokeWidth={1.2} strokeDasharray={kidSolid ? undefined : '3 3'} className={`${FADE} ${s.kids === 'drive' ? 'fill-signal/20 stroke-signal' : 'fill-transparent stroke-fg/45'}`} />
          {s.kids === 'drive' && <path d={`M${x} 144 l-4 6 h8 z`} className="fill-signal" />}
        </g>
      ))}
      <text x={160} y={198} textAnchor="middle" fontSize={11} className={`fill-current font-mono uppercase ${FADE}`} style={{ opacity: kidsOn ? 0.6 : 0.35 }}>
        {kidsOn && child
          ? `${child} · ${s.kids === 'optional' ? t({ es: 'opcionales', en: 'optional' }) : s.kids === 'drive' ? t({ es: 'mueven el avance', en: 'drive progress' }) : t({ es: 'obligatorias', en: 'required' })}`
          : t({ es: 'Sin piezas debajo', en: 'Nothing below' })}
      </text>
    </svg>
  )
}

function Meter({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 bg-bg p-3 sm:p-4">
      <span className="mono-label text-[9px] opacity-50 sm:text-[10px]">{label}</span>
      <div className="h-7">{children}</div>
      <span className="text-[13px] leading-tight sm:text-[15px]">{value}</span>
    </div>
  )
}

function CloseGlyph({ kind }: { kind: Close }) {
  if (kind === 'binary') {
    return (
      <span key={kind} className="obj-fade flex h-full items-center gap-1.5">
        <span className="grid h-6 w-6 place-items-center bg-signal text-xs text-paper">✓</span>
        <span className="grid h-6 w-6 place-items-center border border-fg/30 text-xs opacity-50">✕</span>
      </span>
    )
  }
  if (kind === 'threshold') {
    return (
      <svg key={kind} viewBox="0 0 100 28" className="obj-fade h-full w-full max-w-[110px]" preserveAspectRatio="none" aria-hidden="true">
        <line x1={0} y1={18} x2={100} y2={18} strokeDasharray="3 3" strokeWidth={1} className="stroke-fg/50" />
        <polyline points="0,10 16,7 32,12 48,6 64,11 80,5 100,8" fill="none" strokeWidth={1.8} className="stroke-signal" />
      </svg>
    )
  }
  return (
    <span key={kind} className="obj-fade flex h-full items-center">
      <span className="relative h-2 w-full max-w-[110px] overflow-hidden rounded-full bg-fg/15">
        <span className="obj-progress absolute inset-y-0 left-0 w-[72%] origin-left rounded-full bg-signal" style={{ animationDuration: '900ms' }} />
      </span>
    </span>
  )
}

/**
 * Simulación del estudio: cinco empresas tipo y su manera de escribir objetivos.
 * En vez de una tabla, cada modelo se dibuja: estructura, cierre, cadencia y duración.
 */
export function ModelStudy() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || reducedMotion) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % MODELS.length), AUTO_MS)
    return () => window.clearInterval(id)
  }, [auto, reducedMotion])

  const pick = (i: number) => {
    setAuto(false)
    setActive(i)
  }
  const current = MODELS[active]
  const s = SHAPE[current.id]

  return (
    <figure data-reveal className="border border-fg/15">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 pb-4 pt-5">
        <span className="mono-label">{t({ es: 'Cómo escriben objetivos cinco empresas distintas', en: 'How five different companies write goals' })}</span>
        <span className="mono-label opacity-50">{t({ es: 'Simulación', en: 'Simulation' })}</span>
      </figcaption>

      <div role="tablist" aria-label={t({ es: 'Empresas tipo', en: 'Typical companies' })} className="mx-5 grid grid-cols-5 border border-fg/20 p-1">
        {MODELS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => pick(i)}
            className="relative overflow-hidden py-2.5 font-mono text-[12px] tracking-wide transition-colors hover:bg-fg/[0.06] aria-selected:bg-signal aria-selected:text-paper sm:text-[13px]"
          >
            {m.label}
            {i === active && auto && !reducedMotion && (
              <span key={active} aria-hidden="true" className="obj-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-paper/70" style={{ animationDuration: `${AUTO_MS}ms` }} />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">
        <div key={current.id} className="obj-fade">
          <p className="mono-label text-signal">{t(current.company)}</p>
          <p className="mt-2 max-w-[40ch] text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] font-light leading-snug">{t(current.why)}</p>
        </div>

        <div className="mt-6 grid items-center gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[360px]">
            <Structure id={current.id} noun={t(current.noun)} child={current.childNoun ? t(current.childNoun) : null} />
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden border border-fg/10 bg-fg/10 md:grid-cols-1">
            <Meter label={t({ es: 'Cierre', en: 'Closing' })} value={t(CLOSE_NAME[s.close])}>
              <CloseGlyph kind={s.close} />
            </Meter>
            <Meter label={t({ es: 'Reporte', en: 'Reporting' })} value={t(CADENCE_NAME[s.cadence])}>
              <span className="flex h-full items-center gap-[3px]">
                {Array.from({ length: WEEKS }, (_, w) => (
                  <span
                    key={w}
                    className={`h-2.5 w-full max-w-[8px] rounded-full transition-colors duration-500 ${LIT[s.cadence].includes(w) ? 'bg-signal' : 'bg-fg/15'}`}
                    style={{ transitionDelay: `${w * 25}ms` }}
                  />
                ))}
              </span>
            </Meter>
            <Meter label={t({ es: 'Duración', en: 'Length' })} value={t(MONTHS_NAME[s.months])}>
              <span className="flex h-full items-center">
                <span className="relative h-2 w-full max-w-[110px] overflow-hidden rounded-full bg-fg/15">
                  <span
                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-signal transition-transform duration-700 ease-expo"
                    style={{ transform: `scaleX(${s.months / 12})` }}
                  />
                </span>
              </span>
            </Meter>
          </div>
        </div>
      </div>

      <p className="border-t border-fg/15 p-5 text-sm leading-relaxed opacity-75">
        {t({
          es: 'Ningún modelo inventa piezas: todos combinan las mismas seis reglas. Si el producto las expone, cada empresa trabaja como ya trabaja.',
          en: 'No model invents new pieces: they all combine the same six rules. If the product exposes them, each company works the way it already does.',
        })}
      </p>
    </figure>
  )
}
