'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'

type ChipKind = 'research' | 'system' | 'ai'

const CHIPS: Record<ChipKind, React.ReactNode> = {
  research: (
    <svg viewBox="0 0 24 24" className="h-[0.6em] w-[0.6em]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" strokeLinecap="round" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" className="h-[0.6em] w-[0.6em]" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" className="h-[0.6em] w-[0.6em]" fill="currentColor">
      <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z" />
    </svg>
  ),
}

interface RevealWordsProps {
  text: string
  className?: string
  /**
   * true (por defecto): se ilumina con el scroll. false: no anima por su cuenta;
   * quien lo usa anima [data-word] y [data-chip] (p. ej. lectura con tiempo propio).
   */
  scrub?: boolean
}

/**
 * Texto que se "ilumina" palabra por palabra con el scroll.
 * Los tokens [[research]], [[system]] y [[ai]] se convierten en chips con ícono.
 */
export function RevealWords({ text, className = '', scrub = true }: RevealWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { reducedMotion } = useA11y()

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion || !scrub) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        // Cada palabra pasa de ruido (tenue y desenfocada) a señal.
        { opacity: 0.12, filter: 'blur(5px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.fromTo(
        el.querySelectorAll('[data-chip]'),
        { scale: 0, rotate: -20 },
        {
          scale: 1,
          rotate: 0,
          ease: 'back.out(2)',
          stagger: 0.2,
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 50%', scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [text, reducedMotion, scrub])

  const tokens = text.split(/\s+/)

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, i) => {
        const chip = token.match(/^\[\[(research|system|ai)\]\]$/)
        if (chip) {
          return (
            <span
              key={i}
              data-chip
              aria-hidden="true"
              className="mx-[0.15em] inline-flex h-[0.85em] w-[1.4em] translate-y-[0.08em] items-center justify-center rounded-full bg-signal align-baseline text-paper"
            >
              {CHIPS[chip[1] as ChipKind]}
            </span>
          )
        }
        return (
          <span key={i} data-word className="inline-block">
            {token}&nbsp;
          </span>
        )
      })}
    </p>
  )
}
