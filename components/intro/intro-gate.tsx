'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, getLenis } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { readSession, writeSession } from '@/lib/storage'
import { COPY } from '@/lib/content/copy'
import { PROFILE } from '@/lib/content/profile'

const SEEN_KEY = 'eg.intro-seen'
const NOISE_W = 160
const NOISE_H = 100

/** Estática de TV dibujada a baja resolución y escalada (pixelada). */
function useStatic(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const image = ctx.createImageData(NOISE_W, NOISE_H)
    let frame = 0
    let tick = 0
    const draw = () => {
      tick++
      if (tick % 2 === 0) {
        for (let i = 0; i < image.data.length; i += 4) {
          const v = Math.random() * 255
          image.data[i] = v
          image.data[i + 1] = v
          image.data[i + 2] = v
          image.data[i + 3] = 255
        }
        ctx.putImageData(image, 0, 0)
      }
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [canvasRef, active])
}

/**
 * Umbral de entrada: estática + contador de años de carrera (2014 → 2026).
 * Al "sintonizar", la estática se abre en barras y aparece el sitio.
 * Se muestra una vez por sesión.
 */
export function IntroGate() {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const [open, setOpen] = useState(true)
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const yearRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useStatic(canvasRef, open && !reducedMotion)

  useEffect(() => {
    if (readSession(SEEN_KEY)) {
      setOpen(false)
      return
    }
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const counter = { year: PROFILE.startYear }
    const tween = gsap.to(counter, {
      year: PROFILE.currentYear,
      duration: reducedMotion ? 0 : 2.2,
      ease: 'power2.inOut',
      delay: reducedMotion ? 0 : 0.4,
      onUpdate: () => {
        if (yearRef.current) yearRef.current.textContent = String(Math.round(counter.year))
      },
      onComplete: () => setReady(true),
    })
    return () => {
      tween.kill()
    }
  }, [reducedMotion])

  useEffect(() => {
    if (ready) buttonRef.current?.focus()
  }, [ready])

  const release = () => {
    writeSession(SEEN_KEY, '1')
    document.documentElement.style.overflow = ''
    getLenis()?.start()
    setOpen(false)
  }

  const tuneIn = () => {
    const root = rootRef.current
    if (!root || reducedMotion) {
      release()
      return
    }
    const q = gsap.utils.selector(root)
    gsap
      .timeline({ onComplete: release })
      .to(q('[data-gate-content]'), { autoAlpha: 0, scale: 0.96, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in' })
      .to(q('canvas'), { autoAlpha: 0, duration: 0.3 }, '<0.1')
      .to(q('[data-gate-bar]'), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.8, ease: 'expo.inOut', stagger: 0.06 }, '<')
  }

  if (!open) return null

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label="Intro" className="fixed inset-0 z-[65] text-paper">
      <div className="absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} data-gate-bar className="h-full flex-1 bg-void" />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={NOISE_W}
        height={NOISE_H}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.13] [image-rendering:pixelated]"
      />

      <div data-gate-content className="relative flex h-full flex-col justify-between px-[var(--gutter)] py-8">
        <div className="flex items-start justify-between">
          <p className="mono-label caret opacity-70">{t(COPY.intro.searching)}</p>
          <p className="mono-label opacity-40">EG · FM 88.0</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="mono-label mb-4 opacity-50">{t(COPY.intro.years)}</p>
          <span
            ref={yearRef}
            className="text-[clamp(5rem,2rem+16vw,16rem)] font-light leading-none tabular-nums tracking-tight"
          >
            {PROFILE.startYear}
          </span>
          <p className="mt-4 max-w-xs text-sm opacity-60">{t(COPY.intro.hint)}</p>
        </div>

        <div className="flex justify-center">
          <button
            ref={buttonRef}
            type="button"
            onClick={tuneIn}
            data-cursor="▸"
            className={`group flex items-center gap-4 border border-paper/40 px-8 py-4 transition-all duration-500 hover:border-signal hover:bg-signal ${ready ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <span className="brand-title text-sm">{t(COPY.intro.tune)}</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">▸</span>
          </button>
        </div>
      </div>
    </div>
  )
}
