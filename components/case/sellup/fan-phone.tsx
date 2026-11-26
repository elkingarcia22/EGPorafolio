'use client'

import { useEffect, useState } from 'react'
import { BASE, CHANNELS, Cited, Device, PEOPLE, type Channel } from './forma-a3-devices'

/** A partir de este tick (local a la escena) el mensaje se abre a los canales; igual que en escritorio */
const FAN_AT = 6
/** Ticks que se queda cada canal antes de pasar al siguiente */
const PER_CHANNEL = 3

/**
 * El abanico en teléfono: primero el mensaje base se arma frase por frase con
 * sus citas; después se abre a los canales, uno a la vez, cada uno en su
 * aparato a tamaño real. Las pestañas eligen canal y decisor; con el dedo
 * de lado también se cambia de canal.
 */
export function FanPhone({ u }: { u: number }) {
  const [pick, setPick] = useState<{ p?: number; c?: Channel }>({})
  useEffect(() => {
    if (u === 0) setPick({})
  }, [u])
  const fanned = u >= FAN_AT
  const autoC = CHANNELS[Math.floor(Math.max(0, u - FAN_AT) / PER_CHANNEL) % CHANNELS.length].id
  const p = pick.p ?? (u >= 18 ? 1 : 0)
  const c = pick.c ?? autoC
  const sentences = Math.min(BASE[p].length, Math.max(0, u))
  const ci = CHANNELS.findIndex((ch) => ch.id === c)

  return (
    <div className="mx-auto max-w-[360px] text-white">
      {/* Decisor: a quién va el mensaje */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-white/60">Para</span>
        {PEOPLE.map((person, i) => (
          <button key={person.name} type="button" onClick={() => setPick((s) => ({ ...s, p: i }))} className={`rounded-full border px-3 py-1 text-[13px] transition-colors duration-300 ${p === i ? 'border-[#7e2be0] bg-[#7e2be0]/25 text-white' : 'border-white/10 text-white/55'}`}>
            {person.first}
          </button>
        ))}
      </div>

      {fanned ? (
        <>
          {/* Los canales: el activo encendido; la fibra corre debajo hasta él */}
          <div className="relative mt-5" role="tablist" aria-label="Canal">
            <div className="grid grid-cols-4 gap-2">
              {CHANNELS.map(({ id, label, Icon }) => (
                <button key={id} type="button" role="tab" aria-selected={c === id} onClick={() => setPick((s) => ({ ...s, c: id }))} className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition-all duration-300 ${c === id ? 'border-white/60 bg-white text-[#0a0a0a]' : 'border-white/10 text-white/60'}`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-[11px]">{label}</span>
                </button>
              ))}
            </div>
            <span aria-hidden="true" className="mt-3 block h-px w-full bg-white/10">
              <span className="block h-px bg-gradient-to-r from-[#7e2be0] to-[#d22d6a] shadow-[0_0_8px_rgba(210,45,106,0.8)] transition-[width] duration-500 ease-out" style={{ width: `${((ci + 1) / CHANNELS.length) * 100}%` }} />
            </span>
          </div>
          {/* El aparato del canal, a tamaño real */}
          <div key={`${c}-${p}`} className="su-fade mt-5 flex justify-center">
            <span className="rounded-2xl shadow-[0_0_0_2px_rgba(210,45,106,0.45),0_30px_70px_-20px_rgba(126,43,224,0.9)]">
              <Device channel={c} p={p} />
            </span>
          </div>
        </>
      ) : (
        /* El mensaje base: cada frase aparece con su cita */
        <div className="mt-5 rounded-2xl border border-[#7e2be0]/50 bg-[#151320] p-4 shadow-[0_30px_70px_-30px_rgba(126,43,224,0.8)]">
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">Mensaje base · {PEOPLE[p].name}</p>
          <p className="mt-3 text-[16px] leading-relaxed">
            {BASE[p].map((s, i) => (
              <span key={s} className="inline transition-[opacity,filter] duration-300" style={{ opacity: i < sentences ? 1 : 0.08, filter: i < sentences ? 'none' : 'blur(3px)' }}>
                <Cited text={`${s} `} />
              </span>
            ))}
          </p>
          <p className="mt-3 text-[13px] text-white/55">Cada frase sale de un hecho citado. Ahora se adapta a cada canal…</p>
        </div>
      )}

      <p className="case-hint mt-5 text-center">No se envía nada solo: el vendedor lo usa o lo ajusta.</p>
    </div>
  )
}
