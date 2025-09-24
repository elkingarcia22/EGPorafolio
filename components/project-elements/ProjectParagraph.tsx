'use client'

interface ProjectParagraphProps {
  text: string
  alignment?: 'left' | 'center' | 'right'
  styling?: {
    fontSize?: string
    fontWeight?: string
    color?: string
    lineHeight?: string
    marginTop?: string
    marginBottom?: string
  }
  className?: string
}

export function ProjectParagraph({ 
  text, 
  alignment = 'left', 
  styling = {},
  className = ''
}: ProjectParagraphProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const customStyles = {
    ...(styling.fontSize && { fontSize: styling.fontSize }),
    ...(styling.color && { color: styling.color }),
    ...(styling.lineHeight && { lineHeight: styling.lineHeight }),
    ...(styling.marginTop && { marginTop: styling.marginTop }),
    ...(styling.marginBottom && { marginBottom: styling.marginBottom })
  }
  
  const fontWeightClass = styling.fontWeight 
    ? weightClasses[styling.fontWeight as keyof typeof weightClasses] || 'font-normal'
    : 'font-normal'
  
  return (
    <p 
      className={`
        ${alignmentClasses[alignment]}
        ${fontWeightClass}
        text-gray-700 dark:text-gray-300
        leading-relaxed
        ${className}
      `}
      style={customStyles}
    >
      {text}
    </p>
  )
}
