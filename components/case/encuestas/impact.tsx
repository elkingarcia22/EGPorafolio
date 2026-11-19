'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { SCOPE, type Quarter } from '@/lib/content/cases/encuestas/scope'
import { NOM_GOALS, NOM_RULES, RETENTION, SUS, USABILITY } from '@/lib/content/cases/encuestas/impact-metrics'
import { ShiftBars, SusGauge, TurnoverChart } from './impact-charts'
import { ReferenceTag } from './shared'
import './ai-impact.css'

const QUARTERS: readonly { id: Quarter; color: string }[] = [
  { id: 'Q4 2026', color: 'rgb(var(--signal))' },
  { id: 'Q1 2027', color: '#e8743b' },
  { id: 'Backlog', color: 'rgb(var(--fg) / 0.35)' },
]

/** Agrupa las secciones del inventario en las superficies del producto. */
const SURFACES: readonly { label: L; match: (s: string) => boolean }[] = [
  { label: { es: 'Lista', en: 'List' }, match: (s) => s === 'Listado de encuestas' },
  { label: { es: 'Crear', en: 'Create' }, match: (s) => s.startsWith('Crear encuesta') },
  { label: { es: 'Demográficos', en: 'Demographics' }, match: (s) => s.startsWith('Datos demográficos') },
  { label: { es: 'Carga histórica', en: 'Historical upload' }, match: (s) => s === 'Cargar encuestas' },
  { label: { es: 'Resultados', en: 'Results' }, match: (s) => s === 'Resultados de encuesta' },
  { label: { es: 'Comparativo', en: 'Comparison' }, match: (s) => s === 'Comparar encuestas' },
  { label: { es: 'Transversal', en: 'Cross-cutting' }, match: (s) => s === 'Elementos transversales' },
]

const colorOf = (q: Quarter) => QUARTERS.find((x) => x.id === q)?.color ?? 'currentColor'

