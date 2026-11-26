'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useAutoSteps, useInView } from './use-auto-steps'
import { useNarrow } from '../use-narrow'

const GOLD = '#d9b36a'
const INK = 'rgba(255,255,255,0.35)'
const FAINT = 'rgba(255,255,255,0.12)'
/** Cada rama se enciende sola, una tras otra, al entrar; luego los dibujos laten a su paso */
const BRANCH_MS = 550
const BEAT_MS = 1500
/** Colores reales de la tarjeta: por estado, por servicio, por cliente */
const CARD_HUES = ['#4cc98d', '#5b8def', '#e0b44a', '#e8743b']

interface Branch {
  id: string
  answer: L
  /** Lo que se ajusta, solo al tocar la rama */
  detail: readonly L[]
}

const { personalization, dayPanel } = PLATFORM_CASE
const VIEWS: readonly L[] = [
  { es: 'Día', en: 'Day' },
  { es: 'Semana', en: 'Week' },
  { es: 'Mes', en: 'Month' },
  { es: 'Agenda', en: 'Agenda' },
]

const BRANCHES: readonly Branch[] = [
  { id: 'ver', answer: { es: 'Vistas', en: 'Views' }, detail: VIEWS },
  { id: 'tarjeta', answer: { es: 'La tarjeta', en: 'The card' }, detail: personalization.person },
  { id: 'consultar', answer: { es: 'El día', en: 'The day' }, detail: dayPanel.callouts.slice(1, 5).map((c) => c.title) },
  { id: 'reglas', answer: { es: 'Las reglas', en: 'The rules' }, detail: personalization.business },
]

/* ── Los cuatro dibujos: cada uno late con `beat` ──────────────────────── */

function ViewsGlyph({ beat }: { beat: number }) {
  const v = beat % 4
  return (
    <g>
      {/* Día: columnas por barbero */}
      <g style={{ opacity: v === 0 ? 1 : 0, transition: 'opacity 500ms' }}>
        {[0, 1, 2].map((c) => <rect key={c} x={14 + c * 32} y={10} width={28} height={64} rx={3} fill="none" stroke={FAINT} />)}
        <rect x={17} y={16} width={22} height={18} rx={3} fill={GOLD} opacity={0.8} />
        <rect x={49} y={30} width={22} height={26} rx={3} fill={INK} />
        <rect x={81} y={14} width={22} height={14} rx={3} fill={INK} />
        <rect x={81} y={44} width={22} height={22} rx={3} fill={INK} />
        <line x1={12} x2={108} y1={38} y2={38} stroke="#ff6b72" strokeWidth={1} />
      </g>
      {/* Semana: barras de ocupación */}
      <g style={{ opacity: v === 1 ? 1 : 0, transition: 'opacity 500ms' }}>
        {[30, 44, 36, 52, 60, 64, 20].map((h, i) => <rect key={i} x={14 + i * 14} y={74 - h} width={10} height={h} rx={2} fill={i === 5 ? GOLD : INK} />)}
      </g>
      {/* Mes: calor por día */}
      <g style={{ opacity: v === 2 ? 1 : 0, transition: 'opacity 500ms' }}>
        {Array.from({ length: 28 }, (_, i) => (
          <rect key={i} x={14 + (i % 7) * 13.5} y={12 + Math.floor(i / 7) * 16} width={11} height={13} rx={2} fill={GOLD} opacity={0.12 + ((i * 37) % 10) / 12} />
        ))}
      </g>
      {/* Agenda: lista */}
      <g style={{ opacity: v === 3 ? 1 : 0, transition: 'opacity 500ms' }}>
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <circle cx={20} cy={18 + r * 16} r={3} fill={r === 1 ? GOLD : INK} />
            <rect x={30} y={15 + r * 16} width={56 - r * 6} height={6} rx={3} fill={INK} />
          </g>
        ))}
      </g>
    </g>
  )
}

function CardGlyph({ beat }: { beat: number }) {
  const hue = CARD_HUES[beat % CARD_HUES.length]
  const h = [40, 54, 30][beat % 3]
  const showPrice = beat % 2 === 0
  return (
    <g>
      <rect x={20} y={42 - h / 2} width={80} height={h} rx={6} fill={hue} fillOpacity={0.22} stroke={hue} style={{ transition: 'all 600ms cubic-bezier(.16,1,.3,1)' }} />
      <circle cx={30} cy={52 - h / 2} r={3} fill={hue} style={{ transition: 'all 600ms cubic-bezier(.16,1,.3,1)' }} />
      <rect x={38} y={49 - h / 2} width={34} height={6} rx={3} fill="rgba(255,255,255,0.7)" style={{ transition: 'all 600ms cubic-bezier(.16,1,.3,1)' }} />
      <rect x={30} y={60 - h / 2} width={showPrice ? 46 : 26} height={4} rx={2} fill={INK} style={{ transition: 'all 600ms cubic-bezier(.16,1,.3,1)' }} />
      <rect x={76} y={34 + h / 2 - 14} width={18} height={8} rx={2} fill={GOLD} style={{ transition: 'all 600ms cubic-bezier(.16,1,.3,1)' }} />
    </g>
  )
}

