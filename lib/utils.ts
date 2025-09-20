import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateRange(startDate: string | Date, endDate?: string | Date): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  
  const startFormatted = start.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short'
  })
  
  if (!end) {
    return `${startFormatted} - Presente`
  }
  
  const endFormatted = end.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short'
  })
  
  return `${startFormatted} - ${endFormatted}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