/** El alcance real como un mapa de puntos: cada punto es una funcionalidad con su fecha de llegada. */
function ScopeMap() {
  const { t } = useLocale()
  const [only, setOnly] = useState<Quarter | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const hovered = hover !== null ? SCOPE[hover] : null

  return (
    <div data-reveal className="rounded-2xl border border-fg/15 p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {QUARTERS.map((q) => {
          const n = SCOPE.filter((f) => f[2] === q.id).length
          return (
            <button key={q.id} type="button" aria-pressed={only === q.id} onClick={() => setOnly(only === q.id ? null : q.id)} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${only === q.id ? 'border-fg' : 'border-fg/20 hover:border-fg/50'}`}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: q.color }} /> {q.id} · {n}
            </button>
          )
        })}
      </div>
      <div className="mt-6 space-y-3">
        {SURFACES.map((s) => {
          const items = SCOPE.map((f, i) => ({ f, i })).filter(({ f }) => s.match(f[1]))
          return (
            <div key={s.label.es} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]">
              <span className="text-sm opacity-70">{t(s.label)} <span className="font-mono text-[10px] opacity-60">{items.length}</span></span>
              <ul className="flex flex-wrap gap-1.5">
                {items.map(({ f, i }) => {
                  const dim = only !== null && only !== f[2]
                  return (
                    <li key={f[0]}>
                      <button
                        type="button"
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(i)}
                        onBlur={() => setHover(null)}
                        aria-label={`${f[0]} · ${f[2]}`}
                        className={`block h-4 w-4 rounded-full transition-[opacity,transform] duration-300 hover:scale-150 focus-visible:scale-150 ${dim ? 'opacity-15' : ''}`}
                        style={{ background: colorOf(f[2]) }}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
      <p className="mt-6 min-h-[3rem] border-t border-fg/15 pt-4 text-sm" aria-live="polite">
        {hovered ? (
          <>
            <span className="font-mono text-xs" style={{ color: colorOf(hovered[2]) }}>{hovered[2]}</span> · <span className="opacity-60">{hovered[1]}</span>
            <span className="mt-1 block">{hovered[0]}</span>
          </>
        ) : (
          <span className="opacity-60">{t({ es: 'Pasa por un punto para ver la funcionalidad. Así se negoció el alcance con desarrollo: cada pieza con su trimestre, encendible en el prototipo.', en: 'Hover a dot to see the feature. This is how scope was negotiated with engineering: each piece with its quarter, toggleable in the prototype.' })}</span>
        )}
      </p>
    </div>
  )
}

/** Cabecera de cada grupo de métricas. */
function GroupHead({ n, title, lead }: { n: string; title: L; lead: L }) {
  const { t } = useLocale()
  return (
    <div data-reveal className="mb-8 grid gap-3 border-t border-fg/15 pt-6 md:grid-cols-12">
      <p className="font-mono text-xs text-signal md:col-span-2">{n}</p>
      <h3 className="text-[clamp(1.5rem,1.1rem+1.2vw,2.2rem)] font-light leading-tight md:col-span-5">{t(title)}</h3>
      <p className="text-sm leading-relaxed opacity-70 md:col-span-5">{t(lead)}</p>
    </div>
  )
}

/** 07 · Impacto: usabilidad, retención y NOM 035 (metas de referencia), más el alcance real verificable. */
export function SurveyImpact() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.impact
  return (
    <div className="space-y-24">
      <div>
        <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(d.lead)}</p>
        <p data-reveal className="mt-5 inline-flex max-w-[62ch] items-start gap-3 rounded-xl border border-fg/15 px-4 py-3 text-xs leading-relaxed opacity-80">
          <ReferenceTag />
          <span>{t({ es: 'Las cifras marcadas son metas de referencia, modestas a propósito: el módulo aún no corre con clientes y se medirán al salir. Las reglas de la NOM 035 sí están verificadas en el producto.', en: 'Marked figures are reference goals, modest on purpose: the module isn’t live with customers yet and they’ll be measured at launch. The NOM 035 rules are verified in the product.' })}</span>
        </p>
      </div>

      <section>
        <GroupHead n="A" title={{ es: 'Usabilidad de la plataforma', en: 'Platform usability' }} lead={{ es: 'Lo que más pesaba era crear: siete pantallas sin orden y ninguna señal de qué faltaba. La meta es que un admin arme un clima desde plantilla sin pedir ayuda.', en: 'Creation weighed the most: seven screens with no order and no sign of what was missing. The goal is for an admin to build a climate survey from a template without asking for help.' }} />
        <div className="grid gap-8 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-5">
            <SusGauge shift={SUS} />
          </div>
          <div className="space-y-8 lg:col-span-7">
            {USABILITY.map((m) => (
              <div key={m.id} data-reveal>
                <ShiftBars shift={m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <GroupHead n="B" title={{ es: 'Retención', en: 'Retention' }} lead={{ es: 'Una encuesta retiene cuando termina en algo: más gente responde si el recordatorio llega a su grupo, y la rotación baja donde el resultado se vuelve un plan con dueño.', en: 'A survey retains when it ends in something: more people answer when the reminder reaches their group, and turnover drops where results become an owned plan.' }} />
        <div className="grid gap-8 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-7">
            <TurnoverChart />
          </div>
          <div className="space-y-8 lg:col-span-5">
            {RETENTION.map((m) => (
              <div key={m.id} data-reveal>
                <ShiftBars shift={m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <GroupHead n="C" title={{ es: 'Plantillas normativas · NOM 035', en: 'Normative templates · NOM 035' }} lead={{ es: 'En México la NOM-035-STPS-2018 no es otra encuesta de clima: se lee como riesgo, exige participación total y produce documentos. El producto la trae lista y no deja romperla.', en: 'In Mexico, NOM-035-STPS-2018 isn’t just another climate survey: it reads as risk, requires full participation and produces documents. The product ships it ready and won’t let you break it.' }} />
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-fg/15 bg-fg/15 lg:grid-cols-4">
          {NOM_RULES.map((r) => (
            <li key={r.label.es} data-reveal className="bg-bg p-5">
              <span className="block text-[clamp(2rem,1.4rem+1.6vw,3rem)] font-light leading-none tabular-nums">{r.value}</span>
              <span className="mt-3 block text-xs leading-relaxed opacity-70">{t(r.label)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {NOM_GOALS.map((m) => (
            <div key={m.id} data-reveal>
              <ShiftBars shift={m} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {d.scope.map((f) => (
            <div key={f.label.es} data-reveal>
              <dt className="sr-only">{t(f.label)}</dt>
              <dd>
                <span data-count={f.value} className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{f.value}</span>
                <span className="mt-3 block text-sm leading-snug opacity-70">{t(f.label)}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p data-reveal className="mono-label mb-5 mt-14 opacity-60">{t({ es: 'Las 99 funcionalidades, por superficie y trimestre', en: 'The 99 features, by surface and quarter' })}</p>
        <ScopeMap />
      </section>

      <section>
        <p data-reveal className="mono-label opacity-60">{t({ es: 'Lo que me llevo', en: 'What I take away' })}</p>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {d.learnings.map((l, i) => (
            <li key={l.es} data-reveal className="border-t border-fg/15 pt-4">
              <span className="font-mono text-xs text-signal">0{i + 1}</span>
              <p className="mt-3 leading-relaxed">{t(l)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
