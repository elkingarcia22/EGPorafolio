'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLocale, type L } from '@/lib/i18n'
import { RecordModal } from '@/components/case/kit/record-modal'
import { SHOTS } from '@/lib/content/cases/encuestas/case'
import { UBITS_BLUE } from './shared'

/** El playground de UBITS publicado desde la rama `staging`. */
const STAGING = 'https://staging-playground.ubits.co'
const MODULE = '/admin/desempeno-cultura/encuestas'
/** `ver=todos` enciende también lo que llega en Q1 2027 (IA, accionables, «Para atender»). */
const FLAGS = '?ver=todos'

/**
 * El marco del playground se ve completo, pero el riel de navegación (72 px) y la barra superior (60 px), que llevan a
 * los demás productos de la plataforma, quedan bajo una capa que no deja tocarlos: solo se puede usar Encuestas.
 */
const RAIL = 72
const TOPBAR = 60

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

/** El playground real a escala de escritorio, con todo su marco a la vista y solo Encuestas para tocar. */
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

  // Bajo 1.200 px de ventana el playground pliega su menú al riel de 72 px (RootLayout, NARROW_WINDOW): por eso el
  // iframe mide 1.196. En pantallas angostas se dibuja a 1.024 para no quedar diminuto.
  const width = size && size.w < 768 ? 1024 : 1196
  const scale = size ? size.w / width : 1
  const height = size ? size.h / scale : 800
  const [hint, setHint] = useState(false)
  const blocked = t({ es: 'En esta demo solo está habilitado Encuestas', en: 'Only Surveys is enabled in this demo' })

  return (
    <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-[#f8faff]">
      {!loaded && (
        <p className="absolute inset-0 flex items-center justify-center gap-3 font-mono text-xs text-[#5c646f]" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0c5bef] border-t-transparent" />
          {t({ es: 'Abriendo el playground en staging…', en: 'Opening the playground on staging…' })}
        </p>
      )}
      {size && (
        <iframe
          key={entry.id}
          src={urlOf(entry)}
          title={t({ es: `Encuestas en staging: ${entry.name.es}`, en: `Surveys on staging: ${entry.name.en}` })}
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500"
          style={{ width, height, transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
        />
      )}
      {/* Capas que tapan los clics del riel y de la barra superior: se ven, pero no llevan a otros productos. */}
      {size && (
        <>
          <span
            className="absolute left-0 top-0 h-full cursor-not-allowed"
            style={{ width: RAIL * scale }}
            onPointerEnter={() => setHint(true)}
            onPointerLeave={() => setHint(false)}
            title={blocked}
            aria-hidden="true"
          />
          <span
            className="absolute top-0 cursor-not-allowed"
            style={{ left: RAIL * scale, right: 0, height: TOPBAR * scale }}
            onPointerEnter={() => setHint(true)}
            onPointerLeave={() => setHint(false)}
            title={blocked}
            aria-hidden="true"
          />
          <p className={`pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-[#303a47] px-3 py-1.5 text-[11px] text-white shadow-lg transition-opacity duration-200 ${hint ? 'opacity-100' : 'opacity-0'}`} role="status">
            🔒 {blocked}
          </p>
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
    <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'El módulo real, en staging.', en: 'The real module, on staging.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">
            {t({
              es: 'Es el playground de UBITS publicado desde la rama staging, con datos de prueba. Se ve la plataforma completa, pero solo está habilitado Encuestas: el menú y la barra superior no llevan a ningún lado. Ábrelo y recórrelo como quieras: crear, leer resultados, la NOM 035 o comparar.',
              en: 'This is the UBITS playground published from the staging branch, with test data. You see the whole platform, but only Surveys is enabled: the menu and top bar don’t go anywhere. Open it and explore freely: create, read results, NOM 035 or compare.',
            })}
          </p>
        </div>
      </div>

      <button type="button" onClick={() => setOpen(ENTRIES[0].id)} data-reveal="device" className="group relative block w-full [perspective:1800px]">
        <span className="block overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-700 ease-expo [transform:rotateX(8deg)] group-hover:[transform:none]">
          <span className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex h-5 min-w-0 flex-1 items-center truncate rounded-md bg-white/[0.06] px-2 font-mono text-[10px] text-white/45">staging-playground.ubits.co{MODULE}</span>
          </span>
          <Image src={SHOTS.lista.src} width={SHOTS.lista.width} height={SHOTS.lista.height} alt="" sizes="(min-width: 1024px) 70vw, 100vw" className="block h-auto w-full transition-[filter] duration-500 group-hover:brightness-75" />
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-3 bg-void/85 px-6 py-4 text-paper backdrop-blur transition-colors group-hover:bg-signal">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#43a970]" aria-hidden="true" />
            <span className="mono-label">⤢ {t({ es: 'Abrir Encuestas en vivo', en: 'Open Surveys live' })}</span>
          </span>
        </span>
      </button>

      <RecordModal
        ids={ENTRIES.map((e) => e.id)}
        openId={open}
        onOpenChange={setOpen}
        title={t({ es: 'Encuestas · en vivo, en staging', en: 'Surveys · live, on staging' })}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold text-white" style={{ background: UBITS_BLUE }}>En</span>}
        description={entry ? `staging-playground.ubits.co${MODULE}${entry.path}` : undefined}
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
    </div>
  )
}
