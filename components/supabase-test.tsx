'use client'

import React, { useState, useEffect } from 'react'
import { useSupabase } from '@/hooks/useSupabase'

export const SupabaseTest: React.FC = () => {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .single()

        if (error) {
          setError(error.message)
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError('Error inesperado')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  if (loading) {
    return (
      <div className="neo-card p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos de Supabase...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="neo-card p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌ Error</div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="neo-card p-6">
      <div className="text-center">
        <div className="text-green-500 mb-4">✅ Conexión exitosa</div>
        <h3 className="text-xl font-bold mb-2">{profile?.name}</h3>
        <p className="text-muted-foreground mb-2">{profile?.title}</p>
        <p className="text-sm text-muted-foreground">{profile?.email}</p>
      </div>
    </div>
  )
}
