'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { SPLIT } from '@/lib/content/cases/sellup/sellup-agents'
import { RumboMark } from './platform'
import { useSwipe } from '@/components/case/kit/use-swipe'

/** Cada cuánto aparece la rama siguiente (ms) */
const BEAT_MS = 900
/** Ya aprobado, cuánto se queda antes de pasar al agente siguiente (ms) */
const HOLD_MS = 2600
/** Si la persona elige un agente, se queda esto antes de seguir (ms) */
const RESUME_MS = 9000

/** Una rama: el texto y el tramo que la une a la columna, con la señal que viaja por él al aparecer */
function Branch({ text, side, shown, stamp }: { text: L; side: 'left' | 'right'; shown: boolean; stamp?: boolean }) {
  const { t } = useLocale()
  const left = side === 'left'
  return (
    <li className={`flex items-center gap-3 transition-all duration-700 ease-expo ${left ? 'flex-row-reverse text-right' : 'text-left'} ${shown ? 'translate-x-0 opacity-100' : left ? 'translate-x-4 opacity-0' : '-translate-x-4 opacity-0'}`}>
      <span aria-hidden="true" className={`relative h-px w-[clamp(1.2rem,5vw,3.5rem)] shrink-0 overflow-visible ${left ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-signal/80 to-white/10`}>
        {/* La señal sale de la columna hacia la rama */}
        {shown && <span className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white] ${left ? 'su-shoot-left right-0' : 'su-shoot-right left-0'}`} />}
      </span>
      <span className={`relative rounded-full border px-3.5 py-1.5 text-balance text-[13px] leading-snug md:text-[14px] ${left ? 'border-[#a78bfa]/40 bg-[#7e2be0]/10 text-paper/90' : 'border-[#34d399]/40 bg-[#34d399]/10 text-paper/90'}`}>
        {stamp && shown && <span className="su-stamp mr-1.5 inline-block text-[#34d399]">✓</span>}
        {t(text)}
      </span>
    </li>
  )
}

/**
 * 05 · IA: Rumbo arriba, con su halo girando, y una columna que baja de él.
 * Por cada agente, primero se disparan a la izquierda las propuestas del
 * modelo; después, a la derecha, las reglas sin IA las sellan; al pie, la
 * persona aprueba y la columna se enciende. De ella sale la fibra a «Impacto».
 */
export function SellUpAi() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  const [beat, setBeat] = useState(0)
  const [heldUntil, setHeldUntil] = useState(0)

  const split = SPLIT[active]
  const m = split.model.length
  const r = split.rules.length
  /** Último tiempo: la persona aprueba */
  const last = m + r
  const shownBeat = reducedMotion ? last : beat
  const approved = shownBeat >= last
  const thinking = inView && !reducedMotion && !approved

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    if (beat < last) {
      const id = window.setTimeout(() => setBeat((b) => b + 1), BEAT_MS)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => {
      setBeat(0)
      setActive((a) => (a + 1) % SPLIT.length)
    }, Math.max(HOLD_MS, heldUntil - Date.now()))
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, beat, last, heldUntil])

  const pick = (i: number) => {
    setActive(i)
    setBeat(0)
    setHeldUntil(Date.now() + RESUME_MS)
  }
  // En el teléfono también se pasa deslizando el dedo de lado.
  useSwipe(rootRef, {
    onNext: () => pick((active + 1) % SPLIT.length),
    onPrev: () => pick((active - 1 + SPLIT.length) % SPLIT.length),
  })

  return (
    <div ref={rootRef}>
      <CaseLead className="mb-12">{t({ es: 'Rumbo es la misma IA detrás de los tres agentes. El modelo propone, las reglas verifican y la persona decide.', en: 'Rumbo is the same AI behind all three agents. The model proposes, rules verify and the person decides.' })}</CaseLead>

      <div className="mx-auto flex max-w-[900px] flex-col items-center">
        {/* Rumbo: halo de colores que gira y anillos que se abren mientras piensa */}
        <div className="relative grid h-[150px] w-[150px] place-items-center">
          <span aria-hidden="true" className="su-halo absolute inset-0 rounded-full opacity-70 blur-2xl" style={{ background: 'conic-gradient(from 0deg,#285ee6,#7e2be0,#d22d6a,#eb6233,#285ee6)', animationPlayState: inView && !reducedMotion ? 'running' : 'paused' }} />
          {thinking && (
            <>
              <span aria-hidden="true" className="absolute inset-[30px] rounded-full border border-white/40 animate-[nav-node-ping_1.8s_cubic-bezier(0,0,.2,1)_infinite]" />
              <span aria-hidden="true" className="absolute inset-[30px] rounded-full border border-[#d22d6a]/50 animate-[nav-node-ping_1.8s_cubic-bezier(0,0,.2,1)_0.9s_infinite]" />
            </>
          )}
          <RumboMark size={84} motion={thinking ? 'thinking' : 'breathing'} />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">Rumbo · {thinking ? t({ es: 'pensando', en: 'thinking' }) : t({ es: 'listo', en: 'done' })}</p>

        {/* Los tres agentes */}
        <div className="mt-4 flex flex-wrap justify-center gap-2" role="tablist" aria-label={t({ es: 'Agentes', en: 'Agents' })}>
          {SPLIT.map((s, i) => (
            <button
              key={s.agent.es}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className={`rounded-full border px-3 py-1 text-[12px] transition-colors duration-500 ${i === active ? 'border-white/60 bg-white text-[#0b0d16]' : 'border-white/15 text-paper/60 hover:text-paper'}`}
            >
              {t(s.agent)}
            </button>
          ))}
        </div>

        {/* La columna: la fibra baja por el centro y de ella salen las ramas */}
        <div key={active} className="relative mt-8 grid w-full grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)]">
          <span aria-hidden="true" className="relative col-start-2 row-span-2 row-start-1 overflow-hidden bg-gradient-to-b from-[#7e2be0] via-signal/60 to-signal/30">
            {!reducedMotion && <span className="su-drip absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-white to-transparent" />}
            <span className="absolute inset-x-0 bottom-0 bg-signal transition-[height] duration-700 ease-out" style={{ height: approved ? '100%' : '0%', boxShadow: '0 0 12px rgb(var(--signal))' }} />
          </span>
          <p className="col-start-1 row-start-1 pb-5 pr-[clamp(1.2rem,5vw,3.5rem)] text-right font-mono text-[10px] uppercase tracking-[0.16em] text-[#c4b5fd]">{t({ es: 'El modelo propone', en: 'The model proposes' })}</p>
          <p className="col-start-3 row-start-1 pb-5 pl-[clamp(1.2rem,5vw,3.5rem)] font-mono text-[10px] uppercase tracking-[0.16em] text-[#6ee7b7]">{t({ es: 'Las reglas verifican', en: 'Rules verify' })}</p>
          <ul className="col-start-1 row-start-2 space-y-4 pb-10">
            {split.model.map((item, i) => <Branch key={item.es} text={item} side="left" shown={shownBeat > i} />)}
          </ul>
          <ul className="col-start-3 row-start-2 space-y-4 pb-10">
            {split.rules.map((item, i) => <Branch key={item.es} text={item} side="right" shown={shownBeat > m + i} stamp />)}
          </ul>
        </div>

        {/* Al pie, la persona: aprueba cuando las reglas terminan. De aquí sale la fibra a «Impacto» */}
        <span aria-hidden="true" className="relative grid h-5 w-5 place-items-center">
          {approved && <span className="absolute inset-[-12px] rounded-full border-2 border-[#34d399]/70 animate-[nav-node-ping_1.6s_cubic-bezier(0,0,.2,1)_infinite]" />}
          <span className={`grid h-full w-full place-items-center rounded-full border text-[11px] font-bold transition-all duration-500 ${approved ? 'scale-125 border-white bg-[#34d399] text-[#06281c] shadow-[0_0_24px_6px_rgb(52_211_153/0.55)]' : 'border-white/50 bg-void text-transparent'}`}>✓</span>
          <span data-fiber-from="su-impacto" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
        <p className={`mt-4 text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] font-light transition-opacity duration-500 ${approved ? 'opacity-100' : 'opacity-50'}`}>{approved ? t({ es: 'La persona aprueba', en: 'The person approves' }) : t({ es: 'La persona decide', en: 'The person decides' })}</p>
      </div>
    </div>
  )
}
