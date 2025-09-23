import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LanguageToggle } from '@/components/language-toggle'

const meta: Meta<typeof LanguageToggle> = {
  title: 'Navigation/LanguageToggle',
  component: LanguageToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Un componente para alternar entre los idiomas español e inglés.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Define el tamaño del toggle.',
    },
  },
  decorators: [
    (Story) => (
      <Story />
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LanguageToggle>

export const Default: Story = {
  args: {
    size: 'medium',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
}

export const CustomStyling: Story = {
  args: {
    size: 'medium',
    className: 'border-2 border-purple-500 p-1 rounded-md',
  },
}