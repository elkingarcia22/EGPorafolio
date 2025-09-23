import React, { createContext, useContext } from 'react'

// Mock del AdminContext para Storybook
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

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    // Fallback para Storybook
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

export { AdminContext }
