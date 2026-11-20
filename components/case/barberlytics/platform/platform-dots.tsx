'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { useTick } from '../thema/live-pieces'
import { LiveCalendar, useCalendarClock } from './live-calendar'
import { APPTS, BARBERS, stageAt } from './calendar-model'

const GOLD = '#d9b36a'

function useStep(ms: number, steps: number): number {
  const { reducedMotion } = useA11y()
  const tick = useTick(ms)
  return reducedMotion ? steps - 1 : tick % steps
}

const ROLES: readonly { who: L; does: L }[] = [
  { who: { es: 'Recepción', en: 'Front desk' }, does: { es: 'agenda y cobra', en: 'books and charges' } },
  { who: { es: 'Barbero', en: 'Barber' }, does: { es: 'mira su día', en: 'checks their day' } },
  { who: { es: 'Dueño', en: 'Owner' }, does: { es: 'busca los huecos', en: 'hunts for gaps' } },
]

/** Todo pasa por la rejilla: quién la usa a la izquierda, lo que se alimenta de ella a la derecha. */
function GridHub() {
  const { t } = useLocale()
  const now = useCalendarClock(700, 1, 8.5, 2.4)
  const visible = APPTS.filter((a) => a.col < 3)
  const paid = visible.filter((a) => stageAt(a, now) === 'paid')
  const till = paid.reduce((sum, a) => sum + a.price, 0)
  const feeds: readonly { name: L; value: string }[] = [
    { name: { es: 'Caja', en: 'Till' }, value: `US$ ${till}` },
    { name: { es: 'Clientes', en: 'Clients' }, value: `${paid.length} ${t({ es: 'atendidos', en: 'served' })}` },
    { name: { es: 'Nómina', en: 'Payroll' }, value: `${paid.length} ${t({ es: 'servicios', en: 'services' })}` },
  ]
  return (
    <div data-reveal="device" className="relative mt-14 grid items-center gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)_minmax(0,0.8fr)]">
      <ul className="flex gap-2 lg:flex-col lg:gap-3">
        {ROLES.map((r) => (
          <li key={r.who.es} className="flex-1 border border-fg/15 px-4 py-3">
            <p className="text-base">{t(r.who)}</p>
            <p className="text-[12px] opacity-55">{t(r.does)}</p>
          </li>
        ))}
      </ul>
      <div className="relative">
        <span className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgba(217,179,106,0.18),transparent)]" aria-hidden="true" />
        <LiveCalendar now={now} columns={3} density="compacta" className="relative shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]" />
      </div>
      <ul className="flex gap-2 lg:flex-col lg:gap-3">
        {feeds.map((f) => (
          <li key={f.name.es} className="flex-1 border border-fg/15 px-4 py-3">
            <p className="mono-label opacity-55">{t(f.name)}</p>
            <p key={f.value} className="mt-1 animate-[ramp-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] text-lg tabular-nums" style={{ color: GOLD }}>{f.value}</p>
          </li>
        ))}
      </ul>
      <p className="mono-label text-center opacity-45 lg:col-span-3">{t({ es: 'Todo pasa por la rejilla · la hora corre sola', en: 'Everything runs through the grid · time runs on its own' })}</p>
    </div>
  )
}

/* ── Lo que vimos, cada hallazgo en su escena ──────────────────────────── */

const SHOPS: readonly { name: L; brand: string }[] = [
  { name: { es: 'Clásica · oro y carbón', en: 'Classic · gold and charcoal' }, brand: '#d9b36a' },
  { name: { es: 'De barrio · rojo', en: 'Neighborhood · red' }, brand: '#e5484d' },
  { name: { es: 'Moderna · verde', en: 'Modern · green' }, brand: '#3fae7c' },
]

/** 01 · Tres marcas, el mismo calendario gris. */
function SameForAll() {
  const { t } = useLocale()
  const step = useStep(1200, SHOPS.length)
  return (
    <div className="space-y-2">
      {SHOPS.map((s, i) => (
        <div key={s.brand} className={`flex items-center gap-3 rounded-md bg-white/[0.04] p-2 transition-opacity duration-500 ${i === step ? 'opacity-100' : 'opacity-55'}`}>
          <span className="h-6 w-6 shrink-0 rounded-full" style={{ background: s.brand }} />
          <span className="flex flex-1 gap-1" aria-hidden="true">
            {[60, 40, 75, 50].map((w, k) => (
              <span key={k} className="h-3 rounded-sm bg-white/15" style={{ width: `${w / 3}%` }} />
            ))}
          </span>
          <span className="w-[42%] truncate text-[11px] opacity-70">{t(s.name)}</span>
        </div>
      ))}
      <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.14em] opacity-45">{t({ es: 'Tres marcas · un mismo gris', en: 'Three brands · one same gray' })}</p>
    </div>
  )
}

