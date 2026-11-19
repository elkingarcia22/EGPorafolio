'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { NewTabLink, RecordModal } from '@/components/case/kit/record-modal'
import { CaseDemo } from '@/components/case/kit/case-demo'

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
  const { demo } = THEMA_CASE
  const [open, setOpen] = useState(false)

  return (
    <>
      <CaseDemo
        title={{ es: 'Explora Thema, el sistema de diseño.', en: 'Explore Thema, the design system.' }}
        lead={demo.lead}
        url="barberlytics.vercel.app/docs"
        image={{ src: '/cases/barberlytics/theme-premium.webp', width: 1400, height: 817 }}
        accent={'217 179 106'}
        onOpen={() => setOpen(true)}
      />
      <DocsModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
