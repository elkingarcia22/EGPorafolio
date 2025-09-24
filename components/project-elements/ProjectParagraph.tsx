'use client'

interface ProjectParagraphProps {
  content: {
    text: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    alignment?: 'left' | 'center' | 'right' | 'justify'
    color?: 'default' | 'muted' | 'accent'
  }
}

export function ProjectParagraph({ content }: ProjectParagraphProps) {
  const { text, size = 'md', alignment = 'left', color = 'default' } = content

  const getSizeClasses = () => {
    const sizeClasses = {
      sm: 'text-sm md:text-base',
      md: 'text-base md:text-lg',
      lg: 'text-lg md:text-xl',
      xl: 'text-xl md:text-2xl'
    }
    return sizeClasses[size]
  }

  const getAlignmentClasses = () => {
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify'
    }
    return alignmentClasses[alignment]
  }

  const getColorClasses = () => {
    const colorClasses = {
      default: 'text-gray-900 dark:text-white',
      muted: 'text-gray-600 dark:text-gray-400',
      accent: 'text-gray-700 dark:text-gray-300'
    }
    return colorClasses[color]
  }

  return (
    <p className={`${getSizeClasses()} ${getAlignmentClasses()} ${getColorClasses()} leading-relaxed mb-6`}>
      {text}
    </p>
  )
}