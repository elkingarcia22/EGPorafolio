'use client'

import type { CSSProperties } from 'react'
import { useLocale } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '@/components/case/barberlytics/thema/live-pieces'
import { TEMPLATES } from '@/components/case/encuestas/form-fan'

const STEP_MS = 850
const COMPACT_STEP_MS = 1600
const BLUE = '#0c5bef'

/** Escritorio: las cinco cartas fijas en abanico; la activa sube al frente. */
function fanStyle(i: number, active: number, mid: number): CSSProperties {
  const on = i === active
  const off = i - mid
  return {
    transform: `translateX(calc(-50% + ${on ? 0 : off * 4.2}rem)) rotate(${on ? 0 : off * 9}deg) translateY(${on ? -1.2 : Math.abs(off) * 0.45}rem) scale(${on ? 1.12 : 0.88})`,
    zIndex: on ? 20 : 10 - Math.abs(Math.round(off)),
    borderColor: on ? BLUE : 'rgba(0,0,0,0.08)',
  }
}

/** Móvil: carrusel en abanico; la activa siempre al centro y solo se asoman sus dos vecinas. */
function carouselStyle(i: number, active: number, total: number): CSSProperties {
  const half = Math.floor(total / 2)
  const rel = ((i - active + total + half) % total) - half
  const on = rel === 0
  return {
    transform: `translateX(calc(-50% + ${rel * 78}%)) rotate(${rel * 7}deg) translateY(${on ? 0 : 0.6}rem) scale(${on ? 1 : 0.84})`,
    zIndex: on ? 20 : 10 - Math.abs(rel),
    opacity: Math.abs(rel) > 1 ? 0 : 1,
    borderColor: on ? BLUE : 'rgba(0,0,0,0.08)',
  }
}

/** Vista previa del listado: las cinco plantillas reales del inicio de Encuestas en abanico, una pasa al frente. */
export function EncuestasPreview({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const tick = useTick(compact ? COMPACT_STEP_MS : STEP_MS)
  const active = reducedMotion ? 3 : tick % TEMPLATES.length
  const mid = (TEMPLATES.length - 1) / 2

  return (
    <div className={`relative overflow-hidden bg-[linear-gradient(160deg,#ffffff,#eef2fb_60%,#e4ebfa)] text-[#303a47] ${compact ? 'aspect-[4/3.6] md:aspect-[16/10]' : 'aspect-[4/3]'}`}>
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 -translate-y-1/4 translate-x-1/4 rounded-full bg-[#0c5bef]/15 blur-3xl" aria-hidden="true" />
      <div className="absolute left-[6%] top-[7%]">
        <p className={`${compact ? 'text-xl' : 'text-[17px]'} font-bold leading-tight`}>Encuestas</p>
        <p className={`${compact ? 'text-xs' : 'text-[9px]'} text-[#5c646f]`}>{t({ es: 'Elige por dónde empezar', en: 'Choose where to start' })}</p>
      </div>

      {/* El abanico: cinco tarjetas con su ícono glass; la activa sube al frente con el borde azul. */}
      <div className={`absolute inset-x-0 ${compact ? 'bottom-[27%] top-[24%]' : 'bottom-[25%] top-[20%]'}`}>
        {TEMPLATES.map((tp, i) => (
          <div
            key={tp.name}
            className={`absolute bottom-0 left-1/2 origin-bottom rounded-2xl border bg-white shadow-[0_14px_30px_-14px_rgba(10,11,13,0.45)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${compact ? 'w-[44%] p-3 md:w-[30%]' : 'w-[29%] p-2.5'}`}
            style={compact ? carouselStyle(i, active, TEMPLATES.length) : fanStyle(i, active, mid)}
          >
            <span className={`flex items-center justify-center ${compact ? 'h-14' : 'h-16'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tp.icon} alt="" width={40} height={40} className="h-12 w-12 select-none" draggable={false} />
            </span>
            <span className={`mt-1.5 block truncate font-semibold leading-tight ${compact ? 'text-[13px]' : 'text-[11px]'}`}>{t({ es: 'Crear', en: 'Create' })} {tp.name}</span>
            <span className={`block truncate leading-tight text-[#5c646f] ${compact ? 'mt-0.5 text-[11px]' : 'text-[9px]'}`}>{t(tp.hint)}</span>
          </div>
        ))}
      </div>

      {/* Lo que trae la plantilla al frente. */}
      <div key={active} className={`enc-fade absolute inset-x-[6%] bottom-[6%] flex items-center gap-2 rounded-lg bg-white ring-1 ring-black/[0.06] ${compact ? 'p-2.5' : 'p-2'}`}>
        <span className="h-6 w-1 shrink-0 rounded-full" style={{ background: TEMPLATES[active].color }} />
        <p className={`min-w-0 flex-1 truncate text-[#414a5c] ${compact ? 'text-xs' : 'text-[9.5px]'}`}>{t(TEMPLATES[active].detail)}</p>
        <span className={`shrink-0 rounded-md font-semibold text-white ${compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[8px]'}`} style={{ background: BLUE }}>{t({ es: 'Usar plantilla', en: 'Use template' })}</span>
      </div>
    </div>
  )
}
