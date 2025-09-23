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
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 text-sm font-normal group relative"
      >
        {language === 'es' ? 'EN' : 'ES'}
      </button>
    </Tooltip>
  )
}
