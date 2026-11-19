'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PROCESS_STAGES } from '@/lib/content/process'
import { COPY } from '@/lib/content/copy'
import { AiMark, DemoMark, DotsMark, FormMark, IdeaMark, ImpactMark, PatternsMark, ProcessMarksStyle, SketchMark } from './process-flow-visuals'

const MARKS = [DotsMark, PatternsMark, IdeaMark, SketchMark, FormMark, AiMark, ImpactMark, DemoMark]
const STAGES = PROCESS_STAGES.map((stage, i) => ({ ...stage, Mark: MARKS[i] }))

/** El proceso en una sola vista: ocho etapas en dos filas que se encienden al bajar, sin recorrido horizontal. */
export function ProcessFlow() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const gridRef = useRef<HTMLOListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0)

  // La línea que se llena al bajar y la entrada animada, creadas juntas un cuadro después del montaje:
  // así no se cruzan con los demás ScrollTrigger que la página arma al cargar (p. ej. al abrir /#agent).
  useEffect(() => {
    const grid = gridRef.current
    const root = rootRef.current
    if (!grid || !root || reducedMotion) {
      setProgress(1)
      return
    }
    let ctx: gsap.Context | null = null
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({ trigger: grid, start: 'top 75%', end: 'bottom 70%', scrub: true, onUpdate: (self) => setProgress(self.progress) })
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: root, start: 'top 70%', toggleActions: 'play none none none' } })
        tl.from('[data-pf-word]', { yPercent: 115, duration: 1.1, stagger: 0.07 })
          .from('[data-pf-intro]', { autoAlpha: 0, y: 24, duration: 0.9 }, 0.25)
          .from('[data-pf-dot]', { scale: 0, duration: 0.7, ease: 'back.out(3)', stagger: 0.07 }, 0.35)
          .from('[data-pf-card]', { autoAlpha: 0, y: 56, filter: 'blur(10px)', duration: 1, stagger: 0.07, clearProps: 'filter' }, 0.4)
          .from('[data-pf-mark]', { scale: 0.3, rotate: -40, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.8)', stagger: 0.07 }, 0.5)
      }, root)
    })
    return () => {
      cancelAnimationFrame(frame)
      ctx?.revert()
    }
  }, [reducedMotion])

  const lit = Math.min(STAGES.length, Math.floor(progress * STAGES.length) + 1)
  // Cuánto de cada fila lleva dibujada la línea (0–1).
  const rowFill = (row: number) => Math.max(0, Math.min(1, progress * 2 - row))

  return (
    <ToneSection tone="dark" id="process" className="px-[var(--gutter)] pb-[clamp(5rem,4rem+4vw,9rem)] pt-28">
      <ProcessMarksStyle />
      <div ref={rootRef}>
      <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionLabel index="02">{t(COPY.process.label)}</SectionLabel>
          <h2 className="mt-6 text-[clamp(2.6rem,1rem+5vw,6rem)] font-light leading-[0.92] tracking-tight">
            {t(COPY.process.title).split(' ').map((word, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-pf-word className="inline-block">{word}</span>
              </span>
            ))}
          </h2>
        </div>
        <p data-pf-intro className="leading-relaxed opacity-70 md:col-span-5">
          {t({
            es: 'Así se cuenta cada proyecto: de los puntos sueltos al producto funcionando, en ocho etapas. La IA acompaña cada una.',
            en: 'This is how every project is told: from loose dots to a working product, in eight stages. AI goes along with each one.',
          })}
        </p>
      </div>

      <ol ref={gridRef} className="relative grid gap-x-0 gap-y-12 md:grid-cols-4 md:gap-y-16">
        {/* La línea de cada fila: se dibuja al bajar y une los puntos de las etapas */}
        {[0, 1].map((row) => (
          <span key={row} className="pointer-events-none absolute inset-x-0 hidden h-px bg-fg/15 md:block" style={{ top: row === 0 ? '7px' : 'calc(50% + 2rem + 7px)' }} aria-hidden="true">
            <span className="absolute inset-y-0 left-0 overflow-hidden bg-signal transition-[width] duration-300" style={{ width: `${rowFill(row) * 100}%` }}>
              {/* Una luz que recorre lo ya dibujado */}
              <span className="absolute inset-0 animate-[pf-comet_3.2s_cubic-bezier(.65,0,.35,1)_infinite]" style={{ animationDelay: `${row * 1.6}s` }}>
                <span className="absolute right-0 top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-white to-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
              </span>
            </span>
          </span>
        ))}
        {/* En móvil, una sola línea vertical */}
        <span className="pointer-events-none absolute bottom-0 left-[7px] top-0 w-px bg-fg/15 md:hidden" aria-hidden="true">
          <span className="absolute inset-x-0 top-0 bg-signal" style={{ height: `${progress * 100}%` }} />
        </span>

        {STAGES.map((stage, i) => {
          const on = i < lit
          const current = i === lit - 1 && progress < 1
          return (
            <li key={stage.title.es} className={`group relative pl-8 transition-opacity duration-500 md:pl-0 md:pr-8 ${on ? 'opacity-100' : 'opacity-35'}`}>
              <span data-pf-dot className="absolute left-0 top-0 block">
              <span
                className={`block h-[15px] w-[15px] rounded-full border-2 transition-all duration-500 ${on ? 'border-signal bg-signal' : 'border-fg/30 bg-bg'}`}
                style={current ? { boxShadow: '0 0 0 6px rgb(var(--signal) / 0.2)' } : undefined}
                aria-hidden="true"
              />
              </span>
              <div data-pf-card className="pt-8">
                <div data-pf-mark className="h-14 w-14">
                  <div className="h-full w-full opacity-90 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:scale-110">
                    <stage.Mark />
                  </div>
                </div>
                <p className="mono-label mb-2 mt-5 opacity-50">{String(i + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}</p>
                <h3 className="brand-title mb-3 text-xl">{t(stage.title)}</h3>
                <p className="max-w-[30ch] text-sm leading-relaxed opacity-75">{t(stage.body)}</p>
                <p className="mt-3 flex max-w-[30ch] items-start gap-2 text-[13px]">
                  <span className="mono-label mt-0.5 shrink-0 text-signal">IA ▸</span>
                  <span className="opacity-80">{t(stage.ai)}</span>
                </p>
              </div>
            </li>
          )
        })}
      </ol>
      </div>
    </ToneSection>
  )
}
