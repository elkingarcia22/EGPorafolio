'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PanelMockup } from '@/components/case/kit/device'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { ALL_FIELDS, LiveCalendar, useCalendarClock, type CardFields, type CardStyle, type ColorBy, type Density } from './live-calendar'
import { FocusAppointment } from './platform-focus'
import { CalendarViews } from './platform-views'
import { APPTS, CLIENT, SERVICE, STAGE, cardHue, fmt, stageAt } from './calendar-model'
import { ModulesRipple } from './platform-modules'

const H3 = 'mb-4 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]'

function Section({ n, title, body, children }: { n: string; title: L; body: L; children: React.ReactNode }) {
  const { t } = useLocale()
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)] first:mt-0">
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">{n}</span>
        {t(title)}
      </h3>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">{t(body)}</p>
      {children}
    </section>
  )
}

/* ── 5.5 · La app se adapta a la barbería (interactivo) ──────────────── */

const COLOR: readonly { id: ColorBy; label: L }[] = [
  { id: 'neutral', label: { es: 'Neutral', en: 'Neutral' } },
  { id: 'servicio', label: { es: 'Servicio', en: 'Service' } },
  { id: 'estado', label: { es: 'Estado', en: 'Status' } },
  { id: 'cliente', label: { es: 'Cliente', en: 'Client' } },
]
const STYLE: readonly { id: CardStyle; label: L }[] = [
  { id: 'pastel', label: { es: 'Pastel', en: 'Pastel' } },
  { id: 'vivo', label: { es: 'Vivo', en: 'Vivid' } },
]
const DENSITY: readonly { id: Density; label: L }[] = [
  { id: 'compacta', label: { es: 'Compacta', en: 'Compact' } },
  { id: 'normal', label: { es: 'Normal', en: 'Normal' } },
  { id: 'amplia', label: { es: 'Amplia', en: 'Roomy' } },
]
const SHOWS: readonly { id: keyof CardFields; label: L }[] = [
  { id: 'type', label: { es: 'Tipo de cliente', en: 'Client type' } },
  { id: 'service', label: { es: 'Servicio y productos', en: 'Services and products' } },
  { id: 'price', label: { es: 'Precio', en: 'Price' } },
  { id: 'time', label: { es: 'Hora', en: 'Time' } },
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

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1 text-[12px] text-white/75">
      {label}
      <input type="checkbox" className="peer sr-only" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-4 w-7 shrink-0 rounded-full bg-white/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-[#2a8a5c] peer-checked:after:translate-x-3 peer-focus-visible:ring-2 peer-focus-visible:ring-[#d9b36a]" aria-hidden="true" />
    </label>
  )
}

const FEATURED = APPTS.find((a) => a.client === 'Mariana Ramírez') ?? APPTS[0]
const BIG_PAD: Record<Density, string> = { compacta: 'p-4 min-h-[150px]', normal: 'p-6 min-h-[200px]', amplia: 'p-7 min-h-[260px]' }

/** La misma cita en grande: cada ajuste se ve aplicado sobre ella. */
function BigCard({ now, colorBy, style, density, fields }: { now: number; colorBy: ColorBy; style: CardStyle; density: Density; fields: CardFields }) {
  const stage = stageAt(FEATURED, now)
  const s = STAGE[stage]
  const hue = cardHue(FEATURED, stage, colorBy)
  const bg = hue ? `${hue}${style === 'vivo' ? '66' : '24'}` : 'rgba(255,255,255,0.06)'
  const edge = hue ?? 'rgba(255,255,255,0.3)'
  return (
    <div className={`relative flex flex-col rounded-2xl text-[#efe9dd] transition-all duration-500 ease-expo ${BIG_PAD[density]}`} style={{ background: bg, boxShadow: `inset 0 0 0 1.5px ${edge}, 0 40px 90px -30px ${hue ?? '#000'}` }}>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERVICE[FEATURED.services[0]].hue }} />
        <span className="text-xl font-medium">{FEATURED.client}</span>
        {fields.hints && <span className="animate-[ramp-in_0.4s_both] text-sm text-white/60" title="Pidió a su barbero · tiene notas">☆ ✎</span>}
        {fields.type && <span className="ml-auto animate-[ramp-in_0.4s_both] rounded-full bg-black/35 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide" style={{ color: CLIENT[FEATURED.type] }}>{FEATURED.type}</span>}
      </div>
      {(fields.service || fields.price) && (
        <p className="mt-2 animate-[ramp-in_0.4s_both] text-sm text-white/65">
          {[fields.service ? FEATURED.services.map((sv) => SERVICE[sv].name).join(' + ') : null, fields.price ? `US$ ${FEATURED.price}` : null].filter(Boolean).join(' · ')}
        </p>
      )}
      {fields.time && <p className="mt-1 animate-[ramp-in_0.4s_both] font-mono text-xs text-white/45">{fmt(FEATURED.start)} – {fmt(FEATURED.start + FEATURED.len)}</p>}
      <div className="mt-auto flex items-center justify-between pt-6">
        {fields.status ? (
          <span className="inline-flex animate-[ramp-in_0.4s_both] items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-sm" style={{ color: s.hue }}>
            {stage === 'paid' ? '✓' : <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hue }} />} {s.label}
          </span>
        ) : <span />}
        {fields.next && s.next && <span className="animate-[ramp-in_0.4s_both] rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold">{s.next}</span>}
      </div>
    </div>
  )
}

