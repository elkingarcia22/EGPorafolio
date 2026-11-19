'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { RecordModal } from '@/components/case/kit/record-modal'

/** El staging público del playground de UBITS; `ver=backlog` abre el alcance completo. */
const DEMO_URL = 'https://staging-playground.ubits.co/admin/desempeno-cultura/objetivos?ver=backlog'

/**
 * Medidas del shell del playground (staging, 19 nov 2026): bajo 1200 px de ancho
 * el menú lateral se pliega solo a un riel de 72 px, y la barra superior mide 60 px.
 * Por ahí se llega a los demás productos, así que quedan fuera del recorte.
 */
const FRAME_W = 1180
const RAIL = 72
const HEADER = 60

/** El módulo de Objetivos sin el menú ni la barra de la plataforma, escalado al espacio disponible. */
function ModuleOnly() {
  const { t } = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = size.w ? size.w / (FRAME_W - RAIL) : 1
  const frameH = size.h ? size.h / scale + HEADER : 800

  return (
    <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-white">
      {size.w > 0 && (
        <iframe
          src={DEMO_URL}
          title={t({ es: 'Objetivos de UBITS, en vivo', en: 'UBITS Goals, live' })}
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width: FRAME_W, height: frameH, transform: `translate(${-RAIL * scale}px, ${-HEADER * scale}px) scale(${scale})` }}
        />
      )}
    </div>
  )
}

/** 08 · Demo: el módulo real de Objetivos (vista de administrador) en el staging, solo el módulo. */
export function ObjetivosDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-10 max-w-[62ch]">
        <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'El producto real, como administrador.', en: 'The real product, as admin.' })}</p>
        <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(OBJ_CASE.demo.lead)}</p>
      </div>

      <button
        type="button"
        data-reveal="device"
        onClick={() => setOpen('objetivos')}
        className="group relative block w-full overflow-hidden rounded-3xl bg-[#0b0d16] p-6 text-left text-white md:p-10"
        aria-label={t({ es: 'Ver la demo de Objetivos', en: 'Open the Goals demo' })}
      >
        <span className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0c5bef] opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-50" aria-hidden="true" />
        <span className="relative block overflow-hidden rounded-xl shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/15 transition-transform duration-1000 ease-expo [transform:perspective(1600px)_rotateX(5deg)] group-hover:[transform:none]">
          <Image src={OBJ_CASE.form.home.src} width={2000} height={1250} alt="" sizes="(min-width: 1024px) 60vw, 100vw" className="block h-auto w-full" />
        </span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[15px] font-medium text-[#0b0d16] shadow-[0_20px_60px_-10px_rgba(12,91,239,0.9)] transition-transform duration-500 ease-expo group-hover:scale-105">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#17b26a]" aria-hidden="true" />
            {t({ es: 'Ver la demo', en: 'Open the demo' })}
            <span aria-hidden="true">⤢</span>
          </span>
        </span>
      </button>

      <RecordModal
        ids={['objetivos']}
        openId={open}
        onOpenChange={setOpen}
        title={t({ es: 'Objetivos · Administrador', en: 'Goals · Admin' })}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c5bef] font-mono text-xs font-semibold text-white">Ob</span>}
        description={t({ es: 'Staging del playground de UBITS · solo el módulo de Objetivos', en: 'UBITS playground staging · Goals module only' })}
      >
        {open && <ModuleOnly />}
      </RecordModal>
    </div>
  )
}
