'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { useTick } from '../thema/live-pieces'

const GOLD = '#c99a45'

/** Paso de un guion de `steps` pasos (quieto en el último con movimiento reducido). */
function useStep(ms: number, steps: number): { step: number; round: number } {
  const { reducedMotion } = useA11y()
  const tick = useTick(ms)
  if (reducedMotion) return { step: steps - 1, round: 0 }
  return { step: tick % steps, round: Math.floor(tick / steps) }
}

const CASES = [
  { phone: '320 217 2738', title: { es: 'Hola, Marcela', en: 'Hi, Marcela' }, next: { es: 'Arma tu cita · ya armada con lo de siempre', en: 'Build your appointment · already set to the usual' } },
  { phone: '300 123 4567', title: { es: 'Conozcámonos', en: 'Let’s meet' }, next: { es: 'Perfil corto · luego la primera hora libre', en: 'Short profile · then the first free slot' } },
] as const

/** 01 · Con solo el celular, cada uno entra por su camino. */
function CoverDemo() {
  const { t } = useLocale()
  // Paso 5: la tarjeta sale antes de cambiar de cliente, así su nombre no cambia mientras se desvanece.
  const { step, round } = useStep(900, 6)
  const c = CASES[round % CASES.length]
  const typed = c.phone.slice(0, Math.min(c.phone.length, Math.round((step / 2) * c.phone.length)))
  const { reducedMotion } = useA11y()
  const decided = step >= 3 && (step < 5 || reducedMotion)
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-fg/15 bg-bg px-2.5 py-2 font-mono text-[12px] opacity-60">+57</span>
        <span className="flex-1 rounded-md border bg-bg px-3 py-2 font-mono text-[13px] tabular-nums transition-colors duration-300" style={{ borderColor: step >= 3 ? GOLD : 'rgb(var(--fg) / 0.15)' }}>
          {typed || <span className="opacity-35">000 000 0000</span>}
          {step < 3 && <span className="caret" />}
        </span>
      </div>
      <div className={`flex items-center justify-between gap-3 transition-all duration-500 ease-expo ${decided ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        <div>
          <p className="text-xl font-light">{t(c.title)}</p>
          <p className="text-[12px] opacity-60">{t(c.next)}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: GOLD }}>
          {round % 2 === 0 ? t({ es: 'vuelve', en: 'returning' }) : t({ es: 'llega', en: 'new' })}
        </span>
      </div>
    </div>
  )
}

const VERSIONS: readonly { name: L; q: L }[] = [
  { name: { es: 'Paso a paso', en: 'Step by step' }, q: { es: '¿Quién eres?', en: 'Who are you?' } },
  { name: { es: 'Agenda en lista', en: 'List agenda' }, q: { es: 'Arma tu cita', en: 'Build your appointment' } },
  { name: { es: 'Según el cliente', en: 'By client' }, q: { es: 'La portada decide', en: 'The cover decides' } },
  { name: { es: 'Clipper', en: 'Clipper' }, q: { es: 'Dime qué necesitas', en: 'Tell me what you need' } },
]

/** 02 · Cuatro preguntas distintas que llegan al mismo motor y al mismo cobro. */
function VersionsDemo() {
  const { t } = useLocale()
  const { step } = useStep(1100, VERSIONS.length)
  return (
    // En el celular se apila: las cuatro preguntas arriba y el motor debajo, sin cortar las frases.
    <div className="grid h-full items-center gap-2 sm:grid-cols-[minmax(0,1.3fr)_56px_minmax(0,0.8fr)] sm:gap-0">
      <ul className="space-y-1.5">
        {VERSIONS.map((v, i) => (
          <li key={v.name.es} className={`flex items-baseline justify-between gap-2 rounded-md border px-3 py-1.5 text-[12px] transition-colors duration-500 ${i === step ? 'border-fg/40 bg-bg' : 'border-fg/10'}`}>
            <span className="font-medium">{t(v.name)}</span>
            <span className="truncate opacity-55">«{t(v.q)}»</span>
          </li>
        ))}
      </ul>
      <span className="text-center text-sm opacity-40 sm:hidden" aria-hidden="true">↓</span>
      <svg viewBox="0 0 56 120" className="hidden h-[120px] w-full sm:block" preserveAspectRatio="none" aria-hidden="true">
        {[15, 45, 75, 105].map((y, i) => (
          <path key={y} d={`M0 ${y} C 30 ${y}, 26 60, 56 60`} fill="none" strokeWidth={i === step ? 1.6 : 0.8} stroke={i === step ? GOLD : 'currentColor'} strokeOpacity={i === step ? 1 : 0.25} vectorEffect="non-scaling-stroke" className="transition-all duration-500" />
        ))}
      </svg>
      <div className="rounded-md border border-fg/20 bg-bg p-3 text-center">
        <p className="text-sm font-medium">{t({ es: 'Un motor', en: 'One engine' })}</p>
        <p className="mt-0.5 text-[11px] opacity-55">{t({ es: 'horas · reglas · cobro', en: 'slots · rules · checkout' })}</p>
      </div>
    </div>
  )
}

/** 03 · Círculo para una opción, casilla para varias. */
function ChooseDemo() {
  const { t } = useLocale()
  const { step } = useStep(900, 4)
  const barbers = ['Andrés', 'Emilio', 'Paola']
  const services = [t({ es: 'Corte', en: 'Cut' }), t({ es: 'Barba', en: 'Beard' }), t({ es: 'Cejas', en: 'Brows' })]
  return (
    <div className="grid h-full grid-cols-2 items-center gap-6 text-[12px]">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] opacity-50">{t({ es: 'Una opción', en: 'One option' })}</p>
        {barbers.map((b, i) => {
          const on = i === step % barbers.length
          return (
            <p key={b} className="flex items-center gap-2 py-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300" style={{ borderColor: on ? GOLD : 'rgb(var(--fg) / 0.3)' }}>
                <span className={`h-2 w-2 rounded-full transition-transform duration-300 ${on ? 'scale-100' : 'scale-0'}`} style={{ background: GOLD }} />
              </span>
              {b}
            </p>
          )
        })}
      </div>
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] opacity-50">{t({ es: 'Varias', en: 'Several' })}</p>
        {services.map((s, i) => {
          const on = i < step
          return (
            <p key={s} className="flex items-center gap-2 py-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-[4px] border-[1.5px] text-[10px] font-bold text-white transition-colors duration-300" style={{ borderColor: on ? GOLD : 'rgb(var(--fg) / 0.3)', background: on ? GOLD : 'transparent' }}>
                {on ? '✓' : ''}
              </span>
              {s}
            </p>
          )
        })}
      </div>
    </div>
  )
}

/** 04 · El código aparece justo antes de cobrar, no al mirar horas. */
function IdentityDemo() {
  const { t } = useLocale()
  const { step } = useStep(850, 7)
  const stages = [t({ es: 'Servicio', en: 'Service' }), t({ es: 'Hora', en: 'Time' }), t({ es: 'Código', en: 'Code' }), t({ es: 'Pago', en: 'Pay' })]
  const stage = Math.min(step, 2) + (step >= 6 ? 1 : 0)
  const digits = '246810'.slice(0, Math.max(0, (step - 2) * 2))
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <ol className="grid grid-cols-4 gap-1.5">
        {stages.map((s, i) => (
          <li key={s} className="space-y-1.5">
            <span className="block h-1 rounded-full transition-colors duration-500" style={{ background: i <= stage ? GOLD : 'rgb(var(--fg) / 0.12)' }} />
            <span className={`block text-[11px] ${i === stage ? 'font-medium' : 'opacity-50'}`}>{s}</span>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between gap-4">
        <div className={`flex gap-1 transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-25'}`}>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="flex h-8 w-6 items-center justify-center rounded border bg-bg font-mono text-[13px] transition-colors duration-300" style={{ borderColor: digits[i] ? GOLD : 'rgb(var(--fg) / 0.15)' }}>
              {digits[i] ?? ''}
            </span>
          ))}
        </div>
        <span className="text-right font-mono text-[10px] uppercase tracking-[0.14em] opacity-55">
          {step < 2 ? t({ es: 'mira horas sin código', en: 'browse slots, no code' }) : step >= 6 ? t({ es: 'listo para cobrar', en: 'ready to pay' }) : t({ es: 'código antes de cobrar', en: 'code before paying' })}
        </span>
      </div>
    </div>
  )
}

