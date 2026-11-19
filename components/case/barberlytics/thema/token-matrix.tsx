'use client'

import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'

/** Filas reales de docs/TOKEN_DECISION_MATRIX.md: lo que decía cada fuente y lo que se decidió. */
const SOURCES = ['Starter', 'Comparativo', 'Legado', 'Oficial'] as const

interface Row {
  token: string
  values: readonly (string | null)[]
  decision: string
  why: L
  kind?: 'color' | 'radius'
}

const ROWS: readonly Row[] = [
  { token: 'Surface App', values: ['#f3f3f4', '#F4F6F8', '#F3F3F4', '#F4F6F8'], decision: '#F4F6F8', why: { es: 'El oficial gana sobre el legado', en: 'Official beats legacy' } },
  { token: 'Surface Nav', values: ['#0a0a60', '#0A0A60', '#202837', '#0A0A60'], decision: '#0A0A60', why: { es: 'Navy del sistema oficial', en: 'The official navy' } },
  { token: 'Text Primary', values: ['#121c28', '#303A47', '#303a47', '#303A47'], decision: '#303A47', why: { es: 'El oficial gana sobre el starter', en: 'Official beats starter' } },
  { token: 'Brand Hover', values: ['#0a4dcc', '#1E4ABF', null, null], decision: '#1E4ABF', why: { es: 'La lógica más probada', en: 'The most proven logic' } },
  { token: 'Positive', values: ['#10b981', '#17B16D', '#328e2c', '#17B16D'], decision: '#17B16D', why: { es: 'Verde fuerte del oficial', en: 'The official strong green' } },
  { token: 'Negative', values: ['#ef4444', '#CF0E34', '#e9343c', '#CF0E34'], decision: '#CF0E34', why: { es: 'Rojo fuerte del oficial', en: 'The official strong red' } },
  { token: 'Radius lg', values: ['8px', '16px', null, '16px'], decision: '16px', why: { es: 'Thema prefiere radios amplios', en: 'Thema prefers generous radii' }, kind: 'radius' },
]

function Cell({ value, kind, strong }: { value: string | null; kind?: Row['kind']; strong?: boolean }) {
  if (!value) return <span className="mx-auto block h-8 w-8 rounded-md border border-dashed border-fg/20" title="N/A" />
  if (kind === 'radius')
    return (
      <span className={`mx-auto flex h-8 w-8 items-end justify-start border-l-2 border-t-2 ${strong ? 'border-signal' : 'border-fg/40'}`} style={{ borderTopLeftRadius: value }} title={value} />
    )
  return <span className={`mx-auto block h-8 w-8 rounded-md ring-1 ${strong ? 'ring-2 ring-signal ring-offset-2 ring-offset-bg' : 'ring-fg/15'}`} style={{ background: value }} title={value} />
}

/** 02 · Patrones (Thema): la matriz de decisión de tokens, visual. */
export function TokenMatrix() {
  const { t } = useLocale()
  const { patterns } = THEMA_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>

      <div data-reveal="device" className="mt-10 overflow-x-auto rounded-2xl border border-fg/15">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="mono-label border-b border-fg/15 opacity-70">
              <th scope="col" className="px-4 py-3 font-normal">Token</th>
              {SOURCES.map((s) => <th key={s} scope="col" className="px-2 py-3 text-center font-normal">{s}</th>)}
              <th scope="col" className="px-2 py-3 text-center font-normal text-signal">{t({ es: 'Decisión', en: 'Decision' })}</th>
              <th scope="col" className="px-4 py-3 font-normal">{t({ es: 'Motivo', en: 'Reason' })}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.token} data-reveal className="border-b border-fg/10 last:border-0">
                <th scope="row" className="px-4 py-3 font-mono text-xs font-normal">{row.token}</th>
                {row.values.map((v, i) => (
                  <td key={SOURCES[i]} className="px-2 py-3"><Cell value={v} kind={row.kind} /></td>
                ))}
                <td className="bg-signal/[0.06] px-2 py-3"><Cell value={row.decision} kind={row.kind} strong /></td>
                <td className="px-4 py-3 text-xs opacity-75">
                  <span className="block font-mono opacity-70">{row.decision}</span>
                  {t(row.why)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {patterns.columns.filter((c) => c.color === 'pink' || c.color === 'blue').map((col) => (
          <div key={col.title.es} data-reveal className={`rounded-2xl p-6 ${col.color === 'pink' ? 'bg-[#e5484d]/[0.07]' : 'bg-signal/[0.07]'}`}>
            <p className="mono-label mb-4 opacity-70">{t(col.title)}</p>
            <ul className="space-y-2 text-sm">
              {col.notes.map((n) => (
                <li key={n.es} className="flex gap-2">
                  <span aria-hidden="true">{col.color === 'pink' ? '✕' : '·'}</span>
                  {t(n)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ol className="mt-12 space-y-4">
        {patterns.insights.map((insight, i) => (
          <li key={insight.es} data-reveal className="flex gap-5 border-t border-fg/15 pt-4">
            <span className="mono-label shrink-0 text-signal">{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
