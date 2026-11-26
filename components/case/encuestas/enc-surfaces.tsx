'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'
import { useAutoplay } from '../objetivos/use-autoplay'
import { useMedia, TABLET_QUERY } from '../objetivos/use-media'
import { SurfacesPhone } from './phone/surfaces-phone'

/** Las seis superficies del producto, cada una con su captura real */
const SURFACES: readonly { id: string; name: L; shot: ShotKey; line: L }[] = [
  { id: 'inicio', name: { es: 'Inicio', en: 'Home' }, shot: 'lista', line: { es: 'Lo que necesita atención hoy, antes que la lista entera.', en: 'What needs attention today, before the whole list.' } },
  { id: 'crear', name: { es: 'Crear', en: 'Create' }, shot: 'participantes', line: { es: 'Cinco pasos con candado: a quién se le pregunta va antes que qué.', en: 'Five locked steps: who you ask comes before what.' } },
  { id: 'secciones', name: { es: 'Secciones', en: 'Sections' }, shot: 'secciones', line: { es: 'Hasta tres niveles, numerados solos, con el resumen vivo al lado.', en: 'Up to three levels, auto-numbered, with the live summary alongside.' } },
  { id: 'historico', name: { es: 'Histórico', en: 'History' }, shot: 'cargarEstructura', line: { es: 'Subir el archivo, confirmar lo detectado y cargarlo en segundo plano.', en: 'Upload the file, confirm what was detected, load it in the background.' } },
  { id: 'responder', name: { es: 'Responder', en: 'Answer' }, shot: 'previewPreguntas', line: { es: 'Una página por tema y el avance siempre a la vista.', en: 'One page per topic and progress always in view.' } },
  { id: 'resultados', name: { es: 'Resultados', en: 'Results' }, shot: 'heatmap', line: { es: 'El grupo bajo el mínimo se ve con candado, nunca con un número.', en: 'A group below the minimum shows a lock, never a number.' } },
]
const STEP_MS = 3800
/** Grados entre una pantalla y la siguiente en el anillo */
const STEP_DEG = 360 / SURFACES.length
/** Ancho de cada pantalla respecto del escenario, y proporción de las capturas */
const PANEL = 0.62
const SHOT_RATIO = 1403 / 900

/**
 * Forma: el producto real como un anillo 3D de seis pantallas que gira para
 * traer cada superficie al frente. Gira solo; tocar un nodo (o una pantalla)
 * lleva a esa superficie.
 */
export function EncSurfaces() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [hold, setHold] = useState(false)
  const wide = useMedia(TABLET_QUERY)
  const { index, go } = useAutoplay(rootRef, { count: SURFACES.length, ms: STEP_MS, loop: true, disabled: reducedMotion, hold })
  const fill = index / (SURFACES.length - 1)
  const stageRef = useRef<HTMLDivElement>(null)
  const [stageW, setStageW] = useState(0)
  /** Vueltas acumuladas: el anillo siempre gira por el camino corto */
  const [turn, setTurn] = useState(0)
  const panelW = stageW * PANEL
  const panelH = panelW / SHOT_RATIO
  /** Distancia del centro del anillo a cada pantalla (apotema del hexágono) */
  const radius = panelW / 2 / Math.tan(Math.PI / SURFACES.length)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setStageW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setTurn((prev) => {
      const n = SURFACES.length
      const cur = ((prev % n) + n) % n
      let d = index - cur
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
      return prev + d
    })
  }, [index])

  if (!wide) {
    return (
      <div ref={rootRef}>
        <SurfacesPhone surfaces={SURFACES} index={index} go={go} reducedMotion={reducedMotion} />
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative mt-6" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      {/* Las capturas en un anillo 3D: gira para traer cada superficie al frente */}
      <div ref={stageRef} className="relative mx-auto w-full max-w-[1100px] overflow-hidden" style={{ height: panelH * 1.3 || undefined, aspectRatio: panelH ? undefined : '16 / 8', perspective: '2200px', maskImage: 'linear-gradient(90deg, transparent, black 14%, black 86%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 14%, black 86%, transparent)' }}>
        <div
          className="absolute left-1/2 top-[8%]"
          style={{
            width: panelW,
            height: panelH,
            marginLeft: -panelW / 2,
            transformStyle: 'preserve-3d',
            transform: `translateZ(${-radius}px) rotateX(-4deg) rotateY(${-turn * STEP_DEG}deg)`,
            transition: reducedMotion ? 'none' : 'transform 1200ms cubic-bezier(.65,0,.35,1)',
          }}
        >
          {SURFACES.map((sf, i) => {
            const shot = SHOTS[sf.shot]
            const on = i === index
            return (
              <button
                type="button"
                key={sf.id}
                onClick={() => go(i)}
                aria-label={t(sf.name)}
                aria-pressed={on}
                tabIndex={-1}
                className="absolute inset-0 overflow-hidden rounded-xl bg-white outline-none transition-[opacity,filter] duration-700"
                style={{
                  transform: `rotateY(${i * STEP_DEG}deg) translateZ(${radius}px)`,
                  opacity: on ? 1 : 0.38,
                  filter: on ? 'none' : 'saturate(0.6)',
                  boxShadow: on ? '0 50px 120px -40px rgb(var(--signal) / 0.7)' : 'none',
                }}
              >
                <Image src={shot.src} width={shot.width} height={shot.height} alt={t(shot.alt)} sizes="(min-width: 1024px) 700px, 70vw" className="h-full w-full object-cover object-left-top" />
              </button>
            )
          })}
        </div>
      </div>

      <p key={index} className="obj-fade mx-auto mt-8 min-h-[3.5rem] max-w-[56ch] text-balance text-center text-[clamp(1.05rem,0.95rem+0.5vw,1.35rem)] font-light leading-snug" aria-live="polite">
        {t(SURFACES[index].line)}
      </p>

      {/* La fibra con un nodo por superficie */}
      <ol className="relative mx-auto mt-6 grid max-w-[900px] grid-cols-6">
        <span aria-hidden="true" className="absolute inset-x-[8.33%] top-[7px] h-px bg-white/12" />
        <span aria-hidden="true" className="absolute left-[8.33%] top-[7px] h-px w-[83.33%] origin-left bg-gradient-to-r from-signal via-[rgb(var(--glow))] to-[rgb(var(--spark))] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-700 ease-expo" style={{ transform: `scaleX(${fill})` }} />
        {SURFACES.map((s, i) => {
          const on = i === index
          return (
            <li key={s.id} className="relative flex flex-col items-center">
              <button type="button" onClick={() => go(i)} aria-pressed={on} className="group flex flex-col items-center outline-none">
                <span className="relative grid h-3.5 w-3.5 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]' : i < index ? 'border-white/60 bg-signal' : 'border-white/35 bg-void'}`} />
                  {on && <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                  {/* De «Resultados» sale la fibra hacia «IA en el proceso» */}
                  {i === SURFACES.length - 1 && <span data-fiber-from="enc-ia" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className={`mt-3 text-[11px] transition-opacity sm:text-[13px] ${on ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}>{t(s.name)}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
