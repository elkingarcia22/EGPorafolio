'use client'

import { useMemo, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { ClipperOrb } from '../clipper-orb'

/** Los 10 temas reales de Thema (src/themes/presets.ts): primario en claro y en oscuro. */
const PRESETS = [
  { id: 'azul', name: 'Azul', light: '#0C5BEF', dark: '#3865F5', ai: '#E11D48' },
  { id: 'premium', name: 'Premium', light: '#8A6420', dark: '#D9B36A', ai: '#3F72D8' },
  { id: 'jade', name: 'Premium Jade', light: '#1F7A5A', dark: '#7FD8AF' },
  { id: 'platino', name: 'Premium Platino', light: '#4A5B70', dark: '#C8D3E0' },
  { id: 'indigo', name: 'Índigo', light: '#4F46E5', dark: '#818CF8' },
  { id: 'violeta', name: 'Violeta', light: '#7C3AED', dark: '#A78BFA' },
  { id: 'esmeralda', name: 'Esmeralda', light: '#059669', dark: '#34D399' },
  { id: 'teal', name: 'Teal', light: '#0D9488', dark: '#2DD4BF' },
  { id: 'cian', name: 'Cian', light: '#0891B2', dark: '#22D3EE' },
  { id: 'rojo', name: 'Rojo', light: '#DC2626', dark: '#F87171', ai: '#F59E0B' },
] as const

/* ── Color: lo que el sistema deriva de un solo primario ─────────────── */

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toHsl(hex: string): [number, number, number] {
  const [r, g, b] = toRgb(hex).map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s * 100, l * 100]
}

/** El fin del gradiente de IA: el primario girado 120° en el círculo cromático. */
function aiEndFrom(hex: string, dark: boolean): string {
  const [h, s] = toHsl(hex)
  return `hsl(${(h + 120) % 360} ${Math.max(s, 86)}% ${dark ? 58 : 50}%)`
}

/** Texto encima del primario: blanco o tinta, según la luminancia. */
function inkOn(hex: string): string {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#16130f' : '#ffffff'
}

