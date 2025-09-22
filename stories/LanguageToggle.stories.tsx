import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LanguageToggle } from '@/components/language-toggle'

// Mock del contexto de idioma para Storybook
const MockLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = React.useState<'es' | 'en'>('es')
  
  const contextValue = {
    language,
    setLanguage,
    t: (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        es: {
          'language.spanish': 'Español',
          'language.english': 'Inglés'
        },
        en: {
          'language.spanish': 'Spanish',
          'language.english': 'English'
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

const meta: Meta<typeof LanguageToggle> = {
  title: 'Navigation/LanguageToggle',
  component: LanguageToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón para alternar entre idiomas (español/inglés). Incluye iconos de banderas y animaciones suaves.'
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
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del botón'
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md'
  }
}

export const Small: Story = {
  args: {
    size: 'sm'
  }
}

export const Large: Story = {
  args: {
    size: 'lg'
  }
}

export const CustomStyling: Story = {
  args: {
    size: 'md',
    className: 'border-2 border-green-500'
  }
}
