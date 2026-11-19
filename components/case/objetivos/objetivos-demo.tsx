'use client'

import { useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { RecordModal } from '@/components/case/kit/record-modal'
import { CascadeGraph } from './cascade-graph'
import { OBJETIVOS } from './cascade-model'
import { DemoApp, type DemoRole } from './demo-app'
import { useCheckinLoop } from './use-checkin-loop'

const ROLES: readonly { id: DemoRole; name: L; does: L }[] = [
  { id: 'admin', name: { es: 'Admin de RR. HH.', en: 'HR admin' }, does: { es: 'Lee el ciclo y recuerda lo pendiente', en: 'Reads the cycle and nudges what’s pending' } },
  { id: 'lider', name: { es: 'Líder', en: 'Lead' }, does: { es: 'Aprueba o devuelve con un motivo', en: 'Approves or returns with a reason' } },
  { id: 'colaborador', name: { es: 'Colaborador', en: 'Employee' }, does: { es: 'Reporta avance con evidencia', en: 'Reports progress with evidence' } },
]

/** 08 · Demo: el ciclo completo en una app pequeña que se abre a pantalla completa, con un estado para los tres roles. */
export function ObjetivosDemo() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [open, setOpen] = useState<DemoRole | null>(null)
  // Un solo ciclo para los tres roles: lo que aprueba el líder lo ve el admin, y lo que reporta el colaborador sube a la empresa.
  const state = useCheckinLoop(OBJETIVOS, { enabled: false, every: 0 })
  // La vista previa se mueve sola; es otro ciclo, para no tocar el de la demo.
  const preview = useCheckinLoop(OBJETIVOS, { enabled: !reducedMotion && open === null, every: 2200 })
  const role = ROLES.find((r) => r.id === open)

  return (
    <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'El ciclo, de punta a punta.', en: 'The cycle, end to end.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(OBJ_CASE.demo.lead)}</p>
        </div>
      </div>

      <div data-reveal="device" className="grid overflow-hidden rounded-xl bg-[#f4f5f9] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <ul className="flex flex-col divide-y divide-[#dde0eb] bg-white">
          {ROLES.map((r, i) => (
            <li key={r.id} className="flex-1">
              <button type="button" onClick={() => setOpen(r.id)} className="group flex h-full w-full items-center justify-between gap-4 p-6 text-left text-[#161a2c] transition-colors hover:bg-[#0c5bef] hover:text-white">
                <span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50">0{i + 1} · {t({ es: 'Entrar como', en: 'Enter as' })}</span>
                  <span className="mt-1 block text-xl">{t(r.name)}</span>
                  <span className="mt-1 block text-sm opacity-60">{t(r.does)}</span>
                </span>
                <span className="text-2xl transition-transform duration-500 ease-expo group-hover:translate-x-1">⤢</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5c6180]">{t({ es: 'Vista previa · se mueve sola', en: 'Preview · moves on its own' })}</p>
          <CascadeGraph objetivos={preview.objetivos} pulse={preview.pulse} pulseKey={preview.pulseKey} reducedMotion={reducedMotion} theme="light" className="mt-2" />
        </div>
      </div>

      <dl data-reveal className="mt-8 grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-3">
        {[
          { k: { es: 'Prueba', en: 'Try' }, v: { es: 'Como líder, aprueba a Ricardo y vuelve al admin', en: 'As lead, approve Ricardo and go back to admin' } },
          { k: { es: 'Prueba', en: 'Try' }, v: { es: 'Como colaborador, reporta y mira subir la chispa', en: 'As employee, report and watch the spark climb' } },
          { k: { es: 'Atajos', en: 'Shortcuts' }, v: { es: '← → cambian de rol · Esc cierra', en: '← → switch role · Esc closes' } },
        ].map((item) => (
          <div key={item.v.es} className="bg-bg p-4 text-sm">
            <dt className="opacity-60">{t(item.k)}</dt>
            <dd className="mt-1 font-mono text-[12px]">{t(item.v)}</dd>
          </div>
        ))}
      </dl>

      <RecordModal
        ids={ROLES.map((r) => r.id)}
        openId={open}
        onOpenChange={(id) => setOpen(id as DemoRole | null)}
        title={role ? `${t({ es: 'Objetivos como', en: 'Goals as' })} ${t(role.name)}` : t(OBJ_CASE.title)}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c5bef] font-mono text-xs font-semibold text-white">Ob</span>}
        description={role ? `KPIs corporativos 2026 · ${t(role.does)}` : undefined}
        prevLabel={t({ es: 'Rol anterior', en: 'Previous role' })}
        nextLabel={t({ es: 'Rol siguiente', en: 'Next role' })}
      >
        {open && <DemoApp role={open} state={state} />}
      </RecordModal>
    </div>
  )
}
