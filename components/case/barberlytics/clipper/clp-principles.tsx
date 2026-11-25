'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb, type ClipperOrbState } from '../clipper-orb'
import { AI, AiGradient, Caption, Lead, onActivate, useAutoSteps, useInView } from './clp-kit'

const W = 900
const H = 420
const ORB = { x: 450, y: 210, r: 70 }
/** Las cuatro reglas, en las esquinas de un rombo alrededor del orbe */
const NODES = [
  { x: 170, y: 80 },
  { x: 730, y: 80 },
  { x: 730, y: 340 },
  { x: 170, y: 340 },
] as const
const PRINCIPLES = CLIPPER_CASE.idea.principles
const LAST = PRINCIPLES.length + 1
const msFor = (s: number) => (s === 0 ? 500 : 1100)
/** Cómo se mueve el orbe mientras prueba cada regla */
const ORB_STATE: readonly ClipperOrbState[] = ['thinking', 'idle', 'listening', 'idle']

const spoke = (n: { x: number; y: number }) => {
  const dx = n.x - ORB.x
  const dy = n.y - ORB.y
  const len = Math.hypot(dx, dy)
  const ex = ORB.x + (dx / len) * ORB.r
  const ey = ORB.y + (dy / len) * ORB.r
  return `M${ex} ${ey} C${ex + dx * 0.35} ${ey} ${n.x} ${n.y - dy * 0.35} ${n.x} ${n.y}`
}

/**
 * 03 · La idea: el orbe al centro y sus cuatro reglas alrededor. Al entrar, de
 * él sale una fibra hacia cada regla, una tras otra. Tocar una regla la explica.
 */
export function ClipperPrinciples() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [step] = useAutoSteps({ last: LAST, ms: msFor, run: inView, reducedMotion })
  const [picked, setPicked] = useState<number | null>(null)
  const done = step === LAST
  const current = step >= 1 && step <= PRINCIPLES.length ? step - 1 : null
  const focus = picked ?? current
  const orbState: ClipperOrbState = current !== null ? ORB_STATE[current] : 'idle'

  const caption =
    focus !== null
      ? { id: `p${focus}`, tag: `${t({ es: 'Regla', en: 'Rule' })} 0${focus + 1}`, title: t(PRINCIPLES[focus].title), sub: picked !== null ? t(PRINCIPLES[focus].body) : undefined }
      : done
        ? { id: 'done', tag: t({ es: 'La idea', en: 'The idea' }), title: t({ es: 'Responde con tus datos, nunca adivina y nada cambia sin una persona.', en: 'It answers with your data, never guesses, and nothing changes without a person.' }) }
        : { id: 'intro', tag: t({ es: '¿Cómo podríamos…?', en: 'How might we…?' }), title: t({ es: 'Un asistente con los datos de la barbería, que no haga nada sin aprobación.', en: 'An assistant with the shop’s data that does nothing without approval.' }) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Cuatro reglas antes que cualquier pantalla. Cada una se probó en el agente y en sus evaluaciones.', en: 'Four rules before any screen. Each one was tested in the agent and its evaluations.' })}</Lead>

      <div className="relative mx-auto mt-8 w-full max-w-[860px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <AiGradient id="clp-idea-fiber" />
          </defs>
          {NODES.map((n, i) => {
            const on = done || (current !== null && i <= current)
            return (
              <g key={i}>
                <path d={spoke(n)} fill="none" stroke="white" strokeOpacity={0.07} />
                <path d={spoke(n)} pathLength={1} fill="none" stroke="url(#clp-idea-fiber)" strokeWidth={1.8} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={on ? 0 : 1} style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.45,0,.25,1)', filter: `drop-shadow(0 0 4px ${AI[1]})` }} />
                {current === i && !reducedMotion && (
                  <path d={spoke(n)} pathLength={1} fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="0.08 0.92" className="clp-pulse" />
                )}
              </g>
            )
          })}
          {NODES.map((n, i) => {
            const on = done || (current !== null && i <= current)
            const hot = focus === i
            return (
              <g
                key={`n${i}`}
                role="button"
                tabIndex={0}
                aria-label={t(PRINCIPLES[i].title)}
                onClick={() => setPicked(picked === i ? null : i)}
                onKeyDown={onActivate(() => setPicked(picked === i ? null : i))}
                className="cursor-pointer outline-none"
              >
                <g transform={`translate(${n.x} ${n.y})`}>
                  <circle r={34} fill="transparent" />
                  <circle r={24} fill={AI[i]} opacity={on ? (hot ? 0.3 : 0.12) : 0} style={{ transition: 'opacity .5s' }} />
                  {hot && !reducedMotion && <circle r={12} fill="none" stroke={AI[i]} strokeWidth={1.5} className="clp-ping" />}
                  <circle r={8} fill={on ? (hot ? 'white' : AI[i]) : 'rgb(var(--void))'} stroke="white" strokeOpacity={on ? 0.9 : 0.35} strokeWidth={1.4} style={{ transition: 'fill .5s' }} />
                </g>
              </g>
            )
          })}
        </svg>
        {/* Los nombres de las reglas, hacia afuera del rombo */}
        {NODES.map((n, i) => {
          const left = n.x < ORB.x
          const top = n.y < ORB.y
          const on = done || (current !== null && i <= current)
          return (
            <p
              key={`l${i}`}
              className={`pointer-events-none absolute max-w-[38%] text-[12px] leading-snug transition-opacity duration-500 sm:text-[15px] ${left ? 'text-left' : 'text-right'} ${on ? 'opacity-90' : 'opacity-35'}`}
              style={{
                [left ? 'left' : 'right']: `${((left ? n.x : W - n.x) / W) * 100 - 6}%`,
                [top ? 'bottom' : 'top']: `${((top ? H - n.y : n.y) / H) * 100 + 8}%`,
              }}
            >
              {t(PRINCIPLES[i].title)}
            </p>
          )
        })}
        <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: `${(ORB.y / H) * 100}%` }}>
          <span className="block scale-[0.55] sm:scale-100">
            <ClipperOrb size={120} state={reducedMotion ? 'idle' : orbState} />
          </span>
          {/* Del centro del orbe, por detrás, baja la fibra hacia «Herramientas» */}
          <span data-fiber-from="clp-tools" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
      </div>
    </div>
  )
}