function Personalize() {
  const { t } = useLocale()
  const now = useCalendarClock(1100, 0.2, 3.2, 0.6)
  const [colorBy, setColorBy] = useState<ColorBy>('estado')
  const [style, setStyle] = useState<CardStyle>('pastel')
  const [density, setDensity] = useState<Density>('normal')
  const [fields, setFields] = useState<CardFields>(ALL_FIELDS)
  const set = (k: keyof CardFields) => (v: boolean) => setFields({ ...fields, [k]: v })
  const { personalization } = PLATFORM_CASE
  return (
    <>
      <div data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-4 text-[#efe9dd] md:p-8">
        <span className="pointer-events-none absolute right-[8%] top-[30%] h-[460px] w-[460px] rounded-full bg-[#d9b36a] opacity-[0.12] blur-3xl" aria-hidden="true" />
        <div className="relative grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <LiveCalendar now={now} columns={3} colorBy={colorBy} style={style} density={density} fields={fields} highlight={FEATURED.client} />
          <div>
            <BigCard now={now} colorBy={colorBy} style={style} density={density} fields={fields} />
            <div className="mt-6 grid gap-5 rounded-2xl border border-white/10 bg-[#141210] p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Choice options={COLOR} value={colorBy} onChange={setColorBy} label={t({ es: 'Colorear tarjetas por', en: 'Color cards by' })} />
              </div>
              <div className="space-y-4">
                <Choice options={STYLE} value={style} onChange={setStyle} label={t({ es: 'Estilo', en: 'Style' })} />
                <Choice options={DENSITY} value={density} onChange={setDensity} label={t({ es: 'Densidad', en: 'Density' })} />
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Qué muestra la tarjeta', en: 'What the card shows' })}</p>
                {SHOWS.map((f) => <Toggle key={f.id} label={t(f.label)} on={fields[f.id]} onChange={set(f.id)} />)}
                <p className="mb-1 mt-3 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Avisos con icono', en: 'Icon hints' })}</p>
                <Toggle label={t({ es: 'Notas y barbero pedido', en: 'Notes and requested barber' })} on={fields.hints} onChange={set('hints')} />
              </div>
            </div>
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
    </>
  )
}

/** 05 · Forma: el calendario por dentro. */
export function PlatformForm() {
  const checkout = PLATFORM_CASE.screens.find((s) => s.id === 'checkout')
  const { dayPanel } = PLATFORM_CASE
  return (
    <div>
      <Section
        n="5.1"
        title={{ es: 'Una cita, de cerca', en: 'One visit, up close' }}
        body={{
          es: 'La cita se destaca del día y se ve su transformación mientras la hora avanza: Agendada, Tarde si pasaron 5 minutos, En espera, En silla, Por cobrar y Cobrada. Color, frase y botón cambian con ella; el resto del calendario sigue su curso detrás.',
          en: 'The visit stands out from the day and you watch it transform as time moves: Booked, Late after 5 minutes, Waiting, In chair, To charge and Paid. Color, sentence and button change with it; the rest of the calendar keeps going behind.',
        }}
      >
        <FocusAppointment />
      </Section>

      <Section
        n="5.2"
        title={{ es: 'Cuatro vistas del mismo día', en: 'Four views of the same day' }}
        body={{
          es: 'Día, semana, mes o agenda, cada una con su atajo de teclado. Son las vistas reales de la plataforma: cambian solas o tócalas.',
          en: 'Day, week, month or agenda, each with a keyboard shortcut. These are the platform’s real views: they cycle on their own, or tap them.',
        }}
      >
        <CalendarViews />
      </Section>

      <Section
        n="5.3"
        title={{ es: 'El día de un vistazo', en: 'The day at a glance' }}
        body={{
          es: 'En la semana o el mes, tocar un día abre su resumen al lado. Así está armado, de arriba abajo.',
          en: 'In week or month view, tapping a day opens its summary alongside. This is how it’s built, top to bottom.',
        }}
      >
        <PanelMockup image={dayPanel.image} callouts={dayPanel.callouts} />
      </Section>

      {checkout && (
        <Section n="5.4" title={checkout.title} body={checkout.body}>
          <PanelMockup image={checkout.image} callouts={checkout.callouts} />
        </Section>
      )}

      <Section
        n="5.5"
        title={{ es: 'La app se adapta a la barbería', en: 'The app adapts to the shop' }}
        body={{
          es: 'Es la gran promesa: que la barbería no tenga que trabajar como dice el software. Una cita destacada y todo lo que se le puede ajustar: color, estilo, densidad, qué muestra y sus avisos. Pruébalo; el calendario cambia a la vez.',
          en: 'It’s the big promise: the shop shouldn’t have to work the way the software says. One featured visit and everything you can adjust on it: color, style, density, what it shows and its hints. Try it; the calendar changes too.',
        }}
      >
        <Personalize />
      </Section>

      <Section
        n="5.6"
        title={{ es: 'Lo demás se alimenta del calendario', en: 'Everything else feeds on the calendar' }}
        body={{
          es: 'Clientes, equipo, servicios y productos son módulos secundarios: no se llenan a mano, se alimentan de lo que pasa en la rejilla. Un cobro los pone al día a todos.',
          en: 'Clients, team, services and products are secondary modules: they aren’t filled by hand, they feed on what happens on the grid. One charge brings them all up to date.',
        }}
      >
        <ModulesRipple />
      </Section>
    </div>
  )
}
