'use client'

import { useLocale, type L } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { LogoToApp } from './logo-to-app'

/** Filas reales de docs/TOKEN_DECISION_MATRIX.md: lo que decía cada fuente y lo que se decidió. */
const SOURCES = ['Starter', 'Comparativo', 'Legado', 'Oficial'] as const

interface Row {
  token: string
  values: readonly (string | null)[]
  decision: string
  why: L
  /** Cómo queda en el tema Premium (dorado); null = no cambia con el tema. */
  premium: string | null
  kind?: 'color' | 'radius'
}

const ROWS: readonly Row[] = [
  { token: 'Surface App', values: ['#f3f3f4', '#F4F6F8', '#F3F3F4', '#F4F6F8'], decision: '#F4F6F8', premium: '#F6F1E7', why: { es: 'El oficial gana sobre el legado', en: 'Official beats legacy' } },
  { token: 'Surface Nav', values: ['#0a0a60', '#0A0A60', '#202837', '#0A0A60'], decision: '#0A0A60', premium: '#1C1915', why: { es: 'Navy del sistema oficial', en: 'The official navy' } },
  { token: 'Text Primary', values: ['#121c28', '#303A47', '#303a47', '#303A47'], decision: '#303A47', premium: '#2A2D33', why: { es: 'El oficial gana sobre el starter', en: 'Official beats starter' } },
  { token: 'Brand Hover', values: ['#0a4dcc', '#1E4ABF', null, null], decision: '#1E4ABF', premium: '#8A6420', why: { es: 'La lógica más probada', en: 'The most proven logic' } },
  { token: 'Positive', values: ['#10b981', '#17B16D', '#328e2c', '#17B16D'], decision: '#17B16D', premium: null, why: { es: 'Verde fuerte del oficial', en: 'The official strong green' } },
  { token: 'Negative', values: ['#ef4444', '#CF0E34', '#e9343c', '#CF0E34'], decision: '#CF0E34', premium: null, why: { es: 'Rojo fuerte del oficial', en: 'The official strong red' } },
  { token: 'Radius lg', values: ['8px', '16px', null, '16px'], decision: '16px', premium: '16px', why: { es: 'Thema prefiere radios amplios', en: 'Thema prefers generous radii' }, kind: 'radius' },
]

const GOLD = '#D9B36A'

function Cell({ value, kind, strong }: { value: string | null; kind?: Row['kind']; strong?: boolean }) {
  if (!value) return <span className="mx-auto block h-8 w-8 rounded-md border border-dashed border-fg/20" title="N/A" />
  if (kind === 'radius')
    return (
      <span className="mx-auto flex h-8 w-8 items-end justify-start border-l-2 border-t-2" style={{ borderTopLeftRadius: value, borderColor: strong ? GOLD : 'rgb(var(--fg) / 0.4)' }} title={value} />
    )
  return (
    <span
      className="mx-auto block h-8 w-8 rounded-md"
      style={{ background: value, boxShadow: strong ? `0 0 0 2px rgb(var(--bg)), 0 0 0 4px ${GOLD}, 0 8px 22px -6px ${GOLD}` : 'inset 0 0 0 1px rgb(var(--fg) / 0.15)' }}
      title={value}
    />
  )
}

/** 02 · Patrones (Thema): la matriz de decisión de tokens, visual. */
export function TokenMatrix() {
  const { t } = useLocale()
  const { patterns } = THEMA_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(patterns.lead)}</p>
      <div className="mt-10">
        <LogoToApp />
      </div>

      <h3 data-reveal="mask" className="mb-4 mt-[clamp(4rem,3rem+4vw,6rem)] text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t({ es: 'Por dentro: una decisión por token', en: 'Inside: one decision per token' })}</h3>
      <p data-reveal className="max-w-[62ch] leading-relaxed opacity-80">{t(patterns.matrixLead)}</p>

      <div data-reveal="device" className="mt-10 overflow-x-auto rounded-2xl border border-fg/15">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="mono-label border-b border-fg/15 opacity-70">
              <th scope="col" className="px-4 py-3 font-normal">Token</th>
              {SOURCES.map((s) => <th key={s} scope="col" className="px-2 py-3 text-center font-normal">{s}</th>)}
              <th scope="col" className="px-2 py-3 text-center font-normal">{t({ es: 'Decisión', en: 'Decision' })}</th>
              <th scope="col" className="px-2 py-3 text-center font-normal" style={{ color: GOLD }}>{t({ es: 'Tema Premium', en: 'Premium theme' })}</th>
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
                <td className="px-2 py-3"><Cell value={row.decision} kind={row.kind} /></td>
                <td className="px-2 py-3" style={{ background: 'rgba(217, 179, 106, 0.09)' }}>
                  {row.premium ? (
                    <Cell value={row.premium} kind={row.kind} strong />
                  ) : (
                    <span className="mx-auto block w-fit rounded-full px-2 py-1 text-center text-[10px] leading-tight opacity-70" style={{ boxShadow: `inset 0 0 0 1px ${GOLD}66` }}>{t({ es: 'fijo', en: 'fixed' })}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs opacity-75">
                  <span className="block font-mono" style={{ color: GOLD }}>{row.premium ?? row.decision}</span>
                  {t(row.why)}
                  {!row.premium && <span className="block opacity-70">{t({ es: 'Los significados no cambian con el tema', en: 'Meanings don’t change with the theme' })}</span>}
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
            <span className="mono-label shrink-0" style={{ color: GOLD }}>{t({ es: 'Hallazgo', en: 'Insight' })} 0{i + 1}</span>
            <span className="text-lg leading-snug">{t(insight)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
