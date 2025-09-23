import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón para alternar entre tema claro y oscuro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamaño del botón',
    },
  },
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {
  args: {
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle de tema por defecto con tamaño mediano.',
      },
    },
  },
}

export const Small: Story = {
  args: {
    size: 'small',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle de tema con tamaño pequeño.',
      },
    },
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle de tema con tamaño grande.',
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    size: 'medium',
    className: 'border-2 border-purple-500 p-1 rounded-md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle de tema con estilos personalizados.',
      },
    },
  },
}