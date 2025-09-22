import type { Meta, StoryObj } from '@storybook/react'
import { LanguageToggle } from '@/components/language-toggle'

const meta: Meta<typeof LanguageToggle> = {
  title: 'Components/LanguageToggle',
  component: LanguageToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toggle para cambiar entre idiomas (ES/EN) con persistencia en localStorage.'
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

export const WithBackground: Story = {
  parameters: {
    backgrounds: {
      default: 'gradient',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
        { name: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg">
        <Story />
      </div>
    ),
  ],
}

export const InContext: Story = {
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
      <div className="flex items-center space-x-4 p-4">
        <span className="text-sm text-gray-600">Idioma:</span>
        <Story />
      </div>
    ),
  ],
}
