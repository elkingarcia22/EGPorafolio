'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/**
 * Componentes de Thema recreados en vivo (tema Premium) para el collage:
 * cada uno se anima solo, como si alguien lo estuviera usando.
 */

export const CARD =
  'rounded-2xl border border-[#d9b36a]/15 bg-[#1c1915]/95 p-4 text-[#efe9dd] shadow-[0_34px_70px_-28px_rgba(0,0,0,0.85)] backdrop-blur'
const GOLD = '#d9b36a'

/** Paso que avanza cada `ms` (quieto con movimiento reducido). */
export function useTick(ms: number): number {
  const { reducedMotion } = useA11y()
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setStep((s) => s + 1), ms)
    return () => window.clearInterval(id)
  }, [ms, reducedMotion])
  return step
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium text-[#efe9dd]/55">{children}</p>
}

/* ── Buscador que escribe ─────────────────────────────────────────────── */

const QUERIES = ['Andrés Vargas', 'Corte clásico', 'Fade con barba']

export function TypingSearch() {
  const tick = useTick(110)
  const cycle = 34
  const erase = 6
  const word = QUERIES[Math.floor(tick / cycle) % QUERIES.length]
  const pos = tick % cycle
  // Al final del ciclo los resultados se van primero y la búsqueda se borra letra a letra, como haría alguien.
  const erasing = pos >= cycle - erase
  const kept = erasing ? Math.round(word.length * ((cycle - pos - 1) / erase)) : pos
  const typed = word.slice(0, Math.min(word.length, kept))
  const showResults = pos > word.length + 3 && pos < cycle - erase - 2
  return (
    <div className={`${CARD} w-[260px]`}>
      <Label>Buscar cliente o servicio</Label>
      <div className="flex items-center gap-2 rounded-xl border border-[#d9b36a]/60 bg-black/30 px-3 py-2.5 text-sm shadow-[0_0_0_3px_rgba(217,179,106,0.15)]">
        <span className="text-[#efe9dd]/40" aria-hidden="true">⌕</span>
        <span>{typed}</span>
        <span className="-ml-1.5 h-4 w-px animate-pulse bg-[#efe9dd]" aria-hidden="true" />
      </div>
      <ul className={`mt-2 space-y-1 transition-all duration-500 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
        {[word, `${word.split(' ')[0]} · historial`].map((r, i) => (
          <li key={r} className={`rounded-lg px-3 py-2 text-xs ${i === 0 ? 'bg-[#d9b36a]/15 text-[#efe9dd]' : 'text-[#efe9dd]/60'}`}>{r}</li>
        ))}
      </ul>
    </div>
  )
}

/* ── Calendario que elige días ────────────────────────────────────────── */

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const PICKS = [18, 19, 21, 25, 26, 28]

export function PickingCalendar() {
  const tick = useTick(1400)
  const selected = PICKS[tick % PICKS.length]
  return (
    <div className={`${CARD} w-[268px]`}>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium">Noviembre 2026</span>
        <span className="text-[#efe9dd]/40">‹ ›</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {DAYS.map((d, i) => <span key={i} className="pb-1 text-[#efe9dd]/40">{d}</span>)}
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 5
          const valid = day >= 1 && day <= 30
          const isSel = day === selected
          return (
            <span
              key={i}
              className={`relative flex aspect-square items-center justify-center rounded-lg transition-all duration-500 ${!valid ? 'opacity-0' : isSel ? 'scale-110 font-semibold text-[#1c1915]' : day === 18 ? 'ring-1 ring-[#d9b36a]/60' : 'text-[#efe9dd]/80'}`}
              style={isSel ? { background: GOLD } : undefined}
            >
              {valid ? day : ''}
              {valid && [19, 21, 26].includes(day) && !isSel && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#2e9cb0]" />}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Horarios por franja ──────────────────────────────────────────────── */

const SLOTS = ['9:00', '9:30', '10:15', '11:30', '3:00', '5:30']

export function TimeSlots() {
  const tick = useTick(1100)
  const active = (tick * 2 + 1) % SLOTS.length
  return (
    <div className={`${CARD} w-[250px]`}>
      <Label>Tarde · con Andrés</Label>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((s, i) => (
          <span
            key={s}
            className={`rounded-lg border px-2 py-2 text-center text-xs transition-all duration-500 ${i === active ? 'border-transparent font-semibold text-[#1c1915]' : 'border-[#efe9dd]/15 text-[#efe9dd]/80'}`}
            style={i === active ? { background: GOLD } : undefined}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Interruptores ────────────────────────────────────────────────────── */

const SETTINGS = ['Recordatorio por WhatsApp', 'Anticipo a clientes nuevos', 'Lista de espera']

export function Toggles() {
  const tick = useTick(1500)
  return (
    <div className={`${CARD} w-[270px] space-y-3`}>
      {SETTINGS.map((label, i) => {
        const on = (tick + i) % 3 !== 0
        return (
          <div key={label} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[#efe9dd]/85">{label}</span>
            <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-500 ${on ? 'bg-[#d9b36a]' : 'bg-[#efe9dd]/20'}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#1c1915] shadow transition-transform duration-500 ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Indicador que sube ───────────────────────────────────────────────── */

const SPARK = 'M0,34 L14,30 L28,32 L42,24 L56,26 L70,16 L84,18 L100,6'

export function RisingKpi() {
  const tick = useTick(140)
  // Sube durante RISE pasos y baja con calma en FALL: el contador nunca salta de vuelta al inicio.
  const RISE = 72
  const FALL = 18
  const p = tick % (RISE + FALL)
  const value = 31000 + Math.round(97 * (p < RISE ? p : (RISE * (RISE + FALL - p)) / FALL))
  return (
    <div className={`${CARD} w-[240px]`}>
      <Label>Ventas de la semana</Label>
      <p className="text-3xl font-semibold tabular-nums">US$ {value.toLocaleString('es-CO')}</p>
      <p className="mt-1 inline-block rounded-full bg-[#7fd8af]/15 px-2 py-0.5 text-[11px] text-[#7fd8af]">▲ 8,4 % vs. semana pasada</p>
      <svg viewBox="0 0 100 40" className="mt-3 h-12 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="kpi-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${SPARK} L100,40 L0,40 Z`} fill="url(#kpi-fill)" />
        <path d={SPARK} fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/* ── Selector de barbero abierto ──────────────────────────────────────── */

const BARBERS = [['AV', 'Andrés Vargas'], ['EM', 'Emilio Mora'], ['DR', 'Daniela Ríos'], ['TP', 'Tomás Peña']]

export function BarberSelect() {
  const tick = useTick(1000)
  const hover = tick % BARBERS.length
  return (
    <div className={`${CARD} w-[250px]`}>
      <Label>Barbero</Label>
      <div className="flex items-center justify-between rounded-xl border border-[#efe9dd]/15 bg-black/25 px-3 py-2 text-sm">
        {BARBERS[hover][1]}
        <span className="text-[#efe9dd]/40">⌄</span>
      </div>
      <ul className="mt-2 space-y-0.5 rounded-xl border border-[#efe9dd]/10 bg-black/30 p-1">
        {BARBERS.map(([initials, name], i) => (
          <li key={name} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors duration-300 ${i === hover ? 'bg-[#d9b36a]/15' : ''}`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e9cb0]/30 text-[11px] md:text-[10px]">{initials}</span>
            {name}
            {i === hover && <span className="ml-auto" style={{ color: GOLD }}>✓</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Botón que confirma + aviso ───────────────────────────────────────── */

export function ConfirmWithToast() {
  const tick = useTick(900)
  const phase = tick % 5
  return (
    <div className="flex w-[290px] flex-col items-start gap-3">
      <button
        type="button"
        tabIndex={-1}
        className={`rounded-xl px-5 py-3 text-sm font-semibold text-[#1c1915] shadow-[0_14px_30px_-12px_rgba(217,179,106,0.7)] transition-transform duration-200 ${phase === 1 ? 'scale-95' : 'scale-100'}`}
        style={{ background: GOLD }}
      >
        Confirmar cita →
      </button>
      <div className={`${CARD} flex items-center gap-3 py-3 transition-all duration-500 ${phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7fd8af]/20 text-[#7fd8af]">✓</span>
        <span className="text-xs">
          <span className="block font-medium">Cita confirmada</span>
          <span className="text-[#efe9dd]/55">Jue 19 · 5:00 p. m. · Andrés</span>
        </span>
      </div>
    </div>
  )
}

/* ── Control segmentado ───────────────────────────────────────────────── */

const SEGMENTS = ['Día', 'Semana', 'Mes']

export function Segmented() {
  const tick = useTick(1600)
  // Va y vuelve (Día → Semana → Mes → Semana…): la pastilla nunca cruza todo el control de regreso.
  const bounce = tick % (SEGMENTS.length * 2 - 2)
  const active = bounce < SEGMENTS.length ? bounce : SEGMENTS.length * 2 - 2 - bounce
  return (
    <div className={`${CARD} w-[230px] p-1.5`}>
      <div className="relative grid grid-cols-3 text-center text-xs">
        <span className="absolute inset-y-0 w-1/3 rounded-xl bg-[#d9b36a]/20 transition-transform duration-500 ease-expo" style={{ transform: `translateX(${active * 100}%)` }} />
        {SEGMENTS.map((s, i) => (
          <span key={s} className={`relative py-2 transition-colors ${i === active ? 'font-semibold text-[#efe9dd]' : 'text-[#efe9dd]/50'}`}>{s}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Tarjeta de cita que cambia de estado ─────────────────────────────── */

const STATUS = [
  { label: 'Confirmada', color: '#17B16D' },
  { label: 'En la silla', color: '#d9b36a' },
  { label: 'Pagada', color: '#3e8ef7' },
]

export function AppointmentCard() {
  const tick = useTick(1700)
  const status = STATUS[tick % STATUS.length]
  return (
    <div className={`${CARD} w-[280px]`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e9cb0]/30 text-xs font-semibold">MR</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Marcela Rojas</p>
          <p className="text-[11px] text-[#efe9dd]/55">Corte y barba · 45 min</p>
        </div>
        <span className="rounded-full px-2 py-0.5 text-[11px] md:text-[10px] font-medium transition-colors duration-500" style={{ background: `${status.color}26`, color: status.color }}>{status.label}</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#efe9dd]/10 pt-3 text-xs">
        <span className="text-[#efe9dd]/60">Jue 19 · 5:00 p. m.</span>
        <span className="font-semibold">US$ 42</span>
      </div>
    </div>
  )
}

/* ── Sugerencia de Clipper escribiéndose ──────────────────────────────── */

const SUGGESTION = 'Daniela tiene 3 huecos esta tarde. ¿Aviso a la lista de espera?'

export function ClipperMini() {
  const tick = useTick(70)
  const cycle = SUGGESTION.length + 40
  const shown = SUGGESTION.slice(0, Math.min(SUGGESTION.length, tick % cycle))
  // Los últimos pasos del ciclo el texto se desvanece antes de volver a escribirse.
  const fading = tick % cycle >= cycle - 8
  return (
    <div className={`${CARD} w-[280px]`}>
      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className="h-5 w-5 rounded-full" style={{ background: 'repeating-linear-gradient(135deg,#f0ce86 0 4px,#2e9cb0 4px 8px)' }} aria-hidden="true" />
        <span className="font-semibold">Clipper</span>
        <span className="text-[#efe9dd]/40">· sugerencia</span>
      </div>
      <p className="min-h-[3.2em] text-xs leading-relaxed text-[#efe9dd]/85">
        <span className={`transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>{shown}</span>
        <span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-[#efe9dd] align-middle" aria-hidden="true" />
      </p>
      <div className="mt-3 flex gap-2 text-[11px]">
        <span className="rounded-lg px-2.5 py-1 font-semibold text-[#1c1915]" style={{ background: GOLD }}>Avisar</span>
        <span className="rounded-lg border border-[#efe9dd]/15 px-2.5 py-1 text-[#efe9dd]/70">Ahora no</span>
      </div>
    </div>
  )
}
