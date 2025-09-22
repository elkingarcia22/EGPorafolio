import type { Meta, StoryObj } from '@storybook/react'
import { NeoSelect } from '@/components/ui/neo-select'

const meta: Meta<typeof NeoSelect> = {
  title: 'UI Components/NeoSelect',
  component: NeoSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector desplegable con diseño neuromórfico. Proporciona una interfaz elegante para seleccionar opciones.'
      }
    }
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Texto de placeholder'
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

const sampleOptions = [
  { value: 'option1', label: 'Opción 1' },
  { value: 'option2', label: 'Opción 2' },
  { value: 'option3', label: 'Opción 3' },
  { value: 'option4', label: 'Opción 4' }
]

const countryOptions = [
  { value: 'colombia', label: 'Colombia' },
  { value: 'mexico', label: 'México' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'chile', label: 'Chile' },
  { value: 'peru', label: 'Perú' }
]

export const Default: Story = {
  args: {
    placeholder: 'Selecciona una opción...',
    options: sampleOptions
  }
}

export const WithDefaultValue: Story = {
  args: {
    placeholder: 'Selecciona una opción...',
    options: sampleOptions,
    defaultValue: 'option2'
  }
}

export const Countries: Story = {
  args: {
    placeholder: 'Selecciona tu país...',
    options: countryOptions
  }
}

export const Disabled: Story = {
  args: {
    placeholder: 'Selector deshabilitado',
    options: sampleOptions,
    disabled: true
  }
}

export const CustomStyling: Story = {
  args: {
    placeholder: 'Selector con estilos personalizados',
    options: sampleOptions,
    className: 'w-80'
  }
}
