'use client'

import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BrowserMockup } from '@/components/case/kit/device'
import { PLATFORM_CASE, type RoleView } from '@/lib/content/cases/barberlytics/platform-case'
import { useTick } from '../thema/live-pieces'

const H3 = 'mb-4 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]'

/* ── 5.1 · Ver como: la misma plataforma, cuatro puertas ──────────────── */

function RoleSwitcher() {
  const { t } = useLocale()
  const [role, setRole] = useState<RoleView>(PLATFORM_CASE.roles[0])
  return (
    <section>
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">5.1</span>
        {t({ es: 'Ver como: la misma plataforma, cuatro puertas', en: 'View as: one platform, four doors' })}
      </h3>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'Son capturas de la plataforma real, entrando con la cuenta de prueba de cada rol. Cambia de persona y mira qué aparece, qué desaparece y dónde cae cada una al entrar.',
          en: 'These are captures of the real platform, signed in with each role’s test account. Switch person and see what appears, what disappears and where each one lands.',
        })}
      </p>

      <div data-reveal role="radiogroup" aria-label={t({ es: 'Rol', en: 'Role' })} className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_CASE.roles.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={r.id === role.id}
            onClick={() => setRole(r)}
            className="group border border-fg/20 p-4 text-left transition-colors hover:border-fg/50 aria-checked:border-signal aria-checked:bg-signal/[0.07]"
          >
            <span className="block font-medium">{t(r.name)}</span>
            <span className="mt-1 block text-xs opacity-60">{r.person}</span>
            <span className="mt-3 block text-xs leading-snug opacity-75">{t(r.scope)}</span>
            <span className="mono-label mt-3 block text-signal">→ {t(r.lands)}</span>
          </button>
        ))}
      </div>

      <div key={role.id} className="animate-[ramp-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
        <BrowserMockup image={role.image} callouts={role.callouts} />
      </div>
    </section>
  )
}

/* ── 5.2 · Una cita cobrada llega sola a todo lo demás ───────────────── */

const FLOW: readonly { name: L; what: L }[] = [
  { name: { es: 'Nómina', en: 'Payroll' }, what: { es: '+ comisión de Andrés y su propina', en: '+ Andrés’s commission and tip' } },
  { name: { es: 'Cliente', en: 'Client' }, what: { es: 'Marcela pasa de «en riesgo» a «retenida»', en: 'Marcela moves from “at risk” to “retained”' } },
  { name: { es: 'Caja', en: 'Till' }, what: { es: 'Cobrado · tarjeta · US$ 45', en: 'Collected · card · US$ 45' } },
  { name: { es: 'Métricas', en: 'Metrics' }, what: { es: 'Ventas y ticket del día, al momento', en: 'The day’s sales and ticket, instantly' } },
]

function PaidFlow() {
  const { t } = useLocale()
  const tick = useTick(1100)
  const lit = tick % (FLOW.length + 2)
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">5.2</span>
        {t({ es: 'El cable: una cita cobrada llega sola a todo lo demás', en: 'The wiring: one paid visit reaches everything else' })}
      </h3>
      <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'El hallazgo central era de conexiones, así que la forma también lo es. Nadie vuelve a escribir lo que ya pasó: cobrar una cita actualiza la nómina, el cliente, la caja y las métricas a la vez.',
          en: 'The core finding was about wiring, so the form is too. Nobody re-enters what already happened: charging a visit updates payroll, the client, the till and the metrics at once.',
        })}
      </p>
      <div data-reveal="device" className="relative overflow-hidden rounded-3xl bg-[#0f0d0b] p-6 text-white md:p-10">
        <span className="pointer-events-none absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#d9b36a] opacity-20 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.3fr)]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="mono-label text-white/50">{t({ es: 'Calendario · 5:00 p. m.', en: 'Calendar · 5:00 p.m.' })}</p>
            <p className="mt-3 text-lg">Marcela Rojas</p>
            <p className="text-sm text-white/60">{t({ es: 'Fade · con Andrés · 45 min', en: 'Fade · with Andrés · 45 min' })}</p>
            <span className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-500 ${lit > 0 ? 'bg-[#17B16D] text-white' : 'bg-[#d9b36a] text-[#16130f]'}`}>
              {lit > 0 ? t({ es: '✓ Cobrada', en: '✓ Paid' }) : t({ es: 'Cobrar US$ 45', en: 'Charge US$ 45' })}
            </span>
          </div>
          <span className="hidden text-3xl text-white/40 md:block" aria-hidden="true">→</span>
          <ul className="grid gap-3 sm:grid-cols-2">
            {FLOW.map((f, i) => {
              const on = lit > i
              return (
                <li key={f.name.es} className={`rounded-2xl border p-4 transition-all duration-500 ${on ? 'border-[#d9b36a]/70 bg-[#d9b36a]/[0.1] shadow-[0_0_40px_-12px_rgba(217,179,106,0.7)]' : 'border-white/10 bg-white/[0.02] opacity-50'}`}>
                  <p className="mono-label text-[#d9b36a]">{t(f.name)}</p>
                  <p className="mt-2 text-sm leading-snug">{t(f.what)}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ── 5.3 · Los módulos, en la plataforma real ────────────────────────── */

function ModulesGallery() {
  const { t } = useLocale()
  const [first, ...rest] = PLATFORM_CASE.modules
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)]">
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">5.3</span>
        {t({ es: 'Los módulos, con la misma gramática', en: 'The modules, sharing one grammar' })}
      </h3>
      <p data-reveal className="mb-10 max-w-[62ch] leading-relaxed opacity-80">
        {t({
          es: 'Todos abren igual: una frase que dice para qué sirve, tres o cuatro cifras con su porqué, un aviso de lo que necesita una mano y la tabla. Aprender uno es aprenderlos todos.',
          en: 'They all open the same way: a sentence saying what it’s for, three or four figures with their why, a note on what needs a hand, and the table. Learn one and you’ve learned them all.',
        })}
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <figure className="md:col-span-2">
          <BrowserMockup image={first.image} withLegend={false} />
          <figcaption data-reveal className="mt-3 flex gap-3 text-sm"><span className="font-medium">{t(first.name)}</span><span className="opacity-65">{t(first.note)}</span></figcaption>
        </figure>
        {rest.map((m) => (
          <figure key={m.id} className="group [perspective:1600px]">
            <div className="transition-transform duration-700 ease-expo group-hover:[transform:translateY(-6px)]">
              <BrowserMockup image={m.image} withLegend={false} sizes="(min-width: 768px) 32vw, 100vw" />
            </div>
            <figcaption data-reveal className="mt-3 text-sm"><span className="block font-medium">{t(m.name)}</span><span className="opacity-65">{t(m.note)}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** 05 · Forma de la plataforma. */
export function PlatformForm() {
  return (
    <div>
      <RoleSwitcher />
      <PaidFlow />
      <ModulesGallery />
    </div>
  )
}
