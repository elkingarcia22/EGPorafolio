'use client'

import { useState, useEffect } from 'react'

export const LanguageToggle = () => {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    // Cargar idioma desde localStorage si existe
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    
    // Aquí puedes agregar lógica para cambiar el idioma de la aplicación
    console.log(`Idioma cambiado a: ${newLanguage}`)
  }

  return (
    <button 
      onClick={toggleLanguage}
      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 text-sm font-light"
    >
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
