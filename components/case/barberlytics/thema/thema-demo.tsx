'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'
import { ThemeShowcase } from './theme-showcase'
import { ChapterHead } from './chapter-head'

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

/**
 * 08 · Demo de Thema: un sistema de diseño sí se puede mostrar. La portada real
 * de la documentación cambia sola de tema (o al tocar un color) y un botón abre
 * la documentación en vivo.
 */
export function ThemaDemo() {
  const { t } = useLocale()
  const { chapters, demo } = THEMA_CASE
  const [open, setOpen] = useState(false)

  return (
    <div>
      <ChapterHead phrase={t(chapters.demo.phrase)} lead={t(chapters.demo.lead)} />
      <div className="mx-auto max-w-[920px]">
        <ThemeShowcase auto tilt="perspective(1800px) rotateX(6deg)" sizes="(min-width: 1024px) 920px, 100vw" />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2.5 rounded-full bg-signal py-2.5 pl-4 pr-5 text-sm font-medium text-on-signal shadow-[0_0_30px_-6px_rgb(var(--signal)/0.8)] transition-transform duration-300 ease-expo hover:-translate-y-0.5"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
            {t({ es: 'Abrir la documentación en vivo', en: 'Open the live docs' })}
          </button>
          <a
            href={demo.open}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-sm text-paper/85 transition-colors duration-300 hover:border-white/40 hover:text-paper"
          >
            {t({ es: 'En una pestaña nueva', en: 'In a new tab' })} ↗
          </a>
        </div>
      </div>
      <DocsModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
