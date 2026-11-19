'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE, type RoleId } from '@/lib/content/cases/barberlytics/platform-case'

/** 07 · Impacto: lo que cambió en las barberías y lo que hay detrás. */
export function PlatformImpact() {
  const { t } = useLocale()
  const { impact } = PLATFORM_CASE
  const { booking } = impact
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(impact.lead)}</p>

      <dl className="mt-12 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-4">
        {impact.metrics.map((m) => (
          <div key={m.label.es} data-reveal className="bg-bg p-6">
            <dt className="sr-only">{t(m.label)}</dt>
            <dd>
              <span className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{m.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(m.label)}</span>
            </dd>
          </div>
        ))}
      </dl>

      <figure data-reveal className="mt-10 border border-fg/15 p-6">
        <figcaption className="mono-label mb-6 opacity-70">{t(booking.title)}</figcaption>
        {[
          { label: t({ es: 'Antes', en: 'Before' }), value: booking.before, strong: false },
          { label: t({ es: 'Con el calendario', en: 'With the calendar' }), value: booking.after, strong: true },
        ].map((row) => (
          <div key={row.label} className="mb-4 grid grid-cols-[8.5rem_1fr_auto] items-center gap-4 last:mb-0">
            <span className="text-sm opacity-70">{row.label}</span>
            <span className="h-4 overflow-hidden rounded-full bg-fg/[0.06]">
              <span data-reveal="right" className={`block h-full rounded-full ${row.strong ? 'bg-signal' : 'bg-fg/30'}`} style={{ width: `${(row.value / booking.before) * 100}%` }} />
            </span>
            <span data-count={String(row.value)} className="w-10 text-right font-mono tabular-nums">{row.value} s</span>
          </div>
        ))}
        <p className="mt-5 text-sm opacity-60">{t({ es: 'Sin hora todavía: primero quién y qué, y la hora se toca en la rejilla, con los clientes de siempre arriba.', en: 'No time yet: first who and what, then the time is tapped on the grid, with regulars on top.' })}</p>
      </figure>

      <p data-reveal className="mono-label mb-6 mt-16 opacity-60">{t({ es: 'Lo que hay detrás', en: 'What’s behind it' })}</p>
      <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {impact.build.map((s) => (
          <div key={s.label.es} data-reveal>
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span data-count={s.value} className="block text-[clamp(2rem,1.4rem+2vw,3.2rem)] font-light leading-none tabular-nums">{s.value}</span>
              <span className="mt-2 block text-sm opacity-70">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const DEMO_ROLES: readonly { id: RoleId; ir: string; name: { es: string; en: string } }[] = [
  { id: 'recepcion', ir: '/calendario', name: { es: 'Recepción', en: 'Front desk' } },
  { id: 'dueno', ir: '/calendario', name: { es: 'Dueño', en: 'Owner' } },
  { id: 'comision', ir: '/calendario', name: { es: 'Barbero', en: 'Barber' } },
]

/**
 * 08 · Demo: la plataforma real en un navegador, entrando como cada rol.
 * El iframe solo se carga al pedirlo, así no pesa al abrir el caso.
 */
export function PlatformDemo() {
  const { t } = useLocale()
  const { demo } = PLATFORM_CASE
  const [role, setRole] = useState(DEMO_ROLES[0])
  const [started, setStarted] = useState(false)
  const url = `${demo.base}?rol=${role.id}&ir=${encodeURIComponent(role.ir)}`

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'El calendario, en vivo.', en: 'The calendar, live.' })}</p>
          <p data-reveal className="mt-5 leading-relaxed opacity-80">{t(demo.lead)}</p>
        </div>
        <dl data-reveal className="divide-y divide-fg/15 self-end border-y border-fg/15 lg:col-span-6 lg:col-start-7">
          {demo.tryIt.map((item) => (
            <div key={item.label.es} className="flex items-baseline justify-between gap-4 py-3 text-sm">
              <dt className="opacity-60">{t(item.label)}</dt>
              <dd className="text-right font-mono">{t(item.value)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div data-reveal role="radiogroup" aria-label={t({ es: 'Entrar como', en: 'Enter as' })} className="mt-10 flex flex-wrap gap-2">
        {DEMO_ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={role.id === r.id}
            onClick={() => {
              setRole(r)
              setStarted(true)
            }}
            className="mono-label border border-fg/25 px-4 py-2.5 transition-colors hover:border-fg/60 aria-checked:border-signal aria-checked:bg-signal aria-checked:text-paper"
          >
            {t(r.name)}
          </button>
        ))}
        <a href={url} target="_blank" rel="noopener noreferrer" className="mono-label ml-auto self-center opacity-70 underline-offset-4 hover:underline hover:opacity-100">
          {t({ es: 'Abrir en otra pestaña', en: 'Open in a new tab' })} ↗
        </a>
      </div>

      <div data-reveal="device" className="mt-6 overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_40px_90px_-35px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex h-5 flex-1 items-center rounded-md bg-white/[0.06] px-3 font-mono text-[10px] text-white/45">barberlytics.vercel.app{role.ir}</span>
        </div>
        <div className="relative aspect-[16/10] max-h-[82vh] w-full">
          {started ? (
            <iframe key={role.id} src={url} title={t({ es: 'Calendario de Barberlytics, en vivo', en: 'Barberlytics calendar, live' })} className="absolute inset-0 h-full w-full bg-[#121009]" />
          ) : (
            <button type="button" onClick={() => setStarted(true)} className="group absolute inset-0 flex items-end justify-center bg-[url('/cases/barberlytics/cal-states.webp')] bg-cover bg-top pb-16">
              <span className="bg-void/85 px-6 py-3.5 text-paper backdrop-blur transition-colors group-hover:bg-signal">
                <span className="mono-label">▶ {t({ es: 'Abrir el calendario', en: 'Open the calendar' })} · {t(role.name)}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
