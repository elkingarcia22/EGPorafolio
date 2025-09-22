import React, { createContext, useContext, useState, ReactNode } from 'react'

// Mock translations para Storybook
const mockTranslations = {
  es: {
    nav: {
      home: 'Inicio',
      about: 'Acerca de mí',
      contact: 'Contacto',
      admin: 'Administrador'
    },
    home: {
      myWork: 'Mi trabajo'
    },
    about: {
      title: 'Acerca de mí'
    },
    contact: {
      title: 'Contacto'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin'
    },
    home: {
      myWork: 'My Work'
    },
    about: {
      title: 'About Me'
    },
    contact: {
      title: 'Contact'
    }
  }
}

interface LanguageContextType {
  language: 'es' | 'en'
  setLanguage: (lang: 'es' | 'en') => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'es' | 'en'>('es')

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = mockTranslations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}