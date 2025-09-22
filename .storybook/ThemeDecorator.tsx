import React from 'react'
import { ThemeProvider } from 'next-themes'
import { AdminProvider } from './mocks/admin-context'
import { LanguageProvider } from './mocks/language-context'

export const ThemeDecorator = (Story: any, context: any) => {
  const theme = context.globals.theme || 'light'
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AdminProvider>
          <div className={theme === 'dark' ? 'dark' : ''}>
            <Story />
          </div>
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