function DayGlyph({ beat }: { beat: number }) {
  const grow = beat % 2 === 0
  return (
    <g>
      {/* Cuatro cifras */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={14 + i * 24} y={10} width={20} height={16} rx={3} fill={i === 0 ? GOLD : INK} opacity={i === 0 ? 0.85 : 1} />
      ))}
      {/* El equipo: qué tan llena está cada silla */}
      {[0.8, 0.55, 0.9].map((f, i) => (
        <g key={i}>
          <circle cx={20} cy={38 + i * 12} r={3.5} fill={INK} />
          <rect x={28} y={35.5 + i * 12} width={78} height={5} rx={2.5} fill={FAINT} />
          <rect x={28} y={35.5 + i * 12} width={78 * (grow ? f : f * 0.6)} height={5} rx={2.5} fill={GOLD} opacity={0.75} style={{ transition: 'width 900ms cubic-bezier(.16,1,.3,1)' }} />
        </g>
      ))}
      {/* Para mirar */}
      <circle cx={18} cy={74} r={3} fill="#ff6b72" style={{ opacity: grow ? 1 : 0.3, transition: 'opacity 500ms' }} />
      <rect x={26} y={71.5} width={40} height={5} rx={2.5} fill={INK} />
    </g>
  )
}

function RulesGlyph({ beat }: { beat: number }) {
  return (
    <g>
      {/* Horario por barbero */}
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x={14} y={12 + r * 14} width={92} height={8} rx={2} fill={FAINT} />
          <rect x={14 + r * 10} y={12 + r * 14} width={56 - r * 8} height={8} rx={2} fill={INK} />
        </g>
      ))}
      {/* Interruptores: anticipo y propinas */}
      {[0, 1].map((i) => {
        const on = (beat + i) % 2 === 0
        return (
          <g key={i}>
            <rect x={14 + i * 50} y={58} width={26} height={14} rx={7} fill={on ? GOLD : FAINT} style={{ transition: 'fill 400ms' }} />
            <circle cx={on ? 33 + i * 50 : 21 + i * 50} cy={65} r={5} fill="#fffaf0" style={{ transition: 'cx 400ms cubic-bezier(.16,1,.3,1)' }} />
          </g>
        )
      })}
    </g>
  )
}

const GLYPHS = [ViewsGlyph, CardGlyph, DayGlyph, RulesGlyph]

/** Un compás que avanza solo mientras se ve */
function useBeat(ref: React.RefObject<Element | null>): number {
  const { reducedMotion } = useA11y()
  const inView = useInView(ref)
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setInterval(() => setBeat((b) => b + 1), BEAT_MS)
    return () => window.clearInterval(id)
  }, [inView, reducedMotion])
  return beat
}

/**
 * 03 · La idea: del nodo central salen cuatro ramas —vistas, la tarjeta, el
 * día, las reglas—, cada una con un dibujo que se mueve solo. Tocar una dice
 * qué se ajusta. De abajo sale la fibra a «Forma».
 */
