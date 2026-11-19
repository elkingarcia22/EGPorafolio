'use client'

import { useEffect, useRef } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { TransitionLink } from '@/components/transition/page-transition'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb, type ClipperOrbState } from '../clipper-orb'
import { useTick } from '../thema/live-pieces'
import { Wave } from './clipper-pieces'

/** Guion de la portada: escucha, pregunta, consulta, responde, propone y se aplica. */
const SCRIPT_STEPS = 7

const AI_GRADIENT = 'linear-gradient(120deg,#f0ce86,#de8c3a 45%,#2e9cb0 75%,#3f72d8)'

function Bubble({ show, children, className }: { show: boolean; children: React.ReactNode; className: string }) {
  return (
    <div className={`absolute z-20 transition-all duration-700 ease-expo ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${className}`}>
      {children}
    </div>
  )
}

/** Portada del caso Clipper: el orbe al centro y una conversación que se arma alrededor. */
export function ClipperHero() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const tick = useTick(1500)
  const step = reducedMotion ? SCRIPT_STEPS - 2 : tick % SCRIPT_STEPS
  const state: ClipperOrbState = step === 0 ? 'listening' : step === 2 ? 'thinking' : 'idle'

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-word]', { yPercent: 115, duration: 1.3 }, 0.15)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.06 }, 0.45)
        .from('[data-hero-orb]', { autoAlpha: 0, scale: 0.4, duration: 1.8, ease: 'expo.out' }, 0.35)
        .from('[data-hero-ring]', { autoAlpha: 0, scale: 0.6, duration: 2, stagger: 0.15 }, 0.5)
    }, el)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ToneSection tone="dark" className="relative overflow-hidden px-[var(--gutter)] pb-24 pt-32">
      <div ref={ref}>
        <div className="pointer-events-none absolute left-1/2 top-[58%] h-[70vw] max-h-[1000px] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(222,140,58,0.18),rgba(46,156,176,0.12)_45%,rgba(63,114,216,0.08)_65%,transparent)]" aria-hidden="true" />

        <div className="relative mb-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2" data-hero-fade>
          <TransitionLink href="/proyectos/barberlytics" transitionLabel="Barberlytics" className="mono-label opacity-60 hover:opacity-100">
            ← Barberlytics
          </TransitionLink>
          <span className="mono-label opacity-60">{CLIPPER_CASE.index} / 04 · {t(CLIPPER_CASE.eyebrow)}</span>
        </div>

        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <h1 className="text-[clamp(3.2rem,1rem+8vw,10rem)] font-light leading-[0.9] tracking-tight md:col-span-7">
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-hero-word className="inline-block bg-clip-text text-transparent" style={{ backgroundImage: AI_GRADIENT }}>{t(CLIPPER_CASE.title)}</span>
            </span>
          </h1>
          <p data-hero-fade className="text-lg leading-relaxed opacity-85 md:col-span-5">{t(CLIPPER_CASE.tagline)}</p>
        </div>

        <div className="relative mx-auto mt-10 h-[clamp(520px,52vw,680px)] max-w-6xl">
          {/* Anillos */}
          {[1, 0.72, 0.46].map((s, i) => (
            <span key={s} data-hero-ring className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]" style={{ width: `min(${s * 100}%, ${s * 680}px)` }} aria-hidden="true">
              <span className="absolute inset-0 rounded-full" style={{ animation: `orbit ${20 + i * 9}s linear infinite${i % 2 ? ' reverse' : ''}` }}>
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: ['#de8c3a', '#2e9cb0', '#f0ce86'][i] }} />
              </span>
            </span>
          ))}

          <div data-hero-orb className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="scale-[0.6] md:scale-100"><ClipperOrb size={220} state={state} /></div>
          </div>
          <p className="absolute left-1/2 top-[calc(50%+150px)] z-10 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-white/50" aria-live="polite">
            {state === 'listening' ? t({ es: 'Te escucho · Español', en: 'Listening · Spanish' }) : state === 'thinking' ? t({ es: 'Razonando…', en: 'Reasoning…' }) : t({ es: 'Clipper', en: 'Clipper' })}
          </p>

          {/* La conversación, alrededor */}
          <Bubble show={step === 0} className="left-[6%] top-[8%] hidden md:block">
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#141210]/90 px-4 py-2.5 backdrop-blur">
              <Wave active bars={14} />
              <span className="text-xs text-white/70">«¿Cuánto llevo cobrado hoy…»</span>
            </div>
          </Bubble>
          <Bubble show={step >= 1} className="left-[2%] top-[22%] w-[min(300px,44%)]">
            <p className="rounded-2xl rounded-tl-sm bg-white/[0.08] px-4 py-3 text-sm">¿Cuánto llevo cobrado hoy?</p>
          </Bubble>
          <Bubble show={step >= 2} className="right-[3%] top-[12%] w-[min(280px,44%)]">
            <p className="flex items-center gap-2 rounded-full border border-[#2e9cb0]/40 bg-[#2e9cb0]/10 px-3 py-1.5 font-mono text-[11px] text-[#7fd3e3]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7fd3e3]" />
              {t({ es: 'Consulté · Cuentas del periodo', en: 'Looked up · Period accounts' })}
            </p>
          </Bubble>
          <Bubble show={step >= 3} className="right-[1%] top-[28%] w-[min(320px,46%)]">
            <div className="rounded-2xl rounded-tr-sm p-[1.5px]" style={{ backgroundImage: AI_GRADIENT }}>
              <p className="rounded-[15px] bg-[#141210] px-4 py-3 text-sm leading-relaxed">
                {t({ es: 'Llevas US$ 658 cobrados de US$ 2.676 del día. Faltan 4 citas por cobrar.', en: 'You’ve collected US$ 658 of today’s US$ 2,676. 4 visits left to charge.' })}
              </p>
            </div>
          </Bubble>
          <Bubble show={step >= 4} className="bottom-[10%] left-[4%] w-[min(300px,44%)]">
            <p className="rounded-2xl rounded-tl-sm bg-white/[0.08] px-4 py-3 text-sm">{t({ es: 'Pásale la de las 4 de Mateo a las 5', en: 'Move Mateo’s 4 o’clock to 5' })}</p>
          </Bubble>
          <Bubble show={step >= 5} className="bottom-[6%] right-[3%] w-[min(300px,46%)]">
            <div className="rounded-2xl border border-white/15 bg-[#141210]/95 p-4 text-sm backdrop-blur">
              <p className="mono-label text-white/50">{step >= 6 ? t({ es: 'Aplicado', en: 'Applied' }) : t({ es: 'Propuesta', en: 'Proposal' })}</p>
              <p className="mt-1 font-medium">{t({ es: 'Mover la cita', en: 'Move the visit' })}</p>
              <p className="mt-1 text-xs"><span className="text-white/40 line-through">mié 4:00</span> → <span className="text-[#e9c27a]">mié 5:00</span></p>
              <div className="mt-3 flex gap-2 text-xs">
                <span className={`rounded-md px-3 py-1.5 font-semibold transition-colors duration-500 ${step >= 6 ? 'bg-[#4cc98d] text-[#0f1a14]' : 'bg-[#d9b36a] text-[#16130f]'}`}>{step >= 6 ? `✓ ${t({ es: 'Aplicado', en: 'Applied' })}` : t({ es: 'Aplicar', en: 'Apply' })}</span>
                <span className="rounded-md border border-white/20 px-3 py-1.5">{step >= 6 ? t({ es: 'Deshacer', en: 'Undo' }) : t({ es: 'Descartar', en: 'Discard' })}</span>
              </div>
            </div>
          </Bubble>
        </div>

        <dl className="relative mt-10 grid grid-cols-2 gap-6 border-t border-fg/15 pt-8 md:grid-cols-5">
          {CLIPPER_CASE.meta.map((m) => (
            <div key={m.label.es} data-hero-fade>
              <dt className="mono-label mb-1 opacity-50">{t(m.label)}</dt>
              <dd className="text-sm leading-relaxed">{t(m.value)}</dd>
            </div>
          ))}
          <div data-hero-fade className="col-span-2 md:col-span-1">
            <dt className="mono-label mb-2 opacity-50">{t(COPY.case.tools)}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {CLIPPER_CASE.tools.map((tool) => (
                <span key={tool} className="border border-fg/25 px-2 py-0.5 text-[11px]">{tool}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </ToneSection>
  )
}