const withAlpha = (hex: string, a: number) => {
  const [r, g, b] = toRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/* ── La mini app de una barbería que se recolorea ────────────────────── */

function MiniApp({ primary, aiEnd, dark }: { primary: string; aiEnd: string; dark: boolean }) {
  const surface = dark ? '#17150f' : '#ffffff'
  const app = dark ? '#100e0b' : '#f4f6f8'
  const text = dark ? '#efe9dd' : '#303a47'
  const muted = dark ? 'rgba(239,233,221,0.55)' : '#5c646f'
  const border = dark ? 'rgba(239,233,221,0.1)' : '#e4e6ea'
  const ink = inkOn(primary)
  const soft = withAlpha(primary, dark ? 0.18 : 0.1)
  const card = { background: surface, borderColor: border }

  return (
    <div className="overflow-hidden rounded-2xl shadow-[0_50px_100px_-40px_rgba(0,0,0,0.75)] ring-1 ring-black/10 transition-colors duration-500" style={{ background: app, color: text }}>
      <div className="flex items-center gap-3 border-b px-5 py-3.5 transition-colors duration-500" style={{ borderColor: border, background: surface }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-500" style={{ background: primary, color: ink }}>LA</span>
        <span className="text-sm font-semibold">Barbería Los Andes</span>
        <span className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-500" style={{ background: soft, color: dark ? primary : primary }}>Hoy · 24 citas</span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="rounded-xl border p-4 transition-colors duration-500" style={card}>
          <p className="text-[11px]" style={{ color: muted }}>Próxima cita</p>
          <p className="mt-1 text-base font-semibold">Andrés Vargas · Fade</p>
          <p className="text-xs" style={{ color: muted }}>5:00 p. m. · con Emilio</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: soft }}>
            <span className="block h-full w-2/3 rounded-full transition-colors duration-500" style={{ background: primary }} />
          </div>
        </div>
        <div className="rounded-xl border p-4 transition-colors duration-500" style={card}>
          <p className="text-[11px]" style={{ color: muted }}>Horas libres</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-xs">
            {['3:00', '3:30', '4:15', '5:00', '5:30', '6:00'].map((h, i) => (
              <span key={h} className="rounded-md border py-1.5 transition-colors duration-500" style={i === 3 ? { background: primary, color: ink, borderColor: primary } : { borderColor: border }}>{h}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border p-4 transition-colors duration-500" style={card}>
          <span className="text-xs">Recordatorio por WhatsApp</span>
          <span className="relative h-5 w-9 rounded-full transition-colors duration-500" style={{ background: primary }}>
            <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full" style={{ background: ink }} />
          </span>
        </div>
        <button type="button" tabIndex={-1} className="rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-500" style={{ background: primary, color: ink }}>
          Confirmar cita →
        </button>
        <div className="rounded-xl p-[1.5px] transition-[background] duration-700 sm:col-span-2" style={{ background: `linear-gradient(90deg, ${primary}, ${aiEnd})` }}>
          <div className="flex items-center gap-3 rounded-[10px] px-4 py-3" style={{ background: surface }}>
            <ClipperOrb size={26} />
            <p className="text-xs">
              <span className="font-semibold">Clipper</span> <span style={{ color: muted }}>· 3 clientes te toca llamarlos hoy para su próxima visita.</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-5 pb-5 text-[11px]">
        {[['Confirmada', '#17B16D'], ['Por cobrar', '#FFA920'], ['Cancelada', '#CF0E34']].map(([label, c]) => (
          <span key={label} className="rounded-full px-2.5 py-1" style={{ background: withAlpha(c, 0.14), color: c }}>{label}</span>
        ))}
        <span className="ml-auto self-center" style={{ color: muted }}>← el significado no cambia</span>
      </div>
    </div>
  )
}

/** Probador de temas: elige un tema o tu color y mira cómo cambia la app de una barbería. */
export function ThemePlayground() {
  const { t } = useLocale()
  const [presetId, setPresetId] = useState<string>('premium')
  const [custom, setCustom] = useState('#8E2B2B')
  const [dark, setDark] = useState(true)
  const preset = PRESETS.find((p) => p.id === presetId)
  const primary = preset ? (dark ? preset.dark : preset.light) : custom
  const aiEnd = useMemo(() => (preset && 'ai' in preset && preset.ai ? preset.ai : aiEndFrom(primary, dark)), [preset, primary, dark])

  return (
    <div data-reveal="device" className="grid gap-8 rounded-3xl border border-fg/15 p-5 md:p-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="mono-label mb-4 opacity-60">{t({ es: 'Elige el tema de tu barbería', en: 'Pick your shop’s theme' })}</p>
        <ul role="radiogroup" aria-label={t({ es: 'Tema', en: 'Theme' })} className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                role="radio"
                aria-checked={presetId === p.id}
                onClick={() => setPresetId(p.id)}
                className="flex w-full items-center gap-2 rounded-lg border border-fg/15 px-2.5 py-2 text-left text-xs transition-colors hover:border-fg/40 aria-checked:border-signal aria-checked:bg-signal/10"
              >
                <span className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: dark ? p.dark : p.light }} />
                {p.name}
              </button>
            </li>
          ))}
        </ul>
        <label className={`mt-3 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-xs transition-colors ${presetId === 'custom' ? 'border-signal bg-signal/10' : 'border-fg/15 hover:border-fg/40'}`}>
          <input
            type="color"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value)
              setPresetId('custom')
            }}
            onClick={() => setPresetId('custom')}
            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
            aria-label={t({ es: 'Tu color', en: 'Your color' })}
          />
          <span>
            <span className="block font-medium">{t({ es: 'Personalizado · tu color', en: 'Custom · your color' })}</span>
            <span className="opacity-60">{t({ es: 'En la app también se saca del logo', en: 'In the app it can also come from the logo' })}</span>
          </span>
        </label>
        <div className="mt-5 flex gap-2" role="radiogroup" aria-label={t({ es: 'Modo', en: 'Mode' })}>
          {[false, true].map((d) => (
            <button key={String(d)} type="button" role="radio" aria-checked={dark === d} onClick={() => setDark(d)} className="mono-label flex-1 border border-fg/20 px-3 py-2 aria-checked:border-signal aria-checked:bg-signal aria-checked:text-paper">
              {d ? t({ es: 'Oscuro', en: 'Dark' }) : t({ es: 'Claro', en: 'Light' })}
            </button>
          ))}
        </div>
        <p className="mono-label mb-2 mt-6 opacity-60">{t({ es: 'Gradiente de IA, derivado', en: 'AI gradient, derived' })}</p>
        <span className="block h-2.5 rounded-full transition-[background] duration-700" style={{ background: `linear-gradient(90deg, ${primary}, ${aiEnd})` }} />
      </div>
      <div className="lg:col-span-8">
        <MiniApp primary={primary} aiEnd={aiEnd} dark={dark} />
      </div>
    </div>
  )
}
