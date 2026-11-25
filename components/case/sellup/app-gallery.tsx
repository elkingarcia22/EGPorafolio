'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'

/** Cada cuánto gira a la pantalla siguiente (ms) */
const STEP_MS = 3800
/** Si la persona elige una, espera esto antes de seguir girando (ms) */
const RESUME_MS = 9000
/** Proporción de las capturas (ancho / alto) */
const RATIO = 1245 / 952

interface Shot {
  src: string
  name: L
}

/** Capturas reales de SellUp en Producción (nov. 2026). Los nombres de personas van desenfocados. */
const SHOTS: readonly Shot[] = [
  { src: '/cases/sellup/app-flujo.jpg', name: { es: 'Flujo de prospección · recorrido', en: 'Prospecting flow · walkthrough' } },
  { src: '/cases/sellup/app-tablero.jpg', name: { es: 'Flujo de prospección · tablero', en: 'Prospecting flow · board' } },
  { src: '/cases/sellup/app-empresas.jpg', name: { es: 'Lista de empresas', en: 'Company list' } },
  { src: '/cases/sellup/app-rumbo.jpg', name: { es: 'Rumbo, dentro de la lista', en: 'Rumbo, inside the list' } },
  { src: '/cases/sellup/app-contactos.jpg', name: { es: 'Contactos por revisar', en: 'Contacts to review' } },
  { src: '/cases/sellup/app-enriquecer.jpg', name: { es: 'Enriquecer contactos', en: 'Enrich contacts' } },
  { src: '/cases/sellup/app-tableros.jpg', name: { es: 'Tableros de uso', en: 'Usage dashboards' } },
]
const STEP_DEG = 360 / SHOTS.length

/**
 * La app real en un carrusel 3D: las pantallas forman un anillo que gira
 * solo; la del frente se ve entera y las demás se alejan y se apagan.
 * Tocar una la trae al frente.
 */
export function AppGallery() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)
  const [inView, setInView] = useState(false)
  /** Pasos girados en total: siempre crece, así el anillo no da la vuelta hacia atrás */
  const [turn, setTurn] = useState(0)
  const [pickedAt, setPickedAt] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(root)
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -20% 0px' })
    io.observe(root)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const wait = Math.max(STEP_MS, pickedAt + RESUME_MS - Date.now())
    const id = window.setTimeout(() => setTurn((n) => n + 1), wait)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, turn, pickedAt])

  const active = ((turn % SHOTS.length) + SHOTS.length) % SHOTS.length
  // Tamaño de cada pantalla y radio del anillo, según el ancho disponible
  const cardW = Math.min(620, width * (width < 640 ? 0.78 : 0.56))
  const cardH = cardW / RATIO
  const radius = cardW / 2 / Math.tan(Math.PI / SHOTS.length) + 30

  const bring = (i: number) => {
    const delta = ((i - active + SHOTS.length) % SHOTS.length)
    setTurn((n) => n + (delta > SHOTS.length / 2 ? delta - SHOTS.length : delta))
    setPickedAt(Date.now())
  }

  /** Gira un paso hacia un lado (−1 anterior, +1 siguiente) */
  const step = (dir: -1 | 1) => {
    setTurn((n) => n + dir)
    setPickedAt(Date.now())
  }
  const arrow = 'absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#0b0d16]/70 text-paper/80 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal'

  return (
    <div ref={rootRef} className="relative">
      <div className="relative mx-auto" style={{ height: cardH + 60, perspective: `${Math.max(1600, radius * 3)}px` }}>
        <div
          className="absolute left-1/2 top-[30px] [transform-style:preserve-3d]"
          style={{ width: cardW, height: cardH, marginLeft: -cardW / 2, transform: `translateZ(${-radius}px) rotateY(${-turn * STEP_DEG}deg)`, transition: reducedMotion ? 'none' : 'transform 1.1s cubic-bezier(.65,0,.35,1)' }}
        >
          {SHOTS.map((shot, i) => {
            const d = Math.min((i - active + SHOTS.length) % SHOTS.length, (active - i + SHOTS.length) % SHOTS.length)
            const front = d === 0
            return (
              <button
                key={shot.src}
                type="button"
                onClick={() => bring(i)}
                aria-label={t(shot.name)}
                aria-current={front}
                className="absolute inset-0 overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] outline-none [backface-visibility:hidden]"
                style={{
                  transform: `rotateY(${i * STEP_DEG}deg) translateZ(${radius}px)`,
                  opacity: front ? 1 : d === 1 ? 0.55 : 0.18,
                  boxShadow: front ? '0 40px 90px -30px rgb(var(--signal) / 0.6)' : 'none',
                  transition: 'opacity .9s, box-shadow .9s',
                }}
              >
                <Image src={shot.src} alt="" fill sizes="(min-width: 1024px) 620px, 80vw" className="object-cover object-top" />
              </button>
            )
          })}
        </div>
        {/* Flechas a los lados para pasar las pantallas */}
        <button type="button" onClick={() => step(-1)} aria-label={t({ es: 'Pantalla anterior', en: 'Previous screen' })} className={`${arrow} left-0 md:left-[4%]`} style={{ marginTop: 15 }}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label={t({ es: 'Pantalla siguiente', en: 'Next screen' })} className={`${arrow} right-0 md:right-[4%]`} style={{ marginTop: 15 }}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Qué pantalla está al frente, y un punto por pantalla */}
      <p key={active} aria-live="polite" className="su-fade mt-6 text-center text-sm text-paper/75">{t(SHOTS[active].name)}</p>
      <div className="mt-4 flex justify-center gap-2">
        {SHOTS.map((shot, i) => (
          <button key={shot.src} type="button" onClick={() => bring(i)} aria-label={t(shot.name)} className="grid h-5 w-5 place-items-center outline-none">
            <span className={`block rounded-full transition-all duration-500 ${i === active ? 'h-2 w-5 bg-signal' : 'h-1.5 w-1.5 bg-white/30 hover:bg-white/60'}`} />
          </button>
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">{t({ es: 'Capturas reales · nombres de personas desenfocados', en: 'Real screenshots · people’s names blurred' })}</p>
    </div>
  )
}
