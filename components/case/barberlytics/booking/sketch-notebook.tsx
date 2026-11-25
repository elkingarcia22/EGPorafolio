'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { BookingLede } from './booking-lede'
import { NOTEBOOK_PAGES } from './notebook-pages'
import { useAutoSteps } from './use-auto-steps'

/** Tiempo en cada página mientras pasan solas (ms) */
const PAGE_MS = 5200
/** Anillos del espiral sobre el borde de arriba */
const RINGS = 22
const N = NOTEBOOK_PAGES.length

/**
 * 04 · Bocetos y forma: los bocetos en un cuaderno de espiral. Las páginas se
 * pasan solas hacia arriba, como al hojear un cuaderno; en cada una las notas
 * se pegan y las flechas se dibujan. Se detiene con el cursor encima y se puede
 * ir a cualquier página. En el teléfono, el cuaderno se desliza de lado.
 */
export function SketchNotebook() {
  const { t } = useLocale()
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const stackRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [hold, setHold] = useState(false)
  const current = NOTEBOOK_PAGES[page]

  // Pasa de página sola mientras se ve y nadie la está mirando de cerca
  useEffect(() => {
    if (!inView || hold || reducedMotion) return
    const id = window.setTimeout(() => setPage((p) => (p + 1) % N), PAGE_MS)
    return () => window.clearTimeout(id)
  }, [inView, hold, reducedMotion, page])

  // Al abrir una página: sus notas se pegan y sus flechas se dibujan
  useEffect(() => {
    const sheet = stackRef.current?.querySelectorAll<HTMLElement>('[data-sheet]')[page]
    if (!sheet || reducedMotion || !inView) return
    const ctx = gsap.context(() => {
      gsap.fromTo(sheet.querySelectorAll('[data-reveal="pop"]'), { scale: 0.6, autoAlpha: 0, rotate: () => gsap.utils.random(-7, 7) }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.07, delay: 0.45 })
      gsap.fromTo(sheet.querySelectorAll('[data-draw]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.4 })
    }, sheet)
    return () => ctx.revert()
  }, [page, inView, reducedMotion])

  return (
    <div ref={ref} className="flex flex-col items-center">
      <BookingLede tag={`${t({ es: 'Cuaderno', en: 'Sketchbook' })} · ${String(page + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`} title={t(current.title)} sub={t(current.note)} swapKey={page} />

      <div className="mt-10 w-full max-w-[1000px] overflow-x-auto overscroll-x-contain pb-2" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
        <p className="mono-label mb-3 text-center opacity-50 md:hidden" aria-hidden="true">{t({ es: 'Desliza →', en: 'Swipe →' })}</p>
        <div data-reveal-off className="relative mx-auto min-w-[820px] pt-5 [perspective:2200px]">
          {/* El espiral, por encima de todas las hojas */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[4%] top-0 z-[60] flex justify-between">
            {Array.from({ length: RINGS }, (_, i) => (
              <span key={i} className="h-7 w-2.5 rounded-full border-2 border-[#c9c4b6] bg-gradient-to-b from-[#3a3d44] to-[#1b1d21] shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
            ))}
          </div>

          {/* El grosor del cuaderno: hojas de abajo */}
          <span aria-hidden="true" className="absolute inset-x-[0.6%] bottom-[-10px] top-8 rounded-xl bg-[#d9d5ca]" />
          <span aria-hidden="true" className="absolute inset-x-[0.3%] bottom-[-5px] top-7 rounded-xl bg-[#e8e5dc]" />

          <div ref={stackRef} className="relative aspect-[1200/700] [&_figure]:overflow-visible [&_figure>div]:min-w-0 [&_figure>div>p]:hidden [&_figure>p]:hidden">
            {NOTEBOOK_PAGES.map(({ Page, title }, i) => {
              const turned = i < page
              const on = i === page
              return (
                <div
                  key={title.es}
                  data-sheet
                  aria-hidden={!on}
                  inert={!on ? true : undefined}
                  className="absolute inset-0 origin-top [backface-visibility:hidden]"
                  style={{
                    zIndex: N - i,
                    transform: turned ? 'rotateX(-172deg)' : 'rotateX(0deg)',
                    opacity: turned ? 0 : 1,
                    transition: reducedMotion ? 'none' : 'transform 1s cubic-bezier(.6,0,.25,1), opacity .25s linear .75s',
                  }}
                >
                  <Page />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Las páginas: ir a cualquiera */}
      <div className="mt-6 flex items-center gap-4">
        <button type="button" onClick={() => setPage((p) => (p - 1 + N) % N)} aria-label={t({ es: 'Página anterior', en: 'Previous page' })} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-paper/70 transition-colors hover:border-white/40 hover:text-paper">←</button>
        <ol className="flex items-center gap-2.5">
          {NOTEBOOK_PAGES.map((p, i) => (
            <li key={p.title.es}>
              <button type="button" onClick={() => setPage(i)} aria-current={i === page ? 'page' : undefined} aria-label={t(p.title)} title={t(p.title)} className={`block rounded-full transition-all duration-500 ${i === page ? 'h-2.5 w-6 bg-[rgb(var(--bk))] shadow-[0_0_10px_rgb(var(--bk)/0.7)]' : 'h-2 w-2 bg-white/25 hover:bg-white/50'}`} />
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => setPage((p) => (p + 1) % N)} aria-label={t({ es: 'Página siguiente', en: 'Next page' })} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-paper/70 transition-colors hover:border-white/40 hover:text-paper">→</button>
      </div>
    </div>
  )
}
