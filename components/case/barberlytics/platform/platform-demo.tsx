'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { RecordModal } from '@/components/case/kit/record-modal'

const DEMO_ID = 'calendario'
/** Se entra como recepción, directo al calendario */
const DEMO_URL = `${PLATFORM_CASE.demo.base}?rol=recepcion&ir=${encodeURIComponent('/calendario')}`
/**
 * Lo que queda fuera del calendario en la app: la barra de arriba (buscar,
 * comentarios, entrada, avisos, cuenta) y, desde 1024 px de ancho, el riel de
 * navegación de la izquierda. Medidas de la app (px).
 */
const APP = { header: 56, rail: 64, railFrom: 1024 }

/** Tapa lo que no es el calendario: se ve, pero no se puede tocar. */
function Blocker({ className, style, label }: { className: string; style?: React.CSSProperties; label?: string }) {
  return (
    <div className={`absolute z-10 flex cursor-not-allowed items-center justify-center bg-[#0d0b09]/70 backdrop-blur-[2px] ${className}`} style={style} aria-hidden="true">
      {label && (
        <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/55">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
          {label}
        </span>
      )}
    </div>
  )
}

/** El calendario real en el modal; todo lo demás de la app queda bloqueado. */
function CalendarModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useLocale()
  const frameRef = useRef<HTMLDivElement>(null)
  const [wide, setWide] = useState(true)

  useEffect(() => {
    const el = frameRef.current
    if (!open || !el) return
    const ro = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= APP.railFrom))
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])

  return (
    <RecordModal
      ids={[DEMO_ID]}
      openId={open ? DEMO_ID : null}
      onOpenChange={(id) => onOpenChange(id !== null)}
      title={t({ es: 'Calendario de Barberlytics', en: 'Barberlytics calendar' })}
      titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d9b36a] font-mono text-xs font-semibold text-[#16130f]">Bl</span>}
      description={t({ es: 'Datos de prueba · solo el calendario', en: 'Test data · calendar only' })}
    >
      {open && (
        <div ref={frameRef} className="relative flex w-full flex-1">
          <iframe src={DEMO_URL} title={t({ es: 'Calendario de Barberlytics, en vivo', en: 'Barberlytics calendar, live' })} className="w-full flex-1 bg-[#121009]" />
          <Blocker className="inset-x-0 top-0" style={{ height: APP.header }} label={t({ es: 'Solo el calendario en esta demo', en: 'Calendar only in this demo' })} />
          {wide && <Blocker className="bottom-0 left-0" style={{ top: APP.header, width: APP.rail }} />}
        </div>
      )}
    </RecordModal>
  )
}

/**
 * 07 · Demo: el nodo que recibe la fibra de «Impacto» abre el calendario real,
 * con datos de prueba. Solo el calendario: el resto de la app queda bloqueado.
 */
export function PlatformDemo() {
  const { t } = useLocale()
  const { demo } = PLATFORM_CASE
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
      {/* El nodo: late, como una señal que espera que alguien entre */}
      <span aria-hidden="true" className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(217,179,106,0.35),transparent_70%)]" />
        <span className="absolute inset-2 rounded-full border border-[#d9b36a]/60 animate-[nav-node-ping_2.4s_cubic-bezier(0,0,.2,1)_infinite]" />
        <span className="relative h-4 w-4 rounded-full border border-white bg-[#fffaf0] shadow-[0_0_0_5px_rgba(217,179,106,0.25),0_0_24px_6px_rgba(217,179,106,0.7)]" />
      </span>

      <h3 className="mt-8 text-balance text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-light leading-[1.1] tracking-tight">
        {t({ es: 'Pruébalo en vivo.', en: 'Try it live.' })}
      </h3>
      <p className="mt-4 max-w-[54ch] text-balance text-base leading-relaxed text-paper/65 md:text-lg">
        {t({ es: 'El calendario real, con datos de prueba. Lo que muevas vive solo en tu pestaña.', en: 'The real calendar, with test data. Anything you move lives only in your tab.' })}
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d9b36a] px-6 py-3 text-sm font-medium text-[#16130f] shadow-[0_0_30px_-6px_rgba(217,179,106,0.8)] transition-transform duration-300 ease-expo hover:-translate-y-0.5"
      >
        {t({ es: 'Abrir el calendario', en: 'Open the calendar' })}
      </button>

      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-paper/45">
        {demo.tryIt.map((tip) => (
          <li key={tip.label.es}>
            {t(tip.label)} <span className="text-[#d9b36a]">→</span> {t(tip.value)}
          </li>
        ))}
      </ul>

      <CalendarModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
