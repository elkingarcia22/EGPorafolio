'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { NOM_GOALS, RETENTION, SUS, TURNOVER, USABILITY, type Shift } from '@/lib/content/cases/encuestas/impact-metrics'
import { ReferenceTag } from './shared'

/** La rotación voluntaria en áreas que cierran su plan de acción, de la serie de referencia. */
const TURNOVER_SHIFT: Shift = {
  id: 'rotacion',
  label: { es: 'Rotación voluntaria donde el resultado se vuelve plan', en: 'Voluntary turnover where results become a plan' },
  hint: { es: 'Áreas con plan de acción cerrado, en un año', en: 'Areas with a closed action plan, over a year' },
  from: TURNOVER.withPlan[0],
  to: TURNOVER.withPlan[TURNOVER.withPlan.length - 1],
  unit: '%',
  lowerIsBetter: true,
  reference: true,
}

const GROUPS: readonly { title: L; items: readonly Shift[] }[] = [
  { title: { es: 'Usabilidad', en: 'Usability' }, items: [SUS, USABILITY[1]] },
  { title: { es: 'Retención', en: 'Retention' }, items: [RETENTION[0], TURNOVER_SHIFT] },
  { title: { es: 'NOM 035', en: 'NOM 035' }, items: [NOM_GOALS[0], NOM_GOALS[1]] },
]

const fmt = (v: number, unit: string) => `${String(Math.round(v * 10) / 10).replace('.', ',')}${unit ? ` ${unit}` : ''}`

function delta(s: Shift): string {
  const d = s.to - s.from
  if (s.id === 'tiempo' || s.id === 'reportes') return `${Math.round((d / s.from) * 100)} %`
  const pp = s.unit === '%' ? ' pp' : ''
  return `${d > 0 ? '+' : '−'}${String(Math.abs(Math.round(d * 10) / 10)).replace('.', ',')}${pp}`
}

/** Una cifra de «hoy → meta»: la barra de hoy queda gris y la de la meta crece al entrar. */
function Tile({ s, on }: { s: Shift; on: boolean }) {
  const { t } = useLocale()
  const max = Math.max(s.from, s.to)
  const good = s.lowerIsBetter ? s.to < s.from : s.to > s.from
  return (
    <div className="flex flex-col rounded-2xl border border-fg/15 p-4">
      <p className="text-sm leading-snug">{t(s.label)}</p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-light tabular-nums text-signal">{delta(s)}</span>
        <span className="font-mono text-[11px] opacity-60">{fmt(s.from, s.unit)} → {fmt(s.to, s.unit)}</span>
      </p>
      <div className="mt-3 space-y-1" aria-hidden="true">
        <span className="block h-1.5 rounded-full bg-fg/15" style={{ width: `${(s.from / max) * 100}%` }} />
        <span className="block h-1.5 origin-left rounded-full transition-transform duration-[1200ms] ease-out" style={{ width: `${(s.to / max) * 100}%`, transform: on ? 'scaleX(1)' : 'scaleX(0)', background: good ? 'rgb(var(--signal))' : 'rgb(var(--fg) / 0.5)' }} />
      </div>
      <p className="mt-2 text-[11px] leading-snug"><span className="-ml-2"><ReferenceTag /></span> <span className="opacity-55">{t(s.hint)}</span></p>
    </div>
  )
}

/** 07 · Impacto: seis metas de referencia en tres frentes y lo que me llevo. */
export function SurveyImpact() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.impact
  const box = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div>
      <p data-reveal className="max-w-[62ch] leading-relaxed opacity-80">
        {t({ es: 'El módulo todavía no corre con clientes. Estas son las metas con las que se va a medir al salir: modestas a propósito y marcadas como referencia.', en: 'The module isn’t live with customers yet. These are the goals it will be measured against at launch: modest on purpose and marked as reference.' })}
      </p>

      <div ref={box} data-reveal className="mt-10 grid gap-6 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <section key={g.title.es}>
            <p className="mono-label mb-3 opacity-60">{t(g.title)}</p>
            <div className="space-y-3">
              {g.items.map((s) => <Tile key={s.id} s={s} on={on} />)}
            </div>
          </section>
        ))}
      </div>

      <ol className="mt-14 grid gap-6 md:grid-cols-3">
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
