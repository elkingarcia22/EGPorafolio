'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { inkOn, shade } from './color-utils'

/** Cada cuánto entra el color del siguiente tema (ms) */
const THEME_MS = 3200
/** Cuándo le llega la señal a los tokens y al tema, desde que entra el color (ms) */
const ARRIVE_MS = { tokens: 550, theme: 1100 } as const

const THEMES = THEMA_CASE.themes
const Y = 110
const X = [130, 500, 870] as const
/** La fibra: una sola cinta que ondula entre los tres nodos */
const FIBER = `M${X[0]} ${Y} C 250 ${Y + 40}, 380 ${Y - 40}, ${X[1]} ${Y} S 750 ${Y + 40}, ${X[2]} ${Y}`
/** La escala que el sistema deriva del primario: de claro (50) a oscuro (800) */
const RAMP = [0.86, 0.7, 0.5, 0.3, 0.14, 0, -0.25, -0.45, -0.65] as const
/** Los nueve pasos se abren en abanico alrededor del nodo del medio */
const FAN_R = 46

const LABELS: readonly { top: L; bottom: (i: number) => L }[] = [
  { top: { es: 'Entra un color', en: 'One color in' }, bottom: (i) => ({ es: THEMES[i].primary, en: THEMES[i].primary }) },
  { top: { es: 'Se derivan los tokens', en: 'Tokens are derived' }, bottom: () => ({ es: 'escala 50 → 800', en: '50 → 800 scale' }) },
  { top: { es: 'Sale un tema', en: 'A theme out' }, bottom: (i) => ({ es: THEMES[i].name, en: THEMES[i].name }) },
]

interface HeroRibbonProps {
  /** Corre solo mientras la portada está a la vista */
  running: boolean
  reducedMotion: boolean
}

/**
 * La portada de Thema en una sola cinta horizontal: entra el color primario de
 * un tema real, la señal viaja por la fibra, el sistema deriva su escala y al
 * final sale el tema armado (botón y gradiente de la IA). Y vuelve a empezar
 * con el siguiente tema.
 */
export function HeroRibbon({ running, reducedMotion }: HeroRibbonProps) {
  const { t } = useLocale()
  const [step, setStep] = useState(0)
  /** Qué tema muestra cada nodo: el color cambia al instante; tokens y tema, cuando les llega la señal */
  const [shown, setShown] = useState<[number, number, number]>([0, 0, 0])
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (!running || reducedMotion) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % THEMES.length), THEME_MS)
    return () => window.clearInterval(id)
  }, [running, reducedMotion])

  useEffect(() => {
    timers.current.forEach(window.clearTimeout)
    setShown((prev) => [step, prev[1], prev[2]])
    timers.current = [
      window.setTimeout(() => setShown((prev) => [prev[0], step, prev[2]]), reducedMotion ? 0 : ARRIVE_MS.tokens),
      window.setTimeout(() => setShown((prev) => [prev[0], prev[1], step]), reducedMotion ? 0 : ARRIVE_MS.theme),
    ]
    return () => timers.current.forEach(window.clearTimeout)
  }, [step, reducedMotion])

  const input = THEMES[shown[0]]
  const tokens = THEMES[shown[1]]
  const out = THEMES[shown[2]]

  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <svg viewBox="0 0 1000 230" className="w-full overflow-visible" role="img" aria-label={t({ es: 'Un color primario entra, el sistema deriva sus tokens y sale un tema completo', en: 'A primary color goes in, the system derives its tokens and a full theme comes out' })}>
        <defs>
          <linearGradient id="thema-ribbon" x1="0" x2="1">
            <stop offset="0" stopColor={input.primary} style={{ transition: 'stop-color 700ms' }} />
            <stop offset="1" stopColor={out.aiEnd} style={{ transition: 'stop-color 700ms' }} />
          </linearGradient>
        </defs>

        <path d={FIBER} fill="none" stroke="url(#thema-ribbon)" strokeOpacity={0.5} strokeWidth={1.5} />
        {!reducedMotion && (
          <path key={step} d={FIBER} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} className="th-pulse" style={{ filter: `drop-shadow(0 0 6px ${input.primary})` }} />
        )}

        {/* 1 · El color que entra */}
        <g transform={`translate(${X[0]} ${Y})`}>
          <circle r={58} fill={input.primary} fillOpacity={0.12} style={{ transition: 'fill 700ms' }} />
          <circle r={34} fill={input.primary} stroke="white" strokeOpacity={0.3} strokeWidth={2} style={{ transition: 'fill 700ms' }} />
        </g>

        {/* 2 · La escala que el sistema deriva, en abanico */}
        <g transform={`translate(${X[1]} ${Y})`}>
          <circle r={58} fill={tokens.primary} fillOpacity={0.08} style={{ transition: 'fill 700ms' }} />
          {RAMP.map((k, i) => {
            const angle = Math.PI * (1 - i / (RAMP.length - 1))
            const x = Math.round(Math.cos(angle) * FAN_R * 100) / 100
            const y = Math.round(-Math.sin(angle) * FAN_R * 0.55 * 100) / 100
            return (
              <rect
                key={i}
                x={x - 8}
                y={y - 8}
                width={16}
                height={16}
                rx={4}
                fill={k === 0 ? tokens.primary : shade(tokens.primary, k)}
                stroke="white"
                strokeOpacity={k === 0 ? 0.8 : 0.12}
                style={{ transition: `fill 600ms ${i * 45}ms` }}
              />
            )
          })}
          <circle r={7} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.5} />
        </g>

        {/* 3 · El tema que sale: su botón y el gradiente de la IA */}
        <g transform={`translate(${X[2]} ${Y})`}>
          <circle r={58} fill={out.aiEnd} fillOpacity={0.1} style={{ transition: 'fill 700ms' }} />
          <rect x={-52} y={-19} width={104} height={38} rx={12} fill={out.primary} style={{ transition: 'fill 700ms' }} data-fiber-from="th-puntos" />
          <text y={6} textAnchor="middle" className="ribbon-button font-medium" fill={inkOn(out.primary)}>{t({ es: 'Reservar', en: 'Book' })}</text>
          <rect x={-52} y={28} width={104} height={4} rx={2} fill={`url(#thema-ai-${out.id})`} />
          <defs>
            <linearGradient id={`thema-ai-${out.id}`} x1="0" x2="1">
              <stop offset="0" stopColor={out.primary} />
              <stop offset="1" stopColor={out.aiEnd} />
            </linearGradient>
          </defs>
        </g>

        {LABELS.map((label, i) => (
          <g key={i} transform={`translate(${X[i]} ${Y})`}>
            <text y={-82} textAnchor="middle" className="ribbon-name fill-paper">{t(label.top)}</text>
            <text y={92} textAnchor="middle" className="ribbon-role fill-paper/50 font-mono uppercase tracking-[0.14em]">{t(label.bottom(shown[i]))}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-4 text-center font-mono text-[11px] text-white/45">
        {t({ es: 'Los seis temas reales de Thema · el gradiente de la IA también se deriva', en: 'Thema’s six real themes · the AI gradient is derived too' })}
      </figcaption>
    </figure>
  )
}
