'use client'

import { useCallback, useState } from 'react'
import { CaseDemo } from '@/components/case/kit/case-demo'
import { RecordModal, NewTabLink } from '@/components/case/kit/record-modal'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'
import { AI } from './clp-kit'

const { demo } = CLIPPER_CASE
const GRADIENT = `linear-gradient(120deg,${AI[0]},${AI[1]} 45%,${AI[2]} 75%,${AI[3]})`
/** Barras de la onda de voz bajo el orbe */
const BARS = 28

/** La onda de voz del modo voz, en barras con los colores de IA. */
function Wave() {
  return (
    <span className="flex h-6 items-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => (
        <span
          key={i}
          className="w-[3px] animate-[wave_1s_ease-in-out_infinite] rounded-full"
          style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.09}s`, background: AI[[2, 1, 0][i % 3]] }}
        />
      ))}
    </span>
  )
}

/**
 * 08 · Demo: la misma forma de demo que los demás casos (texto y botón a la
 * izquierda, la pantalla a la derecha). La reserva usa datos de prueba, así
 * que Clipper se abre vivo en el modal.
 */
export function ClipperLiveDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <CaseDemo
        title={{ es: 'Háblale a Clipper.', en: 'Talk to Clipper.' }}
        lead={demo.lead}
        url="booking-flow-alpha.vercel.app/reservar"
        preview={
          <span className="relative flex h-full w-full flex-col items-center justify-center gap-6 bg-[#0f0d0b]">
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ backgroundImage: GRADIENT }} />
            <ClipperOrb size={120} state="listening" />
            <Wave />
          </span>
        }
        accent="217 179 106"
        tryIt={demo.tryIt}
        onOpen={() => setOpen(true)}
      />
      <RecordModal
        ids={['reserva']}
        openId={open ? 'reserva' : null}
        onOpenChange={(id) => id === null && close()}
        title={t({ es: 'Clipper en la reserva', en: 'Clipper in booking' })}
        titleLeading={<ClipperOrb size={36} />}
        description="booking-flow-alpha.vercel.app"
        actions={<NewTabLink href={demo.url.replace('embed=1&', '')} />}
      >
        <iframe src={demo.url} title={t({ es: 'Clipper en la reserva, en vivo', en: 'Clipper in booking, live' })} allow="microphone; autoplay" className="w-full flex-1 bg-[#121009]" />
      </RecordModal>
    </>
  )
}
