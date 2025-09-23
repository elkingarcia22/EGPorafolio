const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const aboutData = [
  // Información Principal
  {
    title: 'Del output al outcome: diseño que entrega resultados reales.',
    description: 'Senior Product & UX/UI Designer con más de 10 años de experiencia liderando proyectos digitales de principio a fin. Trabajo de manera estratégica y planificada, combinando investigación, diseño visual y sistemas de diseño para asegurar consistencia, escalabilidad y eficiencia. Complemento mi trabajo con herramientas de IA que me permiten acelerar la ideación y validación, logrando productos más robustos y efectivos.',
    section: 'main',
    language: 'es',
    order_index: 1,
    is_active: true
  },
  {
    title: 'From output to outcome: design that delivers real results.',
    description: 'Senior Product & UX/UI Designer with over 10 years of experience leading digital projects from start to finish. I work strategically and methodically, combining research, visual design and design systems to ensure consistency, scalability and efficiency. I complement my work with AI tools that allow me to accelerate ideation and validation, achieving more robust and effective products.',
    section: 'main',
    language: 'en',
    order_index: 1,
    is_active: true
  },
  // Experiencia
  {
    title: '10+ años en UX/UI & Product Design',
    description: 'Especialización en productos digitales',
    section: 'experience',
    language: 'es',
    order_index: 1,
    is_active: true
  },
  {
    title: '10+ years in UX/UI & Product Design',
    description: 'Specialization in digital products',
    section: 'experience',
    language: 'en',
    order_index: 1,
    is_active: true
  },
  {
    title: '15+ proyectos completados',
    description: 'Desde startups hasta empresas',
    section: 'experience',
    language: 'es',
    order_index: 2,
    is_active: true
  },
  {
    title: '15+ completed projects',
    description: 'From startups to enterprises',
    section: 'experience',
    language: 'en',
    order_index: 2,
    is_active: true
  },
  {
    title: 'Sistemas Estratégicos',
    description: 'Escalables y consistentes',
    section: 'experience',
    language: 'es',
    order_index: 3,
    is_active: true
  },
  {
    title: 'Strategic Systems',
    description: 'Scalable & consistent',
    section: 'experience',
    language: 'en',
    order_index: 3,
    is_active: true
  },
  // Especialidades
  {
    title: 'Research & Strategy',
    description: 'Insights, outcomes',
    section: 'specialties',
    language: 'es',
    order_index: 1,
    is_active: true
  },
  {
    title: 'Research & Strategy',
    description: 'Insights, outcomes',
    section: 'specialties',
    language: 'en',
    order_index: 1,
    is_active: true
  },
  {
    title: 'Interaction Design',
    description: 'Micro-experiences, usability',
    section: 'specialties',
    language: 'es',
    order_index: 2,
    is_active: true
  },
  {
    title: 'Interaction Design',
    description: 'Micro-experiences, usability',
    section: 'specialties',
    language: 'en',
    order_index: 2,
    is_active: true
  },
  {
    title: 'AI-Enhanced Design',
    description: 'Optimization, agility',
    section: 'specialties',
    language: 'es',
    order_index: 3,
    is_active: true
  },
  {
    title: 'AI-Enhanced Design',
    description: 'Optimization, agility',
    section: 'specialties',
    language: 'en',
    order_index: 3,
    is_active: true
  },
  // Foto de Perfil
  {
    title: 'Foto de Perfil',
    description: '',
    section: 'photo',
    language: 'es',
    order_index: 1,
    profile_image_url: '',
    is_active: true
  },
  {
    title: 'Profile Photo',
    description: '',
    section: 'photo',
    language: 'en',
    order_index: 1,
    profile_image_url: '',
    is_active: true
  }
]

async function insertAboutData() {
  try {
    console.log('🚀 Insertando datos de "Acerca de mí"...')
    
    // Primero, desactivar todos los registros existentes
    console.log('🔄 Desactivando registros existentes...')
    const { error: deactivateError } = await supabase
      .from('about_info')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Actualizar todos
    
    if (deactivateError) {
      console.warn('⚠️ No se pudieron desactivar registros existentes:', deactivateError.message)
    } else {
      console.log('✅ Registros existentes desactivados')
    }
    
    // Insertar nuevos datos
    console.log('📝 Insertando nuevos datos...')
    const { data, error } = await supabase
      .from('about_info')
      .insert(aboutData)
    
    if (error) {
      console.error('❌ Error insertando datos:', error)
      throw error
    }
    
    console.log('✅ Datos de "Acerca de mí" insertados exitosamente')
    console.log(`📊 Total de registros insertados: ${aboutData.length}`)
    
    // Verificar que se insertaron correctamente
    const { data: verifyData, error: verifyError } = await supabase
      .from('about_info')
      .select('*')
      .eq('is_active', true)
      .order('section, language, order_index')
    
    if (verifyError) {
      console.error('❌ Error verificando datos:', verifyError)
    } else {
      console.log('🔍 Verificación exitosa:')
      console.log(`📋 Registros activos: ${verifyData.length}`)
      
      // Mostrar resumen por sección
      const sections = ['main', 'experience', 'specialties', 'photo']
      sections.forEach(section => {
        const sectionData = verifyData.filter(item => item.section === section)
        console.log(`  - ${section}: ${sectionData.length} registros`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  }
}

insertAboutData()
