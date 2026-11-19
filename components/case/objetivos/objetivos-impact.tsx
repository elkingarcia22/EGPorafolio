'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'

/** Cuánto llena la barra de cada mejora, solo para dar escala visual entre ellas. */
const FILL = [0.62, 0.5, 0.42, 0.78]

/** 07 · Impacto: las mejoras esperadas (de referencia), lo construido y lo aprendido. */
export function ObjetivosImpact() {
  const { t } = useLocale()
  const { impact } = OBJ_CASE
  return (
    <div>
      <p data-reveal className="max-w-[60ch] text-lg leading-relaxed opacity-80">{t(impact.lead)}</p>

      <div data-reveal className="mt-10 overflow-hidden rounded-3xl bg-[#0b0d16] p-6 text-white md:p-10">
        <p className="mb-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className="rounded-full bg-white px-2.5 py-1 text-[#0b0d16]">{t({ es: 'Cifras de referencia', en: 'Reference figures' })}</span>
          <span className="text-white/50">{t({ es: 'Lo que esperamos mover; no son medidas en producción', en: 'What we expect to move; not measured in production' })}</span>
        </p>
        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {impact.reference.map((m, i) => (
            <div key={m.label.es} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">{t(m.label)}</dt>
              <dd>
                <span className="mt-3 block whitespace-nowrap bg-gradient-to-r from-[#9f8cff] to-[#4f86ff] bg-clip-text text-[clamp(2.6rem,1.8rem+2.4vw,4.2rem)] font-light leading-none text-transparent tabular-nums">
                  {m.prefix}
                  <span data-count={m.value}>{m.value}</span>
                  <span className="text-[0.45em]">{m.suffix}</span>
                </span>
                <span className="mt-4 block h-1 overflow-hidden rounded-full bg-white/10">
                  <span className="obj-bar block h-full rounded-full bg-gradient-to-r from-[#7b5cff] to-[#0c5bef]" style={{ width: `${FILL[i] * 100}%`, animationDelay: `${300 + i * 120}ms` }} />
                </span>
                <span className="mt-3 block text-sm leading-snug text-white/65">{t(m.detail)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p data-reveal className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y border-fg/15 py-5">
        <span className="mono-label opacity-60">{t({ es: 'Lo construido', en: 'What was built' })}</span>
        {impact.built.map((s) => (
          <span key={s.label.es} className="text-sm">
            <b data-count={s.value} className="mr-1.5 text-2xl font-light tabular-nums">{s.value}</b>
            <span className="opacity-70">{t(s.label)}</span>
          </span>
        ))}
      </p>

      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {impact.learnings.map((l, i) => (
          <li key={l.es} data-reveal className="border-t-2 border-signal pt-4">
            <span className="mono-label text-signal">{t({ es: 'Aprendí', en: 'Learned' })} 0{i + 1}</span>
            <p className="mt-2 leading-snug">{t(l)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
