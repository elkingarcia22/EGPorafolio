'use client'

import type { ReactNode } from 'react'

/** Mockups de dispositivos hechos en CSS: monitor de escritorio, portátil y tableta. */

/** Monitor de escritorio: bisel negro, cámara, cuello y base. */
export function Monitor({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full ${className}`}>
      <div className="rounded-[18px] bg-gradient-to-b from-[#2a2c31] to-[#16171a] p-[1.2%] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
        <div className="relative mb-[0.6%] flex justify-center" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
        <div className="overflow-hidden rounded-[8px] bg-black">{children}</div>
        <div className="mt-[0.8%] h-1" aria-hidden="true" />
      </div>
      <div className="mx-auto h-[clamp(18px,4vw,48px)] w-[14%] bg-gradient-to-b from-[#1b1c20] to-[#2a2c31]" aria-hidden="true" />
      <div className="mx-auto h-2.5 w-[30%] rounded-t-[10px] rounded-b-[4px] bg-gradient-to-b from-[#34363c] to-[#1d1e22] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]" aria-hidden="true" />
    </div>
  )
}

/** Portátil: pantalla con bisel fino y base con muesca. */
export function Laptop({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full ${className}`}>
      <div className="mx-[6%] rounded-t-[14px] bg-[#1c1d21] p-[1.2%] pb-[1.6%] ring-1 ring-white/10">
        <div className="overflow-hidden rounded-[6px] bg-black">{children}</div>
      </div>
      <div className="relative h-3 rounded-b-[14px] bg-gradient-to-b from-[#3a3c42] to-[#1f2024] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]" aria-hidden="true">
        <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-[#17181b]" />
      </div>
    </div>
  )
}

/** Tableta horizontal: bisel redondeado grueso y cámara al costado. */
export function Tablet({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-full rounded-[28px] bg-gradient-to-br from-[#2b2d33] to-[#141518] p-[2.2%] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)] ring-1 ring-white/10 ${className}`}>
      <span className="absolute left-[1%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/20" aria-hidden="true" />
      <div className="overflow-hidden rounded-[12px] bg-black">{children}</div>
    </div>
  )
}
