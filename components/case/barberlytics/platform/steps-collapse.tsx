'use client'

import { useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { STAGE } from './calendar-model'
import { useAutoSteps } from './use-auto-steps'

const GOLD = '#d9b36a'
/** Antes: abrir, editar y guardar para cada paso; ahora, un toque por paso */
const OLD = ['open', 'edit', 'save'] as const
const OLD_LABEL: Record<(typeof OLD)[number], L> = { open: { es: 'abrir', en: 'open' }, edit: { es: 'editar', en: 'edit' }, save: { es: 'guardar', en: 'save' } }
const TAPS = [STAGE.upcoming.next, STAGE.waiting.next, STAGE.seated.next] as const
/** Nombre corto de cada cifra; el detalle completo sale al tocarla */
const SHORT: readonly L[] = [
  { es: 'toques', en: 'taps' },
  { es: 'inasistencias', en: 'no-shows' },
  { es: 'huecos llenados', en: 'slots filled' },
  { es: 'sin cobrar al cierre', en: 'unpaid at close' },
]
/** La carrera de los segundos: ms de animación por segundo real */
const RACE_MS_PER_S = 45

/**
 * 07 · Impacto: nueve pasos (abrir, editar, guardar ×3) se juntan en tres
 * toques —Ingresar, Sentar, Cobrar—; debajo, la carrera de los segundos para
 * agendar y las cifras de referencia, cuyo detalle sale al tocarlas. De la
 * última cifra baja la fibra a «Demo».
 */
export function StepsCollapse() {
  const { t } = useLocale()
  const { impact } = PLATFORM_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  // 0 nada · 1 los nueve pasos · 2 se juntan en tres · 3 la carrera · 4 las cifras
  const step = useAutoSteps(rootRef, 4, 900, 300)
  const [picked, setPicked] = useState<number | null>(null)
  const merged = step >= 2
  const metrics = impact.metrics

  return (
    <div ref={rootRef} className="mx-auto max-w-[920px]">
      {/* 9 → 3 */}
      <div className="flex flex-col items-center text-center">
        <p className="flex items-baseline gap-3">
          <span className="text-[clamp(3.6rem,2rem+5vw,7rem)] font-light leading-none tabular-nums transition-opacity duration-500" style={{ filter: merged ? 'drop-shadow(0 0 24px rgba(217,179,106,0.45))' : 'none' }}>
            {merged ? metrics[0].value : '9'}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">{merged ? t({ es: 'toques', en: 'taps' }) : t({ es: 'pasos', en: 'steps' })}</span>
        </p>
        <p className="mt-2 text-sm text-paper/50">{t({ es: 'de «llegó» a «cobrada»', en: 'from “arrived” to “paid”' })}</p>
      </div>
      <div className="relative mx-auto mt-10 h-20 max-w-[760px]" aria-hidden="true">
        <span className="absolute inset-x-[5%] top-[9px] h-px bg-white/12" />
        <span className="absolute left-[5%] top-[9px] h-px origin-left bg-gradient-to-r from-signal to-[#d9b36a] transition-transform duration-700 ease-expo" style={{ width: '90%', transform: `scaleX(${merged ? 1 : 0})` }} />
        {Array.from({ length: 9 }, (_, i) => {
          const group = Math.floor(i / 3)
          const x = merged ? 5 + group * 45 : 5 + i * (90 / 8)
          const lead = i % 3 === 1
          return (
            <span key={i} className="absolute top-0 flex -translate-x-1/2 flex-col items-center transition-[left,opacity] duration-700 ease-expo" style={{ left: `${x}%`, opacity: step < 1 ? 0 : merged && !lead ? 0 : 1, transitionDelay: merged ? `${group * 90}ms` : `${i * 40}ms` }}>
              <span className={`block rounded-full border transition-all duration-500 ${merged ? 'h-[18px] w-[18px] border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgba(217,179,106,0.25),0_0_18px_3px_rgba(217,179,106,0.6)]' : 'mt-[5px] h-2 w-2 border-white/50 bg-white/20'}`} />
              <span className={`mt-3 whitespace-nowrap ${merged ? 'rounded-md px-2 py-0.5 text-[12px] font-semibold text-[#16130f]' : 'font-mono text-[10px] text-white/45'}`} style={merged ? { background: GOLD } : undefined}>
                {merged ? TAPS[group] : t(OLD_LABEL[OLD[i % 3]])}
              </span>
            </span>
          )
        })}
      </div>

      {/* La carrera: segundos para agendar en recepción */}
      <figure className="mx-auto mt-16 max-w-[640px]">
        <figcaption className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">{t(impact.booking.title)}</figcaption>
        {[
          { label: t({ es: 'Antes', en: 'Before' }), value: impact.booking.before, strong: false },
          { label: t({ es: 'Con el calendario', en: 'With the calendar' }), value: impact.booking.after, strong: true },
        ].map((row) => (
          <div key={row.label} className="mb-3 grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 last:mb-0 sm:grid-cols-[9rem_1fr_3rem]">
            <span className="text-sm text-paper/65">{row.label}</span>
            <span className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                className={`absolute inset-y-0 left-0 rounded-full ${step >= 3 ? 'pl-race' : 'scale-x-0'} ${row.strong ? 'bg-gradient-to-r from-signal to-[#d9b36a] shadow-[0_0_12px_rgba(217,179,106,0.6)]' : 'bg-white/30'}`}
                style={{ width: `${(row.value / impact.booking.before) * 100}%`, animationDuration: `${row.value * RACE_MS_PER_S}ms`, transformOrigin: 'left' }}
              />
            </span>
            <span className={`text-right font-mono tabular-nums ${row.strong ? 'text-paper' : 'text-paper/55'}`}>{row.value} s</span>
          </div>
        ))}
      </figure>

      {/* Las demás cifras: el número y su nombre corto; el detalle, al tocarlas */}
      <ol className="mx-auto mt-16 grid max-w-[760px] grid-cols-3 gap-4">
        {metrics.slice(1).map((m, j) => {
          const i = j + 1
          const on = step >= 4
          const isPicked = picked === i
          return (
            <li key={m.label.es} className="relative flex flex-col items-center">
              <button type="button" aria-pressed={isPicked} onClick={() => setPicked(isPicked ? null : i)} className="group flex flex-col items-center text-center outline-none">
                <span className={`text-[clamp(2rem,1.3rem+2.4vw,3.6rem)] font-light leading-none tabular-nums transition-all duration-700 ${on ? 'opacity-100' : 'translate-y-3 opacity-0'} ${isPicked ? '' : 'group-hover:opacity-90'}`} style={{ transitionDelay: `${j * 120}ms`, filter: isPicked ? 'drop-shadow(0 0 18px rgb(var(--signal) / 0.6))' : 'none' }}>
                  {m.value}
                </span>
                <span className={`mt-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-opacity duration-500 ${isPicked ? 'text-signal' : 'text-paper/50'}`}>{t(SHORT[i])}</span>
              </button>
              {i === metrics.length - 1 && <span data-fiber-from="pl-demo" className="absolute bottom-0 left-1/2 h-px w-px" />}
            </li>
          )
        })}
      </ol>
      <div key={picked ?? 'note'} aria-live="polite" className="pl-fade mx-auto mt-8 min-h-[3rem] max-w-[48ch] text-center">
        {picked !== null ? (
          <p className="text-balance text-base leading-relaxed text-paper/75">{t(metrics[picked].label)}</p>
        ) : (
          <p className="font-mono text-[10.5px] leading-relaxed text-paper/35">
            {t({ es: 'Cifras de referencia del caso · toca una para leerla', en: 'Reference figures for the case · tap one to read it' })}
            <br />
            {t({ es: 'Detrás', en: 'Behind it' })}: {impact.build.map((b) => `${b.value} ${t(b.label)}`).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}
