'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'

export const AI_GRADIENT = 'linear-gradient(120deg,#f0ce86,#de8c3a 45%,#2e9cb0 75%,#3f72d8)'
const STAGE = 'relative isolate overflow-hidden rounded-3xl bg-[#0f0d0b] p-5 text-[#efe9dd] md:p-8'

/** Fondo vivo de cada escenario: dos luces del gradiente de IA que se mueven y una rejilla de puntos. */
function StageFx() {
  return (
    <span className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <span className="absolute -left-[10%] top-[10%] h-[70%] w-[50%] animate-[aurora-drift_18s_ease-in-out_infinite] rounded-full bg-[#de8c3a] opacity-[0.16] blur-[90px]" />
      <span className="absolute -right-[8%] bottom-[0%] h-[70%] w-[50%] animate-[aurora-drift_22s_ease-in-out_infinite_reverse] rounded-full bg-[#2e9cb0] opacity-[0.16] blur-[90px]" />
      <span className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.2px)', backgroundSize: '22px 22px' }} />
    </span>
  )
}

/** Ondas de voz: barras que suben y bajan mientras alguien habla. */
export function Wave({ active, bars = 24, className = '' }: { active: boolean; bars?: number; className?: string }) {
  return (
    <span className={`flex h-6 items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${active ? 'animate-[wave_1s_ease-in-out_infinite]' : ''}`}
          style={{ height: active ? `${30 + ((i * 37) % 70)}%` : '18%', animationDelay: `${(i % 7) * 0.09}s`, background: i % 3 === 0 ? '#2e9cb0' : i % 3 === 1 ? '#de8c3a' : '#f0ce86' }}
        />
      ))}
    </span>
  )
}

/** Escribe un texto letra a letra mientras `on` sea verdadero. */
function useTyped(text: string, on: boolean, speed = 28) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) {
      setN(0)
      return
    }
    if (n >= text.length) return
    const id = window.setTimeout(() => setN((k) => k + 1), speed)
    return () => window.clearTimeout(id)
  }, [n, on, text, speed])
  return text.slice(0, n)
}

/* ── 5.1 · Una pregunta, por dentro ──────────────────────────────────── */

const LOOP_STEPS: readonly L[] = [
  { es: 'Entiende la pregunta y quién la hace', en: 'Understands the question and who asks' },
  { es: 'Elige una herramienta de su rol', en: 'Picks a tool from their role' },
  { es: 'Revisa que cada cifra salga de los datos', en: 'Checks every figure comes from the data' },
  { es: 'Responde y dice qué consultó', en: 'Answers and says what it looked up' },
]
/** Seis fases por pregunta y una séptima de salida: todo se desvanece junto antes de la siguiente. */
const PHASES_PER_Q = 7
const EXIT_PHASE = 6

