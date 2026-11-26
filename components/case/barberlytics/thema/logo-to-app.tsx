'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { ClipperOrb } from '../clipper-orb'
import { aiEndFrom, aiStops, inkOn, shade, withAlpha } from './color-utils'
import { useNarrow } from './use-narrow'

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
        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] md:text-[10px] font-bold transition-colors duration-700" style={{ background: primary, color: ink }}>{shop.initials}</span>
        <span className="text-[13px] font-semibold">{shop.name}</span>
      </div>
      <p className="pt-1 text-[17px] font-semibold leading-tight">Hola, Andrés</p>
      <div className="rounded-xl border p-3 transition-colors duration-700" style={card}>
        <p style={{ color: muted }}>Te toca el jueves 19</p>
        <p className="mt-0.5 text-[13px] font-semibold">Fade · con Emilio</p>
        <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] md:text-[10px] font-medium" style={{ background: withAlpha(primary, dark ? 0.2 : 0.12), color: dark ? primary : shade(primary, -0.1) }}>Lo de siempre</span>
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
  const narrow = useNarrow()

  if (narrow)
    return (
      <LogoToAppTall
        shop={shop}
        primary={primary}
        palette={palette}
        custom={custom}
        onPick={(i) => {
          setIndex(i)
          setCustom(null)
          setPinned(true)
        }}
        onCustom={(c) => {
          setCustom(c)
          setPinned(true)
        }}
      />
    )

  return (
    <div className="relative text-white">
      <span className="pointer-events-none absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-20 blur-3xl transition-[background] duration-1000" style={{ background: primary }} aria-hidden="true" />
      <span className="pointer-events-none absolute -right-20 bottom-0 h-[320px] w-[320px] rounded-full opacity-15 blur-3xl transition-[background] duration-1000" style={{ background: aiEndFrom(primary) }} aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[820px] items-center justify-center gap-10 md:grid-cols-[minmax(0,280px)_auto_minmax(0,290px)] md:gap-12">
        {/* El logo y sus colores (en teléfono, lado a lado) */}
        <div className="grid grid-cols-[128px_minmax(0,1fr)] gap-x-5 md:block">
          <p className="mono-label col-span-2 mb-5 text-white/50">{t({ es: '1 · El logo de la barbería', en: '1 · The shop’s logo' })}</p>
          <div key={`${shop.id}-${custom ?? ''}`} className="relative row-span-2 aspect-square w-full md:mx-0 md:w-[min(260px,70%)]">
            <div className="animate-[ramp-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both] drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]">
              <shop.Emblem primary={primary} secondary={shop.secondary} />
            </div>
            <span className="pointer-events-none absolute inset-x-0 h-1 animate-[logo-scan_1.6s_cubic-bezier(0.65,0,0.35,1)_both] rounded-full bg-white/80 shadow-[0_0_24px_6px_rgba(255,255,255,0.6)]" aria-hidden="true" />
          </div>
          <p className="mono-label mb-3 self-end text-white/50 md:mt-8">{t({ es: '2 · Los colores que el sistema saca del logo', en: '2 · The colors the system pulls from the logo' })}</p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5 self-start md:flex md:gap-3">
            {palette.map((c, i) => (
              <li key={`${c}-${i}`} className="animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${0.9 + i * 0.12}s` }}>
                <span className={`block h-9 w-9 rounded-lg md:h-12 md:w-12 md:rounded-xl ring-1 ring-white/15 ${i === 0 ? 'ring-2 ring-white' : ''}`} style={{ background: c }} />
                <span className="mt-1.5 block font-mono text-[11px] md:text-[9px] text-white/45">{i === 0 ? t({ es: 'primario', en: 'primary' }) : c.startsWith('#') ? c.toUpperCase() : ''}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* En teléfono, la fibra baja del logo a la app */}
        <div className="-my-4 flex flex-col items-center gap-2 md:hidden" aria-hidden="true">
          <span className="h-10 w-px bg-gradient-to-b from-white/0 to-white/40" />
          <span className="h-2.5 w-2.5 rounded-full border border-white/60 transition-colors duration-700" style={{ background: primary, boxShadow: `0 0 12px 2px ${primary}99` }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{t({ es: '1 color', en: '1 color' })}</span>
          <span className="h-10 w-px bg-gradient-to-b from-white/40 to-white/0" />
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

      <div className="swipe-row relative mt-10 items-center max-md:!gap-2 max-md:!py-1 md:flex md:flex-wrap md:justify-center md:gap-2 max-md:[&>*]:!flex-none">
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
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-3.5 py-2 text-[13px] text-white/75 md:text-xs transition-colors hover:border-white/40 aria-pressed:border-white aria-pressed:text-white"
          >
            <span className="h-3 w-3 rounded-full" style={{ background: s.primary }} />
            {s.name}
          </button>
        ))}
        <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/75 md:text-xs hover:border-white/40">
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
      <p className="relative mx-auto mt-6 max-w-[46ch] text-balance text-center text-[15px] leading-relaxed text-white/60 md:text-base">{t({ es: 'Barberías de ejemplo. En el producto, el tema «Personalizado» saca los colores del logo que sube la barbería.', en: 'Sample shops. In the product, the “Custom” theme pulls colors from the logo the shop uploads.' })}</p>
    </div>
  )
}

interface LogoToAppTallProps {
  shop: Shop
  primary: string
  palette: readonly string[]
  custom: string | null
  onPick: (i: number) => void
  onCustom: (color: string) => void
}

/**
 * Del logo a la app, en el teléfono: arriba, en una sola fila, las barberías y
 * «tu color»; debajo, el logo, del que baja la fibra hasta la app; y al lado
 * del celular, en columna, los colores que el sistema saca del logo.
 */
