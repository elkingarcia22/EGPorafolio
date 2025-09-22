import type { Meta, StoryObj } from '@storybook/react'
import { TypewriterText } from '@/components/typewriter-text'

const meta: Meta<typeof TypewriterText> = {
  title: 'Components/TypewriterText',
  component: TypewriterText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de texto con efecto typewriter que escribe y borra palabras automáticamente.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    words: {
      control: 'object',
      description: 'Array de palabras que se escribirán en secuencia'
    },
    typingSpeed: {
      control: { type: 'range', min: 50, max: 200, step: 10 },
      description: 'Velocidad de escritura en milisegundos'
    },
    deletingSpeed: {
      control: { type: 'range', min: 25, max: 100, step: 5 },
      description: 'Velocidad de borrado en milisegundos'
    },
    pauseTime: {
      control: { type: 'range', min: 1000, max: 5000, step: 100 },
      description: 'Tiempo de pausa entre palabras en milisegundos'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    words: [
      "Diseñador UX/UI senior specialist",
      "Diseño de interacciones", 
      "Diseño de estrategias",
      "Diseño inteligente IA"
    ],
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseTime: 2500
  },
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

export const FastTyping: Story = {
  args: {
    words: [
      "Desarrollo rápido",
      "Innovación constante",
      "Resultados inmediatos"
    ],
    typingSpeed: 50,
    deletingSpeed: 25,
    pauseTime: 1500
  },
}

export const SlowTyping: Story = {
  args: {
    words: [
      "Pensamiento profundo",
      "Análisis detallado",
      "Estrategia cuidadosa"
    ],
    typingSpeed: 150,
    deletingSpeed: 75,
    pauseTime: 4000
  },
}

export const DarkMode: Story = {
  args: {
    words: [
      "Diseñador UX/UI senior specialist",
      "Diseño de interacciones", 
      "Diseño de estrategias",
      "Diseño inteligente IA"
    ],
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseTime: 2500
  },
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

export const CustomStyling: Story = {
  args: {
    words: [
      "Texto personalizado",
      "Con estilos únicos",
      "Y animaciones suaves"
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 2000,
    className: "text-4xl font-bold text-blue-600"
  },
}
