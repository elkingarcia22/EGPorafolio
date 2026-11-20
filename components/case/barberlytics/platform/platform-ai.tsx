'use client'

import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useTick } from '../thema/live-pieces'
import { GapsLive, TypingBooking } from './platform-ai-live'

const GOLD = '#D9B36A'
const SLOT_PX = 42 // alto de media hora en la rejilla
const TIMES = ['3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00']

interface Appt {
  col: number
  start: number
  len: number
  name: string
  service: string
  late?: boolean
  locked?: boolean
}

const APPTS: readonly Appt[] = [
  { col: 0, start: 1, len: 2, name: 'Renata H.', service: 'Fade · VIP' },
  { col: 1, start: 0, len: 1.5, name: 'Gael V.', service: 'Corte clásico', late: true },
  { col: 1, start: 1.5, len: 1.5, name: 'Marcela R.', service: 'Fade' },
  { col: 1, start: 3, len: 1, name: 'Santiago J.', service: 'Barba' },
  { col: 1, start: 5, len: 1, name: 'Diego M.', service: 'Corte', locked: true },
  { col: 2, start: 2, len: 1.5, name: 'Valeria M.', service: 'Corte' },
]

const SHIFT = 0.66 // ≈ 20 min, en medias horas

/** Fases del ciclo: normal → aviso de retraso → vista previa → aplicado → deshacer. */
const PHASES = 5

