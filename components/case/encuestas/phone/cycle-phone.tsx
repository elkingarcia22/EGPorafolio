'use client'

import { useLocale, type L } from '@/lib/i18n'
import { PhoneNode } from './phone-kit'

interface Station {
  id: string
  name: L
  who: L
  before: L
  after: L
}

interface CyclePhoneProps {
  stations: readonly Station[]
  /** Si cada momento ya está en el ciclo (los que no existían caen hacia un lado) */
  onRing: readonly boolean[]
  current: number | null
  picked: number | null
  onPick: (i: number) => void
  closed: boolean
  headline: { label: string; text: string }
  countLabel: string
}

/**
 * 01 · Los puntos en el teléfono: el ciclo de pie. Una fibra baja de «Crear» a
 * «Actuar» y un arco punteado vuelve al principio. Los dos momentos que no
 * existían empiezan corridos a la derecha, punteados, y entran a la fibra
 * cuando la señal pasa. Tocar un momento abre su antes y su ahora ahí mismo.
 */
export function CyclePhone({ stations, onRing, current, picked, onPick, closed, headline, countLabel }: CyclePhoneProps) {
  const { t } = useLocale()
  const count = onRing.filter(Boolean).length
  const reached = current === null ? (closed ? stations.length - 1 : -1) : current

  return (
    <div className="relative mx-auto mt-6 max-w-[360px]">
      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="min-w-0">
          <p className="mono-label text-signal">{headline.label}</p>
          <p key={headline.text} className="obj-fade mt-2 text-balance text-[19px] font-light leading-snug">{headline.text}</p>
        </div>
        <p className="shrink-0 text-right">
          <span key={count} className="ms-value inline-block text-[52px] font-light leading-none tabular-nums">{count}</span>
          <span className="text-[22px] font-light text-paper/40">/{stations.length}</span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">{countLabel}</span>
        </p>
      </div>

      <ol className="relative mt-6 pl-2">
        {/* La fibra del ciclo: se enciende hasta el momento que va pasando la señal */}
        <span aria-hidden="true" className="absolute left-[15.5px] top-[22px] bottom-[22px] w-px bg-white/12" />
        <span
          aria-hidden="true"
          className="absolute left-[15.5px] top-[22px] bottom-[22px] w-px origin-top bg-gradient-to-b from-signal to-[rgb(var(--spark))] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-500 ease-linear"
          style={{ transform: `scaleY(${Math.max(0, reached) / (stations.length - 1)})` }}
        />
        {/* El arco que vuelve de «Actuar» a «Crear»: el ciclo cerrado */}
        <span
          aria-hidden="true"
          className="absolute -left-2 top-[22px] bottom-[22px] w-6 rounded-l-[22px] border border-r-0 border-dashed border-signal/70 transition-opacity duration-700"
          style={{ opacity: closed ? 1 : 0 }}
        />

        {stations.map((s, i) => {
          const on = onRing[i]
          const isPicked = picked === i
          const isCurrent = current === i && picked === null
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick(i)}
                aria-expanded={isPicked}
                className="flex min-h-[44px] w-full items-center gap-4 text-left outline-none transition-transform duration-700 ease-expo"
                style={{ transform: on ? 'none' : 'translateX(34px)' }}
              >
                <span className="grid w-4 place-items-center">
                  <PhoneNode on={isPicked || isCurrent} loose={!on} tone={isPicked ? '#ff54aa' : undefined} fiberFrom={i === stations.length - 1 ? 'enc-patrones' : undefined} />
                </span>
                <span className={`font-mono text-[13px] uppercase tracking-[0.1em] transition-opacity duration-500 ${on ? 'opacity-90' : 'opacity-45'}`}>{t(s.name)}</span>
                {!on && <span className="rounded-full border border-dashed border-white/30 px-2 py-0.5 font-mono text-[11px] text-paper/50">{t({ es: 'no existía', en: 'didn’t exist' })}</span>}
              </button>
              {isPicked && (
                <div className="obj-fade mb-3 ml-10 border-l border-signal/50 pl-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">{t(s.who)}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-paper/55"><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.12em]">{t({ es: 'Antes', en: 'Before' })}</span>{t(s.before)}</p>
                  <p className="mt-1.5 text-[16px] font-light leading-snug"><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.12em] text-signal">{t({ es: 'Ahora', en: 'Now' })}</span>{t(s.after)}</p>
                </div>
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper/40">{t({ es: 'Toca un momento', en: 'Tap a moment' })}</p>
    </div>
  )
}
