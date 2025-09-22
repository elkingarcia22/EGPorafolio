'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

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
    'accessibility.tools': 'Herramientas de accesibilidad',
    'accessibility.fontSize': 'Tamaño de fuente',
    'accessibility.highContrast': 'Alto contraste',
    'accessibility.reducedMotion': 'Movimiento reducido',
    'accessibility.screenReader': 'Lector de pantalla',
    'accessibility.reset': 'Restablecer configuración',
    'accessibility.info': 'Estas configuraciones se aplican inmediatamente y se guardan en tu navegador.',
    
    // Admin Modal
    'admin.modal.title': 'Acceso de Administrador',
    'admin.modal.subtitle': 'Ingresa la contraseña para acceder al modo administrador',
    'admin.modal.password': 'Contraseña',
    'admin.modal.cancel': 'Cancelar',
    'admin.modal.access': 'Acceder',
    'admin.modal.verifying': 'Verificando...',
    'admin.modal.error': 'Contraseña incorrecta',
    
    // Admin Panel
    'admin.panel.typewriter': 'Textos Typewriter',
    'admin.panel.projects': 'Proyectos',
    'admin.panel.about': 'Acerca de Mí',
    'admin.panel.contact': 'Contacto',
    'admin.panel.images': 'Imágenes',
    'admin.panel.logout': 'Cerrar Sesión',
    'admin.panel.add': 'Agregar',
    'admin.panel.edit': 'Editar',
    'admin.panel.delete': 'Eliminar',
    'admin.panel.save': 'Guardar',
    'admin.panel.cancel': 'Cancelar',
    'admin.panel.projectTitle': 'Título del proyecto',
    'admin.panel.projectDescription': 'Descripción del proyecto',
    'admin.panel.saveProject': 'Guardar Proyecto',
    'admin.panel.aboutTitle': 'Título',
    'admin.panel.aboutDescription': 'Descripción',
    'admin.panel.saveChanges': 'Guardar Cambios',
    'admin.panel.contactLabel': 'Etiqueta del contacto',
    'admin.panel.contactValue': 'Valor del contacto',
    'admin.panel.contactType': 'Tipo de contacto',
    'admin.panel.contactOrder': 'Orden',
    'admin.panel.saveContact': 'Guardar Contacto',
    'admin.panel.imageName': 'Nombre descriptivo',
    'admin.panel.imageUrl': 'URL de la imagen',
    'admin.panel.imageAlt': 'Texto alternativo',
    'admin.panel.saveImage': 'Guardar Imagen',
    'admin.panel.typewriterText': 'Ingresa el texto que aparecerá en el typewriter',
    'admin.panel.typewriterOrder': 'Orden de aparición',
    'admin.panel.saveTypewriter': 'Guardar Texto',
    'admin.panel.aboutSectionTitle': 'Título de la sección',
    'admin.panel.aboutPersonalDescription': 'Descripción personal',
    'admin.panel.location': 'Ubicación'
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
    'accessibility.tools': 'Accessibility tools',
    'accessibility.fontSize': 'Font size',
    'accessibility.highContrast': 'High contrast',
    'accessibility.reducedMotion': 'Reduced motion',
    'accessibility.screenReader': 'Screen reader',
    'accessibility.reset': 'Reset settings',
    'accessibility.info': 'These settings are applied immediately and saved in your browser.',
    
    // Admin Modal
    'admin.modal.title': 'Administrator Access',
    'admin.modal.subtitle': 'Enter the password to access administrator mode',
    'admin.modal.password': 'Password',
    'admin.modal.cancel': 'Cancel',
    'admin.modal.access': 'Access',
    'admin.modal.verifying': 'Verifying...',
    'admin.modal.error': 'Incorrect password',
    
    // Admin Panel
    'admin.panel.typewriter': 'Typewriter Texts',
    'admin.panel.projects': 'Projects',
    'admin.panel.about': 'About Me',
    'admin.panel.contact': 'Contact',
    'admin.panel.images': 'Images',
    'admin.panel.logout': 'Logout',
    'admin.panel.add': 'Add',
    'admin.panel.edit': 'Edit',
    'admin.panel.delete': 'Delete',
    'admin.panel.save': 'Save',
    'admin.panel.cancel': 'Cancel',
    'admin.panel.projectTitle': 'Project title',
    'admin.panel.projectDescription': 'Project description',
    'admin.panel.saveProject': 'Save Project',
    'admin.panel.aboutTitle': 'Title',
    'admin.panel.aboutDescription': 'Description',
    'admin.panel.saveChanges': 'Save Changes',
    'admin.panel.contactLabel': 'Contact label',
    'admin.panel.contactValue': 'Contact value',
    'admin.panel.contactType': 'Contact type',
    'admin.panel.contactOrder': 'Order',
    'admin.panel.saveContact': 'Save Contact',
    'admin.panel.imageName': 'Descriptive name',
    'admin.panel.imageUrl': 'Image URL',
    'admin.panel.imageAlt': 'Alt text',
    'admin.panel.saveImage': 'Save Image',
    'admin.panel.typewriterText': 'Enter the text that will appear in the typewriter',
    'admin.panel.typewriterOrder': 'Display order',
    'admin.panel.saveTypewriter': 'Save Text',
    'admin.panel.aboutSectionTitle': 'Section title',
    'admin.panel.aboutPersonalDescription': 'Personal description',
    'admin.panel.location': 'Location'
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'es' | 'en'>('es') // Iniciar en español
  
  console.log('🌍 LanguageProvider renderizado, idioma actual:', language)

  useEffect(() => {
    console.log('🌍 LanguageProvider useEffect ejecutado')
    // Cargar idioma desde localStorage si existe
    const savedLanguage = localStorage.getItem('language') as 'es' | 'en'
    console.log('💾 Idioma guardado en localStorage:', savedLanguage)
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      console.log('✅ Cargando idioma desde localStorage:', savedLanguage)
      setLanguage(savedLanguage)
    } else {
      console.log('⚠️ No hay idioma guardado, usando español por defecto')
    }
  }, [])

  const handleSetLanguage = useCallback((lang: 'es' | 'en') => {
    console.log('🔄 handleSetLanguage llamado con:', lang)
    console.log('🔄 Idioma actual antes del cambio:', language)
    setLanguage(lang)
    localStorage.setItem('language', lang)
    console.log('💾 Idioma guardado en localStorage:', lang)
  }, [language])

  const t = useCallback((key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]] || key
    console.log(`🔤 Traduciendo "${key}" (${language}):`, translation)
    return translation
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

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
