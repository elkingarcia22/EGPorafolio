import type { Meta, StoryObj } from '@storybook/react'
import { TextFillEffect } from '@/components/text-fill-effect'

const meta: Meta<typeof TextFillEffect> = {
  title: 'Components/TextFillEffect',
  component: TextFillEffect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Efecto de texto con relleno animado usando gradientes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Texto a mostrar con el efecto',
    },
    className: { control: 'text' },
    delay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Retraso antes de iniciar el efecto',
    },
    fillDuration: {
      control: { type: 'number', min: 500, max: 5000, step: 100 },
      description: 'Duración del efecto de llenado',
    },
    outlineColor: {
      control: 'color',
      description: 'Color del contorno',
    },
  },
}

export default meta
type Story = StoryObj<typeof TextFillEffect>

export const Default: Story = {
  args: {
    text: 'EG',
    className: 'text-6xl font-bold',
    outlineColor: '#667eea',
  },
  parameters: {
    docs: {
      description: {
        story: 'Efecto de texto por defecto con las letras EG.',
      },
    },
  },
}

export const Large: Story = {
  args: {
    text: 'PORTFOLIO',
    className: 'text-8xl font-bold',
    outlineColor: '#667eea',
  },
  parameters: {
    docs: {
      description: {
        story: 'Efecto de texto con tamaño grande.',
      },
    },
  },
}

export const CustomGradient: Story = {
  args: {
    text: 'CREATIVE',
    className: 'text-5xl font-bold',
    outlineColor: '#ff6b6b',
  },
  parameters: {
    docs: {
      description: {
        story: 'Efecto de texto con gradiente personalizado.',
      },
    },
  },
}

export const MultipleWords: Story = {
  args: {
    text: 'DESIGN & DEVELOP',
    className: 'text-4xl font-bold',
    outlineColor: '#667eea',
  },
  parameters: {
    docs: {
      description: {
        story: 'Efecto de texto con múltiples palabras.',
      },
    },
  },
}

export const LongText: Story = {
  args: {
    text: 'UX/UI DESIGNER & FRONTEND DEVELOPER',
    className: 'text-2xl font-bold',
    outlineColor: '#667eea',
  },
  parameters: {
    docs: {
      description: {
        story: 'Efecto de texto con texto largo.',
      },
    },
  },
}