export function AgentLoop() {
  const { t } = useLocale()
  const tick = useTick(1300)
  const qi = Math.floor(tick / PHASES_PER_Q) % CLIPPER_CASE.exchanges.length
  const phase = tick % PHASES_PER_Q
  const ex = CLIPPER_CASE.exchanges[qi]
  const denied = ex.tool === 'nomina'
  const answer = useTyped(t(ex.a), phase >= 4)
  const leaving = phase === EXIT_PHASE
  return (
    <div data-reveal="device" className={STAGE}>
      <StageFx />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* La conversación */}
        <div className="flex min-h-[360px] flex-col gap-3 rounded-2xl border border-white/10 bg-[#141210] p-5">
          <div className="mb-2 flex items-center gap-2">
            <ClipperOrb size={22} state={phase >= 1 && phase <= 3 ? 'thinking' : 'idle'} />
            <span className="text-sm font-medium">Clipper</span>
            <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/55">{t(ex.role)}</span>
          </div>
          <div className={`flex flex-1 flex-col gap-3 transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
          <p key={`q-${qi}`} className="ml-auto max-w-[85%] animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] rounded-2xl rounded-tr-sm bg-white/[0.08] px-4 py-2.5 text-sm">{t(ex.q)}</p>
          {phase >= 1 && phase < 4 && <p className="font-mono text-[11px] text-white/45">{t({ es: 'Razonando…', en: 'Reasoning…' })}</p>}
          {phase >= 4 && (
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm p-[1.5px]" style={{ backgroundImage: denied ? 'none' : AI_GRADIENT, background: denied ? 'rgba(255,107,114,0.4)' : undefined }}>
              <div className="rounded-[15px] bg-[#141210] px-4 py-3">
                <p className="text-sm leading-relaxed">{answer}<span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-[#de8c3a]" aria-hidden="true" /></p>
                {phase >= 5 && (
                  <p className="mt-3 animate-[ramp-in_0.4s_both] border-t border-white/10 pt-2 font-mono text-[10px] text-white/45">
                    {denied ? t({ es: 'No permitido para este rol', en: 'Not allowed for this role' }) : `${t({ es: 'Consulté', en: 'Looked up' })} · ${t(ex.toolLabel)}`}
                  </p>
                )}
              </div>
            </div>
          )}
          {phase >= 5 && (
            <div className="mt-auto flex animate-[ramp-in_0.4s_both] gap-3 font-mono text-[10px] text-white/45">
              <span>Copiar</span><span>👍</span><span>👎</span><span>Regenerar</span><span>{t({ es: 'Leer en voz alta', en: 'Read aloud' })}</span>
            </div>
          )}
          </div>
        </div>

        {/* Por dentro */}
        <div>
          <p className="mono-label mb-4 text-white/50">{t({ es: 'Por dentro', en: 'Inside' })}</p>
          <ol className="relative space-y-7 pl-11">
            {/* El riel y la luz que baja por él mientras piensa */}
            <span className="absolute bottom-3 left-[14px] top-3 w-[2px] rounded-full bg-white/10" aria-hidden="true" />
            <span className="absolute left-[14px] top-3 w-[2px] rounded-full transition-[height] duration-700 ease-expo" style={{ height: `calc(${(leaving ? 0 : Math.min(phase, 3) / 3) * 100}% - 1.5rem)`, backgroundImage: 'linear-gradient(#f0ce86,#de8c3a,#2e9cb0,#3f72d8)' }} aria-hidden="true" />
            {LOOP_STEPS.map((s, i) => {
              const on = phase >= i && !leaving
              const now = !leaving && (phase === i || (i === 3 && phase >= 3))
              return (
                <li key={s.es} className={`relative transition-all duration-500 ${on ? 'opacity-100' : 'opacity-35'}`}>
                  <span className={`absolute -left-11 top-0 flex h-[30px] w-[30px] items-center justify-center rounded-full font-mono text-[11px] transition-all duration-500 ${on ? 'text-[#16130f]' : 'border border-white/20 bg-[#0f0d0b] text-white/50'}`} style={on ? { backgroundImage: AI_GRADIENT, boxShadow: now ? '0 0 0 6px rgba(222,140,58,0.18), 0 0 24px rgba(46,156,176,0.5)' : undefined } : undefined}>
                    {i + 1}
                  </span>
                  <p className={`pt-1 transition-all duration-500 ${now ? 'text-lg' : 'text-sm'}`}>{t(s)}</p>
                  {i === 1 && phase >= 1 && (
                    <p className={`transition-opacity duration-500 ${leaving ? 'opacity-0' : ''}`}>
                    <span className={`mt-2 inline-flex animate-[ramp-in_0.4s_both] items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] ${denied ? 'bg-[#ff6b72]/15 text-[#ff8a8e]' : 'bg-[#2e9cb0]/15 text-[#7fd3e3]'}`}>
                      {ex.tool}{denied ? ' ✕' : ''}
                    </span>
                    </p>
                  )}
                  {i === 2 && phase >= 2 && <p className={`transition-opacity duration-500 ${leaving ? 'opacity-0' : ''}`}><span className="mt-2 block animate-[ramp-in_0.4s_both] text-[12px] text-[#5fd39a]">✓ {t(ex.check)}</span></p>}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
