'use client'

import { MinimalMenu } from './minimal-menu'
import { LanguageToggle } from './language-toggle'
import { AccessibilityToolbar } from './accessibility-toolbar'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface NavbarProps {
  onAdminClick: () => void
}

export const Navbar = ({ onAdminClick }: NavbarProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  console.log('Navbar rendered with onAdminClick:', typeof onAdminClick)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <MinimalMenu onAdminClick={onAdminClick} />
        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <AccessibilityToolbar />
          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            {isDark ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
