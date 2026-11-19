'use client'

import { BarberSelect, ConfirmWithToast, PickingCalendar, RisingKpi, Segmented, TimeSlots, Toggles, TypingSearch } from './live-pieces'

/**
 * Collage de componentes en uso: piezas reales del sistema (recreadas en vivo)
 * flotando sobre un fondo cálido, cada una con su ángulo y su ritmo.
 * En celular se ordenan en columna.
 */
const PIECES = [
  { C: TypingSearch, pos: 'md:left-[3%] md:top-[6%]', tilt: 'md:-rotate-2', float: 'collage-float-a' },
  { C: PickingCalendar, pos: 'md:left-[34%] md:top-[2%]', tilt: 'md:rotate-1', float: 'collage-float-b' },
  { C: RisingKpi, pos: 'md:right-[3%] md:top-[5%]', tilt: 'md:rotate-2', float: 'collage-float-c' },
  { C: TimeSlots, pos: 'md:left-[5%] md:top-[44%]', tilt: 'md:rotate-1', float: 'collage-float-c' },
  { C: Segmented, pos: 'md:left-[33%] md:bottom-[8%]', tilt: 'md:-rotate-1', float: 'collage-float-a' },
  { C: BarberSelect, pos: 'md:right-[24%] md:top-[46%]', tilt: 'md:-rotate-2', float: 'collage-float-b' },
  { C: Toggles, pos: 'md:right-[2%] md:top-[50%]', tilt: 'md:rotate-2', float: 'collage-float-a' },
  { C: ConfirmWithToast, pos: 'md:left-[8%] md:bottom-[3%]', tilt: 'md:rotate-0', float: 'collage-float-c' },
] as const

export function LiveCollage() {
  return (
    <div
      data-reveal="device"
      className="relative overflow-hidden rounded-3xl p-6 md:h-[clamp(640px,58vw,820px)] md:p-0"
      style={{
        background:
          'radial-gradient(circle at 25% 20%, rgba(217,179,106,0.28), transparent 45%), radial-gradient(circle at 80% 80%, rgba(46,156,176,0.22), transparent 50%), linear-gradient(160deg, #24201a, #0f0e0c 70%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(239,233,221,0.12)_1px,transparent_1.2px)] [background-size:22px_22px]" aria-hidden="true" />
      <ul className="relative grid gap-5 sm:grid-cols-2 md:block md:h-full" aria-label="Componentes del sistema en uso">
        {PIECES.map(({ C, pos, tilt, float }, i) => (
          <li key={i} className={`flex justify-center md:absolute ${pos}`}>
            <div className={`${tilt} ${float}`}>
              <C />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
