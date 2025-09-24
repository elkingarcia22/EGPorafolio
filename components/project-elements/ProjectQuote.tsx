'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectQuoteProps {
  content: {
    text: string
    author?: string
    alignment?: 'left' | 'center' | 'right'
    style?: 'default' | 'large' | 'minimal'
  }
}

export function ProjectQuote({ content }: ProjectQuoteProps) {
  const designTokens = useDesignTokens()
  const { text, author, alignment = 'center', style = 'default' } = content

  const getAlignmentClasses = () => {
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
    return alignmentClasses[alignment]
  }

  const getStyleClasses = () => {
    const styleClasses = {
      default: 'text-lg md:text-xl italic text-gray-700 dark:text-gray-300',
      large: 'text-2xl md:text-3xl lg:text-4xl italic text-gray-800 dark:text-gray-200',
      minimal: 'text-base md:text-lg text-gray-600 dark:text-gray-400'
    }
    return styleClasses[style]
  }

  const getQuoteStyle = () => {
    if (style === 'large') {
      return {
        background: designTokens.colors.primary.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }
    return {}
  }

  return (
    <blockquote className={`${getAlignmentClasses()} ${getStyleClasses()}`}>
      <div className="relative">
        {/* Quote mark */}
        <div 
          className="absolute -top-4 -left-4 text-6xl opacity-20"
          style={{color: designTokens.colors.primary.gradient}}
        >
          "
        </div>
        
        <p className="relative z-10 leading-relaxed" style={getQuoteStyle()}>
          {text}
        </p>
        
        {/* Quote mark closing */}
        <div 
          className="absolute -bottom-4 -right-4 text-6xl opacity-20"
          style={{color: designTokens.colors.primary.gradient}}
        >
          "
        </div>
      </div>
      
      {author && (
        <footer className="mt-4">
          <cite className="text-sm text-gray-500 dark:text-gray-400 not-italic">
            — {author}
          </cite>
        </footer>
      )}
    </blockquote>
  )
}