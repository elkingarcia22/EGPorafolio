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
      'home.name': 'Elkin García',
    'home.myWork': 'Mi trabajo',
    'home.yearsExperience': 'Años de experiencia',
    'home.projectsCompleted': 'Proyectos completados',
    'home.happyClients': 'Clientes satisfechos',
    'home.clientSatisfaction': 'Satisfacción del cliente',
    'home.ctaTitle': '¿Listo para crear algo increíble?',
    'home.ctaDescription': 'Trabajemos juntos para transformar tus ideas en experiencias digitales excepcionales.',
    'home.ctaButton': 'Comenzar proyecto',
    'home.ctaButtonSecondary': 'Conocer más',
    
    // Testimonials
    'testimonials.title': 'Lo que dicen mis clientes',
    'testimonials.subtitle': 'Testimonios reales de proyectos exitosos y clientes satisfechos.',
    'testimonials.client1.name': 'María González',
    'testimonials.client1.role': 'CEO, TechStart',
    'testimonials.client1.quote': 'Elkin transformó completamente nuestra plataforma. Su enfoque en UX y atención al detalle resultó en un aumento del 40% en conversiones.',
    'testimonials.client2.name': 'Santiago Rodríguez',
    'testimonials.client2.role': 'Director de Producto, InnovateLab',
    'testimonials.client2.quote': 'Trabajar con Elkin fue una experiencia excepcional. Su capacidad para entender las necesidades del usuario y traducirlas en diseño es impresionante.',
    'testimonials.client3.name': 'Ana Martínez',
    'testimonials.client3.role': 'Fundadora, DigitalFlow',
    'testimonials.client3.quote': 'Elkin no solo diseñó nuestra app, sino que nos ayudó a definir nuestra estrategia digital. Un profesional de primer nivel.',
    
    // About
    'about.title': 'Acerca de mí',
    'about.name': 'Elkin Garcia',
    'about.professionalTitle': 'Diseñador UX/UI Senior',
    'about.photoPlaceholder': 'Foto profesional',
    'about.mainTitle': 'Creando experiencias digitales que conectan con las personas',
    'about.description1': 'Soy un diseñador UX/UI apasionado por crear soluciones digitales que no solo se ven bien, sino que realmente funcionan para las personas. Con más de 5 años de experiencia, me especializo en transformar ideas complejas en interfaces intuitivas y accesibles.',
    'about.description2': 'Mi enfoque se centra en la investigación profunda del usuario, el diseño iterativo y la colaboración estrecha con equipos multidisciplinarios para lograr resultados excepcionales que impactan positivamente en el negocio y la experiencia del usuario.',
    'about.experience': 'Experiencia',
    'about.specialties': 'Especialidades',
    'about.experience1': '5+ años en diseño UX/UI',
    'about.experience1Desc': 'Especialización en productos digitales',
    'about.experience2': '50+ proyectos completados',
    'about.experience2Desc': 'Desde startups hasta empresas',
    'about.experience3': 'Liderazgo de equipos',
    'about.experience3Desc': 'Mentoría y dirección creativa',
    'about.specialty1': 'Research & Testing',
    'about.specialty1Desc': 'Investigación de usuarios',
    'about.specialty2': 'Design Systems',
    'about.specialty2Desc': 'Sistemas de diseño escalables',
    'about.specialty3': 'Prototipado',
    'about.specialty3Desc': 'Figma, Framer, Principle',
    'about.newTitle': 'Del output al outcome: diseño que entrega resultados reales.',
    'about.newDescription': 'Senior Product & UX/UI Designer con más de 10 años de experiencia liderando proyectos digitales de principio a fin. Trabajo de manera estratégica y planificada, combinando investigación, diseño visual y sistemas de diseño para asegurar consistencia, escalabilidad y eficiencia. Complemento mi trabajo con herramientas de IA que me permiten acelerar la ideación y validación, logrando productos más robustos y efectivos.',
    'about.experience1New': '10+ años en UX/UI & Product Design',
    'about.experience1NewDesc': 'Especialización en productos digitales',
    'about.experience2New': '15+ proyectos completados',
    'about.experience2NewDesc': 'Desde startups hasta empresas',
    'about.experience3New': 'Sistemas Estratégicos',
    'about.experience3NewDesc': 'Escalables y consistentes',
    'about.specialty1New': 'Research & Strategy',
    'about.specialty1NewDesc': 'Insights, outcomes',
    'about.specialty2New': 'Interaction Design',
    'about.specialty2NewDesc': 'Micro-experiences, usability',
    'about.specialty3New': 'AI-Enhanced Design',
    'about.specialty3NewDesc': 'Optimization, agility',
    
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
    'contact.immediateResponse': 'Respuesta inmediata',
    'contact.professionalNetwork': 'Red profesional',
    'contact.remoteWork': 'Trabajo remoto',
    'contact.availableForProjects': 'Disponible para nuevos proyectos y oportunidades',
    'contact.locationText': 'Bogotá, Colombia para el mundo',
    'contact.responseTime': 'Respuesta en menos de 24 horas',
    'contact.email': 'Email',
    'contact.sendEmail': 'Enviar correo',
    'contact.yourName': 'Tu nombre',
    'contact.yourEmail': 'Tu email',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.namePlaceholder': 'Ingresa tu nombre',
    'contact.emailPlaceholder': 'tu@email.com',
    'contact.subjectPlaceholder': 'Asunto del mensaje',
    'contact.messagePlaceholder': 'Escribe tu mensaje aquí...',
    'contact.sending': 'Enviando...',
    'contact.emailSuccess': '¡Perfecto! Se abrirá tu cliente de email.',
    'contact.emailError': 'Error al enviar. Intenta de nuevo.',
    
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
      'home.name': 'Elkin García',
    'home.myWork': 'My work',
    'home.yearsExperience': 'Years of experience',
    'home.projectsCompleted': 'Projects completed',
    'home.happyClients': 'Happy clients',
    'home.clientSatisfaction': 'Client satisfaction',
    'home.ctaTitle': 'Ready to create something amazing?',
    'home.ctaDescription': 'Let\'s work together to transform your ideas into exceptional digital experiences.',
    'home.ctaButton': 'Start project',
    'home.ctaButtonSecondary': 'Learn more',
    
    // Testimonials
    'testimonials.title': 'What my clients say',
    'testimonials.subtitle': 'Real testimonials from successful projects and satisfied clients.',
    'testimonials.client1.name': 'Maria Gonzalez',
    'testimonials.client1.role': 'CEO, TechStart',
    'testimonials.client1.quote': 'Elkin completely transformed our platform. His UX focus and attention to detail resulted in a 40% increase in conversions.',
    'testimonials.client2.name': 'Santiago Rodriguez',
    'testimonials.client2.role': 'Product Director, InnovateLab',
    'testimonials.client2.quote': 'Working with Elkin was an exceptional experience. His ability to understand user needs and translate them into design is impressive.',
    'testimonials.client3.name': 'Ana Martinez',
    'testimonials.client3.role': 'Founder, DigitalFlow',
    'testimonials.client3.quote': 'Elkin not only designed our app, but helped us define our digital strategy. A top-tier professional.',
    
    // About
    'about.title': 'About me',
    'about.name': 'Elkin Garcia',
    'about.professionalTitle': 'Senior UX/UI Designer',
    'about.photoPlaceholder': 'Professional photo',
    'about.mainTitle': 'Creating digital experiences that connect with people',
    'about.description1': 'I am a UX/UI designer passionate about creating digital solutions that not only look good, but actually work for people. With over 5 years of experience, I specialize in transforming complex ideas into intuitive and accessible interfaces.',
    'about.description2': 'My approach focuses on deep user research, iterative design and close collaboration with multidisciplinary teams to achieve exceptional results that positively impact business and user experience.',
    'about.experience': 'Experience',
    'about.specialties': 'Specialties',
    'about.experience1': '5+ years in UX/UI design',
    'about.experience1Desc': 'Specialization in digital products',
    'about.experience2': '50+ completed projects',
    'about.experience2Desc': 'From startups to enterprises',
    'about.experience3': 'Team leadership',
    'about.experience3Desc': 'Mentoring and creative direction',
    'about.specialty1': 'Research & Testing',
    'about.specialty1Desc': 'User research',
    'about.specialty2': 'Design Systems',
    'about.specialty2Desc': 'Scalable design systems',
    'about.specialty3': 'Prototyping',
    'about.specialty3Desc': 'Figma, Framer, Principle',
    'about.newTitle': 'From output to outcome: design that delivers real results.',
    'about.newDescription': 'Senior Product & UX/UI Designer with over 10 years of experience leading digital projects from start to finish. I work strategically and methodically, combining research, visual design and design systems to ensure consistency, scalability and efficiency. I complement my work with AI tools that allow me to accelerate ideation and validation, achieving more robust and effective products.',
    'about.experience1New': '10+ years in UX/UI & Product Design',
    'about.experience1NewDesc': 'Specialization in digital products',
    'about.experience2New': '15+ completed projects',
    'about.experience2NewDesc': 'From startups to enterprises',
    'about.experience3New': 'Strategic Systems',
    'about.experience3NewDesc': 'Scalable & consistent',
    'about.specialty1New': 'Research & Strategy',
    'about.specialty1NewDesc': 'Insights, outcomes',
    'about.specialty2New': 'Interaction Design',
    'about.specialty2NewDesc': 'Micro-experiences, usability',
    'about.specialty3New': 'AI-Enhanced Design',
    'about.specialty3NewDesc': 'Optimization, agility',
    
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
    'contact.immediateResponse': 'Immediate response',
    'contact.professionalNetwork': 'Professional network',
    'contact.remoteWork': 'Remote work',
    'contact.availableForProjects': 'Available for new projects and opportunities',
    'contact.locationText': 'Bogotá, Colombia for the world',
    'contact.responseTime': 'Response within 24 hours',
    'contact.email': 'Email',
    'contact.sendEmail': 'Send email',
    'contact.yourName': 'Your name',
    'contact.yourEmail': 'Your email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.namePlaceholder': 'Enter your name',
    'contact.emailPlaceholder': 'your@email.com',
    'contact.subjectPlaceholder': 'Message subject',
    'contact.messagePlaceholder': 'Write your message here...',
    'contact.sending': 'Sending...',
    'contact.emailSuccess': 'Perfect! Your email client will open.',
    'contact.emailError': 'Error sending. Please try again.',
    
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
