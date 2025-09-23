import type { Meta, StoryObj } from '@storybook/react'
import { MinimalMenu } from '@/components/minimal-menu'

const meta: Meta<typeof MinimalMenu> = {
  title: 'Navigation/MinimalMenu',
  component: MinimalMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Menú de navegación minimalista con animaciones suaves.',
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
type Story = StoryObj<typeof MinimalMenu>

export const Default: Story = {
  args: {
    onAdminClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Menú de navegación por defecto con todas las opciones.',
      },
    },
  },
}
