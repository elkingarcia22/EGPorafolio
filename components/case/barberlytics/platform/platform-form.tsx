'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BrowserMockup } from '@/components/case/kit/device'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { ALL_FIELDS, LiveCalendar, useCalendarClock, type CardFields, type CardStyle, type ColorBy, type Density } from './live-calendar'
import { CalendarViews, FocusAppointment } from './platform-focus'
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

function Personalize() {
  const { t } = useLocale()
  const now = useCalendarClock(900, 1.5, 8)
  const [colorBy, setColorBy] = useState<ColorBy>('estado')
  const [style, setStyle] = useState<CardStyle>('pastel')
  const [density, setDensity] = useState<Density>('normal')
  const [fields, setFields] = useState<CardFields>(ALL_FIELDS)
  const set = (k: keyof CardFields) => (v: boolean) => setFields({ ...fields, [k]: v })
  const { personalization } = PLATFORM_CASE
  return (
    <>
      <div data-reveal="device" className="grid gap-4 rounded-3xl bg-[#0f0d0b] p-4 text-white md:p-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <LiveCalendar now={now} colorBy={colorBy} style={style} density={density} fields={fields} />
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#141210] p-4">
          <p className="text-sm font-medium">{t({ es: 'Ajustes de la vista', en: 'View settings' })}</p>
          <Choice options={COLOR} value={colorBy} onChange={setColorBy} label={t({ es: 'Colorear tarjetas por', en: 'Color cards by' })} />
          <Choice options={STYLE} value={style} onChange={setStyle} label={t({ es: 'Estilo', en: 'Style' })} />
          <Choice options={DENSITY} value={density} onChange={setDensity} label={t({ es: 'Densidad', en: 'Density' })} />
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Qué muestra la tarjeta', en: 'What the card shows' })}</p>
            {SHOWS.map((f) => <Toggle key={f.id} label={t(f.label)} on={fields[f.id]} onChange={set(f.id)} />)}
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/45">{t({ es: 'Avisos con icono', en: 'Icon hints' })}</p>
            <Toggle label={t({ es: 'Notas y barbero pedido', en: 'Notes and requested barber' })} on={fields.hints} onChange={set('hints')} />
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
  const screens = PLATFORM_CASE.screens.filter((s) => s.id !== 'grid')
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
        title={{ es: 'Cuatro vistas y el día de un vistazo', en: 'Four views and the day at a glance' }}
        body={{
          es: 'Día, semana, mes o agenda —con atajo de teclado—, y al lado el detalle del día: el pulso por etapa, lo cobrado frente a lo del día y la ocupación de cada silla. En la semana, el calendario avisa qué día viene pesado y cuál suave.',
          en: 'Day, week, month or agenda —with a keyboard shortcut—, and next to it the day’s detail: the pulse by stage, collected versus today’s total and each chair’s occupancy. In week view, the calendar flags heavy and light days.',
        }}
      >
        <CalendarViews />
      </Section>

      {screens.map((screen, i) => (
        <Section key={screen.id} n={`5.${i + 3}`} title={screen.title} body={screen.body}>
          <BrowserMockup image={screen.image} callouts={screen.callouts} />
        </Section>
      ))}

      <Section
        n="5.5"
        title={{ es: 'La app se adapta a la barbería', en: 'The app adapts to the shop' }}
        body={{
          es: 'Es la gran promesa: que la barbería no tenga que trabajar como dice el software. Pruébalo: cada ajuste cambia el calendario al momento, igual que en la plataforma, donde cada persona guarda su vista.',
          en: 'It’s the big promise: the shop shouldn’t have to work the way the software says. Try it: each setting changes the calendar instantly, just like in the platform, where each person keeps their own view.',
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
