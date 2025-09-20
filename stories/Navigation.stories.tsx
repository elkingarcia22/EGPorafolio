import type { Meta, StoryObj } from '@storybook/react'
import { Navigation } from '@/components/navigation'

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="bg-[#f0f0f3] dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300">
      <Navigation />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
          Portfolio UX/UI Designer
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Esta es una página de ejemplo para mostrar cómo se ve la navegación neomorfismo.
          Prueba cambiar entre modo claro y oscuro usando el botón del tema.
        </p>
      </div>
    </div>
  ),
}
