'use client'

import { useEffect, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { ParticipationRiver } from './dots-river'
import { STATION_MOCKS } from './dots-mocks'
import { STATION_MOCKS_MOBILE } from './dots-mocks-mobile'
import { useMedia } from './shared'
import './hero-dots.css'

const ADVANCE_MS = 4200

/** El recorrido de una medición: el río arriba, y debajo el reto y el rediseño de la parada elegida. */
function MeasurementJourney() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const stations = ENCUESTAS_CASE.dots.stations
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [hover, setHover] = useState(false)
  const station = stations[active]
  // En celular y tableta, una mini interfaz propia, grande y legible, en vez del dibujo de escritorio encogido.
  const narrow = useMedia('(max-width: 1023px)')
  const Mock = (narrow ? STATION_MOCKS_MOBILE : STATION_MOCKS)[station.id]

  useEffect(() => {
    if (reducedMotion || pinned || hover) return
    const id = window.setInterval(() => setActive((a) => (a + 1) % stations.length), ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion, pinned, hover, stations.length])

  const pick = (i: number) => {
    setActive(i)
    setPinned(true)
  }

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="hidden md:block" data-reveal>
        <ParticipationRiver stations={stations} active={active} onPick={pick} />
        <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] opacity-50">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" />{t({ es: 'personas que siguen', en: 'people who continue' })}</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#e0675f]" />{t({ es: 'personas que se quedan en una parada', en: 'people who stall at a stop' })}</span>
          <span>{t({ es: 'Flujo ilustrativo, no son datos medidos.', en: 'Illustrative flow, not measured data.' })}</span>
        </p>
      </div>

      <ol className="relative space-y-1 border-l border-fg/15 pl-5 md:hidden" data-reveal>
        {stations.map((s, i) => {
          const on = i === active
          return (
            <li key={s.id} className="relative">
              <span className={`absolute -left-[1.6rem] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-signal transition-colors ${on ? 'bg-signal' : 'bg-bg'}`} aria-hidden="true" />
              <button type="button" aria-pressed={on} onClick={() => pick(i)} className={`flex w-full flex-wrap items-center gap-x-3 gap-y-1 py-2 text-left transition-opacity ${on ? '' : 'opacity-60'}`}>
                <span className="font-mono text-[10px] text-signal">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base">{t(s.name)}</span>
                <span className="rounded-full border border-fg/20 px-2 py-0.5 text-[10px]">{t(s.who)}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <div key={station.id} className="hd-rise mt-10 grid gap-4 lg:grid-cols-12" aria-live="polite">
        <div className="relative overflow-hidden rounded-2xl border border-[#e0675f]/30 bg-[#e0675f]/[0.06] p-6 lg:col-span-4">
          <p className="mono-label text-[#f08a83]">{t({ es: 'El reto', en: 'The challenge' })}</p>
          <p className="mt-3 text-lg leading-snug opacity-85">{t(station.before)}</p>
          <span className="pointer-events-none absolute -bottom-6 -right-2 font-mono text-[6rem] leading-none text-[#e0675f] opacity-10" aria-hidden="true">{String(active + 1).padStart(2, '0')}</span>
        </div>
        <div className="grid gap-4 rounded-2xl border border-signal/40 bg-signal/[0.06] p-6 sm:grid-cols-2 lg:col-span-8">
          <div>
            <p className="mono-label text-signal">{t({ es: 'Con el rediseño', en: 'With the redesign' })}</p>
            <p className="mt-3 text-lg leading-snug">{t(station.after)}</p>
            {pinned && (
              <button type="button" onClick={() => setPinned(false)} className="mono-label mt-5 opacity-60 hover:opacity-100">
                ↻ {t({ es: 'Seguir el recorrido solo', en: 'Resume the tour' })}
              </button>
            )}
          </div>
          {Mock && <Mock />}
        </div>
      </div>

      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {stations.map((s, i) => (
          <span key={s.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-fg/10">
            {i === active && !pinned && !hover && !reducedMotion ? (
              <span key={`${s.id}-run`} className="block h-full bg-signal" style={{ animation: `hd-grow ${ADVANCE_MS}ms linear both`, transformOrigin: 'left' }} />
            ) : (
              <span className={`block h-full transition-colors duration-500 ${i <= active ? 'bg-signal' : 'bg-transparent'}`} />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 01 · Los puntos: el recorrido de una medición, dónde se pierde la gente y las cifras de partida. */
export function CycleDots() {
  const { t } = useLocale()
  const d = ENCUESTAS_CASE.dots
  return (
    <div>
      <p data-reveal="mask" className="max-w-[24ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">{t(d.kicker)}</p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">{t(d.lead)}</p>

      <p data-reveal className="mono-label mb-8 mt-16 opacity-60">{t({ es: 'El río de una medición: seis paradas, de crear a actuar', en: 'The river of a measurement: six stops, from create to act' })}</p>
      <MeasurementJourney />

      <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-fg/15 pt-10 lg:grid-cols-4">
        {d.facts.map((f) => (
          <div key={f.label.es} data-reveal>
            <dt className="sr-only">{t(f.label)}</dt>
            <dd>
              <span data-count={f.value} className="block text-[clamp(2.4rem,1.6rem+2.4vw,3.8rem)] font-light leading-none text-signal tabular-nums">{f.value}</span>
              <span className="mt-3 block text-sm leading-snug opacity-70">{t(f.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
