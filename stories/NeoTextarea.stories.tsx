import type { Meta, StoryObj } from '@storybook/react'
import { NeoTextarea } from '@/components/ui/neo-textarea'

const meta: Meta<typeof NeoTextarea> = {
  title: 'UI Components/NeoTextarea',
  component: NeoTextarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Área de texto con diseño neuromórfico. Ideal para entradas de texto largas con efectos visuales únicos.'
      }
    }
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Texto de placeholder'
    },
    rows: {
      control: 'number',
      description: 'Número de filas visibles'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
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
    placeholder: 'Escribe tu mensaje aquí...',
    rows: 4
  }
}

export const Large: Story = {
  args: {
    placeholder: 'Área de texto grande para contenido extenso...',
    rows: 8
  }
}

export const Small: Story = {
  args: {
    placeholder: 'Texto corto',
    rows: 2
  }
}

export const Disabled: Story = {
  args: {
    placeholder: 'Área de texto deshabilitada',
    disabled: true,
    rows: 4
  }
}

export const WithValue: Story = {
  args: {
    placeholder: 'Área con contenido predefinido',
    defaultValue: 'Este es un texto de ejemplo que ya está en el área de texto.',
    rows: 4
  }
}

export const CustomStyling: Story = {
  args: {
    placeholder: 'Textarea con estilos personalizados',
    className: 'w-96',
    rows: 6
  }
}
