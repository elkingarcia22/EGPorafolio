'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BrowserFrame } from './form-moments'
import { UBITS_BLUE, useTicker } from './shared'

const ROUTE = '/admin/desempeno-cultura/encuestas'

/** Los cinco atajos del inicio, con su ícono «glass» real del design system (playground, `crea-algo-nuevo.tsx`). */
export const TEMPLATES: readonly { name: string; hint: L; color: string; icon: string; detail: L }[] = [
  { name: 'NOM 035', icon: '/cases/encuestas/glass/nom035.webp', hint: { es: 'Cumple la norma en México', en: 'Meets the Mexican norm' }, color: '#22a06b', detail: { es: 'Cuestionario oficial de solo lectura · exige el 100 % de participación y al menos un dato demográfico', en: 'Read-only official questionnaire · requires 100% participation and at least one demographic' } },
  { name: 'Universidad Corporativa', icon: '/cases/encuestas/glass/universidad.webp', hint: { es: 'Mide la formación', en: 'Measures learning' }, color: '#e8743b', detail: { es: 'Lista para medir la experiencia de formación', en: 'Ready to measure the learning experience' } },
  { name: 'Cultura', icon: '/cases/encuestas/glass/cultura.webp', hint: { es: 'Mide tus valores', en: 'Measures your values' }, color: '#d9467a', detail: { es: 'Versión corta de 30 preguntas o completa de 50, para comparar año a año', en: 'Short 30-question or full 50-question version, to compare year over year' } },
  { name: 'Clima', icon: '/cases/encuestas/glass/clima.webp', hint: { es: 'Mide el ambiente laboral', en: 'Measures the work climate' }, color: '#d14b8f', detail: { es: 'Diez secciones · 30 o 50 preguntas, mismas secciones y mismo nombre', en: 'Ten sections · 30 or 50 questions, same sections and name' } },
  { name: 'eNPS', icon: '/cases/encuestas/glass/enps.webp', hint: { es: 'Mide si te recomiendan', en: 'Measures if they recommend you' }, color: '#7a5cf0', detail: { es: 'De 0 a 10 · detractores 0–6, neutros 7–8, promotores 9–10', en: '0 to 10 · detractors 0–6, passives 7–8, promoters 9–10' } },
]

/** Momento 1: las cinco plantillas se abren en abanico y una pasa al frente. */
export function TemplatesFan() {
  const { t } = useLocale()
  const tick = useTicker(2400)
  const [picked, setPicked] = useState<number | null>(null)
  const active = picked ?? tick % TEMPLATES.length
  const mid = (TEMPLATES.length - 1) / 2
  return (
    <BrowserFrame route={ROUTE}>
      <div className="relative px-4 pb-6 pt-5 sm:px-8">
        <p className="text-lg font-semibold">{t({ es: 'Encuestas', en: 'Surveys' })}</p>
        <p className="text-xs text-[#5c646f]">{t({ es: 'Elige por dónde empezar', en: 'Choose where to start' })}</p>
        <div className="relative mx-auto mt-6 h-[13.5rem] max-w-[34rem] [--spread:2.4rem] sm:h-[15rem] sm:[--spread:4.4rem]" role="radiogroup" aria-label={t({ es: 'Plantillas', en: 'Templates' })}>
          {TEMPLATES.map((tp, i) => {
            const on = i === active
            const off = i - mid
            return (
              <button
                key={tp.name}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPicked(i)}
                className="absolute bottom-0 left-1/2 w-[7.2rem] origin-bottom rounded-2xl border bg-white p-3 text-left shadow-[0_18px_40px_-18px_rgba(10,11,13,0.45)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[9rem]"
                style={{
                  transform: `translateX(calc(-50% + ${on ? 0 : off} * var(--spread))) rotate(${on ? 0 : off * 9}deg) translateY(${on ? -2.4 : Math.abs(off) * 0.5}rem) scale(${on ? 1.18 : 0.92})`,
                  zIndex: on ? 20 : 10 - Math.abs(Math.round(off)),
                  borderColor: on ? UBITS_BLUE : 'rgba(0,0,0,0.08)',
                }}
              >
                <span className="flex h-16 items-center justify-center sm:h-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tp.icon} alt="" width={64} height={64} className="h-12 w-12 select-none sm:h-14 sm:w-14" draggable={false} />
                </span>
                <span className="mt-2 block text-[11px] font-semibold leading-tight sm:text-xs">{t({ es: 'Crear', en: 'Create' })} {tp.name}</span>
                <span className="block text-[10px] leading-tight text-[#5c646f]">{t(tp.hint)}</span>
              </button>
            )
          })}
        </div>
        <div key={active} className="enc-fade mx-auto mt-6 flex max-w-[34rem] items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
          <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: TEMPLATES[active].color }} />
          <p className="min-w-0 flex-1 text-xs leading-snug text-[#414a5c]">{t(TEMPLATES[active].detail)}</p>
          <span className="hidden shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white sm:inline" style={{ background: UBITS_BLUE }}>{t({ es: 'Usar plantilla', en: 'Use template' })}</span>
        </div>
      </div>
    </BrowserFrame>
  )
}
