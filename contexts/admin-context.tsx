'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { mockData, isSupabaseConfigured } from '@/lib/mock-data'

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
  typewriterTexts: mockData.typewriterTexts.map(item => item.text_content),
  projectTitles: mockData.projects.map(item => item.title),
  projectDescriptions: mockData.projects.map(item => item.description),
  aboutTitle: mockData.aboutInfo[0]?.title || 'Acerca de mí',
  aboutDescription: mockData.aboutInfo[0]?.description || 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
  contactInfo: {
    whatsapp: mockData.contactInfo.find(item => item.contact_type === 'whatsapp')?.value || '+54 11 1234-5678',
    linkedin: mockData.contactInfo.find(item => item.contact_type === 'linkedin')?.value || 'Conectar',
    location: mockData.contactInfo.find(item => item.contact_type === 'location')?.value || 'Buenos Aires, Argentina'
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
