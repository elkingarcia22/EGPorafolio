'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getLenis } from '@/lib/motion'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'

type DocsPage = (typeof THEMA_CASE.demo.pages)[number]

/** La documentación real a pantalla completa, con pestañas por sección. */
function FullscreenDocs({ initial, onClose }: { initial: DocsPage; onClose: () => void }) {
  const { t } = useLocale()
  const { demo } = THEMA_CASE
  const [page, setPage] = useState(initial)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = prev
      lenis?.start()
    }
  }, [onClose])

  return (
    <div role="dialog" aria-modal="true" aria-label={t({ es: 'Documentación de Thema', en: 'Thema docs' })} className="fixed inset-0 z-[100] flex flex-col bg-[#0b0c0e]">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-2.5 text-paper">
        <span className="font-mono text-[11px] text-white/50">Thema · {t({ es: 'documentación', en: 'docs' })}</span>
        <div role="tablist" aria-label={t({ es: 'Sección', en: 'Section' })} className="flex flex-wrap gap-1">
          {demo.pages.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={page.id === p.id}
              onClick={() => setPage(p)}
              className="rounded-md px-3 py-1.5 font-mono text-[11px] text-white/60 transition-colors hover:bg-white/10 hover:text-white aria-selected:bg-white/15 aria-selected:text-white"
            >
              {t(p.name)}
            </button>
          ))}
        </div>
        <a href={page.url} target="_blank" rel="noopener noreferrer" className="ml-auto font-mono text-[11px] text-white/60 hover:text-white">
          {t({ es: 'Nueva pestaña', en: 'New tab' })} ↗
        </a>
        <button ref={closeRef} type="button" onClick={onClose} className="rounded-md border border-white/20 px-3 py-1.5 font-mono text-[11px] text-white transition-colors hover:bg-white hover:text-black">
          {t({ es: 'Cerrar', en: 'Close' })} · Esc
        </button>
      </div>
      <iframe key={page.id} src={page.url} title={t({ es: 'Documentación de Thema, en vivo', en: 'Thema docs, live' })} className="w-full flex-1 bg-[#141210]" />
    </div>
  )
}

/** 08 · Demo: la documentación real, en una vista previa que se abre a pantalla completa. */
export function ThemaDemo() {
  const { t } = useLocale()
  const { demo } = THEMA_CASE
  const [open, setOpen] = useState<DocsPage | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'Explóralo tú.', en: 'Explore it yourself.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(demo.lead)}</p>
        </div>
        <ul data-reveal className="flex flex-wrap gap-2 lg:col-span-5 lg:justify-end">
          {demo.pages.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setOpen(p)} className="mono-label border border-fg/25 px-3 py-2 transition-colors hover:border-signal hover:bg-signal hover:text-paper">
                {t(p.name)} ↗
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={() => setOpen(demo.pages[0])} data-reveal="device" className="group relative block w-full [perspective:1800px]">
        <span className="block overflow-hidden rounded-xl bg-[#0b0c0e] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-700 ease-expo [transform:rotateX(8deg)] group-hover:[transform:none]">
          <span className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex h-5 flex-1 items-center rounded-md bg-white/[0.06] px-2 font-mono text-[10px] text-white/45">barberlytics.vercel.app/docs</span>
          </span>
          <Image src="/cases/barberlytics/theme-premium.webp" width={1400} height={817} alt="" sizes="(min-width: 1024px) 70vw, 100vw" className="block h-auto w-full transition-[filter] duration-500 group-hover:brightness-75" />
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-3 bg-void/85 px-6 py-4 text-paper backdrop-blur transition-colors group-hover:bg-signal">
            <span className="mono-label">⤢ {t({ es: 'Abrir la documentación a pantalla completa', en: 'Open the docs full screen' })}</span>
          </span>
        </span>
      </button>

      {open && <FullscreenDocs initial={open} onClose={close} />}
    </div>
  )
}
