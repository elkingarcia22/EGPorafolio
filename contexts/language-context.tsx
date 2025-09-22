'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface LanguageContextType {
  language: 'es' | 'en'
  setLanguage: (lang: 'es' | 'en') => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traducciones
const translations = {
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de mí',
    'nav.skills': 'Habilidades',
    'nav.experience': 'Experiencia',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    'nav.admin': 'Administrador',
    'nav.lightTheme': 'Cambiar a tema claro',
    'nav.darkTheme': 'Cambiar a tema oscuro',
    
    // Home
    'home.title': 'EG',
    'home.subtitle': 'Diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
    'home.myWork': 'Mi trabajo',
    
    // About
    'about.title': 'Acerca de mí',
    'about.description': 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales. Me especializo en diseño centrado en el usuario, investigación y prototipado.',
    
    // Skills
    'skills.title': 'Habilidades',
    'skills.ux': 'UX Research',
    'skills.ui': 'UI Design',
    'skills.strategy': 'Estrategia Digital',
    'skills.ai': 'Diseño con IA',
    
    // Experience
    'experience.title': 'Experiencia',
    
    // Projects
    'projects.title': 'Proyectos',
    
    // Contact
    'contact.title': 'Contacto',
    'contact.whatsapp': 'WhatsApp',
    'contact.linkedin': 'LinkedIn',
    'contact.location': 'Ubicación',
    'contact.getInTouch': 'Ponte en contacto',
    'contact.description': '¿Tienes un proyecto en mente? Me encantaría escuchar sobre él.',
    
    // Admin
    'admin.login': 'Iniciar sesión',
    'admin.password': 'Contraseña',
    'admin.enter': 'Entrar',
    'admin.backToSite': 'Volver al sitio',
    'admin.logout': 'Cerrar sesión',
    'admin.manageContent': 'Gestionar contenido',
    
    // Accessibility
    'accessibility.title': 'Accesibilidad',
    'accessibility.fontSize': 'Tamaño de fuente',
    'accessibility.highContrast': 'Alto contraste',
    'accessibility.reducedMotion': 'Movimiento reducido',
    'accessibility.screenReader': 'Lector de pantalla',
    'accessibility.reset': 'Restablecer configuración',
    'accessibility.info': 'Estas configuraciones se aplican inmediatamente y se guardan en tu navegador.'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.lightTheme': 'Switch to light theme',
    'nav.darkTheme': 'Switch to dark theme',
    
    // Home
    'home.title': 'EG',
    'home.subtitle': 'UX/UI Designer with over 5 years of experience creating exceptional digital experiences.',
    'home.myWork': 'My work',
    
    // About
    'about.title': 'About me',
    'about.description': 'I am a UX/UI designer with over 5 years of experience creating exceptional digital experiences. I specialize in user-centered design, research and prototyping.',
    
    // Skills
    'skills.title': 'Skills',
    'skills.ux': 'UX Research',
    'skills.ui': 'UI Design',
    'skills.strategy': 'Digital Strategy',
    'skills.ai': 'AI Design',
    
    // Experience
    'experience.title': 'Experience',
    
    // Projects
    'projects.title': 'Projects',
    
    // Contact
    'contact.title': 'Contact',
    'contact.whatsapp': 'WhatsApp',
    'contact.linkedin': 'LinkedIn',
    'contact.location': 'Location',
    'contact.getInTouch': 'Get in touch',
    'contact.description': 'Have a project in mind? I would love to hear about it.',
    
    // Admin
    'admin.login': 'Login',
    'admin.password': 'Password',
    'admin.enter': 'Enter',
    'admin.backToSite': 'Back to site',
    'admin.logout': 'Logout',
    'admin.manageContent': 'Manage content',
    
    // Accessibility
    'accessibility.title': 'Accessibility',
    'accessibility.fontSize': 'Font size',
    'accessibility.highContrast': 'High contrast',
    'accessibility.reducedMotion': 'Reduced motion',
    'accessibility.screenReader': 'Screen reader',
    'accessibility.reset': 'Reset settings',
    'accessibility.info': 'These settings are applied immediately and saved in your browser.'
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'es' | 'en'>('es') // Iniciar en español

  useEffect(() => {
    // Cargar idioma desde localStorage si existe
    const savedLanguage = localStorage.getItem('language') as 'es' | 'en'
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
