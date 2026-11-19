'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getLenis } from '@/lib/motion'
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
type DemoRole = (typeof DEMO_ROLES)[number]

const demoUrl = (role: DemoRole) => `${PLATFORM_CASE.demo.base}?rol=${role.id}&ir=${encodeURIComponent(role.ir)}`

/** El calendario real a pantalla completa, con pestañas para entrar como cada rol. */
function FullscreenCalendar({ initial, onClose }: { initial: DemoRole; onClose: () => void }) {
  const { t } = useLocale()
  const [role, setRole] = useState(initial)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = prev
      lenis?.start()
    }
  }, [onClose])

  return (
    <div role="dialog" aria-modal="true" aria-label={t({ es: 'Calendario de Barberlytics', en: 'Barberlytics calendar' })} className="fixed inset-0 z-[100] flex flex-col bg-[#0b0c0e]">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-2.5 text-paper">
        <span className="font-mono text-[11px] text-white/50">Barberlytics · {t({ es: 'calendario', en: 'calendar' })}</span>
        <div role="tablist" aria-label={t({ es: 'Entrar como', en: 'Enter as' })} className="flex flex-wrap gap-1">
          {DEMO_ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={role.id === r.id}
              onClick={() => setRole(r)}
              className="rounded-md px-3 py-1.5 font-mono text-[11px] text-white/60 transition-colors hover:bg-white/10 hover:text-white aria-selected:bg-white/15 aria-selected:text-white"
            >
              {t(r.name)}
            </button>
          ))}
        </div>
        <a href={demoUrl(role)} target="_blank" rel="noopener noreferrer" className="ml-auto font-mono text-[11px] text-white/60 hover:text-white">
          {t({ es: 'Nueva pestaña', en: 'New tab' })} ↗
        </a>
        <button ref={closeRef} type="button" onClick={onClose} className="rounded-md border border-white/20 px-3 py-1.5 font-mono text-[11px] text-white transition-colors hover:bg-white hover:text-black">
          {t({ es: 'Cerrar', en: 'Close' })} · Esc
        </button>
      </div>
      <iframe key={role.id} src={demoUrl(role)} title={t({ es: 'Calendario de Barberlytics, en vivo', en: 'Barberlytics calendar, live' })} className="w-full flex-1 bg-[#121009]" />
    </div>
  )
}

/** 08 · Demo: el calendario real, en una vista previa que se abre a pantalla completa. */
export function PlatformDemo() {
  const { t } = useLocale()
  const { demo } = PLATFORM_CASE
  const [open, setOpen] = useState<DemoRole | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'El calendario, en vivo.', en: 'The calendar, live.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(demo.lead)}</p>
        </div>
        <ul data-reveal className="flex flex-wrap gap-2 lg:col-span-5 lg:justify-end">
          {DEMO_ROLES.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => setOpen(r)} className="mono-label border border-fg/25 px-3 py-2 transition-colors hover:border-signal hover:bg-signal hover:text-paper">
                {t({ es: 'Como', en: 'As' })} {t(r.name)} ↗
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={() => setOpen(DEMO_ROLES[0])} data-reveal="device" className="group relative block w-full [perspective:1800px]">
        <span className="block overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-700 ease-expo [transform:rotateX(8deg)] group-hover:[transform:none]">
          <span className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex h-5 flex-1 items-center rounded-md bg-white/[0.06] px-2 font-mono text-[10px] text-white/45">barberlytics.vercel.app/calendario</span>
          </span>
          <Image src="/cases/barberlytics/cal-states.webp" width={2000} height={1250} alt="" sizes="(min-width: 1024px) 70vw, 100vw" className="block h-auto w-full transition-[filter] duration-500 group-hover:brightness-75" />
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-3 bg-void/85 px-6 py-4 text-paper backdrop-blur transition-colors group-hover:bg-signal">
            <span className="mono-label">⤢ {t({ es: 'Abrir el calendario a pantalla completa', en: 'Open the calendar full screen' })}</span>
          </span>
        </span>
      </button>

      <dl data-reveal className="mt-8 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-3">
        {demo.tryIt.map((item) => (
          <div key={item.label.es} className="bg-bg p-4 text-sm">
            <dt className="opacity-60">{t(item.label)}</dt>
            <dd className="mt-1 font-mono">{t(item.value)}</dd>
          </div>
        ))}
      </dl>

      {open && <FullscreenCalendar initial={open} onClose={close} />}
    </div>
  )
}
