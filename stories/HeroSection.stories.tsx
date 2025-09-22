import type { Meta, StoryObj } from '@storybook/react'
import { HeroSection } from '@/components/hero-section'

const meta: Meta<typeof HeroSection> = {
  title: 'Components/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      <HeroSection />
    </div>
  ),
}


export const TextAnimationDemo: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl typography-hero-name leading-tight tracking-tight hover-gradient-fill-unified whitespace-nowrap mb-8">
          Elkin Garcia
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Animación de una sola vez: Contorno → Gris (izq→der) → Degradado IA (izq→der) → Permanente
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          Duración: 6 segundos | Una sola ejecución | Se mantiene en degradado azul permanentemente
        </p>
        <div className="mt-8 space-y-2">
          <button 
            onClick={() => {
              const element = document.querySelector('.hover-gradient-fill-unified');
              if (element) {
                element.style.animation = 'none';
                element.offsetHeight; // Trigger reflow
                element.style.animation = 'name-fill-unified-fluid 6s ease-in-out forwards';
              }
            }}
                className="px-4 py-2 blue-gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Reiniciar Animación
          </button>
        </div>
      </div>
    </div>
  ),
}
