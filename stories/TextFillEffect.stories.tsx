import type { Meta, StoryObj } from '@storybook/react'
import { TextFillEffect } from '@/components/text-fill-effect'

const meta: Meta<typeof TextFillEffect> = {
  title: 'Effects/TextFillEffect',
  component: TextFillEffect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Efecto de llenado de texto con gradiente animado. Crea un efecto visual atractivo para títulos y textos importantes.'
      }
    }
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Texto a mostrar con el efecto'
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales'
    },
    gradient: {
      control: 'text',
      description: 'Gradiente CSS personalizado'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Texto con Efecto'
  }
}

export const Large: Story = {
  args: {
    children: 'Título Principal',
    className: 'text-4xl font-bold'
  }
}

export const CustomGradient: Story = {
  args: {
    children: 'Gradiente Personalizado',
    gradient: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
  }
}

export const MultipleWords: Story = {
  args: {
    children: 'Múltiples Palabras Con Efecto',
    className: 'text-2xl font-semibold'
  }
}

export const LongText: Story = {
  args: {
    children: 'Este es un texto más largo que demuestra cómo se ve el efecto en contenido extenso',
    className: 'text-lg'
  }
}
