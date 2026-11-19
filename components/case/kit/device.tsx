'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import type { CaseImage } from '@/lib/content/cases/barberlytics/types'

/** Zona destacada sobre una captura, en % de la pantalla, con su explicación. */
export interface Callout {
  x: number
  y: number
  w: number
  h: number
  title: L
  body: L
}

interface Highlightable {
  callouts?: readonly Callout[]
  active: number | null
  setActive: (i: number | null) => void
}

/** Recuadros numerados encima de la captura. */
function Highlights({ callouts = [], active, setActive }: Highlightable) {
  return (
    <>
      {callouts.map((c, i) => (
        <span
          key={c.title.es}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          className={`absolute rounded-[10px] transition-all duration-300 ${active === i ? 'bg-signal/15 ring-2 ring-signal' : 'ring-[1.5px] ring-signal/70'}`}
          style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, height: `${c.h}%` }}
        >
          <span className="absolute -left-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-signal font-mono text-[10px] text-paper shadow-[0_0_0_3px_rgba(64,96,255,0.25)]">
            {i + 1}
          </span>
        </span>
      ))}
    </>
  )
}

/** Leyenda de los destacados; al pasar por un punto se ilumina su zona. */
function Legend({ callouts = [], active, setActive }: Highlightable) {
  const { t } = useLocale()
  if (!callouts.length) return null
  return (
    <ol className="space-y-4">
      {callouts.map((c, i) => (
        <li
          key={c.title.es}
          data-reveal
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          className={`flex gap-4 border-l-2 pl-4 transition-colors duration-300 ${active === i ? 'border-signal' : 'border-fg/15'}`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-[11px] text-paper">{i + 1}</span>
          <span>
            <span className="block font-medium">{t(c.title)}</span>
            <span className="mt-1 block text-sm leading-relaxed opacity-70">{t(c.body)}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

interface DeviceProps {
  image: CaseImage
  callouts?: readonly Callout[]
  /** Con leyenda al lado (por defecto) o solo el aparato */
  withLegend?: boolean
  className?: string
}

/** Celular realista (isla, botones laterales) con destacados. */
export function PhoneMockup({ image, callouts, withLegend = true, className = '' }: DeviceProps) {
  const { t } = useLocale()
  const [active, setActive] = useState<number | null>(null)
  const phone = (
    <div data-reveal className="relative mx-auto w-full max-w-[300px]">
      <span className="absolute -left-[3px] top-[18%] h-[7%] w-[3px] rounded-l bg-[#2b2d33]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-[28%] h-[11%] w-[3px] rounded-l bg-[#2b2d33]" aria-hidden="true" />
      <span className="absolute -right-[3px] top-[24%] h-[14%] w-[3px] rounded-r bg-[#2b2d33]" aria-hidden="true" />
      <div className="rounded-[46px] bg-[#0b0c0e] p-[9px] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <div className="relative overflow-hidden rounded-[38px]">
          <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes="300px" className="block h-auto w-full" />
          <span className="absolute left-1/2 top-[1.2%] h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
          <Highlights callouts={callouts} active={active} setActive={setActive} />
        </div>
      </div>
    </div>
  )
  if (!withLegend || !callouts?.length) return <div className={className}>{phone}</div>
  return (
    <div className={`grid items-center gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-14 ${className}`}>
      {phone}
      <Legend callouts={callouts} active={active} setActive={setActive} />
    </div>
  )
}

/** Navegador o tablet con destacados. */
export function BrowserMockup({ image, callouts, withLegend = true, className = '' }: DeviceProps) {
  const { t } = useLocale()
  const [active, setActive] = useState<number | null>(null)
  const frame = (
    <div data-reveal className="overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_40px_90px_-35px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
      </div>
      <div className="relative">
        <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes="(min-width: 1024px) 60vw, 100vw" className="block h-auto w-full" />
        <Highlights callouts={callouts} active={active} setActive={setActive} />
      </div>
    </div>
  )
  if (!withLegend || !callouts?.length) return <div className={className}>{frame}</div>
  return (
    <div className={`grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_1fr] ${className}`}>
      {frame}
      <Legend callouts={callouts} active={active} setActive={setActive} />
    </div>
  )
}
