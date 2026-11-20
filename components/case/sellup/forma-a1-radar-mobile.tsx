'use client'

import { Check, Minus } from 'lucide-react'
import { FLY_AT, SOURCES, STOPS, stopAt, type Stop } from './forma-a1-map'

/**
 * Agente 1 · el radar de búsqueda, rehecho para teléfono y tableta (no es un recorte
 * del mapa de escritorio): arriba los países como chips, al centro un radar limpio
 * dentro de su tarjeta donde aparecen las empresas que encuentra, y debajo, a todo el
 * ancho, las fuentes (primero lo gratis) y los dos contadores. Mismo reloj y datos.
 */

const EXPO = 'cubic-bezier(0.16,1,0.3,1)'
const SPRING = 'cubic-bezier(0.34,1.56,0.64,1)'
const SWEEP = 'conic-gradient(from 0deg, rgba(40,94,230,0) 0deg, rgba(40,94,230,0) 250deg, rgba(40,94,230,0.25) 290deg, rgba(126,43,224,0.55) 335deg, rgba(210,45,106,0.85) 358deg, rgba(235,98,51,0) 360deg)'
const NEEDLE = 'M12 3.6 L15.4 12.6 L12 10.7 L8.6 12.6 Z'
const TAIL = 'M12 20.4 L10.3 14.9 L12 15.9 L13.7 14.9 Z'
/** Diámetro máximo del radar. */
const MAX_D = 260
/** Dónde cae cada empresa encontrada dentro del radar: ángulo (grados) y distancia al centro (0–1). */
const BLIPS: readonly (readonly [number, number])[] = [[-50, 0.62], [40, 0.48], [150, 0.74], [235, 0.56]]
const CARD = 'rounded-[20px] p-4 ring-1 ring-white/10'

const pinOn = (s: Stop, j: number, t: number) => t >= s.from + Math.ceil(j / 2)

function Radar({ t, still, stop }: { t: number; still: boolean; stop: Stop }) {
  const fly = !still && t >= FLY_AT
  const spin = !still && !fly
  return (
    <div className="relative mx-auto aspect-square w-full" style={{ maxWidth: MAX_D }} aria-hidden="true">
      {[1, 0.66, 0.33].map((r) => (
        <span key={r} className="absolute rounded-full border" style={{ inset: `${((1 - r) / 2) * 100}%`, borderColor: r === 1 ? 'rgba(157,176,255,0.5)' : 'rgba(157,176,255,0.22)' }} />
      ))}
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
      {spin && <span className="absolute inset-0 rounded-full" style={{ background: SWEEP, animation: 'a1m-spin 1.05s linear infinite' }} />}
      {spin && <span key={stop.country} className="absolute inset-0 rounded-full border-2 border-[#9db0ff]" style={{ animation: 'a1m-arrive 620ms ease-out both' }} />}
      {stop.pins.map((p, j) => {
        const [deg, dist] = BLIPS[j % BLIPS.length]
        const a = (deg * Math.PI) / 180
        const on = still || pinOn(stop, j, t)
        return (
          <span
            key={p.name}
            className="absolute"
            style={{ left: `${50 + Math.cos(a) * dist * 50}%`, top: `${50 + Math.sin(a) * dist * 50}%`, transform: `translate(-50%,-50%) scale(${on && !fly ? 1 : 0})`, transition: `transform 380ms ${SPRING}` }}
          >
            <span className="block rounded-full" style={{ width: p.star ? 12 : 9, height: p.star ? 12 : 9, background: p.star ? '#fff' : '#b7c6ff', boxShadow: p.star ? '0 0 0 2px #d22d6a' : 'none' }} />
            {on && !still && <span key={`${stop.country}-${j}`} className="absolute inset-0 rounded-full border border-[#9db0ff]" style={{ animation: 'a1m-ping 900ms ease-out 2' }} />}
          </span>
        )
      })}
      <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2" fill="white">
        <circle cx="12" cy="12" r="9.6" fill="rgba(13,14,16,0.85)" stroke="white" strokeWidth="1.6" />
        <g style={{ transformBox: 'view-box', transformOrigin: '12px 12px', animation: spin ? 'a1m-spin 1.6s linear infinite' : undefined }}>
          <g transform="rotate(32 12 12)"><path d={NEEDLE} /><path d={TAIL} opacity="0.55" /></g>
        </g>
        <circle cx="12" cy="12" r="1.2" />
      </svg>
      <style>{'@keyframes a1m-spin{to{transform:rotate(360deg)}}@keyframes a1m-arrive{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.5);opacity:0}}@keyframes a1m-ping{0%{transform:scale(1);opacity:.9}100%{transform:scale(3.2);opacity:0}}'}</style>
    </div>
  )
}

