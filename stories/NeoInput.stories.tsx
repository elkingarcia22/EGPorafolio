import type { Meta, StoryObj } from '@storybook/react'
import { NeoInput } from '@/components/ui/neo-input'

const meta: Meta<typeof NeoInput> = {
  title: 'UI Components/NeoInput',
  component: NeoInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de entrada con diseño neuromórfico. Proporciona una experiencia visual única con efectos de profundidad.'
      }
    }
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Texto de placeholder'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
      description: 'Tipo de input'
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
    placeholder: 'Escribe algo aquí...',
    type: 'text'
  }
}

export const Email: Story = {
  args: {
    placeholder: 'tu@email.com',
    type: 'email'
  }
}

export const Password: Story = {
  args: {
    placeholder: 'Contraseña',
    type: 'password'
  }
}

export const Number: Story = {
  args: {
    placeholder: '123',
    type: 'number'
  }
}

export const Disabled: Story = {
  args: {
    placeholder: 'Campo deshabilitado',
    disabled: true
  }
}

export const WithValue: Story = {
  args: {
    placeholder: 'Campo con valor',
    defaultValue: 'Valor predefinido'
  }
}

export const CustomStyling: Story = {
  args: {
    placeholder: 'Input con estilos personalizados',
    className: 'w-80'
  }
}
