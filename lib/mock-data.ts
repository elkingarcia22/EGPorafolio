/**
 * Datos mock para desarrollo cuando Supabase no está configurado
 */

export const mockData = {
  typewriterTexts: [
    { id: '1', text_content: 'Diseñador UX/UI senior specialist', order_index: 1 },
    { id: '2', text_content: 'Diseño de interacciones', order_index: 2 },
    { id: '3', text_content: 'Diseño de estrategias', order_index: 3 },
    { id: '4', text_content: 'Diseño inteligente IA', order_index: 4 }
  ],
  projects: [
    { 
      id: '1', 
      title: 'UX Research', 
      description: 'Investigación profunda de usuarios para crear experiencias excepcionales y centradas en el ser humano',
      order_index: 1 
    },
    { 
      id: '2', 
      title: 'UI Design', 
      description: 'Diseño de interfaces modernas, funcionales y visualmente impactantes que conectan con los usuarios',
      order_index: 2 
    },
    { 
      id: '3', 
      title: 'Estrategia Digital', 
      description: 'Desarrollo de estrategias digitales integrales que transforman marcas y productos',
      order_index: 3 
    },
    { 
      id: '4', 
      title: 'Diseño con IA', 
      description: 'Proyectos innovadores que combinan inteligencia artificial con diseño creativo',
      order_index: 4 
    }
  ],
  aboutInfo: [
    {
      id: '1',
      title: 'Acerca de mí',
      description: 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.'
    }
  ],
  contactInfo: [
    { id: '1', contact_type: 'whatsapp', label: 'WhatsApp', value: '+54 11 1234-5678', icon_name: 'whatsapp', order_index: 1 },
    { id: '2', contact_type: 'linkedin', label: 'LinkedIn', value: 'Conectar', icon_name: 'linkedin', order_index: 2 },
    { id: '3', contact_type: 'location', label: 'Ubicación', value: 'Buenos Aires, Argentina', icon_name: 'location', order_index: 3 }
  ],
  siteImages: []
}

export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'
}
