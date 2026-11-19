'use client'

import { useEffect, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { FAV, UBITS_BLUE } from './shared'

/** Una tarjeta flotante de la portada; se enciende cuando es su momento del recorrido. */
export function FloatCard({ label, active, light = false, children }: { label: string; active: boolean; light?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border p-3.5 backdrop-blur-md transition-[border-color,box-shadow,opacity] duration-500 ${light ? 'bg-white text-[#303a47]' : 'bg-[#121418]/90 text-white'} ${
        active ? 'border-[#4d8bff] opacity-100 shadow-[0_0_0_4px_rgba(12,91,239,0.22),0_40px_80px_-30px_rgba(0,0,0,0.9)]' : `${light ? 'border-black/10' : 'border-white/10'} opacity-80 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]`
      }`}
    >
      <p className={`mb-2.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] ${light ? 'text-[#5c646f]' : 'text-white/50'}`}>
        <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${active ? 'bg-[#4d8bff]' : light ? 'bg-black/15' : 'bg-white/20'}`} />
        {label}
      </p>
      {children}
    </div>
  )
}

const PROMPT: L = { es: 'Quiero medir liderazgo y bienestar en el equipo comercial, 3 secciones en escala', en: 'I want to measure leadership and well-being in the sales team, 3 sections on a scale' }

/** «Crear con IA»: el pedido se escribe y aparecen las secciones que propone el agente. */
export function AiPromptCard({ active, still }: { active: boolean; still: boolean }) {
  const { t } = useLocale()
  const text = t(PROMPT)
  const [chars, setChars] = useState(still ? text.length : 0)
  useEffect(() => {
    if (still) return setChars(text.length)
    if (!active) return
    setChars(0)
    const id = window.setInterval(() => setChars((c) => (c >= text.length ? c : c + 2)), 28)
    return () => window.clearInterval(id)
  }, [active, still, text])
  const done = chars >= text.length
  return (
    <>
      <p className="min-h-[3.6em] rounded-lg bg-white/[0.06] p-2 text-[11px] leading-snug text-white/85">
        {text.slice(0, chars)}
        {!done && <span className="hd-caret ml-px inline-block h-3 w-px translate-y-0.5 bg-white" />}
      </p>
      <div className="mt-2 space-y-1">
        {[t({ es: '1 · Liderazgo', en: '1 · Leadership' }), t({ es: '2 · Bienestar', en: '2 · Well-being' }), t({ es: '3 · Carga de trabajo', en: '3 · Workload' })].map((s, i) => (
          <p key={s} className={`flex items-center justify-between rounded-md bg-white/[0.04] px-2 py-1 text-[10px] transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${i * 160}ms` }}>
            {s} <span className="text-white/40">{t({ es: '4 preg.', en: '4 q.' })}</span>
          </p>
        ))}
      </div>
    </>
  )
}

const LIKERT: readonly L[] = [
  { es: 'Nada', en: 'Not at all' },
  { es: 'Poco', en: 'Little' },
  { es: 'Neutral', en: 'Neutral' },
  { es: 'Bastante', en: 'Quite' },
  { es: 'Mucho', en: 'Very' },
]

/** El colaborador responde en el celular: la opción se marca y la barra de avance llega al final. */
export function PhoneCard({ active, still }: { active: boolean; still: boolean }) {
  const { t } = useLocale()
  const [picked, setPicked] = useState<number | null>(still ? 3 : null)
  useEffect(() => {
    if (still) return setPicked(3)
    if (!active) return
    setPicked(null)
    const id = window.setTimeout(() => setPicked(3), 1100)
    return () => window.clearTimeout(id)
  }, [active, still])
  return (
    <div className="mx-auto w-[136px] rounded-[1.6rem] border-[5px] border-[#2a2d33] bg-white p-2.5 pt-4 text-[#303a47]">
      <span className="mx-auto mb-2 block h-1 w-10 rounded-full bg-black/15" aria-hidden="true" />
      <div className="h-1 overflow-hidden rounded-full bg-[#ecf1fa]">
        <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: picked === null ? '80%' : '100%', background: UBITS_BLUE }} />
      </div>
      <p className="mt-2 text-[9px] text-[#5c646f]">1.1 · {t({ es: 'Mi líder', en: 'My leader' })}</p>
      <p className="mt-1 text-[11px] font-medium leading-snug">{t({ es: 'Mi líder reconoce mi trabajo.', en: 'My leader recognizes my work.' })}</p>
      <div className="mt-2 space-y-1">
        {LIKERT.map((o, i) => (
          <span key={o.es} className="block rounded-md border px-2 py-1 text-[9px] transition-all duration-300" style={i === picked ? { borderColor: UBITS_BLUE, background: 'rgba(12,91,239,0.08)', color: UBITS_BLUE, fontWeight: 600 } : { borderColor: '#e2e4e8' }}>
            {t(o)}
          </span>
        ))}
      </div>
      <span className="mt-2 block rounded-md py-1 text-center text-[9px] font-semibold text-white transition-opacity duration-300" style={{ background: UBITS_BLUE, opacity: picked === null ? 0.4 : 1 }}>
        {t({ es: 'Enviar', en: 'Send' })}
      </span>
    </div>
  )
}

