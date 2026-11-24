'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { RecordModal } from '@/components/case/kit/record-modal'
import { SHOTS } from '@/lib/content/cases/encuestas/case'
import { UBITS_BLUE } from './shared'
import { CaseDemo } from '@/components/case/kit/case-demo'

/** El playground de UBITS publicado desde la rama `staging`. */
const STAGING = 'https://staging-playground.ubits.co'
const MODULE = '/admin/desempeno-cultura/encuestas'
/** `ver=todos` enciende también lo que llega en Q1 2027 (IA, accionables, «Para atender»); `marcas=no` quita los chips «Nuevo». */
const FLAGS = '?ver=todos&marcas=no'

/**
 * El marco del playground se ve completo, pero el riel de navegación (72 px) y la barra superior (60 px), que llevan a
 * los demás productos de la plataforma, quedan bajo una capa que no deja tocarlos: solo se puede usar Encuestas.
 */
const RAIL = 72
const TOPBAR = 60
/** `NARROW_WINDOW` del RootLayout del playground. */
const NARROW_WINDOW = 1200
/** Por debajo de este ancho del modal el playground se ve a tamaño real, con su diseño de celular. */
const PHONE_MAX = 768

interface Entry {
  id: string
  path: string
  name: L
  hint: L
}

/** Una sola entrada: el inicio de Encuestas. Desde ahí se navega por todo el módulo. */
const ENTRIES: readonly Entry[] = [
  { id: 'inicio', path: '', name: { es: 'Encuestas', en: 'Surveys' }, hint: { es: 'El módulo completo, desde su inicio', en: 'The whole module, from its home' } },
]

const urlOf = (e: Entry) => `${STAGING}${MODULE}${e.path}${FLAGS}`

/** El playground real con el riel plegado, escalado a todo el ancho, con su marco a la vista y solo Encuestas para tocar. */
function StagingFrame({ entry }: { entry: Entry }) {
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

  // El playground se dibuja a 1.199 px, justo bajo el `NARROW_WINDOW` de su RootLayout, para que el menú quede plegado
  // al riel de 72 px; después se escala al ancho del modal, sin márgenes. En el celular se dibuja a su ancho real, sin
  // escalar: el playground es responsivo y así se lee y se toca como en un teléfono, en vez de encoger el escritorio.
  const native = size !== null && size.w < PHONE_MAX
  const width = size ? (native ? size.w : NARROW_WINDOW - 1) : NARROW_WINDOW - 1
  const scale = size && !native ? size.w / width : 1
  const height = size ? size.h / scale : 800

  return (
    <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-white">
      {!loaded && (
        <p className="absolute inset-0 flex items-center justify-center gap-3 font-mono text-xs text-[#5c646f]" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0c5bef] border-t-transparent" />
          {t({ es: 'Abriendo Encuestas…', en: 'Opening Surveys…' })}
        </p>
      )}
      {size && (
        <iframe
          key={entry.id}
          src={urlOf(entry)}
          title={t({ es: `Encuestas: ${entry.name.es}`, en: `Surveys: ${entry.name.en}` })}
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500"
          style={{ width, height, transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
        />
      )}
      {/* Capas invisibles sobre el riel y la barra superior: se ven, pero no llevan a otros productos. */}
      {size && (
        <>
          {/* En el celular no hay riel: el menú se abre desde la barra superior, que queda entera bajo la capa. */}
          {!native && <span className="absolute left-0 top-0 h-full cursor-not-allowed" style={{ width: RAIL * scale }} aria-hidden="true" />}
          <span className="absolute right-0 top-0 cursor-not-allowed" style={{ left: native ? 0 : RAIL * scale, height: TOPBAR * scale }} aria-hidden="true" />
        </>
      )}
    </div>
  )
}

/** 08 · Demo: el módulo real de Encuestas en staging, solo el módulo, sin el resto de la plataforma. */
export function SurveyDemo() {
  const { t } = useLocale()
  const [open, setOpen] = useState<string | null>(null)
  const entry = ENTRIES.find((e) => e.id === open)

  return (
    <>
      {/* La columna de la demo no debe crecer con la URL larga de la barra: en celular el texto se salía por la derecha. */}
      <div className="max-lg:[&>div]:grid-cols-[minmax(0,1fr)]">
      <CaseDemo
        title={{ es: 'El módulo real de Encuestas.', en: 'The real Surveys module.' }}
        lead={{
          es: 'Es el producto construido, en vivo y con datos de prueba. Se ve la plataforma completa, pero solo está habilitado Encuestas. Recórrelo como quieras: crear, leer resultados, la NOM 035 o comparar.',
          en: 'This is the built product, live and with test data. You see the whole platform, but only Surveys is enabled. Explore freely: create, read results, NOM 035 or compare.',
        }}
        url={`ubits · ${MODULE}`}
        image={{ src: SHOTS.lista.src, width: SHOTS.lista.width, height: SHOTS.lista.height }}
        accent="64 96 255"
        onOpen={() => setOpen(ENTRIES[0].id)}
      />
      </div>
      <RecordModal
        ids={ENTRIES.map((e) => e.id)}
        openId={open}
        onOpenChange={setOpen}
        title={t({ es: 'Encuestas · el producto en vivo', en: 'Surveys · the live product' })}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold text-white" style={{ background: UBITS_BLUE }}>En</span>}
        description={entry ? `ubits · ${MODULE}${entry.path}` : undefined}
        actions={
          entry && (
            <a href={urlOf(entry)} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-md border border-white/15 px-3 font-mono text-[11px] text-white/75 hover:bg-white/10">
              {t({ es: 'Pestaña nueva', en: 'New tab' })} ↗
            </a>
          )
        }
              >
        {entry && <StagingFrame key={entry.id} entry={entry} />}
      </RecordModal>
    </>
  )
}
