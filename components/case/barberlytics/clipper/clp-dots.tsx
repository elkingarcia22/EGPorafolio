'use client'

import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { Caption, Lead, RED, onActivate, useAutoSteps, useInView } from './clp-kit'

const W = 900
const H = 380
const ORB = { x: 450, y: 190, r: 64 }
/** Los tres hallazgos alrededor del orbe apagado */
const NODES = [
  { x: 120, y: 190 },
  { x: 780, y: 92 },
  { x: 780, y: 288 },
] as const
const SEEN = CLIPPER_CASE.dots.seen
const LAST = SEEN.length + 1
const msFor = (s: number) => (s === 0 ? 500 : 850)

/** Fibra del hallazgo al borde del orbe */
const fiberTo = (n: { x: number; y: number }) => {
  const toRight = n.x < ORB.x
  const ex = ORB.x + (toRight ? -ORB.r : ORB.r)
  const mid = (n.x + ex) / 2
  return `M${n.x} ${n.y} C${mid} ${n.y} ${mid} ${ORB.y} ${ex} ${ORB.y}`
}

/**
 * 01 · Los puntos: el orbe existe, pero apagado (la carcasa sin cerebro). Al
 * entrar, cada hallazgo de la investigación se enciende y su fibra intenta
 * llegar al orbe, pero queda rota. Al final, las cifras del punto de partida.
 * Tocar un hallazgo lo explica arriba.
 */
export function ClipperDotsScene() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [step] = useAutoSteps({ last: LAST, ms: msFor, run: inView, reducedMotion })
  const [picked, setPicked] = useState<number | null>(null)
  const done = step === LAST
  const shown = Math.min(SEEN.length, step)
  const focus = picked ?? (step >= 1 && step <= SEEN.length ? step - 1 : null)

  const caption =
    focus !== null
      ? { id: `f${focus}`, tag: `0${focus + 1} · ${t({ es: 'Hallazgo', en: 'Finding' })}`, title: t(SEEN[focus].title), sub: picked !== null ? t(SEEN[focus].body) : undefined }
      : done
        ? { id: 'done', tag: t({ es: 'El hueco', en: 'The gap' }), title: t({ es: 'Nadie le respondía a la barbería con sus propios datos.', en: 'Nobody answered the shop with its own data.' }) }
        : { id: 'intro', tag: t({ es: 'Investigación', en: 'Research' }), title: t(CLIPPER_CASE.dots.kicker) }

  return (
    <div ref={rootRef}>
      <Caption {...caption} />
      <Lead>{t({ es: 'Había panel, historial y voz, pero ningún modelo respondía. En recepción, saber cuánto se llevaba cobrado era abrir tres pantallas.', en: 'There was a panel, history and voice, but no model answered. At the front desk, knowing what had been collected meant opening three screens.' })}</Lead>

      <div className="relative mx-auto mt-8 w-full max-w-[900px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
          {NODES.map((n, i) => {
            const on = i < shown
            return (
              <g key={i}>
                <path d={fiberTo(n)} fill="none" stroke="white" strokeOpacity={0.06} />
                {/* La fibra intenta llegar al orbe y se queda rota */}
                <path
                  d={fiberTo(n)}
                  pathLength={1}
                  fill="none"
                  stroke={RED}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeDasharray={on ? '0.04 0.03' : '1'}
                  strokeDashoffset={on ? 0 : 1}
                  className={on && !reducedMotion ? 'clp-flicker' : ''}
                  style={{ transition: 'stroke-dashoffset .7s cubic-bezier(.16,1,.3,1)', opacity: on ? 0.8 : 0 }}
                />
              </g>
            )
          })}
          {NODES.map((n, i) => {
            const on = i < shown
            const hot = focus === i
            return (
              <g
                key={`n${i}`}
                role="button"
                tabIndex={0}
                aria-label={t(SEEN[i].title)}
                onClick={() => setPicked(picked === i ? null : i)}
                onKeyDown={onActivate(() => setPicked(picked === i ? null : i))}
                className="cursor-pointer outline-none"
                style={{ pointerEvents: 'all' }}
              >
                <g style={{ transform: `translate(${n.x}px, ${n.y}px) scale(${on ? 1 : 0.5})`, transition: 'transform .6s cubic-bezier(.16,1,.3,1)' }}>
                  <circle r={30} fill={RED} opacity={on ? (hot ? 0.28 : 0.12) : 0} style={{ transition: 'opacity .5s' }} />
                  {hot && !reducedMotion && <circle r={14} fill="none" stroke={RED} strokeWidth={1.5} className="clp-ping" />}
                  <circle r={9} fill={on ? (hot ? 'white' : RED) : 'rgb(var(--void))'} stroke="white" strokeOpacity={on ? 0.9 : 0.35} strokeWidth={1.4} style={{ transition: 'fill .5s' }} />
                  <text y={-26} textAnchor="middle" className="clp-svg-role fill-paper font-mono" style={{ opacity: on ? 0.8 : 0.3 }}>0{i + 1}</text>
                </g>
              </g>
            )
          })}
        </svg>
        {/* El orbe, apagado: sin color y sin halo, como una carcasa sin cerebro */}
        <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(ORB.x / W) * 100}%`, top: `${(ORB.y / H) * 100}%` }}>
          <span className="block scale-[0.55] opacity-40 grayscale sm:scale-100">
            <ClipperOrb size={110} />
          </span>
          <span data-fiber-from="clp-patrones" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
      </div>

      {/* Al terminar, el punto de partida en cifras */}
      <dl className={`mx-auto mt-10 grid w-full max-w-[760px] grid-cols-2 gap-6 transition-all duration-700 ease-expo sm:grid-cols-4 ${done ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        {CLIPPER_CASE.dots.stats.map((s) => (
          <div key={s.value} className="text-center">
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span className="block bg-gradient-to-br from-[#f0ce86] to-[#2e9cb0] bg-clip-text text-[clamp(1.8rem,1.3rem+1.6vw,2.8rem)] font-light leading-none text-transparent tabular-nums">{s.value}</span>
              <span className="mx-auto mt-2 block max-w-[16ch] text-[11px] leading-snug text-paper/50">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
