'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { BUILDER, ORB, REQUEST, SECTIONS } from '@/lib/content/cases/encuestas/orbit-real'
import { useAutoplay } from '../objetivos/use-autoplay'

/** Pasos: 0 pide · 1 elige cómo responder · 2 elige el tamaño · 3 arma · 4 listo */
const STEPS = 5
const STEP_MS = 2300
/** Las respuestas elegidas en la captura real */
const STYLE = BUILDER.styleChips[0].split(' — ')[0]
const SIZE = BUILDER.sizeChips[0].split(' — ')[0]
const PER_SUB = 4

/** Cómo se hizo el caso con IA: lo que dejó el proceso, en tres cifras */
const PROCESS: readonly { value: string; label: L }[] = [
  { value: '2', label: { es: 'guías escritas con Claude', en: 'guides written with Claude' } },
  { value: '11', label: { es: 'defectos confirmados', en: 'confirmed defects' } },
  { value: '3', label: { es: 'herramientas MCP sobre el sistema de diseño', en: 'MCP tools over the design system' } },
]

function Bubble({ show, side, children }: { show: boolean; side: 'me' | 'orbit'; children: React.ReactNode }) {
  return (
    <p
      className={`max-w-[34ch] rounded-2xl px-4 py-2.5 text-[13px] leading-snug transition-all duration-500 ease-expo md:text-sm ${side === 'me' ? 'self-end rounded-br-md bg-white/[0.08] text-paper' : 'self-start rounded-bl-md border border-white/10 text-paper/75'}`}
      style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(8px)' }}
    >
      {children}
    </p>
  )
}

/**
 * 06 · IA en el proceso: la conversación real con Orbit, repetida con sus
 * textos. Se pide, el agente pregunta lo que falta y la encuesta crece a la
 * derecha. Avanza sola al verse; tocar un paso lo muestra.
 */
export function EncOrbitChain() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const { index, go } = useAutoplay(rootRef, { count: STEPS, ms: STEP_MS, loop: true, disabled: reducedMotion })
  const step = reducedMotion ? STEPS - 1 : index
  const thinking = step === 3

  return (
    <div ref={rootRef} className="relative mt-6">
      <div className="mx-auto grid max-w-[1040px] items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
        {/* La conversación */}
        <div className="flex min-h-[15rem] flex-col justify-center gap-2.5" aria-live="polite">
          <Bubble show side="me">{REQUEST}</Bubble>
          <Bubble show={step >= 1} side="orbit">{BUILDER.styleQuestion} <span className="ml-1 rounded-full bg-signal/20 px-2 py-0.5 text-paper">{STYLE}</span></Bubble>
          <Bubble show={step >= 2} side="orbit">{BUILDER.sizeQuestion} <span className="ml-1 rounded-full bg-signal/20 px-2 py-0.5 text-paper">{SIZE}</span></Bubble>
          <Bubble show={step >= 4} side="orbit">{BUILDER.done.split('. ')[1]}.</Bubble>
        </div>

        {/* El orbe: respira; mientras arma, late más rápido */}
        <div className="relative mx-auto grid h-36 w-36 place-items-center md:h-44 md:w-44">
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(var(--signal)/0.35),transparent_70%)]" aria-hidden="true" />
          <Image src={ORB} alt={t({ es: 'Orbit, el agente de UBITS', en: 'Orbit, UBITS’s agent' })} width={176} height={176} className="relative h-full w-full rounded-full object-cover" style={{ animation: reducedMotion ? 'none' : `${thinking ? 'orb-think 1.2s' : 'orb-breathe 4s'} ease-in-out infinite` }} />
          {/* Del centro del orbe baja la fibra hacia «Impacto» */}
          <span data-fiber-from="enc-impacto" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />
          <span className="absolute -bottom-8 whitespace-nowrap font-mono text-[11px] md:text-[10px] uppercase tracking-[0.14em] text-paper/50">{thinking ? BUILDER.reasoned : 'Orbit'}</span>
        </div>

        {/* La encuesta que crece */}
        <div className="flex min-h-[15rem] flex-col justify-center gap-4">
          {SECTIONS.map((s, si) => (
            <div key={s.n} className="transition-all duration-500 ease-expo" style={{ opacity: step >= 3 ? 1 : 0.15, transform: step >= 3 ? 'none' : 'translateX(-8px)', transitionDelay: `${si * 250}ms` }}>
              <p className="text-[15px]"><span className="mr-2 font-mono text-[11px] text-signal">{s.n}</span>{s.title}</p>
              <ul className="mt-1.5 space-y-1.5 border-l border-white/12 pl-4">
                {s.subs.map((sub, k) => (
                  <li key={sub.n} className="flex items-center gap-3 text-[13px] text-paper/70">
                    <span className="w-8 font-mono text-[11px] md:text-[10px] opacity-60">{sub.n}</span>
                    <span className="min-w-0 flex-1 truncate">{sub.title}</span>
                    <span className="flex gap-1" aria-label={`${PER_SUB} ${t({ es: 'preguntas', en: 'questions' })}`}>
                      {Array.from({ length: PER_SUB }, (_, q) => (
                        <span key={q} className="h-1.5 w-1.5 rounded-full bg-signal transition-opacity duration-300" style={{ opacity: step >= 3 ? 1 : 0.2, transitionDelay: `${si * 250 + k * 120 + q * 60 + 200}ms` }} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="font-mono text-[11px] md:text-[10px] uppercase tracking-[0.14em] text-paper/45 transition-opacity duration-500" style={{ opacity: step >= 4 ? 1 : 0 }}>
            {t({ es: 'Editable desde el primer segundo', en: 'Editable from the first second' })}
          </p>
        </div>
      </div>

      {/* Los pasos, para volver a uno */}
      <div className="mt-10 flex justify-center gap-2">
        {Array.from({ length: STEPS }, (_, i) => (
          <button key={i} type="button" onClick={() => go(i)} aria-label={`${t({ es: 'Paso', en: 'Step' })} ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-signal' : 'w-1.5 bg-white/25 hover:bg-white/50'}`} />
        ))}
      </div>

      <dl className="mx-auto mt-14 flex max-w-[760px] flex-wrap justify-center gap-x-10 gap-y-4">
        {PROCESS.map((p) => (
          <div key={p.label.es} className="flex items-baseline gap-2">
            <dt className="sr-only">{t(p.label)}</dt>
            <dd className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-signal tabular-nums">{p.value}</span>
              <span className="text-[13px] text-paper/55">{t(p.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
