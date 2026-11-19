'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { FAV, favColor, Lock, UBITS_BLUE } from './shared'

export const TOTAL_INVITED = 520
export const MIN_GROUP = 5

const SECTIONS: readonly L[] = [
  { es: 'Propósito', en: 'Purpose' },
  { es: 'Liderazgo', en: 'Leadership' },
  { es: 'Colaboración', en: 'Collaboration' },
  { es: 'Reconocimiento', en: 'Recognition' },
  { es: 'Bienestar', en: 'Well-being' },
]

/** Áreas con sus promedios por sección; Comercial arranca bajo el mínimo. */
const AREAS = [
  { name: 'Producto', n: 48, scores: [4.3, 3.7, 4.4, 3.2, 3.6] },
  { name: 'Tecnología', n: 61, scores: [3.9, 3.3, 4.1, 2.7, 2.9] },
  { name: 'Finanzas', n: 19, scores: [3.5, 4.2, 3.8, 3.4, 4.1] },
  { name: 'Comercial', n: 4, scores: [4.5, 4.1, 3.6, 4.2, 3.1] },
  { name: 'Gente', n: 22, scores: [3.7, 2.8, 3.9, 2.3, 3.3] },
] as const
export const GROWING_AREA = 3

const TABS: readonly L[] = [
  { es: 'Participación', en: 'Participation' },
  { es: 'Mapa de calor', en: 'Heatmap' },
  { es: 'eNPS', en: 'eNPS' },
  { es: 'Comentarios', en: 'Comments' },
  { es: 'Análisis con IA', en: 'AI analysis' },
]

/** Cuenta de un número a otro en ~0,8 s cada vez que cambia el destino. */
function useCount(target: number): number {
  const { reducedMotion } = useA11y()
  const [value, setValue] = useState(target)
  useEffect(() => {
    if (reducedMotion) return setValue(target)
    let raf = 0
    const from = value
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 800)
      setValue(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reducedMotion])
  return value
}

function Ring({ answered }: { answered: number }) {
  const { t } = useLocale()
  const shown = useCount(answered)
  const pct = shown / TOTAL_INVITED
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 84 84" className="h-[4.6rem] w-[4.6rem] -rotate-90" aria-hidden="true">
        <circle cx="42" cy="42" r={r} fill="none" stroke="#ecf1fa" strokeWidth="9" />
        <circle cx="42" cy="42" r={r} fill="none" stroke={UBITS_BLUE} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} className="transition-[stroke-dasharray] duration-700" />
      </svg>
      <div>
        <p className="whitespace-nowrap text-[20px] font-semibold leading-none tabular-nums">{(pct * 100).toFixed(1).replace('.', ',')} %</p>
        <p className="mt-1 text-[10px] text-[#5c646f]">
          <span className="tabular-nums">{shown}</span> {t({ es: `de ${TOTAL_INVITED} respondieron`, en: `of ${TOTAL_INVITED} answered` })}
        </p>
      </div>
    </div>
  )
}

interface DashboardProps {
  answered: number
  growingN: number
  enps: number
  /** Resalta la fila del área que acaba de recibir una respuesta. */
  pulse: boolean
}

