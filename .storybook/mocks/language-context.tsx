import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

// Mock del LanguageContext para Storybook
const LanguageContext = createContext({
  language: 'es' as 'es' | 'en',
  setLanguage: (lang: 'es' | 'en') => {},
  t: (key: string) => key
})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback para Storybook
    return {
      language: 'es' as 'es' | 'en',
      setLanguage: (lang: 'es' | 'en') => {},
      t: (key: string) => key
    }
  }
  return context
}

// Mock Provider para Storybook
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<'es' | 'en'>('es')
  
  const handleSetLanguage = useCallback((newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage)
  }, [])
  
  const t = useCallback((key: string) => {
    // Mock translations para Storybook
    const translations: Record<string, Record<string, string>> = {
      es: {
        'nav.home': 'Inicio',
        'nav.about': 'Acerca de mí',
        'nav.contact': 'Contacto',
        'nav.admin': 'Administrador',
        'home.myWork': 'Mi trabajo',
        'language.es': 'Español',
        'language.en': 'Inglés',
        'language.toggle': 'Cambiar Idioma',
        'accessibility.title': 'Accesibilidad',
        'accessibility.fontSize': 'Tamaño de Fuente',
        'accessibility.highContrast': 'Alto Contraste',
        'accessibility.reducedMotion': 'Movimiento Reducido',
        'accessibility.screenReader': 'Lector de Pantalla',
        'accessibility.info': 'Ajusta la configuración de accesibilidad.',
        'accessibility.on': 'Activado',
        'accessibility.off': 'Desactivado',
        'admin.title': 'Panel de Administración',
        'admin.subtitle': 'Gestiona el contenido de tu sitio web',
        'admin.password': 'Contraseña',
        'admin.login': 'Iniciar Sesión',
        'admin.backToSite': 'Volver al Sitio',
        'admin.error': 'Contraseña incorrecta',
        'about.title': 'Acerca de mí',
        'contact.title': 'Contacto'
      },
      en: {
        'nav.home': 'Home',
        'nav.about': 'About Me',
        'nav.contact': 'Contact',
        'nav.admin': 'Administrator',
        'home.myWork': 'My Work',
        'language.es': 'Spanish',
        'language.en': 'English',
        'language.toggle': 'Change Language',
        'accessibility.title': 'Accessibility',
        'accessibility.fontSize': 'Font Size',
        'accessibility.highContrast': 'High Contrast',
        'accessibility.reducedMotion': 'Reduced Motion',
        'accessibility.screenReader': 'Screen Reader',
        'accessibility.info': 'Adjust accessibility settings.',
        'accessibility.on': 'On',
        'accessibility.off': 'Off',
        'admin.title': 'Administration Panel',
        'admin.subtitle': 'Manage your website content',
        'admin.password': 'Password',
        'admin.login': 'Login',
        'admin.backToSite': 'Back to Site',
        'admin.error': 'Incorrect password',
        'about.title': 'About Me',
        'contact.title': 'Contact'
      }
    }
    
    return translations[language]?.[key] || key
  }, [language])
  
  const contextValue = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t
  }), [language, handleSetLanguage, t])
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export { LanguageContext }
