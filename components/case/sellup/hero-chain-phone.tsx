'use client'

import { useLocale } from '@/lib/i18n'
import { AGENTS } from './hero-chain'

/** Los colores de la rama de SellUp, de arriba abajo */
const CHAIN = 'linear-gradient(to bottom,#285ee6,#7e2be0 40%,#d22d6a 72%,#eb6233)'

interface HeroChainPhoneProps {
  /** Paso de la señal: 0 agente 1 · 1 persona · 2 agente 2 · 3 persona · 4 agente 3 · 5 listo · 6 pausa */
  step: number
  travelling: boolean
}

/**
 * La portada en teléfono: la misma rama, de pie. Una fibra baja por la izquierda
 * y se va encendiendo; en ella, los tres agentes como nodos con halo y, entre
 * uno y otro, la persona que aprueba. Todo el texto es HTML a tamaño de lectura.
 */
export function HeroChainPhone({ step, travelling }: HeroChainPhoneProps) {
  const { t } = useLocale()
  /** Hasta dónde llega la fibra encendida (0–1): un tramo por paso */
  const progress = Math.min(1, step / 4)

  return (
    <figure className="mx-auto w-full max-w-[360px]">
      <ol className="relative" aria-label={t({ es: 'Tres agentes en cadena; una persona aprueba entre cada uno', en: 'Three chained agents; a person approves between each' })}>
        {/* La fibra: tenue entera, encendida hasta donde va la señal */}
        <span aria-hidden="true" className="absolute bottom-[34px] left-[27px] top-[34px] w-[2px] overflow-hidden rounded-full opacity-30" style={{ background: CHAIN }} />
        <span aria-hidden="true" className="absolute bottom-[34px] left-[27px] top-[34px] w-[2px] overflow-hidden rounded-full">
          <span className="block w-full origin-top transition-transform duration-1000 ease-out" style={{ height: '100%', background: CHAIN, transform: `scaleY(${progress})`, boxShadow: '0 0 10px rgb(var(--signal))' }} />
          {travelling && <span key={step} className="su-drip absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-white to-transparent" style={{ top: `${(progress - 0.25) * 100}%` }} />}
        </span>

        {AGENTS.map((n, i) => {
          const lit = step >= i * 2
          const done = i < 2 ? step >= i * 2 + 1 : step >= 5
          const gateOk = step >= i * 2 + 1
          return (
            <li key={n.x}>
              <div className="flex items-center gap-5">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center" aria-hidden="true">
                  <span className="absolute inset-[-10px] rounded-full bg-signal/10 transition-opacity duration-700" style={{ opacity: lit ? 1 : 0 }} />
                  <span className="absolute inset-0 rounded-full transition-opacity duration-700" style={{ background: 'conic-gradient(from 200deg,#285ee6,#7e2be0,#d22d6a,#eb6233,#285ee6)', opacity: lit ? 1 : 0.15 }} />
                  <span className="absolute inset-[3px] rounded-full bg-void" />
                  <span className={`relative text-[17px] font-light tabular-nums transition-opacity duration-700 ${lit ? 'opacity-100' : 'opacity-40'}`}>{String(i + 1).padStart(2, '0')}</span>
                  {i === AGENTS.length - 1 && <span data-fiber-from="su-puntos" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[21px] font-light leading-tight transition-opacity duration-700 ${lit ? 'opacity-100' : 'opacity-45'}`}>{t(n.q)}</span>
                  <span key={String(done)} className={`su-fade mt-1 block font-mono text-[11px] uppercase tracking-[0.12em] ${done ? 'text-[#6ee7b7]' : 'text-paper/50'}`}>{done ? `✓ ${t(n.out)}` : t(n.agent)}</span>
                </span>
              </div>

              {/* La persona entre un agente y el siguiente */}
              {i < AGENTS.length - 1 && (
                <div className="flex items-center gap-5 py-5 pl-[17px]" aria-label={gateOk ? t({ es: 'Persona aprueba', en: 'Person approves' }) : t({ es: 'Persona', en: 'Person' })}>
                  <span className="relative grid h-[22px] w-[22px] shrink-0 place-items-center" aria-hidden="true">
                    {gateOk && step === i * 2 + 1 && <span className="absolute inset-0 rounded-full border-2 border-[#34d399] animate-[nav-node-ping_1.6s_cubic-bezier(0,0,.2,1)_infinite]" />}
                    <span className={`grid h-full w-full place-items-center rounded-full border text-[11px] font-bold transition-all duration-500 ${gateOk ? 'border-white bg-[#34d399] text-[#06281c] shadow-[0_0_14px_rgb(52_211_153/0.6)]' : 'border-white/40 bg-void text-transparent'}`}>✓</span>
                  </span>
                  <span className={`pl-[3px] text-[14px] transition-colors duration-500 ${gateOk ? 'text-paper/85' : 'text-paper/45'}`}>{gateOk ? t({ es: 'La persona aprueba', en: 'The person approves' }) : t({ es: 'Una persona revisa', en: 'A person reviews' })}</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
      <figcaption className="mt-7 text-balance text-[14px] leading-snug text-paper/55">
        {t({ es: 'Nada pasa al siguiente agente sin que una persona lo apruebe.', en: 'Nothing moves to the next agent until a person approves it.' })}
      </figcaption>
    </figure>
  )
}
