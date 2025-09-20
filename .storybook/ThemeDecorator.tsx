import React from 'react'

export const ThemeDecorator = (Story: any, context: any) => {
  const theme = context.globals.theme || 'light'
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Story />
    </div>
  )
}
