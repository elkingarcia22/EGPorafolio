import type { Meta, StoryObj } from '@storybook/react'
import { NeuromorphicEG } from '@/components/neuromorphic-eg'

const meta: Meta<typeof NeuromorphicEG> = {
  title: 'Components/NeuromorphicEG',
  component: NeuromorphicEG,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente principal con las letras EG neuromórficas gigantes, texto typewriter y sección de proyectos.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}

export const WithCustomBackground: Story = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
        <Story />
      </div>
    )
  ],
}
