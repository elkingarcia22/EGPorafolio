'use client'

import { ShieldCheck, X } from 'lucide-react'
import { RumboMark } from './platform'
import { REAL } from './real-app'
import { FRAGMENTS, fragAt } from './forma-a3-magnet'

/**
 * Agente 3 · el imán, rehecho para teléfono y tableta (no es un recorte del de
 * escritorio): Rumbo arriba y, debajo, un fragmento a la vez que sube hacia él por un
 * trazo de luz y se vuelve un hecho citado; el que no está en la fuente se tacha.
 * Debajo, la lista de hechos citados a todo el ancho, llenándose al ritmo de la cita.
 * Mismo reloj y mismos datos que en escritorio.
 */

type FragState = 'next' | 'idle' | 'pull' | 'gone' | 'struck'

/** Estado de cada fragmento en el tick `time` (con los mismos ticks que el imán de escritorio). */
function stateOf(i: number, time: number): FragState {
  const at = fragAt(i)
  if (time === at) return 'pull'
  if (time > at) return FRAGMENTS[i].fake ? 'struck' : 'gone'
  const prevAt = i === 0 ? -Infinity : fragAt(i - 1)
  return time > prevAt ? 'idle' : 'next'
}

/** Alto del escenario del imán (px reales). */
const STAGE_H = 300
/** Dónde queda el fragmento (centro vertical) y dónde está Rumbo. */
const CARD_Y = 214
const RUMBO_Y = 74

function FragmentSlot({ i, time }: { i: number; time: number }) {
  const f = FRAGMENTS[i]
  const state = stateOf(i, time)
  const hidden = state === 'next' || (state === 'struck' && time > fragAt(i) + 3)
  const absorbed = state === 'gone'
  const transform = absorbed
    ? `translate(-50%, -50%) translateY(${RUMBO_Y - CARD_Y}px) scale(0.18)`
    : state === 'next'
      ? 'translate(-50%, -50%) translateY(24px) scale(0.96)'
      : `translate(-50%, -50%) rotate(${f.rot / 2}deg) scale(${state === 'pull' ? 1.04 : 1})`
  return (
    <div
      className="absolute left-1/2 w-[min(280px,86%)] transition-[transform,opacity,filter] duration-[380ms] ease-[cubic-bezier(.6,0,.2,1)]"
      style={{ top: CARD_Y, transform, transitionDelay: state === 'idle' ? '220ms' : '0ms', opacity: hidden || absorbed ? 0 : state === 'struck' ? 0.55 : 1, filter: absorbed ? 'blur(6px)' : 'none', zIndex: state === 'pull' ? 5 : 1 }}
      aria-hidden={hidden || absorbed}
    >
      <div
        className="relative rounded-xl border px-3 py-2.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-300"
        style={{
          background: '#161616',
          borderColor: state === 'pull' ? (f.fake ? '#f87171' : '#7e2be0') : 'rgba(255,255,255,0.1)',
          boxShadow: state === 'pull' ? `0 0 0 3px ${f.fake ? 'rgba(248,113,113,0.25)' : 'rgba(126,43,224,0.3)'}, 0 20px 50px -18px rgba(126,43,224,0.7)` : undefined,
        }}
      >
        <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/50"><f.Icon className="h-3.5 w-3.5" />{f.kind}</p>
        <p className={`mt-1 text-[14px] font-medium leading-snug ${state === 'struck' ? 'line-through decoration-red-400 decoration-2' : ''}`}>{f.title}</p>
        <p className="mt-1 text-[11px] text-white/50">{f.meta}</p>
        {state === 'struck' && (
          <span className="absolute -top-3 right-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-lg">
            <X className="h-3 w-3" />No está en la fuente
          </span>
        )}
      </div>
    </div>
  )
}

