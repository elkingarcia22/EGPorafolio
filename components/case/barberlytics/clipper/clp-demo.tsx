'use client'

import { useState } from 'react'
import { RecordModal, NewTabLink } from '@/components/case/kit/record-modal'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI } from './clp-kit'

const { demo } = CLIPPER_CASE

/**
 * 08 · Demo: la reserva pública usa datos de prueba, así que Clipper se queda
 * vivo. El orbe recibe la fibra de «Impacto» y escucha; al tocarlo (o el botón)
 * se abre el Clipper de la reserva, funcionando aquí mismo.
 */
export function ClipperLiveDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
      <button type="button" onClick={() => setOpen(true)} aria-label={t({ es: 'Abrir a Clipper en vivo', en: 'Open Clipper live' })} className="group relative grid place-items-center rounded-full outline-none transition-transform duration-500 ease-expo hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#f0ce86]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-[-60%] rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50" style={{ backgroundImage: `radial-gradient(circle, ${AI[1]}, ${AI[3]} 55%, transparent 70%)` }} />
        <ClipperOrb size={112} state="listening" />
      </button>

      <h3 className="mt-10 text-balance text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Háblale a Clipper.', en: 'Talk to Clipper.' })}
      </h3>
      <p className="mt-4 max-w-[52ch] text-balance text-base leading-relaxed text-paper/65 md:text-lg">
        {t({ es: 'El Clipper de la reserva, aquí mismo y con datos de prueba. Escríbele o toca el micrófono.', en: 'Booking’s Clipper, right here with test data. Type to it or tap the mic.' })}
      </p>

      <dl className="mt-6 flex flex-wrap justify-center gap-2">
        {demo.tryIt.map((item) => (
          <div key={item.label.es} className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[12px]">
            <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-paper/45">{t(item.label)}</dt>
            <dd className="text-paper/85">{typeof item.value === 'string' ? item.value : t(item.value)}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex items-center gap-3 rounded-full py-2.5 pl-4 pr-5 text-sm font-medium text-[#16130f] shadow-[0_0_30px_-6px_rgb(222_140_58/0.8)] transition-transform duration-300 ease-expo hover:-translate-y-0.5"
        style={{ backgroundImage: `linear-gradient(120deg,${AI.join(',')})` }}
      >
        {t({ es: 'Probar en vivo', en: 'Try it live' })} <span aria-hidden="true">↗</span>
      </button>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/35">
        {t({ es: 'Esta versión funciona con reglas, sin modelo de lenguaje', en: 'This version runs on rules, without a language model' })}
      </p>

      <RecordModal
        ids={['reserva']}
        openId={open ? 'reserva' : null}
        onOpenChange={(id) => id === null && setOpen(false)}
        title={t({ es: 'Clipper en la reserva', en: 'Clipper in booking' })}
        titleLeading={<ClipperOrb size={36} />}
        description="booking-flow-alpha.vercel.app"
        actions={<NewTabLink href={demo.url.replace('embed=1&', '')} />}
      >
        <iframe src={demo.url} title={t({ es: 'Clipper en la reserva, en vivo', en: 'Clipper in booking, live' })} allow="microphone; autoplay" className="w-full flex-1 bg-[#121009]" />
      </RecordModal>
    </div>
  )
}
