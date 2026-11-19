'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE, type ThemeShot } from '@/lib/content/cases/barberlytics/thema-case'
import { useTick } from './live-pieces'
import { SPECIMEN_FONTS } from './specimen-fonts'

const TILE = 'relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6'
const THEME_MS = 3200

/* ── Escala derivada del primario ─────────────────────────────────────── */

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = rgb(hex)
  const c = (a: number, t: number) => Math.round(a + (t - a) * amount)
  return `rgb(${c(r, target[0])}, ${c(g, target[1])}, ${c(b, target[2])})`
}

function ramp(primary: string): string[] {
  const white: [number, number, number] = [255, 255, 255]
  const black: [number, number, number] = [10, 9, 8]
  return [0.88, 0.72, 0.52, 0.32, 0.14].map((a) => mix(primary, white, a)).concat([primary], [0.25, 0.45, 0.65].map((a) => mix(primary, black, a)))
}

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800']

/* ── Color ────────────────────────────────────────────────────────────── */

function ColorTile({ theme, onPick }: { theme: ThemeShot; onPick: (i: number) => void }) {
  const steps = ramp(theme.primary)
  return (
    <div className={`${TILE} min-h-[460px] md:col-span-2 md:row-span-2`}>
      <span className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-60 blur-3xl transition-[background] duration-1000" style={{ background: `radial-gradient(circle, ${theme.primary}, ${theme.aiEnd} 60%, transparent 70%)` }} aria-hidden="true" />
      <p className="mono-label relative text-white/50">Color · {THEMA_CASE.themes.length} temas</p>
      <p key={theme.id} className="relative mt-2 animate-[ramp-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] text-[clamp(2.4rem,1.6rem+2.6vw,4.2rem)] font-light leading-none text-white">{theme.name}</p>
      <p className="relative mt-2 font-mono text-sm text-white/60">{theme.primary}</p>

      <div key={`ramp-${theme.id}`} className="relative mt-8 grid h-[220px] grid-cols-9 items-end gap-1.5">
        {steps.map((c, i) => (
          <div key={STEPS[i]} className="flex h-full flex-col justify-end">
            <span
              className="block origin-bottom animate-[bar-rise_0.9s_cubic-bezier(0.16,1,0.3,1)_both] rounded-t-lg"
              style={{ background: c, height: `${46 + i * 6}%`, animationDelay: `${i * 55}ms`, boxShadow: i === 5 ? `0 0 40px -6px ${theme.primary}` : undefined }}
            />
            <span className="mt-2 text-center font-mono text-[10px] text-white/45">{STEPS[i]}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-6 flex items-center gap-4">
        <span className="h-3 flex-1 rounded-full transition-[background] duration-1000" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.aiEnd})`, boxShadow: `0 0 30px -4px ${theme.aiEnd}` }} />
        <span className="mono-label shrink-0 text-white/50">IA · +120°</span>
      </div>
      <div className="relative mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Tema">
        {THEMA_CASE.themes.map((th, i) => (
          <button
            key={th.id}
            type="button"
            role="radio"
            aria-checked={th.id === theme.id}
            aria-label={th.name}
            onClick={() => onPick(i)}
            className={`h-7 w-7 rounded-full transition-transform duration-300 hover:scale-110 ${th.id === theme.id ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0f0d0b]' : 'ring-1 ring-white/20'}`}
            style={{ background: th.primary }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Tipografía ───────────────────────────────────────────────────────── */

function TypeTile({ theme }: { theme: ThemeShot }) {
  const tick = useTick(2400)
  const font = SPECIMEN_FONTS[tick % SPECIMEN_FONTS.length]
  return (
    <div className={`${TILE} min-h-[460px] md:col-span-2 md:row-span-2`}>
      <p className="mono-label text-white/50">Tipografía · 9 familias</p>
      <div key={font.name} className="animate-[type-in_0.9s_cubic-bezier(0.16,1,0.3,1)_both]">
        <p
          className={`${font.className} bg-clip-text text-[clamp(7rem,4rem+9vw,13rem)] leading-[0.95] text-transparent transition-[background] duration-1000`}
          style={{ backgroundImage: `linear-gradient(120deg, #ffffff 10%, ${theme.primary} 55%, ${theme.aiEnd})` }}
        >
          Aa
        </p>
        <p className={`${font.className} mt-2 text-3xl text-white`}>{font.name}</p>
        <p className="mono-label mt-1 text-white/45">{font.role}</p>
      </div>
      <div className="absolute inset-x-0 bottom-6 overflow-hidden">
        <p key={`m-${font.name}`} className={`${font.className} animate-[marquee_14s_linear_infinite] whitespace-nowrap text-xl text-white/35`}>
          Cortes con oficio, a tu hora · Reserva en segundos · Tu barbero de siempre · Cortes con oficio, a tu hora · Reserva en segundos · Tu barbero de siempre ·
        </p>
      </div>
    </div>
  )
}

/* ── Radios ───────────────────────────────────────────────────────────── */

const RADII = [0, 8, 14, 22, 999]

function RadiusTile({ theme }: { theme: ThemeShot }) {
  const tick = useTick(1300)
  const r = RADII[tick % RADII.length]
  return (
    <div className={TILE}>
      <p className="mono-label text-white/50">Radios · 4 escalas</p>
      <div className="mt-5 flex items-center justify-center gap-4">
        {[96, 64, 40].map((size, i) => (
          <span
            key={size}
            className="block transition-[border-radius,background] duration-700 ease-expo"
            style={{ width: size, height: size, borderRadius: Math.min(r, size / 2), background: i === 0 ? theme.primary : i === 1 ? `${theme.primary}80` : `${theme.aiEnd}`, boxShadow: i === 0 ? `0 20px 40px -14px ${theme.primary}` : undefined }}
          />
        ))}
      </div>
      <p className="mt-5 text-center font-mono text-xs text-white/55">{r === 999 ? 'full' : `${r} px`}</p>
    </div>
  )
}

/* ── Espaciado ────────────────────────────────────────────────────────── */

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64]

function SpacingTile({ theme }: { theme: ThemeShot }) {
  return (
    <div className={TILE}>
      <p className="mono-label mb-4 text-white/50">Espaciado · base 4</p>
      <ul className="space-y-1.5">
        {SPACE.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="w-6 font-mono text-[10px] text-white/45">{s}</span>
            <span
              data-reveal="right"
              className="h-2 rounded-full transition-[background] duration-1000"
              style={{ width: `${(s / 64) * 100}%`, background: `linear-gradient(90deg, ${theme.primary}, ${i > 5 ? theme.aiEnd : theme.primary})` }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Movimiento ───────────────────────────────────────────────────────── */

const CURVES = [
  { name: 'ease-out-expo · 500', css: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { name: 'ease-standard · 300', css: 'cubic-bezier(0.2, 0, 0, 1)' },
  { name: 'linear', css: 'linear' },
]

function MotionTile({ theme }: { theme: ThemeShot }) {
  return (
    <div className={`${TILE} md:col-span-2`}>
      <p className="mono-label mb-5 text-white/50">Movimiento · 100 · 150 · 300 · 500 ms</p>
      <ul className="space-y-4">
        {CURVES.map((c, i) => (
          <li key={c.name} className="grid grid-cols-[9rem_1fr] items-center gap-4">
            <span className="font-mono text-[11px] text-white/55">{c.name}</span>
            <span className="relative block h-7 rounded-full bg-white/[0.05]">
              <span
                className="absolute left-1 top-1 h-5 w-5 rounded-full animate-[motion-run_2.2s_infinite_alternate]"
                style={{ animationTimingFunction: c.css, animationDelay: `${i * 0.15}s`, background: i === 2 ? 'rgba(255,255,255,0.4)' : theme.primary, boxShadow: `0 0 22px 2px ${i === 2 ? 'transparent' : theme.primary}` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Fundamentos en vivo, sobre oscuro: todo el panel cambia con el tema. */
export function FoundationsLive() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [index, setIndex] = useState(0)
  const [pinned, setPinned] = useState(false)
  const theme = THEMA_CASE.themes[index]

  useEffect(() => {
    if (pinned || reducedMotion) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % THEMA_CASE.themes.length), THEME_MS)
    return () => window.clearInterval(id)
  }, [pinned, reducedMotion])

  return (
    <div>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'Los fundamentos son las perillas del sistema: cambia el color y todo lo demás lo sigue. Toca un tema para fijarlo.',
          en: 'Foundations are the system’s dials: change the color and everything else follows. Tap a theme to pin it.',
        })}
      </p>
      <div data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-4 text-white md:p-6">
        <span className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1.2px)] [background-size:22px_22px]" aria-hidden="true" />
        <div className="relative grid gap-4 md:grid-cols-4">
          <ColorTile
            theme={theme}
            onPick={(i) => {
              setIndex(i)
              setPinned(true)
            }}
          />
          <TypeTile theme={theme} />
          <RadiusTile theme={theme} />
          <SpacingTile theme={theme} />
          <MotionTile theme={theme} />
        </div>
      </div>
    </div>
  )
}
