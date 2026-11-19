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
 * El marco del playground que se recorta para dejar solo el módulo: el riel de navegación (72 px) y la barra
 * superior (60 px) llevan a los demás productos de la plataforma; sin ellos, la demo solo puede moverse dentro
 * de Encuestas.
 */
const RAIL = 72
const TOPBAR = 60

interface Entry {
  id: string
  path: string
  name: L
  hint: L
}

const ENTRIES: readonly Entry[] = [
  { id: 'inicio', path: '', name: { es: 'Inicio de Encuestas', en: 'Surveys home' }, hint: { es: 'Atajos para crear, plantillas NOM 035, «Para atender» y la lista', en: 'Create shortcuts, NOM 035 templates, “To address” and the list' } },
  { id: 'crear', path: '/crear', name: { es: 'Crear una encuesta', en: 'Create a survey' }, hint: { es: 'Los cinco pasos, con el agente «Crear con IA»', en: 'The five steps, with the “Create with AI” agent' } },
  { id: 'publica', path: '/c2026-1/resultados', name: { es: 'Resultados de una encuesta pública', en: 'Results of a public survey' }, hint: { es: 'Participación, favorabilidad, mapa de calor, eNPS, IA y accionables', en: 'Participation, favorability, heatmap, eNPS, AI and actions' } },
  { id: 'anonima', path: '/open-cultura-ola2-2026/resultados', name: { es: 'Resultados de una encuesta anónima', en: 'Results of an anonymous survey' }, hint: { es: 'Los grupos por debajo del mínimo quedan reservados', en: 'Groups below the minimum stay reserved' } },
  { id: 'nom035', path: '/nom035-riesgo-2026/resultados', name: { es: 'NOM 035 · riesgo psicosocial', en: 'NOM 035 · psychosocial risk' }, hint: { es: 'Riesgo por categoría y dominio, y los reportes de la norma', en: 'Risk by category and domain, and the standard’s reports' } },
  { id: 'comparativo', path: '/comparativo', name: { es: 'Comparar mediciones', en: 'Compare measurements' }, hint: { es: 'Dos o más ciclos lado a lado', en: 'Two or more cycles side by side' } },
]

const urlOf = (e: Entry) => `${STAGING}${MODULE}${e.path}${FLAGS}`

/** El playground real a escala de escritorio, recortado al módulo: se ve igual en cualquier ancho de pantalla. */
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

  // Bajo 1.200 px de ventana el playground pliega su menú al riel de 72 px (RootLayout, NARROW_WINDOW), que es lo que
  // se recorta: por eso el iframe mide 1.196 en total. En pantallas angostas se dibuja a 1.024 para no quedar diminuto.
  const logical = (size && size.w < 768 ? 1024 : 1196) - RAIL
  const scale = size ? size.w / logical : 1
  const height = size ? size.h / scale : 800

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
          style={{
            width: logical + RAIL,
            height: height + TOPBAR,
            transform: `translate(${-RAIL * scale}px, ${-TOPBAR * scale}px) scale(${scale})`,
            opacity: loaded ? 1 : 0,
          }}
        />
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
              es: 'Es el playground de UBITS publicado desde la rama staging, con datos de prueba. Solo está habilitado Encuestas: el menú de la plataforma y la barra superior quedan fuera, así que todo lo que se puede tocar es crear, leer resultados, la NOM 035 y comparar.',
              en: 'This is the UBITS playground published from the staging branch, with test data. Only Surveys is enabled: the platform menu and top bar are left out, so everything you can touch is creating, reading results, NOM 035 and comparing.',
            })}
          </p>
        </div>
        <ul data-reveal className="grid gap-2 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {ENTRIES.map((e, i) => (
            <li key={e.id}>
              <button type="button" onClick={() => setOpen(e.id)} className="group flex w-full items-baseline gap-3 border border-fg/25 px-4 py-2.5 text-left transition-colors hover:border-signal hover:bg-signal hover:text-paper">
                <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block">{t(e.name)} ↗</span>
                  <span className="block truncate text-xs opacity-60">{t(e.hint)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
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
        title={entry ? `Encuestas · ${t(entry.name)}` : 'Encuestas'}
        titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold text-white" style={{ background: UBITS_BLUE }}>En</span>}
        description={entry ? `staging-playground.ubits.co${MODULE}${entry.path}` : undefined}
        actions={
          entry && (
            <a href={urlOf(entry)} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-md border border-white/15 px-3 font-mono text-[11px] text-white/75 hover:bg-white/10">
              {t({ es: 'Pestaña nueva', en: 'New tab' })} ↗
            </a>
          )
        }
        prevLabel={t({ es: 'Pantalla anterior', en: 'Previous screen' })}
        nextLabel={t({ es: 'Pantalla siguiente', en: 'Next screen' })}
      >
        {entry && <StagingFrame key={entry.id} entry={entry} />}
      </RecordModal>
    </div>
  )
}
