import type { Meta, StoryObj } from '@storybook/react'
import { NeuromorphicEG } from '../components/neuromorphic-eg'

const meta: Meta<typeof NeuromorphicEG> = {
  title: 'Components/NeuromorphicEG',
  component: NeuromorphicEG,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente principal del home que muestra las letras EG gigantes con efecto neuromórfico y la sección de proyectos.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // No hay props para este componente
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Vista por defecto del componente NeuromorphicEG con las letras EG y la sección de proyectos.'
      }
    }
  }
}

export const LightTheme: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Vista del componente en tema claro.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="light">
        <Story />
      </div>
    )
  ]
}

export const DarkTheme: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Vista del componente en tema oscuro.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    )
  ]
}
