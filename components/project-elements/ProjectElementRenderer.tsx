'use client'

import { ProjectHeading } from './ProjectHeading'
import { ProjectParagraph } from './ProjectParagraph'
import { ProjectImage } from './ProjectImage'
import { ProjectVideo } from './ProjectVideo'
import { ProjectButton } from './ProjectButton'
import { ProjectQuote } from './ProjectQuote'
import { ProjectSpacer } from './ProjectSpacer'
import { ProjectDivider } from './ProjectDivider'

interface ProjectElement {
  id: string
  section_id: string
  type: string
  content: any
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ProjectElementRendererProps {
  element: ProjectElement
}

export function ProjectElementRenderer({ element }: ProjectElementRendererProps) {
  switch (element.type) {
    case 'heading':
      return <ProjectHeading content={element.content} />
    
    case 'paragraph':
      return <ProjectParagraph content={element.content} />
    
    case 'image':
      return <ProjectImage content={element.content} />
    
    case 'video':
      return <ProjectVideo content={element.content} />
    
    case 'button':
      return <ProjectButton content={element.content} />
    
    case 'quote':
      return <ProjectQuote content={element.content} />
    
    case 'spacer':
      return <ProjectSpacer content={element.content} />
    
    case 'divider':
      return <ProjectDivider content={element.content} />
    
    default:
      console.warn(`Tipo de elemento no reconocido: ${element.type}`)
      return null
  }
}