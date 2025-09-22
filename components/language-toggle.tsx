'use client'

import { useLanguage } from '@/contexts/language-context'

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage()

  console.log('🔘 LanguageToggle renderizado, idioma actual:', language)

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es'
    console.log('🔄 LanguageToggle: cambiando de', language, 'a', newLanguage)
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
