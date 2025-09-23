import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from '@/components/navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Barra de navegación principal con tema toggle, accesibilidad y menú.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onAdminClick: {
      action: 'admin-clicked',
      description: 'Función llamada cuando se hace clic en el botón de administrador',
    },
  },
}

export default meta
type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  args: {
    onAdminClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Barra de navegación por defecto con todas las funcionalidades.',
      },
    },
  },
}

export const WithCustomClass: Story = {
  args: {
    onAdminClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Barra de navegación con estilos personalizados.',
      },
    },
  },
}
