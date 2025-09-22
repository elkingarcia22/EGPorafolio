import React, { createContext, useContext, ReactNode } from 'react'

// Mock data para Storybook
const mockContent = {
  typewriterTexts: [
    'Diseñador UX/UI',
    'Desarrollador Frontend',
    'Estratega Digital',
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

interface AdminContextType {
  content: typeof mockContent
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  refreshContent: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState(false)

  const refreshContent = () => {
    // Mock function for Storybook
    console.log('Mock refreshContent called')
  }

  const value = {
    content: mockContent,
    isAdmin,
    setIsAdmin,
    refreshContent
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
