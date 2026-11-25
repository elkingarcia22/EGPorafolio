'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { CaseLead } from '@/components/case/case-lead'
import { SPLIT } from '@/lib/content/cases/sellup/sellup-agents'
import { RumboMark } from './platform'

/** Cada cuánto pasa al agente siguiente (ms) */
const STEP_MS = 4600
/** Si la persona elige un agente, se queda esto antes de seguir (ms) */
const RESUME_MS = 9000
/** Entre una rama y la siguiente, al llegar un agente (ms) */
const STAGGER_MS = 160

/** Una rama de un lado de la columna: el texto y el tramo que la une al centro */
function Branch({ text, side, delay }: { text: L; side: 'left' | 'right'; delay: number }) {
  const { t } = useLocale()
  const left = side === 'left'
  return (
    <li className={`su-fade flex items-center gap-3 ${left ? 'flex-row-reverse text-right' : 'text-left'}`} style={{ animationDelay: `${delay}ms` }}>
      {/* El tramo llega hasta el borde de la columna, donde está la fibra central */}
      <span aria-hidden="true" className={`relative h-px w-[clamp(1rem,4vw,3rem)] shrink-0 ${left ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-signal/80 to-white/10`}>
        <span className={`absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${left ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} ${left ? 'bg-[#a78bfa]' : 'bg-[#34d399]'}`} />
      </span>
      <span className="text-balance text-[13px] leading-snug text-paper/80 md:text-[15px]">{t(text)}</span>
    </li>
  )
}

/**
 * 05 · IA: Rumbo arriba y, bajando de él, una sola columna. A la izquierda
 * se abren las ramas de lo que hace el modelo; a la derecha, lo que verifican
 * las reglas sin IA. Al pie, la persona que decide: de ella sale la fibra a
 * «Impacto». Pasa sola por los tres agentes; tocar un punto elige uno.
 */
export function SellUpAi() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setTimeout(() => {
      setPicked(false)
      setActive((a) => (a + 1) % SPLIT.length)
    }, picked ? RESUME_MS : STEP_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, active, picked])

  const split = SPLIT[active]

  return (
    <div ref={rootRef}>
      <CaseLead className="mb-12">{t({ es: 'Rumbo es la misma IA detrás de los tres agentes. El modelo propone, las reglas verifican y la persona decide.', en: 'Rumbo is the same AI behind all three agents. The model proposes, rules verify and the person decides.' })}</CaseLead>

      <div className="mx-auto flex max-w-[880px] flex-col items-center">
        <RumboMark size={64} motion={inView && !reducedMotion ? 'breathing' : 'still'} glow />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">Rumbo</p>
        {/* Los tres agentes: tocar uno lo elige */}
        <div className="mt-3 flex items-center gap-3" role="tablist" aria-label={t({ es: 'Agentes', en: 'Agents' })}>
          {SPLIT.map((s, i) => (
            <button
              key={s.agent.es}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={t(s.agent)}
              onClick={() => {
                setActive(i)
                setPicked(true)
              }}
              className="grid h-6 w-6 place-items-center outline-none"
            >
              <span className={`block rounded-full transition-all duration-500 ${i === active ? 'h-2.5 w-2.5 bg-white shadow-[0_0_10px_white]' : 'h-1.5 w-1.5 bg-white/35 hover:bg-white/70'}`} />
            </button>
          ))}
        </div>
        <p key={`agent-${active}`} className="su-fade mt-1 text-sm">{t(split.agent)}</p>

        {/* La columna: la fibra baja por el centro y de ella salen las ramas */}
        <div className="relative mt-6 grid w-full grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)] gap-x-0">
          <span aria-hidden="true" className="relative col-start-2 row-span-2 row-start-1 overflow-hidden bg-gradient-to-b from-[#7e2be0] via-signal/60 to-signal/30">
            {!reducedMotion && <span className="su-drip absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-white to-transparent" />}
          </span>
          <p className="col-start-1 row-start-1 pb-5 pr-[clamp(1rem,4vw,3rem)] text-right font-mono text-[10px] uppercase tracking-[0.16em] text-[#c4b5fd]">{t({ es: 'El modelo propone', en: 'The model proposes' })}</p>
          <p className="col-start-3 row-start-1 pb-5 pl-[clamp(1rem,4vw,3rem)] font-mono text-[10px] uppercase tracking-[0.16em] text-[#6ee7b7]">{t({ es: 'Las reglas verifican', en: 'Rules verify' })}</p>
          <ul key={`m-${active}`} className="col-start-1 row-start-2 space-y-5 pb-10">
            {split.model.map((m, i) => <Branch key={m.es} text={m} side="left" delay={i * STAGGER_MS} />)}
          </ul>
          <ul key={`r-${active}`} className="col-start-3 row-start-2 space-y-5 pb-10">
            {split.rules.map((r, i) => <Branch key={r.es} text={r} side="right" delay={(i + split.model.length) * STAGGER_MS} />)}
          </ul>
        </div>

        {/* Al pie de la columna, la persona: de aquí sale la fibra a «Impacto» */}
        <span aria-hidden="true" className="relative grid h-4 w-4 place-items-center">
          <span className="absolute inset-[-8px] rounded-full border border-signal/60 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />
          <span className="h-full w-full rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]" />
          <span data-fiber-from="su-impacto" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
        <p className="mt-4 text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] font-light">{t({ es: 'La persona decide', en: 'The person decides' })}</p>
      </div>
    </div>
  )
}
