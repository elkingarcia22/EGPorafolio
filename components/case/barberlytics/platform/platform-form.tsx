'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BrowserMockup } from '@/components/case/kit/device'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useTick } from '../thema/live-pieces'
import { ALL_FIELDS, LiveCalendar, useCalendarClock, type CardFields, type ColorBy, type Density } from './live-calendar'

const H3 = 'mb-4 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]'

/* ── 5.1 · La vida de una cita ────────────────────────────────────────── */

interface Step {
  stage: L
  headline: L
  next: L | null
  done: number // pasos del stepper cumplidos (Agendada, Llegó, En silla, Cobrada)
  bg: string
  edge: string
  pill: string
}

const LIFE: readonly Step[] = [
  { stage: { es: 'Agendada', en: 'Booked' }, headline: { es: 'Llega a las 11:45', en: 'Arrives at 11:45' }, next: { es: 'Ingresar', en: 'Check in' }, done: 1, bg: '#1f2a44', edge: '#3d5180', pill: '#7d93c9' },
  { stage: { es: 'Tarde', en: 'Late' }, headline: { es: 'Va 12 min tarde', en: '12 min late' }, next: { es: 'Llamar', en: 'Call' }, done: 1, bg: '#3d1a1e', edge: '#a8383f', pill: '#ff8a8e' },
  { stage: { es: 'En espera', en: 'Waiting' }, headline: { es: 'Llegó · en la sala de espera', en: 'Arrived · in the waiting room' }, next: { es: 'Sentar', en: 'Seat' }, done: 2, bg: '#173a4a', edge: '#2e7f9c', pill: '#6cc6e6' },
  { stage: { es: 'En silla', en: 'In chair' }, headline: { es: 'En la silla con Emilio · termina en 15 min', en: 'In the chair with Emilio · ends in 15 min' }, next: { es: 'Cobrar', en: 'Charge' }, done: 3, bg: '#43351a', edge: '#b58a3a', pill: '#e9c27a' },
  { stage: { es: 'Por cobrar', en: 'To charge' }, headline: { es: 'Terminó hace 8 min · sin cobrar', en: 'Ended 8 min ago · unpaid' }, next: { es: 'Cobrar', en: 'Charge' }, done: 3, bg: '#4a3410', edge: '#d18b1f', pill: '#f2b14d' },
  { stage: { es: 'Cobrada', en: 'Paid' }, headline: { es: 'Cobrada US$ 59 · recibo enviado', en: 'Paid US$ 59 · receipt sent' }, next: null, done: 4, bg: '#123526', edge: '#2a8a5c', pill: '#5fd39a' },
]

const STEPPER: readonly L[] = [
  { es: 'Agendada', en: 'Booked' },
  { es: 'Llegó', en: 'Arrived' },
  { es: 'En silla', en: 'In chair' },
  { es: 'Cobrada', en: 'Paid' },
]

