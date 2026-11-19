'use client'

import { useLocale } from '@/lib/i18n'
import { LEARNINGS, RECEIPTS, type Receipt } from '@/lib/content/cases/sellup/sellup-agents'
import { BLUE, useInView } from './ui'

/** Borde dentado de un recibo impreso. */
const ZIGZAG = 'linear-gradient(-45deg,transparent 6px,#fdfdfb 0),linear-gradient(45deg,transparent 6px,#fdfdfb 0)'

/** Un recibo de corrida que se «imprime» al entrar en pantalla. */
function ReceiptSlip({ r, i }: { r: Receipt; i: number }) {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  return (
    <div ref={ref} className="relative">
      <div className="mx-auto h-2 w-[92%] rounded-full bg-black/80" aria-hidden="true" />
      <div
        className="relative -mt-1 transition-[clip-path] ease-linear"
        style={{ clipPath: seen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', transitionDuration: '1600ms', transitionDelay: `${i * 250}ms` }}
      >
        <article className="mx-[4%] bg-[#fdfdfb] px-5 pb-6 pt-5 font-mono text-[12px] text-[#1b1d22] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]">
          <p className="flex items-center justify-between text-[10px] uppercase tracking-wider text-black/45"><span>SellUp · {t(r.agent)}</span><span>{r.date}</span></p>
          <p className="mt-2 font-sans text-base font-medium">{t(r.title)}</p>
          <p className="my-3 border-t border-dashed border-black/25" />
          <ul className="space-y-1.5">
            {r.lines.map((l) => (
              <li key={l.label.es} className="flex justify-between gap-3"><span className="text-black/60">{t(l.label)}</span><span>{l.value}</span></li>
            ))}
          </ul>
          <p className="my-3 border-t border-dashed border-black/25" />
          <p className="flex items-baseline justify-between gap-3 text-sm font-semibold"><span>{t(r.total.label)}</span><span style={{ color: BLUE }}>{r.total.value}</span></p>
          <p className="mt-4 font-sans text-xs leading-relaxed text-black/60">{t(r.note)}</p>
        </article>
        <div className="mx-[4%] h-3" style={{ background: ZIGZAG, backgroundSize: '12px 12px', backgroundPosition: 'left top', transform: 'rotate(180deg)' }} aria-hidden="true" />
      </div>
    </div>
  )
}

/** 07 · Impacto: recibos de corridas reales y lo aprendido. */
export function SellUpImpact() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal="mask" className="max-w-[26ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Cuánto cuesta una buena decisión, con recibo.', en: 'What a good decision costs, with a receipt.' })}
      </p>
      <p data-reveal className="mt-6 max-w-[62ch] leading-relaxed opacity-80">
        {t({ es: 'Como cada corrida queda registrada, el impacto no es una estimación: son corridas reales de Producción en octubre de 2026, con su fecha. SellUp se entregó limpio, así que aún no hay cifras de reuniones o ventas que atribuirle.', en: 'Since every run is logged, impact isn’t an estimate: these are real Production runs from October 2026, with their dates. SellUp shipped clean, so there are no meeting or sales figures to attribute to it yet.' })}
      </p>
      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-5">
        {RECEIPTS.map((r, i) => <ReceiptSlip key={r.title.es} r={r} i={i} />)}
      </div>
      <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-fg/15 pt-10 lg:grid-cols-4">
        {[
          { v: '≈ US$0,45', l: { es: 'por búsqueda de empresas, en promedio', en: 'per company search, on average' } },
          { v: '≈ US$0,03', l: { es: 'por búsqueda de contactos', en: 'per contact search' } },
          { v: 'US$0,10–0,25', l: { es: 'la primera preparación de una empresa', en: 'a company’s first preparation' } },
          { v: '1.951', l: { es: 'empresas verificadas en el banco gratis', en: 'verified companies in the free bank' } },
        ].map((s) => (
          <div key={s.l.es} data-reveal>
            <dt className="sr-only">{t(s.l)}</dt>
            <dd>
              <span className="block whitespace-nowrap text-[clamp(1.5rem,1rem+1.3vw,2.4rem)] font-light leading-none tabular-nums text-signal">{s.v}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.l)}</span>
            </dd>
          </div>
        ))}
      </dl>
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
