'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { ALL_FIELDS, LiveCalendar, useCalendarClock, type CardFields, type CardStyle, type ColorBy, type Density } from './live-calendar'
import { APPTS, CLIENT, SERVICE, STAGE, cardHue, fmt, stageAt } from './calendar-model'
import { useInView } from './use-auto-steps'

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
interface Look {
  colorBy: ColorBy
  style: CardStyle
  density: Density
  fields: CardFields
}

const START: Look = { colorBy: 'estado', style: 'pastel', density: 'normal', fields: ALL_FIELDS }
/** El recorrido solo: cada paso cambia un ajuste, hasta que alguien toque uno */
const TOUR: readonly Look[] = [
  START,
  { ...START, colorBy: 'servicio' },
  { ...START, colorBy: 'cliente' },
  { ...START, colorBy: 'cliente', style: 'vivo' },
  { ...START, colorBy: 'estado', style: 'vivo', density: 'amplia' },
  { ...START, density: 'amplia', fields: { ...ALL_FIELDS, time: true } },
  { ...START, density: 'compacta', fields: { ...ALL_FIELDS, price: false, hints: false } },
  { ...START, colorBy: 'neutral', fields: { ...ALL_FIELDS, type: false, service: false } },
]
const TOUR_MS = 1800

/** La opción que sigue a la actual, dando la vuelta */
function nextOf<T extends string>(options: readonly { id: T }[], value: T): T {
  const i = options.findIndex((o) => o.id === value)
  return options[(i + 1) % options.length].id
}

const FEATURED = APPTS.find((a) => a.client === 'Mariana Ramírez') ?? APPTS[0]
const BIG_PAD: Record<Density, string> = { compacta: 'p-4 min-h-[150px]', normal: 'p-6 min-h-[196px]', amplia: 'p-7 min-h-[250px]' }

/** La misma cita en grande: cada ajuste se ve aplicado sobre ella. */
function BigCard({ now, look }: { now: number; look: Look }) {
  const { colorBy, style, density, fields } = look
  const stage = stageAt(FEATURED, now)
  const s = STAGE[stage]
  const hue = cardHue(FEATURED, stage, colorBy)
  const bg = hue ? `${hue}${style === 'vivo' ? '66' : '24'}` : 'rgba(255,255,255,0.06)'
  const edge = hue ?? 'rgba(255,255,255,0.3)'
  return (
    <div className={`relative flex flex-col rounded-2xl text-left text-[#efe9dd] transition-all duration-500 ease-expo ${BIG_PAD[density]}`} style={{ background: bg, boxShadow: `inset 0 0 0 1.5px ${edge}, 0 40px 90px -30px ${hue ?? '#000'}` }}>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERVICE[FEATURED.services[0]].hue }} />
        <span className="text-xl font-medium">{FEATURED.client}</span>
        {fields.hints && <span className="pl-fade text-sm text-white/60" title="Pidió a su barbero · tiene notas">☆ ✎</span>}
        {fields.type && <span className="pl-fade ml-auto rounded-full bg-black/35 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide" style={{ color: CLIENT[FEATURED.type] }}>{FEATURED.type}</span>}
      </div>
      {(fields.service || fields.price) && (
        <p className="pl-fade mt-2 text-sm text-white/65">
          {[fields.service ? FEATURED.services.map((sv) => SERVICE[sv].name).join(' + ') : null, fields.price ? `US$ ${FEATURED.price}` : null].filter(Boolean).join(' · ')}
        </p>
      )}
      {fields.time && <p className="pl-fade mt-1 font-mono text-xs text-white/45">{fmt(FEATURED.start)} – {fmt(FEATURED.start + FEATURED.len)}</p>}
      <div className="mt-auto flex items-center justify-between pt-6">
        {fields.status ? (
          <span key={stage} className="pl-fade inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-sm" style={{ color: s.hue }}>
            {stage === 'paid' ? '✓' : <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hue }} />} {s.label}
          </span>
        ) : <span />}
        {fields.next && s.next && <span key={s.next} className="pl-pop rounded-lg bg-[#d9b36a] px-4 py-2 text-sm font-semibold text-[#16130f]">{s.next}</span>}
      </div>
    </div>
  )
}

/**
 * 04 · Forma: la tarjeta dinámica con todo lo que se puede personalizar.
 * Al entrar, recorre sola los ajustes (color, estilo, densidad, qué muestra);
 * al tocar uno, el recorrido se detiene y manda quien mira. El calendario de
 * al lado aplica lo mismo, con la hora corriendo.
 */
export function CardStudio() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, '0px 0px -15% 0px')
  const now = useCalendarClock(1100, 0.2, 3.2, 0.6)
  const [step, setStep] = useState(0)
  const [manual, setManual] = useState<Look | null>(null)

  useEffect(() => {
    if (manual || !inView || reducedMotion) return
    const id = window.setTimeout(() => setStep((n) => (n + 1) % TOUR.length), TOUR_MS)
    return () => window.clearTimeout(id)
  }, [manual, inView, reducedMotion, step])

  const look = manual ?? TOUR[step]
  const change = (patch: Partial<Look>) => setManual({ ...look, ...patch })

  return (
    <div ref={rootRef} className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      {/* En teléfono, la rejilla entera no se lee: queda la tarjeta en grande, que muestra lo mismo */}
      <div className="relative hidden md:block">
        <span aria-hidden="true" className="pointer-events-none absolute -inset-x-8 -inset-y-6 rounded-[50%] bg-[radial-gradient(closest-side,rgba(217,179,106,0.12),transparent)]" />
        <LiveCalendar now={now} columns={3} colorBy={look.colorBy} style={look.style} density={look.density} fields={look.fields} highlight={FEATURED.client} className="relative shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)]" />
      </div>

      {/* La tarjeta, centrada en su columna, y debajo solo lo que está activo */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[440px]">
          <BigCard now={now} look={look} />
        </div>
        {/* Solo lo que está activo, en una línea; tocar una palabra pasa a la siguiente opción */}
        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[clamp(1.2rem,1rem+0.7vw,1.6rem)] font-light tracking-tight">
          {[
            { key: 'c', label: COLOR.find((o) => o.id === look.colorBy)!.label, next: () => change({ colorBy: nextOf(COLOR, look.colorBy) }) },
            { key: 's', label: STYLE.find((o) => o.id === look.style)!.label, next: () => change({ style: nextOf(STYLE, look.style) }) },
            { key: 'd', label: DENSITY.find((o) => o.id === look.density)!.label, next: () => change({ density: nextOf(DENSITY, look.density) }) },
          ].map((w, i) => (
            <span key={w.key} className="flex items-center gap-x-4">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#d9b36a]/50" />}
              <button type="button" onClick={w.next} className="text-[#d9b36a] underline decoration-[#d9b36a]/25 decoration-1 underline-offset-[8px] transition-colors hover:decoration-[#d9b36a]">
                <span key={w.label.es} className="pl-fade inline-block">{t(w.label)}</span>
              </button>
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
