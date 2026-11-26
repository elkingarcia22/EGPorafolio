'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { useNarrow, usePhone } from './camera'
import { HeroChainPhone } from './hero-chain-phone'

/** Cada cuánto avanza la señal un tramo (ms) */
const STEP_MS = 1100
/** Pasos: 0 agente 1 · 1 persona · 2 agente 2 · 3 persona · 4 agente 3 · 5 listo · 6 pausa con todo encendido */
const STEPS = 7

interface AgentNode {
  x: number
  q: L
  agent: L
  out: L
}

export const AGENTS: readonly AgentNode[] = [
  { x: 120, q: { es: '¿A qué empresa?', en: 'Which company?' }, agent: { es: 'Agente 1', en: 'Agent 1' }, out: { es: 'Verificada y libre', en: 'Verified, unowned' } },
  { x: 500, q: { es: '¿A quién?', en: 'Who?' }, agent: { es: 'Agente 2', en: 'Agent 2' }, out: { es: 'La persona que decide', en: 'The decision-maker' } },
  { x: 880, q: { es: '¿Qué le digo?', en: 'What do I say?' }, agent: { es: 'Agente 3', en: 'Agent 3' }, out: { es: 'Mensaje con citas', en: 'Cited message' } },
]
type Pt = { x: number; y: number }

/** Cómo se dibuja la rama: horizontal en pantallas anchas, vertical en teléfono (letra a tamaño real) */
interface Layout {
  w: number
  h: number
  r: number
  agents: readonly Pt[]
  /** Entre un agente y el siguiente, una persona aprueba */
  gates: readonly Pt[]
  fiber: string
  vertical: boolean
}

const WIDE: Layout = {
  w: 1000,
  h: 240,
  r: 36,
  agents: AGENTS.map((a) => ({ x: a.x, y: 120 })),
  gates: [{ x: 310, y: 128 }, { x: 690, y: 112 }],
  fiber: 'M120 120 C 240 86, 380 154, 500 120 S 760 86, 880 120',
  vertical: false,
}
const TALL: Layout = {
  w: 330,
  h: 420,
  r: 26,
  agents: [{ x: 44, y: 40 }, { x: 44, y: 205 }, { x: 44, y: 370 }],
  gates: [{ x: 52, y: 122 }, { x: 36, y: 288 }],
  fiber: 'M44 40 C 74 100, 14 150, 44 205 S 74 320, 44 370',
  vertical: true,
}

interface HeroChainProps {
  running: boolean
  reducedMotion: boolean
}

/**
 * La portada de SellUp en una sola rama: tres agentes y, entre uno y otro,
 * una persona que aprueba. La señal sale del primero, espera la aprobación,
 * sigue al segundo y llega al tercero. Así se lee el producto entero.
 */
