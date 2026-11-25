'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { ClipperOrb } from '../clipper-orb'
import { aiEndFrom, aiStops, inkOn, shade, withAlpha } from './color-utils'

/* ── Barberías de ejemplo y sus emblemas ──────────────────────────────── */

interface Shop {
  id: string
  name: string
  initials: string
  primary: string
  secondary: string
  dark: boolean
  Emblem: (props: { primary: string; secondary: string }) => React.ReactElement
}

function ClasicoEmblem({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill={primary} />
      <circle cx="100" cy="100" r="80" fill="none" stroke={secondary} strokeWidth="2" strokeDasharray="4 6" />
      <g transform="translate(100 108) scale(0.6) translate(-100 -92)" stroke={secondary} strokeWidth="7" fill="none" strokeLinecap="round">
        <circle cx="80" cy="122" r="12" />
        <circle cx="120" cy="122" r="12" />
        <path d="M88 112 L130 62 M112 112 L70 62" />
      </g>
      <text x="100" y="66" textAnchor="middle" fill={secondary} fontSize="15" fontWeight="800" letterSpacing="1.5">EL CLÁSICO</text>
      <text x="100" y="152" textAnchor="middle" fill={secondary} fontSize="9" letterSpacing="2">BARBERÍA · 1998</text>
    </svg>
  )
}

function NavajaEmblem({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <path d="M100 10 L176 38 L170 120 Q160 168 100 192 Q40 168 30 120 L24 38 Z" fill={primary} />
      <path d="M58 118 L120 86 L148 96 L86 128 Z" fill={secondary} />
      <path d="M120 86 L150 70" stroke={secondary} strokeWidth="7" strokeLinecap="round" />
      <text x="100" y="64" textAnchor="middle" fill={secondary} fontSize="17" fontWeight="800" letterSpacing="2">NAVAJA</text>
      <text x="100" y="154" textAnchor="middle" fill={secondary} fontSize="15" fontWeight="700" letterSpacing="4">AZUL</text>
    </svg>
  )
}

function AndesEmblem({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <path d="M100 8 L182 54 L182 146 L100 192 L18 146 L18 54 Z" fill={secondary} stroke={primary} strokeWidth="4" />
      <path d="M52 120 L86 72 L104 96 L122 64 L148 120 Z" fill={primary} />
      <text x="100" y="146" textAnchor="middle" fill={primary} fontSize="15" fontWeight="800" letterSpacing="2">LOS ANDES</text>
    </svg>
  )
}

function VerdeEmblem({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="12" y="12" width="176" height="176" rx="44" fill={primary} />
      <rect x="88" y="44" width="24" height="88" rx="12" fill={secondary} />
      <g stroke={primary} strokeWidth="7">
        <path d="M88 64 L112 52 M88 86 L112 74 M88 108 L112 96 M88 130 L112 118" />
      </g>
      <text x="100" y="158" textAnchor="middle" fill={secondary} fontSize="17" fontWeight="800" letterSpacing="2">VERDE</text>
      <text x="100" y="174" textAnchor="middle" fill={secondary} fontSize="9" fontWeight="600" letterSpacing="2.5">BARBER CLUB</text>
    </svg>
  )
}

const SHOPS: readonly Shop[] = [
  { id: 'clasico', name: 'El Clásico', initials: 'EC', primary: '#B3261E', secondary: '#F2D7A6', dark: false, Emblem: ClasicoEmblem },
  { id: 'navaja', name: 'Navaja Azul', initials: 'NA', primary: '#1E4FD8', secondary: '#E8EEF9', dark: false, Emblem: NavajaEmblem },
  { id: 'andes', name: 'Los Andes', initials: 'LA', primary: '#D9B36A', secondary: '#1C1915', dark: true, Emblem: AndesEmblem },
  { id: 'verde', name: 'Verde Barber Club', initials: 'VB', primary: '#2E9C78', secondary: '#F3E3B5', dark: true, Emblem: VerdeEmblem },
]

const CYCLE_MS = 3800

/* ── La app del celular, pintada con el tema de la barbería ───────────── */

