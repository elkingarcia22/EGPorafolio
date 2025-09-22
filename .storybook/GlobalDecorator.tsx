import React from 'react'
import { ThemeProvider } from 'next-themes'

// Mock AdminContext
const mockAdminContent = {
  typewriterTexts: [
    'Diseñador UX/UI',
    'Desarrollador Frontend',
    'Estrategia Digital',
    'Innovador Tecnológico'
  ],
  projectTitles: [
    'UX Research',
    'UI Design',
    'Estrategia Digital',
    'Diseño con IA'
  ],
  projectDescriptions: [
    'Investigación profunda de usuarios para crear experiencias excepcionales',
    'Diseño de interfaces intuitivas y atractivas',
    'Estrategias digitales que conectan marcas con audiencias',
    'Aplicación de inteligencia artificial en el diseño'
  ],
  aboutInfo: {
    name: 'Elkin García',
    title: 'Diseñador UX/UI & Desarrollador Frontend',
    description: 'Apasionado por crear experiencias digitales excepcionales',
    experience: '5+ años',
    specialty: 'UX/UI Design, Frontend Development'
  },
  contactInfo: {
    email: 'elkin@ejemplo.com',
    phone: '+57 300 123 4567',
    location: 'Bogotá, Colombia'
  }
}

// Mock LanguageContext
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

// Create mock contexts
const AdminContext = React.createContext({
  content: mockAdminContent,
  isAdmin: false,
  setIsAdmin: () => {},
  refreshContent: () => {}
})

const LanguageContext = React.createContext({
  language: 'es' as 'es' | 'en',
  setLanguage: () => {},
  t: (key: string) => key
})

// Mock hooks
export const useAdmin = () => {
  const context = React.useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const useLanguage = () => {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Export mock contexts for direct use
export { AdminContext, LanguageContext }

// Providers
const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = React.useState(false)
  
  const value = {
    content: mockAdminContent,
    isAdmin,
    setIsAdmin,
    refreshContent: () => {}
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = React.useState<'es' | 'en'>('es')

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

// Global decorator
export const GlobalDecorator = (Story: any, context: any) => {
  const theme = context.globals.theme || 'light'
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AdminProvider>
          <div className={theme === 'dark' ? 'dark' : ''}>
            <Story />
          </div>
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
