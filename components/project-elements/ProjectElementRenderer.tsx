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
  element_type: 'heading' | 'paragraph' | 'image' | 'video' | 'link' | 'button' | 'quote' | 'list' | 'divider' | 'spacer' | 'embed' | 'code'
  content: any
  order_index: number
  width: 'full' | 'half' | 'third' | 'two-thirds' | 'quarter'
  alignment: 'left' | 'center' | 'right'
  styling?: any
  is_visible: boolean
}

interface ProjectElementRendererProps {
  element: ProjectElement
  className?: string
}

export function ProjectElementRenderer({ element, className = '' }: ProjectElementRendererProps) {
  if (!element.is_visible) {
    return null
  }

  const widthClasses = {
    full: 'w-full',
    half: 'w-full md:w-1/2',
    third: 'w-full md:w-1/3',
    'two-thirds': 'w-full md:w-2/3',
    quarter: 'w-full md:w-1/4'
  }

  const baseClasses = `${widthClasses[element.width]} ${className}`

  switch (element.element_type) {
    case 'heading':
      return (
        <div className={baseClasses}>
          <ProjectHeading
            level={element.content.level || 2}
            text={element.content.text}
            alignment={element.alignment}
            styling={element.styling}
          />
        </div>
      )

    case 'paragraph':
      return (
        <div className={baseClasses}>
          <ProjectParagraph
            text={element.content.text}
            alignment={element.alignment}
            styling={element.styling}
          />
        </div>
      )

    case 'image':
      return (
        <div className={baseClasses}>
          <ProjectImage
            src={element.content.src}
            alt={element.content.alt}
            caption={element.content.caption}
            width={element.content.width}
            height={element.content.height}
            alignment={element.alignment}
            styling={element.styling}
            priority={element.content.priority}
          />
        </div>
      )

    case 'video':
      return (
        <div className={baseClasses}>
          <ProjectVideo
            src={element.content.src}
            thumbnail={element.content.thumbnail}
            title={element.content.title}
            platform={element.content.platform}
            embedCode={element.content.embedCode}
            alignment={element.alignment}
            styling={element.styling}
          />
        </div>
      )

    case 'button':
      return (
        <div className={baseClasses}>
          <ProjectButton
            text={element.content.text}
            href={element.content.href}
            onClick={element.content.onClick}
            variant={element.content.variant}
            size={element.content.size}
            alignment={element.alignment}
            styling={element.styling}
            disabled={element.content.disabled}
          />
        </div>
      )

    case 'quote':
      return (
        <div className={baseClasses}>
          <ProjectQuote
            text={element.content.text}
            author={element.content.author}
            alignment={element.alignment}
            styling={element.styling}
          />
        </div>
      )

    case 'spacer':
      return (
        <div className={baseClasses}>
          <ProjectSpacer
            height={element.content.height}
            styling={element.styling}
          />
        </div>
      )

    case 'divider':
      return (
        <div className={baseClasses}>
          <ProjectDivider
            alignment={element.alignment}
            styling={element.styling}
          />
        </div>
      )

    case 'list':
      return (
        <div className={baseClasses}>
          <div className={`text-${element.alignment}`}>
            <ul className="space-y-2">
              {element.content.items?.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )

    case 'embed':
      return (
        <div className={baseClasses}>
          <div 
            className="w-full"
            dangerouslySetInnerHTML={{ __html: element.content.html }}
          />
        </div>
      )

    case 'code':
      return (
        <div className={baseClasses}>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{element.content.code}</code>
          </pre>
        </div>
      )

    default:
      console.warn(`Tipo de elemento no soportado: ${element.element_type}`)
      return null
  }
}
