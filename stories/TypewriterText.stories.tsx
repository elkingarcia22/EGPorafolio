import type { Meta, StoryObj } from '@storybook/react'
import { TypewriterText } from '@/components/typewriter-text'

const meta: Meta<typeof TypewriterText> = {
  title: 'Components/TypewriterText',
  component: TypewriterText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de texto que se escribe automáticamente con efecto typewriter.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    words: {
      control: 'object',
      description: 'Array de palabras que se escribirán secuencialmente'
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales'
    },
    typingSpeed: {
      control: { type: 'number', min: 10, max: 200, step: 10 },
      description: 'Velocidad de escritura en milisegundos'
    },
    deletingSpeed: {
      control: { type: 'number', min: 10, max: 200, step: 10 },
      description: 'Velocidad de borrado en milisegundos'
    },
    pauseTime: {
      control: { type: 'number', min: 500, max: 5000, step: 500 },
      description: 'Tiempo de pausa entre palabras en milisegundos'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    words: ['Diseñador UX/UI', 'Desarrollador Frontend', 'Estratega Digital'],
    className: 'text-2xl font-normal text-gray-600 dark:text-white',
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseTime: 2500
  },
  parameters: {
    docs: {
      description: {
        story: 'Texto typewriter por defecto con palabras relacionadas al diseño y desarrollo.'
      }
    }
  }
}

export const FastTyping: Story = {
  args: {
    words: ['Rápido', 'Eficiente', 'Moderno'],
    className: 'text-xl font-bold text-blue-600',
    typingSpeed: 50,
    deletingSpeed: 25,
    pauseTime: 1000
  },
  parameters: {
    docs: {
      description: {
        story: 'Texto typewriter con velocidad rápida.'
      }
    }
  }
}

export const SlowTyping: Story = {
  args: {
    words: ['Pausado', 'Reflexivo', 'Profundo'],
    className: 'text-3xl font-light text-gray-800',
    typingSpeed: 150,
    deletingSpeed: 80,
    pauseTime: 4000
  },
  parameters: {
    docs: {
      description: {
        story: 'Texto typewriter con velocidad lenta y pausas largas.'
      }
    }
  }
}

export const MultipleWords: Story = {
  args: {
    words: [
      'Creatividad',
      'Innovación',
      'Tecnología',
      'Diseño',
      'Desarrollo',
      'Experiencia'
    ],
    className: 'text-lg font-medium text-green-600',
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 2000
  },
  parameters: {
    docs: {
      description: {
        story: 'Texto typewriter con múltiples palabras relacionadas al portafolio.'
      }
    }
  }
}