function Lifecycle() {
  const { t } = useLocale()
  const tick = useTick(2000)
  const i = tick % LIFE.length
  const s = LIFE[i]
  return (
    <section>
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">5.1</span>
        {t({ es: 'La vida de una cita, en la tarjeta', en: 'A visit’s life, on the card' })}
      </h3>
      <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'Seis etapas en vivo que el calendario deduce solo: si pasaron 5 minutos y no llegó, está «Tarde»; si terminó y no se cobró, «Por cobrar». El color, el texto y el botón cambian con ella, y el panel pone primero lo que toca: «Llamar» si va tarde, «Cobrar» si está en la silla.',
          en: 'Six live stages the calendar works out on its own: 5 minutes past and not here means “Late”; ended and unpaid means “To charge”. The color, the text and the button change with it, and the panel puts first what matters: “Call” if late, “Charge” if in the chair.',
        })}
      </p>
      <div data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-6 text-[#efe9dd] md:p-10">
        <span className="pointer-events-none absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl transition-[background] duration-1000" style={{ background: s.edge }} aria-hidden="true" />
        <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            {/* El stepper del panel */}
            <ol className="mb-8 grid grid-cols-4 gap-2">
              {STEPPER.map((st, k) => (
                <li key={st.es} className="text-center">
                  <span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors duration-500 ${k < s.done ? 'bg-[#d9b36a] text-[#16130f]' : 'border border-white/20 text-white/40'}`}>{k < s.done ? '✓' : k + 1}</span>
                  <span className={`mt-2 block text-[11px] ${k < s.done ? 'text-white/85' : 'text-white/35'}`}>{t(st)}</span>
                </li>
              ))}
            </ol>
            {/* La tarjeta en la rejilla */}
            <div className="relative mx-auto max-w-[360px] rounded-xl p-4 transition-[background-color,box-shadow] duration-700" style={{ background: s.bg, boxShadow: `inset 0 0 0 1.5px ${s.edge}, 0 30px 60px -30px ${s.edge}` }}>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5b8def]" />
                <span className="font-medium">Mariana Ramírez</span>
                <span className="ml-auto rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#5b8def]">RETENIDO</span>
              </div>
              <p className="mt-2 text-sm text-white/55">Corte clásico + Arreglo de barba · US$ 59</p>
              <div className="mt-6 flex items-center justify-between">
                <span key={`p-${i}`} className="inline-flex animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-xs" style={{ color: s.pill }}>
                  {s.next ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.pill }} /> : '✓'} {t(s.stage)}
                </span>
                {s.next && (
                  <span key={`b-${i}`} className="relative animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium">
                    {t(s.next)}
                    <span className="pointer-events-none absolute -bottom-3 -right-3 h-6 w-6 animate-[tap-ping_2s_ease-out_infinite] rounded-full border-2 border-white/70" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
            <p key={`h-${i}`} className="mt-6 animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both] text-center font-light text-[clamp(1.3rem,1rem+1vw,1.9rem)]">{t(s.headline)}</p>
          </div>

          <ul className="space-y-2">
            {LIFE.map((st, k) => (
              <li key={st.stage.es} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${k === i ? 'translate-x-1 border-white/25 bg-white/[0.06]' : 'border-transparent opacity-55'}`}>
                <span className="h-3 w-3 rounded-full" style={{ background: st.pill }} />
                <span className="flex-1 text-sm">{t(st.stage)}</span>
                <span className="mono-label text-white/50">{st.next ? `→ ${t(st.next)}` : '✓'}</span>
              </li>
            ))}
            <li className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-white/55">
              <span className="h-3 w-3 rounded-full bg-white/25" />
              <span className="flex-1">{t({ es: 'No se presentó · Cancelada', en: 'No-show · Canceled' })}</span>
              <span className="mono-label">→ {t({ es: 'Reagendar', en: 'Rebook' })}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ── 5.2–5.4 · Pantallas reales ──────────────────────────────────────── */

function Screens() {
  const { t } = useLocale()
  return (
    <>
      {PLATFORM_CASE.screens.map((screen, i) => (
        <section key={screen.id} className="mt-[clamp(4rem,3rem+4vw,7rem)]">
          <h3 data-reveal="mask" className={H3}>
            <span className="mono-label text-signal">5.{i + 2}</span>
            {t(screen.title)}
          </h3>
          <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">{t(screen.body)}</p>
          <BrowserMockup image={screen.image} callouts={screen.callouts} />
        </section>
      ))}
    </>
  )
}

/* ── 5.5 · Se adapta a la barbería (interactivo) ─────────────────────── */

const COLOR: readonly { id: ColorBy; label: L }[] = [
  { id: 'neutral', label: { es: 'Neutral', en: 'Neutral' } },
  { id: 'servicio', label: { es: 'Servicio', en: 'Service' } },
  { id: 'estado', label: { es: 'Estado', en: 'Status' } },
  { id: 'cliente', label: { es: 'Cliente', en: 'Client' } },
]
const DENSITY: readonly { id: Density; label: L }[] = [
  { id: 'compacta', label: { es: 'Compacta', en: 'Compact' } },
  { id: 'normal', label: { es: 'Normal', en: 'Normal' } },
  { id: 'amplia', label: { es: 'Amplia', en: 'Roomy' } },
]
const FIELDS: readonly { id: keyof CardFields; label: L }[] = [
  { id: 'type', label: { es: 'Tipo de cliente', en: 'Client type' } },
  { id: 'service', label: { es: 'Servicio', en: 'Service' } },
  { id: 'price', label: { es: 'Precio', en: 'Price' } },
  { id: 'status', label: { es: 'Estado de la cita', en: 'Status' } },
  { id: 'next', label: { es: 'Botón del siguiente paso', en: 'Next-step button' } },
]

function Choice<T extends string>({ options, value, onChange, label }: { options: readonly { id: T; label: L }[]; value: T; onChange: (v: T) => void; label: string }) {
  const { t } = useLocale()
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-white/45">{label}</p>
      <div className="flex rounded-lg bg-white/[0.05] p-0.5">
        {options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={o.id === value} onClick={() => onChange(o.id)} className="flex-1 rounded-md px-2 py-1.5 text-[11px] text-white/65 transition-colors hover:text-white aria-checked:bg-[#d9b36a] aria-checked:text-[#16130f]">
            {t(o.label)}
          </button>
        ))}
      </div>
    </div>
  )
}

