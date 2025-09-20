import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  email: string
  phone: string
  location: string
  linkedin_url?: string
  github_url?: string
  behance_url?: string
  avatar_url?: string
  cv_url?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  long_description?: string
  image_url: string
  technologies: string[]
  project_url?: string
  github_url?: string
  behance_url?: string
  featured: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  start_date: string
  end_date?: string
  current: boolean
  location: string
  order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  start_date: string
  end_date?: string
  current: boolean
  location: string
  order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: 'design' | 'development' | 'tools' | 'soft'
  level: number // 1-5
  order: number
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}
