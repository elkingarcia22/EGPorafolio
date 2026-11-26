'use client'

import Image from 'next/image'
import { useLocale, type L } from '@/lib/i18n'
import { BUILDER, ORB, REQUEST, SECTIONS } from '@/lib/content/cases/encuestas/orbit-real'
import { PhonePager } from './phone-kit'

interface OrbitPhoneProps {
  step: number
  steps: number
  go: (i: number) => void
  style: string
  size: string
  perSub: number
  process: readonly { value: string; label: L }[]
  reducedMotion: boolean
}

function Bubble({ show, me = false, children }: { show: boolean; me?: boolean; children: React.ReactNode }) {
  if (!show) return null
  return (
    <p className={`obj-fade max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-snug ${me ? 'self-end rounded-br-md bg-white/[0.08] text-paper' : 'self-start rounded-bl-md border border-white/10 text-paper/80'}`}>{children}</p>
  )
}

/**
 * IA en el teléfono: el orbe arriba, del que baja la conversación real, una
 * burbuja por paso. Cuando Orbit arma, la conversación cede el lugar a la
 * encuesta que crece. Pasa sola y se desliza de lado.
 */
export function OrbitPhone({ step, steps, go, style, size, perSub, process, reducedMotion }: OrbitPhoneProps) {
  const { t } = useLocale()
  const thinking = step === 3
  const built = step >= 3

  return (
    <div className="mx-auto mt-6 max-w-[360px]">
      <div className="flex items-center gap-4">
        <span className="relative grid h-16 w-16 shrink-0 place-items-center">
          <span className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgb(var(--signal)/0.4),transparent_70%)]" aria-hidden="true" />
          <Image src={ORB} alt={t({ es: 'Orbit, el agente de UBITS', en: 'Orbit, UBITS’s agent' })} width={64} height={64} className="relative h-full w-full rounded-full object-cover" style={{ animation: reducedMotion ? 'none' : `${thinking ? 'orb-think 1.2s' : 'orb-breathe 4s'} ease-in-out infinite` }} />
          {/* Del centro del orbe sale la fibra hacia «Impacto» */}
          <span data-fiber-from="enc-impacto" aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
        <span>
          <span className="block text-[18px]">Orbit</span>
          <span key={thinking ? 'r' : 'o'} className="obj-fade mt-0.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">{thinking ? BUILDER.reasoned : t({ es: 'Agente de UBITS', en: 'UBITS agent' })}</span>
        </span>
      </div>

      <div className="relative mt-5 min-h-[17rem] border-l border-signal/40 pl-4" aria-live="polite">
        {!built ? (
          <div className="flex flex-col gap-2.5">
            <Bubble show me>{REQUEST}</Bubble>
            <Bubble show={step >= 1}>{BUILDER.styleQuestion} <span className="ml-1 whitespace-nowrap rounded-full bg-signal/20 px-2 py-0.5 text-paper">{style}</span></Bubble>
            <Bubble show={step >= 2}>{BUILDER.sizeQuestion} <span className="ml-1 whitespace-nowrap rounded-full bg-signal/20 px-2 py-0.5 text-paper">{size}</span></Bubble>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {SECTIONS.map((s, si) => (
              <div key={s.n} className="obj-fade" style={{ animationDelay: reducedMotion ? undefined : `${si * 220}ms` }}>
                <p className="text-[16px] leading-snug"><span className="mr-2 font-mono text-[12px] text-signal">{s.n}</span>{s.title}</p>
                <ul className="mt-2 space-y-2 border-l border-white/12 pl-4">
                  {s.subs.map((sub, k) => (
                    <li key={sub.n} className="flex items-center gap-3 text-[14px] text-paper/70">
                      <span className="min-w-0 flex-1 truncate">{sub.title}</span>
                      <span className="flex gap-1" aria-label={`${perSub} ${t({ es: 'preguntas', en: 'questions' })}`}>
                        {Array.from({ length: perSub }, (_, q) => (
                          <span key={q} className="enc-pop h-1.5 w-1.5 rounded-full bg-signal" style={{ animationDelay: reducedMotion ? undefined : `${si * 220 + k * 120 + q * 60 + 200}ms` }} />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {step >= 4 && <p className="obj-fade rounded-2xl border border-white/10 px-4 py-3 text-[15px] text-paper/80">{BUILDER.done.split('. ')[1]}.</p>}
          </div>
        )}
      </div>

      <PhonePager count={steps} index={step} onPick={go} label={(i) => `${t({ es: 'Paso', en: 'Step' })} ${i + 1}`} />

      {/* Cómo se hizo con IA, en tres cifras que se pasan de lado */}
      <dl className="swipe-row mt-8">
        {process.map((p) => (
          <div key={p.label.es} className="!basis-[62%] rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <dt className="sr-only">{t(p.label)}</dt>
            <dd>
              <span className="block text-[34px] font-light leading-none text-signal tabular-nums">{p.value}</span>
              <span className="mt-3 block text-[14px] leading-snug text-paper/65">{t(p.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
