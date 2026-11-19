'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'

/**
 * 08 · Demo: la documentación real de Thema dentro de un navegador. El iframe
 * se carga solo al pedirlo; las pestañas llevan a cada sección.
 */
export function ThemaDemo() {
  const { t } = useLocale()
  const { demo } = THEMA_CASE
  const [page, setPage] = useState(demo.pages[0])
  const [started, setStarted] = useState(false)

  return (
    <div>
      <div className="mb-8 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'Explóralo tú.', en: 'Explore it yourself.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(demo.lead)}</p>
        </div>
        <a data-reveal href={demo.open} target="_blank" rel="noopener noreferrer" className="mono-label opacity-70 underline-offset-4 hover:underline hover:opacity-100 lg:col-span-5 lg:text-right">
          {t({ es: 'Abrir en una pestaña nueva', en: 'Open in a new tab' })} ↗
        </a>
      </div>

      <div data-reveal="device" className="overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <div role="tablist" aria-label={t({ es: 'Sección de la documentación', en: 'Docs section' })} className="flex flex-wrap gap-1">
            {demo.pages.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={page.id === p.id}
                onClick={() => {
                  setPage(p)
                  setStarted(true)
                }}
                className="rounded-md px-3 py-1.5 font-mono text-[11px] text-white/60 transition-colors hover:bg-white/10 hover:text-white aria-selected:bg-white/15 aria-selected:text-white"
              >
                {t(p.name)}
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-[760px] max-h-[80vh]">
          {started ? (
            <iframe key={page.id} src={page.url} title={t({ es: 'Documentación de Thema, en vivo', en: 'Thema docs, live' })} className="h-full w-full bg-[#141210]" />
          ) : (
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="group absolute inset-0 flex items-end justify-center bg-[url('/cases/barberlytics/theme-premium.webp')] bg-cover bg-top pb-16"
            >
              <span className="bg-void/85 px-6 py-3.5 text-paper backdrop-blur transition-colors group-hover:bg-signal">
                <span className="mono-label">▶ {t({ es: 'Abrir la documentación aquí', en: 'Open the docs here' })}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
