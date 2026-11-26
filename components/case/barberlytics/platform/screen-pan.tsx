'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import type { Callout } from '@/components/case/kit/device'
import type { CaseImage } from '@/lib/content/cases/barberlytics/types'
import { useSwipe } from '@/components/case/kit/use-swipe'
import { useInView } from './use-auto-steps'

/** Alto de la ventana por la que se mira la captura (px) */
const VIEW_H = 320
/** Ancho máximo al que se dibuja la captura antes de acercarla (px) */
const MAX_BASE_W = 1400
/** No se acerca más que esto (la captura empezaría a verse borrosa) */
const MAX_ZOOM = 1.15
/** Cada cuánto pasa sola a la siguiente parte */
const NEXT_MS = 3600

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

interface ScreenPanProps {
  image: CaseImage
  callouts: readonly Callout[]
  name: string
}

/**
 * Una pantalla real en el teléfono: primero entera, después una cámara que
 * se acerca a cada parte que conviene mirar, con su explicación debajo en
 * texto de verdad. Pasa sola; deslizar de lado elige otra parte.
 */
export function ScreenPan({ image, callouts, name }: ScreenPanProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [vw, setVw] = useState(0)
  const [stop, setStop] = useState(0)
  const [auto, setAuto] = useState(true)
  const stops = callouts.length + 1
  const go = (dir: 1 | -1) => {
    setAuto(false)
    setStop((s) => (s + dir + stops) % stops)
  }
  useSwipe(viewRef, { onNext: () => go(1), onPrev: () => go(-1) })

  useLayoutEffect(() => {
    const el = viewRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setVw(el.clientWidth))
    ro.observe(el)
    setVw(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!auto || !inView || reducedMotion) return
    const id = window.setTimeout(() => setStop((s) => (s + 1) % stops), stop === 0 ? NEXT_MS + 800 : NEXT_MS)
    return () => window.clearTimeout(id)
  }, [auto, inView, reducedMotion, stop, stops])

  const bw = Math.min(MAX_BASE_W, image.width)
  const bh = (bw * image.height) / image.width
  const fit = vw ? Math.min(vw / bw, VIEW_H / bh) : 0
  const c = stop > 0 ? callouts[stop - 1] : null

  // A qué escala y dónde: entera, o acercada a la parte en curso
  let s = fit
  let tx = (vw - bw * fit) / 2
  let ty = (VIEW_H - bh * fit) / 2
  if (c && vw) {
    const rw = (c.w / 100) * bw
    const rh = (c.h / 100) * bh
    s = clamp(Math.min((0.86 * vw) / rw, (0.7 * VIEW_H) / rh), fit, MAX_ZOOM)
    const cx = ((c.x + c.w / 2) / 100) * bw * s
    const cy = ((c.y + c.h / 2) / 100) * bh * s
    tx = clamp(vw / 2 - cx, Math.min(0, vw - bw * s), 0)
    ty = clamp(VIEW_H / 2 - cy, Math.min(0, VIEW_H - bh * s), 0)
  }
  const ring = c ? { left: tx + (c.x / 100) * bw * s, top: ty + (c.y / 100) * bh * s, width: (c.w / 100) * bw * s, height: (c.h / 100) * bh * s } : null

  return (
    <div ref={rootRef}>
      <div ref={viewRef} className="relative overflow-hidden rounded-2xl bg-[#0b0c0e] shadow-[0_40px_80px_-35px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)]" style={{ height: VIEW_H }}>
        <div
          className="absolute left-0 top-0 origin-top-left transition-transform duration-[1000ms] ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none"
          style={{ width: bw, height: bh, transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s || 0.001})` }}
        >
          <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes="1200px" className="block h-full w-full" />
        </div>
        {/* La parte que se está mirando, marcada encima */}
        {ring && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute rounded-lg ring-2 ring-signal shadow-[0_0_0_9999px_rgba(8,8,10,0.35)] transition-all duration-[1000ms] ease-[cubic-bezier(.65,0,.35,1)]"
            style={{ left: ring.left - 4, top: ring.top - 4, width: ring.width + 8, height: ring.height + 8 }}
          />
        )}
      </div>

      {/* Lo que dice la parte en curso, en texto legible */}
      <div key={stop} aria-live="polite" className="pl-fade mt-5 flex min-h-[5.5rem] gap-3">
        {c ? (
          <>
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-[12px] text-on-signal">{stop}</span>
            <span className="flex flex-col">
              <span className="text-[16px] leading-snug">{t(c.title)}</span>
              <span className="mt-1 text-[14px] leading-relaxed text-paper/65">{t(c.body)}</span>
            </span>
          </>
        ) : (
          <span className="flex flex-col">
            <span className="text-[16px] leading-snug">{name}</span>
            <span className="mt-1 font-mono text-[11px] text-paper/45">{t({ es: `${callouts.length} partes · pasan solas, o desliza`, en: `${callouts.length} parts · they play on their own, or swipe` })}</span>
          </span>
        )}
      </div>

      <ol className="mt-2 flex items-center justify-center gap-1" aria-hidden="true">
        {Array.from({ length: stops }, (_, i) => (
          <li key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === stop ? 'w-5 bg-signal' : 'w-1.5 bg-white/25'}`} />
        ))}
      </ol>
    </div>
  )
}
