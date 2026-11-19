'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE, type RoleId } from '@/lib/content/cases/barberlytics/platform-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'
import { CaseDemo } from '@/components/case/kit/case-demo'

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

/** El calendario real en el modal de registro: las flechas pasan de un rol a otro. */
function CalendarModal({ openId, onOpenChange }: { openId: RoleId | null; onOpenChange: (id: RoleId | null) => void }) {
  const { t } = useLocale()
  const role = DEMO_ROLES.find((r) => r.id === openId)
  return (
    <RecordModal
      ids={DEMO_ROLES.map((r) => r.id)}
      openId={openId}
      onOpenChange={(id) => onOpenChange(id as RoleId | null)}
      title={role ? `${t({ es: 'Calendario como', en: 'Calendar as' })} ${t(role.name)}` : t({ es: 'Calendario', en: 'Calendar' })}
      titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d9b36a] font-mono text-xs font-semibold text-[#16130f]">Bl</span>}
      description={role && `barberlytics.vercel.app${role.ir}`}
      actions={role && <NewTabLink href={demoUrl(role)} />}
      prevLabel={t({ es: 'Rol anterior', en: 'Previous role' })}
      nextLabel={t({ es: 'Rol siguiente', en: 'Next role' })}
    >
      {role && <iframe key={role.id} src={demoUrl(role)} title={t({ es: 'Calendario de Barberlytics, en vivo', en: 'Barberlytics calendar, live' })} className="w-full flex-1 bg-[#121009]" />}
    </RecordModal>
  )
}

/** 08 · Demo: el calendario real, en una vista previa que se abre a pantalla completa. */
export function PlatformDemo() {
  const { demo } = PLATFORM_CASE
  const [open, setOpen] = useState<RoleId | null>(null)

  return (
    <>
      <CaseDemo
        title={{ es: 'El calendario, en vivo, por rol.', en: 'The calendar, live, by role.' }}
        lead={demo.lead}
        url="barberlytics.vercel.app/calendario"
        image={{ src: '/cases/barberlytics/cal-states.webp', width: 2000, height: 1250 }}
        accent={'217 179 106'}
        tryIt={demo.tryIt}
        onOpen={() => setOpen(DEMO_ROLES[0].id)}
      />
      <CalendarModal openId={open} onOpenChange={setOpen} />
    </>
  )
}
