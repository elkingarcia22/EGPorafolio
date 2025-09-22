import type { Meta, StoryObj } from '@storybook/react'
import { NeumorphicEGLogo } from '@/components/neumorphic-eg-logo'

const meta: Meta<typeof NeumorphicEGLogo> = {
  title: 'Components/NeumorphicEGLogo',
  component: NeumorphicEGLogo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <NeumorphicEGLogo />,
}

export const WithContent: Story = {
  render: () => (
    <div className="relative">
      <NeumorphicEGLogo />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Portafolio EG
          </h1>
          <p className="text-lg text-gray-600">
            Diseño UX/UI con estilo neumórfico
          </p>
        </div>
      </div>
    </div>
  ),
}

export const Compact: Story = {
  render: () => (
    <div className="h-96 flex items-center justify-center bg-[#f8f8f8]">
      <div className="flex items-center justify-center gap-8">
        {/* Letra E */}
        <div 
          className="relative"
          style={{
            width: '120px',
            height: '160px',
            background: '#f8f8f8',
            borderRadius: '16px',
            boxShadow: `
              inset 6px 6px 12px rgba(209, 217, 230, 0.6),
              inset -6px -6px 12px rgba(255, 255, 255, 0.7)
            `,
            position: 'relative'
          }}
        >
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
              clipPath: 'polygon(10% 10%, 90% 10%, 90% 20%, 30% 20%, 30% 45%, 70% 45%, 70% 55%, 30% 55%, 30% 80%, 90% 80%, 90% 90%, 10% 90%)',
              borderRadius: '12px'
            }}
          />
        </div>

        {/* Letra G */}
        <div 
          className="relative"
          style={{
            width: '120px',
            height: '160px',
            background: '#f8f8f8',
            borderRadius: '16px',
            boxShadow: `
              inset 6px 6px 12px rgba(209, 217, 230, 0.6),
              inset -6px -6px 12px rgba(255, 255, 255, 0.7)
            `,
            position: 'relative'
          }}
        >
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #26C6DA 0%, #66BB6A 50%, #4CAF50 100%)',
              clipPath: 'polygon(10% 10%, 90% 10%, 90% 20%, 30% 20%, 30% 45%, 60% 45%, 60% 55%, 30% 55%, 30% 80%, 90% 80%, 90% 90%, 10% 90%)',
              borderRadius: '12px'
            }}
          />
        </div>
      </div>
    </div>
  ),
}
