import type { Meta, StoryObj } from '@storybook/react'
import { SectionSkeleton } from '@/components/section-skeleton'

const meta: Meta<typeof SectionSkeleton> = {
  title: 'Loading/SectionSkeleton',
  component: SectionSkeleton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente de esqueleto para mostrar estados de carga. Proporciona una representación visual del contenido mientras se carga.'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['home', 'about', 'contact'],
      description: 'Tipo de esqueleto a mostrar'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = {
  args: {
    type: 'home'
  }
}

export const About: Story = {
  args: {
    type: 'about'
  }
}

export const Contact: Story = {
  args: {
    type: 'contact'
  }
}
