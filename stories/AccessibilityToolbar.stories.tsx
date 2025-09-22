import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AccessibilityToolbar } from '@/components/accessibility-toolbar'

// Mock del contexto de idioma para Storybook
const MockLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = React.useState<'es' | 'en'>('es')
  
  const contextValue = {
    language,
    setLanguage,
    t: (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        es: {
          'accessibility.title': 'Herramientas de Accesibilidad',
          'accessibility.fontSize': 'Tamaño de Fuente',
          'accessibility.highContrast': 'Alto Contraste',
          'accessibility.reducedMotion': 'Movimiento Reducido',
          'accessibility.screenReader': 'Lector de Pantalla'
        },
        en: {
          'accessibility.title': 'Accessibility Tools',
          'accessibility.fontSize': 'Font Size',
          'accessibility.highContrast': 'High Contrast',
          'accessibility.reducedMotion': 'Reduced Motion',
          'accessibility.screenReader': 'Screen Reader'
        }
      }
      return translations[language]?.[key] || key
    }
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Idioma actual: <span className="font-semibold">{language}</span>
        </p>
      </div>
      {children}
    </div>
  )
}

const meta: Meta<typeof AccessibilityToolbar> = {
  title: 'Navigation/AccessibilityToolbar',
  component: AccessibilityToolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Barra de herramientas de accesibilidad. Incluye controles para tamaño de fuente, contraste, movimiento reducido y lector de pantalla.'
      }
    }
  },
  decorators: [
    (Story) => (
      <MockLanguageProvider>
        <Story />
      </MockLanguageProvider>
    )
  ],
  argTypes: {
    className: {
      control: 'text',
      description: 'Clases CSS adicionales'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const CustomStyling: Story = {
  args: {
    className: 'border-2 border-purple-500 rounded-lg p-4'
  }
}
