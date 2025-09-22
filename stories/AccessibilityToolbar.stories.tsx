import type { Meta, StoryObj } from '@storybook/react'
import { AccessibilityToolbar } from '../components/accessibility-toolbar'

const meta: Meta<typeof AccessibilityToolbar> = {
  title: 'Components/AccessibilityToolbar',
  component: AccessibilityToolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Barra de herramientas de accesibilidad con funcionalidades para personas con limitaciones. Incluye ajuste de tamaño de fuente, contraste alto, movimiento reducido, soporte para lectores de pantalla y selector de idioma.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // No hay props personalizables ya que el componente maneja su propio estado
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Vista por defecto de la barra de herramientas de accesibilidad. El botón principal muestra el icono de accesibilidad y al hacer clic se despliega el panel con todas las opciones.'
      }
    }
  }
}

export const WithBackdrop: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="flex justify-center items-center h-screen">
          <Story />
        </div>
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Vista de la barra de herramientas con un fondo degradado para mostrar cómo se ve en diferentes contextos.'
      }
    }
  }
}

export const InNavbar: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="text-lg font-normal text-gray-600 dark:text-white">
            Logo
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <Story />
            <div className="p-2 text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Vista de la barra de herramientas integrada en un navbar simulado, mostrando cómo se ve en su contexto real de uso.'
      }
    }
  }
}