function ShopApp({ shop, primary }: { shop: Shop; primary: string }) {
  const dark = shop.dark
  const ink = inkOn(primary)
  const app = dark ? '#121009' : '#f4f6f8'
  const surface = dark ? '#1c1a15' : '#ffffff'
  const text = dark ? '#efe9dd' : '#303a47'
  const muted = dark ? 'rgba(239,233,221,0.55)' : '#5c646f'
  const border = dark ? 'rgba(239,233,221,0.1)' : '#e4e6ea'
  const stops = aiStops(primary)
  const card = { background: surface, borderColor: border }
  return (
    <div className="space-y-3 px-4 pb-6 pt-3 text-[11px] transition-colors duration-700" style={{ background: app, color: text }}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold transition-colors duration-700" style={{ background: primary, color: ink }}>{shop.initials}</span>
        <span className="text-[13px] font-semibold">{shop.name}</span>
      </div>
      <p className="pt-1 text-[17px] font-semibold leading-tight">Hola, Andrés</p>
      <div className="rounded-xl border p-3 transition-colors duration-700" style={card}>
        <p style={{ color: muted }}>Te toca el jueves 19</p>
        <p className="mt-0.5 text-[13px] font-semibold">Fade · con Emilio</p>
        <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: withAlpha(primary, dark ? 0.2 : 0.12), color: dark ? primary : shade(primary, -0.1) }}>Lo de siempre</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 text-center">
        {['L 16', 'M 17', 'M 18', 'J 19', 'V 20'].map((d, i) => (
          <span key={d} className="rounded-lg border py-1.5 transition-colors duration-700" style={i === 3 ? { background: primary, color: ink, borderColor: primary } : { borderColor: border }}>
            {d.split(' ')[0]}
            <span className="block text-[13px] font-semibold">{d.split(' ')[1]}</span>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-center">
        {['4:15', '5:00', '5:30'].map((h, i) => (
          <span key={h} className="rounded-lg border py-1.5 transition-colors duration-700" style={i === 1 ? { borderColor: primary, color: dark ? primary : shade(primary, -0.1), background: withAlpha(primary, 0.1) } : { borderColor: border }}>{h}</span>
        ))}
      </div>
      <button type="button" tabIndex={-1} className="w-full rounded-xl py-2.5 text-[12px] font-semibold transition-colors duration-700" style={{ background: primary, color: ink }}>
        Reservar →
      </button>
      <div className="rounded-xl p-[1.5px] transition-[background] duration-700" style={{ background: `linear-gradient(90deg, ${stops.join(', ')})` }}>
        <div className="flex items-center gap-2 rounded-[10px] px-3 py-2" style={{ background: surface }}>
          <ClipperOrb size={18} stops={stops} />
          <span style={{ color: muted }}>¿Lo de siempre con Emilio?</span>
        </div>
      </div>
    </div>
  )
}

/** Del logo a la app: el sistema saca los colores del logo y la app cambia de identidad. */
export function LogoToApp() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [index, setIndex] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [custom, setCustom] = useState<string | null>(null)
  const shop = SHOPS[index]
  const primary = custom ?? shop.primary

  useEffect(() => {
    if (pinned || reducedMotion) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SHOPS.length), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [pinned, reducedMotion])

  const palette = [primary, shop.secondary, shade(primary, -0.45), shade(primary, 0.7)]

  return (
    <div className="relative text-white">
      <span className="pointer-events-none absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-20 blur-3xl transition-[background] duration-1000" style={{ background: primary }} aria-hidden="true" />
      <span className="pointer-events-none absolute -right-20 bottom-0 h-[320px] w-[320px] rounded-full opacity-15 blur-3xl transition-[background] duration-1000" style={{ background: aiEndFrom(primary) }} aria-hidden="true" />

      <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto_minmax(0,300px)]">
        {/* El logo y sus colores */}
        <div>
          <p className="mono-label mb-5 text-white/50">{t({ es: '1 · El logo de la barbería', en: '1 · The shop’s logo' })}</p>
          <div key={`${shop.id}-${custom ?? ''}`} className="relative mx-auto aspect-square w-[min(260px,70%)] md:mx-0">
            <div className="animate-[ramp-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both] drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]">
              <shop.Emblem primary={primary} secondary={shop.secondary} />
            </div>
            <span className="pointer-events-none absolute inset-x-0 h-1 animate-[logo-scan_1.6s_cubic-bezier(0.65,0,0.35,1)_both] rounded-full bg-white/80 shadow-[0_0_24px_6px_rgba(255,255,255,0.6)]" aria-hidden="true" />
          </div>
          <p className="mono-label mb-3 mt-8 text-white/50">{t({ es: '2 · Los colores que el sistema saca del logo', en: '2 · The colors the system pulls from the logo' })}</p>
          <ul className="flex gap-3">
            {palette.map((c, i) => (
              <li key={`${c}-${i}`} className="animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${0.9 + i * 0.12}s` }}>
                <span className={`block h-12 w-12 rounded-xl ring-1 ring-white/15 ${i === 0 ? 'ring-2 ring-white' : ''}`} style={{ background: c }} />
                <span className="mt-1.5 block font-mono text-[9px] text-white/45">{i === 0 ? t({ es: 'primario', en: 'primary' }) : c.startsWith('#') ? c.toUpperCase() : ''}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden flex-col items-center gap-2 text-white/40 md:flex" aria-hidden="true">
          <span className="text-4xl">→</span>
          <span className="mono-label">{t({ es: '1 color', en: '1 color' })}</span>
        </div>

        {/* La app con su identidad */}
        <div>
          <p className="mono-label mb-5 text-white/50">{t({ es: '3 · Su app, con su identidad', en: '3 · Their app, with their identity' })}</p>
          <PhoneBody className="mx-auto w-full max-w-[290px]">
            <StatusBar />
            <ShopApp shop={shop} primary={primary} />
          </PhoneBody>
        </div>
      </div>

      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-2">
        {SHOPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={i === index && !custom}
            onClick={() => {
              setIndex(i)
              setCustom(null)
              setPinned(true)
            }}
            className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/75 transition-colors hover:border-white/40 aria-pressed:border-white aria-pressed:text-white"
          >
            <span className="h-3 w-3 rounded-full" style={{ background: s.primary }} />
            {s.name}
          </button>
        ))}
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/75 hover:border-white/40">
          <input
            type="color"
            value={custom ?? shop.primary}
            onChange={(e) => {
              setCustom(e.target.value)
              setPinned(true)
            }}
            className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
            aria-label={t({ es: 'Prueba tu color', en: 'Try your color' })}
          />
          {t({ es: 'Prueba tu color', en: 'Try your color' })}
        </label>
      </div>
      <p className="relative mt-4 text-center text-xs text-white/40">{t({ es: 'Barberías de ejemplo. En el producto, el tema «Personalizado» saca los colores del logo que sube la barbería.', en: 'Sample shops. In the product, the “Custom” theme pulls colors from the logo the shop uploads.' })}</p>
    </div>
  )
}
