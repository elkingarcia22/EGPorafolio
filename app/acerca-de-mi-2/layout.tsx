'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/contexts/language-context'
import { AdminProvider } from '@/contexts/admin-context'

export default function AcercaDeMi2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AdminProvider>
          {children}
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
