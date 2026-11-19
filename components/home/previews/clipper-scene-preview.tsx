'use client'

import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { ClipperOrb, type ClipperOrbState } from '@/components/case/barberlytics/clipper-orb'
import { useTick } from '@/components/case/barberlytics/thema/live-pieces'
import { AI_GRADIENT } from '@/components/case/barberlytics/clipper/clipper-pieces'

const STEPS = 6
const STEP_MS = 1300

function Bubble({ on, className, children }: { on: boolean; className: string; children: React.ReactNode }) {
  return <div className={`absolute transition-all duration-700 ease-expo ${on ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} ${className}`}>{children}</div>
}

/**
 * Vista previa de Barberlytics: la escena de entrada de Clipper. El orbe escucha, piensa y responde
 * mientras la conversación se arma a su lado: pregunta, consulta, respuesta y propuesta aplicada.
 */
export function ClipperScenePreview() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tick = useTick(STEP_MS)
  const step = reducedMotion ? STEPS - 1 : tick % STEPS
  const state: ClipperOrbState = step === 0 ? 'listening' : step === 2 ? 'thinking' : 'idle'

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_30%_50%,rgba(222,140,58,0.24),rgba(46,156,176,0.12)_42%,transparent_70%)] bg-[#0f0d0b] text-[#efe9dd]">
      <div className="absolute left-[27%] top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.8]">
        {[1, 0.72].map((s, i) => (
          <span key={s} className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]" style={{ width: `${s * 230}px` }} aria-hidden="true">
            <span className="absolute inset-0 rounded-full" style={{ animation: `orbit ${16 + i * 7}s linear infinite${i ? ' reverse' : ''}` }}>
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: ['#de8c3a', '#2e9cb0'][i] }} />
            </span>
          </span>
        ))}
        <ClipperOrb size={104} state={state} />
      </div>

      <Bubble on={step >= 1} className="right-[5%] top-[9%] max-w-[54%]">
        <p className="rounded-2xl rounded-tr-sm bg-white/[0.09] px-3 py-2 text-[12px]">{t({ es: '¿Cuánto llevo cobrado hoy?', en: 'How much have I collected today?' })}</p>
      </Bubble>
      <Bubble on={step >= 2} className="right-[5%] top-[27%]">
        <p className="flex items-center gap-1.5 rounded-full border border-[#2e9cb0]/40 bg-[#2e9cb0]/10 px-2.5 py-1 font-mono text-[10px] text-[#7fd3e3]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7fd3e3]" />
          {t({ es: 'Consulté · Cuentas del periodo', en: 'Looked up · Period accounts' })}
        </p>
      </Bubble>
      <Bubble on={step >= 3} className="right-[5%] top-[41%] max-w-[56%]">
        <div className="rounded-2xl rounded-tr-sm p-[1px]" style={{ backgroundImage: AI_GRADIENT }}>
          <p className="rounded-[15px] bg-[#141210] px-3 py-2 text-[12px] leading-snug">{t({ es: 'Llevas US$ 658 de US$ 2.676. Faltan 4 citas por cobrar.', en: 'US$ 658 of US$ 2,676 collected. 4 visits left to charge.' })}</p>
        </div>
      </Bubble>
      <Bubble on={step >= 4} className="bottom-[7%] right-[5%] w-[46%]">
        <div className="rounded-xl border border-white/15 bg-[#141210]/95 p-2.5 text-[11px] backdrop-blur">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">{step >= 5 ? t({ es: 'Aplicado', en: 'Applied' }) : t({ es: 'Propuesta', en: 'Proposal' })}</p>
          <p className="mt-0.5"><span className="text-white/40 line-through">4:00</span> → <span className="text-[#e9c27a]">5:00</span> · Mateo</p>
          <span className={`mt-1.5 inline-block rounded-md px-2 py-0.5 font-semibold text-[#141210] transition-colors duration-500 ${step >= 5 ? 'bg-[#4cc98d]' : 'bg-[#d9b36a]'}`}>
            {step >= 5 ? `✓ ${t({ es: 'Aplicado', en: 'Applied' })}` : t({ es: 'Aplicar', en: 'Apply' })}
          </span>
        </div>
      </Bubble>
    </div>
  )
}
