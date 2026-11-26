'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'

/** Cada cuánto pasa a la pantalla siguiente (ms) */
const STEP_MS = 3800
/** Si la persona elige una, espera esto antes de seguir sola (ms) */
const RESUME_MS = 9000
/** Proporción del marco de cada pantalla (ancho / alto) */
const RATIO = 1.45
/** Cuántas pantallas se ven a cada lado de la del frente */
const SIDE = 3

interface Shot {
  src: string
  name: L
}

/** Capturas reales de SellUp en Producción (nov. 2026). Los nombres de personas van desenfocados. */
const SHOTS: readonly Shot[] = [
  { src: '/cases/sellup/app-flujo.jpg', name: { es: 'Flujo de prospección · recorrido', en: 'Prospecting flow · walkthrough' } },
  { src: '/cases/sellup/app-tablero.jpg', name: { es: 'Flujo de prospección · tablero', en: 'Prospecting flow · board' } },
  { src: '/cases/sellup/app-empresas.jpg', name: { es: 'Lista de empresas', en: 'Company list' } },
  { src: '/cases/sellup/app-ficha-empresa.jpg', name: { es: 'Ficha de una empresa', en: 'Company record' } },
  { src: '/cases/sellup/app-rumbo.jpg', name: { es: 'Rumbo, dentro de la lista', en: 'Rumbo, inside the list' } },
  { src: '/cases/sellup/app-contactos.jpg', name: { es: 'Contactos por revisar', en: 'Contacts to review' } },
  { src: '/cases/sellup/app-ficha-contacto.jpg', name: { es: 'Ficha de un contacto', en: 'Contact record' } },
  { src: '/cases/sellup/app-enriquecer.jpg', name: { es: 'Enriquecer contactos', en: 'Enrich contacts' } },
  { src: '/cases/sellup/app-tableros.jpg', name: { es: 'Tableros', en: 'Dashboards' } },
  { src: '/cases/sellup/app-uso.jpg', name: { es: 'Uso de IA, costos y efectividad', en: 'AI usage, cost and effectiveness' } },
  { src: '/cases/sellup/app-mapa-uso.jpg', name: { es: 'Mapa de uso por rol', en: 'Usage map by role' } },
  { src: '/cases/sellup/app-catalogo.jpg', name: { es: 'Catálogo de fuentes', en: 'Source catalog' } },
  { src: '/cases/sellup/app-cotizador.jpg', name: { es: 'Cotizador', en: 'Quote builder' } },
  { src: '/cases/sellup/app-roi.jpg', name: { es: 'Calculadora de ROI', en: 'ROI calculator' } },
  { src: '/cases/sellup/app-usuarios.jpg', name: { es: 'Usuarios y acceso', en: 'Users and access' } },
  { src: '/cases/sellup/app-comentarios.jpg', name: { es: 'Comentarios y alertas', en: 'Comments and alerts' } },
]
const N = SHOTS.length

/** Distancia con signo más corta de `i` a `active` en el anillo (−N/2 … N/2) */
const offsetOf = (i: number, active: number) => {
  const d = (((i - active) % N) + N) % N
  return d > N / 2 ? d - N : d
}

/**
 * La app real en un carrusel 3D: la pantalla del frente se ve entera y las
 * vecinas se alejan giradas hacia atrás, a cada lado. Pasa sola; las flechas,
 * los puntos o tocar una pantalla la traen al frente.
 */
export function AppGallery() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
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
    const id = window.setTimeout(() => setActive((a) => (a + 1) % N), wait)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, active, pickedAt])

  const go = (i: number) => {
    setActive(((i % N) + N) % N)
    setPickedAt(Date.now())
  }

  const narrow = width < 640
  const cardW = Math.min(680, width * (narrow ? 0.8 : 0.58))
  const cardH = cardW / RATIO
  /** Cuánto se corre cada vecina hacia el costado */
  const shift = cardW * (narrow ? 0.42 : 0.5)
  const arrow = 'absolute top-1/2 z-[60] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#0b0d16]/70 text-paper/80 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal'

  return (
    <div ref={rootRef} className="relative">
      <div className="relative mx-auto" style={{ height: cardH + 60, perspective: '1800px' }}>
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {SHOTS.map((shot, i) => {
            const d = offsetOf(i, active)
            const a = Math.abs(d)
            const visible = a <= SIDE
            const front = d === 0
            return (
              <button
                key={shot.src}
                type="button"
                tabIndex={visible ? 0 : -1}
                onClick={() => go(i)}
                aria-label={t(shot.name)}
                aria-current={front}
                className="absolute left-1/2 top-[30px] overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] outline-none"
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  zIndex: 50 - a,
                  opacity: visible ? (front ? 1 : a === 1 ? 0.6 : a === 2 ? 0.3 : 0.12) : 0,
                  pointerEvents: visible ? 'auto' : 'none',
                  transform: `translateX(${d * shift}px) translateZ(${-a * 160}px) rotateY(${d === 0 ? 0 : d > 0 ? -38 : 38}deg)`,
                  boxShadow: front ? '0 40px 90px -30px rgb(var(--signal) / 0.6)' : 'none',
                  transition: reducedMotion ? 'none' : 'transform .9s cubic-bezier(.65,0,.35,1), opacity .9s, box-shadow .9s',
                }}
              >
                {a <= SIDE + 1 && <Image src={shot.src} alt="" fill sizes="(min-width: 1024px) 680px, 80vw" className="object-cover object-top" />}
              </button>
            )
          })}
        </div>
        {/* Flechas a los lados para pasar las pantallas */}
        <button type="button" onClick={() => go(active - 1)} aria-label={t({ es: 'Pantalla anterior', en: 'Previous screen' })} className={`${arrow} left-0 md:left-[3%]`} style={{ marginTop: 15 }}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => go(active + 1)} aria-label={t({ es: 'Pantalla siguiente', en: 'Next screen' })} className={`${arrow} right-0 md:right-[3%]`} style={{ marginTop: 15 }}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Qué pantalla está al frente, cuál de cuántas, y un punto por pantalla */}
      <p key={active} aria-live="polite" className="su-fade mt-6 text-center text-sm text-paper/75">
        {t(SHOTS[active].name)}
        <span className="ml-2 font-mono text-[11px] text-paper/35 tabular-nums">{String(active + 1).padStart(2, '0')} / {N}</span>
      </p>
      <div className="mx-auto mt-4 flex max-w-[90%] flex-wrap justify-center gap-1">
        {SHOTS.map((shot, i) => (
          <button key={shot.src} type="button" onClick={() => go(i)} aria-label={t(shot.name)} className="grid h-5 w-4 place-items-center outline-none">
            <span className={`block rounded-full transition-all duration-500 ${i === active ? 'h-2 w-4 bg-signal' : 'h-1.5 w-1.5 bg-white/30 hover:bg-white/60'}`} />
          </button>
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">{t({ es: 'Capturas reales · nombres de personas desenfocados', en: 'Real screenshots · people’s names blurred' })}</p>
    </div>
  )
}
