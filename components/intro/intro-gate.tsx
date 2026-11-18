'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, getLenis } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { readSession, writeSession } from '@/lib/storage'
import { COPY } from '@/lib/content/copy'
import { drawOscilloscope } from './oscilloscope'

const SEEN_KEY = 'eg.intro-seen'
const FREQ_START = 88.0
const FREQ_END = 104.6
const MIN_DURATION_S = 2.4

function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) getLenis()?.stop()
  else getLenis()?.start()
}

/**
 * Entrada "osciloscopio": una línea de ruido que, mientras carga el sitio,
 * se calma hasta volverse una señal recta. Luego la pantalla se abre en
 * dos mitades desde esa línea. Se muestra una vez por sesión.
 */
export function IntroGate() {
  const { reducedMotion } = useA11y()
  const { t } = useLocale()
  const [open, setOpen] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)
  const freqRef = useRef<HTMLSpanElement>(null)
  const phaseRef = useRef<HTMLSpanElement>(null)
  const state = useRef({ progress: 0, done: false })
  const timeline = useRef<gsap.core.Timeline | null>(null)

  const release = () => {
    if (state.current.done) return
    state.current.done = true
    writeSession(SEEN_KEY, '1')
    lockScroll(false)
    setOpen(false)
  }

  const reveal = () => {
    const root = rootRef.current
    if (!root) return release()
    timeline.current?.kill()
    const q = gsap.utils.selector(root)
    gsap
      .timeline({ onComplete: release })
      .to(q('[data-intro-ui]'), { autoAlpha: 0, duration: 0.3 })
      .to(q('[data-half="top"]'), { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '+=0.15')
      .to(q('[data-half="bottom"]'), { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<')
      .to(q('canvas'), { scaleX: 1.2, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, '<0.2')
  }

  // Arranque: ¿ya se vio en esta sesión? ¿movimiento reducido?
  useEffect(() => {
    if (readSession(SEEN_KEY) || reducedMotion) {
      writeSession(SEEN_KEY, '1')
      setOpen(false)
      return
    }
    lockScroll(true)

    const s = state.current
    const update = () => {
      const p = s.progress
      if (percentRef.current) percentRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      if (freqRef.current) freqRef.current.textContent = (FREQ_START + (FREQ_END - FREQ_START) * p).toFixed(1)
      if (phaseRef.current) phaseRef.current.dataset.signal = p > 0.92 ? 'true' : 'false'
    }

    // El avance real espera a las fuentes; nunca dura menos de MIN_DURATION_S.
    const tl = gsap.timeline()
    tl.to(s, { progress: 0.86, duration: MIN_DURATION_S - 0.6, ease: 'power1.inOut' })
    tl.to(s, { progress: 1, duration: 0.6, ease: 'power2.out', onComplete: () => reveal() })
    timeline.current = tl

    let fontsReady = false
    document.fonts?.ready.then(() => {
      fontsReady = true
      if (tl.paused()) tl.play()
    })
    tl.eventCallback('onUpdate', () => {
      update()
      if (s.progress >= 0.86 && !fontsReady) tl.pause()
    })

    return () => {
      tl.kill()
      lockScroll(false)
    }
    // reveal/release usan refs: no deben reiniciar la animación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  // Bucle de dibujo del osciloscopio.
  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio, 2)
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)
    const styles = getComputedStyle(document.documentElement)
    const colors = {
      line: `rgb(${styles.getPropertyValue('--paper').trim()})`,
      accent: `rgb(${styles.getPropertyValue('--signal').trim()})`,
    }
    let frame = 0
    const start = performance.now()
    const loop = (now: number) => {
      drawOscilloscope(ctx, canvas.width, canvas.height, state.current.progress, (now - start) / 1000, colors)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [open])

  if (!open) return null

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label={t(COPY.intro.searching)} className="fixed inset-0 z-[65] text-paper">
      <div data-half="top" className="absolute inset-x-0 top-0 h-1/2 bg-void" aria-hidden="true" />
      <div data-half="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-void" aria-hidden="true" />

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[46vh] w-full -translate-y-1/2" />

      <div data-intro-ui className="relative flex h-full flex-col justify-between px-[var(--gutter)] py-8">
        <div className="flex items-start justify-between">
          <p className="mono-label caret opacity-70">{t(COPY.intro.searching)}</p>
          <p className="mono-label tabular-nums opacity-70">
            FM <span ref={freqRef}>{FREQ_START.toFixed(1)}</span> MHz
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <span
              ref={phaseRef}
              data-signal="false"
              className="mono-label mb-3 flex items-center gap-2 opacity-60 [&[data-signal=true]]:text-signal [&[data-signal=true]]:opacity-100"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              {t(COPY.intro.noise)} → {t(COPY.intro.signal)}
            </span>
            <span ref={percentRef} className="block text-[clamp(4rem,2rem+8vw,9rem)] font-light leading-none tabular-nums tracking-tight">
              000
            </span>
          </div>
          <div className="flex flex-col items-end gap-4 text-right">
            <p className="hidden max-w-[16rem] text-sm opacity-50 sm:block">{t(COPY.intro.hint)}</p>
            <button type="button" onClick={reveal} className="mono-label border-b border-paper/30 pb-1 opacity-60 transition-opacity hover:opacity-100">
              {t(COPY.intro.skip)} →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
