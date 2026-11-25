'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { Arrows, Bar, Board, Btn, Hand, Pin, Sketchy, SketchPhone, Sticky, type StickyColor } from '@/components/case/kit/sketch'
import { BookingLede } from './booking-lede'
import { SKETCH_STEPS } from './sketch-steps'

/** Dónde va cada celular dibujado en el tablero (unidades de diseño) */
const PHONE = { y: 170, w: 190, xs: [60, 370, 650, 940] }
/** Color del post-it de cada pantalla */
const STICKY: readonly StickyColor[] = ['yellow', 'green', 'pink', 'blue']

/** Línea de días: la tira que reemplaza al calendario */
function DayStrip() {
  return (
    <div className="flex gap-[0.3cqw]">
      {[0, 1, 2, 3, 4].map((d) => (
        <Sketchy key={d} fill={d === 1 ? '#ffd2a8' : 'transparent'} className="h-[1.6cqw] flex-1" />
      ))}
    </div>
  )
}

/** Lo que se dibujó en cada celular, en el orden de SKETCH_STEPS */
function CoverSketch() {
  return (
    <>
      <Hand size={1.25} className="mt-[1cqw] font-bold">Reserva tu cita</Hand>
      <Bar w={70} />
      <div className="mt-[1.5cqw]">
        <Sketchy fill="#fffdf6" className="px-[0.5cqw] py-[0.4cqw]">
          <Hand size={1}>📱 320 217 …</Hand>
        </Sketchy>
      </div>
      <Btn accent>Continuar</Btn>
      <div className="mt-auto flex flex-col gap-[0.4cqw]">
        <Bar w={45} />
        <Bar w={35} />
      </div>
    </>
  )
}

function ReturnSketch() {
  return (
    <>
      <Hand size={1.25} className="font-bold">Arma tu cita</Hand>
      {['sede ✓', 'servicio ✓', 'barbero ✓'].map((s) => (
        <Sketchy key={s} fill="#c9efc0" className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95}>{s}</Hand>
        </Sketchy>
      ))}
      <DayStrip />
      <div className="grid grid-cols-2 gap-[0.3cqw]">
        <Btn>4:30</Btn>
        <Btn accent>5:00</Btn>
      </div>
    </>
  )
}

function NewSketch() {
  return (
    <>
      <Hand size={1.25} className="font-bold">Conozcámonos</Hand>
      <Bar w={85} />
      {['nombre', 'apellido', 'correo'].map((s) => (
        <Sketchy key={s} className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95} className="opacity-60">{s}</Hand>
        </Sketchy>
      ))}
      <Hand size={0.95}>☐ promociones</Hand>
      <div className="mt-auto">
        <Btn accent>Seguir</Btn>
      </div>
    </>
  )
}

function ClipperSketch() {
  return (
    <>
      <Hand size={1.25} className="font-bold">Clipper</Hand>
      <div className="ml-auto w-[85%]">
        <Sketchy fill="#bfe0ff" className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95}>corte mañana a las 5</Hand>
        </Sketchy>
      </div>
      <div className="w-[85%]">
        <Sketchy className="flex flex-col gap-[0.3cqw] px-[0.5cqw] py-[0.4cqw]">
          <Bar w={80} />
          <Hand size={0.95}>1 · 5:30</Hand>
          <Hand size={0.95}>2 · 6:00</Hand>
        </Sketchy>
      </div>
      <div className="mt-auto">
        <Sketchy className="px-[0.5cqw] py-[0.3cqw]">
          <Hand size={0.95} className="opacity-60">escribe o habla 🎙</Hand>
        </Sketchy>
      </div>
    </>
  )
}

const SKETCHES = [CoverSketch, ReturnSketch, NewSketch, ClipperSketch]

/**
 * 04 · Bocetos y forma, primera parte: el tablero donde se dibujó la reserva a
 * mano, como en Objetivos. La portada se parte en dos caminos (quien vuelve,
 * quien llega) y Clipper queda siempre a mano. Las flechas se dibujan y los
 * post-its se pegan al entrar; tocar un celular lo vuelve la pantalla real.
 */
