'use client'

import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '@/components/case/barberlytics/thema/live-pieces'
import { TEMPLATES } from '@/components/case/encuestas/form-fan'

const STEP_MS = 1500
const BLUE = '#0c5bef'

/** Vista previa del listado: las cinco plantillas reales del inicio de Encuestas en abanico, una pasa al frente. */
export function EncuestasPreview() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tick = useTick(STEP_MS)
  const active = reducedMotion ? 3 : tick % TEMPLATES.length
  const mid = (TEMPLATES.length - 1) / 2

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(160deg,#ffffff,#eef2fb_60%,#e4ebfa)] text-[#303a47]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#0c5bef]/15 blur-3xl" aria-hidden="true" />
      <div className="absolute left-[6%] top-[7%]">
        <p className="text-[17px] font-bold leading-tight">Encuestas</p>
        <p className="text-[9px] text-[#5c646f]">{t({ es: 'Elige por dónde empezar', en: 'Choose where to start' })}</p>
      </div>

      {/* El abanico: cinco tarjetas con su ícono glass; la activa sube al frente con el borde azul. */}
      <div className="absolute inset-x-0 bottom-[25%] top-[20%]">
        {TEMPLATES.map((tp, i) => {
          const on = i === active
          const off = i - mid
          return (
            <div
              key={tp.name}
              className="absolute bottom-0 left-1/2 w-[29%] origin-bottom rounded-2xl border bg-white p-2.5 shadow-[0_14px_30px_-14px_rgba(10,11,13,0.45)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateX(calc(-50% + ${on ? 0 : off * 4.2}rem)) rotate(${on ? 0 : off * 9}deg) translateY(${on ? -1.2 : Math.abs(off) * 0.45}rem) scale(${on ? 1.12 : 0.88})`,
                zIndex: on ? 20 : 10 - Math.abs(Math.round(off)),
                borderColor: on ? BLUE : 'rgba(0,0,0,0.08)',
              }}
            >
              <span className="flex h-16 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tp.icon} alt="" width={40} height={40} className="h-12 w-12 select-none" draggable={false} />
              </span>
              <span className="mt-1.5 block truncate text-[11px] font-semibold leading-tight">{t({ es: 'Crear', en: 'Create' })} {tp.name}</span>
              <span className="block truncate text-[9px] leading-tight text-[#5c646f]">{t(tp.hint)}</span>
            </div>
          )
        })}
      </div>

      {/* Lo que trae la plantilla al frente. */}
      <div key={active} className="enc-fade absolute inset-x-[6%] bottom-[6%] flex items-center gap-2 rounded-lg bg-white p-2 ring-1 ring-black/[0.06]">
        <span className="h-6 w-1 shrink-0 rounded-full" style={{ background: TEMPLATES[active].color }} />
        <p className="min-w-0 flex-1 truncate text-[9.5px] text-[#414a5c]">{t(TEMPLATES[active].detail)}</p>
        <span className="shrink-0 rounded-md px-2 py-1 text-[8px] font-semibold text-white" style={{ background: BLUE }}>{t({ es: 'Usar plantilla', en: 'Use template' })}</span>
      </div>
    </div>
  )
}