const DEMOS = [CoverDemo, VersionsDemo, ChooseDemo, IdentityDemo]

/** 03 · La idea de la reserva: la pregunta y cuatro principios, cada uno con su prueba en vivo. */
export function BookingIdea() {
  const { t } = useLocale()
  const { idea } = BOOKING_CASE
  return (
    <div>
      <p data-reveal className="mono-label mb-4 opacity-60">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p data-reveal="mask" className="max-w-[26ch] text-[clamp(1.8rem,1rem+2.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">{t(idea.hmw)}</p>

      <ol className="mt-14 border-b border-fg/15">
        {idea.principles.map((p, i) => {
          const Demo = DEMOS[i]
          return (
            <li key={p.title.es} data-reveal className="group grid gap-6 border-t border-fg/15 py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <span className="mono-label text-signal">{t({ es: 'Principio', en: 'Principle' })} 0{i + 1}</span>
                <p className="mt-3 text-[clamp(1.5rem,1rem+1.4vw,2.3rem)] font-light leading-[1.1] tracking-tight transition-transform duration-500 ease-expo group-hover:translate-x-1.5">{t(p.title)}</p>
                <p className="mt-3 max-w-[40ch] text-sm leading-relaxed opacity-70">{t(p.body)}</p>
              </div>
              <div className="min-h-[170px] border border-fg/10 bg-fg/[0.03] p-5 md:col-span-7">{Demo && <Demo />}</div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