function CalendarProposes() {
  const { t } = useLocale()
  const tick = useTick(1700)
  const phase = tick % PHASES
  const late = phase >= 1 && phase <= 3
  const preview = phase === 2
  const applied = phase === 3
  // La tarjeta conserva el texto de «aplicado» mientras se desvanece en la fase de deshacer.
  const cardApplied = phase >= 3
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121009] p-4 text-[#efe9dd] md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{t({ es: 'Miércoles 18 nov', en: 'Wed, Nov 18' })}</p>
        <span className={`rounded-full px-3 py-1 text-[11px] transition-all duration-500 ${late ? 'bg-[#e5484d]/15 text-[#ff8a8e] opacity-100' : 'opacity-0'}`}>
          {t({ es: 'Emilio llega 20 min tarde', en: 'Emilio is 20 min late' })}
        </span>
      </div>
      <div className="grid grid-cols-[2.6rem_repeat(3,minmax(0,1fr))] gap-x-2">
        <span />
        {['Andrés', 'Emilio', 'Paola'].map((b, i) => (
          <span key={b} className={`pb-2 text-center text-xs ${i === 1 && late ? 'text-[#ff8a8e]' : 'text-white/60'}`}>{b}</span>
        ))}
        <div className="relative col-span-4" style={{ height: SLOT_PX * (TIMES.length - 1) }}>
          {TIMES.map((time, i) => (
            <div key={time} className="absolute inset-x-0 flex items-center" style={{ top: i * SLOT_PX }}>
              <span className="w-[2.6rem] -translate-y-1/2 font-mono text-[10px] text-white/35">{time}</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </div>
          ))}
          {APPTS.map((a) => {
            const moves = a.col === 1 && !a.locked && (preview || applied)
            const top = (a.start + (applied && moves ? SHIFT : 0)) * SLOT_PX
            return (
              <div key={a.name} className="absolute" style={{ left: `calc(2.6rem + ${a.col} * ((100% - 2.6rem) / 3) + 4px)`, width: 'calc((100% - 2.6rem) / 3 - 8px)', top: 0, height: '100%' }}>
                {preview && moves && (
                  <div className="absolute inset-x-0 rounded-lg border border-dashed" style={{ top: (a.start + SHIFT) * SLOT_PX + 2, height: a.len * SLOT_PX - 4, borderColor: GOLD, background: 'rgba(217,179,106,0.08)' }} />
                )}
                <div
                  className="absolute inset-x-0 overflow-hidden rounded-lg border px-2 py-1 text-[10px] leading-tight transition-[top] duration-700 ease-expo"
                  style={{ top: top + 2, height: a.len * SLOT_PX - 4, background: a.late && late ? 'rgba(229,72,77,0.14)' : 'rgba(255,255,255,0.06)', borderColor: a.late && late ? 'rgba(229,72,77,0.5)' : 'rgba(255,255,255,0.08)', opacity: preview && moves ? 0.45 : 1 }}
                >
                  <span className="block font-medium">{a.name}</span>
                  <span className="text-white/50">{a.service}</span>
                  {a.locked && <span className="absolute right-1.5 top-1 text-[9px] text-white/50" title={t({ es: 'Lo eligió el cliente', en: 'Chosen by the client' })}>🔒</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={`mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#d9b36a]/40 bg-[#d9b36a]/[0.08] p-3 transition-all duration-500 ${preview || applied ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        <span className="rounded-full border border-[#d9b36a]/50 px-2 py-0.5 text-[10px] text-[#e9c27a]">{t({ es: 'Sugerencia', en: 'Suggestion' })}</span>
        <p className="flex-1 text-xs">
          {cardApplied
            ? t({ es: 'Movidas 20 min porque la cita anterior se alargó · Diego no se toca: eligió esa hora.', en: 'Moved 20 min because the previous visit ran long · Diego stays: he chose that time.' })
            : t({ es: '3 citas se corren 20 min con Emilio', en: '3 visits shift 20 min with Emilio' })}
        </p>
        {!cardApplied && <span className="text-xs text-white/55">{t({ es: 'Descartar', en: 'Discard' })}</span>}
        <span className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#16130f]" style={{ background: GOLD }}>{cardApplied ? t({ es: 'Deshacer', en: 'Undo' }) : t({ es: 'Aplicar', en: 'Apply' })}</span>
      </div>
    </div>
  )
}

const KIND: Record<'rule' | 'estimate' | 'assistant', { es: string; en: string; cls: string }> = {
  rule: { es: 'Regla', en: 'Rule', cls: 'border-fg/30' },
  estimate: { es: 'Estimación', en: 'Estimate', cls: 'border-[#d18b1f]/60 text-[#d18b1f]' },
  assistant: { es: 'Asistente', en: 'Assistant', cls: 'border-transparent bg-[linear-gradient(90deg,#f0ce86,#de8c3a,#2e9cb0,#3f72d8)] text-[#16130f]' },
}

/** 06 · IA: el calendario que propone, sin vender reglas como IA. */
export function PlatformAi() {
  const { t } = useLocale()
  const { ai } = PLATFORM_CASE
  return (
    <div>
      <h3 data-reveal="mask" className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t(ai.title)}</h3>
      <p data-reveal className="mt-5 max-w-[62ch] leading-relaxed opacity-80">{t(ai.body)}</p>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div data-reveal="device"><CalendarProposes /></div>
        <div data-reveal className="space-y-4 text-sm leading-relaxed">
          <p className="mono-label text-[#d9b36a]">{t({ es: 'Reacomodo por retraso', en: 'Delay reflow' })}</p>
          <p className="opacity-80">{t({ es: 'Cuando una cita se alarga, el calendario muestra en la rejilla dónde quedarían las siguientes. Nada se mueve hasta «Aplicar»; lo que el cliente eligió no se toca, y el historial guarda quién lo movió y por qué.', en: 'When a visit runs long, the calendar shows on the grid where the next ones would land. Nothing moves until “Apply”; what the client chose stays put, and history records who moved it and why.' })}</p>
          <p className="opacity-60">{t({ es: 'Ningún producto del sector lo tiene; la idea viene de los calendarios de productividad que muestran la cascada antes de aplicarla.', en: 'No industry product has it; the idea comes from productivity calendars that show the cascade before applying it.' })}</p>
        </div>
      </div>

      <ul className="mt-14 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-3">
        {ai.features.map((f) => (
          <li key={f.name.es} data-reveal className="bg-bg p-6">
            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] ${KIND[f.kind].cls}`}>{t(KIND[f.kind])}</span>
            <p className="mt-3 font-medium leading-snug">{t(f.name)}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{t(f.how)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
        <TypingBooking />
        <GapsLive />
      </div>
    </div>
  )
}
