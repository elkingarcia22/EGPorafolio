'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb, type ClipperOrbState } from '../clipper-orb'
import { AI, AiGradient, RED } from './clp-kit'
import { Spine, usePhone } from './clp-phone-kit'

const EXCHANGES = CLIPPER_CASE.exchanges
/** Cada intercambio: pregunta (viaja al orbe), consulta (viaja a la herramienta) y respuesta (se queda) — ms */
const BEATS = [1300, 1300, 3200] as const
const Y = 110
const R = 34
const X = { ask: 130, orb: 500, tool: 870 } as const
/** La fibra: ondula apenas entre quien pregunta, el orbe y la herramienta */
const FIBER_IN = `M${X.ask} ${Y} C 250 ${Y - 34}, 380 ${Y + 34}, ${X.orb} ${Y}`
const FIBER_OUT = `M${X.orb} ${Y} C 620 ${Y - 34}, 750 ${Y + 34}, ${X.tool} ${Y}`
const ORB_STATE: readonly ClipperOrbState[] = ['listening', 'thinking', 'idle']

interface HeroLineProps {
  running: boolean
  reducedMotion: boolean
}

/**
 * La portada de Clipper en una sola línea: alguien pregunta, la señal llega al
 * orbe, que consulta una herramienta de su rol, y la respuesta vuelve con sus
 * cifras. Recorre los cuatro intercambios reales de las pruebas del agente.
 */
/** El ritmo de la portada: pregunta → consulta → respuesta, y el siguiente intercambio */
function useHeroBeats(running: boolean, reducedMotion: boolean) {
  const [ex, setEx] = useState(0)
  const [beat, setBeat] = useState(reducedMotion ? 2 : 0)

  useEffect(() => {
    if (!running || reducedMotion) return
    const id = window.setTimeout(() => {
      if (beat < BEATS.length - 1) setBeat(beat + 1)
      else {
        setBeat(0)
        setEx((e) => (e + 1) % EXCHANGES.length)
      }
    }, BEATS[beat])
    return () => window.clearTimeout(id)
  }, [running, reducedMotion, beat])
  return { ex, beat }
}

/** En el teléfono la portada se elige a sí misma: la línea de escritorio o la columna */
export function HeroLine(props: HeroLineProps) {
  const phone = usePhone()
  return phone ? <HeroColumn {...props} /> : <HeroWide {...props} />
}

