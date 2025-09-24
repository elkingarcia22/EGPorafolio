'use client'

interface ProjectSpacerProps {
  content: {
    height?: 'sm' | 'md' | 'lg' | 'xl' | 'custom'
    customHeight?: string
  }
}

export function ProjectSpacer({ content }: ProjectSpacerProps) {
  const { height = 'md', customHeight } = content

  const getHeightClasses = () => {
    if (height === 'custom' && customHeight) {
      return ''
    }

    const heightClasses = {
      sm: 'h-8',
      md: 'h-16',
      lg: 'h-24',
      xl: 'h-32'
    }
    return heightClasses[height as keyof typeof heightClasses]
  }

  const getCustomStyle = () => {
    if (height === 'custom' && customHeight) {
      return {
        height: customHeight
      }
    }
    return {}
  }

  return (
    <div 
      className={getHeightClasses()}
      style={getCustomStyle()}
    />
  )
}