'use client'

import { useLocale } from '@/lib/i18n'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { ClipperOrb } from '../clipper-orb'

/** 06 · IA en el proceso: Clipper en la reserva y la IA en cómo se construyó. */
export function BookingAi() {
  const { t } = useLocale()
  const { product, build } = BOOKING_CASE.ai
  return (
    <div>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div data-reveal className="mb-6 flex items-center gap-4">
            <ClipperOrb size={56} />
            <h3 className="text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(product.title)}</h3>
          </div>
          <p data-reveal className="leading-relaxed opacity-80">{t(product.body)}</p>
        </div>

        {/* De la frase a la reserva */}
        <div className="lg:col-span-7">
          <div data-reveal className="border border-fg/15 p-6">
            <p className="mono-label mb-3 opacity-60">{t({ es: 'El cliente escribe', en: 'The client types' })}</p>
            <p className="text-2xl font-light">«{t(product.phrase)}»</p>
          </div>
          <p data-reveal className="mono-label my-3 text-center text-signal">↓ {t({ es: 'reglas, sin modelo', en: 'rules, no model' })} ↓</p>
          <dl data-reveal className="grid grid-cols-2 gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-4">
            {product.parsed.map((p) => (
              <div key={p.key.es} className="bg-bg p-4">
                <dt className="mono-label opacity-60">{t(p.key)}</dt>
                <dd className="mt-2 text-lg">{t(p.value)}</dd>
              </div>
            ))}
          </dl>
          <p data-reveal className="mt-4 border-l-2 border-signal pl-4 text-sm leading-relaxed opacity-80">{t(product.result)}</p>
        </div>
      </div>

      <div className="mt-[clamp(4rem,3rem+4vw,7rem)]">
        <h3 data-reveal className="mb-8 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(build.title)}</h3>
        <ol className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 md:grid-cols-4">
          {build.steps.map((step, i) => (
            <li key={step.title.es} data-reveal className="bg-bg p-6">
              <span className="mono-label text-signal">0{i + 1}</span>
              <p className="mt-3 font-medium">{t(step.title)}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{t(step.body)}</p>
            </li>
          ))}
        </ol>
        <p data-reveal className="mt-10 flex flex-wrap items-baseline gap-4">
          <span className="text-[clamp(3rem,2rem+3vw,5rem)] font-light leading-none text-signal">{build.days.value}</span>
          <span className="max-w-[30ch] text-lg leading-snug opacity-80">{t(build.days.label)}</span>
        </p>
      </div>
    </div>
  )
}

/** 07 · Impacto: cifras del producto, lo que se cerró y lo que falta. */
export function BookingImpact() {
  const { t } = useLocale()
  const { impact } = BOOKING_CASE
  return (
    <div>
      <p data-reveal className="mb-10 max-w-[62ch] text-sm opacity-60">{t(impact.note)}</p>
      <dl className="grid grid-cols-2 gap-px overflow-hidden border border-fg/15 bg-fg/15 lg:grid-cols-4">
        {impact.metrics.map((m) => (
          <div key={m.label.es} data-reveal className="bg-bg p-6">
            <dt className="sr-only">{t(m.label)}</dt>
            <dd>
              <span className="block text-[clamp(2.6rem,1.8rem+2.4vw,4rem)] font-light leading-none tabular-nums">{m.value}{m.suffix}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(m.label)}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <div>
          <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: 'Lo que se cerró', en: 'What got closed' })}</p>
          <ul className="space-y-3">
            {impact.closed.map((item) => (
              <li key={item.es} data-reveal className="flex gap-3">
                <span className="text-signal" aria-hidden="true">✓</span>
                <span>{t(item)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: 'Aprendizajes', en: 'Learnings' })}</p>
          <ol className="space-y-5">
            {impact.learnings.map((l, i) => (
              <li key={l.es} data-reveal className="border-t border-fg/15 pt-3">
                <span className="mono-label text-signal">0{i + 1}</span>
                <p className="mt-2 text-lg leading-snug">{t(l)}</p>
              </li>
            ))}
          </ol>
          <p data-reveal className="mt-8 border-l-2 border-fg/30 pl-4 text-sm leading-relaxed opacity-70">{t(impact.pending)}</p>
        </div>
      </div>
    </div>
  )
}
