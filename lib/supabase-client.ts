import { createClient } from '@supabase/supabase-js'

// Supabase client - con valores por defecto para desarrollo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// En desarrollo, usar service role key para evitar problemas de RLS
const isDevelopment = process.env.NODE_ENV === 'development'
const supabaseKey = isDevelopment && process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY 
  ? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY 
  : supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: isDevelopment ? {
    autoRefreshToken: false,
    persistSession: false
  } : undefined
})

// Log para debugging
if (isDevelopment) {
  console.log('🔑 Supabase configurado con:', {
    url: supabaseUrl,
    keyType: supabaseKey === supabaseAnonKey ? 'ANON_KEY' : 'SERVICE_ROLE_KEY',
    isDevelopment
  })
}

// Verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
}

// Database service functions
export class DatabaseService {
  private supabaseClient: any

  constructor() {
    this.supabaseClient = supabase
  }

  // Profile operations
  async getProfile() {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  }

  async updateProfile(updates: any) {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .update(updates)
      .eq('id', updates.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Projects operations
  async getProjects() {
    const { data, error } = await this.supabaseClient
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  }

  async getFeaturedProjects() {
    const { data, error } = await this.supabaseClient
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  }

  async createProject(project: any) {
    const { data, error } = await this.supabaseClient
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateProject(id: string, updates: any) {
    const { data, error } = await this.supabaseClient
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteProject(id: string) {
    const { error } = await this.supabaseClient
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Experience operations
  async getExperience() {
    const { data, error } = await this.supabaseClient
      .from('experience')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  }

  async createExperience(experience: any) {
    const { data, error } = await this.supabaseClient
      .from('experience')
      .insert(experience)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateExperience(id: string, updates: any) {
    const { data, error } = await this.supabaseClient
      .from('experience')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteExperience(id: string) {
    const { error } = await this.supabaseClient
      .from('experience')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Education operations
  async getEducation() {
    const { data, error } = await this.supabaseClient
      .from('education')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  }

  async createEducation(education: any) {
    const { data, error } = await this.supabaseClient
      .from('education')
      .insert(education)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateEducation(id: string, updates: any) {
    const { data, error } = await this.supabaseClient
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteEducation(id: string) {
    const { error } = await this.supabaseClient
      .from('education')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Skills operations
  async getSkills() {
    const { data, error } = await this.supabaseClient
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  }

  async getSkillsByCategory(category: string) {
    const { data, error } = await this.supabaseClient
      .from('skills')
      .select('*')
      .eq('category', category)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  }

  async createSkill(skill: any) {
    const { data, error } = await this.supabaseClient
      .from('skills')
      .insert(skill)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateSkill(id: string, updates: any) {
    const { data, error } = await this.supabaseClient
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteSkill(id: string) {
    const { error } = await this.supabaseClient
      .from('skills')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Contact messages operations
  async getContactMessages() {
    const { data, error } = await this.supabaseClient
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async createContactMessage(message: any) {
    const { data, error } = await this.supabaseClient
      .from('contact_messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async markMessageAsRead(id: string) {
    const { data, error } = await this.supabaseClient
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Admin operations
  async getAdminUser(email: string) {
    const { data, error } = await this.supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  }

  async createAdminUser(user: any) {
    const { data, error } = await this.supabaseClient
      .from('admin_users')
      .insert(user)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
