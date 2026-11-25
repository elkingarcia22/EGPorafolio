'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'
import { useAutoplay } from '../objetivos/use-autoplay'

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

/**
 * 05 · Forma: el producto real, superficie por superficie, sobre una sola
 * fibra. La captura cambia sola; tocar un nodo lleva a esa superficie.
 */
export function EncSurfaces() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const [hold, setHold] = useState(false)
  const { index, go } = useAutoplay(rootRef, { count: SURFACES.length, ms: STEP_MS, loop: true, disabled: reducedMotion, hold })
  const fill = index / (SURFACES.length - 1)

  return (
    <div ref={rootRef} className="relative mt-6" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      {/* Las capturas, una encima de otra: cambia la que se ve */}
      <div className="relative mx-auto w-full max-w-[min(880px,calc((100svh-16rem)*1.56))]" style={{ aspectRatio: '1403 / 900' }}>
        {SURFACES.map((s, i) => {
          const shot = SHOTS[s.shot]
          const on = i === index
          return (
            <Image
              key={s.id}
              src={shot.src}
              width={shot.width}
              height={shot.height}
              alt={t(shot.alt)}
              sizes="(min-width: 1024px) 880px, 100vw"
              aria-hidden={!on}
              className="absolute inset-0 h-full w-full rounded-xl bg-white object-cover object-left-top shadow-[0_40px_100px_-40px_rgb(var(--signal)/0.55)] transition-[opacity,transform] duration-700 ease-expo"
              style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(10px) scale(0.99)' }}
            />
          )
        })}
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
