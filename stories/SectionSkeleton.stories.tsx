import type { Meta, StoryObj } from '@storybook/react'
import { SectionSkeleton } from '@/components/section-skeleton'

const meta: Meta<typeof SectionSkeleton> = {
  title: 'Components/SectionSkeleton',
  component: SectionSkeleton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente de esqueleto para mostrar estados de carga de diferentes secciones.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['home', 'about', 'contact'],
      description: 'Tipo de esqueleto a mostrar',
    },
  },
}

export default meta
type Story = StoryObj<typeof SectionSkeleton>

export const Home: Story = {
  args: {
    type: 'home',
  },
  parameters: {
    docs: {
      description: {
        story: 'Esqueleto de carga para la sección home.',
      },
    },
  },
}

export const About: Story = {
  args: {
    type: 'about',
  },
  parameters: {
    docs: {
      description: {
        story: 'Esqueleto de carga para la sección acerca de mí.',
      },
    },
  },
}

export const Contact: Story = {
  args: {
    type: 'contact',
  },
  parameters: {
    docs: {
      description: {
        story: 'Esqueleto de carga para la sección de contacto.',
      },
    },
  },
}