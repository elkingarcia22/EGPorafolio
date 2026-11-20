'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { useTick } from '../barberlytics/thema/live-pieces'
import { Building2, PhoneCall, Users } from 'lucide-react'
import { useInView } from './ui'

/** 03 · La idea: tres preguntas, tres agentes y una persona entre cada uno. */

interface Link {
  q: L
  agent: L
  out: L
}

const CHAIN: readonly Link[] = [
  { q: { es: '¿A qué empresa?', en: 'Which company?' }, agent: { es: 'Agente 1', en: 'Agent 1' }, out: { es: 'Empresa verificada y libre', en: 'Verified, unowned company' } },
  { q: { es: '¿A quién?', en: 'Who?' }, agent: { es: 'Agente 2', en: 'Agent 2' }, out: { es: 'La persona que decide', en: 'The person who decides' } },
  { q: { es: '¿Qué le digo?', en: 'What do I say?' }, agent: { es: 'Agente 3', en: 'Agent 3' }, out: { es: 'Primer contacto con contexto', en: 'First contact with context' } },
]

/** Cadena animada: un pulso recorre los agentes y se detiene en cada persona. */
function Chain() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const tick = useTick(560)
  // 0..5: agente, persona, agente, persona, agente, persona (llamada)
  const at = reducedMotion ? 5 : tick % 7
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[8%] right-[8%] top-[46px] hidden h-px bg-white/10 md:block" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#285ee6] via-[#d22d6a] to-[#eb6233] transition-[width] duration-1000 ease-linear" style={{ width: seen ? `${Math.min(at, 5) * 20}%` : '0%' }} />
      </div>
      <ol className="relative grid gap-6 md:grid-cols-3">
        {CHAIN.map((c, i) => {
          const lit = seen && at >= i * 2
          const approved = seen && at >= i * 2 + 1
          return (
            <li key={c.q.es} className="relative text-center">
              <div className={`mx-auto grid h-[92px] w-[92px] place-items-center rounded-full ring-1 transition-all duration-700 ${lit ? 'ring-[#7e2be0]/70 shadow-[0_0_60px_rgba(126,43,224,0.45)]' : 'ring-white/10'}`} style={{ background: '#0d0e10' }}>
                {(() => { const Icon = [Building2, Users, PhoneCall][i]; return <Icon className={`transition-all duration-700 ${lit ? 'h-9 w-9 text-white' : 'h-7 w-7 text-white/35'}`} strokeWidth={1.5} /> })()}
              </div>
              <p className="mono-label mt-4 text-white/50">{t(c.agent)}</p>
              <p className={`mt-1 text-[clamp(1.6rem,1rem+1.6vw,2.6rem)] font-light leading-tight transition-colors duration-700 ${lit ? 'text-white' : 'text-white/35'}`}>{t(c.q)}</p>
              <p className={`mx-auto mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition-all duration-700 ${approved ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/40' : 'text-white/40 ring-white/10'}`}>
                <span aria-hidden="true">{approved ? '✓' : '◉'}</span>
                {approved ? t(c.out) : t({ es: 'Una persona aprueba', en: 'A person approves' })}
              </p>
            </li>
          )
        })}
      </ol>
      <p className={`mt-10 text-center text-sm transition-all duration-700 ${seen && at >= 5 ? 'text-[#b7c6ff] opacity-100' : 'opacity-0'}`}>
        {t({ es: '→ El vendedor llama sabiendo a quién, por qué y qué decir.', en: '→ The rep calls knowing who, why and what to say.' })}
      </p>
    </div>
  )
}

export function SellUpIdea() {
  const { t } = useLocale()
  const idea = SELLUP_CASE.idea
  return (
    <div>
      <p data-reveal className="mono-label mb-5 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[30ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: '…hacer que cada vendedor llegue a la primera llamada sabiendo a qué empresa, a quién y qué decirle?', en: '…get every rep to the first call knowing which company, who, and what to say?' })}
      </p>
      <div className="mt-16"><Chain /></div>
      <ul className="mt-20 grid gap-px overflow-hidden rounded-[18px] bg-white/10 sm:grid-cols-2">
        {idea.principles.map((p, i) => (
          <li key={p.title.es} data-reveal className="bg-[#0d0e10] p-6">
            <span className="mono-label text-signal">0{i + 1}</span>
            <p className="mt-3 text-lg leading-snug">{t(p.title)}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60 max-md:hidden">{t(p.body)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