export function SketchBoard() {
  const { t } = useLocale()
  const [picked, setPicked] = useState<number | null>(null)
  const current = picked !== null ? SKETCH_STEPS[picked] : null

  return (
    <div className="flex flex-col items-center">
      <BookingLede
        tag={current ? `0${(picked ?? 0) + 1} · ${t(current.title)}` : t({ es: 'El tablero', en: 'The board' })}
        title={current ? `«${t(current.sketch)}»` : t({ es: 'Primero, la reserva a mano: una pregunta en la portada y dos caminos.', en: 'First, the booking by hand: one question on the cover and two paths.' })}
        sub={current ? `→ ${t(current.app)}` : t({ es: 'Toca un celular para ver la pantalla real en la que terminó.', en: 'Tap a phone to see the real screen it became.' })}
        swapKey={picked ?? 'all'}
      />

      <div className="mt-10 w-full max-w-[1000px]">
        <Board title={t({ es: 'Reserva · la portada decide', en: 'Booking · the cover decides' })} w={1200} h={700} label={t({ es: 'Boceto de la reserva: portada, quien vuelve, quien llega y Clipper', en: 'Booking sketch: cover, returning, new and Clipper' })}>
          <Pin x={40} y={30}>
            <Hand size={2.4} className="font-bold">{t({ es: 'Un campo decide el camino', en: 'One field decides the path' })}</Hand>
          </Pin>
          <Pin x={40} y={92} w={620}>
            <Hand size={1.5} className="opacity-70">{t({ es: 'Con solo el celular ya sé si vuelves o si llegas.', en: 'From the phone alone I know if you’re back or new.' })}</Hand>
          </Pin>

          {SKETCH_STEPS.map((s, i) => {
            const Sketch = SKETCHES[i]
            const real = picked === i
            return (
              <Pin key={s.image} x={PHONE.xs[i]} y={PHONE.y} w={PHONE.w}>
                <button type="button" onClick={() => setPicked((p) => (p === i ? null : i))} aria-pressed={real} aria-label={t(s.title)} className="relative block w-full text-left outline-none transition-transform duration-300 hover:-translate-y-1">
                  <SketchPhone title={t(s.title)}>
                    <Sketch />
                  </SketchPhone>
                  {/* La pantalla real, encima del boceto al tocarlo */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 top-[2.2cqw] overflow-hidden rounded-[1.6cqw] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-500 ease-expo" style={{ opacity: real ? 1 : 0, transform: `scale(${real ? 1 : 0.94}) rotateY(${real ? 0 : 20}deg)` }}>
                    <Image src={`/cases/barberlytics/${s.image}.webp`} fill sizes="200px" alt={t(s.alt)} className="object-cover object-top" />
                  </span>
                </button>
              </Pin>
            )
          })}

          <Arrows
            paths={[
              { d: 'M258 330 C300 300 330 290 366 300', accent: true },
              { d: 'M258 400 C380 560 560 560 646 470', accent: true },
              { d: 'M565 220 C640 130 860 130 936 210' },
            ]}
          />
          <Pin x={272} y={260} w={110} rotate={-4}>
            <Hand size={1.3}>{t({ es: 'vuelve', en: 'back' })}</Hand>
          </Pin>
          <Pin x={420} y={545} w={110} rotate={3}>
            <Hand size={1.3}>{t({ es: 'llega', en: 'new' })}</Hand>
          </Pin>
          <Pin x={700} y={120} w={240} rotate={-2}>
            <Hand size={1.2} className="opacity-70">{t({ es: 'siempre a mano', en: 'always at hand' })}</Hand>
          </Pin>

          {SKETCH_STEPS.map((s, i) => (
            <Pin key={`note-${s.image}`} x={PHONE.xs[i] + (i % 2 ? 20 : -10)} y={590} w={210} rotate={i % 2 ? 2 : -2}>
              <Sticky color={STICKY[i]} small>{t(s.sketch)}</Sticky>
            </Pin>
          ))}
        </Board>
      </div>
    </div>
  )
}
