'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'
import { UBITS_BLUE } from './shared'

/** Un recuadro sobre la captura, en % del tamaño real de la imagen. */
interface Spot {
  x: number
  y: number
  w: number
  h: number
  note: L
}

interface Stop {
  id: string
  label: L
  shot: ShotKey
  spots: readonly Spot[]
}

/** Las seis superficies y, en cada una, lo que la hace ganar (coordenadas medidas sobre las capturas reales). */
const TOUR: readonly Stop[] = [
  {
    id: 'inicio',
    label: { es: 'Inicio', en: 'Home' },
    shot: 'lista',
    spots: [
      { x: 2, y: 25.5, w: 96, h: 18, note: { es: 'Cinco atajos para empezar, con NOM 035 primero', en: 'Five shortcuts to start, NOM 035 first' } },
      { x: 2, y: 45.5, w: 96, h: 19, note: { es: '«Para atender»: lo que necesita una acción hoy', en: '“To address”: what needs action today' } },
    ],
  },
  {
    id: 'crear',
    label: { es: 'Crear', en: 'Create' },
    shot: 'secciones',
    spots: [
      { x: 10, y: 19, w: 82, h: 6.5, note: { es: 'Cinco pasos que se desbloquean en orden', en: 'Five steps that unlock in order' } },
      { x: 10.4, y: 36, w: 57.8, h: 34.5, note: { es: 'Secciones y subsecciones, numeradas solas', en: 'Sections and subsections, numbered automatically' } },
      { x: 68.8, y: 27, w: 23.2, h: 64, note: { es: 'El resumen vivo: cada sección con sus preguntas', en: 'The live summary: each section with its questions' } },
    ],
  },
  {
    id: 'responder',
    label: { es: 'Responder', en: 'Answer' },
    shot: 'previewPreguntas',
    spots: [
      { x: 14.6, y: 32.5, w: 50.5, h: 15.5, note: { es: 'Una página por subsección, escala de cinco puntos', en: 'One page per subsection, five-point scale' } },
      { x: 66.2, y: 13.4, w: 19.4, h: 74.8, note: { es: 'El avance siempre a la vista', en: 'Progress always in view' } },
    ],
  },
  {
    id: 'historico',
    label: { es: 'Histórico', en: 'History' },
    shot: 'cargarEstructura',
    spots: [
      { x: 50.6, y: 33, w: 46.6, h: 21.5, note: { es: 'Los indicadores salen del mismo archivo', en: 'Indicators come from the file itself' } },
      { x: 50.8, y: 66, w: 46.2, h: 16, note: { es: '18 hacen match solos; 4 los decide una persona', en: '18 match on their own; a person decides 4' } },
    ],
  },
  {
    id: 'resultados',
    label: { es: 'Resultados', en: 'Results' },
    shot: 'heatmap',
    spots: [
      { x: 10.4, y: 36, w: 81.6, h: 16, note: { es: 'Favorabilidad, distribución y el área más desfavorable', en: 'Favorability, distribution and the least favorable area' } },
      { x: 73.8, y: 65, w: 18, h: 33, note: { es: 'Bajo el mínimo: candado, nunca un número', en: 'Below the minimum: a lock, never a number' } },
    ],
  },
  {
    id: 'ia',
    label: { es: 'IA', en: 'AI' },
    shot: 'ia',
    spots: [
      { x: 38.8, y: 18, w: 24.6, h: 5.8, note: { es: 'Análisis con IA y accionables, en la misma lectura', en: 'AI analysis and actions, in the same read' } },
      { x: 14, y: 75, w: 77, h: 16.5, note: { es: 'Cada lectura con su evidencia y su confiabilidad', en: 'Each reading with its evidence and confidence' } },
    ],
  },
]

const SPOT_MS = 2800
/** Proporción de la ventana: la de las capturas de 1403 × 900. */
const FRAME_RATIO = 1403 / 900

/** Recorre paradas y recuadros mientras está a la vista; se queda quieto si alguien elige una parada. */
function useTour(box: React.RefObject<HTMLElement | null>) {
  const { reducedMotion } = useA11y()
  const [stop, setStop] = useState(0)
  const [spot, setSpot] = useState(0)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [box])

  const playing = visible && !hover && !reducedMotion
  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => {
      if (spot + 1 < TOUR[stop].spots.length) return setSpot(spot + 1)
      setSpot(0)
      setStop((s) => (s + 1) % TOUR.length)
    }, SPOT_MS)
    return () => window.clearTimeout(id)
  }, [playing, stop, spot])

  const go = (i: number) => {
    setStop(i)
    setSpot(0)
  }
  return { stop, spot, go, setHover, playing }
}

