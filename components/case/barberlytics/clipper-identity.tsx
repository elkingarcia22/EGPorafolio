'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { CLIPPER } from '@/lib/content/cases/barberlytics/clipper'
import { ClipperOrb, type ClipperOrbState } from './clipper-orb'
import { Body, Shot, SubHead } from './ui'

/** El orbe en vivo con sus tres estados, para probarlos. */
export function OrbStates() {
  const { t } = useLocale()
  const { identity } = CLIPPER
  const [state, setState] = useState<ClipperOrbState>('idle')
  const current = identity.states.find((s) => s.id === state) ?? identity.states[0]

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <div data-reveal className="flex flex-col items-center justify-center py-10 lg:col-span-5">
        <ClipperOrb size={200} state={state} />
        <p className="mt-12 bg-gradient-to-r from-[#F0CE86] via-[#DE8C3A] to-[#3F72D8] bg-clip-text text-2xl font-medium text-transparent">
          Clipper
        </p>
        <p className="mono-label mt-2 opacity-60" aria-live="polite">
          {t(current.name)} · {t(current.body)}
        </p>
      </div>
      <div className="lg:col-span-7">
        <SubHead index="4.1">{t(identity.title)}</SubHead>
        <Body>{t(identity.body)}</Body>
        <div role="radiogroup" aria-label={t({ es: 'Estado del orbe', en: 'Orb state' })} className="mt-8 flex flex-wrap gap-2">
          {identity.states.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={state === s.id}
              onClick={() => setState(s.id)}
              className="mono-label border border-fg/25 px-4 py-2.5 transition-colors hover:border-fg/60 aria-checked:border-signal aria-checked:bg-signal aria-checked:text-on-signal"
            >
              {t(s.name)}
            </button>
          ))}
        </div>
        <ul className="mt-8 space-y-2 text-sm">
          {identity.rules.map((rule, i) => (
            <li key={rule.es} data-reveal className="flex gap-3 opacity-80">
              <span aria-hidden="true" className={i === 0 ? 'text-signal' : 'opacity-50'}>
                {i === 0 ? '✓' : '✕'}
              </span>
              {t(rule)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Las seis rondas del logo, como tira que se recorre. */
export function LogoRounds() {
  const { t } = useLocale()
  const { logo } = CLIPPER
  const [active, setActive] = useState(0)
  const round = logo.rounds[active]

  return (
    <div>
      <SubHead index="4.2">{t(logo.title)}</SubHead>
      <Body>{t(logo.body)}</Body>
      <ol className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label={t({ es: 'Rondas del logo', en: 'Logo rounds' })}>
        {logo.rounds.map((r, i) => (
          <li key={r.src}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className="mono-label w-full border border-fg/20 px-2 py-2.5 text-left text-[11px] leading-tight transition-colors hover:border-fg/60 aria-pressed:border-signal aria-pressed:bg-signal aria-pressed:text-on-signal"
            >
              {r.caption ? t(r.caption) : i + 1}
            </button>
          </li>
        ))}
      </ol>
      <Shot key={round.src} image={{ ...round, caption: undefined }} frame="plain" className="mt-6" />
      <p className="mt-3 text-sm opacity-70">{t(round.alt)}</p>
    </div>
  )
}
