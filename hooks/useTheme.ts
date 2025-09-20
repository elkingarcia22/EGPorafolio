'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light'
  }
}
