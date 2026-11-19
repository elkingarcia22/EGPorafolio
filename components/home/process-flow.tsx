'use client'

import { useEffect, useRef, useState } from 'react'
import { ToneSection } from '@/components/ui/tone-section'
import { SectionLabel } from '@/components/ui/section-label'
import { ScrollTrigger } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import { AiMark, DemoMark, DotsMark, FormMark, IdeaMark, ImpactMark, PatternsMark, ProcessMarksStyle, SketchMark } from './process-flow-visuals'

interface Stage {
  title: L
  body: L
  ai: L
  Mark: () => React.JSX.Element
}

/** Las mismas ocho etapas con las que se cuenta cada caso. */
const STAGES: readonly Stage[] = [
  {
    title: { es: 'Los puntos', en: 'The dots' },
    body: { es: 'Escucho el problema sin filtros: entrevistas, datos, soporte. Todavía no hay forma.', en: 'I listen to the problem unfiltered: interviews, data, support. No shape yet.' },
    ai: { es: 'Agrupa cientos de notas en minutos.', en: 'Clusters hundreds of notes in minutes.' },
    Mark: DotsMark,
  },
  {
    title: { es: 'Patrones', en: 'Patterns' },
    body: { es: 'Comparo productos y voces hasta que aparece lo que se repite.', en: 'I compare products and voices until what repeats shows up.' },
    ai: { es: 'Contrasto hipótesis con usuarios sintéticos.', en: 'Stress-tests hypotheses with synthetic users.' },
    Mark: PatternsMark,
  },
  {
    title: { es: 'La idea', en: 'The idea' },
    body: { es: 'Una pregunta —¿cómo podríamos…?— y pocos principios que deciden lo demás.', en: 'One question —how might we…?— and a few principles that decide the rest.' },
    ai: { es: 'Busca los casos que rompen cada principio.', en: 'Finds the cases that break each principle.' },
    Mark: IdeaMark,
  },
  {
    title: { es: 'Bocetos', en: 'Sketches' },
    body: { es: 'Tableros a mano: el flujo, las variantes y lo que no puede pasar.', en: 'Hand-drawn boards: the flow, the variants and what must not happen.' },
    ai: { es: 'Variaciones para comparar en minutos.', en: 'Variations to compare in minutes.' },
    Mark: SketchMark,
  },
  {
    title: { es: 'Forma', en: 'Form' },
    body: { es: 'Pantallas reales y sistema de diseño. Pruebo rápido y afino lo que funciona.', en: 'Real screens and a design system. I test fast and refine what works.' },
    ai: { es: 'Prototipos en código el mismo día.', en: 'Coded prototypes the same day.' },
    Mark: FormMark,
  },
  {
    title: { es: 'IA en el proceso', en: 'AI in the process' },
    body: { es: 'Si el producto lleva IA, también se diseña cómo piensa: reglas, límites y evaluaciones.', en: 'If the product carries AI, how it thinks is designed too: rules, limits and evaluations.' },
    ai: { es: 'Evaluaciones que corren contra el modelo real.', en: 'Evaluations that run against the real model.' },
    Mark: AiMark,
  },
  {
    title: { es: 'Impacto', en: 'Impact' },
    body: { es: 'Sale al mundo y se mide: adopción, uso y resultados.', en: 'It ships and gets measured: adoption, usage and outcomes.' },
    ai: { es: 'Herramientas que hoy usan miles de personas.', en: 'Tools used today by thousands of people.' },
    Mark: ImpactMark,
  },
  {
    title: { es: 'Demo', en: 'Demo' },
    body: { es: 'Cada caso cierra con el producto funcionando, para probarlo uno mismo.', en: 'Every case ends with the product running, to try it yourself.' },
    ai: { es: 'Demos en vivo con datos de prueba.', en: 'Live demos with test data.' },
    Mark: DemoMark,
  },
]

/** El proceso en una sola vista: ocho etapas en dos filas que se encienden al bajar, sin recorrido horizontal. */
export function ProcessFlow() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const gridRef = useRef<HTMLOListElement>(null)
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || reducedMotion) {
      setProgress(1)
      return
    }
    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 75%',
      end: 'bottom 70%',
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    })
    return () => trigger.kill()
  }, [reducedMotion])

  const lit = Math.min(STAGES.length, Math.floor(progress * STAGES.length) + 1)
  // Cuánto de cada fila lleva dibujada la línea (0–1).
  const rowFill = (row: number) => Math.max(0, Math.min(1, progress * 2 - row))

  return (
    <ToneSection tone="dark" id="process" className="px-[var(--gutter)] pb-[clamp(5rem,4rem+4vw,9rem)] pt-28">
      <ProcessMarksStyle />
      <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionLabel index="02">{t(COPY.process.label)}</SectionLabel>
          <h2 className="mt-6 text-[clamp(2.6rem,1rem+5vw,6rem)] font-light leading-[0.92] tracking-tight">{t(COPY.process.title)}</h2>
        </div>
        <p className="leading-relaxed opacity-70 md:col-span-5">
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
            <span className="absolute inset-y-0 left-0 bg-signal transition-[width] duration-300" style={{ width: `${rowFill(row) * 100}%` }} />
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
              <span
                className={`absolute left-0 top-0 h-[15px] w-[15px] rounded-full border-2 transition-all duration-500 ${on ? 'border-signal bg-signal' : 'border-fg/30 bg-bg'}`}
                style={current ? { boxShadow: '0 0 0 6px rgb(var(--signal) / 0.2)' } : undefined}
                aria-hidden="true"
              />
              <div className="pt-8">
                <div className="h-14 w-14 opacity-90 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:scale-110">
                  <stage.Mark />
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
    </ToneSection>
  )
}
