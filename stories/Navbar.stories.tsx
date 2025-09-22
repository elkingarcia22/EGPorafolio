import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from '@/components/navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Barra de navegación fija con menú expandible, toggle de idioma y toggle de tema.'
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

export const WithContent: Story = {
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
      <div className="min-h-screen">
        <Story />
        <div className="pt-24 p-8">
          <h1 className="text-4xl font-bold mb-4">Contenido de ejemplo</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Esta es una demostración de cómo se ve la navbar con contenido debajo.
            La navbar permanece fija en la parte superior.
          </p>
        </div>
      </div>
    ),
  ],
}
