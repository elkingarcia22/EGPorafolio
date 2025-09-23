import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AccessibilityToolbar } from '@/components/accessibility-toolbar'

const meta: Meta<typeof AccessibilityToolbar> = {
  title: 'Navigation/AccessibilityToolbar',
  component: AccessibilityToolbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Una barra de herramientas de accesibilidad para ajustar la configuración de visualización y lectura.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AccessibilityToolbar>

export const Default: Story = {
  args: {},
}

export const CustomStyling: Story = {
  args: {
    className: 'bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-lg',
  },
}