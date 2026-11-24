import { BackToTop } from '@/components/ui/back-to-top'

/** Todas las páginas de proyecto comparten el botón para volver arriba. */
export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  )
}
