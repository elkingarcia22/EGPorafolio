'use client'

import { NeuromorphicEG } from '@/components/neuromorphic-eg'
import { MinimalMenu } from '@/components/minimal-menu'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      {/* Menú minimalista funcional */}
      <div className="absolute top-8 left-8 z-50">
        <MinimalMenu />
      </div>

      {/* Toggle de tema en la parte superior derecha */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
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
      
      {/* EG neuromórfico como elementos reales - subido */}
      <div className="pt-8">
        <NeuromorphicEG />
      </div>
    </div>
  );
}