/** La entrada de La forma: el producto real, grande y nítido, con un foco que va señalando lo que gana. */
export function ProductTour() {
  const { t } = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const { stop, spot, go, setHover, playing } = useTour(box)
  const current = TOUR[stop]
  const s = current.spots[spot]
  const below = s.y + s.h < 62

  return (
    <div ref={box} data-reveal className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {/* Paradas, como historias: la barra de la activa se llena con sus recuadros. */}
      <div className="mb-5 grid grid-cols-3 gap-x-3 gap-y-3 sm:grid-cols-6" role="tablist" aria-label={t({ es: 'Superficies del producto', en: 'Product surfaces' })}>
        {TOUR.map((st, i) => (
          <button key={st.id} type="button" role="tab" aria-selected={i === stop} onClick={() => go(i)} className="group text-left">
            <span className="block h-[3px] overflow-hidden rounded-full bg-fg/15">
              <span
                key={`${st.id}-${i === stop ? spot : 'x'}`}
                className="block h-full origin-left rounded-full bg-signal"
                style={
                  i < stop
                    ? { transform: 'scaleX(1)' }
                    : i === stop
                      ? playing
                        ? { transform: `scaleX(${spot / st.spots.length})`, animation: `encf-tourbar ${SPOT_MS}ms linear forwards`, ['--from' as string]: spot / st.spots.length, ['--to' as string]: (spot + 1) / st.spots.length }
                        : { transform: `scaleX(${(spot + 1) / st.spots.length})` }
                      : { transform: 'scaleX(0)' }
                }
              />
            </span>
            <span className={`mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity ${i === stop ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`}>
              {String(i + 1).padStart(2, '0')} · {t(st.label)}
            </span>
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#dfe8fb,#f5f7fc_45%,#e6ecfa)] p-3 shadow-[0_60px_120px_-50px_rgba(12,40,110,0.55)] ring-1 ring-black/[0.06] sm:p-6">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#0c5bef]/15 blur-3xl" aria-hidden="true" />
        <div className="relative overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
          <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7fb] px-3 py-2" aria-hidden="true">
            <span className="flex gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="ml-2 min-w-0 truncate rounded-md bg-white px-2 py-0.5 font-mono text-[10px] text-black/45">ubits.co/admin/encuestas · {t(current.label)}</span>
          </div>

          <div className="relative overflow-hidden bg-white" style={{ aspectRatio: FRAME_RATIO }}>
            {TOUR.map((st, i) => {
              const shot = SHOTS[st.shot]
              const on = i === stop
              const focus = on ? s : st.spots[0]
              // Si la captura es más alta que la ventana, sube lo justo para que el recuadro activo quede a la vista.
              const visiblePct = Math.min(1, shot.width / shot.height / FRAME_RATIO) * 100
              const shift = Math.max(0, Math.min(100 - visiblePct, focus.y + focus.h + 5 - visiblePct))
              return (
                <div key={st.id} className="absolute inset-x-0 top-0 transition-opacity duration-700" style={{ opacity: on ? 1 : 0 }} aria-hidden={!on}>
                  {/* La captura con su proporción real; el acercamiento sigue al recuadro activo. */}
                  <div
                    className="relative w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ aspectRatio: `${shot.width} / ${shot.height}`, transform: `translateY(-${shift}%) ${on ? 'scale(1.03)' : 'scale(1)'}`, transformOrigin: `${focus.x + focus.w / 2}% ${focus.y + focus.h / 2}%` }}
                  >
                    <Image src={shot.src} width={shot.width} height={shot.height} alt={on ? t(shot.alt) : ''} sizes="(min-width: 1280px) 1200px, (min-width: 768px) 80vw, 100vw" quality={90} priority={i === 0} className="block h-auto w-full" />
                    {on && (
                      <span
                        className="pointer-events-none absolute rounded-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`, boxShadow: `0 0 0 2px ${UBITS_BLUE}, 0 0 0 7px rgba(12,91,239,0.18), 0 0 0 9999px rgba(15,23,42,0.38)` }}
                        aria-hidden="true"
                      />
                    )}
                    {on && (
                      <span
                        key={`${stop}-${spot}`}
                        className="enc-fade absolute z-10 hidden w-[18rem] rounded-xl bg-[#0f172a] px-4 py-3 text-sm leading-snug text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] md:block"
                        style={{ left: `min(${s.x}%, calc(100% - 19rem))`, top: below ? `calc(${s.y + s.h}% + 14px)` : undefined, bottom: below ? undefined : `calc(${100 - s.y}% + 14px)` }}
                      >
                        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#8fb3ff]">{String(spot + 1).padStart(2, '0')} / {String(current.spots.length).padStart(2, '0')}</span>
                        {t(s.note)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </div>

      {/* En pantallas chicas la nota va debajo de la ventana. */}
      <p key={`m-${stop}-${spot}`} className="enc-fade mt-4 text-sm leading-snug md:hidden">
        <span className="mr-2 font-mono text-[10px] text-signal">{String(spot + 1).padStart(2, '0')}/{String(current.spots.length).padStart(2, '0')}</span>
        {t(s.note)}
      </p>
    </div>
  )
}
