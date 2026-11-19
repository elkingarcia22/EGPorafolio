'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'

const DOCS_ID = 'docs'

/** La documentación real en el modal: una sola vista, sin pasar de página. */
function DocsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLocale()
  const url = THEMA_CASE.demo.open
  return (
    <RecordModal
      ids={[DOCS_ID]}
      openId={open ? DOCS_ID : null}
      onOpenChange={(id) => id === null && onClose()}
      title={t({ es: 'Thema · Sistema de diseño', en: 'Thema · Design system' })}
      titleLeading={<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f0ce86] to-[#3f72d8] font-mono text-xs font-semibold text-[#141210]">Th</span>}
      description="barberlytics.vercel.app/docs"
      actions={<NewTabLink href={url} />}
    >
      <iframe src={url} title={t({ es: 'Documentación de Thema, en vivo', en: 'Thema docs, live' })} className="w-full flex-1 bg-[#141210]" />
    </RecordModal>
  )
}

/** 08 · Demo: la documentación real, en una vista previa que se abre a pantalla completa. */
export function ThemaDemo() {
  const { t } = useLocale()
  const { demo } = THEMA_CASE
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] font-light leading-tight">{t({ es: 'Explóralo tú.', en: 'Explore it yourself.' })}</p>
          <p data-reveal className="mt-4 leading-relaxed opacity-80">{t(demo.lead)}</p>
        </div>
      </div>

      <button type="button" onClick={() => setOpen(true)} data-reveal="device" className="group relative block w-full [perspective:1800px]">
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

      <DocsModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
