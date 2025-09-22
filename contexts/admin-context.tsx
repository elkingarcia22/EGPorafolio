'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AdminContent {
  typewriterTexts: string[]
  projectTitles: string[]
  projectDescriptions: string[]
  aboutTitle: string
  aboutDescription: string
  contactInfo: {
    whatsapp: string
    linkedin: string
    location: string
  }
}

interface AdminContextType {
  content: AdminContent
  updateTypewriterTexts: (texts: string[]) => void
  updateProjectContent: (index: number, title: string, description: string) => void
  updateAboutContent: (title: string, description: string) => void
  updateContactInfo: (info: Partial<AdminContent['contactInfo']>) => void
  resetToDefault: () => void
}

const defaultContent: AdminContent = {
  typewriterTexts: [
    'Diseñador UX/UI senior specialist',
    'Diseño de interacciones',
    'Diseño de estrategias',
    'Diseño inteligente IA'
  ],
  projectTitles: [
    'UX Research',
    'UI Design',
    'Estrategia Digital',
    'Diseño con IA'
  ],
  projectDescriptions: [
    'Investigación profunda de usuarios para crear experiencias excepcionales y centradas en el ser humano',
    'Diseño de interfaces modernas, funcionales y visualmente impactantes que conectan con los usuarios',
    'Desarrollo de estrategias digitales integrales que transforman marcas y productos',
    'Proyectos innovadores que combinan inteligencia artificial con diseño creativo'
  ],
  aboutTitle: 'Acerca de mí',
  aboutDescription: 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
  contactInfo: {
    whatsapp: '+54 11 1234-5678',
    linkedin: 'Conectar',
    location: 'Buenos Aires, Argentina'
  }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<AdminContent>(defaultContent)

  const updateTypewriterTexts = (texts: string[]) => {
    setContent(prev => ({ ...prev, typewriterTexts: texts }))
  }

  const updateProjectContent = (index: number, title: string, description: string) => {
    setContent(prev => ({
      ...prev,
      projectTitles: prev.projectTitles.map((t, i) => i === index ? title : t),
      projectDescriptions: prev.projectDescriptions.map((d, i) => i === index ? description : d)
    }))
  }

  const updateAboutContent = (title: string, description: string) => {
    setContent(prev => ({ ...prev, aboutTitle: title, aboutDescription: description }))
  }

  const updateContactInfo = (info: Partial<AdminContent['contactInfo']>) => {
    setContent(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, ...info } }))
  }

  const resetToDefault = () => {
    setContent(defaultContent)
  }

  return (
    <AdminContext.Provider value={{
      content,
      updateTypewriterTexts,
      updateProjectContent,
      updateAboutContent,
      updateContactInfo,
      resetToDefault
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