function HeroWide({ running, reducedMotion }: HeroLineProps) {
  const { t } = useLocale()
  const { ex, beat } = useHeroBeats(running, reducedMotion)

  const x = EXCHANGES[ex]
  const denied = x.tool === 'nomina'
  const answered = beat === 2
  const toolColor = denied ? RED : AI[2]

  const nodes = [
    { x: X.ask, name: t(x.role), role: t({ es: 'Pregunta', en: 'Asks' }), glyph: '?', lit: true, color: AI[0] },
    { x: X.tool, name: t(x.toolLabel), role: t({ es: 'Herramienta', en: 'Tool' }), glyph: denied ? '✕' : '✓', lit: beat >= 1, color: toolColor },
  ]

  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <div className="relative">
        <svg viewBox="0 0 1000 220" className="w-full overflow-visible" role="img" aria-label={t({ es: 'Una pregunta llega a Clipper, que consulta una herramienta y responde', en: 'A question reaches Clipper, which looks up a tool and answers' })}>
          <defs>
            <AiGradient id="clp-hero-fiber" />
          </defs>
          <path d={FIBER_IN} fill="none" stroke="url(#clp-hero-fiber)" strokeOpacity={0.45} strokeWidth={1.5} />
          <path d={FIBER_OUT} fill="none" stroke="url(#clp-hero-fiber)" strokeOpacity={0.45} strokeWidth={1.5} />
          {!reducedMotion && beat < 2 && (
            <path key={`${ex}-${beat}`} d={beat === 0 ? FIBER_IN : FIBER_OUT} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 0.92" className="clp-pulse" style={{ filter: 'drop-shadow(0 0 6px white)' }} />
          )}
          {nodes.map((n, i) => (
            <g key={i} transform={`translate(${n.x} ${Y})`}>
              <circle r={R + 18} fill={n.color} opacity={n.lit ? 0.1 : 0.03} style={{ transition: 'opacity .6s, fill .6s' }} />
              <circle r={R} fill="rgb(var(--void))" stroke={n.lit ? n.color : 'white'} strokeOpacity={n.lit ? 0.9 : 0.15} strokeWidth={2} style={{ transition: 'stroke .6s, stroke-opacity .6s' }} data-fiber-from={i === 1 ? 'clp-puntos' : undefined} />
              <text y={9} textAnchor="middle" className="clp-svg-glyph" fill={n.lit ? n.color : 'white'} fillOpacity={n.lit ? 1 : 0.3}>{n.glyph}</text>
              <text key={n.name} y={-R - 26} textAnchor="middle" className="clp-svg-name clp-value fill-paper">{n.name}</text>
              <text y={R + 32} textAnchor="middle" className="clp-svg-role fill-paper/50 font-mono uppercase tracking-[0.14em]">{n.role}</text>
            </g>
          ))}
          <text x={X.orb} y={Y + R + 32} textAnchor="middle" className="clp-svg-role fill-paper/50 font-mono uppercase tracking-[0.14em]">{t({ es: 'Consulta', en: 'Looks up' })}</text>
        </svg>
        {/* El orbe: escucha, piensa y responde, al ritmo de la señal */}
        <span className="pointer-events-none absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2" style={{ top: `${(Y / 220) * 100}%` }}>
          <span className="block scale-[0.6] sm:scale-100">
            <ClipperOrb size={92} state={reducedMotion ? 'idle' : ORB_STATE[beat]} />
          </span>
        </span>
      </div>
      <figcaption className="mx-auto mt-6 flex min-h-[4.5rem] max-w-[56ch] flex-col items-center text-center">
        <span key={`q${ex}`} className="clp-fade text-[15px] text-paper/85">«{t(x.q)}»</span>
        <span key={`a${ex}-${answered}`} className={`clp-fade mt-2 text-[13px] leading-snug ${answered ? (denied ? 'text-[#ff9aa0]' : 'text-paper/60') : 'text-transparent'}`}>
          {t(x.a)}
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * La portada en el teléfono: la misma conversación, de arriba abajo. Quien
 * pregunta, el orbe que consulta y la herramienta, unidos por la fibra; la
 * señal baja tramo a tramo y la respuesta aparece al final.
 */
function HeroColumn({ running, reducedMotion }: HeroLineProps) {
  const { t } = useLocale()
  const { ex, beat } = useHeroBeats(running, reducedMotion)
  const x = EXCHANGES[ex]
  const denied = x.tool === 'nomina'
  const answered = beat === 2
  const toolColor = denied ? RED : AI[2]
  const glyph = (text: string, color: string, lit: boolean) => (
    <span className="relative grid h-full w-full place-items-center">
      <span className="absolute h-11 w-11 rounded-full transition-opacity duration-500" style={{ background: color, opacity: lit ? 0.14 : 0.04 }} />
      <span className="relative grid h-9 w-9 place-items-center rounded-full border-2 bg-[rgb(var(--void))] text-[17px] transition-colors duration-500" style={{ borderColor: lit ? color : 'rgb(255 255 255 / 0.15)', color: lit ? color : 'rgb(255 255 255 / 0.3)' }}>
        {text}
      </span>
    </span>
  )

  return (
    <figure className="mx-auto w-full max-w-[420px]" aria-label={t({ es: 'Una pregunta llega a Clipper, que consulta una herramienta y responde', en: 'A question reaches Clipper, which looks up a tool and answers' })}>
      <Spine
        reducedMotion={reducedMotion}
        pulseAt={answered ? null : beat}
        gap="pb-7"
        items={[
          {
            id: 'ask',
            color: AI[0],
            lit: true,
            node: glyph('?', AI[0], true),
            children: (
              <span key={`q${ex}`} className="clp-fade block">
                <span className="mono-label block text-paper/50">{t(x.role)}</span>
                <span className="mt-1.5 block text-[16px] leading-snug text-paper/90">«{t(x.q)}»</span>
              </span>
            ),
          },
          {
            id: 'orb',
            color: AI[1],
            lit: beat >= 1 || answered,
            node: (
              <span className="grid h-full w-full place-items-center">
                <ClipperOrb size={48} state={reducedMotion ? 'idle' : ORB_STATE[beat]} />
              </span>
            ),
            children: (
              <span className="block pt-2">
                <span className="mono-label block text-paper/50">Clipper</span>
                <span className="mt-1 block text-[14px] text-paper/70">{t({ es: 'Consulta, no adivina', en: 'Looks it up, never guesses' })}</span>
              </span>
            ),
          },
          {
            id: 'tool',
            color: toolColor,
            lit: beat >= 1,
            node: glyph(denied ? '✕' : '✓', toolColor, beat >= 1),
            children: (
              <span className="block pt-1.5">
                <span key={`t${ex}`} className="clp-fade block text-[15px] text-paper/85">{t(x.toolLabel)}</span>
                <span className="mt-0.5 block font-mono text-[12px] text-paper/60">{x.tool}</span>
              </span>
            ),
          },
        ]}
      />
      <figcaption className="relative mt-6 min-h-[5.5rem] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
        <span key={`a${ex}-${answered}`} className={`clp-fade block text-[15px] leading-snug ${answered ? (denied ? 'text-[#ff9aa0]' : 'text-paper/80') : 'text-paper/30'}`}>
          {answered ? t(x.a) : t({ es: 'Consultando…', en: 'Looking it up…' })}
        </span>
        {/* Bajo la respuesta sale la fibra hacia «Los puntos», en la línea de los nodos */}
        <span data-fiber-from="clp-puntos" className="absolute left-6 top-full h-px w-px" />
      </figcaption>
    </figure>
  )
}
