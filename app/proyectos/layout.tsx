import { BackToTop } from '@/components/ui/back-to-top'
import { ScreenshotZoom } from '@/components/ui/zoom/screenshot-zoom'

/** Todas las páginas de proyecto comparten el botón para volver arriba y, en el teléfono, el visor para ampliar las pantallas. */
export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BackToTop />
      <ScreenshotZoom />
    </>
  )
}
