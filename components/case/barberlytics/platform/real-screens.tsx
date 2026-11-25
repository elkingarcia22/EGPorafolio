'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { BrowserMockup, PanelMockup, type Callout } from '@/components/case/kit/device'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import type { CaseImage } from '@/lib/content/cases/barberlytics/types'

interface Piece {
  id: string
  name: L
  image: CaseImage
  callouts: readonly Callout[]
  /** Panel lateral (alto) o pantalla completa */
  tall: boolean
}

const { screens, dayPanel } = PLATFORM_CASE
const PIECES: readonly Piece[] = [
  ...screens.map((s) => ({ id: s.id, name: s.title, image: s.image, callouts: s.callouts, tall: s.image.height > s.image.width })),
  { id: 'day', name: { es: 'El día de un vistazo', en: 'The day at a glance' }, image: dayPanel.image, callouts: dayPanel.callouts, tall: true },
]

/** 04 · Forma, al final: las pantallas reales sobre una fibra; tocar una la abre con lo que conviene mirar. */
export function RealScreens() {
  const { t } = useLocale()
  const [open, setOpen] = useState<number | null>(null)
  const piece = open === null ? null : PIECES[open]

  return (
    <div className="mx-auto max-w-[1000px]">
      {/* Las pantallas reales, sobre una fibra: se abren al tocarlas */}
      <div>
        <p className="mono-label mb-8 text-center opacity-50">{t({ es: 'Las pantallas reales', en: 'The real screens' })}</p>
        <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
          <span aria-hidden="true" className="absolute inset-x-[12.5%] top-[7px] hidden h-px bg-gradient-to-r from-signal/60 via-white/20 to-[#d9b36a]/60 sm:block" />
          {PIECES.map((p, i) => {
            const on = open === i
            return (
              <li key={p.id} className="relative flex flex-col items-center">
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="group flex flex-col items-center text-center outline-none">
                  <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                    <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]' : 'border-white/50 bg-void group-hover:bg-signal/60'}`} />
                    {on && <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                  </span>
                  <span className={`relative mt-4 block h-20 w-32 overflow-hidden rounded-lg border transition-all duration-500 ${on ? 'border-[#d9b36a] opacity-100' : 'border-white/10 opacity-60 group-hover:opacity-90'}`}>
                    <Image src={p.image.src} alt="" fill sizes="128px" className={`object-cover ${p.tall ? 'object-top' : 'object-left-top'}`} />
                  </span>
                  <span className={`mt-3 max-w-[18ch] text-balance text-[13px] leading-snug transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-65 group-hover:opacity-95'}`}>{t(p.name)}</span>
                </button>
              </li>
            )
          })}
        </ol>

        {piece && (
          <div key={piece.id} className="pl-fade mt-14">
            {piece.tall ? (
              <PanelMockup image={piece.image} callouts={piece.callouts} />
            ) : (
              <BrowserMockup image={piece.image} callouts={piece.callouts} />
            )}
          </div>
        )}
      </div>
      {/* El cierre del capítulo: de aquí baja la fibra hasta «IA», sin cruzar la pantalla abierta */}
      <span aria-hidden="true" className="relative mx-auto mt-14 block h-2 w-2 rounded-full bg-white/60 shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
        <span data-fiber-from="pl-ia" className="absolute left-1/2 top-1/2 h-px w-px" />
      </span>
    </div>
  )
}
