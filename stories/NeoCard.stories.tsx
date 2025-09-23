import type { Meta, StoryObj } from '@storybook/react'
import { NeoCard } from '@/components/ui/neo-card'

const meta: Meta<typeof NeoCard> = {
  title: 'UI Components/NeoCard',
  component: NeoCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de tarjeta con diseño neuromórfico. Ideal para mostrar contenido en contenedores con efectos de profundidad.'
      }
    }
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Contenido de la tarjeta'
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales'
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'inset'],
      description: 'Variante del diseño neuromórfico'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Contenido de la tarjeta por defecto',
    variant: 'default'
  }
}

export const Elevated: Story = {
  args: {
    children: 'Tarjeta con efecto elevado',
    variant: 'outset'
  }
}

export const Inset: Story = {
  args: {
    children: 'Tarjeta con efecto hundido',
    variant: 'inset'
  }
}

export const WithComplexContent: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Título de la Tarjeta
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Este es un ejemplo de contenido más complejo dentro de una tarjeta neuromórfica.
        </p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Botón de Acción
        </button>
      </div>
    ),
    variant: 'default'
  }
}

export const CustomStyling: Story = {
  args: {
    children: 'Tarjeta con estilos personalizados',
    className: 'w-80 h-40',
    variant: 'outset'
  }
}