function LogoToAppTall({ shop, primary, palette, custom, onPick, onCustom }: LogoToAppTallProps) {
  const { t } = useLocale()
  return (
    <div className="relative text-white">
      <span className="pointer-events-none absolute -left-24 top-40 h-[340px] w-[340px] rounded-full opacity-20 blur-3xl transition-[background] duration-1000" style={{ background: primary }} aria-hidden="true" />

      {/* Los selectores, en una sola fila */}
      <div className="relative flex items-center justify-center gap-3" role="group" aria-label={t({ es: 'Barberías de ejemplo', en: 'Sample shops' })}>
        {SHOPS.map((s, i) => {
          const on = s.id === shop.id && !custom
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              aria-label={s.name}
              onClick={() => onPick(i)}
              className={`grid h-11 w-11 place-items-center rounded-full outline-none ring-offset-2 ring-offset-[rgb(var(--void))] transition-[box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:ring-signal ${on ? 'scale-110 ring-2 ring-white' : 'ring-1 ring-white/20'}`}
            >
              <span className="h-7 w-7 rounded-full" style={{ background: s.primary, boxShadow: `inset 0 0 0 5px ${s.secondary}55` }} />
            </button>
          )
        })}
        <span aria-hidden="true" className="h-6 w-px bg-white/15" />
        <label className={`relative grid h-11 w-11 cursor-pointer place-items-center rounded-full ring-offset-2 ring-offset-[rgb(var(--void))] ${custom ? 'scale-110 ring-2 ring-white' : 'ring-1 ring-white/30'}`} style={{ background: custom ? custom : 'conic-gradient(#e5484d, #f0ce86, #2e9c78, #3f72d8, #8f5bd8, #e5484d)' }}>
          <input type="color" value={custom ?? shop.primary} onChange={(e) => onCustom(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label={t({ es: 'Prueba tu color', en: 'Try your color' })} />
          <span aria-hidden="true" className="text-base font-semibold text-white mix-blend-difference">+</span>
        </label>
      </div>
      <p className="mt-3 text-center text-[13px] text-white/55">
        {custom ? t({ es: 'Tu color', en: 'Your color' }) : shop.name} <span className="text-white/35">· {t({ es: 'toca otra o prueba tu color', en: 'tap another or try your color' })}</span>
      </p>

      {/* El logo, y de él baja la fibra a la app */}
      <div className="relative mt-8 flex flex-col items-center">
        <p className="mono-label mb-3 text-white/50">{t({ es: '1 · El logo', en: '1 · The logo' })}</p>
        <div key={`${shop.id}-${custom ?? ''}`} className="relative aspect-square w-[120px]">
          <div className="animate-[ramp-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">
            <shop.Emblem primary={primary} secondary={shop.secondary} />
          </div>
          <span className="pointer-events-none absolute inset-x-0 h-1 animate-[logo-scan_1.6s_cubic-bezier(0.65,0,0.35,1)_both] rounded-full bg-white/80 shadow-[0_0_24px_6px_rgba(255,255,255,0.6)]" aria-hidden="true" />
        </div>
        <span aria-hidden="true" className="mt-3 h-8 w-px bg-gradient-to-b from-white/0 to-white/45" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-white/60 transition-colors duration-700" style={{ background: primary, boxShadow: `0 0 12px 2px ${primary}99` }} />
        <span aria-hidden="true" className="h-6 w-px bg-gradient-to-b from-white/45 to-white/10" />
      </div>

      {/* La app y, al lado, los colores que salen del logo */}
      {/* Los dos juntos, centrados bajo el logo: la fibra cae entre la app y los colores */}
      <div className="relative mx-auto mt-2 flex w-fit max-w-full items-start justify-center gap-4">
        <div className="flex flex-col items-center">
          <p className="mb-3 whitespace-nowrap text-center font-mono text-[11px] uppercase tracking-[0.1em] text-white/50">{t({ es: '3 · Su app', en: '3 · Their app' })}</p>
          <PhoneBody className="w-[min(250px,calc(100vw-8.5rem))]">
            <StatusBar />
            <ShopApp shop={shop} primary={primary} />
          </PhoneBody>
        </div>
        <div className="flex w-[64px] shrink-0 flex-col items-center">
          <p className="mb-3 whitespace-nowrap text-center font-mono text-[11px] uppercase tracking-[0.1em] text-white/50">2 · {t({ es: 'Colores', en: 'Colors' })}</p>
          <ul className="relative flex flex-col items-center gap-4">
            <span aria-hidden="true" className="absolute bottom-6 top-6 left-1/2 w-px -translate-x-1/2 bg-white/12" />
            {palette.map((c, i) => (
              <li key={`${c}-${i}`} className="relative flex animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] flex-col items-center" style={{ animationDelay: `${0.6 + i * 0.12}s` }}>
                <span className={`block h-11 w-11 rounded-xl ${i === 0 ? 'ring-2 ring-white' : 'ring-1 ring-white/15'}`} style={{ background: c }} />
                <span className="mt-1 font-mono text-[11px] text-white/50">{i === 0 ? t({ es: 'primario', en: 'primary' }) : c.toUpperCase().slice(0, 7)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="relative mx-auto mt-6 max-w-[32ch] text-balance text-center text-[15px] leading-relaxed text-white/60">{t({ es: 'Barberías de ejemplo. En el producto, el tema «Personalizado» saca los colores del logo que sube la barbería.', en: 'Sample shops. In the product, the “Custom” theme pulls colors from the logo the shop uploads.' })}</p>
    </div>
  )
}
