'use client'

import { useLocale, type L } from '@/lib/i18n'
import { LEARNINGS } from '@/lib/content/cases/sellup/sellup-agents'
import { BLUE, useInView } from './ui'
import { useCountUp, usd } from './ai-hooks'
import { project } from './impact-model'
import { ImpactSimulator } from './impact-sim'


const DEFAULT = project(6, 25)

interface Row {
  label: L
  before: number
  after: number
  fmt: (n: number) => string
}

/** Antes y después, por vendedor. Cifras de referencia. */
const BEFORE_AFTER: readonly Row[] = [
  { label: { es: 'Horas de prospección a la semana', en: 'Prospecting hours a week' }, before: 6, after: 1.5, fmt: (n) => `${String(n).replace('.', ',')} h` },
  { label: { es: 'Empresas trabajadas a la semana', en: 'Companies worked a week' }, before: 10, after: 25, fmt: (n) => `${n}` },
  { label: { es: 'Primeras llamadas que conectan', en: 'First calls that connect' }, before: 18, after: 30, fmt: (n) => `${n}%` },
  { label: { es: 'Costo de preparar una empresa', en: 'Cost to prepare a company' }, before: 9, after: 0.7, fmt: (n) => `US$${String(n).replace('.', ',')}` },
]

/** Barras de antes y después que crecen al entrar en pantalla. */
function BeforeAfter() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className="grid gap-x-10 gap-y-7 md:grid-cols-2">
      {BEFORE_AFTER.map((r, i) => {
        const max = Math.max(r.before, r.after)
        const bars = [
          { k: 'before', v: r.before, c: 'rgba(232,233,236,0.25)', lbl: { es: 'Antes', en: 'Before' } },
          { k: 'after', v: r.after, c: BLUE, lbl: { es: 'Con SellUp', en: 'With SellUp' } },
        ] as const
        return (
          <div key={r.label.es}>
            <p className="mb-2.5 text-sm opacity-75">{t(r.label)}</p>
            {bars.map((b, j) => (
              <div key={b.k} className="mt-1.5 flex items-center gap-3">
                <span className="w-[74px] shrink-0 text-[11px] opacity-55">{t(b.lbl)}</span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-fg/[0.06]">
                  <span className="absolute inset-y-0 left-0 origin-left rounded-full transition-transform duration-[1400ms] ease-expo" style={{ width: `${Math.max(4, (b.v / max) * 100)}%`, background: b.c, transform: seen ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${i * 140 + j * 220}ms` }} />
                </span>
                <span className={`w-[64px] shrink-0 text-right text-sm tabular-nums ${b.k === 'after' ? 'text-signal' : 'opacity-60'}`}>{r.fmt(b.v)}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/** Cifra grande que cuenta desde cero. */
function BigCount({ to, format, label, seen }: { to: number; format: (n: number) => string; label: L; seen: boolean }) {
  const { t } = useLocale()
  const v = useCountUp(to, seen, 1800)
  return (
    <div>
      <dt className="sr-only">{t(label)}</dt>
      <dd>
        <span className="block whitespace-nowrap text-[clamp(2rem,1rem+2.4vw,3.4rem)] font-light leading-none tabular-nums text-signal">{format(v)}</span>
        <span className="mt-3 block max-w-[24ch] text-sm leading-snug opacity-70">{t(label)}</span>
      </dd>
    </div>
  )
}

/** 07 · Impacto: proyección de ARR y retorno (cifras de referencia), con el costo real como ancla. */
export function SellUpImpact() {
  const { t, locale } = useLocale()
  const [ref, seen] = useInView<HTMLDListElement>(0.4)
  const num = (n: number, d = 0) => n.toLocaleString(locale === 'en' ? 'en-US' : 'es-CO', { maximumFractionDigits: d, minimumFractionDigits: d })
  return (
    <div>
      <p data-reveal className="mono-label mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-3 py-1 text-amber-300">
        ⚠ {t({ es: 'Cifras de referencia · proyección, no resultados medidos', en: 'Reference figures · projection, not measured results' })}
      </p>
      <p data-reveal="mask" className="max-w-[24ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Más tiempo vendiendo, mejores primeras llamadas, más ARR.', en: 'More time selling, better first calls, more ARR.' })}
      </p>
      <p data-reveal className="mt-6 max-w-[62ch] leading-relaxed opacity-80 max-md:hidden">
        {t({ es: 'SellUp se entregó hace poco y todavía no hay ventas que atribuirle. Esta es la proyección con la que se justifica la inversión: un equipo de 6 vendedores, supuestos moderados y el costo de IA que ya medimos en Producción.', en: 'SellUp shipped recently and there are no sales to attribute to it yet. This is the projection that justifies the investment: a team of 6 reps, moderate assumptions and the AI cost we already measured in Production.' })}
      </p>

      <dl ref={ref} className="mt-12 grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
        <BigCount to={DEFAULT.year1} format={(n) => usd(n, locale)} label={{ es: 'ARR incremental proyectado en el primer año', en: 'Projected incremental ARR in year one' }} seen={seen} />
        <BigCount to={DEFAULT.roi} format={(n) => `${num(n, 1)}×`} label={{ es: 'retorno sobre el costo de IA y plataforma', en: 'return on AI and platform cost' }} seen={seen} />
        <BigCount to={DEFAULT.hoursYear} format={(n) => num(n)} label={{ es: 'horas al año que el equipo deja de buscar a mano', en: 'hours a year the team stops searching by hand' }} seen={seen} />
      </dl>

      <h3 data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Antes y después, por vendedor', en: 'Before and after, per rep' })}</h3>
      <BeforeAfter />

      <h3 data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Simula tu equipo', en: 'Simulate your team' })}</h3>
      <ImpactSimulator />

      <p className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Lo que aprendí', en: 'What I learned' })}</p>
      <ol className="space-y-4">
        {LEARNINGS.map((l, i) => (
          <li key={l.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">0{i + 1}</span>
            <span className="text-lg leading-snug">{t(l)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