const CLICKS: readonly L[] = [
  { es: 'Abrir', en: 'Open' }, { es: 'Editar', en: 'Edit' }, { es: 'Estado: llegó', en: 'Status: arrived' }, { es: 'Guardar', en: 'Save' },
  { es: 'Abrir', en: 'Open' }, { es: 'Editar', en: 'Edit' }, { es: 'Estado: en silla', en: 'Status: seated' }, { es: 'Guardar', en: 'Save' },
  { es: 'Abrir', en: 'Open' }, { es: 'Cobrar', en: 'Charge' }, { es: 'Confirmar', en: 'Confirm' },
]

/** 02 · «Demasiados clics»: llegar, sentar y cobrar contados uno por uno. */
function TooManyClicks() {
  const { t } = useLocale()
  // Cuenta hasta 11, se queda un momento y sale en fundido antes de volver a 1 (sin desplomarse de golpe).
  const step = useStep(420, CLICKS.length + 6)
  const n = Math.min(step + 1, CLICKS.length)
  const { reducedMotion } = useA11y()
  const leaving = !reducedMotion && step >= CLICKS.length + 4
  return (
    <div className={`transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-light tabular-nums text-[#ff6b72]">{n}</span>
        <span className="text-[12px] opacity-60">{t({ es: 'clics si cada paso es abrir, editar y guardar', en: 'clicks if every step is open, edit and save' })}</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1">
        {CLICKS.slice(0, n).map((c, i) => (
          <li key={i} className="animate-[ramp-in_0.3s_ease-out_both] rounded border border-white/15 px-1.5 py-0.5 text-[10px] opacity-75">{t(c)}</li>
        ))}
      </ul>
    </div>
  )
}

/** 03 · Nadie reacomoda: el retraso pisa las citas que siguen y nada propone nada. */
function NotSmart() {
  const { t } = useLocale()
  const step = useStep(1100, 4)
  const late = step >= 1
  return (
    <div className="relative h-[132px] rounded-md bg-white/[0.03] p-2">
      <p className="mb-1 text-[10px] opacity-55">{BARBERS[1]}</p>
      <span className="absolute inset-x-2 flex h-[36px] items-center rounded-[5px] px-2 text-[10px] transition-all duration-700 ease-expo" style={{ top: late ? 46 : 26, background: late ? 'rgba(255,107,114,0.25)' : 'rgba(255,255,255,0.09)', border: late ? '1px solid #ff6b72' : '1px solid transparent' }}>
        Gael · {late ? t({ es: 'tarde 20 min', en: '20 min late' }) : 'fade'}
      </span>
      <span className="absolute inset-x-2 top-[66px] flex h-[36px] items-center rounded-[5px] bg-white/[0.09] px-2 text-[10px]" style={{ backgroundImage: late ? 'repeating-linear-gradient(135deg, rgba(255,107,114,0.25) 0 5px, transparent 5px 10px)' : undefined }}>
        Marcela · fade
      </span>
      <span className={`absolute bottom-2 right-2 font-mono text-[10px] text-[#ff6b72] transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        {t({ es: '¿y ahora? · nada propone', en: 'now what? · nothing proposes' })}
      </span>
    </div>
  )
}

const SCENES = [SameForAll, TooManyClicks, NotSmart]

/** 01 · Los puntos del calendario: la rejilla como centro de la barbería y lo que no funcionaba. */
export function PlatformDots() {
  const { t } = useLocale()
  const { dots } = PLATFORM_CASE
  return (
    <div>
      <p data-reveal="mask" className="max-w-[22ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">{t(dots.kicker)}</p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(dots.lead)}</p>

      <GridHub />

      <p data-reveal className="mono-label mb-6 mt-20 opacity-60">{t({ es: 'Lo que vimos', en: 'What we saw' })}</p>
      <ol className="grid gap-4 md:grid-cols-3">
        {dots.seen.map((s, i) => {
          const Scene = SCENES[i]
          return (
            <li key={s.title.es} data-reveal className={`flex flex-col border border-fg/15 ${i === 1 ? 'md:translate-y-8' : ''}`}>
              <div className="min-h-[170px] border-b border-fg/10 bg-white/[0.02] p-4">{Scene && <Scene />}</div>
              <div className="p-5">
                <span className="mono-label text-signal">0{i + 1}</span>
                <p className="mt-2 text-lg leading-snug">{t(s.title)}</p>
                <p className="mt-2 text-sm leading-relaxed opacity-70">{t(s.body)}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <dl className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {dots.stats.map((s) => (
          <div key={s.label.es} data-reveal>
            <dt className="sr-only">{t(s.label)}</dt>
            <dd>
              <span data-count={s.value} className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{s.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(s.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
