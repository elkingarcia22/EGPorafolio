'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'

/** La documentación real en el modal de registro: las flechas pasan de sección en sección. */
function DocsModal({ openId, onOpenChange }: { openId: string | null; onOpenChange: (id: string | null) => void }) {
  const { t } = useLocale()
  const { pages } = THEMA_CASE.demo
  const page = pages.find((p) => p.id === openId)
  return (
    <RecordModal
      ids={pages.map((p) => p.id)}
      openId={openId}
      onOpenChange={onOpenChange}
      title={page ? `Thema · ${t(page.name)}` : 'Thema'}
      titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f0ce86] to-[#3f72d8] font-mono text-xs font-semibold text-[#141210]">Th</span>}
      description={page?.url.replace('https://', '')}
      actions={page && <NewTabLink href={page.url} />}
      prevLabel={t({ es: 'Sección anterior', en: 'Previous section' })}
      nextLabel={t({ es: 'Sección siguiente', en: 'Next section' })}
    >
      {page && <iframe key={page.id} src={page.url} title={t({ es: 'Documentación de Thema, en vivo', en: 'Thema docs, live' })} className="w-full flex-1 bg-[#141210]" />}
    </RecordModal>
  )
}

/** 08 · Demo: la documentación real, en una vista previa que se abre a pantalla completa. */
export function ThemaDemo() {
  const { t } = useLocale()
  const { demo } = THEMA_CASE
  const [open, setOpen] = useState<string | null>(null)

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
              <button type="button" onClick={() => setOpen(p.id)} className="mono-label border border-fg/25 px-3 py-2 transition-colors hover:border-signal hover:bg-signal hover:text-paper">
                {t(p.name)} ↗
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={() => setOpen(demo.pages[0].id)} data-reveal="device" className="group relative block w-full [perspective:1800px]">
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

      <DocsModal openId={open} onOpenChange={setOpen} />
    </div>
  )
}
