'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { BookingLede } from './booking-lede'
import { NOTEBOOK_PAGES } from './notebook-pages'
import { NOTEBOOK_PAGES_NARROW } from './notebook-pages-narrow'
import { useAutoSteps } from './use-auto-steps'
import { usePhone } from './use-phone'
import { useSwipe } from '@/components/case/kit/use-swipe'

/** Tiempo en cada página mientras pasan solas (ms) */
const PAGE_MS = 5200
/** Anillos del espiral sobre el borde de arriba (menos en la hoja angosta del teléfono) */
const RINGS = { wide: 22, narrow: 11 }
const N = NOTEBOOK_PAGES.length

/**
 * 04 · Bocetos y forma: los bocetos en un cuaderno de espiral. Las páginas se
 * pasan solas hacia arriba, como al hojear un cuaderno; en cada una las notas
 * se pegan y las flechas se dibujan. Se detiene con el cursor encima y se puede
 * ir a cualquier página. En el teléfono la hoja es vertical, con la letra a un
 * tamaño que se lee, y se pasa deslizando el dedo de lado.
 */
export function SketchNotebook() {
  const { t } = useLocale()
  const { ref, inView, reducedMotion } = useAutoSteps<HTMLDivElement>(1, { intro: 0, step: 0 })
  const stackRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [hold, setHold] = useState(false)
  const current = NOTEBOOK_PAGES[page]
  const narrow = usePhone()
  const swipeRef = useRef<HTMLDivElement>(null)
  useSwipe(swipeRef, { onNext: () => setPage((p) => (p + 1) % N), onPrev: () => setPage((p) => (p - 1 + N) % N), disabled: !narrow })

  // Pasa de página sola mientras se ve y nadie la está mirando de cerca
  useEffect(() => {
    if (!inView || hold || reducedMotion) return
    const id = window.setTimeout(() => setPage((p) => (p + 1) % N), PAGE_MS)
    return () => window.clearTimeout(id)
  }, [inView, hold, reducedMotion, page])

  // La vuelta de hoja: se levanta por la esquina, gira sobre el espiral mostrando
  // su reverso, se oscurece al girar y deja sombra sobre la hoja de abajo.
  const shown = useRef(page)
  useEffect(() => {
    const sheets = Array.from(stackRef.current?.querySelectorAll<HTMLElement>('[data-sheet]') ?? [])
    if (!sheets.length) return
    const from = shown.current
    shown.current = page
    const rest = (i: number) => (i < page ? { rotateX: -180, rotateZ: 0, autoAlpha: 0, zIndex: N - i } : { rotateX: 0, rotateZ: 0, autoAlpha: 1, zIndex: N - i })
    if (reducedMotion || from === page) {
      sheets.forEach((el, i) => gsap.set(el, rest(i)))
      return
    }
    const forward = page > from
    const moving = forward ? sheets.slice(from, page) : sheets.slice(page, from).reverse()
    const tl = gsap.timeline({ onComplete: () => sheets.forEach((el, i) => gsap.set(el, rest(i))) })
    moving.forEach((el, k) => {
      const i = sheets.indexOf(el)
      const shade = el.querySelector('[data-shade]')
      const cast = sheets[i + 1]?.querySelector('[data-cast]')
      const at = k * 0.18
      if (forward) {
        tl.set(el, { autoAlpha: 1, zIndex: 100 + k }, at)
          .to(el, { rotateX: -16, rotateZ: -0.8, duration: 0.3, ease: 'power2.out' }, at)
          .to(el, { rotateX: -180, rotateZ: 0, duration: 0.9, ease: 'power2.inOut' }, at + 0.3)
          .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.in' }, at)
          .set(el, { autoAlpha: 0 }, at + 1.2)
        if (cast) tl.fromTo(cast, { opacity: 0.55 }, { opacity: 0, duration: 0.9, ease: 'power2.in' }, at + 0.3)
      } else {
        tl.set(el, { autoAlpha: 1, zIndex: 100 + k, rotateX: -180 }, at)
          .to(el, { rotateX: -14, rotateZ: -0.6, duration: 0.9, ease: 'power2.inOut' }, at)
          .to(el, { rotateX: 0, rotateZ: 0, duration: 0.3, ease: 'power2.out' }, at + 0.9)
          .fromTo(shade, { opacity: 1 }, { opacity: 0, duration: 0.9, ease: 'power1.out' }, at + 0.3)
        if (cast) tl.fromTo(cast, { opacity: 0 }, { opacity: 0.55, duration: 0.6 }, at).to(cast, { opacity: 0, duration: 0.4 }, at + 0.8)
      }
    })
    return () => {
      tl.kill()
    }
  }, [page, reducedMotion])

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

      <div ref={swipeRef} className={`mt-10 w-full max-w-[1000px] pb-2 ${narrow ? '' : 'overflow-x-auto overscroll-x-contain'}`} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
        <div data-reveal-off className={`relative mx-auto pt-5 [perspective:1800px] [perspective-origin:50%_-30%] ${narrow ? 'max-w-[440px]' : 'min-w-[820px]'}`}>
          {/* El espiral, por encima de todas las hojas */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[4%] top-0 z-[300] flex justify-between">
            {Array.from({ length: narrow ? RINGS.narrow : RINGS.wide }, (_, i) => (
              <span key={i} className="h-7 w-2.5 rounded-full border-2 border-[#c9c4b6] bg-gradient-to-b from-[#3a3d44] to-[#1b1d21] shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
            ))}
          </div>

          {/* El grosor del cuaderno: hojas de abajo */}
          <span aria-hidden="true" className="absolute inset-x-[0.6%] bottom-[-10px] top-8 rounded-xl bg-[#d9d5ca]" />
          <span aria-hidden="true" className="absolute inset-x-[0.3%] bottom-[-5px] top-7 rounded-xl bg-[#e8e5dc]" />

          <div ref={stackRef} className={`relative [&_figure]:overflow-visible [&_figure>div]:min-w-0 [&_figure>div>p]:hidden [&_figure>p]:hidden ${narrow ? 'aspect-[400/720]' : 'aspect-[1200/700]'}`}>
            {NOTEBOOK_PAGES.map(({ Page: WidePage, title }, i) => {
              const on = i === page
              const Page = narrow ? NOTEBOOK_PAGES_NARROW[i] : WidePage
              return (
                <div
                  key={title.es}
                  data-sheet
                  aria-hidden={!on}
                  inert={!on ? true : undefined}
                  className="absolute inset-0 origin-top [transform-style:preserve-3d]"
                  style={{ zIndex: N - i }}
                >
                  {/* El frente: el boceto */}
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <Page />
                    {/* La sombra que deja la hoja de arriba al pasar */}
                    <span data-cast aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.15)_45%,transparent)] opacity-0" />
                    {/* La hoja se oscurece y brilla en la esquina mientras gira */}
                    <span data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(to_top,rgba(0,0,0,0.35),rgba(0,0,0,0.08)_40%,rgba(255,255,255,0.12)_75%,transparent)] opacity-0" />
                  </div>
                  {/* El reverso: papel liso con sus puntos */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl [backface-visibility:hidden] [transform:rotateX(180deg)]"
                    style={{ backgroundColor: '#ece9e0', backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.12), transparent 35%), radial-gradient(rgba(42,45,51,0.12) 1px, transparent 1.2px)', backgroundSize: '100% 100%, 22px 22px' }}
                  />
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
