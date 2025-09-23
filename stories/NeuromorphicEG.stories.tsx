import type { Meta, StoryObj } from '@storybook/react'
import { NeuromorphicEG } from '@/components/neuromorphic-eg'

const meta: Meta<typeof NeuromorphicEG> = {
  title: 'Components/NeuromorphicEG',
  component: NeuromorphicEG,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente principal del home que muestra las letras EG con efecto neuromórfico y el texto typewriter.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof NeuromorphicEG>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Vista por defecto del componente NeuromorphicEG con las letras EG y el texto typewriter.',
      },
    },
  },
}

export const WithCustomClass: Story = {
  args: {
    className: 'bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800',
  },
  parameters: {
    docs: {
      description: {
        story: 'NeuromorphicEG con clases CSS personalizadas para el fondo.',
      },
    },
  },
}
