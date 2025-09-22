import type { Meta, StoryObj } from '@storybook/react'
import { MinimalMenu } from '@/components/minimal-menu'

const meta: Meta<typeof MinimalMenu> = {
  title: 'Components/MinimalMenu',
  component: MinimalMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Menú minimalista expandible con animación horizontal y efectos hover con línea degradada.'
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
      <div className="p-8 bg-white/80 backdrop-blur-sm rounded-lg">
        <Story />
      </div>
    ),
  ],
}
