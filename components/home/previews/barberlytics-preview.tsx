'use client'

import { useA11y } from '@/lib/a11y'
import { ClipperOrb } from '@/components/case/barberlytics/clipper-orb'
import { useTick } from '@/components/case/barberlytics/thema/live-pieces'
import { APPTS, SERVICE } from '@/components/case/barberlytics/platform/calendar-model'

/** Guion: abre la reserva, elige servicio, barbero y hora, confirma, y la cita cae en el calendario. */
const STEPS = 8
const STEP_MS = 1050
const ROWS = 7 // 11:00 → 2:30
const COLS = ['Andrés', 'Emilio', 'Paola'] as const
const GOLD = '#d9b36a'
const NEW_APPT = { col: 2, start: 2, len: 2 } // Paola, 12:00, libre en el día real
const HOURS = ['11:00', '', '12:00', '', '1:00', '', '2:00']

const day = APPTS.filter((a) => a.col < COLS.length && a.start < ROWS).map((a) => ({ ...a, len: Math.min(a.len, ROWS - a.start) }))
const pct = (halfHours: number) => `${(halfHours / ROWS) * 100}%`

function Calendar({ booked }: { booked: boolean }) {
  return (
    <div className="absolute left-[4%] top-[7%] flex h-[86%] w-[70%] flex-col overflow-hidden rounded-lg bg-[#1a1713] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 [transform:perspective(900px)_rotateY(9deg)] [transform-origin:left_center]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-2.5 py-1.5">
        <span className="text-[10px] font-medium text-white/85">Jueves 19 nov</span>
        <span className="rounded-full bg-white/[0.06] px-1.5 py-px font-mono text-[7.5px] text-white/50">Día</span>
      </div>
      <div className="grid grid-cols-[26px_repeat(3,1fr)] border-b border-white/[0.07] py-1">
        <span />
        {COLS.map((name) => (
          <span key={name} className="flex items-center gap-1 px-1 text-[8px] text-white/70">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/10 text-[6.5px]">{name[0]}</span>
            {name}
          </span>
        ))}
      </div>
      <div className="relative flex-1">
        {HOURS.map((h, i) => (
          <div key={i} className="absolute inset-x-0 border-t border-white/[0.05]" style={{ top: pct(i) }}>
            <span className="absolute left-1 top-0.5 font-mono text-[6.5px] text-white/35">{h}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 left-[26px] right-0 grid grid-cols-3">
          {COLS.map((name, col) => (
            <div key={name} className="relative border-l border-white/[0.05]">
              {day
                .filter((a) => a.col === col)
                .map((a, i) => {
                  const hue = SERVICE[a.services[0]].hue
                  return (
                    <div
                      key={a.client}
                      data-slot-in
                      className="absolute inset-x-[3px] overflow-hidden rounded-[3px] border-l-2 px-1 py-0.5"
                      style={{ top: pct(a.start), height: `calc(${pct(a.len)} - 2px)`, borderColor: hue, background: `color-mix(in srgb, ${hue} 18%, #1a1713)`, animationDelay: `${(col * 3 + i) * 90}ms` }}
                    >
                      <p className="truncate text-[7.5px] font-medium text-white/90">{a.client.split(' ')[0]}</p>
                      <p className="truncate text-[6.5px] text-white/50">{SERVICE[a.services[0]].name}</p>
                    </div>
                  )
                })}
              {col === NEW_APPT.col && booked && (
                <div
                  data-slot-in
                  className="absolute inset-x-[3px] rounded-[3px] px-1 py-0.5 ring-1"
                  style={{ top: pct(NEW_APPT.start), height: `calc(${pct(NEW_APPT.len)} - 2px)`, background: `color-mix(in srgb, ${GOLD} 30%, #1a1713)`, '--tw-ring-color': GOLD } as React.CSSProperties}
                >
                  <span className="absolute inset-0 animate-[tap-ping_1.6s_ease-out_infinite] rounded-[3px] ring-2" style={{ '--tw-ring-color': GOLD } as React.CSSProperties} aria-hidden="true" />
                  <p className="truncate text-[7.5px] font-semibold text-[#f3dfb0]">Nueva · Tú</p>
                  <p className="truncate text-[6.5px] text-[#f3dfb0]/70">Corte + barba</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-[38%] h-px bg-[#e5484d]/80" aria-hidden="true">
          <span className="absolute -left-px -top-[2px] h-[5px] w-[5px] rounded-full bg-[#e5484d]" />
        </div>
      </div>
    </div>
  )
}

function Chip({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span className={`rounded-full border px-1.5 py-0.5 text-[8px] transition-colors duration-300 ${on ? 'border-transparent bg-[#d9b36a] font-semibold text-[#16130f]' : 'border-white/15 text-white/60'}`}>
      {children}
    </span>
  )
}

function BookingPhone({ step }: { step: number }) {
  const slots = ['11:30', '12:00', '1:30', '2:00', '3:30', '4:00']
  const confirmed = step >= 5
  return (
    <div className="absolute bottom-[-10%] right-[4%] w-[34%] rounded-[20px] bg-[#0a0908] p-[5px] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/15 [transform:rotate(-3deg)]">
      <div className="relative flex aspect-[9/17] flex-col overflow-hidden rounded-[16px] bg-[#141210] px-2.5 pt-2.5">
        <span className="absolute left-1/2 top-1 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
        <div className="mt-2 flex items-center gap-1.5">
          <ClipperOrb size={14} state={step === 0 ? 'listening' : 'idle'} />
          <span className="text-[8px] text-white/55">Barbería Norte</span>
        </div>
        <p className="mt-1.5 text-[12px] font-medium leading-tight text-white">¿Qué cita te agendo?</p>

        <p className="mt-2 font-mono text-[7px] uppercase tracking-wider text-white/35">Servicio</p>
        <div className="mt-1 flex flex-wrap gap-1">
          <Chip on={step >= 1}>Corte + barba</Chip>
          <Chip on={false}>Fade</Chip>
        </div>

        <p className="mt-2 font-mono text-[7px] uppercase tracking-wider text-white/35">Barbero</p>
        <div className="mt-1 flex gap-1">
          {COLS.map((name) => (
            <span key={name} className={`flex flex-1 flex-col items-center gap-0.5 rounded-md border py-1 transition-colors duration-300 ${step >= 2 && name === 'Paola' ? 'border-[#d9b36a] bg-[#d9b36a]/10' : 'border-white/10'}`}>
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="text-[7px] text-white/70">{name}</span>
            </span>
          ))}
        </div>

        <p className="mt-2 font-mono text-[7px] uppercase tracking-wider text-white/35">Hora</p>
        <div className="mt-1 grid grid-cols-3 gap-1">
          {slots.map((s) => {
            const picked = step >= 3 && s === '12:00'
            return (
              <span key={s} className={`relative rounded-[4px] py-1 text-center font-mono text-[7.5px] transition-colors duration-300 ${picked ? 'bg-[#d9b36a] font-semibold text-[#16130f]' : 'bg-white/[0.06] text-white/65'}`}>
                {picked && step === 3 && <span className="absolute inset-0 animate-[tap-ping_1s_ease-out_infinite] rounded-[4px] bg-[#d9b36a]/60" aria-hidden="true" />}
                <span className="relative">{s}</span>
              </span>
            )
          })}
        </div>

        <span className={`mt-auto mb-3 block rounded-md py-1.5 text-center text-[9px] font-semibold transition-colors duration-500 ${confirmed ? 'bg-[#4cc98d] text-[#0f1a14]' : step >= 4 ? 'bg-[#d9b36a] text-[#16130f]' : 'bg-white/10 text-white/40'}`}>
          {confirmed ? '✓ Agendada' : 'Confirmar'}
        </span>
      </div>
    </div>
  )
}

/**
 * Vista previa de Barberlytics en la lista de proyectos: el cliente agenda en el celular y
 * la cita cae, en vivo, en el calendario de la barbería.
 */
export function BarberlyticsPreview() {
  const { reducedMotion } = useA11y()
  const tick = useTick(STEP_MS)
  const step = reducedMotion ? STEPS - 1 : tick % STEPS
  const booked = step >= 5

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#110f0c]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_30%_40%,rgba(217,179,106,0.16),transparent_70%),radial-gradient(40%_50%_at_85%_90%,rgba(46,156,176,0.14),transparent_70%)]" aria-hidden="true" />
      <Calendar booked={booked} />
      {/* El trazo de la reserva al calendario */}
      <svg className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ${step >= 4 && step <= 6 ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
        <path d="M70 62 C 62 52, 60 34, 58 28" fill="none" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1.5 1.2" className="animate-[dash-run_0.8s_linear_infinite]" vectorEffect="non-scaling-stroke" />
      </svg>
      <BookingPhone step={step} />
      <span className="absolute left-[4%] bottom-[3%] font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
        {booked ? 'Reserva → calendario' : 'Reserva'}
      </span>
      <span className="sr-only">Una clienta agenda corte y barba con Paola desde el celular y la cita aparece en el calendario de la barbería.</span>
    </div>
  )
}
