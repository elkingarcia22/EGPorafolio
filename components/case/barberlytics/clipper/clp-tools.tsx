'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE, type ToolRole } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI, Caption, Lead, onActivate, useInView } from './clp-kit'

const TOOLS = CLIPPER_CASE.toolset
const ROLES: readonly { id: ToolRole; name: L }[] = [
  { id: 'dueno', name: { es: 'Dueño', en: 'Owner' } },
  { id: 'recepcion', name: { es: 'Recepción', en: 'Front desk' } },
  { id: 'barbero', name: { es: 'Barbero', en: 'Barber' } },
]
/** Cada cuánto cambia de rol solo, hasta que alguien elige uno (ms) */
const ROLE_MS = 2600
const W = 900
const H = 460
const C = { x: 450, y: 230 }
const RX = 380
const RY = 185
/** Las 18 en un anillo: las que consultan arriba y a los lados; las que proponen, juntas abajo */
const STEP = (2 * Math.PI) / TOOLS.length
/** Se gira el anillo para que el centro de las que proponen quede justo abajo */
const PROPOSE_MID = TOOLS.findIndex((x) => x.kind === 'propose') + (TOOLS.filter((x) => x.kind === 'propose').length - 1) / 2
const POS = TOOLS.map((_, i) => {
  const a = Math.PI / 2 + (i - PROPOSE_MID) * STEP
  return { x: C.x + RX * Math.cos(a), y: C.y + RY * Math.sin(a) }
})
const READS = TOOLS.filter((x) => x.kind === 'read').length
const PROPOSALS = TOOLS.length - READS

/**
 * 04 · Herramientas: las 18 que tiene el agente, en un anillo alrededor del
 * orbe (círculos, las 13 que consultan; rombos, las 5 que proponen). Cambia de
 * rol sola y se encienden las que ese rol tiene. Tocar una dice qué es y quién la usa.
 */
export function ClipperTools() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [role, setRole] = useState(0)
  const [manual, setManual] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    if (inView) setLit(true)
  }, [inView])

  useEffect(() => {
    if (!inView || manual || reducedMotion) return
    const id = window.setInterval(() => setRole((r) => (r + 1) % ROLES.length), ROLE_MS)
    return () => window.clearInterval(id)
  }, [inView, manual, reducedMotion])

  const current = ROLES[role]
  const has = (i: number) => TOOLS[i].roles.includes(current.id)
  const count = TOOLS.filter((_, i) => has(i)).length

  const caption =
    picked !== null
      ? {
          id: `t${picked}`,
          tag: TOOLS[picked].kind === 'read' ? t({ es: 'Consulta sola', en: 'Looks up on its own' }) : t({ es: 'Propone; una persona aprueba', en: 'Proposes; a person approves' }),
          title: t(TOOLS[picked].label),
          sub: TOOLS[picked].roles.map((r) => t(ROLES.find((x) => x.id === r)!.name)).join(' · '),
        }
      : { id: 'all', tag: t({ es: 'Herramientas', en: 'Tools' }), title: t({ es: `${TOOLS.length} herramientas: ${READS} consultan, ${PROPOSALS} proponen.`, en: `${TOOLS.length} tools: ${READS} look up, ${PROPOSALS} propose.` }) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Cada rol ve solo lo suyo. Y nunca cobra, devuelve dinero ni le escribe a un cliente.', en: 'Each role sees only their own. And it never charges, refunds or messages a client.' })}</Lead>

      <div role="radiogroup" aria-label={t({ es: 'Rol', en: 'Role' })} className="mt-8 flex justify-center gap-2">
        {ROLES.map((r, i) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={role === i}
            onClick={() => {
              setRole(i)
              setManual(true)
            }}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${role === i ? 'border-[#f0ce86] bg-[#f0ce86] text-[#16130f]' : 'border-white/20 text-paper/60 hover:border-white/50 hover:text-paper'}`}
          >
            {t(r.name)}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-6 w-full max-w-[900px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
          {POS.map((p, i) => {
            const on = lit && has(i)
            return (
              <line key={`s${i}`} x1={C.x} y1={C.y} x2={p.x} y2={p.y} stroke={TOOLS[i].kind === 'read' ? AI[2] : AI[1]} strokeWidth={1.2} style={{ opacity: on ? 0.45 : 0.04, transition: `opacity .5s ${i * 25}ms` }} />
            )
          })}
          {POS.map((p, i) => {
            const tool = TOOLS[i]
            const on = lit && has(i)
            const hot = picked === i
            const color = tool.kind === 'read' ? AI[2] : AI[1]
            return (
              <g
                key={tool.id}
                role="button"
                tabIndex={0}
                aria-label={t(tool.label)}
                onClick={() => setPicked(hot ? null : i)}
                onKeyDown={onActivate(() => setPicked(hot ? null : i))}
                className="cursor-pointer outline-none"
                data-fiber-from={i === TOOLS.length - 1 ? 'clp-forma' : undefined}
              >
                <g transform={`translate(${p.x} ${p.y})`}>
                  <g className="clp-grow">
                  <circle r={26} fill="transparent" />
                  <circle r={20} fill={color} opacity={on ? (hot ? 0.35 : 0.14) : 0} style={{ transition: `opacity .5s ${i * 25}ms` }} />
                  {hot && !reducedMotion && <circle r={10} fill="none" stroke="white" strokeWidth={1.4} className="clp-ping" />}
                  {tool.kind === 'read' ? (
                    <circle r={8} fill={on ? color : 'rgb(var(--void))'} stroke="white" strokeOpacity={on ? 0.9 : 0.25} strokeWidth={1.3} style={{ transition: `fill .5s ${i * 25}ms` }} />
                  ) : (
                    <rect x={-7} y={-7} width={14} height={14} transform="rotate(45)" fill={on ? color : 'rgb(var(--void))'} stroke="white" strokeOpacity={on ? 0.9 : 0.25} strokeWidth={1.3} style={{ transition: `fill .5s ${i * 25}ms` }} />
                  )}
                  </g>
                </g>
              </g>
            )
          })}
        </svg>
        <div className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: '50%', top: `${(C.y / H) * 100}%` }}>
          <span className="block scale-[0.6] sm:scale-100">
            <ClipperOrb size={96} state="idle" />
          </span>
          <p className="mt-1 text-center sm:mt-4">
            <span key={count} className="clp-value block text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-none tabular-nums">
              {count}
              <span className="text-[0.55em] opacity-40">/{TOOLS.length}</span>
            </span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-paper/50 sm:text-[10px]">{t(current.name)}</span>
          </p>
        </div>
      </div>

      <p className="mt-4 flex justify-center gap-5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/50">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: AI[2] }} />{t({ es: 'Consulta', en: 'Looks up' })}</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rotate-45" style={{ background: AI[1] }} />{t({ es: 'Propone', en: 'Proposes' })}</span>
      </p>
    </div>
  )
}
