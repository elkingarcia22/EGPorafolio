'use client'

import { useLanguage } from '@/contexts/language-context'

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es'
    console.log('🔄 Cambiando idioma de', language, 'a', newLanguage)
    setLanguage(newLanguage)
  }

  return (
    <button 
      onClick={toggleLanguage}
      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 text-sm font-normal"
    >
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
