'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/motion'

export type Tone = 'dark' | 'light'

interface ToneSectionProps extends React.HTMLAttributes<HTMLElement> {
  tone: Tone
  as?: 'section' | 'div' | 'footer'
  children: React.ReactNode
}

function applyTone(tone: Tone) {
  document.documentElement.dataset.tone = tone
}

/**
 * Sección que, al cruzar el centro de la pantalla, cambia el tono de todo
 * el sitio: oscuro = ruido, claro = señal (papel de la hoja de vida).
 */
export function ToneSection({ tone, as: Tag = 'section', children, ...rest }: ToneSectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      // Se recalcula después de las secciones fijadas (pin) para no desfasarse.
      refreshPriority: -1,
      onEnter: () => applyTone(tone),
      onEnterBack: () => applyTone(tone),
    })
    if (trigger.isActive) applyTone(tone)
    return () => trigger.kill()
  }, [tone])

  return (
    <Tag ref={ref as React.Ref<HTMLElement & HTMLDivElement>} data-section-tone={tone} {...rest}>
      {children}
    </Tag>
  )
}
