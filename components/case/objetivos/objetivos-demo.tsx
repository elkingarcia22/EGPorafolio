'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { RecordModal } from '@/components/case/kit/record-modal'
import { CaseLead } from '@/components/case/case-lead'
import { useAutoplay } from './use-autoplay'

/** El staging público del playground de UBITS; `ver=backlog` abre el alcance completo y `marcas=no` quita los chips «Nuevo». */
const DEMO_URL = 'https://staging-playground.ubits.co/admin/desempeno-cultura/objetivos?ver=backlog&marcas=no'

/**
 * Igual que la demo de Encuestas: el playground se dibuja a 1.199 px (justo bajo el `NARROW_WINDOW`
 * de su RootLayout, así el menú queda plegado en el riel de 72 px) y se escala a todo el modal. El
 * riel y la barra superior (60 px) se ven, pero una capa encima no deja navegar: solo Objetivos.
 */
const RAIL = 72
const TOPBAR = 60
const NARROW_WINDOW = 1200
const PHONE_MAX = 600

function ModuleOnly() {
  const { t } = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // En teléfono (hasta 600 px, donde el playground ya no muestra el riel) se dibuja a su tamaño real,
  // con su propia vista móvil, sin escalar, para que se lea. Más ancho, la vista de escritorio escalada.
  const phone = !!size && size.w <= PHONE_MAX
  const width = phone && size ? size.w : size && size.w < 768 ? 1024 : NARROW_WINDOW - 1
  const scale = size ? size.w / width : 1
  const height = size ? size.h / scale : 800
  const rail = phone ? 0 : RAIL

  return (
    <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-white">
      {!loaded && (
        <p className="absolute inset-0 flex items-center justify-center gap-3 font-mono text-xs text-[#5c646f]" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0c5bef] border-t-transparent" />
          {t({ es: 'Abriendo Objetivos…', en: 'Opening Goals…' })}
        </p>
      )}
      {size && (
        <iframe
          src={DEMO_URL}
          title={t({ es: 'Objetivos de UBITS, en vivo', en: 'UBITS Goals, live' })}
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500"
          style={{ width, height, transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
        />
      )}
      {/* Capas invisibles sobre el riel y la barra superior: se ven, pero no llevan a otros productos. */}
      {size && (
        <>
          {rail > 0 && <span className="absolute left-0 top-0 h-full cursor-not-allowed" style={{ width: rail * scale }} aria-hidden="true" />}
          <span className="absolute right-0 top-0 cursor-not-allowed" style={{ left: rail * scale, height: TOPBAR * scale }} aria-hidden="true" />
        </>
      )}
    </div>
  )
}

/** Lo que la cámara visita en la pantalla real (centro en % de la captura) y cuánto se acerca. */
const SPOTS: readonly { x: number; y: number; zoom: number; label: L }[] = [
  { x: 50, y: 50, zoom: 1, label: { es: 'El inicio de Objetivos', en: 'Goals home' } },
  { x: 88, y: 11, zoom: 2.2, label: { es: 'Crear un ciclo', en: 'Create a cycle' } },
  { x: 60, y: 28, zoom: 1.3, label: { es: 'Lo que hay que atender', en: 'What needs attention' } },
  { x: 60, y: 48, zoom: 1.3, label: { es: 'El pulso de todos los ciclos', en: 'The pulse of every cycle' } },
  { x: 60, y: 84, zoom: 1.3, label: { es: 'La lista de ciclos', en: 'The list of cycles' } },
]
const SPOT_MS = 3600
/** La pantalla llega acostada y lejos, y se endereza frente a la cámara con el scroll */
const ARRIVE = { rotateX: 26, scale: 0.84, y: 60 }

/** Transformación de la cámara: lleva el punto al centro sin dejar ver los bordes de la captura. */
function cameraTransform({ x, y, zoom }: { x: number; y: number; zoom: number }) {
  const limit = ((zoom - 1) / (2 * zoom)) * 100
  const clamp = (v: number) => Math.max(-limit, Math.min(limit, v))
  return `scale(${zoom}) translate(${clamp(50 - x)}%, ${clamp(50 - y)}%)`
}

/**
 * La pantalla real como un portal: la fibra del capítulo baja hasta ella, llega
 * inclinada y se endereza con el scroll, y una cámara recorre sola sus partes
 * (tocar un punto la lleva ahí). El nodo del centro abre el módulo en vivo.
 */
function DemoPortal({ onOpen }: { onOpen: () => void }) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const { index, go } = useAutoplay(rootRef, { count: SPOTS.length, ms: SPOT_MS, loop: true, disabled: reducedMotion })
  const spot = SPOTS[index]

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-portal-thread]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top 95%', end: 'top 55%', scrub: 0.4 } })
      gsap.fromTo(
        '[data-portal-screen]',
        { rotateX: ARRIVE.rotateX, scale: ARRIVE.scale, y: ARRIVE.y, transformPerspective: 1600, transformOrigin: '50% 100%' },
        { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top 80%', end: 'center 55%', scrub: 0.6 } },
      )
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div ref={rootRef} className="relative mx-auto flex max-w-[1040px] flex-col items-center">
      {/* La fibra baja hasta el borde de la pantalla */}
      <span data-portal-thread aria-hidden="true" className="h-20 w-px origin-top bg-gradient-to-b from-white/5 via-signal/70 to-signal shadow-[0_0_10px_rgb(var(--signal)/0.6)]" />
      <span aria-hidden="true" className="relative -mb-[7px] block h-3.5 w-3.5 rounded-full border border-white bg-signal shadow-[0_0_0_6px_rgb(var(--signal)/0.18),0_0_20px_4px_rgb(var(--signal)/0.7)]" />

      <div data-portal-screen className="w-full overflow-hidden rounded-[22px] border border-white/12 bg-[#0d1020] shadow-[0_60px_120px_-50px_rgb(var(--signal)/0.7)]">
        {/* Barra del navegador */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="h-2 w-2 rounded-full bg-white/20" />
            <i className="h-2 w-2 rounded-full bg-white/20" />
            <i className="h-2 w-2 rounded-full bg-white/20" />
          </span>
          <span className="mx-auto truncate rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[10px] text-white/55">ubits · /admin/desempeno-cultura/objetivos</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300/80">
            <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden="true" />
            {t({ es: 'En vivo', en: 'Live' })}
          </span>
        </div>

        {/* La captura con la cámara que la recorre */}
        <div className="relative aspect-[16/10] overflow-hidden bg-white">
          <div
            className="absolute inset-0 transition-transform duration-[1600ms] ease-[cubic-bezier(.65,0,.35,1)]"
            style={{ transform: cameraTransform(spot) }}
          >
            <Image src={OBJ_CASE.form.home.src} alt={t(OBJ_CASE.form.home.alt)} fill sizes="(min-width: 1040px) 1040px, 100vw" className="object-cover" />
            {/* Los puntos que visita la cámara */}
            {SPOTS.map((s, i) =>
              i === 0 ? null : (
                <button
                  key={s.label.es}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={t(s.label)}
                  className="group absolute h-0 w-0"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <span
                    className={`absolute -left-2 -top-2 block h-4 w-4 rounded-full border-2 md:-left-3 md:-top-3 md:h-6 md:w-6 transition-all duration-700 ${i === index ? 'border-[#0c5bef] bg-[#0c5bef]/20 shadow-[0_0_0_6px_rgb(12_91_239/0.18)]' : 'border-[#0c5bef]/60 bg-white/70 group-hover:bg-white'}`}
                    style={{ transform: `scale(${1 / spot.zoom})` }}
                  />
                </button>
              ),
            )}
          </div>
          {/* Viñeta y nombre de lo que mira la cámara */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0d16]/80 via-transparent to-transparent" aria-hidden="true" />
          <p key={index} aria-live="polite" className="obj-fade pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white">
            {t(spot.label)}
          </p>
        </div>
      </div>

      {/* Pasos de la cámara */}
      <div className="mt-5 flex items-center gap-2">
        {SPOTS.map((s, i) => (
          <button
            key={s.label.es}
            type="button"
            onClick={() => go(i)}
            aria-label={t(s.label)}
            aria-pressed={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-signal' : 'w-1.5 bg-white/25 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* La fibra sigue hasta el nodo que abre el módulo */}
      <span aria-hidden="true" className="mt-5 h-12 w-px bg-gradient-to-b from-white/10 to-signal" />
      <button
        type="button"
        onClick={onOpen}
        className="group relative inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.06] py-2 pl-2 pr-5 transition-colors duration-300 hover:border-signal/70 hover:bg-signal/15"
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-signal text-on-signal shadow-[0_0_24px_4px_rgb(var(--signal)/0.6)]">
          <span className="absolute inset-[-6px] rounded-full border border-signal/60 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" aria-hidden="true" />
          <span className="text-sm transition-transform duration-500 ease-expo group-hover:translate-x-0.5" aria-hidden="true">↗</span>
        </span>
        <span className="text-sm">{t({ es: 'Abrir el módulo en vivo', en: 'Open the live module' })}</span>
      </button>
    </div>
  )
}

/** 08 · Demo: la pantalla real como portal y, al tocarlo, el módulo de Objetivos en vivo en el staging. */
export function ObjetivosDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <>
      <CaseLead className="mb-4">{t(OBJ_CASE.demo.lead)}</CaseLead>
      <DemoPortal onOpen={() => setOpen('objetivos')} />
      <RecordModal
        ids={['objetivos']}
        openId={open}
        onOpenChange={setOpen}
        title={t({ es: 'Objetivos · Administrador', en: 'Goals · Admin' })}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c5bef] font-mono text-xs font-semibold text-white">Ob</span>}
        description={t({ es: 'El producto en vivo · el menú y la barra no navegan fuera de Objetivos', en: 'The live product · menu and bar don’t leave Goals' })}
      >
        {open && <ModuleOnly />}
      </RecordModal>
    </>
  )
}
