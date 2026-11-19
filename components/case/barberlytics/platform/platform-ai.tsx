'use client'

import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useTick } from '../thema/live-pieces'
import { ClipperOrb } from '../clipper-orb'

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

      <div className={`mt-4 flex flex-wrap items-center gap-3 rounded-xl p-3 transition-all duration-500 ${preview || applied ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`} style={{ background: `linear-gradient(90deg, rgba(217,179,106,0.16), rgba(63,114,216,0.14))`, boxShadow: `inset 0 0 0 1px rgba(217,179,106,0.35)` }}>
        <ClipperOrb size={22} />
        <p className="flex-1 text-xs">
          {applied
            ? t({ es: '3 citas movidas +20 min · Diego no se mueve: eligió esa hora.', en: '3 visits moved +20 min · Diego stays: he chose that time.' })
            : t({ es: 'Propuesta: mover 3 citas de Emilio +20 min. Diego no se toca.', en: 'Proposal: move 3 of Emilio’s visits +20 min. Diego is untouched.' })}
        </p>
        <span className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#16130f]" style={{ background: GOLD }}>{applied ? t({ es: 'Deshacer', en: 'Undo' }) : t({ es: 'Aplicar', en: 'Apply' })}</span>
      </div>
    </div>
  )
}

/** 06 · IA: el calendario que propone, la IA honesta y cómo lo construí. */
export function PlatformAi() {
  const { t } = useLocale()
  const { calendar, honest, build } = PLATFORM_CASE.ai
  return (
    <div>
      <h3 data-reveal="mask" className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t(calendar.title)}</h3>
      <p data-reveal className="mt-5 max-w-[62ch] leading-relaxed opacity-80">{t(calendar.body)}</p>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div data-reveal="device"><CalendarProposes /></div>
        <ol className="space-y-3">
          {calendar.capabilities.map((c, i) => (
            <li key={c.es} data-reveal="right" className={`flex items-center gap-4 border-l-2 py-1.5 pl-4 ${i === 2 ? 'border-[#d9b36a]' : 'border-fg/15'}`}>
              <span className="mono-label w-6 shrink-0 opacity-60">0{i + 1}</span>
              <span className={i === 2 ? 'text-[#d9b36a]' : ''}>{t(c)}</span>
              {i === 2 && <span className="mono-label ml-auto text-[#d9b36a]">{t({ es: 'en la animación', en: 'animated' })}</span>}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div data-reveal className="rounded-2xl border border-fg/15 p-6">
          <p className="mono-label mb-3 text-signal">{t(honest.title)}</p>
          <p className="leading-relaxed opacity-80">{t(honest.body)}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-fg/25 px-3 py-1 line-through opacity-50">✦ IA · {t({ es: 'regla fija', en: 'fixed rule' })}</span>
            <span className="rounded-full border border-fg/40 px-3 py-1">{t({ es: 'Sugerencia', en: 'Suggestion' })}</span>
            <span className="rounded-full px-3 py-1 text-[#16130f]" style={{ background: 'linear-gradient(90deg,#f0ce86,#de8c3a,#2e9cb0,#3f72d8)' }}>✦ IA · {t({ es: 'pasa por un modelo', en: 'goes through a model' })}</span>
          </div>
        </div>
        <div data-reveal className="rounded-2xl border border-fg/15 p-6">
          <p className="mono-label mb-3 text-signal">{t({ es: 'Cómo te fue esta semana', en: 'How your week went' })}</p>
          <p className="leading-relaxed opacity-85">
            {t({
              es: '«En los últimos 7 días vendiste US$ 14.050 en 303 servicios. Andrés Beltrán fue quien más vendió. El mejor día fue el miércoles. Hubo 26 citas a las que no vino nadie: confirma a tiempo las de riesgo alto.»',
              en: '“In the last 7 days you sold US$ 14,050 across 303 services. Andrés Beltrán sold the most. Wednesday was the best day. 26 appointments were no-shows: confirm high-risk ones in time.”',
            })}
          </p>
          <p className="mt-3 text-xs opacity-55">{t({ es: 'Las cifras salen del cálculo; el modelo solo las cuenta.', en: 'The figures come from the math; the model only tells them.' })}</p>
        </div>
      </div>

      <h3 data-reveal="mask" className="mb-6 mt-16 text-[clamp(1.35rem,1rem+1vw,1.9rem)]">{t(build.title)}</h3>
      <ol className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
        {build.steps.map((s, i) => (
          <li key={s.title.es} data-reveal className="bg-bg p-6">
            <span className="mono-label text-signal">0{i + 1}</span>
            <p className="mt-3 font-medium leading-snug">{t(s.title)}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{t(s.body)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
