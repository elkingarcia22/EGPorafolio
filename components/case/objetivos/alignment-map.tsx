'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { useStepper } from './forma-ui'
import { SANKEY_AREAS, SANKEY_GOALS, SANKEY_LINKS, type GoalId } from './sankey-real'

const RED = '#d92d20'
const MUTED = '#8a8fa3'
const TOUR_MS = 3800

type Focus = { kind: 'goal'; id: GoalId } | { kind: 'area'; id: string } | null

/** Si un flujo pertenece a lo que está en foco (un objetivo y lo que le llega, o un área y lo que aporta). */
function inFocus(focus: Focus, from: string, to: GoalId): boolean {
  if (!focus) return true
  if (focus.kind === 'area') return from === focus.id
  // «Ser la marca preferida» también empuja a «Crecer los ingresos»: su flujo cuenta para los dos.
  return to === focus.id || (focus.id === 'marca' && from === 'marca')
}

/**
 * El mapa de alineación real, animado: los flujos crecen de cada área hacia los
 * objetivos de empresa y el recorrido enciende un objetivo a la vez con lo que
 * dice la plataforma. Al pasar por un área o un objetivo, se aíslan sus flujos.
 */
export function AlignmentMap() {
  const { t } = useLocale()
  const [hover, setHover] = useState<Focus>(null)
  const { step, ref, seen } = useStepper(TOUR_MS, SANKEY_GOALS.length + 1, hover !== null)
  // Primero el mapa entero, después cada objetivo de empresa.
  const tour: Focus = step === 0 ? null : { kind: 'goal', id: SANKEY_GOALS[step - 1].id }
  const focus = hover ?? tour
  const goal = focus?.kind === 'goal' ? SANKEY_GOALS.find((g) => g.id === focus.id) : null

  return (
    <div ref={ref} data-reveal="device" className="relative overflow-hidden rounded-3xl bg-white p-4 text-[#161a2c] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.5)] ring-1 ring-black/5 md:p-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[15px] font-medium">Mapa de alineación</p>
          <p className="mt-1 text-[13px] text-black/55">De cada área a cada objetivo de empresa: el grosor es lo que aporta y el color, cómo va.</p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">{t({ es: 'Staging · corte al 19 nov 2026', en: 'Staging · as of Nov 19, 2026' })}</p>
      </div>

      <div className="-mx-2 overflow-x-auto px-2">
        <svg viewBox="0 0 855 460" className="h-auto w-full min-w-[640px]" role="img" aria-label="Mapa de alineación: Crecer los ingresos un 15 %, 48,6 % del peso y avance 9,8 %; Ser la marca preferida de los clientes, 26,2 % del peso y avance 11 %; Operar con más eficiencia, 23,8 % del peso y avance 8,3 %; Sin alinear, 27,6 % del peso y avance 9,5 %">
          <g fill="none">
            {SANKEY_LINKS.map((l, i) => {
              const on = inFocus(focus, l.from, l.to)
              return (
                <path
                  key={l.d}
                  d={l.d}
                  stroke={l.tone === 'red' ? RED : MUTED}
                  strokeWidth={l.w}
                  pathLength={1}
                  strokeDasharray={1}
                  className={`${seen ? 'obj-draw' : ''} transition-[stroke-opacity] duration-500`}
                  style={{ strokeDashoffset: seen ? undefined : 1, strokeOpacity: on ? (focus ? 0.55 : 0.35) : 0.06, animationDelay: `${(l.from === 'marca' ? 12 : i % 12) * 70}ms`, animationDuration: '1.6s' }}
                />
              )
            })}
          </g>

          {SANKEY_AREAS.map((a) => {
            const on = !focus || (focus.kind === 'area' ? focus.id === a.area : SANKEY_LINKS.some((l) => l.from === a.area && inFocus(focus, l.from, l.to)))
            return (
              <g key={a.area} onMouseEnter={() => setHover({ kind: 'area', id: a.area })} onMouseLeave={() => setHover(null)} className="cursor-pointer transition-opacity duration-500" style={{ opacity: on ? 1 : 0.3 }}>
                <rect x={150} y={a.y} width={10} height={a.h} rx={3} fill={MUTED} />
                <rect x={0} y={a.y - 4} width={160} height={a.h + 8} fill="transparent" />
                <text x={140} y={a.y + a.h / 2 + 4} textAnchor="end" fontSize={12} fontWeight={500} fill="currentColor">{a.area}</text>
              </g>
            )
          })}

          {SANKEY_GOALS.map((g) => {
            const on = !focus || inFocus(focus, g.id === 'marca' ? 'marca' : '', g.id) || (focus.kind === 'goal' && focus.id === g.id) || (focus.kind === 'area' && SANKEY_LINKS.some((l) => l.from === focus.id && l.to === g.id))
            const lit = focus?.kind === 'goal' && focus.id === g.id
            return (
              <g key={g.id} onMouseEnter={() => setHover({ kind: 'goal', id: g.id })} onMouseLeave={() => setHover(null)} className="cursor-pointer transition-opacity duration-500" style={{ opacity: on ? 1 : 0.3 }}>
                <rect x={g.x} y={g.y} width={10} height={g.h} rx={3} fill={g.tone === 'red' ? RED : MUTED} />
                {lit && <rect x={g.x - 4} y={g.y - 4} width={18} height={g.h + 8} rx={6} fill="none" stroke={g.tone === 'red' ? RED : MUTED} strokeWidth={2} className="animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]" />}
                <text x={g.labelX} y={g.labelY} textAnchor={g.anchor} fontSize={12} fontWeight={600} fill="currentColor">{g.title}</text>
                <text x={g.labelX} y={g.labelY + (g.anchor === 'middle' ? 13 : 16)} textAnchor={g.anchor} fontSize={11} fill="rgba(22,26,44,0.6)">{g.meta}</text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Lo que dice la plataforma del objetivo en foco («Aporte a cada objetivo de empresa»). */}
      <div className="mt-4 grid min-h-[64px] items-center gap-3 rounded-2xl bg-[#f4f5f9] px-4 py-3 text-[13px] sm:grid-cols-[minmax(0,1fr)_auto]">
        {goal ? (
          <>
            <p key={goal.id} className="animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
              <b className="font-medium">{goal.title.replace('…', ' de los clientes')}</b>
              <span className="text-black/55"> · {goal.meta}</span>
              <span className="mt-0.5 block text-black/70">Lo empujan: {goal.pushes}</span>
            </p>
            <span className="text-[11px] text-black/45">{t({ es: 'Pasa por un área o un objetivo', en: 'Hover an area or a goal' })}</span>
          </>
        ) : focus?.kind === 'area' ? (
          <p key={focus.id} className="animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
            <b className="font-medium">{focus.id}</b>
            <span className="text-black/60"> · {t({ es: 'a qué objetivos de empresa aporta', en: 'which company goals it feeds' })}</span>
          </p>
        ) : (
          <p className="text-black/60">{t({ es: '10 áreas, 3 objetivos de empresa y lo que quedó sin alinear: 72,4 % del peso cuelga de la estrategia.', en: '10 areas, 3 company goals and what stayed unaligned: 72.4 % of the weight hangs from strategy.' })}</p>
        )}
      </div>
    </div>
  )
}