/** `t`: ticks desde que empieza la escena (el mismo reloj que el mapa de escritorio). */
export function SearchRadarMobile({ t: tick, still = false }: { t: number; still?: boolean }) {
  const t = still ? FLY_AT - 1 : tick
  const idx = stopAt(t)
  const stop = STOPS[idx]
  const fly = !still && t >= FLY_AT
  const total = STOPS.reduce((n, s, i) => n + (i < idx ? s.found : i === idx ? Math.round(s.found * Math.min(1, (t - s.from + 1) / 2)) : 0), 0)
  const found = stop.pins.filter((_, j) => still || pinOn(stop, j, t))
  return (
    <div className="grid gap-2 text-white md:grid-cols-[minmax(0,1fr)_300px] md:items-start" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <div className={CARD} style={{ background: 'radial-gradient(ellipse at 50% 55%,#151a2e 0%,#0b0c10 70%)' }}>
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Agente 1 · radar de búsqueda</p>
        <p key={fly ? 'fly' : idx} className="mt-1 text-[15px] font-medium" style={{ animation: still ? undefined : 'a1m-in 300ms ease-out' }} aria-live="polite">
          {fly ? 'Candidatas listas para revisar →' : `${stop.flag} ${stop.country} · ${stop.query}`}
        </p>
        <style>{'@keyframes a1m-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'}</style>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {STOPS.map((s, i) => (
            <span key={s.country} className="rounded-lg px-1 py-1.5 text-center text-[11.5px] leading-tight" style={{ background: i === idx && !fly ? 'linear-gradient(135deg,rgba(40,94,230,0.35),rgba(126,43,224,0.25))' : i < idx ? 'rgba(255,255,255,0.05)' : 'transparent', color: i <= idx ? '#fff' : 'rgba(255,255,255,0.4)', boxShadow: i === idx && !fly ? '0 0 0 1px rgba(157,176,255,0.55)' : '0 0 0 1px rgba(255,255,255,0.08)', transition: `all 300ms ${EXPO}` }}>
              <span className="block" aria-hidden="true">{s.flag}</span>{s.country}
            </span>
          ))}
        </div>
        <div className="mt-5"><Radar t={t} still={still} stop={stop} /></div>
        <ul className="mt-4 flex min-h-[60px] flex-wrap content-start justify-center gap-1.5" aria-label="Empresas encontradas">
          {(fly ? STOPS[STOPS.length - 1].pins : found).map((p) => (
            <li key={p.name} className="rounded-md px-2 py-0.5 text-[12px]" style={{ background: p.star ? 'linear-gradient(90deg,#285ee6,#7e2be0)' : 'rgba(20,22,30,0.9)', boxShadow: '0 0 0 1px rgba(157,176,255,0.3)', animation: still ? undefined : 'a1m-in 300ms ease-out' }}>
              {p.name}{p.star ? ' · Nueva' : ''}
            </li>
          ))}
        </ul>
      </div>

      <div className={`${CARD} bg-[#0f1117]`}>
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Fuentes · primero lo gratis</p>
        <ul className="mt-2 space-y-1">
          {SOURCES.map((s) => {
            const on = still || t >= s.t
            const skip = 'skip' in s && s.skip
            return (
              <li key={s.name} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]" style={{ background: on && !skip ? 'rgba(107,140,255,0.14)' : 'rgba(255,255,255,0.03)', color: on ? (skip ? 'rgba(255,255,255,0.5)' : '#fff') : 'rgba(255,255,255,0.4)', transition: `all 300ms ${EXPO}` }}>
                {on ? (skip ? <Minus className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-emerald-300" />) : <span className="h-3.5 w-3.5 rounded-full border border-white/20" />}
                {s.name}
                <span className="ml-auto text-[12px] text-white/55">{on ? s.note : ''}</span>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/10"><p className="text-[24px] font-semibold tabular-nums">{still ? 27 : total}</p><p className="text-[12px] text-white/55">candidatas</p></div>
          <div className="rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/10"><p className="text-[24px] font-semibold tabular-nums text-emerald-300">0</p><p className="text-[12px] text-white/55">créditos usados</p></div>
        </div>
      </div>
    </div>
  )
}
