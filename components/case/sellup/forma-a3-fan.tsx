'use client'

import { useEffect, useState } from 'react'
import { RealTag, REAL } from './real-app'
import { BASE, CHANNELS, Cited, Device, PEOPLE, type Channel } from './forma-a3-devices'

/**
 * 5.4 · Escena 3: el mensaje se arma con los hechos citados y se abre en abanico
 * hacia los cuatro canales, cada uno en su aparato. Se puede elegir decisor y canal.
 */

export const FAN_W = 1040
export const FAN_H = 580

/** A partir de este segundo (local a la escena) el mensaje se abre en abanico. */
const FAN_AT = 6

/** Posición de cada aparato en el abanico (centro, en px de diseño) y su giro. */
const SLOTS: Record<Channel, { x: number; y: number; r: number }> = {
  email: { x: 170, y: 325, r: -4 },
  linkedin: { x: 430, y: 305, r: -1.5 },
  call: { x: 690, y: 305, r: 1.5 },
  whatsapp: { x: 920, y: 325, r: 4 },
}

export function FanScene({ u }: { u: number }) {
  const [pick, setPick] = useState<{ p?: number; c?: Channel }>({})
  useEffect(() => {
    if (u === 0) setPick({})
  }, [u])
  const fanned = u >= FAN_AT
  const autoC = CHANNELS[Math.floor(Math.max(0, u - FAN_AT) / 3) % CHANNELS.length].id
  const autoP = u >= 18 ? 1 : 0
  const c = pick.c ?? autoC
  const p = pick.p ?? autoP
  const sentences = Math.min(BASE[p].length, Math.max(0, u))

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 text-white" style={{ width: FAN_W, height: FAN_H, fontFamily: REAL.font, background: 'radial-gradient(ellipse at 50% 60%, #1a1230 0%, #0d0d0f 65%)' }}>
      {/* Encabezado: decisor y canal */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 border-b border-white/10 bg-[#121212]/80 px-5 py-3 backdrop-blur">
        <p className="mr-2 text-[14px] font-semibold">Primer contacto · Clínica Andina</p>
        <RealTag tone="amber">Para revisar</RealTag>
        <span className="ml-auto flex gap-1.5">
          {PEOPLE.map((person, i) => (
            <button key={person.name} type="button" onClick={() => setPick((s) => ({ ...s, p: i }))} className={`rounded-lg border px-3 py-1 text-[12.5px] transition-colors duration-200 ${p === i ? 'border-[#7e2be0] bg-[#7e2be0]/20 text-white' : 'border-white/10 text-white/60 hover:text-white'}`}>
              {person.name}
            </button>
          ))}
        </span>
        <span className="ml-2 flex gap-1" role="tablist">
          {CHANNELS.map(({ id, label, Icon }) => (
            <button key={id} type="button" role="tab" aria-selected={c === id} aria-label={label} onClick={() => setPick((s) => ({ ...s, c: id }))} className={`grid h-8 w-8 place-items-center rounded-lg transition-all duration-200 ${c === id ? 'bg-white text-[#0a0a0a]' : 'border border-white/10 text-white/60 hover:text-white'}`}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </span>
      </div>

      {/* El mensaje base que se arma con las citas */}
      <div
        className="absolute left-1/2 top-[150px] w-[600px] -translate-x-1/2 rounded-2xl border border-[#7e2be0]/50 bg-[#151320] p-5 shadow-[0_30px_80px_-30px_rgba(126,43,224,0.8)] transition-[transform,opacity,filter] duration-[380ms] ease-[cubic-bezier(.6,0,.2,1)]"
        style={{ opacity: fanned ? 0 : 1, transform: `translateX(-50%) scale(${fanned ? 0.55 : 1}) translateY(${fanned ? 120 : 0}px)`, filter: fanned ? 'blur(8px)' : 'none' }}
        aria-hidden={fanned}
      >
        <p className="text-[12px] uppercase tracking-wide text-white/45">Mensaje base · {PEOPLE[p].name}</p>
        <p className="mt-3 text-[18px] leading-relaxed">
          {BASE[p].map((s, i) => (
            <span key={s} className="inline transition-[opacity,filter] duration-300" style={{ opacity: i < sentences ? 1 : 0.08, filter: i < sentences ? 'none' : 'blur(3px)' }}>
              <Cited text={`${s} `} />
            </span>
          ))}
        </p>
        <p className="mt-4 text-[12px] text-white/45">Cada frase sale de un hecho citado. Ahora se adapta a cada canal…</p>
      </div>

      {/* El abanico de canales */}
      {CHANNELS.map(({ id, label }, i) => {
        const s = SLOTS[id]
        const active = id === c
        return (
          <button
            key={id}
            type="button"
            onClick={() => setPick((st) => ({ ...st, c: id }))}
            aria-label={`Ver ${label}`}
            className="absolute text-left transition-[transform,opacity,filter] duration-[380ms] ease-[cubic-bezier(.2,.9,.2,1.1)]"
            style={{
              left: s.x,
              top: s.y,
              zIndex: active ? 10 : 1,
              transitionDelay: fanned ? `${i * 60}ms` : '0ms',
              opacity: fanned ? (active ? 1 : 0.62) : 0,
              filter: fanned && !active ? 'saturate(0.6)' : 'none',
              transform: fanned
                ? `translate(-50%, -50%) rotate(${active ? 0 : s.r}deg) scale(${active ? 1.04 : 0.8}) translateY(${active ? -12 : 0}px)`
                : `translate(-50%, -50%) translate(${FAN_W / 2 - s.x}px, ${300 - s.y}px) scale(0.3) rotate(0deg)`,
            }}
          >
            <span className={`block rounded-2xl transition-shadow duration-300 ${active ? 'shadow-[0_0_0_3px_rgba(210,45,106,0.55),0_30px_80px_-20px_rgba(126,43,224,0.9)]' : ''}`}>
              <Device channel={id} p={p} />
            </span>
            <span className={`mt-3 block text-center text-[12px] font-medium transition-colors duration-200 ${active ? 'text-white' : 'text-white/45'}`}>{label}</span>
          </button>
        )
      })}

      <p className="absolute inset-x-0 bottom-3 text-center text-[11.5px] text-white/45">No se envía nada solo: el vendedor lo usa o lo ajusta. Toca otro decisor o canal.</p>
    </div>
  )
}