function Personalize() {
  const { t } = useLocale()
  const now = useCalendarClock(900, 1.5, 8)
  const [colorBy, setColorBy] = useState<ColorBy>('estado')
  const [density, setDensity] = useState<Density>('normal')
  const [fields, setFields] = useState<CardFields>(ALL_FIELDS)
  const { personalization } = PLATFORM_CASE
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">5.5</span>
        {t({ es: 'La app se adapta a la barbería', en: 'The app adapts to the shop' })}
      </h3>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'Es la gran promesa: que la barbería no tenga que trabajar como dice el software. Pruébalo: cambia cómo se colorean las tarjetas, la densidad y qué muestra cada una. En la plataforma, cada persona guarda su vista.',
          en: 'It’s the big promise: the shop shouldn’t have to work the way the software says. Try it: change how cards are colored, the density and what each one shows. In the platform, each person keeps their own view.',
        })}
      </p>
      <div data-reveal="device" className="grid gap-4 rounded-3xl bg-[#0f0d0b] p-4 text-white md:p-6 lg:grid-cols-[minmax(0,1fr)_250px]">
        <LiveCalendar now={now} colorBy={colorBy} density={density} fields={fields} />
        <div className="space-y-5 rounded-2xl border border-white/10 bg-[#141210] p-4">
          <p className="text-sm font-medium">{t({ es: 'Ajustes de la vista', en: 'View settings' })}</p>
          <Choice options={COLOR} value={colorBy} onChange={setColorBy} label={t({ es: 'Colorear tarjetas por', en: 'Color cards by' })} />
          <Choice options={DENSITY} value={density} onChange={setDensity} label={t({ es: 'Densidad', en: 'Density' })} />
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Qué muestra la tarjeta', en: 'What the card shows' })}</p>
            <ul className="space-y-1.5">
              {FIELDS.map((f) => (
                <li key={f.id}>
                  <label className="flex cursor-pointer items-center justify-between gap-3 text-[12px] text-white/75">
                    {t(f.label)}
                    <input type="checkbox" className="peer sr-only" checked={fields[f.id]} onChange={(e) => setFields({ ...fields, [f.id]: e.target.checked })} />
                    <span className="relative h-4 w-7 shrink-0 rounded-full bg-white/15 transition-colors peer-checked:bg-[#2a8a5c] peer-focus-visible:ring-2 peer-focus-visible:ring-[#d9b36a] after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3" aria-hidden="true" />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {[
          { title: { es: 'Cada persona, su vista', en: 'Each person, their view' }, items: personalization.person },
          { title: { es: 'Cada barbería, sus reglas', en: 'Each shop, its rules' }, items: personalization.business },
        ].map((col) => (
          <div key={col.title.es} data-reveal>
            <p className="mono-label mb-4 text-signal">{t(col.title)}</p>
            <ul className="space-y-2.5 text-sm">
              {col.items.map((it) => (
                <li key={it.es} className="flex gap-3 border-b border-fg/10 pb-2.5"><span className="text-signal" aria-hidden="true">+</span>{t(it)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <figure className="mt-10">
        <BrowserMockup image={personalization.options} withLegend={false} />
        <figcaption data-reveal className="mt-3 text-sm opacity-65">{t({ es: 'Los ajustes de verdad, en la plataforma: color, estilo, qué muestra la tarjeta y avisos con icono.', en: 'The real settings, in the platform: color, style, what the card shows and icon hints.' })}</figcaption>
      </figure>
    </section>
  )
}

/* ── 5.6 · Lo demás, conectado ───────────────────────────────────────── */

function Modules() {
  const { t } = useLocale()
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">5.6</span>
        {t({ es: 'Lo demás se alimenta del calendario', en: 'Everything else feeds on the calendar' })}
      </h3>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'Cobrar una cita actualiza al cliente, la nómina del barbero y las métricas del día. Son módulos secundarios, con la misma gramática: una frase, tres o cuatro cifras con su porqué y la tabla.',
          en: 'Charging a visit updates the client, the barber’s payroll and the day’s metrics. They’re secondary modules with the same grammar: a sentence, three or four figures with their why, and the table.',
        })}
      </p>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PLATFORM_CASE.modules.map((m) => (
          <li key={m.id} data-reveal className="group">
            <div className="overflow-hidden rounded-lg ring-1 ring-fg/15 transition-transform duration-500 ease-expo group-hover:-translate-y-1">
              <Image src={m.image.src} width={m.image.width} height={m.image.height} alt={t(m.image.alt)} sizes="(min-width: 1024px) 18vw, 45vw" className="block h-auto w-full" />
            </div>
            <p className="mt-2 text-sm">{t(m.name)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 05 · Forma: el calendario por dentro. */
export function PlatformForm() {
  return (
    <div>
      <Lifecycle />
      <Screens />
      <Personalize />
      <Modules />
    </div>
  )
}
