'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { ReferenceTag } from './shared'

/**
 * Lo que una encuesta que termina en accionables puede mover en la empresa. El módulo todavía no corre con clientes:
 * son metas de referencia, modestas a propósito, para medir al salir; no resultados.
 */
const OUTCOMES: readonly { value: number; prefix: string; suffix: string; decimals?: number; label: L; how: L }[] = [
  { value: 8, prefix: '+', suffix: '', label: { es: 'puntos de eNPS', en: 'eNPS points' }, how: { es: 'en empresas que cierran sus accionables entre una medición y la siguiente', en: 'in companies that close their actions between one measurement and the next' } },
  { value: 5, prefix: '+', suffix: ' pp', label: { es: 'de favorabilidad de clima', en: 'climate favorability' }, how: { es: 'en las secciones que tuvieron un plan con dueño', en: 'in the sections that had an owned plan' } },
  { value: 85, prefix: '', suffix: ' %', label: { es: 'de clientes en México cumplen la NOM 035', en: 'of customers in Mexico meet NOM 035' }, how: { es: 'con el 100 % de participación antes del cierre, frente al 60 % de hoy', en: 'with 100 % participation before closing, versus 60 % today' } },
  { value: 1.5, prefix: '−', suffix: ' pp', decimals: 1, label: { es: 'de rotación voluntaria', en: 'voluntary turnover' }, how: { es: 'en un año, en las áreas donde el resultado se volvió accionable', en: 'over a year, in areas where results became actions' } },
]

const STEPS: readonly L[] = [
  { es: 'Encuesta', en: 'Survey' },
  { es: 'Accionable con dueño', en: 'Owned action' },
  { es: 'Mejora medible', en: 'Measurable improvement' },
]

function Count({ to, on, decimals = 0 }: { to: number; on: boolean; decimals?: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!on) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, to])
  return <>{v.toFixed(decimals).replace('.', ',')}</>
}

/** 07 · Impacto: de la encuesta al accionable y a la mejora, en cuatro metas de referencia. */
export function SurveyImpact() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.impact
  const box = useRef<HTMLUListElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div>
      <p data-reveal className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {STEPS.map((s, i) => (
          <span key={s.es} className="flex items-center gap-2">
            <span className={`rounded-full border px-3 py-1 ${i === 2 ? 'border-signal text-signal' : 'border-fg/25'}`}>{t(s)}</span>
            {i < STEPS.length - 1 && <span className="opacity-40">→</span>}
          </span>
        ))}
      </p>
      <p data-reveal className="mt-5 max-w-[60ch] leading-relaxed opacity-80">
        {t({ es: 'Una encuesta solo sirve si termina en algo. Esto es lo que esperamos mover en las empresas cuando cada resultado se vuelve un accionable con dueño; son metas para medir al salir, no resultados.', en: 'A survey only matters if it ends in something. This is what we expect to move in companies when each result becomes an owned action; they’re goals to measure at launch, not results.' })}
      </p>

      <ul ref={box} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
        {OUTCOMES.map((o, i) => (
          <li key={o.label.es} className="bg-bg p-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(16px)', transitionDelay: `${i * 110}ms` }}>
            <p className="whitespace-nowrap text-[clamp(2rem,1.4rem+1.6vw,3rem)] font-light leading-none tabular-nums text-signal">
              {o.prefix}<Count to={o.value} on={on} decimals={o.decimals} />{o.suffix}
            </p>
            <p className="mt-3 text-sm font-medium leading-snug">{t(o.label)}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-60">{t(o.how)}</p>
            <p className="mt-3"><span className="-ml-2"><ReferenceTag /></span></p>
          </li>
        ))}
      </ul>

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {d.learnings.map((l, i) => (
          <li key={l.es} data-reveal className="border-t border-fg/15 pt-3 text-sm leading-relaxed">
            <span className="mr-2 font-mono text-xs text-signal">0{i + 1}</span>
            {t(l)}
          </li>
        ))}
      </ol>
    </div>
  )
}
