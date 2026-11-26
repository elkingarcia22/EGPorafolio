'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { CoverTapPhone } from './phone/cover-tap-phone'
import { usePhone } from './use-phone'

interface TapNode {
  x: number
  label: L
  value: L
}

/** Quien vuelve, de su celular a la cita (datos de prueba de la demo) */
const NODES: readonly TapNode[] = [
  { x: 90, label: { es: 'Su celular', en: 'Their phone' }, value: { es: '320 217 2738', en: '320 217 2738' } },
  { x: 370, label: { es: 'Te reconoce', en: 'Knows you' }, value: { es: 'Hola, Marcela', en: 'Hi, Marcela' } },
  { x: 650, label: { es: 'Lo de siempre', en: 'The usual' }, value: { es: 'Corte clásico', en: 'Classic cut' } },
  { x: 910, label: { es: 'Un toque', en: 'One tap' }, value: { es: 'Cita lista', en: 'Booked' } },
]
const Y = 96
/** Cada cuánto se enciende el siguiente nodo y la pausa al completar (ms) */
const HOP_MS = 820
const HOLD_MS = 1800
/** El trazo: casi recto, con una ondulación leve entre nodos */
const PATH = NODES.slice(1).reduce((d, n, i) => {
  const prev = NODES[i]
  const mid = (prev.x + n.x) / 2
  return `${d} Q${mid} ${Y + (i % 2 ? 18 : -18)} ${n.x} ${Y}`
}, `M${NODES[0].x} ${Y}`)

interface CoverTapProps {
  running: boolean
  reducedMotion: boolean
}

/**
 * La portada en una sola línea horizontal: quien vuelve escribe su celular, la
 * reserva lo reconoce, ya trae «lo de siempre» y un toque deja la cita lista.
 * La señal salta de nodo en nodo y vuelve a empezar.
 */
export function CoverTap({ running, reducedMotion }: CoverTapProps) {
  const { t } = useLocale()
  const last = NODES.length - 1
  const [lit, setLit] = useState(reducedMotion ? last : 0)

  useEffect(() => {
    if (!running || reducedMotion) return
    const id = window.setTimeout(() => setLit((n) => (n >= last ? 0 : n + 1)), lit >= last ? HOLD_MS : HOP_MS)
    return () => window.clearTimeout(id)
  }, [running, reducedMotion, lit, last])

  const progress = lit / last
  const phone = usePhone()

  if (phone) return <CoverTapPhone nodes={NODES} lit={lit} hopMs={HOP_MS} reducedMotion={reducedMotion} />

  return (
    <figure className="mx-auto w-full max-w-[1000px]">
      <svg viewBox="0 0 1000 200" className="w-full overflow-visible" role="img" aria-label={t({ es: 'Quien vuelve: su celular, lo reconoce, lo de siempre y un toque', en: 'Returning client: their phone, recognized, the usual and one tap' })}>
        <defs>
          <linearGradient id="tap-fiber" x1="0" x2="1">
            <stop offset="0" stopColor="rgb(var(--signal))" />
            <stop offset="1" stopColor="rgb(var(--bk))" />
          </linearGradient>
        </defs>
        <path d={PATH} fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={1.5} />
        {/* Lo recorrido hasta ahora */}
        <path
          d={PATH}
          fill="none"
          stroke="url(#tap-fiber)"
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          style={{ transition: lit === 0 ? 'none' : `stroke-dashoffset ${HOP_MS * 0.8}ms cubic-bezier(.5,0,.3,1)`, filter: 'drop-shadow(0 0 5px rgb(var(--bk) / 0.6))' }}
        />
        {NODES.map((n, i) => {
          const on = i <= lit
          const end = i === last
          return (
            <g key={n.x} transform={`translate(${n.x} ${Y})`}>
              <circle r={end ? 34 : 26} fill={end ? 'rgb(var(--bk) / 0.14)' : 'rgb(var(--signal) / 0.08)'} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .4s' }} />
              {/* El toque: un anillo que se abre al llegar la señal */}
              {on && i === lit && !reducedMotion && <circle key={`tap-${lit}`} r={16} fill="none" stroke="white" strokeWidth={1.5} className="bk-tap" />}
              <circle
                r={end ? 13 : 9}
                fill={on ? (end ? 'rgb(var(--bk))' : 'white') : 'rgb(var(--void))'}
                stroke={on ? 'white' : 'rgb(255 255 255 / 0.4)'}
                strokeWidth={1.5}
                style={{ transition: 'fill .4s, stroke .4s', filter: on ? 'drop-shadow(0 0 8px rgb(var(--bk) / 0.7))' : 'none' }}
                data-fiber-from={end ? 'bk-puntos' : undefined}
              />
              {end && <path d="M-5 0 l3.5 3.5 l6.5 -7" fill="none" stroke="rgb(var(--void))" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={on ? 1 : 0} />}
              <text y={-46} textAnchor="middle" className="tap-value fill-paper" style={{ opacity: on ? 1 : 0.3, transition: 'opacity .4s' }}>{t(n.value)}</text>
              <text y={58} textAnchor="middle" className="tap-label fill-paper/50 font-mono uppercase tracking-[0.14em]">{t(n.label)}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className="case-note mx-auto mt-5 text-center">
        {t({ es: 'Quien vuelve · de su celular a la cita, sin volver a decidir nada', en: 'Returning client · from phone to booking, deciding nothing again' })}
      </figcaption>
    </figure>
  )
}
