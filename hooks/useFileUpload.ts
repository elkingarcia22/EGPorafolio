import { useState } from 'react'
import { useSupabase } from './useSupabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const supabase = useSupabase()

  const uploadFile = async (
    file: File, 
    bucket: string = 'cv-documents',
    folder: string = 'cv'
  ): Promise<UploadResult> => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading file:', error)
        return {
          success: false,
          error: error.message
        }
      }

      // Obtener URL pública del archivo
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setUploadProgress(100)

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteFile = async (filePath: string, bucket: string = 'cv-documents'): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        console.error('Error deleting file:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }

  const createBucket = async (bucketName: string = 'cv-documents'): Promise<boolean> => {
    try {
      // Verificar si el bucket ya existe
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        return false
      }

      const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
      
      if (bucketExists) {
        return true
      }

      // Crear el bucket si no existe
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (createError) {
        console.error('Error creating bucket:', createError)
        return false
      }

      return true
    } catch (error) {
      console.error('Error creating bucket:', error)
      return false
    }
  }

  return {
    uploadFile,
    deleteFile,
    createBucket,
    isUploading,
    uploadProgress
  }
}
