'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { PLATFORM } from '@/lib/content/cases/barberlytics/platform'
import { useInView } from './use-auto-steps'

const IMG = '/cases/barberlytics'
/** La pantalla real a la que entra cada rol (en el orden de PLATFORM.roles) */
const DOORS: readonly { src: string; alt: L }[] = [
  { src: `${IMG}/role-owner-metrics.webp`, alt: { es: 'Métricas del dueño: toda la empresa.', en: 'Owner metrics: the whole company.' } },
  { src: `${IMG}/role-owner-metrics.webp`, alt: { es: 'Las mismas métricas, de su sucursal.', en: 'The same metrics, for their location.' } },
  { src: `${IMG}/role-desk-calendar.webp`, alt: { es: 'Recepción entra al calendario de su sucursal.', en: 'The front desk lands on their location’s calendar.' } },
  { src: `${IMG}/role-barber-pay.webp`, alt: { es: '«Lo que llevas»: comisiones, productos y propinas del barbero.', en: '“What you’ve made”: the barber’s commissions, products and tips.' } },
  { src: `${IMG}/role-renter-business.webp`, alt: { es: '«Mi negocio»: ventas, renta, deducciones y el neto del barbero que alquila la silla.', en: '“My business”: sales, rent, deductions and the net of the chair-rent barber.' } },
]
/** Lo que se lee al tocar cada rol, además de su alcance (del contenido del caso) */
const WHY: readonly L[] = [
  { es: 'Ve toda la empresa y entra a sus métricas.', en: 'Sees the whole company and lands on its metrics.' },
  { es: 'Lo mismo que el dueño, recortado a su sucursal.', en: 'What the owner sees, cut down to their location.' },
  { es: 'Ve el precio de cada cita, no los totales; el cierre de caja es a ciegas.', en: 'Sees each visit’s price, not totals; the till closes blind.' },
  { es: 'Solo lo suyo: lo que lleva ganado en el periodo.', en: 'Only their own: what they’ve made in the period.' },
  { es: 'Su propio negocio dentro de la barbería: ventas, propinas, renta y su neto, aunque sea negativo.', en: 'Their own business inside the shop: sales, tips, rent and their net, even when negative.' },
]
/** Al entrar se encienden los cinco, uno tras otro, y queda abierta la puerta de recepción */
const LIGHT_MS = 260
const SETTLE = 2

/**
 * 05 · Roles: cinco puertas sobre un arco y, debajo, la pantalla real a la que
 * entra cada una. Al verse, las puertas se encienden en fila; tocar una abre
 * su pantalla y dice qué ve. De la pantalla baja la fibra hasta «IA».
 */
export function RoleDoors() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { roles } = PLATFORM
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const [lit, setLit] = useState(reducedMotion ? roles.items.length : 0)
  const [active, setActive] = useState(SETTLE)

  useEffect(() => {
    if (!inView || reducedMotion || lit >= roles.items.length) return
    const id = window.setTimeout(() => setLit((n) => n + 1), lit === 0 ? 300 : LIGHT_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, lit, roles.items.length])

  const n = roles.items.length
  const role = roles.items[active]

  return (
    <div ref={rootRef} className="mx-auto max-w-[980px]">
      {/* Las puertas, sobre un arco suave */}
      <ol className="relative mx-auto grid max-w-[860px] grid-cols-5 items-end">
        {roles.items.map((r, i) => {
          const on = i < lit
          const isActive = on && i === active
          const lift = Math.sin((Math.PI * (i + 0.5)) / n) * 34
          return (
            <li key={r.role.es} className="flex justify-center" style={{ transform: `translateY(${-lift}px)` }}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setLit(n)
                  setActive(i)
                }}
                className="group flex flex-col items-center text-center outline-none"
              >
                <span className={`mb-3 text-balance text-[12px] leading-tight transition-opacity duration-300 sm:text-[15px] ${isActive ? 'opacity-100' : on ? 'opacity-55 group-hover:opacity-90' : 'opacity-20'}`}>{t(r.role)}</span>
                <span className="relative grid h-4 w-4 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${isActive ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgba(217,179,106,0.3),0_0_20px_4px_rgba(217,179,106,0.7)]' : on ? 'border-white/60 bg-[#d9b36a]/70' : 'border-white/30 bg-void'}`} />
                  {isActive && <span className="absolute inset-[-8px] rounded-full border border-[#d9b36a]/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Lo que ve el rol abierto */}
      <div key={active} aria-live="polite" className="pl-fade mx-auto mt-10 flex min-h-[5.5rem] max-w-[52ch] flex-col items-center text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d9b36a]">
          {t(role.scope)} · {t({ es: 'entra a', en: 'lands on' })} {t(role.lands)}
        </p>
        <p className="mt-3 text-balance text-base leading-relaxed text-paper/70 md:text-lg">{t(WHY[active])}</p>
      </div>

      {/* Su pantalla real: la fibra de la puerta baja hasta ella */}
      <div className="relative mx-auto mt-8 max-w-[900px]">
        <span aria-hidden="true" className="pointer-events-none absolute -inset-x-8 -top-10 h-40 bg-[radial-gradient(closest-side,rgba(217,179,106,0.16),transparent)]" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
          {DOORS.map((d, i) => (
            <Image
              key={i}
              src={d.src}
              alt={i === active ? t(d.alt) : ''}
              aria-hidden={i !== active}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover object-left-top transition-[opacity,transform] duration-700 ease-expo"
              style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1)' : 'scale(1.03)' }}
            />
          ))}
        </div>
        <span data-fiber-from="pl-ia" className="absolute bottom-0 left-1/2 h-px w-px" />
      </div>
    </div>
  )
}
