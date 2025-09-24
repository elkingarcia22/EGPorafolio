'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectHeadingProps {
  content: {
    text: string
    level?: number
    style?: string
    alignment?: 'left' | 'center' | 'right'
  }
}

export function ProjectHeading({ content }: ProjectHeadingProps) {
  const designTokens = useDesignTokens()
  const { text, level = 2, style = 'default', alignment = 'left' } = content

  const getHeadingClasses = () => {
    const baseClasses = 'font-bold text-gray-900 dark:text-white leading-tight'
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }

    const sizeClasses = {
      1: 'text-4xl md:text-5xl lg:text-6xl mb-8',
      2: 'text-3xl md:text-4xl lg:text-5xl mb-6',
      3: 'text-2xl md:text-3xl lg:text-4xl mb-4',
      4: 'text-xl md:text-2xl lg:text-3xl mb-4',
      5: 'text-lg md:text-xl lg:text-2xl mb-3',
      6: 'text-base md:text-lg lg:text-xl mb-3'
    }

    const styleClasses = {
      default: '',
      hero: 'text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8',
      gradient: 'bg-clip-text text-transparent',
      outline: 'text-transparent bg-clip-text'
    }

    return `${baseClasses} ${sizeClasses[level as keyof typeof sizeClasses] || sizeClasses[2]} ${alignmentClasses[alignment]} ${styleClasses[style as keyof typeof styleClasses] || styleClasses.default}`
  }

  const getHeadingStyle = () => {
    if (style === 'gradient') {
      return {
        background: designTokens.colors.primary.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }
    return {}
  }

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <HeadingTag 
      className={getHeadingClasses()}
      style={getHeadingStyle()}
    >
      {text}
    </HeadingTag>
  )
}