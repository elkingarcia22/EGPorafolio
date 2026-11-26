'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { useSwipe } from '@/components/case/kit/use-swipe'

/** Cada cuánto cambia solo el tema en la portada */
const AUTO_MS = 2600

interface ThemeShowcaseProps {
  /** Cambia solo de tema cada pocos segundos */
  auto?: boolean
  /** Transformación 3D del navegador (ángulo) */
  tilt?: string
  /** Tamaño en pantalla, para servir la imagen justa */
  sizes?: string
  /** Muestra los colores para elegir y el gradiente de IA */
  controls?: boolean
  className?: string
}

/**
 * La portada real de la documentación en seis temas: se cambia sola o al tocar
 * un color, con el gradiente de IA que el sistema deriva del primario.
 */
export function ThemeShowcase({ auto = false, tilt, sizes = '(min-width: 1024px) 60vw, 100vw', controls = true, className = '' }: ThemeShowcaseProps) {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const themes = THEMA_CASE.themes
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = themes[active]
  const rootRef = useRef<HTMLDivElement>(null)
  // En el teléfono también se pasa deslizando el dedo de lado.
  useSwipe(rootRef, {
    onNext: () => {
      setPaused(true)
      setActive((i) => (i + 1) % themes.length)
    },
    onPrev: () => {
      setPaused(true)
      setActive((i) => (i - 1 + themes.length) % themes.length)
    },
  })

  useEffect(() => {
    if (!auto || paused || reducedMotion) return
    const timer = window.setInterval(() => setActive((i) => (i + 1) % themes.length), AUTO_MS)
    return () => window.clearInterval(timer)
  }, [auto, paused, reducedMotion, themes.length])

  return (
    <div ref={rootRef} className={className}>
      <div style={tilt ? { transform: tilt } : undefined} className="transition-transform duration-700 ease-expo">
        <div className="overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
          <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex h-5 flex-1 items-center rounded-md bg-white/[0.06] px-2 font-mono text-[11px] md:text-[10px] text-white/45">barberlytics.vercel.app/docs</span>
          </div>
          <div className="relative aspect-[1400/817]">
            {themes.map((theme, i) => (
              <Image
                key={theme.id}
                src={theme.image.src}
                width={theme.image.width}
                height={theme.image.height}
                alt={i === active ? t(theme.image.alt) : ''}
                aria-hidden={i !== active}
                sizes={sizes}
                priority={i < 2}
                className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {controls && (
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div role="radiogroup" aria-label={t({ es: 'Tema', en: 'Theme' })} className="flex gap-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {themes.map((theme, i) => (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={i === active}
                aria-label={theme.name}
                title={theme.name}
                onClick={() => {
                  setActive(i)
                  setPaused(true)
                }}
                className={`h-8 w-8 rounded-full ring-offset-2 ring-offset-bg transition-transform duration-300 hover:scale-110 ${i === active ? 'scale-110 ring-2 ring-fg' : 'ring-1 ring-fg/20'}`}
                style={{ background: theme.primary }}
              />
            ))}
          </div>
          <div className="min-w-[200px] flex-1">
            <p className="mono-label mb-1.5 flex justify-between opacity-70">
              <span>{current.name}</span>
              <span>{t({ es: 'gradiente de IA derivado', en: 'derived AI gradient' })}</span>
            </p>
            <span
              className="block h-2.5 w-full rounded-full transition-[background] duration-700"
              style={{ background: `linear-gradient(90deg, ${current.primary}, ${current.aiEnd})` }}
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </div>
  )
}