const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2
  const d = 60 + (i % 4) * 18
  return { dx: Math.cos(a) * d, dy: Math.sin(a) * d - 20, rot: (i % 2 ? 1 : -1) * (200 + i * 20), color: [UBITS_BLUE, ...FAV][i % 6], delay: (i % 5) * 0.03 }
})

/** El cierre que ve el colaborador: el momento ganador, con confeti cada vez que llega. */
export function ThanksCard({ active, burst }: { active: boolean; burst: number }) {
  const { t } = useLocale()
  return (
    <div className="relative text-center">
      {active && (
        <span key={burst} className="pointer-events-none absolute left-1/2 top-6" aria-hidden="true">
          {CONFETTI.map((p, i) => (
            <span
              key={i}
              className="hd-burst absolute h-2 w-1.5 rounded-sm"
              style={{ background: p.color, animationDelay: `${p.delay}s`, ['--dx' as string]: `${p.dx}px`, ['--dy' as string]: `${p.dy}px`, ['--rot' as string]: `${p.rot}deg` }}
            />
          ))}
        </span>
      )}
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg text-white" style={{ background: '#2e8a55' }} aria-hidden="true">✓</span>
      <p className="mt-2 text-[15px] font-semibold leading-tight">{t({ es: '¡Gracias por tu participación!', en: 'Thanks for taking part!' })}</p>
      <p className="mt-1 text-[10px] leading-snug text-[#5c646f]">{t({ es: 'Tu respuesta se suma a la de tu área, nunca se muestra sola.', en: 'Your answer joins your area’s, never shown alone.' })}</p>
    </div>
  )
}

/** Medidor de eNPS de −100 a 100; la aguja se mueve con cada respuesta. */
export function EnpsGauge({ value }: { value: number }) {
  const { t } = useLocale()
  const angle = (value / 100) * 90
  return (
    <div>
      <svg viewBox="0 0 160 92" className="w-full" aria-hidden="true">
        {[FAV[0], FAV[2], FAV[4]].map((c, i) => {
          const a0 = Math.PI * (1 - i / 3)
          const a1 = Math.PI * (1 - (i + 1) / 3)
          const p = (a: number) => `${80 + Math.cos(a) * 64} ${84 - Math.sin(a) * 64}`
          return <path key={c} d={`M ${p(a0 + (i ? -0.02 : 0))} A 64 64 0 0 1 ${p(a1 + (i < 2 ? 0.02 : 0))}`} fill="none" stroke={c} strokeWidth="12" />
        })}
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '80px 84px', transition: 'transform 1s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <line x1="80" y1="84" x2="80" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="80" cy="84" r="6" fill="white" />
      </svg>
      <p className="-mt-1 text-center text-2xl font-light tabular-nums">+{value}</p>
      <p className="text-center text-[10px] text-white/50">{t({ es: 'promotores − detractores', en: 'promoters − detractors' })}</p>
    </div>
  )
}

/** La plantilla normativa: la NOM 035 exige que responda el 100 %. */
export function NomBadge() {
  const { t } = useLocale()
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white" style={{ background: '#2e8a55' }}>
        <span className="hd-ping absolute inset-0 rounded-xl bg-[#2e8a55]" aria-hidden="true" />
        <span className="relative">035</span>
      </span>
      <span className="text-[11px] leading-snug text-white/80">
        {t({ es: 'Plantilla oficial NOM 035', en: 'Official NOM 035 template' })}
        <span className="block text-white/50">{t({ es: 'Guía III · exige 100 % de participación', en: 'Guide III · requires 100% participation' })}</span>
      </span>
    </div>
  )
}
