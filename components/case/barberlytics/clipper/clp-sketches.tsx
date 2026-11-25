'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { Caption, Lead, useAutoSteps, useInView } from './clp-kit'

const FLOWS = CLIPPER_CASE.flows
const INK = '#2a2d33'
/** Pasos del dibujo: pregunta · flecha · Clipper y herramienta · flecha · respuesta · nota */
const DRAWN = 6
const DRAW_MS = 650
/** Cuánto se queda un boceto completo antes de pasar al siguiente (ms) */
const HOLD_MS = 3200

/** Una flecha a mano: horizontal en pantalla ancha, hacia abajo en el celular. */
function HandArrow({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 60 24" className="mx-auto h-6 w-12 shrink-0 rotate-90 md:rotate-0" aria-hidden="true">
      <path d="M3 13 C18 8 34 16 52 11 M44 5 L53 11 L45 18" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0 : 1} style={{ transition: 'stroke-dashoffset .5s ease-out' }} />
    </svg>
  )
}

const pop = (on: boolean) => `transition-all duration-500 ease-expo ${on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`

/** Un boceto: el flujo de una conversación dibujado a mano, paso a paso. */
function FlowSketch({ i, active }: { i: number; active: boolean }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const f = FLOWS[i]
  const [step, setStep] = useAutoSteps({ last: DRAWN, ms: () => DRAW_MS, run: active, reducedMotion })
  useEffect(() => {
    if (!active && !reducedMotion) setStep(0)
  }, [active, reducedMotion, setStep])

  return (
    <div
      className="relative overflow-hidden rounded-2xl px-5 pb-6 pt-6 font-hand text-[#2a2d33] shadow-[0_30px_70px_-35px_rgba(0,0,0,0.7)] md:px-10 md:pb-8"
      style={{ backgroundColor: '#f6f4ee', backgroundImage: 'radial-gradient(rgba(42,45,51,0.16) 1px, transparent 1.2px)', backgroundSize: '22px 22px' }}
    >
      <p className="flex items-baseline gap-3 text-[26px] font-bold leading-none md:text-[32px]">
        {t(f.name)}
        <span className="font-mono text-[11px] font-normal uppercase tracking-[0.12em] opacity-50">{t(f.who)}</span>
      </p>

      <div className="mt-6 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
        {/* Lo que pregunta la persona */}
        <div className={`md:w-[30%] ${pop(step >= 1)}`}>
          <div className="relative rounded-[18px] rounded-br-[4px] border-2 bg-white/70 px-4 py-3 text-[20px] leading-[1.1] md:text-[22px]" style={{ borderColor: INK }}>
            «{t(f.q)}»
          </div>
        </div>
        <HandArrow on={step >= 2} />
        {/* Clipper elige la herramienta */}
        <div className={`flex flex-col items-center gap-2 md:w-[18%] ${pop(step >= 3)}`}>
          <ClipperOrb size={44} state={active && step === 3 ? 'thinking' : 'idle'} />
          <span className="rounded-md border-2 border-dashed px-2 py-0.5 font-mono text-[11px]" style={{ borderColor: INK }}>{f.tool}</span>
        </div>
        <HandArrow on={step >= 4} />
        {/* La respuesta, en un celular dibujado */}
        <div className={`md:flex-1 ${pop(step >= 5)}`}>
          <div className="rounded-[18px] rounded-bl-[4px] border-2 px-4 py-3 text-[19px] leading-[1.15] md:text-[21px]" style={{ borderColor: INK, background: '#ffe7c7' }}>
            {t(f.a)}
            {'actions' in f && (
              <span className="mt-3 flex flex-wrap gap-2">
                {f.actions.map((a, k) => (
                  <span key={a.es} className="rounded-full border-2 px-3 py-0.5 text-[17px]" style={{ borderColor: INK, background: k === 0 ? '#ffd2a8' : 'transparent' }}>{t(a)}</span>
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* El post-it con lo que el boceto tenía que cumplir */}
      <div className={`ml-auto mt-6 w-fit rotate-[-2deg] bg-[#fff3a8] px-3 py-1.5 text-[18px] leading-none shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)] md:text-[20px] ${pop(step >= 6)}`}>
        {t(f.note)}
      </div>
    </div>
  )
}

/**
 * 04 · Bocetos: los flujos de conversación dibujados a mano, uno por
 * necesidad (métricas, agendar, clientes y ayuda), en un carrusel que pasa
 * solo hasta que alguien elige uno.
 */
export function ClipperSketches() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [index, setIndex] = useState(0)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (!inView || manual || reducedMotion) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % FLOWS.length), DRAWN * DRAW_MS + HOLD_MS)
    return () => window.clearTimeout(id)
  }, [inView, manual, reducedMotion, index])

  const go = (i: number) => {
    setIndex((i + FLOWS.length) % FLOWS.length)
    setManual(true)
  }

  return (
    <div ref={rootRef}>
      <Caption id={index} tag={`${t({ es: 'Boceto', en: 'Sketch' })} 0${index + 1} · ${t(FLOWS[index].name)}`} title={t({ es: 'Cada necesidad, su conversación: pregunta, herramienta y respuesta.', en: 'Each need, its conversation: question, tool and answer.' })} />
      <Lead>{t({ es: 'Antes de cualquier pantalla dibujé cómo debía ir cada conversación y qué podía decir Clipper.', en: 'Before any screen I drew how each conversation should go and what Clipper could say.' })}</Lead>

      <div role="tablist" aria-label={t({ es: 'Flujos', en: 'Flows' })} className="mt-8 flex flex-wrap justify-center gap-2">
        {FLOWS.map((f, i) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={index === i}
            onClick={() => go(i)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${index === i ? 'border-[#f0ce86] bg-[#f0ce86] text-[#16130f]' : 'border-white/20 text-paper/60 hover:border-white/50 hover:text-paper'}`}
          >
            {t(f.name)}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-6 max-w-[980px]">
        <div className="overflow-hidden rounded-2xl">
          <div className="flex transition-transform duration-700 ease-expo" style={{ transform: `translateX(-${index * 100}%)` }}>
            {FLOWS.map((f, i) => (
              <div key={f.id} className="w-full shrink-0 px-1" aria-hidden={index !== i} role="tabpanel">
                <FlowSketch i={i} active={inView && index === i} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(index - 1)} aria-label={t({ es: 'Boceto anterior', en: 'Previous sketch' })} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-paper/70 transition-colors hover:border-white/60 hover:text-paper">←</button>
          <span className="font-mono text-[11px] tabular-nums text-paper/50">{index + 1} / {FLOWS.length}</span>
          <button type="button" onClick={() => go(index + 1)} aria-label={t({ es: 'Boceto siguiente', en: 'Next sketch' })} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-paper/70 transition-colors hover:border-white/60 hover:text-paper">→</button>
          {/* Del control del carrusel baja la fibra hacia «Forma» */}
          <span data-fiber-from="clp-forma" className="h-px w-px" />
        </div>
      </div>
    </div>
  )
}
