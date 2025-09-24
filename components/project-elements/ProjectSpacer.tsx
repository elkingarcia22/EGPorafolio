'use client'

interface ProjectSpacerProps {
  height?: number
  styling?: {
    backgroundColor?: string
    marginTop?: string
    marginBottom?: string
  }
  className?: string
}

export function ProjectSpacer({ 
  height = 40,
  styling = {},
  className = ''
}: ProjectSpacerProps) {
  const customStyles = {
    height: `${height}px`,
    ...(styling.backgroundColor && { backgroundColor: styling.backgroundColor }),
    ...(styling.marginTop && { marginTop: styling.marginTop }),
    ...(styling.marginBottom && { marginBottom: styling.marginBottom })
  }
  
  return (
    <div 
      className={`w-full ${className}`}
      style={customStyles}
    />
  )
}
