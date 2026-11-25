'use client'

import { useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useAutoSteps } from './use-auto-steps'

const GOLD = '#d9b36a'
/** Cada rama se enciende sola, una tras otra, al entrar */
const BRANCH_MS = 650
const LEAF_MS = 70

interface Branch {
  id: string
  /** La necesidad, en palabras de quien usa el calendario */
  need: L
  /** Cómo responde el calendario */
  answer: L
  leaves: readonly L[]
}

const { personalization, dayPanel } = PLATFORM_CASE

const BRANCHES: readonly Branch[] = [
  {
    id: 'ver',
    need: { es: 'Cada quien mira el día distinto', en: 'Everyone looks at the day differently' },
    answer: { es: 'Vistas', en: 'Views' },
    leaves: [
      { es: 'Día · por barbero, para recepción', en: 'Day · by barber, for the front desk' },
      { es: 'Semana · qué días pesan, para el dueño', en: 'Week · which days are heavy, for the owner' },
      { es: 'Mes · el mes de un vistazo', en: 'Month · the month at a glance' },
      { es: 'Agenda · lista, para el barbero en el celular', en: 'Agenda · list, for the barber on the phone' },
    ],
  },
  {
    id: 'tarjeta',
    need: { es: 'Cada persona quiere ver otras cosas', en: 'Each person wants to see different things' },
    answer: { es: 'La tarjeta a su gusto', en: 'The card, their way' },
    leaves: personalization.person,
  },
  {
    id: 'consultar',
    need: { es: 'Saber cómo va el día sin abrir cita por cita', en: 'Know how the day is going without opening every visit' },
    answer: { es: 'Consultar el día', en: 'Query the day' },
    leaves: dayPanel.callouts.slice(1, 5).map((c) => c.title),
  },
  {
    id: 'reglas',
    need: { es: 'Cada barbería trabaja a su manera', en: 'Every shop works its own way' },
    answer: { es: 'Las reglas del negocio', en: 'Business rules' },
    leaves: personalization.business,
  },
]

/**
 * 03 · La idea: un calendario que se arma según lo que necesita cada quien.
 * Del centro salen cuatro ramas (vistas, tarjeta, consultas, reglas) que se
 * encienden solas; tocar una la deja al frente. De abajo sale la fibra a «Forma».
 */
export function NeedsTree() {
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const lit = useAutoSteps(rootRef, BRANCHES.length, BRANCH_MS, 400)
  const [picked, setPicked] = useState<number | null>(null)

  return (
    <div ref={rootRef} className="mx-auto max-w-[1080px]">
      {/* La pregunta, como raíz */}
      <div className="mx-auto flex max-w-[46ch] flex-col items-center text-center">
        <span className="mono-label text-signal">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</span>
        <p className="mt-3 text-balance text-[clamp(1.25rem,1rem+1.1vw,1.9rem)] font-light leading-[1.2] tracking-tight">{t(PLATFORM_CASE.idea.hmw)}</p>
      </div>

      {/* El tronco: un nodo del que salen las cuatro ramas */}
      <div className="relative mt-10 hidden h-20 lg:block" aria-hidden="true">
        <svg viewBox="0 0 1000 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {BRANCHES.map((b, i) => {
            const x = 125 + i * 250
            const on = i < lit
            return (
              <path
                key={b.id}
                d={`M500,6 C500,50 ${x},30 ${x},80`}
                fill="none"
                stroke={on ? GOLD : 'rgba(255,255,255,0.15)'}
                strokeOpacity={picked === null || picked === i ? 0.75 : 0.2}
                strokeWidth={1.2}
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={on ? 0 : 1}
                style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.65,0,.35,1), stroke 400ms, stroke-opacity 400ms' }}
              />
            )
          })}
        </svg>
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgba(217,179,106,0.25),0_0_18px_4px_rgba(217,179,106,0.7)]" />
      </div>

      <ol className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
        {BRANCHES.map((b, i) => {
          const on = i < lit
          const focus = picked === i
          const dim = picked !== null && !focus
          return (
            <li key={b.id} className={`relative flex flex-col items-center text-center transition-opacity duration-500 ${dim ? 'opacity-35' : 'opacity-100'}`}>
              <button type="button" aria-pressed={focus} onClick={() => setPicked(focus ? null : i)} className="group flex flex-col items-center outline-none">
                <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'border-white bg-[#fffaf0] shadow-[0_0_14px_3px_rgba(217,179,106,0.6)]' : 'border-white/30 bg-void'} ${focus ? 'scale-125' : 'group-hover:scale-110'}`} />
                  {focus && <span className="pl-hot absolute inset-0 rounded-full border border-[#d9b36a]" />}
                </span>
                <span className="mt-4 text-balance text-[13px] leading-snug text-paper/55">{t(b.need)}</span>
                <span className={`mt-1.5 text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] font-light tracking-tight transition-colors duration-500 ${on ? 'text-paper' : 'text-paper/40'}`}>{t(b.answer)}</span>
              </button>
              {/* Las hojas: lo que se puede ajustar, una por una */}
              <ul className="relative mt-5 w-full space-y-2.5 border-l border-white/10 pl-4 text-left">
                {b.leaves.map((leaf, j) => (
                  <li
                    key={leaf.es}
                    className={`relative text-[13px] leading-snug text-paper/75 ${on ? 'pl-fade' : 'invisible'}`}
                    style={{ animationDelay: `${j * LEAF_MS}ms` }}
                  >
                    <span aria-hidden="true" className="absolute -left-[19px] top-[0.45em] h-1.5 w-1.5 rounded-full" style={{ background: on ? GOLD : 'transparent' }} />
                    {t(leaf)}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>

      {/* De aquí baja la fibra hasta «Forma» */}
      <span aria-hidden="true" className="relative mx-auto mt-14 block h-2 w-2 rounded-full bg-white/60 shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
        <span data-fiber-from="pl-forma" className="absolute left-1/2 top-1/2 h-px w-px" />
      </span>
    </div>
  )
}
