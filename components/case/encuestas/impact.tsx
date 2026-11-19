'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { SCOPE, type Quarter } from '@/lib/content/cases/encuestas/scope'
import { ReferenceTag } from './shared'

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

/** 07 · Impacto: alcance verificable, metas de referencia y aprendizajes. */
export function SurveyImpact() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.impact
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(d.lead)}</p>

      <dl className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
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

      <p data-reveal className="mono-label mb-5 mt-20 opacity-60">{t({ es: 'Las 99 funcionalidades, por superficie y trimestre', en: 'The 99 features, by surface and quarter' })}</p>
      <ScopeMap />

      <div className="mt-20 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p data-reveal className="mono-label opacity-60">{t({ es: 'Lo que vamos a medir al salir', en: 'What we’ll measure at launch' })}</p>
          <ul className="mt-6 divide-y divide-fg/15 border-y border-fg/15">
            {d.goals.map((g) => (
              <li key={g.label.es} data-reveal className="flex items-baseline gap-5 py-4">
                <span className="w-24 shrink-0 text-2xl font-light tabular-nums text-signal">{g.value}</span>
                <span className="text-sm leading-snug opacity-80">
                  {t(g.label)}
                  {g.reference && <ReferenceTag />}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed opacity-60">
            {t({ es: 'Las cifras marcadas son metas de referencia, no resultados medidos: el módulo aún no corre con clientes. El cero de las descargas no es una meta, es una regla del producto.', en: 'Marked figures are reference goals, not measured results: the module isn’t live with customers yet. The zero for downloads isn’t a goal, it’s a product rule.' })}
          </p>
        </div>
        <div className="lg:col-span-6">
          <p data-reveal className="mono-label opacity-60">{t({ es: 'Lo que me llevo', en: 'What I take away' })}</p>
          <ol className="mt-6 space-y-6">
            {d.learnings.map((l, i) => (
              <li key={l.es} data-reveal className="flex gap-4">
                <span className="font-mono text-xs text-signal">0{i + 1}</span>
                <span className="leading-relaxed">{t(l)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
