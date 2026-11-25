'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PhoneBody } from '@/components/case/kit/device'
import { useLocale } from '@/lib/i18n'
import { BookingLede } from './booking-lede'
import { SKETCH_STEPS } from './sketch-steps'
import { useAutoSteps, useCycle } from './use-auto-steps'

/** Tiempo en cada pantalla mientras pasan solas (ms) */
const SLIDE_MS = 3000
/** Cuánto se abren y giran las pantallas de los lados */
const SPREAD = { x: 92, rotate: 28, shrink: 0.18, depth: 160 }

/**
 * 04 · Bocetos y forma, primera parte: las cuatro decisiones del tablero como
 * un carrusel de pantallas reales que gira solo. La del frente manda; las de
 * los lados se asoman giradas. Tocar una la trae al frente y muestra del boceto
 * a la app.
 */
export function ScreenCarousel() {
  const { t } = useLocale()
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const [hold, setHold] = useState(false)
  const [picked, setPicked] = useState(false)
  const [active, setActive] = useCycle(SKETCH_STEPS.length, SLIDE_MS, inView && !hold && !reducedMotion)
  const current = SKETCH_STEPS[active]
  const n = SKETCH_STEPS.length

  const choose = (i: number) => {
    setActive(i)
    setHold(true)
    setPicked(true)
  }

  return (
    <div ref={ref} className="flex flex-col items-center" onPointerEnter={() => setHold(true)} onPointerLeave={() => !picked && setHold(false)}>
      <BookingLede
        tag={picked ? `0${active + 1} · ${t(current.title)}` : t({ es: 'Del tablero a la app', en: 'From the board to the app' })}
        title={picked ? `«${t(current.sketch)}»` : t({ es: 'Cuatro decisiones bocetadas, cuatro pantallas reales.', en: 'Four sketched decisions, four real screens.' })}
        sub={picked ? t(current.app) : t({ es: 'Capturas reales con datos de prueba. Toca una pantalla para ver qué decía el boceto.', en: 'Real screens with test data. Tap one to see what the sketch said.' })}
        swapKey={picked ? active : 'all'}
      />

      <div className="relative mt-10 h-[clamp(360px,52vw,560px)] w-full max-w-[900px] [perspective:1400px]">
        {SKETCH_STEPS.map((s, i) => {
          // Distancia al frente, con vuelta: -1 a la izquierda, 1 a la derecha
          let d = i - active
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const front = d === 0
          const hidden = Math.abs(d) > 1
          return (
            <button
              key={s.image}
              type="button"
              onClick={() => choose(i)}
              aria-label={t(s.title)}
              aria-current={front}
              className="absolute left-1/2 top-0 w-[clamp(150px,22vw,250px)] outline-none transition-[transform,opacity] duration-700 ease-expo"
              style={{
                transform: `translateX(calc(-50% + ${d * SPREAD.x}%)) translateZ(${front ? 0 : -SPREAD.depth}px) rotateY(${-d * SPREAD.rotate}deg) scale(${1 - Math.abs(d) * SPREAD.shrink})`,
                opacity: hidden ? 0 : front ? 1 : 0.5,
                zIndex: 10 - Math.abs(d),
                pointerEvents: hidden ? 'none' : 'auto',
              }}
            >
              <PhoneBody>
                <Image src={`/cases/barberlytics/${s.image}.webp`} width={780} height={1688} alt={t(s.alt)} sizes="250px" className="block h-auto w-full" />
              </PhoneBody>
            </button>
          )
        })}
      </div>

      {/* Los cuatro, en una línea: el del frente encendido */}
      <ol className="mt-4 flex items-center gap-5">
        {SKETCH_STEPS.map((s, i) => (
          <li key={s.image}>
            <button type="button" onClick={() => choose(i)} className="group flex items-center gap-2 outline-none" aria-label={t(s.title)}>
              <span className={`h-2 w-2 rounded-full transition-all duration-500 ${i === active ? 'scale-125 bg-[rgb(var(--bk))] shadow-[0_0_10px_rgb(var(--bk)/0.8)]' : 'bg-white/25 group-hover:bg-white/50'}`} />
              <span className={`hidden font-mono text-[10px] uppercase tracking-[0.12em] transition-opacity sm:inline ${i === active ? 'opacity-90' : 'opacity-40'}`}>{t(s.title)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