/** Rumbo con el fragmento que está atrayendo, todo dentro del marco. */
function Magnet({ time }: { time: number }) {
  const pulling = FRAGMENTS.some((_, i) => time === fragAt(i))
  const fake = FRAGMENTS.some((f, i) => f.fake && time === fragAt(i))
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10" style={{ height: STAGE_H, background: 'radial-gradient(ellipse at 50% 30%, #1b1430 0%, #0d0d0f 70%)' }}>
      <style>{'@keyframes a3m-ring{0%{transform:scale(.6);opacity:.7}100%{transform:scale(2.2);opacity:0}}'}</style>
      {[0, 1, 2].map((k) => (
        <span key={k} className="absolute left-1/2 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7e2be0]/50 motion-reduce:hidden" style={{ top: RUMBO_Y, animation: `a3m-ring 2.4s ease-out ${k * 0.8}s infinite` }} aria-hidden="true" />
      ))}
      {/* Trazo de luz del fragmento a Rumbo */}
      <span
        className="absolute left-1/2 w-[3px] -translate-x-1/2 rounded-full transition-[opacity,transform] duration-300 ease-out"
        style={{ top: RUMBO_Y + 40, height: CARD_Y - RUMBO_Y - 80, background: fake ? '#f87171' : 'linear-gradient(to top,#eb6233,#d22d6a,#7e2be0)', boxShadow: fake ? undefined : '0 0 10px rgba(210,45,106,0.8)', opacity: pulling ? 1 : 0, transform: `translateX(-50%) scaleY(${pulling ? 1 : 0})`, transformOrigin: 'bottom' }}
        aria-hidden="true"
      />
      <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ top: RUMBO_Y + 12 }}>
        <div className={`transition-transform duration-200 ${pulling ? 'scale-110' : 'scale-100'}`}>
          <RumboMark size={64} motion="thinking" glow />
        </div>
        <p className="mt-2 whitespace-nowrap text-[13px] font-semibold">Rumbo investiga</p>
        <p className="whitespace-nowrap text-[11px] text-white/55">Clínica Andina · Valeria Ortiz</p>
      </div>
      {FRAGMENTS.map((f, i) => <FragmentSlot key={f.title} i={i} time={time} />)}
    </div>
  )
}

/** Los hechos citados: aparecen a medida que Rumbo los cita (el espacio ya está reservado, así la página no salta); el falso queda tachado. */
function Facts({ time }: { time: number }) {
  const facts = FRAGMENTS.map((f, i) => ({ f, on: time > fragAt(i) }))
  const kept = facts.filter((x) => x.on && !x.f.fake).length
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121212] p-4">
      <p className="flex items-center text-[13px] font-semibold">Hechos citados<span className="ml-auto rounded-md bg-white/10 px-1.5 text-[12px] tabular-nums">{kept}</span></p>
      <ul className="mt-3 space-y-2">
        {facts.map(({ f, on }) => (
          <li key={f.title} className="rounded-lg border px-3 py-2 transition-[transform,opacity] duration-300 ease-out" style={{ borderColor: f.fake ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)', background: f.fake ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.03)', opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(-8px) scale(0.97)' }} aria-hidden={!on}>
            <p className={`text-[13px] leading-snug ${f.fake ? 'text-red-300 line-through decoration-red-400' : ''}`}>{f.fact}</p>
            <p className="mt-1 flex items-center gap-1 text-[11px]">
              {f.fake ? <span className="text-red-300">✕ Descartado por el verificador</span> : <><span className="rounded bg-[#7e2be0]/25 px-1.5 text-[#c9b3ff]">↗ {f.source}</span><ShieldCheck className="ml-auto h-3.5 w-3.5 text-emerald-400" /></>}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] leading-snug text-white/50">Un verificador sin IA compara cada cita con su fuente. Lo que no está, no entra al mensaje.</p>
    </div>
  )
}

/** `time`: el mismo tick que recibe `MagnetScene` en escritorio. */
export function MagnetMobile({ time }: { time: number }) {
  return (
    <div className="grid gap-2 py-2 text-white md:grid-cols-[minmax(0,1fr)_290px] md:items-start" style={{ fontFamily: REAL.font }}>
      <Magnet time={time} />
      <Facts time={time} />
    </div>
  )
}
