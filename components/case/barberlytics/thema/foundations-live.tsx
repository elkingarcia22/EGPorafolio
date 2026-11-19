'use client'

import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useTick } from './live-pieces'
import { SPECIMEN_FONTS } from './specimen-fonts'

const TILE = 'relative overflow-hidden rounded-2xl border border-fg/15 p-6'

/* ── Color: escala derivada del primario ──────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const c = (a: number, t: number) => Math.round(a + (t - a) * amount)
  return `rgb(${c(r, target[0])}, ${c(g, target[1])}, ${c(b, target[2])})`
}

/** 50 → 900: aclara hacia el blanco y oscurece hacia el negro, como hace el sistema con los hovers y superficies. */
function ramp(primary: string): string[] {
  const white: [number, number, number] = [255, 255, 255]
  const black: [number, number, number] = [12, 11, 10]
  return [0.9, 0.75, 0.55, 0.35, 0.15].map((a) => mix(primary, white, a)).concat([primary], [0.2, 0.4, 0.6].map((a) => mix(primary, black, a)))
}

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800']

function ColorTile() {
  const tick = useTick(2600)
  const theme = THEMA_CASE.themes[tick % THEMA_CASE.themes.length]
  return (
    <div className={`${TILE} md:col-span-2`}>
      <p className="mono-label mb-1 opacity-60">Color</p>
      <p className="mb-5 text-2xl font-light">{theme.name}</p>
      <div key={theme.id} className="grid grid-cols-9 gap-1.5">
        {ramp(theme.primary).map((c, i) => (
          <div key={STEPS[i]} className="origin-bottom animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${i * 45}ms` }}>
            <span className="block h-20 rounded-lg md:h-28" style={{ background: c }} />
            <span className="mt-1.5 block font-mono text-[10px] opacity-60">{STEPS[i]}</span>
          </div>
        ))}
      </div>
      <p className="mono-label mb-2 mt-6 opacity-60">IA · primario → +120°</p>
      <span className="block h-3 rounded-full transition-[background] duration-700" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.aiEnd})` }} />
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        {[['Éxito', '#3fbf7f'], ['Error', '#e5484d'], ['Aviso', '#f5a524'], ['Info', '#3e8ef7']].map(([name, c]) => (
          <span key={name} className="flex items-center gap-1.5 rounded-full border border-fg/15 px-2.5 py-1">
            <span className="h-2 w-2 rounded-full" style={{ background: c }} />
            {name} <span className="opacity-50">· no cambia</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Tipografía ───────────────────────────────────────────────────────── */

function TypeTile() {
  const tick = useTick(2200)
  const font = SPECIMEN_FONTS[tick % SPECIMEN_FONTS.length]
  return (
    <div className={`${TILE} md:col-span-2 md:row-span-2`}>
      <p className="mono-label mb-4 opacity-60">Tipografía · 9 familias</p>
      <div key={font.name} className="animate-[ramp-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
        <p className={`${font.className} text-[clamp(5rem,3rem+6vw,9rem)] leading-none`}>Aa</p>
        <p className={`${font.className} mt-4 text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] leading-tight`}>Cortes con oficio, a tu hora.</p>
        <p className={`${font.className} mt-3 max-w-[38ch] text-sm leading-relaxed opacity-70`}>Reserva en segundos con tu barbero de siempre o con quien tenga el primer hueco.</p>
      </div>
      <ul className="mt-8 flex flex-wrap gap-2">
        {SPECIMEN_FONTS.map((f) => (
          <li key={f.name} className={`rounded-full border px-3 py-1 text-xs transition-colors duration-300 ${f.name === font.name ? 'border-signal bg-signal text-paper' : 'border-fg/15 opacity-70'}`}>
            <span className={f.className}>{f.name}</span>
          </li>
        ))}
      </ul>
      <p className="mono-label mt-3 opacity-50">{font.role}</p>
    </div>
  )
}

/* ── Radios ───────────────────────────────────────────────────────────── */

const RADII = [
  { name: 'none', card: 0, ctl: 0 },
  { name: 'sm', card: 8, ctl: 5 },
  { name: 'md', card: 14, ctl: 9 },
  { name: 'lg', card: 22, ctl: 14 },
]

function RadiusTile() {
  const tick = useTick(1500)
  const r = RADII[tick % RADII.length]
  return (
    <div className={TILE}>
      <p className="mono-label mb-4 opacity-60">Radios · 4 escalas</p>
      <div className="border border-fg/20 p-4 transition-[border-radius] duration-700 ease-expo" style={{ borderRadius: r.card }}>
        <span className="block h-2 w-2/3 rounded-full bg-fg/30" />
        <span className="mt-3 block border border-fg/25 px-3 py-2 text-xs opacity-60 transition-[border-radius] duration-700 ease-expo" style={{ borderRadius: r.ctl }}>Nombre</span>
        <span className="mt-3 inline-block bg-signal px-4 py-2 text-xs text-paper transition-[border-radius] duration-700 ease-expo" style={{ borderRadius: r.ctl }}>Guardar</span>
      </div>
      <div className="mt-4 flex gap-1.5">
        {RADII.map((x) => (
          <span key={x.name} className={`rounded-md px-2 py-0.5 font-mono text-[11px] ${x.name === r.name ? 'bg-fg text-bg' : 'opacity-50'}`}>{x.name}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Espaciado ────────────────────────────────────────────────────────── */

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64]

function SpacingTile() {
  return (
    <div className={TILE}>
      <p className="mono-label mb-4 opacity-60">Espaciado · base 4 px</p>
      <ul className="space-y-2">
        {SPACE.map((s) => (
          <li key={s} className="flex items-center gap-3">
            <span className="w-7 font-mono text-[11px] opacity-60">{s}</span>
            <span data-reveal="right" className="h-2.5 rounded-sm bg-signal/80" style={{ width: s * 2.4 }} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Movimiento ───────────────────────────────────────────────────────── */

const CURVES = [
  { name: 'ease-out-expo', css: 'cubic-bezier(0.16, 1, 0.3, 1)', ms: 500 },
  { name: 'ease-standard', css: 'cubic-bezier(0.2, 0, 0, 1)', ms: 300 },
]

function MotionTile() {
  return (
    <div className={`${TILE} md:col-span-2`}>
      <p className="mono-label mb-5 opacity-60">Movimiento · 100 · 150 · 300 · 500 ms</p>
      <ul className="space-y-5">
        {CURVES.map((c, i) => (
          <li key={c.name}>
            <p className="mb-2 flex justify-between font-mono text-[11px] opacity-70">
              <span>{c.name}</span>
              <span>{c.css}</span>
            </p>
            <span className="relative block h-8 rounded-full bg-fg/[0.06]">
              <span
                className="absolute left-1 top-1 h-6 w-6 rounded-full bg-signal animate-[motion-run_2.4s_infinite_alternate]"
                style={{ animationTimingFunction: c.css, animationDelay: `${i * 0.2}s` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs opacity-55">Con «reducir movimiento», todo queda quieto.</p>
    </div>
  )
}

/** Fundamentos en vivo: tipografía, color, radios, espaciado y movimiento. */
export function FoundationsLive() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'Los fundamentos no son una página de referencia: son las perillas del sistema. Cambia una y todo lo demás la sigue.',
          en: 'Foundations aren’t a reference page: they’re the system’s dials. Turn one and everything else follows.',
        })}
      </p>
      <div data-reveal className="grid gap-4 md:grid-cols-4">
        <TypeTile />
        <ColorTile />
        <RadiusTile />
        <SpacingTile />
        <MotionTile />
      </div>
    </div>
  )
}
