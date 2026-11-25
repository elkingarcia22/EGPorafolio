'use client'

import { useState } from 'react'
import { RecordModal, NewTabLink } from '@/components/case/kit/record-modal'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI } from './clp-kit'

const { demo } = CLIPPER_CASE
const GOLD = AI[0]
/** La reserva abierta fuera del iframe, para la pestaña nueva */
const PUBLIC_URL = demo.url.replace('embed=1&', '')

/**
 * 08 · Demo: con la forma de la demo de Objetivos (un nodo que late, una frase
 * y dos botones). Aquí la reserva usa datos de prueba, así que el botón
 * principal abre a Clipper vivo en el modal; el otro, en una pestaña nueva.
 */
export function ClipperLiveDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
      {/* El nodo: late, como una señal que espera respuesta */}
      <span aria-hidden="true" className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${GOLD}59, transparent 70%)` }} />
        <span className="absolute inset-2 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite] rounded-full border" style={{ borderColor: `${GOLD}80` }} />
        <span className="relative h-4 w-4 rounded-full border border-white bg-[#fffaf0]" style={{ boxShadow: `0 0 0 5px ${GOLD}40, 0 0 24px 6px ${GOLD}b3` }} />
      </span>

      <h3 className="mt-8 text-balance text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Háblale a Clipper.', en: 'Talk to Clipper.' })}
      </h3>
      <p className="mt-4 max-w-[52ch] text-balance text-base leading-relaxed text-paper/65 md:text-lg">
        {t({
          es: 'El Clipper de la reserva funciona aquí mismo, con datos de prueba. Escríbele o toca el micrófono.',
          en: 'Booking’s Clipper runs right here, with test data. Type to it or tap the mic.',
        })}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-3 rounded-full py-2.5 pl-2.5 pr-5 text-[#16130f] transition-transform duration-300 ease-expo hover:-translate-y-0.5"
          style={{ background: GOLD, boxShadow: `0 0 30px -6px ${GOLD}cc` }}
        >
          <ClipperOrb size={22} />
          <span className="text-sm font-medium">{t({ es: 'Probar en vivo', en: 'Try it live' })}</span>
        </button>
        <a
          href={PUBLIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] py-2.5 pl-4 pr-5 text-sm text-paper/85 transition-colors duration-300 hover:border-white/40 hover:text-paper"
        >
          {t({ es: 'Abrir en otra pestaña', en: 'Open in a new tab' })} <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Para probar: lo que hay que escribir o dictar */}
      <p className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/40">
        {demo.tryIt.map((item) => (
          <span key={item.label.es}>
            {t(item.label)} · <span className="normal-case tracking-normal text-paper/70">{typeof item.value === 'string' ? item.value : t(item.value)}</span>
          </span>
        ))}
      </p>

      <RecordModal
        ids={['reserva']}
        openId={open ? 'reserva' : null}
        onOpenChange={(id) => id === null && setOpen(false)}
        title={t({ es: 'Clipper en la reserva', en: 'Clipper in booking' })}
        titleLeading={<ClipperOrb size={36} />}
        description="booking-flow-alpha.vercel.app"
        actions={<NewTabLink href={PUBLIC_URL} />}
      >
        <iframe src={demo.url} title={t({ es: 'Clipper en la reserva, en vivo', en: 'Clipper in booking, live' })} allow="microphone; autoplay" className="w-full flex-1 bg-[#121009]" />
      </RecordModal>
    </div>
  )
}
