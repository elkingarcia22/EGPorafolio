'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'

/** Encuentra, dentro del constructor, el botón que toca el paso del guion. */
type Target = (box: HTMLElement) => HTMLElement | null

const at = (selector: string): Target => (box) => box.querySelector<HTMLElement>(selector)
/** Un botón de la última sección raíz (la que la demo acaba de crear). */
const inLastRoot = (act: string): Target => (box) => {
  const roots = box.querySelectorAll<HTMLElement>('li[data-depth="1"]')
  return roots[roots.length - 1]?.querySelector<HTMLElement>(`[data-act^="${act}:"]`) ?? null
}

/**
 * El guion: sube «Reconocimiento», le suma una pregunta, choca con el tope de tres niveles en «Confianza», crea una
 * sección, la llena y la borra con su confirmación. Cada paso es un clic de verdad sobre el mismo constructor.
 */
const SCRIPT: readonly Target[] = [
  at('[data-act="up:s1b"]'),
  at('[data-act="q:s1b"]'),
  at('[data-act="child:s1a1"]'),
  at('[data-act="root"]'),
  inLastRoot('q'),
  inLastRoot('q'),
  inLastRoot('child'),
  inLastRoot('remove'),
  at('[data-act^="confirm:"]'),
]

const STEP_MS = 1700
const MOVE_MS = 650
const REST_MS = 2600

export interface Cursor {
  x: number
  y: number
  pressing: boolean
}

/** Reproduce el guion con un cursor mientras el constructor está a la vista; al tocarlo, la persona toma el control. */
export function useBuilderDemo(box: React.RefObject<HTMLElement | null>, reset: () => void) {
  const { reducedMotion } = useA11y()
  const [auto, setAuto] = useState(true)
  const [visible, setVisible] = useState(false)
  const [cursor, setCursor] = useState<Cursor | null>(null)
  const step = useRef(0)
  const resetRef = useRef(reset)
  useEffect(() => {
    resetRef.current = reset
  })

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [box])

  const running = auto && visible && !reducedMotion

  useEffect(() => {
    if (!running) return
    const timers: number[] = []
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    const play = () => {
      const el = box.current
      if (!el) return
      if (step.current >= SCRIPT.length) {
        step.current = 0
        setCursor(null)
        later(REST_MS, () => {
          resetRef.current()
          later(600, play)
        })
        return
      }
      const target = SCRIPT[step.current](el)
      step.current += 1
      if (!target) return later(200, play)
      const a = el.getBoundingClientRect()
      const r = target.getBoundingClientRect()
      setCursor({ x: r.left - a.left + r.width / 2, y: r.top - a.top + r.height / 2, pressing: false })
      later(MOVE_MS, () => {
        setCursor((c) => (c ? { ...c, pressing: true } : c))
        const row = target.closest('li')?.firstElementChild
        target.click()
        if (row instanceof HTMLElement) {
          row.animate([{ boxShadow: '0 0 0 2px rgba(12,91,239,0.55)', transform: 'scale(1.012)' }, { boxShadow: '0 0 0 0 rgba(12,91,239,0)', transform: 'none' }], { duration: 900, easing: 'cubic-bezier(0.16,1,0.3,1)' })
        }
        later(220, () => setCursor((c) => (c ? { ...c, pressing: false } : c)))
      })
      later(STEP_MS, play)
    }

    later(500, play)
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [running, box])

  /** La persona tocó el constructor: el guion se detiene y el árbol queda para usarlo a mano. */
  const takeOver = useCallback(() => {
    setAuto(false)
    setCursor(null)
  }, [])

  const replay = useCallback(() => {
    step.current = 0
    resetRef.current()
    setAuto(true)
  }, [])

  return { cursor: running ? cursor : null, auto, takeOver, replay }
}