export function HeroChain({ running, reducedMotion }: HeroChainProps) {
  const { t } = useLocale()
  const [step, setStep] = useState(reducedMotion ? STEPS - 1 : 0)
  const phone = usePhone()
  const L_ = useNarrow() ? TALL : WIDE
  const v = L_.vertical
  const R = L_.r

  useEffect(() => {
    if (!running || reducedMotion) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS), STEP_MS)
    return () => window.clearInterval(id)
  }, [running, reducedMotion])

  const agentLit = (i: number) => step >= i * 2
  const gateOk = (i: number) => step >= i * 2 + 1
  /** La señal viaja mientras la persona aprueba y sigue hacia el agente siguiente */
  const travelling = !reducedMotion && (step === 1 || step === 3)
  /** Textos: en el dibujo ancho van arriba y abajo del nodo; en el vertical, a su derecha */
  const side = v ? { x: R + 22, anchor: 'start' as const } : { x: 0, anchor: 'middle' as const }

  // En teléfono la rama tiene su propia composición, de pie y con texto HTML
  if (phone) return <HeroChainPhone step={step} travelling={travelling} />

  return (
    <figure className="mx-auto w-full" style={{ maxWidth: v ? 330 : 980 }}>
      <svg viewBox={`0 0 ${L_.w} ${L_.h}`} className="w-full overflow-visible" role="img" aria-label={t({ es: 'Tres agentes en cadena: empresa, persona que decide y primer contacto; una persona aprueba entre cada uno', en: 'Three chained agents: company, decision-maker and first contact; a person approves between each' })}>
        <defs>
          <linearGradient id="su-chain" x1="0" x2={v ? 0 : 1} y1="0" y2={v ? 1 : 0}>
            <stop offset="0" stopColor="#285ee6" />
            <stop offset="0.4" stopColor="#7e2be0" />
            <stop offset="0.72" stopColor="#d22d6a" />
            <stop offset="1" stopColor="#eb6233" />
          </linearGradient>
        </defs>

        <path d={L_.fiber} fill="none" stroke="url(#su-chain)" strokeOpacity={0.45} strokeWidth={1.5} />
        {travelling && (
          <path key={step} d={L_.fiber} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 0.92" className="su-pulse" style={{ filter: 'drop-shadow(0 0 6px rgb(var(--signal)))', animationDuration: `${STEP_MS * 2}ms`, animationDelay: step === 3 ? `-${STEP_MS}ms` : '0ms' }} />
        )}

        {/* La persona entre agentes: un nodo chico que se aprueba */}
        {L_.gates.map((g, i) => {
          const ok = gateOk(i)
          return (
            <g key={i} transform={`translate(${g.x} ${g.y})`}>
              {ok && step === i * 2 + 1 && <circle r={9} fill="none" stroke="#34d399" strokeWidth={1.5} className="su-ping" />}
              <circle r={9} fill={ok ? '#34d399' : 'rgb(var(--void))'} stroke={ok ? 'white' : 'rgb(255 255 255 / 0.4)'} strokeWidth={1.3} style={{ transition: 'fill .5s, stroke .5s' }} />
              <path d="M-3.6 0.2 L-1 2.8 L3.8 -2.4" fill="none" stroke="#06281c" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: ok ? 1 : 0, transition: 'opacity .4s' }} />
              <text x={v ? 22 : 0} y={v ? 4 : i === 0 ? 32 : -24} textAnchor={v ? 'start' : 'middle'} className={`fill-paper font-mono uppercase tracking-[0.14em] ${v ? '' : 'su-t-sm'}`} fontSize={v ? 10 : undefined} style={{ opacity: ok ? 0.75 : 0.35, transition: 'opacity .5s' }}>
                {ok ? `✓ ${t({ es: 'Persona aprueba', en: 'Person approves' })}` : t({ es: 'Persona', en: 'Person' })}
              </text>
            </g>
          )
        })}

        {AGENTS.map((n, i) => {
          const p = L_.agents[i]
          const lit = agentLit(i)
          const done = i < 2 ? gateOk(i) : step >= 5
          return (
            <g key={n.x} transform={`translate(${p.x} ${p.y})`}>
              <circle r={R + (v ? 12 : 18)} fill="rgb(var(--signal) / 0.08)" style={{ opacity: lit ? 1 : 0.3, transition: 'opacity .6s' }} />
              <circle r={R} fill="rgb(var(--void))" stroke="white" strokeOpacity={0.14} strokeWidth={3} data-fiber-from={i === AGENTS.length - 1 ? 'su-puntos' : undefined} />
              <circle r={R} fill="none" stroke="url(#su-chain)" strokeWidth={3} style={{ opacity: lit ? 1 : 0, transition: 'opacity .6s' }} />
              <text y={v ? 6 : 9} textAnchor="middle" className={`fill-paper font-light tabular-nums ${v ? '' : 'su-t-lg'}`} fontSize={v ? 16 : undefined} style={{ opacity: lit ? 1 : 0.4, transition: 'opacity .6s' }}>{String(i + 1).padStart(2, '0')}</text>
              <text x={side.x} y={v ? -2 : -R - 26} textAnchor={side.anchor} className={`fill-paper ${v ? '' : 'su-t-md'}`} fontSize={v ? 19 : undefined} style={{ opacity: lit ? 1 : 0.45, transition: 'opacity .6s' }}>{t(n.q)}</text>
              <text x={side.x} y={v ? 20 : R + 32} textAnchor={side.anchor} className={`fill-paper font-mono uppercase tracking-[0.14em] ${v ? '' : 'su-t-sm'}`} fontSize={v ? 10 : undefined} style={{ opacity: 0.5 }}>{done ? `✓ ${t(n.out)}` : t(n.agent)}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-4 text-center font-mono text-[11px] text-white/45">
        {t({ es: 'Nada pasa al siguiente agente sin que una persona lo apruebe', en: 'Nothing moves to the next agent until a person approves it' })}
      </figcaption>
    </figure>
  )
}
