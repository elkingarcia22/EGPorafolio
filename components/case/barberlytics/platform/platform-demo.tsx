'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM_CASE, type RoleId } from '@/lib/content/cases/barberlytics/platform-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'

interface DemoRole {
  id: RoleId
  ir: string
  name: L
}

const DEMO_ROLES: readonly DemoRole[] = [
  { id: 'recepcion', ir: '/calendario', name: { es: 'Recepción', en: 'Front desk' } },
  { id: 'dueno', ir: '/calendario', name: { es: 'Dueño', en: 'Owner' } },
  { id: 'comision', ir: '/calendario', name: { es: 'Barbero', en: 'Barber' } },
]

const demoUrl = (role: DemoRole) => `${PLATFORM_CASE.demo.base}?rol=${role.id}&ir=${encodeURIComponent(role.ir)}`

/** El calendario real (con datos de prueba) en el modal de registro: las flechas pasan de un rol a otro. */
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

/**
 * 08 · Demo: el nodo que recibe la fibra de «Impacto» abre el calendario real,
 * con datos simulados, entrando como cada rol. Lo que se mueve vive solo en la pestaña.
 */
export function PlatformDemo() {
  const { t } = useLocale()
  const { demo } = PLATFORM_CASE
  const [open, setOpen] = useState<RoleId | null>(null)

  return (
    <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
      {/* El nodo: late, como una señal que espera que alguien entre */}
      <span aria-hidden="true" className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(217,179,106,0.35),transparent_70%)]" />
        <span className="absolute inset-2 rounded-full border border-[#d9b36a]/60 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />
        <span className="relative h-4 w-4 rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_5px_rgba(217,179,106,0.25),0_0_24px_6px_rgba(217,179,106,0.7)]" />
      </span>

      <h3 className="mt-8 text-balance text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Pruébalo en vivo, por rol.', en: 'Try it live, by role.' })}
      </h3>
      <p className="mt-4 max-w-[54ch] text-balance text-base leading-relaxed text-paper/65 md:text-lg">
        {t({ es: 'El calendario real, con datos de prueba. Cambia lo que ves según el rol; lo que muevas vive solo en tu pestaña.', en: 'The real calendar, with test data. What you see changes with the role; anything you move lives only in your tab.' })}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {DEMO_ROLES.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setOpen(r.id)}
            className={
              i === 0
                ? 'inline-flex items-center gap-2 rounded-full bg-[#d9b36a] px-5 py-2.5 text-sm font-medium text-[#16130f] shadow-[0_0_30px_-6px_rgba(217,179,106,0.8)] transition-transform duration-300 ease-expo hover:-translate-y-0.5'
                : 'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-sm text-paper/85 transition-colors duration-300 hover:border-white/40 hover:text-paper'
            }
          >
            {t({ es: 'Entrar como', en: 'Enter as' })} {t(r.name)}
          </button>
        ))}
      </div>

      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-paper/45">
        {demo.tryIt.map((tip) => (
          <li key={tip.label.es}>
            {t(tip.label)} <span className="text-[#d9b36a]">→</span> {t(tip.value)}
          </li>
        ))}
      </ul>

      <CalendarModal openId={open} onOpenChange={setOpen} />
    </div>
  )
}
