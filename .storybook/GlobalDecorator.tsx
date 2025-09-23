import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { ThemeProvider } from 'next-themes'

// Mock global para los contextos
const mockContexts = {
  useLanguage: () => ({
    language: 'es' as 'es' | 'en',
    setLanguage: (lang: 'es' | 'en') => {},
    t: (key: string) => {
      const translations: Record<string, string> = {
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
      }
      return translations[key] || key
    }
  }),
  useAdmin: () => ({
    content: {
      typewriterTexts: ['Diseñador UX/UI', 'Desarrollador Frontend', 'Estratega Digital'],
      projectTitles: ['UX Research', 'UI Design', 'Frontend Development', 'Digital Strategy'],
      projectDescriptions: [
        'Investigación de usuarios y análisis de experiencia',
        'Diseño de interfaces modernas y funcionales',
        'Desarrollo de aplicaciones web responsivas',
        'Estrategias digitales para crecimiento empresarial'
      ],
      aboutTitle: 'Acerca de mí',
      aboutDescription: 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
      contactInfo: {
        whatsapp: '+54 11 1234-5678',
        linkedin: 'Conectar',
        location: 'Buenos Aires, Argentina'
      }
    },
    updateTypewriterTexts: () => {},
    updateProjectContent: () => {},
    updateAboutContent: () => {},
    updateContactInfo: () => {},
    resetToDefault: () => {},
    refreshContent: async () => {}
  })
}

// Mock global para los hooks
;(global as any).useLanguage = mockContexts.useLanguage
;(global as any).useAdmin = mockContexts.useAdmin

// Mock del LanguageContext directamente en el decorator
const LanguageContext = createContext({
  language: 'es' as 'es' | 'en',
  setLanguage: (lang: 'es' | 'en') => {},
  t: (key: string) => key
})

const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: 'es' as 'es' | 'en',
      setLanguage: (lang: 'es' | 'en') => {},
      t: (key: string) => key
    }
  }
  return context
}

// Mock del AdminContext directamente en el decorator
const AdminContext = createContext({
  content: {
    typewriterTexts: ['Diseñador UX/UI', 'Desarrollador Frontend', 'Estratega Digital'],
    projectTitles: ['UX Research', 'UI Design', 'Frontend Development', 'Digital Strategy'],
    projectDescriptions: [
      'Investigación de usuarios y análisis de experiencia',
      'Diseño de interfaces modernas y funcionales',
      'Desarrollo de aplicaciones web responsivas',
      'Estrategias digitales para crecimiento empresarial'
    ],
    aboutTitle: 'Acerca de mí',
    aboutDescription: 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
    contactInfo: {
      whatsapp: '+54 11 1234-5678',
      linkedin: 'Conectar',
      location: 'Buenos Aires, Argentina'
    }
  },
  updateTypewriterTexts: () => {},
  updateProjectContent: () => {},
  updateAboutContent: () => {},
  updateContactInfo: () => {},
  resetToDefault: () => {},
  refreshContent: async () => {}
})

const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    return {
      content: {
        typewriterTexts: ['Diseñador UX/UI', 'Desarrollador Frontend', 'Estratega Digital'],
        projectTitles: ['UX Research', 'UI Design', 'Frontend Development', 'Digital Strategy'],
        projectDescriptions: [
          'Investigación de usuarios y análisis de experiencia',
          'Diseño de interfaces modernas y funcionales',
          'Desarrollo de aplicaciones web responsivas',
          'Estrategias digitales para crecimiento empresarial'
        ],
        aboutTitle: 'Acerca de mí',
        aboutDescription: 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
        contactInfo: {
          whatsapp: '+54 11 1234-5678',
          linkedin: 'Conectar',
          location: 'Buenos Aires, Argentina'
        }
      },
      updateTypewriterTexts: () => {},
      updateProjectContent: () => {},
      updateAboutContent: () => {},
      updateContactInfo: () => {},
      resetToDefault: () => {},
      refreshContent: async () => {}
    }
  }
  return context
}

// Mock Provider para LanguageContext
const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
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

// Decorador global para Storybook que proporciona todos los contextos necesarios
export const GlobalDecorator = (Story: any, context: any) => {
  const theme = context.globals.theme || 'light'
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme={theme}>
      <LanguageProvider>
        <AdminContext.Provider value={{
          content: {
            typewriterTexts: ['Diseñador UX/UI', 'Desarrollador Frontend', 'Estratega Digital'],
            projectTitles: ['UX Research', 'UI Design', 'Frontend Development', 'Digital Strategy'],
            projectDescriptions: [
              'Investigación de usuarios y análisis de experiencia',
              'Diseño de interfaces modernas y funcionales',
              'Desarrollo de aplicaciones web responsivas',
              'Estrategias digitales para crecimiento empresarial'
            ],
            aboutTitle: 'Acerca de mí',
            aboutDescription: 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
            contactInfo: {
              whatsapp: '+54 11 1234-5678',
              linkedin: 'Conectar',
              location: 'Buenos Aires, Argentina'
            }
          },
          updateTypewriterTexts: () => {},
          updateProjectContent: () => {},
          updateAboutContent: () => {},
          updateContactInfo: () => {},
          resetToDefault: () => {},
          refreshContent: async () => {}
        }}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Story />
          </div>
        </AdminContext.Provider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
