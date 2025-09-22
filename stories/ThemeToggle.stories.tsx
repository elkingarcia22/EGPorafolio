import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'UI Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón para alternar entre tema claro y oscuro. Incluye iconos de sol y luna con animaciones suaves.'
      }
    }
  },
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
    className: 'border-2 border-blue-500'
  }
}
