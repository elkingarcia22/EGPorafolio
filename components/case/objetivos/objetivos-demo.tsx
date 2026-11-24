'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { RecordModal } from '@/components/case/kit/record-modal'
import { CaseDemo } from '@/components/case/kit/case-demo'

/** El staging público del playground de UBITS; `ver=backlog` abre el alcance completo. */
const DEMO_URL = 'https://staging-playground.ubits.co/admin/desempeno-cultura/objetivos?ver=backlog'

/**
 * Igual que la demo de Encuestas: el playground se dibuja a 1.199 px (justo bajo el `NARROW_WINDOW`
 * de su RootLayout, así el menú queda plegado en el riel de 72 px) y se escala a todo el modal. El
 * riel y la barra superior (60 px) se ven, pero una capa encima no deja navegar: solo Objetivos.
 */
const RAIL = 72
const TOPBAR = 60
const NARROW_WINDOW = 1200
const PHONE_MAX = 600

function ModuleOnly() {
  const { t } = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // En teléfono (hasta 600 px, donde el playground ya no muestra el riel) se dibuja a su tamaño real,
  // con su propia vista móvil, sin escalar, para que se lea. Más ancho, la vista de escritorio escalada.
  const phone = !!size && size.w <= PHONE_MAX
  const width = phone && size ? size.w : size && size.w < 768 ? 1024 : NARROW_WINDOW - 1
  const scale = size ? size.w / width : 1
  const height = size ? size.h / scale : 800
  const rail = phone ? 0 : RAIL

  return (
    <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-white">
      {!loaded && (
        <p className="absolute inset-0 flex items-center justify-center gap-3 font-mono text-xs text-[#5c646f]" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0c5bef] border-t-transparent" />
          {t({ es: 'Abriendo Objetivos…', en: 'Opening Goals…' })}
        </p>
      )}
      {size && (
        <iframe
          src={DEMO_URL}
          title={t({ es: 'Objetivos de UBITS, en vivo', en: 'UBITS Goals, live' })}
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500"
          style={{ width, height, transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
        />
      )}
      {/* Capas invisibles sobre el riel y la barra superior: se ven, pero no llevan a otros productos. */}
      {size && (
        <>
          {rail > 0 && <span className="absolute left-0 top-0 h-full cursor-not-allowed" style={{ width: rail * scale }} aria-hidden="true" />}
          <span className="absolute right-0 top-0 cursor-not-allowed" style={{ left: rail * scale, height: TOPBAR * scale }} aria-hidden="true" />
        </>
      )}
    </div>
  )
}

/** 08 · Demo: el módulo real de Objetivos (vista de administrador) en el staging, solo el módulo. */
export function ObjetivosDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <>
      {/* Debajo de lg la grilla de CaseDemo no tiene columnas explícitas y la URL larga (sin cortes) la
          ensanchaba más que la pantalla; una columna minmax(0,1fr) la contiene. */}
      <div className="max-lg:[&>div]:grid-cols-[minmax(0,1fr)]">
      <CaseDemo
        title={{ es: 'El producto real, como administrador.', en: 'The real product, as admin.' }}
        lead={OBJ_CASE.demo.lead}
        url="ubits · /admin/desempeno-cultura/objetivos"
        image={{ src: OBJ_CASE.form.home.src, width: 2000, height: 1250 }}
        accent="12 91 239"
        onOpen={() => setOpen('objetivos')}
      />
      </div>
      <RecordModal
        ids={['objetivos']}
        openId={open}
        onOpenChange={setOpen}
        title={t({ es: 'Objetivos · Administrador', en: 'Goals · Admin' })}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c5bef] font-mono text-xs font-semibold text-white">Ob</span>}
        description={t({ es: 'El producto en vivo · el menú y la barra no navegan fuera de Objetivos', en: 'The live product · menu and bar don’t leave Goals' })}
      >
        {open && <ModuleOnly />}
      </RecordModal>
    </>
  )
}