/** El tablero de resultados de Encuestas en miniatura, vivo: participación, eNPS y mapa de calor con anonimato. */
export function ResultsDashboard({ answered, growingN, enps, pulse }: DashboardProps) {
  const { t } = useLocale()
  const enpsShown = useCount(enps)
  return (
    <div className="overflow-hidden rounded-2xl bg-white text-[#303a47] ring-1 ring-black/10">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7fb] px-4 py-2.5" aria-hidden="true">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#e0675f]" />
          <span className="h-2 w-2 rounded-full bg-[#f1c56c]" />
          <span className="h-2 w-2 rounded-full bg-[#8ccfa4]" />
        </span>
        <span className="ml-2 truncate font-mono text-[10px] text-black/45">ubits.co/admin/encuestas/clima-2026/resultados</span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] text-[#5c646f]">{t({ es: 'Encuestas › Resultados', en: 'Surveys › Results' })}</p>
            <p className="mt-1 text-lg font-semibold leading-tight sm:text-xl">{t({ es: 'Clima organizacional 2026', en: 'Organizational climate 2026' })}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="rounded-full bg-[#e2f1e2] px-2 py-0.5 font-medium text-[#2c6b2f]">{t({ es: 'En progreso', en: 'In progress' })}</span>
            <span className="flex items-center gap-1 rounded-full bg-[#ecf1fa] px-2 py-0.5 text-[#0c5bef]">
              <Lock className="h-3 w-3" /> {t({ es: `Anónima · mín. ${MIN_GROUP}`, en: `Anonymous · min ${MIN_GROUP}` })}
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-4 overflow-hidden border-b border-black/[0.06] text-[11px]" aria-hidden="true">
          {TABS.map((tab, i) => (
            <span key={tab.es} className={`shrink-0 whitespace-nowrap pb-2 ${i === 1 ? 'border-b-2 border-[#0c5bef] font-semibold text-[#0c5bef]' : 'text-[#5c646f]'}`}>{t(tab)}</span>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <div className="rounded-xl border border-black/[0.07] p-3">
              <p className="mb-2 text-[10px] font-medium text-[#5c646f]">{t({ es: 'Participación', en: 'Participation' })}</p>
              <Ring answered={answered} />
            </div>
            <div className="rounded-xl border border-black/[0.07] p-3">
              <p className="text-[10px] font-medium text-[#5c646f]">eNPS</p>
              <p className="mt-1 text-[26px] font-semibold leading-none tabular-nums" style={{ color: enpsShown >= 30 ? '#2e8a55' : '#303a47' }}>+{enpsShown}</p>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full" aria-hidden="true">
                <span className="transition-[width] duration-700" style={{ width: `${(100 - enpsShown) / 2 - 8}%`, background: FAV[0] }} />
                <span style={{ width: '16%', background: FAV[2] }} />
                <span className="flex-1" style={{ background: FAV[4] }} />
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-black/[0.07] p-3">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-[10px] font-medium text-[#5c646f]">{t({ es: 'Favorabilidad por área', en: 'Favorability by area' })}</p>
              <p className="flex gap-0.5" aria-hidden="true">
                {FAV.map((f) => <span key={f} className="h-1.5 w-3 rounded-sm" style={{ background: f }} />)}
              </p>
            </div>
            <div className="grid grid-cols-[4.6rem_repeat(5,minmax(0,1fr))] gap-1 text-[10px]">
              <span />
              {AREAS.map((a, c) => {
                const n = c === GROWING_AREA ? growingN : a.n
                return (
                  <span key={a.name} className="truncate text-center text-[#5c646f]">
                    {a.name}
                    <span className={`block tabular-nums ${n < MIN_GROUP ? 'font-semibold text-[#b8860b]' : 'text-[#979ba3]'}`}>n={n}</span>
                  </span>
                )
              })}
              {SECTIONS.map((s, r) => (
                <div key={s.es} className="contents">
                  <span className="flex items-center truncate text-[#414a5c]">{t(s)}</span>
                  {AREAS.map((a, c) => {
                    const n = c === GROWING_AREA ? growingN : a.n
                    const reserved = n < MIN_GROUP
                    const score = a.scores[r]
                    const fresh = c === GROWING_AREA && !reserved && pulse
                    return (
                      <span
                        key={`${a.name}-${reserved}`}
                        className={`flex h-7 items-center justify-center rounded-md font-mono tabular-nums ${fresh ? 'hd-unlock' : ''}`}
                        style={{ ...(reserved ? { background: '#f1f2f4', color: '#979ba3' } : { background: favColor(score), color: '#14161a' }), animationDelay: fresh ? `${r * 70}ms` : undefined }}
                        title={reserved ? t({ es: 'Reservado: por debajo del mínimo', en: 'Reserved: below the minimum' }) : undefined}
                      >
                        {reserved ? <Lock className="h-3 w-3" /> : score.toFixed(1).replace('.', ',')}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2.5 min-h-[2.2em] text-[10px] leading-snug text-[#5c646f]" aria-live="polite">
              {growingN < MIN_GROUP
                ? t({ es: `Comercial lleva ${growingN} respuestas: sus resultados siguen reservados.`, en: `Sales has ${growingN} answers: its results stay reserved.` })
                : t({ es: 'Comercial llegó al mínimo: ya se puede leer sin señalar a nadie.', en: 'Sales reached the minimum: it can be read without pointing at anyone.' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
