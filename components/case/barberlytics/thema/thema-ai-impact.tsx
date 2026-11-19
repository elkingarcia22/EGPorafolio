'use client'

import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { AiChatFlow } from './ai-chat-flow'

/** Panel tipo editor/terminal para mostrar archivos y comandos. */
function CodePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure data-reveal="device" className="overflow-hidden rounded-xl bg-[#0d0e11] text-[#e9e6dd] ring-1 ring-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
      <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/55">
        <span className="h-2 w-2 rounded-full bg-[#d9b36a]" aria-hidden="true" />
        {title}
      </figcaption>
      <div className="space-y-1.5 p-5 font-mono text-[12px] leading-relaxed">{children}</div>
    </figure>
  )
}

/** 06 · IA en el proceso: las cinco reglas, el catálogo, las validaciones y el guardián. */
export function ThemaAi() {
  const { t } = useLocale()
  const { ai } = THEMA_CASE
  return (
    <div>
      <p data-reveal="mask" className="max-w-[30ch] text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t(ai.lead)}</p>

      <p data-reveal className="mono-label mb-5 mt-14 opacity-60">{t({ es: 'Las cinco reglas · AGENTS.md', en: 'The five rules · AGENTS.md' })}</p>
      <ol className="space-y-1">
        {ai.rules.map((rule, i) => (
          <li key={rule.es} data-reveal className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-t border-fg/15 py-4">
            <span className="text-3xl font-light text-signal">{i + 1}</span>
            <span className="text-lg leading-snug">{t(rule)}</span>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <CodePanel title="ai-tools/CATALOG.md">
          {ai.catalogLines.map((line, i) => (
            <p key={line} className={i === 0 ? 'mb-3 text-[#d9b36a]' : 'text-white/80'}>{line}</p>
          ))}
          <p className="pt-2 text-white/40">{t({ es: '# generado con npm run catalog · no se edita a mano', en: '# generated with npm run catalog · never hand-edited' })}</p>
        </CodePanel>
        <CodePanel title={t({ es: 'terminal · reglas que revisa', en: 'terminal · rules it checks' })}>
          <p className="mb-3 text-white/60">$ npm run check</p>
          {ai.checks.map((check) => (
            <p key={check.es}>
              <span className="text-[#7fd8af]">✓</span> <span className="text-white/85">{t(check)}</span>
            </p>
          ))}
        </CodePanel>
      </div>

      <dl className="mt-10 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-3">
        {ai.layers.map((layer) => (
          <div key={layer.title.es} data-reveal className="bg-bg p-6">
            <dt className="font-medium">{t(layer.title)}</dt>
            <dd className="mt-2 text-sm leading-relaxed opacity-70">{t(layer.body)}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: 'Así se ve un pedido de principio a fin', en: 'A request, start to finish' })}</p>
        <AiChatFlow />
      </div>
    </div>
  )
}

const MAX_GROWTH = Math.max(...THEMA_CASE.impact.growth.bars.map((b) => b.value))

/** 07 · Impacto: cifras del sistema y del equipo, crecimiento y aprendizajes. */
export function ThemaImpact() {
  const { t } = useLocale()
  const { impact } = THEMA_CASE
  return (
    <div>
      <p data-reveal="mask" className="max-w-[34ch] text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t(impact.lead)}</p>

      <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
        {impact.kpis.map((kpi) => (
          <div key={kpi.label.es} data-reveal className="flex flex-col bg-bg p-6">
            <dt className="mono-label opacity-60">{t(kpi.label)}</dt>
            <dd className="mt-5 flex items-baseline gap-1">
              <span data-count={kpi.value} className="text-[clamp(2.8rem,2rem+2.4vw,4.2rem)] font-light leading-none tabular-nums">{kpi.value}</span>
              <span className="text-2xl font-light">{kpi.unit}</span>
            </dd>
            <dd className="mt-3 text-sm opacity-60">{t(kpi.note)}</dd>
          </div>
        ))}
      </dl>

      <figure data-reveal className="mt-8 border border-fg/15 p-6">
        <figcaption className="mono-label mb-6 opacity-70">{t(impact.growth.title)}</figcaption>
        <div className="space-y-4">
          {impact.growth.bars.map((bar, i) => (
            <div key={bar.label.es} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-4 text-sm">
              <span className="opacity-70">{t(bar.label)}</span>
              <span className="h-7 bg-fg/10">
                <span data-reveal="right" className={`block h-full ${i === impact.growth.bars.length - 1 ? 'bg-signal' : 'bg-fg/40'}`} style={{ width: `${(bar.value / MAX_GROWTH) * 100}%` }} />
              </span>
              <span className="text-right tabular-nums">{bar.value}</span>
            </div>
          ))}
        </div>
      </figure>

      <ul className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
        {impact.quality.map((q) => (
          <li key={q.label.es} data-reveal>
            <span className="block text-3xl font-light tabular-nums">{q.value}</span>
            <span className="text-sm opacity-65">{t(q.label)}</span>
          </li>
        ))}
      </ul>

      <ol className="mt-14 grid gap-8 md:grid-cols-2">
        {impact.learnings.map((l, i) => (
          <li key={l.es} data-reveal className="border-t border-fg/15 pt-3">
            <span className="mono-label text-signal">{t({ es: 'Aprendizaje', en: 'Learning' })} 0{i + 1}</span>
            <p className="mt-2 text-lg leading-snug">{t(l)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
