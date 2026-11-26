'use client'

import { useLocale, type L } from '@/lib/i18n'

interface MomentProps {
  index: string
  title: L
  why: L
  flip?: boolean
  /** La pieza ocupa todo el ancho y el texto va arriba, en dos columnas. */
  wide?: boolean
  children: React.ReactNode
}

/** Un momento ganador: la pieza animada grande y por qué gana. */
export function Moment({ index, title, why, flip = false, wide = false, children }: MomentProps) {
  const { t } = useLocale()
  if (wide) {
    return (
      <section>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p data-reveal className="mono-label text-signal">{index}</p>
            <h3 data-reveal="mask" className="mt-3 text-[clamp(1.6rem,1rem+1.6vw,2.4rem)] font-light leading-[1.05]">{t(title)}</h3>
          </div>
          <p data-reveal className="leading-relaxed opacity-75 lg:col-span-7">{t(why)}</p>
        </div>
        <div data-reveal="device" className="mt-8 min-w-0">{children}</div>
      </section>
    )
  }
  return (
    <section className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div data-reveal="device" className={`min-w-0 lg:col-span-8 ${flip ? 'lg:order-2' : ''}`}>{children}</div>
      <div className={`lg:col-span-4 ${flip ? 'lg:order-1' : ''}`}>
        <p data-reveal className="mono-label text-signal">{index}</p>
        <h3 data-reveal="mask" className="mt-3 text-[clamp(1.6rem,1rem+1.6vw,2.4rem)] font-light leading-[1.05]">{t(title)}</h3>
        <p data-reveal className="mt-4 leading-relaxed opacity-75">{t(why)}</p>
      </div>
    </section>
  )
}

/** Marco de navegador claro para las piezas que imitan el producto. */
export function BrowserFrame({ route, children, className = '' }: { route: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-[#f8faff] text-[#303a47] shadow-[0_40px_90px_-40px_rgba(10,11,13,0.55)] ring-1 ring-black/10 ${className}`}>
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white px-3 py-2" aria-hidden="true">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 truncate rounded-md bg-[#f1f3f8] px-2 py-0.5 font-mono text-[11px] text-black/45">{route}</span>
      </div>
      {children}
    </div>
  )
}
