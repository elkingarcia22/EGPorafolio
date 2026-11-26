'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { LogoToApp } from './logo-to-app'
import { ChapterHead } from './chapter-head'

/** Alto de cada componente en el carrete (px) */
const REEL_H = 170

/**
 * El carrete de componentes: las capturas reales de los playgrounds de Thema
 * pasan solas en bucle (se detienen con el cursor encima). Tocar una dice
 * cuál es y a qué familia pertenece.
 */
function ComponentReel() {
  const { t } = useLocale()
  const components = THEMA_CASE.form.components
  const [picked, setPicked] = useState<number | null>(null)
  const current = picked === null ? null : components[picked]

  return (
    <div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="th-marquee flex w-max gap-4 py-2">
          {[0, 1].map((copy) =>
            components.map((c, i) => (
              <li key={`${copy}-${c.id}`} aria-hidden={copy === 1}>
                <button
                  type="button"
                  tabIndex={copy === 1 ? -1 : 0}
                  onClick={() => setPicked(picked === i ? null : i)}
                  aria-pressed={picked === i}
                  className={`block overflow-hidden rounded-xl outline-none ring-1 transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-signal ${picked === i ? 'ring-2 ring-[#D9B36A]' : 'ring-white/10'}`}
                  style={{ height: REEL_H, width: Math.round((REEL_H * c.image.width) / c.image.height) }}
                >
                  <Image src={c.image.src} width={c.image.width} height={c.image.height} alt={copy === 1 ? '' : t(c.image.alt)} sizes="360px" className="h-full w-full object-cover" />
                </button>
              </li>
            )),
          )}
        </ul>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <p className="min-h-[1.5rem] text-sm text-paper/70" aria-live="polite">
          {current ? (
            <span key={current.id} className="th-fade inline-block">
              <span className="font-mono text-paper">{current.name}</span>
              <span className="text-paper/45"> · {t({ es: 'familia', en: 'family' })} «{current.family}»</span>
            </span>
          ) : (
            <span className="case-hint">{t({ es: '218 componentes en 22 familias · toca uno', en: '218 components in 22 families · tap one' })}</span>
          )}
        </p>
        <span aria-hidden="true" className="relative mt-5 h-2.5 w-2.5 rounded-full border border-white/60 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.6)]">
          <span data-fiber-from="th-ia" className="absolute left-1/2 top-1/2 h-px w-px" />
        </span>
      </div>
    </div>
  )
}

/** 05 · Forma de Thema: del logo de la barbería a su app, y las piezas reales del sistema. */
export function ThemaForm() {
  const { t } = useLocale()
  const { chapters } = THEMA_CASE
  return (
    <div>
      <ChapterHead phrase={t(chapters.forma.phrase)} lead={t(chapters.forma.lead)} />
      <LogoToApp />
      <div className="mt-[clamp(3.5rem,3rem+3vw,6rem)]">
        <ComponentReel />
      </div>
    </div>
  )
}
