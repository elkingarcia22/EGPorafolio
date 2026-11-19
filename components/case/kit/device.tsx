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

/** Aire alrededor de cada zona destacada (en % de la pantalla) */
const PAD = 1.2

/** Recuadros numerados encima de la captura; entran uno a uno. */
function Highlights({ callouts = [], active, setActive }: Highlightable) {
  return (
    <>
      {callouts.map((c, i) => (
        <span
          key={c.title.es}
          data-reveal="pop"
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          className={`pointer-events-auto absolute rounded-[10px] transition-[background-color,box-shadow] duration-300 ${active === i ? 'bg-signal/15 ring-2 ring-signal' : 'ring-[1.5px] ring-signal/70'}`}
          style={{ left: `${c.x - PAD}%`, top: `${c.y - PAD / 2}%`, width: `${c.w + PAD * 2}%`, height: `${c.h + PAD}%` }}
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
          data-reveal="right"
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

/** Barra de estado del celular: la isla vive aquí y no tapa la pantalla. */
export function StatusBar() {
  return (
    <div className="relative flex h-[34px] items-center justify-between bg-[#0b0c0e] px-6 text-[11px] font-semibold text-white" aria-hidden="true">
      <span>9:41</span>
      <span className="absolute left-1/2 top-[7px] h-[22px] w-[30%] max-w-[86px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1">
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h) => <span key={h} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />)}
        </span>
        <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-white/60 p-[1px]">
          <span className="block h-full w-3/4 rounded-[1px] bg-white" />
        </span>
      </span>
    </div>
  )
}

/** Cuerpo de celular (botones laterales, bisel); el contenido va dentro. */
export function PhoneBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -left-[3px] top-[18%] h-[7%] w-[3px] rounded-l bg-[#2b2d33]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-[28%] h-[11%] w-[3px] rounded-l bg-[#2b2d33]" aria-hidden="true" />
      <span className="absolute -right-[3px] top-[24%] h-[14%] w-[3px] rounded-r bg-[#2b2d33]" aria-hidden="true" />
      <div className="rounded-[46px] bg-[#0b0c0e] p-[9px] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <div className="relative overflow-hidden rounded-[38px] bg-[#0b0c0e]">{children}</div>
      </div>
    </div>
  )
}

interface DeviceProps {
  image: CaseImage
  callouts?: readonly Callout[]
  /** Con leyenda al lado (por defecto) o solo el aparato */
  withLegend?: boolean
  className?: string
  sizes?: string
}

/** Celular realista con barra de estado y destacados. */
export function PhoneMockup({ image, callouts, withLegend = true, className = '', sizes = '300px' }: DeviceProps) {
  const { t } = useLocale()
  const [active, setActive] = useState<number | null>(null)
  const phone = (
    <div data-reveal="device" className="relative mx-auto w-full max-w-[300px]">
      <PhoneBody>
        <StatusBar />
        <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes={sizes} className="block h-auto w-full" />
      </PhoneBody>
      {/* Los destacados van encima del aparato (fuera del recorte de la pantalla), alineados con la captura:
          9 px de bisel a cada lado y 34 px de barra de estado arriba. */}
      <div className="pointer-events-none absolute inset-x-[9px] bottom-[9px] top-[43px]">
        <Highlights callouts={callouts} active={active} setActive={setActive} />
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

/** Tablet con bisel parejo y cámara frontal. */
export function TabletMockup({ image, className = '', sizes = '(min-width: 1024px) 30vw, 70vw' }: DeviceProps) {
  const { t } = useLocale()
  return (
    <div data-reveal="device" className={className}>
      <div className="relative rounded-[30px] bg-[#0b0c0e] p-[14px] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <span className="absolute left-1/2 top-[5px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#23252b]" aria-hidden="true" />
        <div className="overflow-hidden rounded-[18px]">
          <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes={sizes} className="block h-auto w-full" />
        </div>
      </div>
    </div>
  )
}

/** Monitor de recepción con base. */
export function MonitorMockup({ image, className = '', sizes = '(min-width: 1024px) 55vw, 100vw' }: DeviceProps) {
  const { t } = useLocale()
  return (
    <div data-reveal="device" className={className}>
      <div className="rounded-[14px] bg-[#0b0c0e] p-[10px] pb-[22px] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <div className="overflow-hidden rounded-[4px]">
          <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes={sizes} className="block h-auto w-full" />
        </div>
      </div>
      <div className="mx-auto h-[38px] w-[16%] bg-gradient-to-b from-[#1b1d22] to-[#2a2d33]" aria-hidden="true" />
      <div className="mx-auto h-[8px] w-[34%] rounded-t-[6px] bg-[#2a2d33] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)]" aria-hidden="true" />
    </div>
  )
}

/** Navegador con destacados (o solo el marco). */
export function BrowserMockup({ image, callouts, withLegend = true, className = '', sizes = '(min-width: 1024px) 60vw, 100vw' }: DeviceProps) {
  const { t } = useLocale()
  const [active, setActive] = useState<number | null>(null)
  const frame = (
    <div data-reveal="device" className="overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_40px_90px_-35px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
      </div>
      <div className="pointer-events-none relative">
        <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes={sizes} className="block h-auto w-full" />
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

/** Un panel lateral suelto (sin el resto de la pantalla), con sus destacados y la leyenda al lado. */
export function PanelMockup({ image, callouts, className = '', sizes = '(min-width: 1024px) 26vw, 80vw' }: DeviceProps) {
  const { t } = useLocale()
  const [active, setActive] = useState<number | null>(null)
  return (
    <div className={`grid items-center gap-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-14 ${className}`}>
      <div data-reveal="device" className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-[#0b0c0e] shadow-[0_50px_100px_-35px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)]">
        <div className="pointer-events-none relative">
          <Image src={image.src} width={image.width} height={image.height} alt={t(image.alt)} sizes={sizes} className="block h-auto w-full" />
          <Highlights callouts={callouts} active={active} setActive={setActive} />
        </div>
      </div>
      <Legend callouts={callouts} active={active} setActive={setActive} />
    </div>
  )
}
