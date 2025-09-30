'use client'

import { useLanguage } from '@/contexts/language-context'
import { designTokens } from '@/lib/design-tokens'
import { Tooltip } from './ui/tooltip'

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es'
    console.log('🔄 Cambiando idioma de', language, 'a', newLanguage)
    setLanguage(newLanguage)
  }

  return (
    <Tooltip content={language === 'es' ? 'Cambiar a inglés' : 'Change to Spanish'}>
      <button 
        onClick={toggleLanguage}
        className="p-2 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </button>
    </Tooltip>
  )
}
