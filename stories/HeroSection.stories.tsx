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

export const WithGeometricBackground: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      {/* Simulamos el fondo geométrico con algunas formas simples */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 -top-48 -left-48 rounded-full bg-[#f0f0f3] dark:bg-[#0a0a0a] shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff] dark:shadow-[20px_20px_40px_#000000,-20px_-20px_40px_#1a1a1a]"></div>
        <div className="absolute w-64 h-64 -top-32 right-20 rounded-full bg-[#f0f0f3] dark:bg-[#0a0a0a] shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff] dark:shadow-[20px_20px_40px_#000000,-20px_-20px_40px_#1a1a1a]"></div>
        <div className="absolute w-80 h-80 -bottom-40 -left-40 rounded-[30px] bg-[#f0f0f3] dark:bg-[#0a0a0a] shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff] dark:shadow-[20px_20px_40px_#000000,-20px_-20px_40px_#1a1a1a]"></div>
      </div>
      <HeroSection />
    </div>
  ),
}