export function NeedsTree() {
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const lit = useAutoSteps(rootRef, BRANCHES.length, BRANCH_MS, 300)
  const beat = useBeat(rootRef)
  const [picked, setPicked] = useState<number | null>(null)
  const detail = picked === null ? null : BRANCHES[picked].detail
  const narrow = useNarrow('(max-width: 767px)')

  const phone = narrow && (
      <div className="mx-auto max-w-[420px]">
        <ol className="relative">
          {/* El tronco baja por la izquierda; cada rama es un nudo en él */}
          <span aria-hidden="true" className="absolute bottom-0 left-[13px] top-0 w-px origin-top bg-gradient-to-b from-[#d9b36a]/80 via-[#d9b36a]/40 to-white/10 transition-transform duration-[1400ms] ease-[cubic-bezier(.65,0,.35,1)]" style={{ transform: `scaleY(${lit / BRANCHES.length})` }} />
          <li aria-hidden="true" className="relative mb-6 flex h-7 items-center">
            <span className="ml-[7px] h-3.5 w-3.5 rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgba(217,179,106,0.25),0_0_18px_4px_rgba(217,179,106,0.7)]" />
          </li>
          {BRANCHES.map((b, i) => {
            const on = i < lit
            const focus = picked === i
            const Glyph = GLYPHS[i]
            return (
              <li key={b.id} className="relative pb-9 last:pb-2">
                <button type="button" aria-pressed={focus} onClick={() => setPicked(focus ? null : i)} className="group grid w-full grid-cols-[28px_104px_minmax(0,1fr)] items-center gap-x-4 text-left outline-none">
                  <span className="relative grid h-3.5 w-3.5 place-items-center justify-self-center" aria-hidden="true">
                    <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'border-white bg-[#fffaf0] shadow-[0_0_14px_3px_rgba(217,179,106,0.6)]' : 'border-white/30 bg-void'} ${focus ? 'scale-125' : ''}`} />
                    {focus && <span className="pl-hot absolute inset-0 rounded-full border border-[#d9b36a]" />}
                  </span>
                  <svg viewBox="0 0 120 84" className={`w-full transition-[opacity,transform] duration-700 ease-expo ${on ? 'opacity-100' : 'translate-x-2 opacity-0'}`} aria-hidden="true">
                    <Glyph beat={beat + i} />
                  </svg>
                  <span className="flex flex-col">
                    <span className={`text-[19px] font-light leading-tight tracking-tight transition-colors duration-500 ${focus ? 'text-[#d9b36a]' : on ? 'text-paper' : 'text-paper/40'}`}>{t(b.answer)}</span>
                    {i === 0 && (
                      <span className="mt-1 h-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[#d9b36a]">
                        <span key={beat % 4} className="pl-fade inline-block">{t(VIEWS[beat % 4])}</span>
                      </span>
                    )}
                    {!focus && i === 0 && picked === null && on && <span className="mt-1 text-[13px] text-paper/60">{t({ es: 'Toca para ver qué se ajusta', en: 'Tap to see what adjusts' })}</span>}
                  </span>
                </button>
                {/* Lo que se ajusta, bajo su rama */}
                {focus && (
                  <ul className="pl-fade ml-[44px] mt-4 space-y-1.5 border-l border-[#d9b36a]/30 pl-4 text-[14px] leading-snug text-paper/75">
                    {b.detail.map((d) => <li key={d.es}>{t(d)}</li>)}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
        <span aria-hidden="true" className="relative mx-auto mt-10 block h-2 w-2 rounded-full bg-white/60 shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
          <span data-fiber-from="pl-forma" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
      </div>
  )

  return (
    <div ref={rootRef} className={narrow ? '' : 'mx-auto max-w-[980px]'}>
      {phone || (<>
      {/* El tronco: un nodo del que salen las cuatro ramas */}
      <div className="relative hidden h-16 lg:block" aria-hidden="true">
        <svg viewBox="0 0 1000 64" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {BRANCHES.map((b, i) => {
            const x = 125 + i * 250
            const on = i < lit
            return (
              <path
                key={b.id}
                d={`M500,4 C500,40 ${x},24 ${x},64`}
                fill="none"
                stroke={on ? GOLD : FAINT}
                strokeOpacity={picked === null || picked === i ? 0.75 : 0.2}
                strokeWidth={1.2}
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={on ? 0 : 1}
                style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.65,0,.35,1), stroke 400ms, stroke-opacity 400ms' }}
              />
            )
          })}
        </svg>
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgba(217,179,106,0.25),0_0_18px_4px_rgba(217,179,106,0.7)]" />
      </div>

      <ol className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
        {BRANCHES.map((b, i) => {
          const on = i < lit
          const focus = picked === i
          const Glyph = GLYPHS[i]
          return (
            <li key={b.id} className={`transition-opacity duration-500 ${picked !== null && !focus ? 'opacity-35' : 'opacity-100'}`}>
              <button type="button" aria-pressed={focus} onClick={() => setPicked(focus ? null : i)} className="group flex w-full flex-col items-center text-center outline-none">
                <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'border-white bg-[#fffaf0] shadow-[0_0_14px_3px_rgba(217,179,106,0.6)]' : 'border-white/30 bg-void'} ${focus ? 'scale-125' : 'group-hover:scale-110'}`} />
                  {focus && <span className="pl-hot absolute inset-0 rounded-full border border-[#d9b36a]" />}
                </span>
                <svg viewBox="0 0 120 84" className={`mt-5 w-full max-w-[170px] transition-[opacity,transform] duration-700 ease-expo ${on ? 'opacity-100' : 'translate-y-2 opacity-0'} group-hover:scale-[1.04]`} aria-hidden="true">
                  <Glyph beat={beat + i} />
                </svg>
                <span className={`mt-3 text-[clamp(1.1rem,1rem+0.5vw,1.35rem)] font-light tracking-tight transition-colors duration-500 ${on ? 'text-paper' : 'text-paper/40'}`}>{t(b.answer)}</span>
                {i === 0 && (
                  <span className="mt-1 h-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[#d9b36a]">
                    <span key={beat % 4} className="pl-fade inline-block">{t(VIEWS[beat % 4])}</span>
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      {/* Lo que se ajusta, solo al tocar una rama */}
      <p key={picked ?? 'hint'} aria-live="polite" className="pl-fade mx-auto mt-10 min-h-[3rem] max-w-[60ch] text-balance text-center text-sm leading-relaxed">
        {detail
          ? <span className="text-paper/75">{detail.map((d) => t(d)).join(' · ')}</span>
          : <span className="text-[14px] text-paper/60">{t({ es: 'Toca una rama para ver qué se ajusta', en: 'Tap a branch to see what adjusts' })}</span>}
      </p>

      {/* De aquí baja la fibra hasta «Forma» */}
      <span aria-hidden="true" className="relative mx-auto mt-10 block h-2 w-2 rounded-full bg-white/60 shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
        <span data-fiber-from="pl-forma" className="absolute left-1/2 top-1/2 h-px w-px" />
      </span>
      </>)}
    </div>
  )
}
